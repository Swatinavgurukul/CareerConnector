from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from core.models.users import User
from rest_framework import serializers
from rest_framework import status
from django.utils import timezone


def tenant_authenticate(email, password, tenant_id):
    try:
        user = User.objects.get(email=email, tenant__id=tenant_id)
    except User.DoesNotExist:
        return None

    return user if user.check_password(password) else None


class AccountLoginSerializer(TokenObtainPairSerializer):
    default_error_messages = {"no_active_account": ("Email / Password Not Matched")}

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        fullname = " ".join(filter(None, (user.first_name, user.last_name)))
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
        token["canada"] = user.is_ca

        return token

    def validate(self, attrs):
        try:
            request = self.context["request"]
        except KeyError:
            pass
        tenant_id = request.data.get("tenant_id", None)
        email = request.data.get("username", None)
        password = request.data.get("password", None)
        acc_list = User.objects.filter(email=email)
        user_list = [dict(id=usr.tenant.id, name=usr.tenant.name) for usr in acc_list if usr.check_password(password)]
        data = {}
        if not acc_list:
            raise serializers.ValidationError(
                {"status": status.HTTP_400_BAD_REQUEST, "message": "Account doesn't exist."}
            )
        elif not user_list:
            raise serializers.ValidationError(
                {"status": status.HTTP_400_BAD_REQUEST, "message": "Email / Password Not Matched"}
            )
        elif len(user_list) == 1:
            data = super().validate(attrs)
        elif len(user_list) > 1 and not tenant_id:
            return {
                "status": status.HTTP_200_OK,
                "message": "Choose which tenant you want to login.",
                "data": user_list,
            }
        elif tenant_id:
            user = tenant_authenticate(email, password, tenant_id)
            self.user = user
        else:
            pass
        try:
            if not self.user.is_active:
                raise serializers.ValidationError(
                    {
                        "status": status.HTTP_400_BAD_REQUEST,
                        "message": "Sorry, your account is inactive. Please contact your administrator.",
                    }
                )
            refresh = self.get_token(self.user)
            data["refresh"] = str(refresh)
            data["access"] = str(refresh.access_token)
            if self.user.approved is True:
                self.user.last_login = timezone.now()
                self.user.save()
                return data
            else:
                raise serializers.ValidationError(
                    {"status": status.HTTP_400_BAD_REQUEST, "message": "Account Not Approved"}
                )
        except AttributeError:
            raise serializers.ValidationError(
                {"status": status.HTTP_400_BAD_REQUEST, "message": "Account doesn't exist."}
            )


class AccountLoginView(TokenObtainPairView):
    serializer_class = AccountLoginSerializer
