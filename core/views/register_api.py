from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from core.models.users import User
from core.models.tenant import Tenant
from core.serializers.register_serializer import HiringSerializer, RecruiterSerializer
from core.helpers import api_response
from django.db import IntegrityError
from core.serializers.register_serializer import RecuriterPasswordSetEmailSerializer, NewPasswordSerializer
from core.get_tenant import get_user_tenant
from core.helpers import compile_email
from core.views.approval import send_approval

# employee
class RegisterHiringAPI(generics.GenericAPIView):
    serializer_class = HiringSerializer
    queryset = Tenant.objects.all()

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save(request)
                user_data = serializer.data
                if user.first_name is not None and user.last_name is not None:
                    user_name = user.first_name + " " + user.last_name
                else:
                    user_name = user.username
                user = User.objects.get(email=user_data["email"], tenant=user.tenant)
                email = user.email
                id = user.id
                tenant = Tenant.objects.get(pk=user.tenant.id)
                signup_code = tenant.key
                token = RefreshToken.for_user(user)
                token["email"] = user.email
                token["chat_id"] = str(user.chat_id)
                token["is_user"] = not user.is_superuser
                token["role_id"] = user.role_id
                token["is_consent"] = user.is_consent
                token["canada"] = user.is_ca
                # uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                # token1 = PasswordResetTokenGenerator().make_token(user)
                # path = request.build_absolute_uri()
                # url_parse = urlparse(path)
                # base_url = url_parse.scheme + "://" + url_parse.netloc + "/setpasswordpartner?"
                # absurl = str(base_url) + "uidb64=" + uidb64 + "&" + "token=" + token1 + "&" + "email=" + email
                # compile_email(
                #     "user.password.reset",
                #     request,
                #     user,
                #     data={"email": email},
                #     cta={"text": "Set Password", "url": absurl},
                # )
                compile_email("signup.employer", request, user, data={"email": email})
                send_approval(request, email, tenant=tenant)

                data = {
                    "id": id,
                    "tenant_id": user.tenant.id,
                    "company_name": user.tenant.name,
                    "email": email,
                    # "access_token": str(token.access_token),
                    # "refresh_token": str(token),
                }
                return api_response(status.HTTP_201_CREATED, "Tenant Created ", data)

            else:
                errors_list = [serializer.errors[error][0] for error in serializer.errors]
                return api_response(400, "Invalid data", errors_list[0])
        except IntegrityError as e:
            content = {"error": "IntegrityError", "message": str(e)}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)


# nonprofit partner


class RegisterRecruiterAPI(generics.GenericAPIView):
    serializer_class = RecruiterSerializer
    queryset = Tenant.objects.all()

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save(request)
                user_data = serializer.data
                user = User.objects.get(email=user_data["email"], tenant=user.tenant)
                email = user.email
                id = user.id
                token = RefreshToken.for_user(user)
                token["email"] = user.email
                token["chat_id"] = str(user.chat_id)
                token["is_user"] = not user.is_superuser
                token["role_id"] = user.role_id
                token["is_consent"] = user.is_consent
                if user.first_name is not None and user.last_name is not None:
                    user_name = user.first_name + " " + user.last_name
                else:
                    user_name = user.username
                tenant = Tenant.objects.get(pk=user.tenant.id)
                signup_code = tenant.key
                # uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                # token1 = PasswordResetTokenGenerator().make_token(user)
                # path = request.build_absolute_uri()
                # url_parse = urlparse(path)
                # base_url = url_parse.scheme + "://" + url_parse.netloc + "/setpasswordpartner?"
                # absurl = str(base_url) + "uidb64=" + uidb64 + "&" + "token=" + token1 + "&" + "email=" + email
                # compile_email(
                #     "user.password.reset",
                #     request,
                #     user,
                #     data={"email": email},
                #     cta={"text": "Set Password", "url": absurl},
                # )
                compile_email("signup.skilling", request, user, data={"email": email})
                send_approval(request, email, tenant=tenant)
                # compile_email(
                #     "notify.admin",
                #     request,
                #     user,
                #     data={"email": email, "user_name": user_name, "code": signup_code},
                #     admin_email=True,
                # )
                # compile_email(
                #     "partner.welcome", request, user, data={"email": email, "user_name": user_name, "code": signup_code}
                # )
                # send_approval_email(request, email)  # approved
                # send_email_password_set(request, email, user)
                # signup_employer(request, email)
                # notify_simplify(request, email)
                # partner_welcome(request, email)
                data = {
                    "id": id,
                    "tenant_id": user.tenant.id,
                    "company_name": user.tenant.name,
                    "email": email,
                    # "access_token": str(token.access_token),
                    # "refresh_token": str(token),
                }
                return api_response(status.HTTP_201_CREATED, "Tenant Created ", data)

            else:
                errors_list = [serializer.errors[error][0] for error in serializer.errors]
                return api_response(400, "Invalid data", errors_list[0])
        except IntegrityError as e:
            content = {"error": "IntegrityError", "message": str(e)}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)


##
class RecuriterPasswordSetEmail(generics.GenericAPIView):
    serializer_class = RecuriterPasswordSetEmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = request.data.get("email", "")
        lang = request.data.get("lang", "")
        tenant = get_user_tenant(request)
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
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
            return api_response(
                200, "We have sent you a link to reset your password", {"uidb64": uidb64, "token": token1}
            )
        return api_response(400, "Your email is not registered with us", {})


class NewPasswordAPIView(generics.GenericAPIView):
    serializer_class = NewPasswordSerializer

    def get(self, request, uidb64="0000", token=None):
        # tenant = get_user_tenant(request)
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


from django.contrib.auth.tokens import default_token_generator

# from chatbot.views.chatbot_api import send_email_set
from core.task import send_asynchronous_email
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.template.loader import get_template
from urllib.parse import urlparse
from django.utils.encoding import force_text
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView


def send_approval_email(request, email):
    """
    Send activation Link to registered email address
    """
    if User.objects.filter(email=email, tenant=get_user_tenant(request)).exists():
        user = User.objects.get(email=email, tenant=get_user_tenant(request))
        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        approval_email(request, user, uidb64, token)
        return api_response(
            200,
            "We have sent you a link to activate your account",
            {"uidb64": uidb64, "token": token},
        )
    return api_response(404, "User not found", {"email": email})


def approval_email(request, user, uidb64, token):
    path = request.build_absolute_uri()
    url_parse = urlparse(path)
    base_url = url_parse.scheme + "://" + url_parse.netloc
    absurl = base_url + "/approved?" + "uidb64=" + uidb64 + "&token=" + token
    email_template = get_template("emails/user_activate.html")
    if user.first_name is not None and user.last_name is not None:
        user_name = user.first_name + " " + user.last_name
    else:
        user_name = user.username
    body = "Please approve to get access to thousands of exclusive job listings. To complete email verification press the button below."
    html_content = email_template.render({"activation_url": absurl, "candidate_name": user_name, "body": body})
    # email_address = user.email
    subject = "Approve your account"
    send_asynchronous_email.delay("prahlad@simplifyvms.com", subject, body, html_content)
    # send_simple_message(email_address, subject, body, html_content)


class ActivateAdminAccount(APIView):
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
                if user.approved == True:
                    data = {"username": user.username, "Email": user.email}
                    return api_response(200, "Account already approved", data)
                else:
                    user.approved = True
                    # print(user.tenant.id)
                    tenant = Tenant.objects.get(pk=user.tenant.id)
                    tenant.approved = True
                    id = user.id
                    tenant.primary_user_id = id
                    user.save()
                    tenant.save()
                    data = {"username": user.username, "Email": user.email}
                    return api_response(200, "Account Approved successfully", data)

        return api_response(400, "Token is not valid/expired", {})

    def post(self, request, *args, **kwargs):
        permission_classes = (IsAuthenticated,)
        email = request.data["email"]
        current_user = request.user

        if email == current_user.email:
            send_approval_email(request, email)
            data = {"username": current_user.username, "Email": current_user.email}
            return api_response(200, "Activation link sent to you registered email", data)
        return api_response(400, "Invalid email id", {})
