from django.db import models
from core.models.users import User
from core.models.tenant import Tenant
from job.models.job_category import Category


class PartnerSetting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    department = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True)
    job_title = models.CharField(null=True, blank=True, max_length=191)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "partner_setting"