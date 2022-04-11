from rest_framework import permissions
from core.models.tenant import Tenant
from core.get_tenant import get_user_tenant


class IsOwnerOnly(permissions.BasePermission):
    """
    Object-level permission to only allow Recruiter to post Job in Respective tenant.
    """

    def has_permission(self, request, view):
        if get_user_tenant(request).id == request.user.tenant_id:
            if request.user.is_superuser:
                return True
            else:
                return False
        return False


class IsUserOnly(permissions.BasePermission):
    """
    Allows access only to normal users.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser == 0)
