from rest_framework import generics
from core.serializers.serializersv2 import SignupSerializer
from core.models.users import User
from core.get_tenant import get_user_tenant
from rest_framework_simplejwt.tokens import RefreshToken
from core.views.authentication_api import send_email_account_activation
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import smart_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from urllib.parse import urlparse
from core.helpers import compile_email
from core.task import asynchronous_uploadResume
from core.helpers import api_response


class RegisterView(generics.GenericAPIView):
    serializer_class = SignupSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(request)
            user_data = serializer.data
            user = User.objects.get(email=user_data["email"], tenant=user.tenant)
            email = user.email
            lang = user.locale
            id = user.id
            token = RefreshToken.for_user(user)
            token["email"] = user.email
            token["chat_id"] = str(user.chat_id)
            token["is_user"] = not user.is_superuser
            token["role_id"] = user.role_id
            token["is_consent"] = user.is_consent
            token["canada"] = user.is_ca
            # verify_send_email_token(request,email)
            send_email_account_activation(request, email)
            set_password = request.data["set_password"]
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
            resume = request.data["resume_file"]
            if resume:
                asynchronous_uploadResume.delay(user.id)
            data = {
                "id": id,
                "email": email,
                "access_token": str(token.access_token),
                "refresh_token": str(token),
            }
            return api_response(201, "Registration successfully done", data)
        else:
            for key, values in serializer.errors.items():
                error = [value[:] for value in values][0]
            return api_response(400, "Invalid data", error)
