# Django Imports
from django.contrib.auth.models import Group
from django.core.validators import validate_email
# Local Imports
from core.models.users import User
from core.helpers import generate_username
from core.models.partner_setting import PartnerSetting

# RestFramework Imports
from rest_framework import serializers


class HiringMemberCreateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.CharField(required=True, validators=[validate_email])
    area_code = serializers.CharField(required=True)
    phone = serializers.IntegerField(required=True)
    title = serializers.CharField(required=False)
    language_preference = serializers.CharField(required=False)
    class Meta:
        model = User
        fields = (
            "id",
            "tenant",
            "first_name",
            "last_name",
            "email",
            "area_code",
            "phone",
            "is_active",
            "title",
            "language_preference",
        )

    def validate_email(self, email):
        if "create" in self.context and self.context["create"]:
            user = User.objects.filter(email=email)
            if user.exists():
                raise serializers.ValidationError("This email already exists!")
            return email
        else:
            if "old_mail" in self.context and self.context["old_mail"]:
                if self.context["old_mail"] != email:
                    user = User.objects.filter(email=email)
                    if user.exists():
                        raise serializers.ValidationError("This email already exists!")
                    return email
        return email

    def create(self,validated_data):
        validated_data["username"] = generate_username(validated_data["email"])
        if "language_preference" in validated_data is not None:
            language = validated_data["language_preference"]
        else:
            language = "en"
        request = self.context["request"]
        user = User.objects.create(
            email=validated_data["email"],
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            phone=validated_data["phone"],
            area_code=validated_data["area_code"],
            is_superuser=True,
            is_staff=True,
            approved=True,
            role_id=self.context.get("role_id"),  # TODO: role_id =4 will map with group name = 'hiring_member'
            tenant=self.context.get("tenant_id"),
            created_by_id=self.context.get("created_by"),
            is_active=validated_data["is_active"],
            title=validated_data.get("title", ""),
            locale=language,
        )
        user.is_consent = True
        user.is_ca = request.user.is_ca
        user.save()
        job_title = self.context.get("job_title")
        if job_title:
            try:
                partner_setting = PartnerSetting.objects.get(user=user)
                partner_setting.job_title = job_title
                partner_setting.save()
            except PartnerSetting.DoesNotExist:
                PartnerSetting.objects.create(user=user, tenant=user.tenant, job_title=job_title)

        return user

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.email = validated_data.get("email", instance.email)
        instance.area_code = validated_data.get("area_code", instance.area_code)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.title = validated_data.get("title", instance.title)
        instance.save()
        job_title = self.context.get("job_title", "")
        try:
            partner_setting = PartnerSetting.objects.get(user=instance)
            partner_setting.job_title = job_title
            partner_setting.save()
        except PartnerSetting.DoesNotExist:
            PartnerSetting.objects.create(user=instance, tenant=instance.tenant, job_title=job_title)
        admin_params = self.context["admin_params"]
        if admin_params:
            instance.tenant = admin_params["tenant"]
            instance.created_by_id = admin_params["admin_partner"]
            instance.save()
        return instance


class HiringMemberGetSerializer(serializers.ModelSerializer):
    job_title = serializers.SerializerMethodField("get_job_title")
    organization = serializers.CharField(source="tenant.name", read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "tenant",
            "first_name",
            "last_name",
            "email",
            "is_ca",
            "area_code",
            "phone",
            "is_active",
            "created_at",
            "updated_at",
            "job_title",
            "title",
            "organization",
            "created_by",
        )

    @staticmethod
    def get_job_title(user):
        try:
            partner_setting = PartnerSetting.objects.get(user=user)
            job_title = partner_setting.job_title
            return job_title
        except PartnerSetting.DoesNotExist:
            return None


class AdminUserSerializer(serializers.ModelSerializer):
    role_name = serializers.ReadOnlyField(source="get_role_name.name")
    class Meta:
        model = User
        fields = ("id", "tenant", "first_name", "last_name", "email", "username", "role_id", "role_name")
