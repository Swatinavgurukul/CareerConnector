from django.db import models


class Skill(models.Model):
    tenant = models.CharField(max_length=191, null=True, blank=True)
    name = models.CharField(max_length=191, null=True, blank=True)
    parent_name = models.CharField(max_length=191, null=True, blank=True)
    score = models.PositiveIntegerField(null=True, blank=True)
    overall_percentage = models.PositiveIntegerField(null=True, blank=True)
    parent_percentage = models.PositiveIntegerField(null=True, blank=True)
    sov_id = models.CharField(max_length=191, null=True, blank=True)
    required = models.BooleanField(default=True, null=True, blank=True)
    user_created = models.BooleanField(default=False, null=True, blank=True)
    last_used = models.CharField(max_length=191, null=True, blank=True)
    language_preference = models.CharField(max_length=191, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "master_skill"