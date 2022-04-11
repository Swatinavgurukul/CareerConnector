from django.urls import path
from core.views.authentication_api import (
    Logout,
    RegisterAPI,
    ChangePasswordView,
    VerifyEmailToken,
    ChangeEmailView,
    VerifyMyEmailView,
    RequestPasswordResetEmail,
    SetNewPasswordAPIView,
    MyTokenObtainPairView,
    ActivateUserAccount,
)
from core.views.social_api import GoogleLoginView, LoginViaLinkedinView, IndeedLoginView
from core.views.useractivity import UserActivityAPI
from core.views.availablity_api import AvailabilityApiView
from core.views.location_api import LocationApiView
from core.views.translation import TranslationView, LanguageTranslationView, LanguageTranslationCreateView
from core.views.feedback import FeedbackView
from core.views.tenant_theme_api import TenantThemeView, TenantThemeV2View
from core.views.mailgun_api import MailDomainListView, MailDomainDetailView
from core.views.profile_setting_api import (
    ProfileSettingView,
    GetSalaryPreferencesView,
    GetIndustriesView,
    IndustryPreferenceView,
)
from rest_framework_simplejwt import views as jwt_views
from core.views.partner_profile_setting_api import (
    PartnerProfileSettingView,
    PartnerBillingProfileSettingView,
    TenantKeyGetView,
    OnboardingBillingView,
    GetOnboardDetailsView,
    OnboardLogoAPI,
)
from core.views.register_api import (
    RegisterHiringAPI,
    RegisterRecruiterAPI,
    ActivateAdminAccount,
    RecuriterPasswordSetEmail,
    NewPasswordAPIView,
)
from core.views.user_feedback import UserFeedback, UserList, Impersonate, UserConsentAPI
from core.views.approval import Approval, Rejected
from core.views.admin_jobseeker import AllJobSeekerView, AllPartnersView, AllSkillingPartnerAdminView
from core.views.admin_jobs import (
    AdminJobGetView,
    AllEmployeePartnerAdminView,
    AllEmployeePartnersView,
    AdminJobCreateView,
    AdminJobStatusView,
)
from core.views.admin_applications import AdminApplicantView
from core.views.admin_report import (
    CurrentPipelineReport,
    CurrentPipelineDownloadReport,
    PipelineReport,
    PipelineDownloadReport,
    CandidateSucessMetricReport,
    CandidateSucessMetricDownloadReport,
    ApplicationSourceReport,
    ApplicationSourceDownloadReport,
    AdminSurveyListView,
    AdminSurveyDetailView,
    SurveyFeedbackReport,
    SurveyFeedbackSummary,
    AuditLoginReport,
    AuditLoginCaReport,
    SurveyFeedbackCaReport,
    AdminSurveyCaListView,
    AdminSurveyCaDetailView,
    SurveyFeedbackCaSummary,
)
from core.views.admin_dashboard import (
    AdminFillRateView,
    AdminApplicationSourceView,
    AdminJobSeekerDensityView,
    AdminUpcomingInterviewsView,
    AdminDashboardCountView,
)
from core.views.admin_homepage import AdminHomePageView, AdminUserCount, AdminDashboardERDView
from core.views.onboarding import OnboardingView

from core.views.profile_setting_api import GetAllEmployeePartnersView
from core.views.user_detail import UserDetailAPI
from core.views.sso_login import SSOUser, SSORegisterAPI
from core.views.app_token import Oauth2ApplicationDataView
from core.views.users_csv import UserCsvAPI, UserApplicationAPI, JobAPI, TenantAPI
from core.views.partner_profile_setting_api import SkillingPartnerSettingView

from core.views.account_deletion_api import DeactivateAccountView, DeleteAccountView
from core.views.hiring_member_api import HiringMemberListView, HiringMemberDetailView, AdminUserListView
from core.views.get_dataset_view import GetSkillView, GetJobRolesView
from core.views.authv2 import RegisterView
from core.views.email_api import EmailView
from core.views.user_login import AccountLoginView
from core.views.users_ca_csv import UsersCsvView, UserApplicationsCsvView, JobsCsvView, TenantsCsvView

# from core.views.language_setting_api import LanguageSettingView

urlpatterns = [
    # path("",HomeTemplateView.as_view(), name="home"),
    # path("login", UserLoginView.as_view(), name="rest_login"),
    # jwt token
    # path("token", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token", MyTokenObtainPairView.as_view(), name="token_obtain"),
    path("token/refresh", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("logout", Logout.as_view(), name="rest_logout"),
    path("password/reset", RequestPasswordResetEmail.as_view(), name="password_reset"),
    path("password/reset/confirmPasswordReset", SetNewPasswordAPIView.as_view(), name="password_reset_done"),
    path("password/change", ChangePasswordView.as_view(), name="change_password"),
    path("register", RegisterAPI.as_view(), name="register_email"),
    path("user/email/change", ChangeEmailView.as_view(), name="change_email"),
    path("user/verifyemail", VerifyMyEmailView.as_view(), name="verify_email"),
    path("useractivity", UserActivityAPI.as_view(), name="activity"),
    path("useractivity/<int:pk>", UserActivityAPI.as_view(), name="activity"),
    path("user/available/<int:pk>", AvailabilityApiView.as_view(), name="availability"),
    path("user/location/<int:pk>", LocationApiView.as_view(), name="location"),
    path("user/verify", VerifyEmailToken.as_view(), name="email-verify"),
    path("translations/<str:file>", TranslationView),
    path("language/translation/create", LanguageTranslationCreateView.as_view()),
    path("language/translation/<str:lang>", LanguageTranslationView.as_view()),
    path("feedback", FeedbackView.as_view(), name="feedback"),
    path("mailgun/domain", MailDomainListView.as_view(), name="maildomain"),
    path("mailgun/domain/<str:domain_name>", MailDomainDetailView.as_view(), name="maildomain_name"),
    # profile setting single endpoint
    path("profilesetting", ProfileSettingView.as_view(), name="profile_setting"),
    path("setting/billingpartner", PartnerBillingProfileSettingView.as_view()),
    path("onboarding", OnboardingBillingView.as_view()),
    path("profilesetting/<int:pk>", ProfileSettingView.as_view(), name="profile_setting"),
    path("salarypreferences", GetSalaryPreferencesView.as_view(), name="salary_preferences"),
    path("industries", GetIndustriesView.as_view(), name="job_industries"),
    path("industry/preference", IndustryPreferenceView.as_view(), name="industry_create"),
    path("industry/preference/delete/<int:pk>", IndustryPreferenceView.as_view(), name="industry_delete"),
    # mail verification endpoint
    path("googlelogin", GoogleLoginView.as_view(), name="google_jwt_token"),
    path("linkedin_login", LoginViaLinkedinView.as_view(), name="LinkedinLogin"),
    path("indeed_login", IndeedLoginView.as_view(), name="IndeedLogin"),
    # activate User account
    path("activateuser", ActivateUserAccount.as_view(), name="activate_user_account"),  # user email activate
    path("sendverificationlink", ActivateUserAccount.as_view(), name="send_verification_link"),
    path("tenant/theme", TenantThemeView.as_view(), name="tenant_theme_api"),
    path("register/hiring", RegisterHiringAPI.as_view(), name="hiring_register"),
    path("register/recruiter", RegisterRecruiterAPI.as_view(), name="recruiter_register"),
    path("register/setpassword", RecuriterPasswordSetEmail.as_view(), name="RecuriterPasswordSetEmail"),
    path("register/setpassword/confirm", NewPasswordAPIView.as_view(), name="NewPasswordAPIView"),
    # Partner Settings (Recruiter or Hiring Manager)
    path("setting/partner", PartnerProfileSettingView.as_view()),
    path("setting/tenant/key", TenantKeyGetView.as_view()),
    path("activateadmin", ActivateAdminAccount.as_view(), name="activate_user_account"),  # admin email activate
    path("adminlink", ActivateAdminAccount.as_view(), name="send_verification_link"),
    path("user/feedback", UserFeedback.as_view(), name="user_feedback"),
    path("get_users", UserList.as_view(), name="user_list"),
    path("impersonate", Impersonate.as_view(), name="impersonate"),
    path("approval", Approval.as_view(), name="send_verification_link"),
    path("rejected", Rejected.as_view(), name="send_verification_link"),
    # admin api endpoints
    path("admin/alljobseeker", AllJobSeekerView.as_view(), name="job_seeker"),
    path("admin/alljobs", AdminJobGetView.as_view(), name="jobs"),
    path("admin/allapplication", AdminApplicantView.as_view(), name="applications"),
    path("admin/report/current", CurrentPipelineReport.as_view(), name="CurrentPipelineReport"),
    path(
        "admin/report/current/download", CurrentPipelineDownloadReport.as_view(), name="CurrentPipelineDownloadReport"
    ),
    path("admin/report/timetohire", PipelineReport.as_view(), name="PipelineReport"),
    path("admin/report/timetohire/download", PipelineDownloadReport.as_view(), name="PipelineDownloadReport"),
    path("admin/report/candidatemetric", CandidateSucessMetricReport.as_view(), name="CandidateSucessMetricReport"),
    path(
        "admin/report/candidatemetric/download",
        CandidateSucessMetricDownloadReport.as_view(),
        name="CandidateSucessMetricDownloadReport",
    ),
    path("admin/report/applicationsource", ApplicationSourceReport.as_view(), name="ApplicationSourceReport"),
    path(
        "admin/report/applicationsource/download",
        ApplicationSourceDownloadReport.as_view(),
        name="ApplicationSourceDownloadReport",
    ),
    path("admin/report/surveyfeedback/<int:id>", SurveyFeedbackReport.as_view(), name="SurveyFeedbackReport"),
    path("admin/dashboard/count", AdminDashboardCountView.as_view(), name="AdminDashboardCount"),
    path("admin/dashboard/source", AdminApplicationSourceView.as_view(), name="AdminApplicationSource"),
    path("admin/dashboard/fillrate", AdminFillRateView.as_view(), name="AdminFillRate"),
    path("admin/dashboard/jobseekerdensity", AdminJobSeekerDensityView.as_view(), name="AdminJobSeekerDensity"),
    path("admin/dashboard/upcominginterviews", AdminUpcomingInterviewsView.as_view(), name="AdminUpcomingInterviews"),
    path("admin/homepage", AdminHomePageView.as_view(), name="AdminHomePage"),
    path("admin/homepage/approval/<int:user_id>", AdminHomePageView.as_view()),
    path("admin/homepage/approval/user/count", AdminUserCount.as_view()),
    path("admin/partner", AllPartnersView.as_view(), name="AllPartner"),
    path("admin/skillingpartner/<int:user_id>", AllSkillingPartnerAdminView.as_view(), name="skillingpartner"),
    path("admin/employee", AllEmployeePartnersView.as_view(), name="EmployeePartner"),
    path("admin/employeepartner/<int:tenant_id>", AllEmployeePartnerAdminView.as_view(), name="employeepartner"),
    path("admin/job/create", AdminJobCreateView.as_view(), name="jobcreate"),
    path("admin/job/create/<str:slug>", AdminJobCreateView.as_view(), name="job"),
    path("admin/job/status/<str:slug>", AdminJobStatusView.as_view(), name="job_status"),
    path("onboardingdetails", GetOnboardDetailsView.as_view()),
    path("onboard/companylogo", OnboardLogoAPI.as_view()),
    path("onboard/", OnboardingView.as_view()),
    #
    path("profilesetting/employee", GetAllEmployeePartnersView.as_view()),
    path("userconsent", UserConsentAPI.as_view()),
    path("userdetail", UserDetailAPI.as_view()),
    path("sso_user", SSOUser.as_view()),
    path("register/sso", SSORegisterAPI.as_view()),
    path("apptoken/data", Oauth2ApplicationDataView.as_view()),
    path("user_csv", UserCsvAPI.as_view()),
    path("job_application", UserApplicationAPI.as_view()),
    path("jobs_csv", JobAPI.as_view()),
    path("tenant_csv", TenantAPI.as_view()),
    # csv for canada users
    path("user_csv/ca", UsersCsvView.as_view()),
    path("job_application/ca", UserApplicationsCsvView.as_view()),
    path("jobs_csv/ca", JobsCsvView.as_view()),
    path("tenant_csv/ca", TenantsCsvView.as_view()),
    # skilling partner company details
    path("setting/skillingpartner", SkillingPartnerSettingView.as_view()),
    # user account deletion
    path("user/account/deactivate", DeactivateAccountView.as_view()),
    path("user/account/delete", DeleteAccountView.as_view()),
    path("hiring/members/<int:member_id>", HiringMemberDetailView.as_view(), name="hiring_members_detail"),
    path("hiring/members", HiringMemberListView.as_view(), name="hiring_members"),
    path("adminusers/list", AdminUserListView.as_view(), name="manager_list"),
    path("skill/dataset", GetSkillView.as_view(), name="get_skills_dataset"),
    path("registercc", RegisterView.as_view(), name="signup"),
    # language preference setting
    # path("user/language/setting", LanguageSettingView.as_view()),
    path("admin/<str:slug>/allapplication", AdminApplicantView.as_view(), name="slug_applications"),
    path("jobs-roles", GetJobRolesView.as_view(), name="job_roles"),
    path("login", AccountLoginView.as_view(), name="login_api"),
    path("admin/reports/survey", AdminSurveyListView.as_view(), name="AdminSurveyList"),
    path("admin/reports/survey/ca", AdminSurveyCaListView.as_view(), name="AdminSurveyCaListView"),
    path("admin/reports/survey/<int:survey_id>", AdminSurveyDetailView.as_view(), name="AdminSurveyDetail"),
    path("admin/reports/survey/ca/<int:survey_id>", AdminSurveyCaDetailView.as_view(), name="AdminSurveyCaDetail"),
    path("admin/reports/surveysummary/<int:id>", SurveyFeedbackSummary.as_view(), name="SurveyFeedbackSummary"),
    path("admin/reports/surveysummary/ca/<int:id>", SurveyFeedbackCaSummary.as_view(), name="SurveyFeedbackCaSummary"),
    # tenant theme v2
    path("tenant/theme/v2", TenantThemeV2View.as_view()),
    path("admin/reports/auditlogin", AuditLoginReport.as_view(), name="AuditLoginReport"),
    path("admin/reports/auditlogin/ca", AuditLoginCaReport.as_view(), name="AuditLoginCaReport"),
    path("admin/report/surveyfeedback/ca/<int:id>", SurveyFeedbackCaReport.as_view(), name="SurveyFeedbackCaReport"),
    path("email/send", EmailView.as_view()),
    path("admin/homepage/erdstatus/<int:user_id>", AdminDashboardERDView.as_view()),
]
