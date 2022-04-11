from django.db import models
from core.models.tenant import Tenant


class TenantPreference(models.Model):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    employment_type = models.CharField(max_length=20)
    rate = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tenant_preferences"