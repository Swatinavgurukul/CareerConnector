from django.db import models
from core.models.tenant import Tenant


class TenantTheme(models.Model):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    footer_primary = models.CharField(max_length=191, blank=True, default="#0267c1")
    footer_secondary = models.CharField(max_length=191, blank=True, default="#3a3042")
    logo = models.CharField(max_length=191, null=True, blank=True)
    header_primary = models.CharField(max_length=191, blank=True, default="#FFFFFF")
    banner = models.CharField(max_length=191, null=True, blank=True)
    search_logo = models.CharField(max_length=191, null=True, blank=True)
    favicon = models.CharField(max_length=191, null=True, blank=True)
    title = models.CharField(max_length=191, null=True, blank=True)
    footer_social = models.BooleanField(default=False)
    footer_social_links = models.JSONField(blank=True, default=dict)
    header_banner = models.CharField(max_length=191, null=True, blank=True)
    header_logo_route = models.CharField(max_length=191, blank=True, default="/")
    footer_text = models.CharField(max_length=191, null=True, blank=True)
    accent_color = models.CharField(max_length=191, blank=True, default="#0267c1")
    support_mail = models.EmailField(max_length=225, unique=True, null=True, blank=True)
    google_login = models.BooleanField(default=True, blank=True, null=True)
    linkedin_login = models.BooleanField(default=True, blank=True, null=True)

    custom_field1 = models.CharField(max_length=191, blank=True, null=True)  ## addition fields
    custom_field2 = models.CharField(max_length=191, blank=True, null=True)
    custom_field3 = models.CharField(max_length=191, blank=True, null=True)
    custom_field4 = models.CharField(max_length=191, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tenant_theme"
