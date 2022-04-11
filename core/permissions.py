from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """
    Allows access only to ADMIN user with id==1.
    """

    def has_permission(self, request, view):
        return bool(request.user.id == 1)
