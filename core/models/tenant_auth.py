from django.db import models
from core.models.tenant import Tenant


class TenantAuth(models.Model):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    service = models.IntegerField()
    app_key = models.CharField(max_length=191)
    api_secret = models.CharField(max_length=191)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = "tenant_external_auth"
