from django.db import models
from core.models.tenant import Tenant


class JobTemplate(models.Model):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    job_title = models.CharField(unique=True, db_index=True, max_length=191)
    description = models.TextField(null=True, blank=True)
    responsibilities = models.TextField(null=True, blank=True)
    requirements = models.TextField(null=True, blank=True)
    language_preference = models.CharField(max_length=191, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "job_templates"
