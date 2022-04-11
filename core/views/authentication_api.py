from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_text
from django.shortcuts import redirect
from django.views.generic import TemplateView
from django.urls import reverse
from django.conf import settings
from django.contrib.auth import logout as django_logout, login, authenticate
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import jwt
from core.helpers import send_simple_message, api_response
from core.models.users import User
from core.models.tenant import Tenant
from core.serializers.serializers import (
    RegisterSerializer,
    ChangePasswordSerializer,
    LoginSerializer,
    EmailVerificationSerializer,
    ChangeEmailSerializer,
    VerifyMyEmailSerializer,
    SetNewPasswordSerializer,
    ResetPasswordEmailRequestSerializer,
    MyTokenObtainPairSerializer,
)
from job.models.email_templates import EmailTemplate
from rest_framework.authtoken.models import Token
from django.template.loader import get_template
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from urllib.parse import urlparse
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password
import requests
from rest_framework.utils import json

# jwt login
from django.contrib.auth.tokens import default_token_generator

# from chatbot.views.chatbot_api import send_email_set
from core.task import send_asynchronous_email
from core.get_tenant import get_user_tenant
from notification.models.notifications import EmailNotificationTemplate
from core.helpers import compile_email
from core.emails import password_change_email
from core.models.profile_setting import ProfileSetting
from resume.models.profile import Profile


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


def register_successfully(request, email):
    user = User.objects.get(email=email)
    email_template = get_template("emails/thank_you.html")
    email_address = user.email
    if user.first_name is not None and user.last_name is not None:
        user_name = user.first_name + " " + user.last_name
    else:
        user_name = user.username
    path = request.build_absolute_uri()
    url_parse = urlparse(path)
    base_url = url_parse.scheme + "://" + url_parse.netloc
    absurl = base_url + "/profile"
    body = "We are excited to have you onboard. Please complete your profile to find opportunities relevant to your profile."
    html_content = email_template.render({"profile_link": absurl, "candidate_name": user_name, "body": body})
    subject = "Thank you for registering"
    send_asynchronous_email.delay(email_address, subject, body, html_content)
    # send_simple_message(email_address, subject, body, html_content)


def verify_send_email_token(request, email):
    user = User.objects.get(email=email)
    token = RefreshToken.for_user(user)
    relativeLink = reverse("email-verify")
    path = request.build_absolute_uri()
    url_parse = urlparse(path)
    base_url = url_parse.scheme + "://" + url_parse.netloc
    absurl = base_url + relativeLink + "?token=" + str(token)
    body = "Hi " + user.username + " Use link below to verify your email \n" + absurl
    email_address = user.email
    subject = "Verify Your Email"
    # send_simple_message(email_address, subject, body)
    send_asynchronous_email.delay(email_address, subject, body)


# def send_email_password_reset(request, email, user, uidb64, token):
#     path = request.build_absolute_uri()
#     url_parse = urlparse(path)
#     base_url = url_parse.scheme + "://" + url_parse.netloc
#     absurl = base_url + "/confirmPasswordReset?" + "uidb64=" + uidb64 + "&" + "token=" + token
#     email_template = get_template("emails/password_reset.html")
#     # body = "Hi " + user.username + " Use link below to reset your password \n" + absurl
#     if user.first_name is not None and user.last_name is not None:
#         user_name = user.first_name + " " + user.last_name
#     else:
#         user_name = user.username
#     body = "A request has been received to reset your password. Please click the button below to reset your password."
#     html_content = email_template.render({"reset_link": absurl, "body": body, "candidate_name": user_name})
#     email_address = user.email
#     subject = "Reset Your Password"
#     send_asynchronous_email.delay(email_address, subject, body, html_content)
# send_simple_message(email_address, subject, body, html_content)
# from resume.views.sovren_resume import sovrenresume
from core.task import asynchronous_uploadResume


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    queryset = User.objects.all()
    # parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(request)
            user_data = serializer.data
            user = User.objects.get(email=user_data["email"], tenant=user.tenant)
            try:
                profob = ProfileSetting.objects.get(user=user)
            except ProfileSetting.DoesNotExist:
                pass
            try:
                pfob = Profile.objects.get(user=user)
            except Profile.DoesNotExist:
                pass

            if user.check_resume:
                profob.score["uploads"] = user.check_resume
                profob.save()

            if user.user_percentage_complete_score:
                profob.score["personal_info"] = user.user_percentage_complete_score
                profob.save()

            if pfob.profile_percentage_complete_score:
                profob.score["about_me"] = pfob.profile_percentage_complete_score
                profob.save()
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
            # register_successfully(request, email)
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
                # #send_email_set(request, email)
            resume = request.data["resume_file"]
            if resume:
                asynchronous_uploadResume.delay(user.id)
            data = {
                "id": id,
                "email": email,
                "access_token": str(token.access_token),
                "refresh_token": str(token),
            }
            return api_response(status.HTTP_201_CREATED, "Registration successfully done", data)
        else:
            for key, values in serializer.errors.items():
                error = [value[:] for value in values][0]
            return api_response(status.HTTP_400_BAD_REQUEST, "Invalid data", error)


class VerifyEmailToken(APIView):
    serializer_class = EmailVerificationSerializer

    token_param_config = openapi.Parameter(
        "token",
        in_=openapi.IN_QUERY,
        description="Description",
        type=openapi.TYPE_STRING,
    )

    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        token = request.GET.get("token")
        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
            user = User.objects.get(id=payload["user_id"])
            if not user.is_verified_email:
                user.is_verified_email = True
                user.save()
            return Response({"email": "Successfully activated"}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Activation Expired"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class UserLoginApiView(ObtainAuthToken):
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES


class UserLoginView(generics.GenericAPIView):
    authentication_classes = (SessionAuthentication,)
    serializer_class = LoginSerializer
    model = User

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.data.get("username")
        password = serializer.data.get("password")
        user = authenticate(username=username, password=password)
        token, created = Token.objects.get_or_create(user=user)
        data = {"username": serializer.data["username"], "token": token.key}
        if user:
            login(request, user)
            return api_response(200, "Logged in successfully!", data)
        return api_response(400, "Invalid Credentials", {})


class Logout(APIView):
    """
    Calls Django logout method and delete the Token object
    assigned to the current User object.
    Accepts/Returns nothing.
    """

    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        if getattr(settings, "ACCOUNT_LOGOUT_ON_GET", False):
            response = self.logout(request)
        else:
            response = self.http_method_not_allowed(request, *args, **kwargs)

        return self.finalize_response(request, response, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.logout(request)

    def logout(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, ObjectDoesNotExist):
            pass
        if getattr(settings, "REST_SESSION_LOGIN", True):
            django_logout(request)

        response = Response({"detail": ("Successfully logged out.")}, status=status.HTTP_200_OK)
        if getattr(settings, "REST_USE_JWT", False):
            from rest_framework_jwt.settings import api_settings as jwt_settings

            if jwt_settings.JWT_AUTH_COOKIE:
                response.delete_cookie(jwt_settings.JWT_AUTH_COOKIE)
        return response


class ChangePasswordView(generics.UpdateAPIView):
    # authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer
    model = User

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        user_obj = self.request.user
        if serializer.is_valid():
            # # Check old password
            # if not self.object.check_password(serializer.data.get("old_password")):
            #     return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            body = "Your password has been successfully updated."
            # EmailTemplate.objects.create(user=user_obj, tenant=user_obj.tenant, body=body, model_type="change_password")
            if user_obj.first_name is not None and user_obj.last_name is not None:
                user_name = user_obj.first_name + " " + user_obj.last_name
            else:
                user_name = user_obj.username
            compile_email(
                "user.change.password",
                request,
                user_obj,
                data={"candidate_name": user_name},
            )
            # password_change_email(request, user_obj)

            return api_response(200, "Password updated successfully.", {})
        return api_response(400, "Password not updated successfully.", serializer.errors)


class HomeTemplateView(TemplateView):
    template_name = "auth/login.html"


class ChangeEmailView(generics.UpdateAPIView):

    """
    Change User Email
    """

    serializer_class = ChangeEmailSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            new_email = serializer.data.get("email")
            user = User.objects.get(email=self.object.email)
            user.email = new_email
            user.is_verified_email = False
            user.save()
            email = user.email
            # verify_send_email_token(request,email)
            send_email_account_activation(request, email)
            return api_response(Response.status_code, "Email updated successfully", user.email)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyMyEmailView(generics.UpdateAPIView):

    """
    Verify User Email
    """

    serializer_class = VerifyMyEmailSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        user = User.objects.get(email=self.object.email)

        if user.is_verified_email is False:
            user = User.objects.get(email=self.object.email)
            email = user.email
            # verify_send_email_token(request,email)
            send_email_account_activation(request, email)
            return api_response(Response.status_code, "Verification link send to your Email", user.email)
        return api_response(Response.status_code, "Email already verified", {})


class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = request.data.get("email", "")
        # tenant = get_user_tenant(request)
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            if user.approved is True:
                uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                token1 = PasswordResetTokenGenerator().make_token(user)
                path = request.build_absolute_uri()
                url_parse = urlparse(path)
                base_url = url_parse.scheme + "://" + url_parse.netloc + "/confirmPasswordReset?"
                absurl = str(base_url) + "uidb64=" + uidb64 + "&" + "token=" + token1 + "&"
                compile_email(
                    "user.forgot.password",
                    request,
                    user,
                    data={"email": email},
                    cta={"text": "Reset Password", "url": absurl},
                )
                # send_email_password_reset(request, email, user, uidb64, token1)
                return api_response(
                    200, "We have sent you a link to reset your password.", {"uidb64": uidb64, "token": token1}
                )
            else:
                return api_response(
                    400,
                    "Your account is pending approval, you'll receive an email to set password once your account is approved.",
                    {},
                )
        return api_response(400, "Your email is not registered with us.", {})


class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64="0000", token=None):
        try:
            if request.method == "GET" and "uidb64" in request.GET:
                uidb64 = request.GET["uidb64"]
            if request.method == "GET" and "uidb64" in request.GET:
                token = request.GET["token"]
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return api_response(400, "Token is not valid, please request a new one", {})
            return api_response(200, "Token is valid", {})
        except Exception as e:
            return api_response(400, "Token is not valid, please request a new one", {})

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return api_response(200, "Password reset success", {})


def send_email_account_activation(request, email):
    """
    Send activation Link to registered email address
    """
    if User.objects.filter(email=email, tenant=get_user_tenant(request)).exists():
        user = User.objects.get(email=email, tenant=get_user_tenant(request))
        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        path = request.build_absolute_uri()
        url_parse = urlparse(path)
        base_url = url_parse.scheme + "://" + url_parse.netloc
        absurl = base_url + "/verifyEmail?" + "uidb64=" + uidb64 + "&token=" + token
        if user.first_name is not None and user.last_name is not None:
            user_name = user.first_name + " " + user.last_name
        else:
            user_name = user.username
        compile_email(
            "candidate.activation",
            request,
            user,
            data={"email": email},
            cta={"text": "Activate", "url": absurl},
        )

        # send_activation_email(request, user, uidb64, token)
        return api_response(200, "We have sent you a link to activate your account", {"uidb64": uidb64, "token": token})
    return api_response(404, "User not found", {"email": email})


# def send_activation_email(request, user, uidb64, token):
#     path = request.build_absolute_uri()
#     url_parse = urlparse(path)
#     base_url = url_parse.scheme + "://" + url_parse.netloc
#     absurl = base_url + "/verifyEmail?" + "uidb64=" + uidb64 + "&token=" + token
#     email_template = get_template("emails/template.html")
#     if user.first_name is not None and user.last_name is not None:
#         user_name = user.first_name + " " + user.last_name
#     else:
#         user_name = user.username
#     name = "candidate.activation"
#     email_notification = EmailNotificationTemplate.objects.filter(name=name).values()
#     body = email_notification[0]["body"]
#     subject = email_notification[0]["subject"]
#     #message = email_notification[0]["title"]
#     html_content = email_template.render(
#         {
#             "candidate_name": user_name,
#             "body": body,
#         }
#     )
#     email_address = user.email
#     send_asynchronous_email.delay(email_address, subject, body, html_content)
# send_simple_message(email_address, subject, body, html_content)


class ActivateUserAccount(APIView):
    def get(self, request, *args, **kwargs):
        uidb64 = request.query_params.get("uidb64")
        token = request.query_params.get("token")
        token_generator = PasswordResetTokenGenerator()
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception as identifier:
            user = None

        if user is not None:
            if token_generator.check_token(user, token):
                if user.is_verified_email == True:
                    data = {"username": user.username, "Email": user.email}
                    return api_response(200, "Account already activated", data)
                else:
                    user.is_verified_email = True
                    user.approved = True
                    user.save()
                    data = {"username": user.username, "Email": user.email}
                    return api_response(200, "Account activated successfully", data)

        return api_response(400, "Token is not valid/expired", {})

    def post(self, request, *args, **kwargs):
        permission_classes = (IsAuthenticated,)
        email = request.data["email"]
        current_user = request.user

        if email == current_user.email:
            send_email_account_activation(request, email)
            data = {"username": current_user.username, "Email": current_user.email}
            return api_response(200, "Activation link sent to you registered email", data)
        return api_response(400, "Invalid email id", {})
