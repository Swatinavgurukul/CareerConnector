#from core.models.tenant import Tenant
from django.db import models


class Category(models.Model):
    #tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    name = models.CharField(db_index=True, max_length=191, null=True, blank=True)
    language_preference = models.CharField(max_length=191, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "master_category"