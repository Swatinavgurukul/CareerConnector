# Django Imports
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import smart_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from urllib.parse import urlparse
from django.contrib.auth.models import Group
from datetime import timezone
import datetime

# Local Imports
from core.helpers import api_response, compile_email
from core.serializers.hiring_member_serializers import (
    HiringMemberCreateSerializer,
    HiringMemberGetSerializer,
    AdminUserSerializer,
)
from core.models.users import User
from core.models.tenant import Tenant
from core.get_tenant import get_user_tenant

# RestFramework Imports
from rest_framework import generics
from rest_framework.permissions import IsAdminUser


class HiringMemberListView(generics.GenericAPIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):
        """To get all the members of a team in hring admin or recruiter admin logins"""

        tenant = get_user_tenant(request)
        yesterday = datetime.datetime.now(timezone.utc) - datetime.timedelta(days=1)
        # group = Group.objects.get(name="hiring_member")
        # users = User.objects.filter(role_id=group.id, tenant=tenant)
        # TODO: role_id 4 will be map with group name = 'hiring_member'
        users = None
        if request.user.role_id == 1:
            users = User.objects.filter(role_id=4, tenant=tenant)
        elif request.user.role_id == 2:
            users = User.objects.filter(role_id=5, tenant=tenant)
        elif request.GET.get("team_type", None) == "hiring":
            users = User.objects.filter(role_id=4)
        elif request.GET.get("team_type", None) == "recruiter":
            users = User.objects.filter(role_id=5)
        if users:
            serializer_data = HiringMemberGetSerializer(users, many=True)
            recent_count = users.filter(created_at__gte=yesterday)
            data = {
                "recent_count": recent_count.count(),
                "total_count": users.count(),
                "data": serializer_data.data,
            }
            return api_response(200, "members in a team retrieved successfully ", data)
        else:
            return api_response(404, "members does not exists in a team ", {})

    def post(self, request, *args, **kwargs):
        """"To create  member of a team from hring admin or recruiter admin logins"""

        if request.user.role_id in [1, 2]:
            tenant = get_user_tenant(request)
        else:
            tenant_id = request.data.get("tenant")
            tenant = Tenant.objects.get(id=tenant_id)

        team_type = request.data.get("team_type", None)
        job_title = request.data.get("job_title", None)
        created_by = request.data.get("created_by", None)
        if request.user.role_id == 1 or team_type == "hiring":
            role_id = 4
        elif request.user.role_id == 2 or team_type == "recruiter":
            role_id = 5
        if request.user.role_id in [1, 2]:
            created_by = request.user.id
        elif created_by:
            created_by = int(created_by)
        else:
            created_by = None
        serializer = HiringMemberCreateSerializer(
            data=request.data,
            context={
                "team_type": team_type,
                "tenant_id": tenant,
                "create": True,
                "job_title": job_title,
                "role_id": role_id,
                "created_by": created_by,
                "request": request,
            },
        )
        if serializer.is_valid():
            user = serializer.save()
            email = user.email
            lang = user.locale
            if user.is_active:
                if request.user.first_name is not None and request.user.last_name is not None:
                    hiring_admin_name = request.user.first_name + " " + request.user.last_name
                else:
                    hiring_admin_name = request.user.username
                hiring_admin_name = hiring_admin_name.title()
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
                    "hiring.member.setpassword",
                    request,
                    user,
                    data={"email": email, "hiring_admin_name": hiring_admin_name},
                    cta={"text": "Set Password", "url": absurl},
                )

            data = {
                "user_name": user.username,
                "email": email,
            }
            return api_response(201, "member Created in a team", data)
        else:
            return api_response(400, "Invalid data", serializer.errors)


class HiringMemberDetailView(generics.GenericAPIView):
    permission_classes = (IsAdminUser,)

    def put(self, request, member_id, *args, **kwargs):
        """"To update member of a team in  hiring admin or recruiter admin login"""
        admin_params = {}
        if request.user.role_id not in [1, 2]:
            tenant_id = request.data.get("tenant", None)
            admin_params["tenant"] = Tenant.objects.get(id=tenant_id)
            admin_params["admin_partner"] = request.data.get("admin_partner", None)

        job_title = request.data.get("job_title", None)
        active_check = False
        try:
            user = User.objects.get(id=member_id)
            if user.is_active is True:
                active_check = True
        except User.DoesNotExist:
            return api_response(404, "User Does Not Exist", {})
        serializer = HiringMemberCreateSerializer(
            user,
            data=request.data,
            context={"old_mail": user.email, "job_title": job_title, "admin_params": admin_params},
        )
        if serializer.is_valid():
            serializer.save()
            if (active_check is False) and (serializer.data["is_active"] is True):
                if request.user.first_name is not None and request.user.last_name is not None:
                    hiring_admin_name = request.user.first_name + " " + request.user.last_name
                else:
                    hiring_admin_name = request.user.username
                hiring_admin_name = hiring_admin_name.title()
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
                compile_email(
                    "hiring.member.setpassword",
                    request,
                    user,
                    data={"email": email, "hiring_admin_name": hiring_admin_name},
                    cta={"text": "Set Password", "url": absurl},
                )

            return api_response(200, "member Updated in a team", serializer.data)
        else:
            return api_response(400, "Invalid data", serializer.errors)


class AdminUserListView(generics.GenericAPIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):
        """To get all the admin users based on role id"""

        tenant = get_user_tenant(request)
        role_ids = eval(request.GET.get("role_ids"))
        if role_ids:
            users = User.objects.filter(tenant=tenant, role_id__in=role_ids, is_active=True)
            serializer_data = AdminUserSerializer(users, many=True)
            return api_response(200, "admin users retrieved successfully", serializer_data.data)
        else:
            return api_response(404, "admin users does not exists", {})