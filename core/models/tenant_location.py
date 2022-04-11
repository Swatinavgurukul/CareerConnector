from django.db import models
from core.models.tenant import Tenant


class TenantLocation(models.Model):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    latitude = models.DecimalField(max_digits=18, decimal_places=15, null=True, blank=True)
    longitude = models.DecimalField(max_digits=18, decimal_places=15, null=True, blank=True)
    google_place_id = models.CharField(max_length=191, null=True, blank=True)
    radius = models.PositiveIntegerField(null=True, blank=True)
    slug = models.SlugField(max_length=191, null=True, blank=True, unique=True)
    cover_image = models.CharField(max_length=191, null=True, blank=True)
    welcome_text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tenant_location"