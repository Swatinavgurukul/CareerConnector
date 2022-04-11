from rest_framework import serializers
from job.models.jobs import Job
from job.models.job_alerts import JobAlert

# from job.models.job_rejections import JobRejection
from job.models.job_applications import JobApplication
from job.models.job_status import JobStatus
from job.models.job_bookmark import JobBookmark
from django.utils import timezone
from datetime import timedelta, datetime
import base64
from django.utils.datastructures import MultiValueDictKeyError
from core.models.tenant import Tenant
from core.models.users import User

protected = ("id", "tenant", "user", "created_at", "updated_at")


class JobGetSerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField("get_description")
    short_description = serializers.SerializerMethodField("get_short_description")
    description_esp = serializers.SerializerMethodField("get_description_esp")
    description_fr = serializers.SerializerMethodField("get_description_fr")
    job_type = serializers.CharField(source="job_type.name", read_only=True)
    location = serializers.CharField(source="location.city", read_only=True)
    company = serializers.CharField(source="company.name", read_only=True)
    company_name = serializers.CharField(source="tenant.name", read_only=True)
    company_logo = serializers.CharField(source="company.logo", read_only=True)
    company_domain = serializers.CharField(source="company.domain", read_only=True)
    company_description = serializers.CharField(source="company.description", read_only=True)
    company_founded_year = serializers.CharField(source="company.year_founded", read_only=True)
    company_city = serializers.CharField(source="company.location.city", read_only=True)
    company_country = serializers.CharField(source="company.location.country_code", read_only=True)
    category = serializers.CharField(source="category.name", read_only=True)
    industry = serializers.CharField(source="industry.name", read_only=True)
    qualification = serializers.CharField(source="qualification.education", read_only=True)
    job_posted_user = serializers.CharField(source="user.username", read_only=True)
    benefits = serializers.CharField(source="company.benefits", read_only=True)
    mission = serializers.CharField(source="company.mission", read_only=True)
    vision = serializers.CharField(source="company.vision", read_only=True)
    is_bookmarked = serializers.SerializerMethodField("get_bookmark")
    process_status = serializers.SerializerMethodField("get_process_status")
    early_applicant = serializers.SerializerMethodField("get_early_applicant")
    applied = serializers.SerializerMethodField("get_user_applied_job")
    applied_at = serializers.SerializerMethodField("get_applied_date")
    job_subscribed = serializers.SerializerMethodField("get_subscribed_job")
    logged_in_email = serializers.SerializerMethodField("get_logged_in_email")
    total_applications = serializers.SerializerMethodField("get_application_count")
    yesterday_applications = serializers.SerializerMethodField("yesterday_application_count")
    skills = serializers.SerializerMethodField()
    withdrawn_at = serializers.SerializerMethodField("get_withdrawn_date")

    class Meta:
        model = Job
        exclude = ("tenant", "user")

    def get_description(self, job):
        if job.description is not None:
            encoded_data = job.description
            return encoded_data.decode("utf-8")
        return job.description

    def get_short_description(self, job):
        if job.short_description is not None:
            encoded_data = job.short_description
            return encoded_data.decode("utf-8")
        return job.short_description

    def get_description_esp(self, job):
        if job.description_esp is not None:
            encoded_data = job.description_esp
            return encoded_data.decode("utf-8")
        return job.description_esp

    def get_description_fr(self, job):
        if job.description_fr is not None:
            encoded_data = job.description_fr
            return encoded_data.decode("utf-8")
        return job.description_fr

    def get_bookmark(self, job):
        user_id = self.context["request"].user.id
        try:
            bookmark_object = JobBookmark.objects.get(job=job, user_id=user_id)
            return bookmark_object.is_bookmarked
        except JobBookmark.DoesNotExist:
            return False

    def get_process_status(self, job):
        posted = timezone.now() - job.updated_at
        days = posted.days
        if days <= 3:
            return "New Job"
        elif JobApplication.objects.filter(job_id=job.id).exclude(current_status="applied"):
            return "Actively Hiring"
        else:
            return None

    def get_early_applicant(self, job):
        posted = timezone.now() - job.updated_at
        days = posted.days
        if days > 3 and JobApplication.objects.filter(job_id=job.id).count() <= 10:
            return "Be an early applicant"
        else:
            return None

    def get_user_applied_job(self, job):
        user_id = self.context["request"].user.id
        try:
            applied_obj = JobApplication.objects.get(job_id=job.id, user_id=user_id)
            return applied_obj.current_status
        except JobApplication.DoesNotExist:
            return False

    def get_applied_date(self, job):
        user_id = self.context["request"].user.id
        try:
            applied_obj = JobApplication.objects.get(job_id=job.id, user_id=user_id)
            js = JobStatus.objects.filter(application=applied_obj, user_id=user_id, status="applied").order_by(
                "-created_at"
            )[0]
            return js.created_at
        except JobApplication.DoesNotExist:
            return False

    def get_subscribed_job(self, job):
        if self.context["request"].user.is_anonymous:
            email = None
        else:
            email = self.context["request"].user.email
        try:
            JobAlert.objects.get(job_id=job.id, email=email)
            return True
        except JobAlert.DoesNotExist:
            return False

    def get_logged_in_email(self, job):
        user = self.context["request"].user
        if user.is_anonymous:
            return None
        else:
            return user.email

    def get_application_count(self, job):
        return JobApplication.objects.filter(job=job).count()

    def yesterday_application_count(self, job):
        yesterday = timezone.now() - timedelta(days=1)
        return JobApplication.objects.filter(job=job, created_at__contains=yesterday.date()).count()

    def get_skills(self, job):
        skills = []
        try:
            jobskills = self.context["jobskills"]
            if jobskills:
                for jobskill in jobskills:
                    js = dict(id=jobskill.skill.id, name=jobskill.skill.name, language=jobskill.language)
                    skills.append(js)
            return skills
        except KeyError:
            return skills

    def get_withdrawn_date(self, job):
        user_id = self.context["request"].user.id
        try:
            applied_obj = JobApplication.objects.get(job_id=job.id, user_id=user_id)
            if applied_obj.current_status == "withdrawn":
                return applied_obj.updated_at
            else:
                return False
        except JobApplication.DoesNotExist:
            return False


class JobCreateSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True)
    description = serializers.ModelField(model_field=Job()._meta.get_field("description"), required=True)
    short_description = serializers.ModelField(model_field=Job()._meta.get_field("short_description"), required=True)

    def to_internal_value(self, data):
        errors = []
        data._mutable = True
        reference = datetime.now()
        data["job_reference"] = reference.strftime("%d%H%M%S%f")
        date_time = reference.strftime("%m%d%H%M%S-%f")
        data["job_internal_reference"] = str("simplify-") + date_time
        try:
            data["title"] == None
        except Exception as error:
            errors.append(error)
        try:
            data["description"] = base64.encodebytes(data["description"].encode())
        except Exception as error:
            errors.append(error)
        try:
            data["short_description"] = base64.encodebytes(data["short_description"].encode())
        except Exception as error:
            errors.append(error)
        if len(errors):
            raise serializers.ValidationError({"The following fields are required": errors})
        return super().to_internal_value(data)

    class Meta:
        model = Job
        exclude = protected


class JobUpdateSerializer(serializers.ModelSerializer):
    description = serializers.ModelField(model_field=Job()._meta.get_field("description"), required=False)
    short_description = serializers.ModelField(model_field=Job()._meta.get_field("short_description"), required=False)

    def to_internal_value(self, data):
        data._mutable = True
        reference = datetime.now()
        data["job_reference"] = reference.strftime("%d%H%M%S%f")
        date_time = reference.strftime("%m%d%H%M%S-%f")
        data["job_internal_reference"] = str("simplify-") + date_time
        try:
            data["description"] = base64.encodebytes(data["description"].encode())
        except MultiValueDictKeyError:
            pass
        try:
            data["short_description"] = base64.encodebytes(data["short_description"].encode())
        except MultiValueDictKeyError:
            pass
        return super().to_internal_value(data)

    class Meta:
        model = Job
        exclude = protected


class JobApplySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        exclude = protected


class JobAlertSerializer(serializers.ModelSerializer):
    email = serializers.CharField(required=True)

    class Meta:
        model = JobAlert
        fields = ["email"]


class BookMarkSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(source="job.slug", read_only=True)
    title = serializers.CharField(source="job.title", read_only=True)
    title_esp = serializers.CharField(source="job.title_esp", read_only=True)
    title_fr = serializers.CharField(source="job.title_fr", read_only=True)
    company_name = serializers.CharField(source="job.company.name", read_only=True)
    company_logo = serializers.URLField(source="job.company.logo", read_only=True)
    company = serializers.CharField(source="job.company_name", read_only=True)
    salary_min = serializers.IntegerField(source="job.salary_min", read_only=True)
    salary_max = serializers.IntegerField(source="job.salary_max", read_only=True)
    country = serializers.CharField(source="job.country", read_only=True)
    experience_min = serializers.IntegerField(source="job.experience_min", read_only=True)
    experience_max = serializers.IntegerField(source="job.experience_max", read_only=True)
    applied = serializers.SerializerMethodField("get_user_applied_job")

    class Meta:
        model = JobBookmark
        fields = (
            "job_id",
            "slug",
            "title",
            "title_esp",
            "title_fr",
            "created_at",
            "company_name",
            "company_logo",
            "company",
            "salary_min",
            "salary_max",
            "country",
            "experience_min",
            "experience_max",
            "applied",
        )

    def get_user_applied_job(self, bookmark):
        user_id = self.context["request"].user.id
        try:
            applied_obj = JobApplication.objects.get(job_id=bookmark.job.id, user_id=user_id)
            return applied_obj.current_status
        except JobApplication.DoesNotExist:
            return False


class AppliedJobsSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(source="job.slug", read_only=True)
    title = serializers.CharField(source="job.title", read_only=True)
    title_esp = serializers.CharField(source="job.title_esp", read_only=True)
    title_fr = serializers.CharField(source="job.title_fr", read_only=True)
    company_name = serializers.CharField(source="job.company.name", read_only=True)
    company_logo = serializers.URLField(source="job.company.logo", read_only=True)
    company = serializers.CharField(source="job.company_name", read_only=True)
    salary_min = serializers.IntegerField(source="job.salary_min", read_only=True)
    salary_max = serializers.IntegerField(source="job.salary_max", read_only=True)
    country = serializers.CharField(source="job.country", read_only=True)
    experience_min = serializers.IntegerField(source="job.experience_min", read_only=True)
    experience_max = serializers.IntegerField(source="job.experience_max", read_only=True)
    applied = serializers.SerializerMethodField("get_user_applied_job")
    status_change_date = serializers.SerializerMethodField("get_status_change_date")

    class Meta:
        model = JobApplication
        fields = (
            "job_id",
            "slug",
            "title",
            "title_esp",
            "title_fr",
            "created_at",
            "company_name",
            "company_logo",
            "current_status",
            "company",
            "salary_min",
            "salary_max",
            "country",
            "experience_min",
            "experience_max",
            "applied",
            "status_change_date",
            "answer",
        )

    def get_user_applied_job(self, bookmark):
        user_id = self.context["request"].user.id
        try:
            applied_obj = JobApplication.objects.get(job_id=bookmark.job.id, user_id=user_id)
            return applied_obj.current_status
        except JobApplication.DoesNotExist:
            return False

    def get_status_change_date(self, application):
        return application.updated_at


class CompareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"


# jobrejection table has removed now
# class JobRejectionSerializer(serializers.ModelSerializer):
#     source_job_id = serializers.CharField(required=True)

#     class Meta:
#         model = JobRejection
#         fields = "__all__"


class JobAppliedSerializer(serializers.ModelSerializer):
    applied = serializers.SerializerMethodField("get_applied_job_details")

    class Meta:
        model = Job
        fields = ("applied", "title", "id")

    def get_applied_job_details(self, job):
        user_id = self.context["request"].user.id
        try:
            applied_obj = JobApplication.objects.get(job_id=job.id, user_id=user_id)
            return applied_obj.current_status
        except JobApplication.DoesNotExist:
            return False


class JobCreateNewSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True)
    custom_field1 = serializers.CharField(required=True)

    class Meta:
        model = Job
        exclude = protected


class WithdrawApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ("current_status", "comments")


class HiringTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "tenant",
            "first_name",
            "last_name",
            "email",
            "username",
        )
