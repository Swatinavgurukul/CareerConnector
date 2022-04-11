from rest_framework import serializers
from core.models.users import User
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from core.models.feedback import FeedbackForm
from core.helpers import password_validation, generate_username
from core.models.tenant import Tenant
from notification.models.notifications import JobNotification
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from rest_framework import status
from core.get_tenant import get_user_tenant
from django.core.exceptions import ValidationError

# jwt
import redis
from rest_framework.exceptions import AuthenticationFailed


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {"no_active_account": ("Email / Password Not Matched")}

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        first_name = user.first_name
        last_name = user.last_name
        if first_name is None and last_name is None:
            fullname = ""
        elif first_name is not None and last_name is None:
            fullname = first_name
        elif first_name is None and last_name is not None:
            fullname = last_name
        else:
            fullname = first_name + " " + last_name
        role_id = user.role_id
        if role_id == 1:
            billing = user.tenant.billing
        else:
            billing = None
        token["full_name"] = fullname
        token["email"] = user.email
        token["chat_id"] = str(user.chat_id)
        token["is_user"] = not user.is_superuser
        token["role_id"] = user.role_id
        token["last_login"] = str(user.last_login)
        token["tenant_name"] = user.tenant.name
        token["billing"] = billing
        token["is_consent"] = user.is_consent
        token["user_image"] = user.user_image
        token["canada"] = user.is_ca
        token["language"] = user.locale or 'en'

        return token

    def validate(self, attrs):
        try:
            request = self.context["request"]
        except KeyError:
            pass
        current_user = User.objects.filter(email=request.data.get("username")).first()
        if not current_user:
            raise serializers.ValidationError(
                {"status": status.HTTP_400_BAD_REQUEST, "message": "Account doesn't exist."}
            )
        if not current_user.is_active:
            raise serializers.ValidationError(
                {
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": "Sorry, your account is inactive. Please contact your administrator.",
                }
            )
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)
        # data.pop("refresh", None)
        data["access"] = str(refresh.access_token)
        # tenant_id = self.user.tenant_id
        # tenant = get_user_tenant(request)
        # if tenant_id == tenant.id:
        if self.user.approved is True:
            self.user.last_login = timezone.now()
            self.user.save()
            return data
        else:
            raise serializers.ValidationError(
                {"status": status.HTTP_400_BAD_REQUEST, "message": "Account Not Approved"}
            )
        # else:
        #     raise serializers.ValidationError({"status": status.HTTP_400_BAD_REQUEST, "message": "Tenant Not Found"})


class RegisterSerializer(serializers.ModelSerializer):
    # full_name = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    # retype_password = serializers.CharField(
    #     required=True, style={"input_type": "password"}, write_only=True)
    resume_file = serializers.FileField(required=False)
    title = serializers.CharField(required=False)
    set_password = serializers.CharField(read_only=True)
    key = serializers.CharField(required=False)
    language_preference = serializers.CharField(required=False)
    is_ca = serializers.CharField(required=False)

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
            "title",
            "resume_file",
            "set_password",
            "key",
            "created_by",
            "language_preference",
            "is_ca",
        )
        extra_kwargs = {
            "password": {"write_only": True, "style": {"input_type": "password"}},
        }

    def validate(self, attrs):
        email = attrs.get("email", None)
        key = attrs.get("key", None)
        tenant = Tenant.objects.filter(key=key).first()
        if not tenant:
            raise serializers.ValidationError("Invalid signup code")
        if User.objects.filter(email=email, tenant=tenant).exists():
            raise serializers.ValidationError("Email already exists")
        return super().validate(attrs)

    def save(self, request):
        serialized_data = request.data
        # if "full_name" in serialized_data.keys():
        #     data = serialized_data["full_name"]
        # else:
        #     email = serialized_data["email"]
        #     data = email.split("@")[0]
        # name = data.split(" ")
        # first_name = name[0]
        # last_name = " ".join(name[1:])
        # if len(last_name) == 0:
        #     last_name = None
        first_name = serialized_data["first_name"]
        last_name = serialized_data["last_name"]
        email = serialized_data["email"]
        if "language_preference" in serialized_data is not None:
            language = serialized_data["language_preference"]
        else:
            language = "en"
        if "title" in serialized_data is not None:
            title = serialized_data["title"]
        else:
            title = None
        if "resume_file" in serialized_data is not None:
            resume_file = serialized_data["resume_file"]
        else:
            resume_file = None
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
        if "is_ca" in serialized_data is not None:
            is_ca = True
        else:
            is_ca = False

        tenant = (
            Tenant.objects.get(key=serialized_data["key"])
            if "key" in serialized_data and serialized_data["key"] != ""
            else get_user_tenant(request)
        )

        # tenanat_key = get_user_tenant(request).key
        created_by_id = None
        if "created_by" in serialized_data:
            try:
                created_by_id = int(serialized_data["created_by"])
                created_by_obj = User.objects.get(id=created_by_id)
                is_ca = created_by_obj.is_ca
            except:
                created_by_id = None
        try:
            rs = redis.Redis("localhost")
            rs.client_list()

            user = User(
                email=self.validated_data["email"],
                phone=phoneno,
                area_code=area_code,
                resume_file=resume_file,
                title=title,
                first_name=first_name,
                last_name=last_name,
                username=generate_username(email),
                tenant=tenant,
                created_by_id=created_by_id,
                locale=language,
                is_ca=is_ca,
            )
            password = self.validated_data["password"]
            # retype_password = self.validated_data["retype_password"]

            # if password != retype_password:
            #     raise serializers.ValidationError(
            #         {"password": "passwords must match"})

            user.set_password(password)
            user.approved = True
            user.is_consent = True
            user.is_verified_email = True
            user.save()
            return user
        except (redis.exceptions.ConnectionError, redis.exceptions.BusyLoadingError, ConnectionRefusedError):
            data = {"status": 401, "messgae": "Invalid data", "data": "Email Server Not Working"}
            raise serializers.ValidationError(data)
        except ValidationError:
            data = {"status": 401, "messgae": "Invalid data", "data": "Email already exists"}
            raise serializers.ValidationError(data)
        except Exception as e:
            data = {"status": 401, "messgae": "Invalid data", "data": "Sign-up Code Not Matched"}
            raise serializers.ValidationError(data)

    # def validate(self, data):
    #     password = data["password"]
    #     errors = password_validation(password)

    #     if errors:
    #         raise serializers.ValidationError(errors)
    #     return data


class RegisterUpdateSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(required=False)
    first_name = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ("id", "phone", "first_name", "last_name", "email")


class EmailVerificationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=555)

    class Meta:
        model = User
        fields = ["token"]


class LoginSerializer(serializers.Serializer):
    model = User
    username = serializers.CharField(required=True, style={"placeholder": "Username"})
    password = serializers.CharField(required=True, style={"input_type": "password", "placeholder": "Password"})


class ChangePasswordSerializer(serializers.Serializer):
    model = User
    old_password = serializers.CharField(required=True, style={"input_type": "password", "placeholder": "New Password"})
    new_password = serializers.CharField(required=True, style={"input_type": "password", "placeholder": "New Password"})
    retype_password = serializers.CharField(
        required=True,
        style={"input_type": "password", "placeholder": "Confirm Password"},
    )

    def validate(self, data):
        new_password = data.get("new_password")
        retype_password = data.get("retype_password")
        old_password = data.get("old_password")
        if not self.context["request"].user.check_password(old_password):
            raise serializers.ValidationError({"old_password": "Wrong password."})
        if old_password == new_password:
            raise serializers.ValidationError("Current password and new password must be different.")
        if new_password != retype_password:
            raise serializers.ValidationError("Passwords do not match.")
        errors = password_validation(new_password)
        if errors:
            raise serializers.ValidationError(errors)
        return data


class UserSerilizer(serializers.ModelSerializer):
    """
    User Details
    """

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name")


class ChangeEmailSerializer(serializers.Serializer):
    model = User
    email = serializers.EmailField(required=True)

    def validate_email(self, email):
        user = User.objects.filter(email=email)
        if user.exists():
            raise serializers.ValidationError("This email already exists!")

        return email


class VerifyMyEmailSerializer(serializers.Serializer):
    model = User


class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class SetNewPasswordSerializer(serializers.Serializer):
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
            user.save()
            JobNotification.objects.create(
                tenant=user.tenant,
                user=user,
                is_read=False,
                message="Your password has been reset successfully",
                model_type="reset_password",
            )
            return user
        except Exception:
            raise AuthenticationFailed("The reset link is invalid", 401)
        return super().validate(attrs)


class FeedbackFormSerializer(serializers.ModelSerializer):
    feedback_type = serializers.CharField(required=True)
    description = serializers.CharField(required=True)

    class Meta:
        model = FeedbackForm
        exclude = ("user", "created_at")


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")


class SSORegisterSerializer(serializers.ModelSerializer):
    # full_name = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    # retype_password = serializers.CharField(
    #     required=True, style={"input_type": "password"}, write_only=True)
    resume_file = serializers.CharField(required=False)
    # set_password = serializers.CharField(read_only=True)
    # key = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            # "password",
            # "phone",
            # "area_code",
            "first_name",
            "last_name",
            "resume_file",
            # "set_password",
            # "key",
        )
        # extra_kwargs = {
        #     "password": {"write_only": True, "style": {"input_type": "password"}},
        # }

    def save(self, request):
        serialized_data = request.data
        # if "full_name" in serialized_data.keys():
        #     data = serialized_data["full_name"]
        # else:
        #     email = serialized_data["email"]
        #     data = email.split("@")[0]
        # name = data.split(" ")
        # first_name = name[0]
        # last_name = " ".join(name[1:])
        # if len(last_name) == 0:
        #     last_name = None
        first_name = serialized_data["first_name"]
        last_name = serialized_data["last_name"]
        email = serialized_data["email"]
        if "resume_file" in serialized_data is not None:
            resume_file = serialized_data["resume_file"]
        else:
            resume_file = None
        if "area_code" in serialized_data is not None:
            area_code = serialized_data["area_code"]
        else:
            area_code = None
        if "phone" in serialized_data is not None:
            phoneno = serialized_data["phone"]
        else:
            phoneno = None

        set_password = "yes"

        # if "set_password" in serialized_data is not None:
        #     set_password = serialized_data["set_password"]
        # else:
        #     set_password = None

        # tenanat_key = get_user_tenant(request).key
        try:
            rs = redis.Redis("localhost")
            rs.client_list()

            tenant = Tenant.objects.get(id=1)

            # tenant.key = serialized_data["key"]
            # key=serialized_data["key"])
            user = User(
                email=self.validated_data["email"],
                # phone=phoneno,
                # area_code=area_code,
                resume_file=resume_file,
                first_name=first_name,
                last_name=last_name,
                username=generate_username(email),
                tenant=tenant,
            )
            password = "Test@123cyn"
            # retype_password = self.validated_data["retype_password"]

            # if password != retype_password:
            #     raise serializers.ValidationError(
            #         {"password": "passwords must match"})

            user.set_password(password)
            user.approved = True
            user.is_consent = True
            user.save()
            return user
        except (redis.exceptions.ConnectionError, redis.exceptions.BusyLoadingError, ConnectionRefusedError):
            data = {"status": 401, "messgae": "Invalid data", "data": "Email Server Not Working"}
            raise serializers.ValidationError(data)
        except ValidationError:
            data = {"status": 401, "messgae": "Invalid data", "data": "Email already exists."}
            raise serializers.ValidationError(data)
        except:
            data = {"status": 401, "messgae": "Invalid data", "data": "Sign-up Code Not Matched"}
            raise serializers.ValidationError(data)