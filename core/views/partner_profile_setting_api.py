from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from core.helpers import api_response, compile_email
from core.models.users import User
from core.models.tenant import Tenant
from resume.models.profile import Profile
from core.models.partner_setting import PartnerSetting
from job.models.job_category import Category
from core.serializers.partner_setting_serializers import (
    PartnerSettingUpdateSerializer,
    AccountDetailsSerializer,
    OrganizationSerializer,
    SocialProfileSerializer,
    DesignationSerializer,
    BillingDetailsSerializer,
    UserOnboardingSerializer,
    OnboardingGetSerializer,
    SkillingPartnerSettingSerializer,
)
from recruiter.serializers.recruiter_serializers import CategorySerializer
from core.get_tenant import get_user_tenant
from cloudinary.templatetags import cloudinary
import cloudinary.uploader
from directsourcing.settings import CLOUDINARY_STORAGE
import random
from directsourcing.settings import MEDIA_ROOT
from rest_framework.parsers import MultiPartParser, FormParser
from resume.views.profile_api import upload_image_cloudinary
import os
from directsourcing.settings import MEDIA_ROOT


class TenantKeyGetView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):

        """
        Get tenant key
        """
        tenant = get_user_tenant(request)
        tenant_key = tenant.key
        return api_response(200, "tenant key details", {"tenant_key": tenant_key})


class PartnerProfileSettingView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):

        """
        Get profile setting details for Recruiter or Hiring Manager
        """
        tenant = get_user_tenant(request)
        lang = request.GET.get("lang", "en")
        context = {"lang": lang}
        try:
            user_obj = User.objects.get(id=request.user.id, tenant=tenant)
        except User.DoesNotExist:
            return api_response(404, "User Not found", {})
        try:
            profile_obj = Profile.objects.get(user=user_obj)
        except Profile.DoesNotExist:
            return api_response(404, "Profile not found", {})
        try:
            partner_setting_obj, _ = PartnerSetting.objects.get_or_create(user=user_obj)
        except PartnerSetting.DoesNotExist:
            return api_response(404, "settings not found", {})
        account_serializer = AccountDetailsSerializer(user_obj)
        org_serializer = OrganizationSerializer(tenant)
        social_serializer = SocialProfileSerializer(profile_obj)
        designation_serializer = DesignationSerializer(partner_setting_obj)

        # list of departments
        categories = Category.objects.all().values("id", "name")
        category_serializer = CategorySerializer(categories, context=context, many=True)

        setting_dict = {}
        setting_dict["account"] = account_serializer.data
        setting_dict["organization"] = org_serializer.data
        setting_dict["social_profile_links"] = social_serializer.data
        setting_dict["designation_details"] = designation_serializer.data
        setting_dict["departments_list"] = category_serializer.data

        return api_response(200, "Profile details fetched successfully", setting_dict)

    def put(self, request, *args, **kwargs):

        """
        Update profile settings for recruiter or hiring manager
        """
        tenant = get_user_tenant(request)
        data = request.data

        try:
            user_obj = User.objects.filter(id=request.user.id, tenant=tenant).first()
        except User.DoesNotExist:
            return api_response(404, "User Does Not Exist", {})
        try:
            profile_obj = Profile.objects.get(user=user_obj, tenant=tenant)
        except Profile.DoesNotExist:
            return api_response(404, "profile not found", {})

        try:
            partner_setting_obj = PartnerSetting.objects.get(user=user_obj, tenant=tenant)
        except PartnerSetting.DoesNotExist:
            return api_response(404, "settings not found", {})

        context = {
            "request": request,
            "tenant": tenant,
            "user_obj": user_obj,
            "profile": profile_obj,
            "partner_setting_obj": partner_setting_obj,
        }
        if user_obj.id == request.user.id:
            serializer = PartnerSettingUpdateSerializer(user_obj, data, context=context)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return api_response(200, "Updated", {})
        else:
            return api_response(403, "Not authorized", {})


class PartnerBillingProfileSettingView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):

        """
        Get profile setting details for Recruiter or Hiring Manager
        """
        tenant = get_user_tenant(request)
        billing_serializer = BillingDetailsSerializer(tenant)
        return api_response(200, "Billing details fetched successfully", billing_serializer.data)

    def put(self, request):
        tenant = get_user_tenant(request)
        serializer = BillingDetailsSerializer(tenant, request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(billing=True)
            return api_response(200, "Billing details updated successfully", serializer.data)
        else:
            return api_response(400, "Incorrect data", serializer.errors)


def upload_logo_cloudinary(request, image_name, image_url, format):
    res = cloudinary.uploader.upload(
        file=str(image_url),
        public_id=image_name,
        tags=["image_ad", "NAPI"],
        api_key=CLOUDINARY_STORAGE["API_KEY"],
        api_secret=CLOUDINARY_STORAGE["API_SECRET"],
        cloud_name=CLOUDINARY_STORAGE["CLOUD_NAME"],
    )

    return res["url"]


class OnboardingBillingView(APIView):
    permission_classes = (IsAdminUser,)

    def put(self, request, *args, **kwargs):

        """
        Update Onboarding for hiring manager
        """
        tenant = get_user_tenant(request)
        data = request.data
        file1 = request.FILES.get("image", None)
        if file1:
            try:
                tenant = Tenant.objects.get(id=tenant.id)
                tenant.logo_image = file1
                tenant.save()
            except Tenant.DoesNotExist:
                return api_response(404, "Page not found", {})
            tenant.logo_url = upload_logo_cloudinary(
                request=request,
                image_url=str(MEDIA_ROOT) + str(tenant.logo_image),
                image_name="image_{}".format(random.randint(1, 10000)),
                format=format,
            )
            tenant.save()
        else:
            pass
        obj = None
        try:
            obj = Tenant.objects.get(id=tenant.id)
        except Tenant.DoesNotExist:
            return api_response(404, "Page not found", {})
        if obj.billing is False:
            send_mail = True
        else:
            send_mail = False

        obj.b_title = request.data.get("b_title")
        obj.name = request.data.get("name")
        obj.b_first_name = request.data.get("b_first_name")
        obj.b_last_name = request.data.get("b_last_name")
        obj.b_phone = request.data.get("b_phone")
        obj.b_phone_sec = request.data.get("b_phone_sec")
        obj.b_email = request.data.get("b_email")
        obj.b_address = request.data.get("b_address")
        obj.b_area_code = request.data.get("b_area_code")
        obj.billing = True
        obj.save()
        data = {"image_url": tenant.logo_url}
        data.update(
            {
                "email": request.data.get("email"),
                "city": request.data.get("city"),
                "state": request.data.get("state"),
                "country": request.data.get("country"),
                "phone": request.data.get("phone"),
                "area_code": request.data.get("area_code"),
            }
        )
        try:
            user_obj = User.objects.filter(id=request.user.id, tenant=tenant).first()
        except User.DoesNotExist:
            return api_response(404, "User does not exist", {})
        context = {
            "request": request,
            "tenant": tenant,
            "user_obj": user_obj,
        }
        if user_obj.id == request.user.id:
            serializer = UserOnboardingSerializer(user_obj, data, context=context)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
        else:
            return api_response(403, "Not authorized", {})
        address = str(request.user.tenant.b_address) + " " + str(user_obj.city)
        if send_mail:
            compile_email(
                "onboarding.internal",
                request,
                request.user,
                data={
                    "email": request.user.email,
                    "company": request.user.tenant.name.title(),
                    "address": address,
                    "phone": request.user.phone,
                    "phone_alt": request.user.phone,
                    "b_firstname": request.user.tenant.b_first_name,
                    "last": request.user.tenant.b_last_name,
                    "b_phone": request.user.tenant.b_phone,
                    "b_phone_alt": request.user.tenant.b_phone_sec,
                    "b_email": request.user.tenant.b_email,
                },
            )
            billing_name = request.user.tenant.b_first_name + " " + request.user.tenant.b_last_name
            compile_email(
                "onboarding.external",
                request,
                request.user,
                data={
                    "email": request.user.email,
                    "company": request.user.tenant.name.title(),
                    "phone": request.user.phone,
                    "first_name": request.user.first_name.title(),
                    "last_name": request.user.last_name.title(),
                    "to_email": request.user.tenant.b_email,
                    "candidate_name": billing_name,
                },
                toemail=True,
            )
        return api_response(200, "Onboarding data updated successfully", {})


class GetOnboardDetailsView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        tenant = get_user_tenant(request)
        onboard = User.objects.filter(id=request.user.id)
        user_objects = User.objects.filter(tenant=tenant).values("id", "email", "phone", "city", "area_code")
        tenant_objects = Tenant.objects.all().values(
            "id",
            "name",
            "b_title",
            "b_first_name",
            "b_last_name",
            "b_phone",
            "b_phone_sec",
            "b_email",
            "b_address",
            "logo_url",
            "b_area_code",
        )
        context = {"user_objects": user_objects, "tenant_objects": tenant_objects}
        if onboard:
            serializer = OnboardingGetSerializer(onboard, context=context, many=True)
            return api_response(200, "Onboarding details fetched successfully", serializer.data)
        else:
            return api_response(400, "Data not found", {})


class OnboardLogoAPI(APIView):
    """
    Updatating the logo.
    """

    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (IsAdminUser,)

    def put(self, request):
        tenant = get_user_tenant(request)
        file1 = request.FILES.get("image", None)
        try:
            tenant_obj = Tenant.objects.get(id=tenant.id)
            tenant_obj.logo_image = file1
            tenant_obj.save()
        except Tenant.DoesNotExist:
            return api_response(404, "Page not found", {})

        cropx = request.data["cropx"]
        cropy = request.data["cropy"]
        width = request.data["width"]
        height = request.data["height"]
        obj = None
        try:
            obj = Tenant.objects.get(id=tenant.id)
        except Tenant.DoesNotExist:
            return api_response(404, "Page not found", {})

        try:
            obj.logo_url = upload_image_cloudinary(
                request=request,
                image_url=str(MEDIA_ROOT) + str(tenant_obj.logo_image),
                image_name="image_{}".format(random.randint(1, 10000)),
                cropx=cropx,
                cropy=cropy,
                width=width,
                height=height,
                format=format,
                radius=None,
            )
            obj.save()
            data = {"image_url": obj.logo_url}
            return api_response(200, "logo Updated Succesfully", data=data)
        except Exception as e:
            return api_response(400, "file doesn't exists.", "Exception [{}]".format(e))

    def delete(self, request):
        tenant = get_user_tenant(request)
        try:
            tenant_obj = Tenant.objects.get(id=tenant.id)
            tenant_obj.logo_image = None
            tenant_obj.logo_url = None
            tenant_obj.save()
            return api_response(200, "logo deleted succesfully", {})
        except Tenant.DoesNotExist:
            return api_response(404, "Page not found", {})


class SkillingPartnerSettingView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            user = User.objects.get(id=request.user.id)
        except User.DoesNotExist:
            return api_response(404, "User not found.", {})
        serializer = SkillingPartnerSettingSerializer(user)
        return api_response(200, "Details fetched successfully.", serializer.data)

    def put(self, request):
        tenant = get_user_tenant(request)
        data = request.data
        try:
            user = User.objects.get(id=request.user.id)
        except User.DoesNotExist:
            return api_response(404, "User not found.", {})
        context = {"tenant": tenant, "request": request}
        serializer = SkillingPartnerSettingSerializer(user, data, context=context)
        if serializer.is_valid():
            serializer.save()
            return api_response(200, "Updated.", serializer.data)
        else:
            return api_response(400, "Invalid data.", serializer.errors)
