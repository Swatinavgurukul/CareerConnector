from rest_framework import serializers
from job.models.job_templates import JobTemplate


class JobTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobTemplate
        exclude = ("tenant",)