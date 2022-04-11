from django.db import models
from core.models.tenant import Tenant


class JobType(models.Model):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(null=True, blank=True, max_length=191)
    user_created = models.BooleanField(default=True)
    language_preference = models.CharField(max_length=191, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "job_type"
