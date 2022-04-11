from django.db import models
from core.models.users import User
from job.models.jobs import Job


class MatchScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="match_score")
    paramter_1 = models.CharField(null=True, blank=True, max_length=191)
    paramter_2 = models.CharField(null=True, blank=True, max_length=191)
    paramter_3 = models.CharField(null=True, blank=True, max_length=191)
    paramter_4 = models.CharField(null=True, blank=True, max_length=191)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "match_scores"
