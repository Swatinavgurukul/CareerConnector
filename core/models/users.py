from django.db import models
from core.models.tenant import Tenant
from multiselectfield import MultiSelectField
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from timezone_field import TimeZoneField
import os
from core.models.location import Location
import uuid


class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("User Must Have an Email address")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password, **extra_fields):
        user = self.create_user(email, username, password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)


NOTIFICATION_FREQUENCY = [
    ("immediate", "immediate"),
    ("daily", "daily"),
    ("weekely", "weekely"),
]

PREFERENCE_CHOICES = [
    ("job_creation", "Job Creation"),
    ("job_apply", "Job Apply"),
    ("reset_password", "Reset Password"),
]


class User(AbstractBaseUser, PermissionsMixin):
    tenant = models.ForeignKey(Tenant, max_length=20, on_delete=models.CASCADE, null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.DO_NOTHING, null=True, blank=True)

    email = models.EmailField(verbose_name="email", max_length=225)
    secondary_email = models.EmailField(max_length=225, null=True, blank=True)
    username = models.CharField(max_length=191, unique=True)
    title = models.CharField(max_length=20, null=True, blank=True)
    first_name = models.CharField(max_length=191, null=True, blank=True)
    last_name = models.CharField(max_length=191, null=True, blank=True)
    user_image = models.URLField(max_length=400, blank=True, null=True)
    profile_image = models.FileField(upload_to="image/", null=True, blank=True)
    area_code = models.CharField(max_length=20, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    role_id = models.PositiveIntegerField(null=True, blank=True)
    notication_frequency = models.CharField(
        max_length=191, choices=NOTIFICATION_FREQUENCY, default="immediate", null=True
    )
    is_notification_jobs = models.BooleanField(default=True, null=True, blank=True)
    email_notification_preference = MultiSelectField(choices=PREFERENCE_CHOICES, null=True, blank=True)
    daily_jobs_summary = models.BooleanField(default=False)
    weekely_jobs_summary = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_user = models.BooleanField(default=True)
    approved = models.BooleanField(null=True, default=False)
    is_available = models.BooleanField(default=True, null=True, blank=True)
    is_locked = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_verified_mobile = models.BooleanField(default=False)
    is_verified_email = models.BooleanField(default=False)

    linkedin_id = models.CharField(null=True, max_length=191, blank=True)
    facebook_id = models.CharField(null=True, max_length=191, blank=True)
    google_id = models.CharField(null=True, max_length=191, blank=True)
    indeed_id = models.CharField(null=True, max_length=191, blank=True)

    resume_id = models.CharField(null=True, max_length=191, blank=True)
    resume_file = models.FileField(upload_to="resume/", null=True, blank=True)
    is_resume_parsed = models.BooleanField(default=False, null=True, blank=True)

    sovren_index_id = models.CharField(null=True, max_length=191, blank=True)
    sovren_document_id = models.CharField(null=True, max_length=191, blank=True)
    mongo_object_id = models.CharField(null=True, max_length=191, blank=True)

    custom_field1 = models.CharField(max_length=191, blank=True, null=True)
    custom_field2 = models.CharField(max_length=191, blank=True, null=True)
    custom_field3 = models.CharField(max_length=191, blank=True, null=True)
    custom_field4 = models.CharField(max_length=191, blank=True, null=True)
    is_consent = models.BooleanField(default=False, null=True, blank=True)
    city = models.CharField(max_length=191, null=True, blank=True)
    country = models.CharField(max_length=191, null=True, blank=True)
    state = models.CharField(max_length=191, null=True, blank=True)
    latitude = models.CharField(max_length=191, null=True, blank=True)
    longitude = models.CharField(max_length=191, null=True, blank=True)
    place_id = models.CharField(max_length=191, null=True, blank=True)

    is_ca = models.BooleanField(default=False, null=True, blank=True)
    
    chat_id = models.UUIDField(default=uuid.uuid4, unique=True)
    timezone = TimeZoneField(default="Asia/Kolkata")
    locale = models.CharField(max_length=191, default="en")

    created_by = models.ForeignKey("self", null=True, blank=True, on_delete=models.DO_NOTHING)
    delete_comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = UserManager()

    REQUIRED_FIELDS = [
        "email",
    ]
    USERNAME_FIELD = "username"

    class Meta:
        unique_together = (("tenant_id", "email"),)
        db_table = "users"

    def get_username(self):
        return self.email

    @property
    def user_percentage_complete_score(self):
        percent = {"name": 10, "email": 5, "phone": 5}
        total = 0
        if self.email:
            total += percent.get("email", 0)
        if self.first_name or self.last_name:
            total += percent.get("name", 0)
        if self.phone:
            total += percent.get("phone", 0)
        return total

    @property
    def check_resume(self):
        percent = {"resume_file": 20}
        score = 0
        if self.resume_file:
            score += percent.get("resume_file", 0)
        return score

    @property
    def resume_name(self):
        try:
            return os.path.basename(self.resume_file.name)
        except TypeError:
            return ""

    def __str__(self):
        return self.email

    @property
    def get_role_name(self):
        if not self.role_id and self.is_superuser:
            return {"name": "Admin", "display_name": "Admin"}
        elif not self.role_id and not self.is_superuser:
            return {"name": "Job Seeker", "display_name": "Job Seeker"}
        elif self.role_id == 1:
            return {"name": "Hiring Manager", "display_name": "Hiring Manager"}
        elif self.role_id == 2:
            return {"name": "Recruiter", "display_name": "Recruiter"}
        elif self.role_id == 4:
            return {"name": "Hiring Member", "display_name": "Member"}
        elif self.role_id == 5:
            return {"name": "Recruiter Member", "display_name": "Member"}
        else:
            return {"name": "", "display_name": ""}

    @property
    def get_full_name(self):
        first_name = self.first_name
        last_name = self.last_name
        if first_name is not None and last_name is not None:
            user_full_name = "{} {}".format(first_name, last_name)
        elif first_name is not None:
            user_full_name = first_name
        elif last_name is not None:
            user_full_name = last_name
        else:
            user_full_name = self.email
        return user_full_name

    def save(self, *args, **kwargs):
        self.validate_unique()
        super(User, self).save(*args, **kwargs)
