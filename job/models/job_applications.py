from django.db import models
from core.models.tenant import Tenant
from core.models.users import User
from job.models.jobs import Job
from datetime import datetime, timedelta


class JobApplication(models.Model):
    STATUS = [
        ("sourced", "Sourced"),
        ("applied", "Applied"),
        ("screening", "Phone screen"),
        ("interview", "Interview"),
        ("offered", "Offered"),
        ("rejected", "Rejected"),
        ("hired", "Hired"),
        ("declined", "Declined"),
        ("on-hold", "On hold"),
        ("withdrawn", "Withdrawn"),
    ]
    tenant = models.ForeignKey(Tenant, on_delete=models.DO_NOTHING)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    job = models.ForeignKey(Job, on_delete=models.DO_NOTHING)
    job_tenant = models.CharField(max_length=191, null=True, blank=True)
    current_status = models.CharField(max_length=191, choices=STATUS, default="applied")
    answer = models.TextField(null=True, blank=True)
    external = models.BooleanField(default=False, null=True, blank=True)
    hired = models.BooleanField(default=False, null=True, blank=True)
    interviewed = models.BooleanField(default=False, null=True, blank=True)
    comments = models.CharField(max_length=191, null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    sov_score = models.JSONField(null=True, blank=True)
    sov_data = models.JSONField(null=True, blank=True)
    c_tth = models.IntegerField(null=True, blank=True)
    weighted_score = models.CharField(max_length=191, null=True, blank=True)
    suggested_score = models.JSONField(null=True, blank=True)
    resume_id = models.CharField(max_length=20, null=True, blank=True)
    scheduled = models.BooleanField(default=False)
    scheduled_date = models.DateField(null=True, blank=True)
    scheduled_time = models.TimeField(null=True, blank=True)
    scheduled_duration = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username + "," + self.job.title

    class Meta:
        db_table = "job_applications"

    def save(self, *args, **kwargs):
        if self.current_status == "hired":
            today_date = datetime.today()
            self.c_tth = (today_date.date() - self.created_at.date()).days
            if self.c_tth == 0:
                self.c_tth = 1

        super().save(*args, **kwargs)
