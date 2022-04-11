from rest_framework import serializers
from core.models.tenant_theme import TenantTheme


class TenantThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantTheme
        fields = "__all__"
