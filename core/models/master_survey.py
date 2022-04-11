from django.db import models
from core.models.tenant import Tenant
from core.models.users import User
from core.models.master_questions import Question

EVENTS = [
        ("job-closed", "JobClosed"),
        ("post-interview", "PostInterview"),
    ]


class Survey(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=600)
    description = models.TextField(null=True, blank=True)
    event = models.CharField(max_length=191, choices=EVENTS, default="post-interview")
    is_active = models.BooleanField(default=True)
    questions = models.ManyToManyField(Question, blank=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.DO_NOTHING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "master_survey"

