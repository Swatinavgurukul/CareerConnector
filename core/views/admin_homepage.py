from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from core.models.users import User
from core.helpers import api_response
from core.models.tenant import Tenant
from core.serializers.admin_homepage_serializers import AdminHomeGetSerializer
from core.helpers import compile_email
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes
from django.utils.http import urlsafe_base64_encode
from urllib.parse import urlparse
from django.utils.encoding import force_text
from core.models.exclude_users import ExcludeUser


class AdminHomePageView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        exclude_users = list(
            ExcludeUser.objects.filter(
                request_by=request.user.id, exclude_from="admin_approval_candidates_list"
            ).values_list("user", flat=True)
        )
        users = User.objects.select_related("tenant").filter(role_id__in=[1, 2]).order_by("-created_at")
        context = {"exclude_users": exclude_users}
        serializer = AdminHomeGetSerializer(users, many=True, context=context)
        return api_response(200, "Users fetched successfully", serializer.data)

    def put(self, request, user_id):
        data = request.data
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return api_response(404, "user not found", {})
        if data["current_status"] == "approved":
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
            # compile_email("approval", request, user, data={"email": user.email})
        elif data["current_status"] == "rejected":
            user.is_verified_email = True
            user.approved = False
            user.save()
            # compile_email("rejected", request, user, data={"email": user.email})
            if user.role_id == 1:
                compile_email("employer.rejected", request, user, data={"email": user.email})
            if user.role_id == 2:
                compile_email("skilling.rejected", request, user, data={"email": user.email})
        else:
            return api_response(404, "page not found", {})
        return api_response(200, "Approval Status Updated", {"current_status": data["current_status"]})


class AdminUserCount(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        data = {}
        admin_users = User.objects.select_related("tenant").filter(role_id__in=[1, 2])
        admin_users_count = admin_users.count()
        ep_count = User.objects.select_related("tenant").filter(role_id=1).count()
        npp_count = User.objects.select_related("tenant").filter(role_id=2).count()
        pending_count = admin_users.filter(is_verified_email=False, approved=False) | admin_users.filter(
            is_verified_email=False, approved=True
        )
        pending_count = pending_count.count()
        rejected_count = admin_users.filter(is_verified_email=True, approved=False).count()
        approved_count = admin_users.filter(is_verified_email=True, approved=True).count()
        archive_count = ExcludeUser.objects.all().count()
        data.update(
            {
                "admin_users_count": admin_users_count,
                "ep_count": ep_count,
                "npp_count": npp_count,
                "pending_count": pending_count,
                "rejected_count": rejected_count,
                "approved_count": approved_count,
                "archive_count": archive_count,
            }
        )
        return api_response(200, "admin users count retrieved successfully", data)


class AdminDashboardERDView(APIView):
    permission_classes = (IsAdminUser,)

    def put(self, request, user_id):
        data = request.data
        try:
            user = User.objects.select_related("tenant").get(id=user_id)
        except User.DoesNotExist:
            return api_response(404, "user not found", {})
        if data["erd_status"] is True:
            user.tenant.erd = True
            user.tenant.save()
        elif data["erd_status"] is False:
            user.tenant.erd = False
            user.tenant.save()

        else:
            return api_response(404, "page not found", {})

        return api_response(200, "ERD Status Updated", {"erd_status": data["erd_status"]})
