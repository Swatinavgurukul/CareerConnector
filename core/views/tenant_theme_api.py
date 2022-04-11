from rest_framework.views import APIView
from core.models.tenant import Tenant
from rest_framework.permissions import IsAdminUser
from core.models.tenant_theme import TenantTheme
from core.helpers import api_response
from core.serializers.tenant_theme_serializers import TenantThemeSerializer
from core.get_tenant import get_user_tenant
from urllib.parse import urlparse


class TenantThemeView(APIView):
    """
    Get the theme based on tenant Id.
    """

    def get(self, request):
        tenant = get_user_tenant(request)
        try:
            theme_obj = TenantTheme.objects.get(tenant=tenant)
        except TenantTheme.DoesNotExist:
            theme_obj = TenantTheme.objects.get(tenant_id=1)
        serializer = TenantThemeSerializer(theme_obj)
        return api_response(200, "Theme retrieved successfully", serializer.data)


class TenantThemeV2View(APIView):

    """
    get tenant theme
    """
    def get(self, request):
        path = request.build_absolute_uri()
        url_parse = urlparse(path)
        base_url = url_parse.hostname
        try:
            tenant = Tenant.objects.get(base_url=base_url)
            theme_obj = TenantTheme.objects.get(tenant=tenant)
        except (Tenant.DoesNotExist, TenantTheme.DoesNotExist):
            theme_obj = TenantTheme.objects.get(tenant_id=1)
        serializer = TenantThemeSerializer(theme_obj)
        return api_response(200, "Theme retrieved successfully", serializer.data)
