from rest_framework import serializers
from core.models.users import User
import redis
from core.get_tenant import get_user_tenant
from core.helpers import generate_username
from django.core.exceptions import ValidationError


class SignupSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    resume_file = serializers.FileField(required=False)
    set_password = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "password",
            "phone",
            "area_code",
            "first_name",
            "last_name",
            "resume_file",
            "set_password",
        )
        extra_kwargs = {
            "password": {"write_only": True, "style": {"input_type": "password"}},
        }

    def save(self, request):
        serialized_data = request.data
        first_name = serialized_data.get("first_name", None)
        last_name = serialized_data.get("last_name", None)
        email = serialized_data.get("email", None)
        resume_file = serialized_data.get("resume_file", None)
        area_code = serialized_data.get("area_code", None)
        phoneno = serialized_data.get("phone", None)
        set_password = serialized_data.get("set_password", None)

        try:
            rs = redis.Redis("localhost")
            rs.client_list()

            user = User(
                email=self.validated_data["email"],
                phone=phoneno,
                area_code=area_code,
                resume_file=resume_file,
                first_name=first_name,
                last_name=last_name,
                username=generate_username(email),
                tenant=get_user_tenant(request),
            )
            password = self.validated_data["password"]
            user.set_password(password)
            user.approved = True
            user.is_consent = True
            user.save()
            return user
        except (redis.exceptions.ConnectionError, redis.exceptions.BusyLoadingError, ConnectionRefusedError):
            data = {"status": 401, "messgae": "Invalid data", "data": "Email Server Not Working"}
            raise serializers.ValidationError(data)
        except ValidationError:
            data = {"status": 401, "messgae": "Invalid data", "data": "Email already exists"}
            raise serializers.ValidationError(data)
