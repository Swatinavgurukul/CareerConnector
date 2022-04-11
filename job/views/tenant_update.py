from rest_framework.views import APIView
from core.models.users import User
from core.models.tenant import Tenant
from core.helpers import api_response
from job.models.job_applications import JobApplication
from job.models.job_status import JobStatus
from resume.models.work import Work
from resume.models.certificate import Certification
from resume.models.education import Education
from resume.models.achievement import Achievement
from job.models.jobs import Job
from resume.models.profile import Profile
from resume.models.skill import Skills
from core.models.profile_setting import ProfileSetting
from core.models.partner_setting import PartnerSetting


class TenantUpdate(APIView):
    def post(self, request):
        source_tenant = request.data.get("source_tenant")
        update_tenant = request.data.get("update_tenant")

        user_data = User.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in user_data:
            tenant_data = Tenant.objects.get(id=update_tenant)
            user_update = User.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)

        application_data = JobApplication.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in application_data:
            tenant_data = Tenant.objects.get(id=update_tenant)
            application = JobApplication.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)

        application_data_npp = JobApplication.objects.filter(job_tenant=source_tenant).values("job_tenant", "id")
        for user_id in application_data_npp:
            tenant_data = Tenant.objects.get(id=update_tenant)
            application = JobApplication.objects.filter(id=user_id["id"]).update(job_tenant=tenant_data.id)

        status_data_npp = JobStatus.objects.filter(job_tenant=source_tenant).values("job_tenant", "id")
        for user_id in status_data_npp:
            tenant_data = Tenant.objects.get(id=update_tenant)
            status = JobStatus.objects.filter(id=user_id["id"]).update(job_tenant=tenant_data.id)

        status_data = JobStatus.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in status_data:
            tenant_data = Tenant.objects.get(id=update_tenant)
            status = JobStatus.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)

        job_data = Job.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in job_data:
            tenant_data = Tenant.objects.get(id=update_tenant)
            detail = Job.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)

        profile_data = Profile.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in profile_data:
            tenant_data = Tenant.objects.get(id=update_tenant)
            detail = Profile.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)

        work_data = Work.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in work_data:
            tenant_data = Tenant.objects.get(id=update_tenant)
            detail = Work.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)

        certification_data = Certification.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in certification_data:
            tenant_data = Tenant.objects.get(id=update_tenant)
            detail = Certification.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)

        education_data = Education.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in education_data:
            tenant_data = Tenant.objects.get(id=update_tenant)
            detail = Education.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)

        achievement_data = Achievement.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in achievement_data:
            tenant_data = Tenant.objects.get(id=update_tenant)
            detail = Achievement.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)

        skill_data = Skills.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in skill_data:
            tenant_data = Tenant.objects.get(id=update_tenant)
            detail = Skills.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)

        profile_setting = ProfileSetting.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in profile_setting:
            tenant_data = Tenant.objects.get(id=update_tenant)
            detail = ProfileSetting.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)

        partner_setting = PartnerSetting.objects.filter(tenant_id=source_tenant).values("tenant_id", "id")
        for user_id in partner_setting:
            tenant_data = Tenant.objects.get(id=update_tenant)
            detail = PartnerSetting.objects.filter(id=user_id["id"]).update(tenant_id=tenant_data)
        return api_response(200, "Successfully", str(update_tenant))