from django.db import models
from core.models.tenant import Tenant
from core.models.master_qualification import Qualification


class JobQualification(models.Model):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    # master_qualification = models.ForeignKey(Qualification, on_delete=models.DO_NOTHING, null=True, blank=True)
    education = models.CharField(db_index=True, null=True, blank=True, max_length=191)
    specialization = models.CharField(null=True, blank=True, max_length=191)
    user_created = models.BooleanField(default=False)
    language_preference = models.CharField(max_length=191, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "job_qualifications"
