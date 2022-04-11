from django.db import models
from core.models.tenant import Tenant
from job.models.jobs import Job
from core.models.users import User


class JobBookmark(models.Model):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="bookmarks")
    is_bookmarked = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.job.title

    class Meta:
        db_table = "job_bookmarks"
