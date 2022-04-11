from django.db import models
from core.models.tenant import Tenant
from core.models.users import User
from job.models.jobs import Job


class UserJobMatch(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    identifier = models.CharField(max_length=191, null=True, blank=True)
    response_id = models.CharField(max_length=191, null=True, blank=True)
    great_match = models.CharField(max_length=191, null=True, blank=True)
    weighted_score = models.CharField(max_length=191, null=True, blank=True)
    reverse_compatibility_score = models.CharField(max_length=191, null=True, blank=True)
    index_id = models.CharField(max_length=191, null=True, blank=True)
    unweighted_category_scores = models.JSONField(null=True)
    sov_score = models.CharField(null=True, max_length=191, blank=True)
    enriched_score = models.JSONField(null=True)
    enriched_rcs_score = models.JSONField(null=True)
    suggested_score = models.JSONField(null=True, blank=True)
    mongo_object_id = models.CharField(null=True, max_length=191, blank=True)
    discover = models.BooleanField(default=False, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_job_match"
