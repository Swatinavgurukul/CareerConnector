import uuid
from django.db import models
from core.models.tenant import Tenant
from core.models.users import User
from job.models.jobs import Job
from job.models.job_applications import JobApplication
from core.models.master_survey import Survey


class SurveyFeedBack(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    tenant = models.ForeignKey(Tenant, on_delete=models.DO_NOTHING)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="_survey", null=True, blank=True)
    job = models.ForeignKey(Job, on_delete=models.DO_NOTHING, null=True, blank=True)
    application = models.ForeignKey(JobApplication, on_delete=models.DO_NOTHING, null=True, blank=True)
    submitted_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, blank=True)
    answers = models.JSONField(null=True, blank=True)
    is_submitted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "survey_feedback"
        verbose_name_plural = "survey_feedbacks"
