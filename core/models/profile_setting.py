from django.db import models
from core.models.users import User
from core.models.tenant import Tenant

# from job.models.job_company import JobCompany
# from job.models.job_industry import Industry

##discuss
class ProfileSetting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    location_preference = models.JSONField(null=True, blank=True)

    #Salary
    expected_min_salary = models.PositiveIntegerField(null=True, blank=True)
    expected_max_salary = models.PositiveIntegerField(null=True, blank=True)
    expected_currency = models.CharField(null=True, blank=True, max_length=191)
    salary_per = models.CharField(max_length=191, null=True, blank=True)

    #Availability
    availability_now = models.BooleanField(default=False)  # Temporary
    availability_date = models.DateField(max_length=191, null=True, blank=True)
    looking_for_offers = models.BooleanField(default=False)

    #notification
    notify_primary_email = models.BooleanField(default=True)
    notify_secondary_email = models.BooleanField(default=False)
    notify_phone = models.BooleanField(default=False)
    blocked_companies = models.JSONField(null=True, blank=True)
    language_preference = models.CharField(max_length=191, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.JSONField(null=True)
    job_roles_preference = models.JSONField(null=True, blank=True)
    job_types = models.JSONField(null=True, blank=True)
    company_size = models.JSONField(null=True, blank=True)

    #Work Authorization
    authorized_countries = models.JSONField(null=True, blank=True)
    remote_work_policy = models.CharField(null=True, blank=True, max_length=191)

    class Meta:
        db_table = "profile_setting"
