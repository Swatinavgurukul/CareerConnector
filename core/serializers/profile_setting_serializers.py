# from typing_extensions import Required
from rest_framework import serializers
from core.models.users import User
from core.models.profile_setting import ProfileSetting
from resume.models.user_preferences import IndustryPreference, BlockedCompany
from job.models.job_industry import Industry
from rest_framework.validators import UniqueTogetherValidator


class AccountSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "secondary_email", "phone", "locale")


class IndustryPreferenceSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    industry_slug_name = serializers.CharField(source="industry_slug.name", read_only=True)

    class Meta:
        model = IndustryPreference
        fields = ("id", "user", "industry_slug", "industry_slug_name")
        validators = [
            UniqueTogetherValidator(
                queryset=IndustryPreference.objects.all(),
                fields=("user", "industry_slug"),
                message="industry already added to preferences for the current user",
            )
        ]


class IndustrySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = (
            "id",
            "name",
        )


class JobPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileSetting
        fields = (
            "id",
            "user",
            "job_roles_preference",
            "location_preference",
            "expected_min_salary",
            "expected_max_salary",
            "expected_currency",
            "salary_per",
            "looking_for_offers",
            "availability_now",
            "availability_date",
            "company_size",
            "authorized_countries",
            "remote_work_policy",
            "blocked_companies",
            "job_types",
        )

    # def update(self, instance, validated_data):
    #     industries=validated_data.pop("industries", None)

    #     instance.job_roles_preference = validated_data.get("job_roles_preference", instance.job_roles_preference)
    #     instance.location_preference = validated_data.get("location_preference", instance.location_preference)
    #     instance.expected_min_salary = validated_data.get("expected_min_salary", instance.expected_min_salary)
    #     instance.expected_max_salary = validated_data.get("expected_max_salary", instance.expected_max_salary)
    #     instance.expected_currency = validated_data.get("expected_currency", instance.expected_currency)
    #     instance.salary_per = validated_data.get("salary_per", instance.salary_per)
    #     instance.looking_for_offers = validated_data.get("looking_for_offers", instance.looking_for_offers)
    #     instance.availability_now = validated_data.get("availability_now", instance.availability_now)
    #     instance.availability_date = validated_data.get("availability_date", instance.availability_date)
    #     instance.company_size = validated_data.get("company_size", instance.company_size)
    #     instance.authorized_countries = validated_data.get("authorized_countries", instance.authorized_countries)
    #     instance.remote_work_policy = validated_data.get("remote_work_policy", instance.remote_work_policy)
    #     instance.blocked_companies = validated_data.get("blocked_companies", instance.blocked_companies)
    #     instance.job_types = validated_data.get("job_types", instance.job_types)
    #     instance.save()
    #     if industries:
    #         for industry in industries:
    #             industry=Industry.objects.get(name=industry["name"])
    #             if not IndustryPreference.objects.filter(user=instance.user,industry_slug=industry):
    #                 IndustryPreference.objects.create(user=instance.user,industry_slug=industry)
    #     return instance


class JobPreferenceGetSerializer(serializers.ModelSerializer):
    industries = serializers.SerializerMethodField("get_job_industries")

    class Meta:
        model = ProfileSetting
        fields = (
            "id",
            "user",
            "job_roles_preference",
            "location_preference",
            "expected_min_salary",
            "expected_max_salary",
            "expected_currency",
            "salary_per",
            "looking_for_offers",
            "availability_now",
            "availability_date",
            "industries",
            "company_size",
            "authorized_countries",
            "remote_work_policy",
            "blocked_companies",
            "job_types",
        )

    def get_job_industries(self, profile_setting):
        user = profile_setting.user
        industry_preferences = IndustryPreference.objects.filter(user=user)
        if industry_preferences:
            data = []
            for industry in industry_preferences:
                industry_dict = {}
                industry_dict["id"] = industry.industry_slug_id
                industry_dict["name"] = industry.industry_slug.name
                data.append(industry_dict)
            return data


class NotificationSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileSetting
        fields = (
            "id",
            "user",
            "notify_primary_email",
            "notify_secondary_email",
            "notify_phone",
        )


# class BlockedCompanySerializer(serializers.ModelSerializer):
#     user = serializers.HiddenField(
#         default=serializers.CurrentUserDefault()
#     )
#     class Meta:
#         model = BlockedCompany
#         fields = ("id", "user", "company")
#         validators=[UniqueTogetherValidator(
#            queryset=BlockedCompany.objects.all(),fields=("user","company"),
#            message="company already blocked by the current user")]
