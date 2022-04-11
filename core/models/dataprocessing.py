from django.db import models
from core.models.users import User


class DataProcessing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=191, null=True, blank=True)
    file = models.FileField(upload_to="resume/", null=True, blank=True)
    is_uploaded = models.BooleanField(default=False)
    is_parsed = models.BooleanField(default=False)
    is_processed = models.BooleanField(default=False)
    comment = models.CharField(max_length=191, null=True, blank=True)
    token = models.CharField(max_length=191, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "data_processing"
