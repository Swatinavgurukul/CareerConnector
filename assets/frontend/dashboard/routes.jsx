import React, { Suspense, lazy, useEffect, useState } from "react";

const Homepage = lazy(() => import("../../frontend/home/index.jsx"));
const DemoPaginator = lazy(() => import("../../react/demo.jsx"));
const CandidatesApplications = lazy(() => import("../../frontend/user/candidates_applications.jsx"));
const Login = lazy(() => import("../../frontend/auth/login.jsx"));
const Jobs = lazy(() => import("../../frontend/jobs/index.jsx"));
const ViewJob = lazy(() => import("../../frontend/jobs/view.jsx"));
//Old
import Error404 from "../../frontend/partials/Error404.jsx";
import Unauthorized from "../../frontend/partials/unauthorized.jsx";

const RecruiterList = lazy(() => import("../../frontend/recruiter/recruiterlist.jsx"));
const ApplicantList = lazy(() => import("../../frontend/recruiter/Applicant_list.jsx"));
const ForgotPassword = lazy(() => import("../../frontend/auth/forgot_password.jsx"));
const PasswordResetDone = lazy(() => import("../../frontend/auth/passwordResetDone.jsx"));
const ConfirmPasswordReset = lazy(() => import("../../frontend/auth/confirmPasswordReset.jsx"));
const PartnerPasswordSet = lazy(() => import("../../frontend/auth/setPartnerPassword.jsx"));
const PasswordSet = lazy(() => import("../../frontend/auth/setPassword.jsx"));
const indexHouston = lazy(() => import("../../frontend/home/index_houston.jsx"));
const indexAtlanta = lazy(() => import("../../frontend/home/index_atlanta.jsx"));
const Dashboard = lazy(() => import("../../frontend/user/dashboard.jsx"));
const Recruiter = lazy(() => import("../../frontend/recruiter/recruiter.jsx"));
const AddJobDetails = lazy(() => import("../../frontend/recruiter/AddJob/index.jsx"));
const Applications = lazy(() => import("../../frontend/applications/applications.jsx"));
const ApplicantProfile = lazy(() => import("../../frontend/profile/applicantProfile.jsx"));
const CandidateProfile = lazy(() => import("../../frontend/profile/candidateProfile.jsx"));
const HiringTeam = lazy(() => import("../../frontend/hiringTeam/hiringTeam.jsx"));
const Team = lazy(() => import("../../frontend/hiringTeam/hiringTeam.jsx"));
// const SignUp = lazy(() => import("../../frontend/auth/signup.jsx"));
const PartnerSignUp = lazy(() => import("../../frontend/auth/non_ProfitPartners.jsx"));
const CorporatePartner = lazy(() => import("../../frontend/auth/employer_Partners.jsx"));
const Profile = lazy(() => import("../../frontend/profile/profile.jsx"));
const Settings = lazy(() => import("../../frontend/setting_data/setting.jsx"));
const SettingsV2 = lazy(() => import("../../frontend/settingsDataV2/settingsV2.jsx"));
const Offer = lazy(() => import("../../frontend/user/offers.jsx"));
const Interview = lazy(() => import("../../frontend/user/interview.jsx"));
const Report = lazy(() => import("../../frontend/user/report.jsx"));
const ApplicationSource = lazy(() => import("../../frontend/user/reportViews/applicationSource.jsx"));
const CandidatePipeline = lazy(() => import("../../frontend/user/reportViews/candidatePipeline.jsx"));
const HiringVelocity = lazy(() => import("../../frontend/user/reportViews/hiringVelocity.jsx"));
const HistoricPipeline = lazy(() => import("../../frontend/user/reportViews/historicPipeline.jsx"));
const SuccessMetric = lazy(() => import("../../frontend/user/reportViews/successMetric.jsx"));
const TimeToHire = lazy(() => import("../../frontend/user/reportViews/timeToHire.jsx"));
const AllCandidates = lazy(() => import("../../frontend/user/all_candidates.jsx"));
const Simplifybot = lazy(() => import("../../frontend/chatbot/index.jsx"));
const VerifyEmail = lazy(() => import("../../frontend/auth/verifyEmail.jsx"));
const ApproveCredentials = lazy(() => import("../../frontend/auth/approve.jsx"));
const Pricing = lazy(() => import("../../frontend/home/pricing.jsx"));
const Faq = lazy(() => import("../../frontend/home/faq.jsx"));
const Inbox = lazy(() => import("../../frontend/profile/components/inbox.jsx"));
const JobEdit = lazy(() => import("../../frontend/recruiter/AddJob/editJob.jsx"));
const getUsers = lazy(() => import("../../frontend/dashboard/Getusers.jsx"));
// ---new pages
const About = lazy(() => import("../../frontend/home/about.jsx"));
const ContactUs = lazy(() => import("../../frontend/home/contact_us.jsx"));
const PrivacyPolicy = lazy(() => import("../../frontend/home/privacy_policy.jsx"));
const HomepageDashboard = lazy(() => import("../../frontend/auth/_index.jsx"));
const Globallocation = lazy(() => import("../../frontend/home/globallocation.jsx"));
const Languages = lazy(() => import("../../frontend/home/languages.jsx"));
const Rejected = lazy(() => import("../../frontend/auth/rejected.jsx"));
const Approval = lazy(() => import("../../frontend/auth/approval.jsx"));
const ApprovalList = lazy(() => import("../../frontend/approvals/approvals.jsx"));
const onBoarding = lazy(() => import("../../frontend/components/employeePartnerOnboarding.jsx"));

//new pages
const SignUp = lazy(() => import("../../react/signup/candidateSignup.jsx"));
const SignUpAdmin = lazy(() => import("../../react/signup/admin.jsx"));
const SignUpSkillingPartner = lazy(() => import("../../react/signup/skillingPartner.jsx"));
const NppReport = lazy(() => import("../user/NppReports/reports.jsx"));
const JobSeekerJournal = lazy(() => import("../user/NppReports/jobseekerjournal.jsx"));
const CurrentApplication = lazy(() => import("../user/NppReports/currentapplication.jsx"));
const JobActivity = lazy(() => import("../user/NppReports/jobactivity.jsx"));
const JobSeekerSuccessMetric = lazy(() => import("../user/NppReports/jobseekersuccessmetric.jsx"));
const OpenJobs = lazy(() => import("../user/NppReports/openjobs.jsx"));
const ThankYou = lazy(() => import("../auth/thankYou.jsx"));
const Loginsso = lazy(() => import("../components/Loginsso.jsx"))
const LoginIndeed = lazy(() => import("../components/LoginIndeed.jsx"))
const Erd = lazy(() => import("../dashboard/erd.jsx"))
const AdvancedSearch = lazy(() => import("../../frontend/user/advancedSearch.jsx"));
const CompareApplicants = lazy(() => import("../recruiter/compareApplicants.jsx"));
const HomepageNew = lazy(() => import("../homepage_new/homepage_new.jsx"));
const NewSignIn = lazy(() => import("../homepage_new/new_signin.jsx"));
const LinkedInLogin = lazy(() => import("../dashboard/linkedInLogin.jsx"));
const ThankYouFeedback = lazy(() => import("../survey/thankyouFeedback.jsx"));
const Survey = lazy(() => import("../survey/survey.jsx"));

export const routes = [

    { path: "/", component: process.env.CLIENT_NAME === "microsoft" ? Homepage : HomepageNew },
    { path: process.env.CLIENT_NAME === "microsoft" ? "/login" : "/new_signin", component: process.env.CLIENT_NAME === "microsoft" ? Login : NewSignIn },
    { path: "/demo_paginator", component: DemoPaginator },
    { path: "/location/atlanta", component: indexAtlanta },
    { path: "/pricing", component: Pricing },
    { path: "/globallocations", component: Globallocation },
    { path: "/faq", component: Faq },
    { path: "/search", component: Jobs },
    { path: "/signup", component: SignUp },
    { path: "/signup/candidate", component: SignUp },
    { auth: true, path: "/jobs/create", component: AddJobDetails },
    { path: "/about", component: About },
    { path: "/contact-us", component: ContactUs },
    { path: "/privacy-policy", component: PrivacyPolicy },
    { path: "/languages", component: Languages },
    { path: "/signup/nonProfitPartner", component: PartnerSignUp },
    { path: "/signup/corporatePartner", component: CorporatePartner },
    { path: "/signup", component: SignUp },
    { path: "/signup/employer", component: SignUpAdmin },
    { path: "/signup/skilling", component: SignUpSkillingPartner },
    { path: "/jobs/:id", component: ViewJob },
    { path: "/thankYou", component: ThankYou },
    { path: "/forgotPassword", component: ForgotPassword },
    { path: "/verifyEmail", component: VerifyEmail },
    { path: "/homepage_new", component: HomepageNew },
    { path: "/passwordResetDone", component: PasswordResetDone },
    { path: "/confirmPasswordReset", component: ConfirmPasswordReset },
    { path: "/loginIndeed", component: LoginIndeed },
    { path: "/linkedInLogin", component: LinkedInLogin },
    { auth: true, path: "/homepage", component: HomepageDashboard },
    // { auth: true, path: "/new_signin", component: NewSignIn },
    { auth: true, path: "/approval", component: Approval },
    { auth: true, path: "/rejected", component: Rejected },
    { auth: true, path: "/onboarding", component: onBoarding },
    { auth: true, path: "/approve", component: ApproveCredentials },
    { auth: true, path: "/setpassword", component: PasswordSet },
    { auth: true, path: "/setpasswordpartner", component: PartnerPasswordSet },
    { auth: true, path: "/jobs/:id/applications", component: RecruiterList },
    { auth: true, path: "/jobs/edit/:id", component: JobEdit },
    { auth: true, path: "/jobs/:id/applicantlist", component: ApplicantList },
    { auth: true, path: "/simplifybot", component: Simplifybot },
    // { auth: true, path: "/demo_paginator", component: DemoPaginator },
    { auth: true, path: "/applications/:id", component: ApplicantProfile },
    { auth: true, path: "/jobSeekers/:id", component: CandidateProfile },
    { auth: true, path: "/dashboard", component: Dashboard },
    { auth: true, path: "/jobs", component: Recruiter },
    { auth: true, path: "/applications", component: CandidatesApplications },
    { auth: true, path: "/report", component: Report },
    { auth: true, path: "/report/currentPipeline", component: CandidatePipeline },
    { auth: true, path: "/report/applicationSource", component: ApplicationSource },
    { auth: true, path: "/report/historicPipeline", component: HistoricPipeline },
    { auth: true, path: "/report/hiringVelocity", component: HiringVelocity },
    { auth: true, path: "/report/successMetric", component: SuccessMetric },
    { auth: true, path: "/report/timeToHire", component: TimeToHire },
    { auth: true, path: "/interview", component: Interview },
    { auth: true, path: "/offers", component: Offer },
    { auth: true, path: "/jobSeekers", component: AllCandidates },
    { auth: true, path: "/advancedSearch", component: AdvancedSearch },
    { auth: true, path: "/approvals", component: ApprovalList },
    { auth: true, path: "/getUsers", component: getUsers },
    { auth: true, path: "/profile", component: Profile },
    { auth: true, path: "/inbox_messages", component: Inbox },
    { auth: true, path: "/setting", component: Settings },
    { auth: true, path: "/settingsV2", component: SettingsV2 },
    { auth: true, path: "/application", component: Applications },
    { auth: true, path: "/nppreport/jobseekerjournal", component: JobSeekerJournal },
    { auth: true, path: "/nppreport/currentapplication", component: CurrentApplication },
    { auth: true, path: "/nppreport/jobactivity", component: JobActivity },
    { auth: true, path: "/nppreport/jobseekersuccessmetric", component: JobSeekerSuccessMetric },
    { auth: true, path: "/nppreport/openjobs", component: OpenJobs },
    { auth: true, path: "/nppreport", component: NppReport },
    { auth: true, path: "/compareApplicants", component: CompareApplicants },
    { auth: true, path: "/loginsso", component: Loginsso },
    { auth: true, path: "/erd", component: Erd },
    { auth: true, path: "/hiringTeam", component: HiringTeam },
    { auth: true, path: "/team", component: Team },
    { auth: true, path: "/thankYouFeedback", component: ThankYouFeedback },
    { path: "/survey", component: Survey },
    { auth: true, path: "/unauthorized", component: Unauthorized },
    { auth: true, path: "*", component: Error404 },
    { auth: true, path: "/404", component: Error404 },
    { path: "/unauthorized", component: Unauthorized },
    { path: "*", component: Error404 },
    { path: "/404", component: Error404 },
];
