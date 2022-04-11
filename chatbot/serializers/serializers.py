from rest_framework import serializers
from core.models.users import User
from core.helpers import password_validation, generate_username
from core.models.tenant import Tenant
from core.get_tenant import get_user_tenant

class RegisterChatBotSerializer(serializers.ModelSerializer):
    resume_file = serializers.FileField(required=False)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "resume_file",
        )

    def save(self, request):
        serialized_data = request.query_params
        serialized_fileDetail = request.data

        email = serialized_data["email"]
        if "resume_file" in serialized_fileDetail is not None:
            resume_file = serialized_fileDetail["resume_file"]
        else:
            resume_file = None

        user = User(
            email=self.validated_data["email"],
            resume_file=resume_file,
            username=generate_username(email),
            tenant=get_user_tenant(request),
        )
        # password = self.validated_data["password"]

        # user.set_password(password)
        user.save()
        return user


class SetNewPasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=True)
    email = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = (
            "email",
            "password",
        )

    def save(self, request):
        email = request.query_params["email"]
        password = request.query_params["password"]

        try:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()
            return user
        except Exception as e:
            return ("user is not exists.{}", format(e))
