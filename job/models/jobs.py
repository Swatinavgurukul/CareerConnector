from django.db import models
from core.models.tenant import Tenant
from core.models.users import User
from core.models.location import Location
from job.models.job_industry import Industry
from job.models.job_category import Category
from job.models.job_company import JobCompany
from job.models.job_qualifications import JobQualification
from job.models.job_type import JobType
from job.utils.slug_generator import unique_slug_generator
from django.db.models.signals import pre_save
from datetime import datetime, timedelta


class Job(models.Model):
    STATUS = [
        ("active", "Active"),
        ("closed", "Closed"),
        ("draft", "Draft"),
        ("paused", "Paused"),
        ("Offered", "Offered"),
    ]

    SALARY_TYPE = [
        ("Per Year", "Per Year"),
        ("Per Hour", "Per Hour"),
        ("Per Week", "Per Week"),
        ("Per Month", "Per Month"),
        ("Biweekly", "Biweekly"),
        ("Per Day", "Per Day"),
        ("Quarter", "Quarter"),
        ("Other", "Other"),
        ("Piece Rate", "Piece Rate"),
    ]

    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, blank=True, null=True)
    company = models.ForeignKey(JobCompany, on_delete=models.CASCADE, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True)
    industry = models.ForeignKey(Industry, on_delete=models.CASCADE, blank=True, null=True)
    qualification = models.ForeignKey(JobQualification, on_delete=models.CASCADE, blank=True, null=True)
    job_type = models.ForeignKey(JobType, on_delete=models.CASCADE, blank=True, null=True)

    title = models.CharField(null=True, blank=True, max_length=191)
    title_esp = models.CharField(null=True, blank=True, max_length=191)
    title_fr = models.CharField(null=True, blank=True, max_length=191)
    description = models.BinaryField(null=True, blank=True)
    description_esp = models.BinaryField(null=True, blank=True)
    description_fr = models.BinaryField(null=True, blank=True)
    short_description = models.BinaryField(null=True, blank=True)
    remote_location = models.BooleanField(default=False)
    slug = models.SlugField(max_length=191, null=True, blank=True, unique=True)

    status = models.CharField(max_length=191, choices=STATUS, null=True, default="active", blank=True)
    salary_frequency = models.CharField(max_length=191, choices=SALARY_TYPE, null=True, default="Per Month", blank=True)
    openings = models.PositiveIntegerField(null=True, blank=True)
    source = models.CharField(max_length=191, null=True, blank=True)
    interview_questions = models.TextField(null=True, blank=True)
    salary_min = models.PositiveIntegerField(default=0, null=True, blank=True)
    salary_max = models.PositiveIntegerField(null=True, blank=True)
    currency = models.CharField(null=True, blank=True, max_length=191)
    hours_per_week = models.PositiveIntegerField(null=True, blank=True)
    role = models.CharField(max_length=191, null=True, blank=True)
    designation = models.CharField(max_length=191, null=True, blank=True)
    contact_name = models.CharField(max_length=191, null=True, blank=True)
    contact_email = models.EmailField(max_length=191, null=True, blank=True)

    display_name = models.CharField(max_length=191, null=True, blank=True)
    country = models.CharField(max_length=191, null=True, blank=True)
    state = models.CharField(max_length=191, null=True, blank=True)
    latitude = models.CharField(max_length=191, null=True, blank=True)
    longitude = models.CharField(max_length=191, null=True, blank=True)
    place_id = models.CharField(max_length=191, null=True, blank=True)

    level = models.CharField(null=True, blank=True, max_length=191)
    experience = models.CharField(max_length=191, null=True, blank=True)
    experience_min = models.PositiveIntegerField(default=0, null=True, blank=True)
    experience_max = models.PositiveIntegerField(null=True, blank=True)
    company_name = models.CharField(null=True, blank=True, max_length=191)
    is_processed = models.BooleanField(default=False)
    language = models.CharField(null=True, blank=True, max_length=191)
    benefits = models.TextField(null=True, blank=True)

    job_file_id = models.FileField(upload_to="job/", null=True, blank=True)

    zip_recruiter = models.BooleanField(default=False)
    broadbean = models.BooleanField(default=False)
    linkedin = models.BooleanField(default=False)
    indeed_jb = models.BooleanField(default=False)
    monster_jb = models.BooleanField(default=False)
    adzuna_jb = models.BooleanField(default=False)
    nexxt_jb = models.BooleanField(default=False)
    google_jb = models.BooleanField(default=False)
    careerjet_jb = models.BooleanField(default=False)
    facebook_jb = models.BooleanField(default=False)
    simplifyhired_jb = models.BooleanField(default=False)
    snaga_jb = models.BooleanField(default=False)
    getwork_jb = models.BooleanField(default=False)
    glassdoor_jb = models.BooleanField(default=False)
    neuvoo_jb = models.BooleanField(default=False)
    jooble_jb = models.BooleanField(default=False)
    careerbuilder_jb = models.BooleanField(default=False)
    dice_jb = models.BooleanField(default=False)
    flex_jb = models.BooleanField(default=False)

    vms_source_job_id = models.CharField(null=True, blank=True, max_length=191)
    vms_job_reference = models.CharField(max_length=191, null=True, blank=True)
    vms_job_internal_reference = models.CharField(max_length=191, null=True, blank=True)

    sov_managementscore = models.FloatField(null=True, blank=True)
    sov_managementlevel = models.CharField(null=True, blank=True, max_length=191)
    executive_type = models.CharField(null=True, blank=True, max_length=191)
    sov_language = models.TextField(null=True, blank=True, max_length=191)
    sov_degree_type = models.CharField(null=True, blank=True, max_length=191)
    sov_degree_name = models.CharField(null=True, blank=True, max_length=191)
    sov_min_years = models.CharField(null=True, blank=True, max_length=191)
    sov_required_degree = models.CharField(null=True, blank=True, max_length=191)
    sov_skill_name = models.CharField(null=True, blank=True, max_length=191)
    sov_skill_id = models.PositiveIntegerField(null=True, blank=True)
    sov_skill_percent = models.FloatField(null=True, blank=True)

    sovren_index_id = models.CharField(null=True, max_length=191, blank=True)
    sovren_document_id = models.CharField(null=True, max_length=191, blank=True)
    mongo_object_id = models.CharField(null=True, max_length=191, blank=True)

    custom_field1 = models.CharField(max_length=200, blank=True, null=True)  ## addition fields
    custom_field2 = models.CharField(max_length=200, blank=True, null=True)
    custom_field3 = models.CharField(max_length=200, blank=True, null=True)
    custom_field4 = models.CharField(max_length=200, blank=True, null=True)
    work_flow_id = models.IntegerField(default=1, blank=True, null=True)
    job_start_date = models.DateField(null=True, blank=True)
    expires_in = models.PositiveIntegerField(default=30, null=True, blank=True)
    publish_job_in_days = models.PositiveIntegerField(null=True, blank=True)
    job_end_date = models.DateField(null=True, blank=True)
    job_publish_date = models.DateField(null=True, blank=True)

    users = models.ManyToManyField(
        User, related_name="jobusers", help_text="Users (ep admin and ep members) assign to this job", blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "jobs"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.status == "active":
            if self.expires_in is None:
                self.expires_in = 30
            if self.job_start_date is None:
                self.job_start_date = datetime.today().date()
            if self.job_start_date and self.status == "active":
                self.job_end_date = self.job_start_date + timedelta(days=self.expires_in)
            if self.job_start_date and self.publish_job_in_days and self.status == "active":
                self.job_publish_date = self.job_start_date + timedelta(days=self.publish_job_in_days)
        else:
            pass
        super().save(*args, **kwargs)

    # def description_to_string(self):
    #     try:
    #         if self.description:
    #             return self.description.decode("utf-8", errors="ignore")
    #         else:
    #             return None
    #     except AttributeError:
    #         pass

    # def short_description_to_string(self):
    #     try:
    #         if self.short_description:
    #             return self.short_description.decode("utf-8", errors="ignore")
    #         else:
    #             return None
    #     except AttributeError:
    #         pass


def job_pre_save_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = unique_slug_generator(instance)
    if instance.title is not None:
        if len(instance.title) < 2:
            instance.title = None
    if instance.title_esp is not None:
        if len(instance.title_esp) < 2:
            instance.title_esp = None
    if instance.title_fr is not None:
        if len(instance.title_fr) < 2:
            instance.title_fr = None


pre_save.connect(job_pre_save_receiver, sender=Job)
