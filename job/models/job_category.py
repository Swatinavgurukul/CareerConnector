from core.models.tenant import Tenant
from django.db import models


class JobCategoryWeight(models.Model):
    name = models.CharField(max_length=191, null=True, blank=True)
    weight = models.CharField(max_length=1000, null=True, blank=True)

    class Meta:
        db_table = "job_category_weight"


class Category(models.Model):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    score_category = models.ForeignKey(JobCategoryWeight, on_delete=models.DO_NOTHING, null=True, blank=True)
    # master_category = models.ForeignKey(Category, on_delete=models.DO_NOTHING, null=True, blank=True)
    name = models.CharField(db_index=True, max_length=191, null=True, blank=True)
    user_created = models.BooleanField(default=False)
    language_preference = models.CharField(max_length=191, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "job_category"
