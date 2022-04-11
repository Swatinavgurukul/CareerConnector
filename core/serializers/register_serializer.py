from rest_framework import serializers
from core.models.users import User
from core.helpers import generate_username
from core.models.tenant import Tenant
from urllib.parse import urlparse
import string
import random
from core.get_tenant import get_user_tenant
import redis
from django.db import IntegrityError
from django.core.exceptions import ValidationError


class RegisterAdminSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    set_password = serializers.CharField(read_only=True)
    role = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "password",
            "phone",
            "area_code",
            "full_name",
            "set_password",
            "role",
        )
        extra_kwargs = {
            "password": {"write_only": True, "style": {"input_type": "password"}},
        }

    def save(self, request):
        serialized_data = request.data
        email = serialized_data["email"]
        if "full_name" in serialized_data.keys():
            data = serialized_data["full_name"]
        else:
            data = email.split("@")[0]
        name = data.split(" ")
        first_name = name[0]
        last_name = " ".join(name[1:])
        if len(last_name) == 0:
            last_name = None
        if "area_code" in serialized_data is not None:
            area_code = serialized_data["area_code"]
        else:
            area_code = None
        if "phone" in serialized_data is not None:
            phoneno = serialized_data["phone"]
        else:
            phoneno = None

        if "set_password" in serialized_data is not None:
            set_password = serialized_data["set_password"]
        else:
            set_password = None

        user = User(
            email=self.validated_data["email"],
            phone=phoneno,
            area_code=area_code,
            first_name=first_name,
            last_name=last_name,
            username=generate_username(email),
            is_superuser=True,
            is_staff=True,
            role_id=serialized_data["role"],
            tenant=get_user_tenant(request),
        )
        password = self.validated_data["password"]
        user.set_password(password)
        user.save()
        return user


# Employee Partner
class HiringSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(required=True)
    title = serializers.CharField(required=False)
    email = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone = serializers.IntegerField(required=True)
    # password = serializers.CharField(required=True, style={"input_type": "password"}, write_only=True)
    language_preference = serializers.CharField(required=False)
    is_ca = serializers.CharField(required=False)

    class Meta:
        model = Tenant
        fields = (
            "id",
            "tenant_name",
            "base_url",
            "key",
            "email",
            # "password",
            "phone",
            "first_name",
            "last_name",
            "title",
            "custom_field2",
            "language_preference",
            "is_ca",
        )

    def validate(self, attrs):
        email = attrs.get("email")
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")
        return super().validate(attrs)

    def save(self, request):
        try:
            rs = redis.Redis("localhost")
            rs.client_list()
            serialized_data = request.data
            # path = request.build_absolute_uri()
            # url_parse = urlparse(path)
            # base_url = url_parse.netloc
            tenant = Tenant.objects.create(
                name=serialized_data["tenant_name"],
                custom_field2=serialized_data["custom_field2"],
                # base_url=base_url,
                key=None,
            )
            email = serialized_data["email"]
            tenant.save()
            if "title" in serialized_data is not None:
                title = serialized_data["title"]
            else:
                title = None
            if "language_preference" in serialized_data is not None:
                language = serialized_data["language_preference"]
            else:
                language = "en"
            if "is_ca" in serialized_data is not None:
                is_ca = True
            else:
                is_ca = False
            tenant.is_canada = is_ca
            tenant.save()
            user = User.objects.create(
                email=self.validated_data["email"],
                username=generate_username(email),
                tenant=tenant,
                title=title,
                first_name=serialized_data["first_name"],
                last_name=serialized_data["last_name"],
                phone=serialized_data["phone"],
                area_code=serialized_data["area_code"],
                is_superuser=True,
                is_staff=True,
                role_id=1,
                locale=language,
                is_ca=is_ca,
            )
            user.is_consent = True
            user.save()
            return user

            # password = self.validated_data["password"]
            # user.set_password(password)
        except (redis.exceptions.ConnectionError, redis.exceptions.BusyLoadingError, ConnectionRefusedError):
            data = {"status": 401, "message": "Invalid data", "data": "Email Server Not Working"}
            raise serializers.ValidationError(data)
        except ValidationError:
            data = {"status": 401, "messgae": "Invalid data", "data": "Email already exists"}
            raise serializers.ValidationError(data)
        # except Exception as error:
        #         data = {"status": 401, "message": "Invalid data", "data": "User with this email already registered"}
        #         raise serializers.ValidationError(data)
        except Exception as error:
            data = {"status": 401, "message": "Invalid data", "data": "Email Already Used"}
            raise serializers.ValidationError(data)


# Nonprofit Partner
class RecruiterSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(required=True)
    title = serializers.CharField(required=False)
    email = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone = serializers.IntegerField(required=True)
    # password = serializers.CharField(required=True, style={"input_type": "password"}, write_only=True)
    language_preference = serializers.CharField(required=False)
    is_ca = serializers.CharField(required=False)

    class Meta:
        model = Tenant
        fields = (
            "id",
            "tenant_name",
            "base_url",
            "key",
            "email",
            # "password",
            "phone",
            "first_name",
            "last_name",
            "title",
            "custom_field2",
            "language_preference",
            "is_ca",
        )

    def validate(self, attrs):
        email = attrs.get("email")
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")
        return super().validate(attrs)

    def save(self, request):
        serialized_data = request.data
        path = request.build_absolute_uri()
        url_parse = urlparse(path)
        base_url = url_parse.netloc
        try:
            rs = redis.Redis("localhost")
            rs.client_list()
            while True:
                key = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
                if Tenant.objects.filter(key=key):
                    continue
                else:
                    break
            tenant = Tenant(
                name=serialized_data["tenant_name"],
                custom_field2=serialized_data["custom_field2"],
                # base_url=base_url,
                key=key,
            )
            tenant.save()
            email = serialized_data["email"]
            if "title" in serialized_data is not None:
                title = serialized_data["title"]
            else:
                title = None
            if "language_preference" in serialized_data is not None:
                language = serialized_data["language_preference"]
            else:
                language = "en"
            if "is_ca" in serialized_data is not None:
                is_ca = True
            else:
                is_ca = False
            tenant.is_canada = is_ca
            tenant.save()
            user = User.objects.create(
                email=self.validated_data["email"],
                username=generate_username(email),
                tenant=tenant,
                title=title,
                first_name=serialized_data["first_name"],
                last_name=serialized_data["last_name"],
                phone=serialized_data["phone"],
                area_code=serialized_data["area_code"],
                is_superuser=True,
                is_staff=True,
                role_id=2,
                locale=language,
                is_ca=is_ca,
            )

            # password = self.validated_data["password"]
            # user.set_password(password)
            user.is_consent = True
            user.save()
            return user
        except (redis.exceptions.ConnectionError, redis.exceptions.BusyLoadingError, ConnectionRefusedError):
            data = {"status": 401, "message": "Invalid data", "data": "Email Server Not Working"}
            raise serializers.ValidationError(data)
        except ValidationError:
            data = {"status": 401, "messgae": "Invalid data", "data": "Email already exists."}
            raise serializers.ValidationError(data)
        except Exception as error:
            data = {"status": 401, "message": "Invalid data", "data": "Email Already Used"}
            raise serializers.ValidationError(data)
        # except IntegrityError:
        #     data = {"status": 401, "messgae": "Invalid data", "data": "Email Already Used"}
        #     raise serializers.ValidationError(data)


from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework.exceptions import AuthenticationFailed


class RecuriterPasswordSetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class NewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(min_length=1, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = ["password", "token", "uidb64"]

    def validate(self, attrs):
        try:
            password = attrs.get("password")
            token = attrs.get("token")
            uidb64 = attrs.get("uidb64")
            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed("The reset link is invalid", 401)

            user.set_password(password)
            # user.approved = True
            tenant = Tenant.objects.get(pk=user.tenant.id)
            tenant.approved = True
            id = user.id
            tenant.primary_user_id = id
            user.save()
            tenant.save()

            return user
        except Exception:
            raise AuthenticationFailed("The reset link is invalid", 401)
        return super().validate(attrs)
