from django.db import models
from core.models.tenant import Tenant
from core.models.users import User
from job.models.jobs import Job
from job.models.job_applications import JobApplication


class JobStatus(models.Model):
    STATUS = [
        ("sourced", "Sourced"),
        ("applied", "Applied"),
        ("screening", "Phone screen"),
        ("interview", "Interview"),
        ("offered", "Offered"),
        ("hired", "Hired"),
        ("declined", "Declined"),
        ("on-hold", "On hold"),
        ("withdrawn", "Withdrawn"),
    ]
    tenant = models.ForeignKey(Tenant, on_delete=models.DO_NOTHING)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    job = models.ForeignKey(Job, on_delete=models.DO_NOTHING, related_name="job_status")
    application = models.ForeignKey(JobApplication, on_delete=models.DO_NOTHING)
    job_tenant = models.CharField(max_length=191, null=True, blank=True)
    status = models.CharField(max_length=191, choices=STATUS, default="applied")
    datestamp = models.DateTimeField(auto_now=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "job_status"
        verbose_name_plural = "job_status"