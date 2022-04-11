from rest_framework import serializers
from job.models.jobs import Job
from job.models.job_applications import JobApplication
from job.models.job_bookmark import JobBookmark
from job.templatetags.job_function import job_status


protected = ("id", "tenant", "created_at", "updated_at")


class JobSearchSerializer(serializers.ModelSerializer):
    location = serializers.CharField(source="location.city", read_only=True)
    company = serializers.CharField(source="company.name", read_only=True)
    category = serializers.CharField(source="category.name", read_only=True)
    industry = serializers.CharField(source="industry.name", read_only=True)
    is_bookmarked = serializers.SerializerMethodField("get_bookmark")
    job_status = serializers.SerializerMethodField("get_job_status")

    class Meta:
        model = Job
        # fields = "__all__"
        exclude = ("tenant",)

    def get_bookmark(self, job):
        user_id = self.context["request"].user.id
        try:
            bookmark_object = JobBookmark.objects.get(job_id=job.id, user_id=user_id)
            return bookmark_object.is_bookmarked
        except JobBookmark.DoesNotExist:
            return False

    def get_job_status(self, job):
        status = job_status(job)
        return status