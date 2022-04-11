from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from core.helpers import api_response
from core.models.users import User
from core.task import send_asynchronous_email
from core.serializers.serializers import UserListSerializer
from core.permissions import IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from core.serializers.serializers import MyTokenObtainPairSerializer


class UserFeedback(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        from_email = request.user.email
        email_address = ["prahlad@simplifyvms.com", "simplifyhire@simplifyworkforce.zohodesk.com"]
        subject = request.data.get("type")
        body = request.data.get("description")
        send_asynchronous_email.delay(email_address, subject, body, html_content=None)
        return api_response(200, "Email sent successfully", {})


class UserList(generics.ListAPIView):
    permission_classes = (
        IsAuthenticated,
        IsAdminUser,
    )
    queryset = User.objects.filter(approved=1, is_staff=1)
    serializer_class = UserListSerializer


class Impersonate(APIView):
    permission_classes = (
        IsAuthenticated,
        IsAdminUser,
    )
    serializer_class = MyTokenObtainPairSerializer

    def get(self, request):
        user = int(request.query_params.get("user_id", None))
        user = User.objects.get(id=user)
        token = RefreshToken.for_user(user)
        data = {
            "user_id": user.id,
            "role_id": user.role_id,
            "tenant_name": user.tenant.name,
            "is_user": not user.is_superuser,
            "full_name": "{} {}".format(user.first_name, user.last_name),
            "access_token": str(token.access_token),
            "refresh_token": str(token),
        }
        return Response(data)


class UserConsentAPI(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        user.is_consent = True
        user.save()

        return api_response(200, "successfully", {})
