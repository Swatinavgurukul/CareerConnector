from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from core.models.users import User
from core.helpers import send_simple_message, api_response
from django.template.loader import get_template
from rest_framework.views import APIView
from django.urls import reverse
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework_simplejwt.tokens import RefreshToken
from chatbot.serializers.serializers import RegisterChatBotSerializer, SetNewPasswordSerializer
from django.db.models import Q
from urllib.parse import urlparse

# from job.models.job_questions import JobQuestion
from job.models.jobs import Job
from core.models.tenant import Tenant
import json
import requests
from core.models.tenant import Tenant
import ast
from core.task import send_asynchronous_email


class ChatbotEmail(APIView):
    """Api"""

    def post(self, request):
        email = request.data["email"]
        if User.objects.filter(email=email).exists():
            data = {"account": 1, "email": email}
            return api_response(Response.status_code, "Account exits", data)
        else:
            data = {"account": 0, "email": email}
            return api_response(Response.status_code, "Account does not exists ", data)


# def get_tokens_for_user(user):
#     refresh = RefreshToken.for_user(user)

#     return {
#         "refresh": str(refresh),
#         "access": str(refresh.access_token),
#     }


# class RegisterChatBotAPI(generics.GenericAPIView):
#     serializer_class = RegisterChatBotSerializer
#     queryset = User.objects.all()
#     # parser_classes = (MultiPartParser, FormParser)

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.query_params)
#         if serializer.is_valid():
#             user = serializer.save(request)
#             user_data = serializer.data
#             user = User.objects.get(email=user_data["email"])

#             send_email_reset(request, user.email)

#             token = get_tokens_for_user(user)

#             data = {
#                 "id": user.id,
#                 "email": user.email,
#                 "username": user.username,
#                 "first_name": user.first_name,
#                 "last_name": user.last_name,
#                 "chat_id": str(user.chat_id),
#                 "access_token": token["access"],
#             }
#             return api_response(status.HTTP_201_CREATED, "Registration successfully done", data)

#         else:
#             return api_response(status.HTTP_400_BAD_REQUEST, "Invalid data", serializer.errors)


# class SetNewPasswordAPI(generics.GenericAPIView):
#     serializer_class = SetNewPasswordSerializer

#     def post(self, request):
#         serializer = self.serializer_class(data=request.query_params)
#         if serializer.is_valid():
#             user_data = serializer.save(request)
#             return api_response(status.HTTP_201_CREATED, "Password updated successfully", serializer.data)
#         else:
#             return api_response(status.HTTP_400_BAD_REQUEST, "Invalid data", serializer.errors)


# def send_email_set(request, email):
#     """
#     Send Reset Link to registered email address
#     """
#     if User.objects.filter(email=email).exists():
#         user = User.objects.get(email=email)
#         uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
#         token = PasswordResetTokenGenerator().make_token(user)
#         send_email_password_set(request, email, user, uidb64, token)
#         return api_response(
#             200,
#             "We have sent you a link to reset your password",
#             {"uidb64": uidb64, "token": token},
#         )


# def send_email_password_set(request, email, user, uidb64, token):
#     path = request.build_absolute_uri()
#     url_parse = urlparse(path)
#     base_url = url_parse.scheme + "://" + url_parse.netloc
#     absurl = base_url + "/setpassword?" + "uidb64=" + uidb64 + "&" + "token=" + token
#     email_template = get_template("emails/set_password.html")
#     html_content = email_template.render({"message": absurl})
#     # body = "Hi " + user.username + " Use link below to reset your password \n" + absurl
#     body = None
#     email_address = user.email
#     subject = "Set Your Password"
#     # send_simple_message(email_address, subject, body, html_content)
#     send_asynchronous_email.delay(email_address, subject, body, html_content)


def save_question_data(instance, interview_questions=None):
    try:
        data = instance.interview_questions
        question_data = ast.literal_eval(data)
        user = User.objects.get(pk=instance.user.id)
        job = Job.objects.get(pk=instance.id)
        tanant = Tenant.objects.get(pk=instance.tenant.id)

        for questions in question_data:
            identifier = None
            types = None
            options = None
            answer = None
            question = None

            if questions.get("id") is not None:
                identifier = questions.get("id")
            if questions.get("type") is not None:
                types = questions.get("type")
            if questions.get("options") is not None:
                options = questions.get("options")
            if questions.get("answer") is not None:
                answer = questions.get("answer")
            if questions.get("question") is not None:
                question = questions.get("question")

            JobQuestion.objects.create(
                identifier=identifier,
                tenant=tanant,
                user=user,
                job=job,
                types=types,
                options=options,
                answer=answer,
                question=question,
            )
    except Exception as e:
        print("Not saved properly", str(e))
