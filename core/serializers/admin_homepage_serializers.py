from rest_framework import serializers
from core.models.users import User


class AdminHomeGetSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)
    current_status = serializers.SerializerMethodField("get_current_status")
    user_type = serializers.SerializerMethodField("get_user_type")
    full_name = serializers.SerializerMethodField("get_user_name")
    is_approved = serializers.SerializerMethodField("get_is_approved")
    is_erd = serializers.BooleanField(source="tenant.erd", read_only=True)
    archive = serializers.SerializerMethodField("get_archive")

    class Meta:
        model = User
        fields = (
            "id",
            "full_name",
            "email",
            "tenant_name",
            "current_status",
            "is_approved",
            "user_type",
            "is_ca",
            "is_erd",
            "created_at",
            "archive",
        )

    def get_user_name(self, user):
        if user.first_name is not None and user.last_name is not None:
            user_name = user.first_name + " " + user.last_name
        else:
            user_name = user.username
        return user_name

    def get_is_approved(self, user):
        if user.is_verified_email and user.approved:
            return True
        else:
            return False

    def get_current_status(self, user):
        if user.is_verified_email and user.approved:
            if user.role_id == 1:
                if user.tenant.billing is True:
                    return "Approved"
                else:
                    return "Pending Onboarding"
            else:
                return "Approved"
        elif user.is_verified_email and not user.approved:
            return "rejected"
        elif not user.is_verified_email and not user.approved:
            return "pending"
        else:
            return "pending"

    def get_user_type(self, user):
        if user.role_id == 1:
            return "Employee Partner"
        elif user.role_id == 2:
            return "Skilling Partner"

    def get_archive(self, user_obj):
        exclude_users = self.context["exclude_users"]
        archive = False
        if user_obj.id in exclude_users:
            archive = True
        return archive