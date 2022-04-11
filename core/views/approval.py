from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from core.helpers import api_response
from core.models.users import User
from urllib.parse import urlparse
from core.helpers import compile_email
from django.utils.encoding import force_text
from core.models.tenant import Tenant
from core.get_tenant import get_user_tenant
import json


def send_approval(request, email, tenant=None):

    if User.objects.filter(email=email, tenant=tenant).exists():
        user = User.objects.get(email=email, tenant=tenant)
        if user.first_name is not None and user.last_name is not None:
            user_name = user.first_name + " " + user.last_name
        else:
            user_name = user.username
        role = user.role_id
        if role == 1:
            partner_type = "Employer Partner"
        elif role == 2:
            partner_type = "Skilling Partner"
        else:
            partner_type = ""
        email_subject = "New Partner Joined - " + user.tenant.name.title()
        data = {
            "subject": email_subject,
            "company": user.tenant.name.title(),
            "email": user.email,
            "user_name": user_name.title(),
            "area_code": user.area_code,
            "phone": user.phone,
            "partner": partner_type,
            "custom_field2": user.tenant.custom_field2,
        }
        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        datab64 = urlsafe_base64_encode(json.dumps(data).encode())
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        path = request.build_absolute_uri()
        url_parse = urlparse(path)
        base_url = url_parse.scheme + "://" + url_parse.netloc
        absurl = base_url + "/approval1?" + "uidb64=" + uidb64 + "&token=" + token + "&datab64=" + datab64
        # absurl = base_url + "/approval?" + "uidb64=" + uidb64 + "&token=" + token
        # absurl1 = base_url + "/rejected?" + "uidb64=" + uidb64 + "&token=" + token

        compile_email(
            "notify.admin",
            request,
            user,
            data,
            cta={"text": "Click here to Approve/Reject", "url": absurl},
            admin_email=True,
        )
        # send_activation_email(request, user, uidb64, token)
        return api_response(200, "We have sent you a link to activate your account", {"uidb64": uidb64, "token": token})
    return api_response(404, "User not found", {"email": email})


class Approval(APIView):
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
                if user.approved is False and user.is_verified_email is True:
                    data = {"username": user.username, "Email": user.email}
                    return api_response(200, "Account Already Rejected", data)
                if user.approved is True:
                    data = {"username": user.username, "Email": user.email}
                    return api_response(200, "Account Already Approved", data)
                else:
                    user.is_verified_email = True
                    user.approved = True
                    user.save()

                    email = user.email
                    lang = user.locale
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
                    # compile_email(
                    #     "user.password.reset",
                    #     request,
                    #     user,
                    #     data={"email": user.email},
                    #     cta={"text": "Set Password", "url": absurl},
                    # )
                    if user.role_id == 1:
                        compile_email(
                            "employer_welcome.password",
                            request,
                            user,
                            data={"email": user.email},
                            cta={"text": "Set Password", "url": absurl},
                        )

                    if user.role_id == 2:
                        user_name = user.first_name + " " + user.last_name
                        tenant = Tenant.objects.get(pk=user.tenant.id)
                        signup_code = tenant.key

                        compile_email(
                            "skilling_welcome.password",
                            request,
                            user,
                            data={"email": user.email, "user_name": user_name, "code": signup_code},
                            cta={"text": "Set Password", "url": absurl},
                        )
                        # compile_email(
                        #     "skilling.signupkey",
                        #     request,
                        #     user,
                        #     data={"email": email, "user_name": user_name, "code": signup_code},
                        # )

                    data = {"username": user.username, "Email": user.email}
                    return api_response(200, "Account Approved Successfully", data)

        return api_response(400, "Token is not valid/expired", {})

    def post(self, request, *args, **kwargs):
        permission_classes = (IsAuthenticated,)
        email = request.data["email"]
        current_user = request.user

        if email == current_user.email:
            send_approval(request, email, tenant=current_user.tenant)
            data = {"username": current_user.username, "Email": current_user.email}
            return api_response(200, "Activation link sent to you registered email", data)
        return api_response(400, "Invalid email id", {})


class Rejected(APIView):
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
                if user.approved is True:
                    data = {"username": user.username, "Email": user.email}
                    return api_response(200, "Account is Approved ", data)
                else:
                    if user.is_verified_email is True:
                        data = {"username": user.username, "Email": user.email}
                        return api_response(200, "Account Already Rejected", data)

                    else:
                        user.is_verified_email = True
                        user.approved = False
                        user.save()
                        if user.role_id == 1:
                            compile_email("employer.rejected", request, user, data={"email": user.email})
                        if user.role_id == 2:
                            compile_email("skilling.rejected", request, user, data={"email": user.email})
                        data = {"username": user.username, "Email": user.email}
                        return api_response(200, "Account Rejected Successfully", data)

        return api_response(400, "Token is not valid/expired", {})

    def post(self, request, *args, **kwargs):
        permission_classes = (IsAuthenticated,)
        email = request.data["email"]
        current_user = request.user
        if email == current_user.email:
            send_approval(request, email, tenant=current_user.tenant)
            data = {"username": current_user.username, "Email": current_user.email}
            return api_response(200, "Activation link sent to you registered email", data)
        return api_response(400, "Invalid email id", {})
