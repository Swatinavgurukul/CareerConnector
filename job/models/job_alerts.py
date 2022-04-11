from django.db import models
from core.models.tenant import Tenant
from core.models.users import User
from job.models.jobs import Job


class JobAlert(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    #user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    email = models.EmailField(max_length=191, null=True, blank=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="alerts")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "job_alerts"
