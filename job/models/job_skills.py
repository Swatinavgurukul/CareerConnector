from django.db import models
from core.models.tenant import Tenant
from core.models.master_skill import Skill
from job.models.jobs import Job


class JobSkill(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    language = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "job_skill"
