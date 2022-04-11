from rest_framework import serializers
from resume.models.profile import Profile
from core.models.users import User
from core.models.tenant import Tenant
from core.models.partner_setting import PartnerSetting
from core.models.location import Location
from cloudinary.templatetags import cloudinary
import cloudinary.uploader
from directsourcing.settings import CLOUDINARY_STORAGE
import random
from directsourcing.settings import MEDIA_ROOT


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerSetting
        fields = ("department", "job_title")


class AccountDetailsSerializer(serializers.ModelSerializer):
    role_name = serializers.ReadOnlyField(source="get_role_name")

    class Meta:
        model = User
        fields = (
            "id",
            "title",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "user_image",
            "role_id",
            "city",
            "area_code",
            "role_name",
            "locale",
            "daily_jobs_summary",
            "weekely_jobs_summary",
        )


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ("id", "name", "key", "b_address", "logo_url", "logo_image")


class SocialProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("id", "facebook_link", "linkedin_link", "twitter_link")


def upload_image_cloudinary(request, image_name, image_url, format):
    res = cloudinary.uploader.upload(
        file=str(image_url),
        public_id=image_name,
        tags=["image_ad", "NAPI"],
        api_key=CLOUDINARY_STORAGE["API_KEY"],
        api_secret=CLOUDINARY_STORAGE["API_SECRET"],
        cloud_name=CLOUDINARY_STORAGE["CLOUD_NAME"],
    )

    return res["url"]


def logo_upload(request, tenant):
    file1 = request.FILES.get("organization.image", None)
    if file1:
        tenant.logo_image = file1
        tenant.save()
        tenant.logo_url = upload_image_cloudinary(
            request=request,
            image_url=str(MEDIA_ROOT) + str(tenant.logo_image),
            image_name="image_{}".format(random.randint(1, 10000)),
            format=format,
        )
        tenant.save()
    else:
        pass


class PartnerSettingUpdateSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer()
    social_profile = SocialProfileSerializer()
    designation = DesignationSerializer()

    class Meta:
        model = User
        fields = (
            "id",
            "title",
            "first_name",
            "last_name",
            "phone",
            "organization",
            "social_profile",
            "designation",
            "city",
            "area_code",
            "locale",
            "daily_jobs_summary",
            "weekely_jobs_summary",
        )

    def update(self, instance, validated_data):
        organization_data = validated_data.pop("organization", None)
        social_profile_data = validated_data.pop("social_profile", None)
        designation_data = validated_data.pop("designation", None)

        instance.title = validated_data.get("title", instance.title)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.city = validated_data.get("city", instance.city)
        instance.area_code = validated_data.get("area_code", instance.area_code)
        instance.locale = validated_data.get("locale", instance.locale)
        instance.daily_jobs_summary = validated_data.get(
            "daily_jobs_summary", instance.daily_jobs_summary
        )
        instance.weekely_jobs_summary = validated_data.get(
            "weekely_jobs_summary", instance.weekely_jobs_summary
        )
        # data = self.context["request"].data
        # location_obj, _ = Location.objects.update_or_create(city=data["city"])
        # location_obj.save()
        # instance.location = location_obj
        instance.save()

        request = self.context["request"]
        if organization_data:
            tenant_obj = self.context["tenant"]
            name = organization_data.get("name", tenant_obj.name)
            b_address = organization_data.get("b_address", tenant_obj.b_address)

            tenant_obj.name = name
            tenant_obj.b_address = b_address
            logo_upload(request, tenant_obj)
            tenant_obj.save()

        if social_profile_data:
            profile_obj = self.context["profile"]
            facebook = social_profile_data.get("facebook_link", profile_obj.facebook_link)
            linkedin = social_profile_data.get("linkedin_link", profile_obj.linkedin_link)
            twitter = social_profile_data.get("twitter_link", profile_obj.twitter_link)
            profile_obj.facebook_link = facebook
            profile_obj.linkedin_link = linkedin
            profile_obj.twitter_link = twitter
            profile_obj.save()

        if designation_data:
            partner_setting_obj = self.context["partner_setting_obj"]
            department = designation_data.get("department", partner_setting_obj.department)
            job_title = designation_data.get("job_title", partner_setting_obj.job_title)
            partner_setting_obj.department = department
            partner_setting_obj.job_title = job_title
            partner_setting_obj.save()

        return instance


class BillingDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = (
            "id",
            "b_title",
            "b_first_name",
            "b_last_name",
            "b_phone",
            "b_phone_sec",
            "b_email",
            "b_address",
            "billing",
        )


class UserOnboardingSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "phone", "city", "state", "country", "area_code")


class OnboardingGetSerializer(serializers.ModelSerializer):
    tenant_id = serializers.CharField(source="tenant.id", read_only=True)
    name = serializers.CharField(source="tenant.name", read_only=True)
    b_title = serializers.CharField(source="tenant.b_title", read_only=True)
    b_first_name = serializers.CharField(source="tenant.b_first_name", read_only=True)
    b_last_name = serializers.CharField(source="tenant.b_last_name", read_only=True)
    b_phone = serializers.CharField(source="tenant.b_phone", read_only=True)
    b_phone_sec = serializers.CharField(source="tenant.b_phone_sec", read_only=True)
    b_email = serializers.CharField(source="tenant.b_email", read_only=True)
    b_address = serializers.CharField(source="tenant.b_address", read_only=True)
    logo_url = serializers.CharField(source="tenant.logo_url", read_only=True)
    b_area_code = serializers.CharField(source="tenant.b_area_code", read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "phone",
            "city",
            "state",
            "country",
            "area_code",
            "tenant_id",
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


class CompanyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ("name", "logo_url", "logo_image")


class SkillingPartnerSettingSerializer(serializers.ModelSerializer):
    email = serializers.CharField(read_only=True)
    tenant = CompanyDetailsSerializer(required=False)

    class Meta:
        model = User
        fields = (
            "email",
            "city",
            "state",
            "country",
            "latitude",
            "longitude",
            "place_id",
            "tenant",
        )

    def update(self, instance, validated_data):
        company_details = validated_data.pop("tenant", None)
        instance.city = validated_data.get("city", instance.city)
        instance.state = validated_data.get("state", instance.state)
        instance.country = validated_data.get("country", instance.country)
        instance.latitude = validated_data.get("latitude", instance.latitude)
        instance.longitude = validated_data.get("longitude", instance.longitude)
        instance.place_id = validated_data.get("place_id", instance.place_id)
        instance.save()

        tenant = self.context["tenant"]
        if company_details:
            tenant.name = company_details.get("name", tenant.name)
            tenant.save()
        return instance
