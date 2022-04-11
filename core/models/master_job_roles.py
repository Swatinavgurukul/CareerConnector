from django.db import models
from .users import User


class JobRoles(models.Model):
    name = models.CharField(db_index=True, max_length=191, help_text="language EN")
    esp_name = models.CharField(max_length=191, null=True, blank=True, help_text="language ESP")
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.DO_NOTHING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "master_job_roles"
