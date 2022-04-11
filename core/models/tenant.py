from django.db import models
from django.http import Http404
from urllib.parse import urlparse


class Tenant(models.Model):
    base_url = models.URLField(null=True, max_length=191)
    name = models.CharField(null=True, max_length=191)
    key = models.CharField(null=True, max_length=8)
    gated = models.BooleanField(null=True, default=True)
    approved = models.BooleanField(null=True, default=False)
    primary_user_id = models.CharField(null=True, max_length=20)
    is_active = models.BooleanField(null=True, default=True)
    theme = models.JSONField(null=True)
    quota_user = models.CharField(null=True, max_length=20)
    config_linkedin_sso = models.BooleanField(null=True, default=False)
    config_facebook_id = models.BooleanField(null=True, default=False)
    job_url = models.CharField(max_length=191, blank=True, null=True)
    detect_location = models.BooleanField(null=True, default=False)
    is_canada = models.BooleanField(null=True, default=False)
    b_title = models.CharField(max_length=191, blank=True, null=True)
    b_first_name = models.CharField(max_length=191, blank=True, null=True)
    b_last_name = models.CharField(max_length=191, blank=True, null=True)
    b_phone = models.CharField(max_length=191, blank=True, null=True)
    b_phone_sec = models.CharField(max_length=191, blank=True, null=True)
    b_email = models.EmailField(blank=True, null=True)
    b_address = models.TextField(blank=True, null=True)
    billing = models.BooleanField(null=True, default=False)
    logo_url = models.URLField(blank=True, null=True)
    logo_image = models.FileField(upload_to="logo/", null=True, blank=True)
    b_area_code = models.CharField(max_length=20, null=True, blank=True)
    erd = models.BooleanField(null=True, default=True)
    custom_field1 = models.CharField(max_length=191, blank=True, null=True)
    custom_field2 = models.CharField(max_length=191, blank=True, null=True)
    custom_field3 = models.CharField(max_length=191, blank=True, null=True)
    custom_field4 = models.CharField(max_length=191, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tenants"

    # def get_tenant(request):
    #     path = request.build_absolute_uri()
    #     url_parse = urlparse(path)
    #     base_url = url_parse.hostname
    #     if base_url == "127.0.0.1" or base_url == "localhost":
    #         return Tenant.objects.get(id=1)
    #     try:
    #         tenant = Tenant.objects.get(base_url=base_url)
    #     except Tenant.DoesNotExist:
    #         raise Http404("Tenant Not found")
    #     return tenant
