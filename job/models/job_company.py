from django.db import models
from core.models.tenant import Tenant
from core.models.location import Location
from core.models.master_company import Company


class JobCompany(models.Model):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE, null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.DO_NOTHING, null=True, blank=True)
    # master_company = models.ForeignKey(Company, on_delete=models.DO_NOTHING, null=True, blank=True)
    name = models.CharField(max_length=191, null=True, blank=True)
    domain = models.CharField(max_length=191, null=True, blank=True)
    domain_aliases = models.TextField(max_length=2000, null=True, blank=True)
    employee_count = models.CharField(max_length=191, null=True, blank=True)
    logo = models.CharField(max_length=191, null=True, blank=True)
    year_founded = models.CharField(max_length=191, null=True, blank=True)
    benefits = models.TextField(max_length=2000, null=True, blank=True)
    mission = models.TextField(max_length=2000, null=True, blank=True)
    vision = models.TextField(max_length=2000, null=True, blank=True)
    sector = models.CharField(max_length=191, null=True, blank=True)
    tags = models.CharField(max_length=191, null=True, blank=True)
    description = models.TextField(max_length=2000, null=True, blank=True)
    linkedin_url = models.CharField(max_length=191, null=True, blank=True)
    linkedin_code = models.CharField(max_length=191, null=True, blank=True)
    user_created = models.BooleanField(default=False)
    language_preference = models.CharField(max_length=191, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "job_company"
