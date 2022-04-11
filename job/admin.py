from django.contrib import admin
from job.models.jobs import Job
from job.models.job_applications import JobApplication
from job.models.job_qualifications import JobQualification
from job.models.job_bookmark import JobBookmark
from job.models.email_templates import EmailTemplate
from job.models.job_alerts import JobAlert
from job.models.job_company import JobCompany
from job.models.job_templates import JobTemplate


class JobAdmin(admin.ModelAdmin):
    list_display = ["id", "tenant", "title"]
    search_fields = (
        "tenant__id",
        "title",
        "id",
    )


class BookmarkAdmin(admin.ModelAdmin):
    list_display = ["id", "tenant", "user", "job", "is_bookmarked"]


class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ["id", "tenant", "job", "user"]


class JobStatusAdmin(admin.ModelAdmin):
    list_display = ["id", "tenant", "job", "user", "status"]


admin.site.register(Job, JobAdmin)
admin.site.register(JobApplication, JobApplicationAdmin)
admin.site.register(JobBookmark, BookmarkAdmin)
# admin.site.register(JobStatus, JobStatusAdmin)
admin.site.register(JobQualification)
admin.site.register(EmailTemplate)
admin.site.register(JobAlert)
admin.site.register(JobCompany)
admin.site.register(JobTemplate)
