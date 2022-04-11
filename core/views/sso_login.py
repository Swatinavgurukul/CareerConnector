from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.models.users import User
from rest_framework_simplejwt.tokens import RefreshToken
from core.helpers import generate_username, api_response
from core.get_tenant import get_user_tenant
from core.serializers.serializers import SSORegisterSerializer
from rest_framework import generics
from django.contrib.auth import get_user_model


class SSOUser(APIView):
    def post(self, request):
        User = get_user_model()
        email = request.data["email"]
        token = request.data["token"]
        if token == "abc":
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=request.data["email"])
                email = user.email
                id = user.id
                token = RefreshToken.for_user(user)
                token["first_name"] = user.first_name
                token["email"] = user.email
                token["chat_id"] = str(user.chat_id)
                token["is_user"] = not user.is_superuser
                token["role_id"] = user.role_id
                token["last_login"] = str(user.last_login)
                token["tenant_name"] = user.tenant.name
                token["billing"] = 1
                token["is_consent"] = user.is_consent
                token["canada"] = user.is_ca
                data = {
                    "id": id,
                    "email": email,
                    "access_token": str(token.access_token),
                    "refresh_token": str(token),
                }
                return api_response(status.HTTP_201_CREATED, "User Found", data)
            else:
                email = request.data["email"]
                tenant = get_user_tenant(request)
                user = User.objects.create(
                    email=email,
                    username=generate_username(email),
                    first_name=generate_username(email),
                    last_name="",
                    phone="",
                    tenant=tenant,
                )
                user = User.objects.get(email=request.data["email"])
                email = user.email
                id = user.id
                token = RefreshToken.for_user(user)
                token["first_name"] = user.first_name
                token["email"] = user.email
                token["chat_id"] = str(user.chat_id)
                token["is_user"] = not user.is_superuser
                token["role_id"] = user.role_id
                token["last_login"] = str(user.last_login)
                token["tenant_name"] = user.tenant.name
                token["billing"] = 1
                token["is_consent"] = user.is_consent
                data = {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "access_token": str(token.access_token),
                    "refresh_token": str(token),
                    # "phone": user.phone,
                }
                return api_response(Response.status_code, "New Account Create", data)
        else:
            return api_response(Response.status_code, "Not Valid token", {})


from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope, OAuth2Authentication
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, smart_bytes, DjangoUnicodeDecodeError
from urllib.parse import urlparse
from core.helpers import compile_email


class SSORegisterAPI(generics.GenericAPIView):
    # authentication_classes = [OAuth2Authentication]
    # permission_classes = [TokenHasReadWriteScope]
    serializer_class = SSORegisterSerializer
    queryset = User.objects.all()

    # parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(request)
            user_data = serializer.data
            email = user_data["email"]
            lang = user_data["lang"]
            # user = User.objects.get(email=user_data["email"])
            # email = user.email
            # id = user.id
            # token = RefreshToken.for_user(user)
            # token["email"] = user.email
            # token["chat_id"] = str(user.chat_id)
            # token["is_user"] = not user.is_superuser
            # token["role_id"] = user.role_id
            # token["is_consent"] = user.is_consent
            # # verify_send_email_token(request,email)
            # send_email_account_activation(request, email)
            # # register_successfully(request, email)
            # set_password = request.data["set_password"]
            set_password = "yes"
            if set_password == "yes":
                uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                token1 = PasswordResetTokenGenerator().make_token(user)
                path = request.build_absolute_uri()
                url_parse = urlparse(path)
                base_url = url_parse.scheme + "://" + url_parse.netloc + "/setpasswordpartner?"
                absurl = (
                    str(base_url)
                    + "uidb64="
                    + uidb64
                    + "&"
                    + "token="
                    + token1
                    + "&"
                    + "email="
                    + email
                    + "&"
                    + "lang="
                    + lang
                )
                compile_email(
                    "user.password.reset",
                    request,
                    user,
                    data={"email": email},
                    cta={"text": "Set Password", "url": absurl},
                )
            # send_email_set(request, email)
            # resume = request.data["resume_file"]
            # if resume:
            #     asynchronous_uploadResume.delay(user.id)
            data = {
                "id": id,
            }
            return api_response(status.HTTP_201_CREATED, "Registration successfully done", request.data["email"])
        else:
            for key, values in serializer.errors.items():
                error = [value[:] for value in values][0]
            return api_response(status.HTTP_400_BAD_REQUEST, "Invalid data", error)
