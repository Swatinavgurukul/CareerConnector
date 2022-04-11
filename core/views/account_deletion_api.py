from core.helpers import api_response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from resume.models.profile import Profile
from resume.models.achievement import Achievement
from resume.models.certificate import Certification
from resume.models.education import Education
from resume.models.language import Language
from resume.models.skill import Skills
from resume.models.training import Training
from resume.models.work import Work
from resume.models.user_preferences import IndustryPreference
from job.models.user_job_match import UserJobMatch
from job.models.jobs import Job
from job.models.job_applications import JobApplication
from job.models.job_bookmark import JobBookmark
from job.models.job_status import JobStatus
from notification.models.notifications import JobNotification
from job.models.email_templates import EmailTemplate
from core.models.dataprocessing import DataProcessing
from core.models.feedback import FeedbackForm
from core.models.partner_setting import PartnerSetting
from core.models.profile_setting import ProfileSetting
from core.models.users import User
from recruiter.models.candidate_note import RecruiterCandidateNote
from recruiter.models.message import UserMessage
from core.helpers import compile_email


class DeactivateAccountView(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        current_user = request.user
        password = request.data.get("password")
        comment = request.data.get("comment")
        if current_user.check_password(password):
            current_user.delete_comment = comment
            current_user.is_active = False
            current_user.is_locked = True
            # send account deactivation email
            compile_email("user.account.deactivate", request, current_user, data={"email": current_user.email})
            # stop all email triggers to that email
            current_user.is_verified_email = False
            current_user.save()
            applications = JobApplication.objects.filter(user=current_user)
            for application in applications:
                application.current_status = "withdrawn"
                application.save()
                JobStatus.objects.create(
                    user=current_user,
                    application=application,
                    tenant=current_user.tenant,
                    job_tenant=application.job.tenant.id,
                    status=application.current_status,
                    job=application.job,
                )
            return api_response(200, "Account Deactivated Successfully.", {})
        else:
            return api_response(400, "Password entered is incorrect.", {})


class DeleteAccountView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request):
        current_user = request.user
        password = request.data.get("password")
        comment = request.data.get("comment")
        if current_user.check_password(password):
            # delete all the entries of tables associated with user
            current_user.delete_comment = comment
            current_user.save()
            Profile.objects.filter(user=current_user).delete()
            ProfileSetting.objects.filter(user=current_user).delete()
            PartnerSetting.objects.filter(user=current_user).delete()
            Achievement.objects.filter(user=current_user).delete()
            Certification.objects.filter(user=current_user).delete()
            Education.objects.filter(user=current_user).delete()
            Language.objects.filter(user=current_user).delete()
            Skills.objects.filter(user=current_user).delete()
            Training.objects.filter(user=current_user).delete()
            Work.objects.filter(user=current_user).delete()
            IndustryPreference.objects.filter(user=current_user).delete()
            UserJobMatch.objects.filter(user=current_user).delete()
            Job.objects.filter(user=current_user).delete()
            # JobApplication.objects.filter(user=current_user).delete()
            # JobStatus.objects.filter(user=current_user).delete()
            JobBookmark.objects.filter(user=current_user).delete()
            JobNotification.objects.filter(user=current_user).delete()
            EmailTemplate.objects.filter(user=current_user).delete()
            DataProcessing.objects.filter(user=current_user).delete()
            FeedbackForm.objects.filter(user=current_user).delete()
            RecruiterCandidateNote.objects.filter(user=current_user).delete()
            UserMessage.objects.filter(user=current_user).delete()
            applications = JobApplication.objects.filter(user=current_user)
            for application in applications:
                application.current_status = "withdrawn"
                application.save()
                JobStatus.objects.create(
                    user=current_user,
                    application=application,
                    tenant=current_user.tenant,
                    job_tenant=application.job.tenant.id,
                    status=application.current_status,
                    job=application.job,
                )
            current_user.delete()
            return api_response(200, "Account deleted successfully.", {})
        else:
            return api_response(400, "Password entered is incorrect.", {})
