from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from core.helpers import api_response
from core.models.users import User
from core.serializers.profile_setting_serializers import (
    AccountSettingSerializer,
    JobPreferenceSerializer,
    NotificationSettingSerializer,
    IndustrySettingSerializer,
    IndustryPreferenceSerializer,
    JobPreferenceGetSerializer,
    # BlockedCompanySerializer,
)
from core.models.profile_setting import ProfileSetting
from resume.models.user_preferences import IndustryPreference, BlockedCompany
from core.models.tenant import Tenant
from resume.permissions import IsProfileOwnerOnly
from job.models.job_industry import Industry
from job.models.job_company import JobCompany
from core.get_tenant import get_user_tenant


class ProfileSettingView(APIView):

    permission_classes = (IsAuthenticated, IsProfileOwnerOnly)

    def get(self, request, *args, **kwargs):

        """
        Get profile setting details for user login
        """
        tenant = get_user_tenant(request)
        try:
            user_obj = User.objects.get(id=request.user.id, tenant=tenant)
        except User.DoesNotExist:
            return api_response(404, "User is Not found", {})
        try:
            profile_setting = ProfileSetting.objects.get(user=request.user, tenant=tenant)
        except ProfileSetting.DoesNotExist:
            return api_response(404, "Profile setting is Not found", {})
        account_serializer = AccountSettingSerializer(user_obj)
        notification_serializer = NotificationSettingSerializer(profile_setting)
        job_preferences_serializer = JobPreferenceGetSerializer(profile_setting)

        # companies = JobCompany.objects.all().values("id", "name")
        industry_preferences_obj = list(
            IndustryPreference.objects.filter(user_id=request.user.id).values(
                "id", "user", "industry_slug__id", "industry_slug__name"
            )
        )
        # block_obj = list(
        #     BlockedCompany.objects.filter(user_id=request.user.id).values("id", "user", "company__id", "company__name")
        # )

        profile_setting_dict = {}
        profile_setting_dict["account"] = account_serializer.data
        profile_setting_dict["app_notifications"] = notification_serializer.data
        profile_setting_dict["industry_preferences"] = industry_preferences_obj
        profile_setting_dict["job_preferences"] = job_preferences_serializer.data
        # profile_setting_dict["blocked"] = block_obj
        # list of companies and industries
        # profile_setting_dict["companies_list"] = companies
        return api_response(200, "Profile setting details", profile_setting_dict)

    def post(self, request, format=None, *args, **kwargs):

        """
        Adding Industry Preferences or Blocked Companies
        """
        data = request.data
        if "preferences" in data.keys():
            serializer = IndustryPreferenceSerializer(data=data["preferences"], context={"request": request})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return api_response(201, "Successfully Added industry preferences", serializer.data)

        # elif "blocked" in data.keys():
        #     serializer = BlockedCompanySerializer(data=data["blocked"], context={"request": request})
        #     if serializer.is_valid(raise_exception=True):
        #         serializer.save()
        #         return api_response(201, "Successfully Added blocked companies", serializer.data)
        return api_response(404, "page not found", {})

    def put(self, request, pk, *args, **kwargs):

        """
        Update profile settings
        """
        profile_settings = request.data
        tenant = get_user_tenant(request)
        if "account" in profile_settings.keys():
            try:
                user_obj = User.objects.get(id=pk, tenant=tenant)
            except User.DoesNotExist:
                return api_response(404, "User not found", {})
            if user_obj == request.user:
                serializer = AccountSettingSerializer(user_obj, profile_settings["account"], partial=True)
                if serializer.is_valid(raise_exception=True):
                    user = serializer.save()
                    if "locale" in profile_settings["account"]:
                        try:
                            profile_setting = ProfileSetting.objects.get(tenant=tenant, user=user)
                        except ProfileSetting.DoesNotExist:
                            pass
                        profile_setting.language_preference = user.locale
                        profile_setting.save()
                    return api_response(200, "Updated", serializer.data)
            else:
                return api_response(403, "not authorized", {})

        # elif "salary" in profile_settings.keys():
        #     try:
        #         obj = ProfileSetting.objects.get(user_id=pk, tenant=tenant)
        #     except ProfileSetting.DoesNotExist:
        #         return api_response(404, "Not found", {})
        #     if obj.user == request.user:
        #         serializer = JobPreferenceSerializer(obj, profile_settings["salary"], partial=True)
        #         if serializer.is_valid(raise_exception=True):
        #             serializer.save()
        #             return api_response(200, "Updated", serializer.data)
        #     else:
        #         return api_response(403, "not authorized", {})

        elif "job_preference" in profile_settings.keys():
            try:
                obj = ProfileSetting.objects.get(user_id=pk, tenant=tenant)
            except ProfileSetting.DoesNotExist:
                return api_response(404, "Not found", {})
            if obj.user == request.user:
                serializer = JobPreferenceSerializer(obj, profile_settings["job_preference"], partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return api_response(200, "Updated", serializer.data)

            else:
                return api_response(403, "not authorized", {})

        elif "app_notifications" in profile_settings.keys():
            try:
                obj = ProfileSetting.objects.get(user_id=pk, tenant=tenant)
            except ProfileSetting.DoesNotExist:
                return api_response(404, "Not found", {})
            if obj.user == request.user:
                serializer = NotificationSettingSerializer(obj, profile_settings["app_notifications"], partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return api_response(200, "Updated", serializer.data)
            else:
                return api_response(403, "not authorized", {})
        return api_response(404, "Page Not found", {})

    def delete(self, request, pk, *args, **kwargs):

        """
        Delete Industry preferences or Blocked companies
        """
        profile_settings = request.data
        if "preferences" in profile_settings.keys():
            try:
                industry_preference_obj = IndustryPreference.objects.get(industry_slug=pk, user=request.user)
            except IndustryPreference.DoesNotExist:
                return api_response(404, "Not found", {})
            if industry_preference_obj.user == request.user:
                industry_preference_obj.delete()
                return api_response(200, "deleted successfully", {})
            else:
                return api_response(403, "Not authorized", {})

        elif "blocked" in profile_settings.keys():
            try:
                blocked_company_obj = BlockedCompany.objects.get(company=pk, user=request.user)
            except BlockedCompany.DoesNotExist:
                return api_response(404, "Not found", {})
            if blocked_company_obj.user == request.user:
                blocked_company_obj.delete()
                return api_response(200, "deleted successfully", {})
            else:
                return api_response(403, "Not authorized", {})

        return api_response(404, "page not found", {})


class GetSalaryPreferencesView(APIView):
    permission_classes = (IsAuthenticated, IsProfileOwnerOnly)

    def get(self, request, *args, **kwargs):

        """
        Get Salary Preferences, availability and blocked companies
        """
        salary = list(
            ProfileSetting.objects.filter(user_id=request.user.id).values(
                "id",
                "user",
                "expected_min_salary",
                "expected_max_salary",
                "expected_currency",
                "salary_per",
                "availability_date",
                "availability_now",
                "looking_for_offers",
                "blocked_companies",
            )
        )
        salary_preferences_dict = {"salary": salary[0]}
        return api_response(200, "data", salary_preferences_dict)


class GetAllEmployeePartnersView(APIView):

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        partners = Tenant.objects.filter(approved=True, key=None).values("name", "id", "key")
        return api_response(200, "All Employee Partners", partners)


class GetIndustriesView(APIView):

    permission_classes = (IsAuthenticated, IsProfileOwnerOnly)

    def get(self, request, *args, **kwargs):
        industries = Industry.objects.all().values("id", "name")
        industry_serializer = IndustrySettingSerializer(industries, many=True)
        return api_response(200, "Industries", industry_serializer.data)


class IndustryPreferenceView(APIView):
    permission_classes = (IsAuthenticated, IsProfileOwnerOnly)

    def get(self, request, *args, **kwargs):

        industry_preferences_obj = list(
            IndustryPreference.objects.filter(user_id=request.user.id).values(
                "id", "user", "industry_slug__id", "industry_slug__name"
            )
        )
        return api_response(200, "Profile setting details", industry_preferences_obj)

    def post(self, request, format=None, *args, **kwargs):

        """
        TO add Industry Preferences
        """
        data = request.data
        serializer = IndustryPreferenceSerializer(data=data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            data = {}
            data["id"] = serializer.data["id"]
            data["user"] = request.user.id
            data["industry_slug__id"] = serializer.data["industry_slug"]
            data["industry_slug__name"] = serializer.data["industry_slug_name"]
            return api_response(201, "Successfully Added industry preferences", data)
        return api_response(404, "page not found", {})

    def delete(self, request, pk, *args, **kwargs):

        """
        To delete Industry preferences
        """
        try:
            industry_preference = IndustryPreference.objects.get(industry_slug=pk, user=request.user)
            data = {}
            data["id"] = industry_preference.id
            data["user"] = industry_preference.user_id
            data["industry_slug__id"] = industry_preference.industry_slug_id
            data["industry_slug__name"] = industry_preference.industry_slug.name
        except IndustryPreference.DoesNotExist:
            return api_response(404, "industry Not found", {})
        if industry_preference.user == request.user:
            industry_preference.delete()
            return api_response(200, "industry deleted successfully", data)
        else:
            return api_response(403, "Not authorized", {})
