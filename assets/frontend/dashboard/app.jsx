//React
import React, { Suspense, lazy, useEffect, useState, Fragment } from "react";
import ReactDOM from "react-dom";
// React Packages
import Axios from "axios";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// Master Page Partials
import { routes } from "./routes.jsx";
import Header from "./header.jsx";
import AdminSideBar from "./AdminSideBar.jsx";
import Spinner from "../partials/spinner.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
//Redux
import { connect, Provider } from "react-redux";
import { _setAuthData, _languages, _tenantTheme, _clearStoreOnEvent } from "../actions/actionsAuth.jsx";
import returnStoreAndPersistor from "../store/index.jsx";
import { PrivateRoute } from "./routing.jsx";
import { PublicRoute } from "./routing.jsx";
import { GuestRoute } from "./routing.jsx";
import { checkReduxPersistData } from "../components/constants.jsx";
const Homepage = lazy(() => import("../../frontend/home/index.jsx"));
const HomepageCanada = lazy(() => import("../../frontend/home_canada/index.jsx"));
const DemoPaginator = lazy(() => import("../../react/demo.jsx"));
const CandidatesApplications = lazy(() => import("../../frontend/user/candidates_applications.jsx"));
const Login = lazy(() => import("../../frontend/auth/login.jsx"));
const LoginCanada = lazy(() => import("../../frontend/auth/login_canada.jsx"));
const Jobs = lazy(() => import("../../frontend/jobs/index.jsx"));
const JobsCanada = lazy(() => import("../../frontend/jobsCanada/index.jsx"));
const ViewJob = lazy(() => import("../../frontend/jobs/view.jsx"));
const ViewJobCanada = lazy(() => import("../../frontend/jobsCanada/view.jsx"));
//Old
import Error404 from "../../frontend/partials/Error404.jsx";
import Unauthorized from "../../frontend/partials/unauthorized.jsx";

const RecruiterList = lazy(() => import("../../frontend/recruiter/recruiterlist.jsx"));
const ApplicantList = lazy(() => import("../../frontend/recruiter/Applicant_list.jsx"));
const ForgotPassword = lazy(() => import("../../frontend/auth/forgot_password.jsx"));
const ForgotPasswordCanada = lazy(() => import("../../frontend/auth/forgot_password_canada.jsx"));
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
const TermsOfService = lazy(() => import("../home/termsOfService.jsx"));
const HomepageDashboard = lazy(() => import("../../frontend/auth/_index.jsx"));
const Globallocation = lazy(() => import("../../frontend/home/globallocation.jsx"));
const Languages = lazy(() => import("../../frontend/home/languages.jsx"));
const Rejected = lazy(() => import("../../frontend/auth/rejected.jsx"));
const Approval = lazy(() => import("../../frontend/auth/approval.jsx"));
const Approval1 = lazy(() => import("../../frontend/auth/approval1.jsx"));
const ApprovalList = lazy(() => import("../../frontend/approvals/approvals.jsx"));
const onBoarding = lazy(() => import("../../frontend/components/employeePartnerOnboarding.jsx"));

//new pages
const SignUp = lazy(() => import("../../react/signup/candidateSignup.jsx"));
const SignUpAdmin = lazy(() => import("../../react/signup/admin.jsx"));
const SignUpSkillingPartner = lazy(() => import("../../react/signup/skillingPartner.jsx"));
const SignUpCanada = lazy(() => import("../../react/signup_Canada/candidateSignup.jsx"));
const SignUpAdminCanada = lazy(() => import("../../react/signup_Canada/admin.jsx"));
const SignUpSkillingPartnerCanada = lazy(() => import("../../react/signup_Canada/skillingPartner.jsx"));
const NppReport = lazy(() => import("../user/NppReports/reports.jsx"));
const JobSeekerJournal = lazy(() => import("../user/NppReports/jobseekerjournal.jsx"));
const CurrentApplication = lazy(() => import("../user/NppReports/currentapplication.jsx"));
const JobActivity = lazy(() => import("../user/NppReports/jobactivity.jsx"));
const JobSeekerSuccessMetric = lazy(() => import("../user/NppReports/jobseekersuccessmetric.jsx"));
const OpenJobs = lazy(() => import("../user/NppReports/openjobs.jsx"));
const ThankYou = lazy(() => import("../auth/thankYou.jsx"));
const Loginsso = lazy(() => import("../components/Loginsso.jsx"))
const SignUpPrivacyEp = lazy(() => import("../../frontend/home/signUpPrivacyEp.jsx"));
const SignUpPrivacyNpp = lazy(() => import("../../frontend/home/signUpPrivacyNpp.jsx"));
const LoginIndeed = lazy(() => import("../components/LoginIndeed.jsx"))
const Erd = lazy(() => import("../dashboard/erd.jsx"))
const ErdCanada = lazy(() => import("../dashboard/erdCanada.jsx"))
const AdvancedSearch = lazy(() => import("../../frontend/user/advancedSearch.jsx"));
const CompareApplicants = lazy(() => import("../recruiter/compareApplicants.jsx"));
const HomepageNew = lazy(() => import("../homepage_new/homepage_new.jsx"));
const NewSignIn = lazy(() => import("../homepage_new/new_signin.jsx"));
const LinkedInLogin = lazy(() => import("../dashboard/linkedInLogin.jsx"));
const ThankYouFeedback = lazy(() => import("../survey/thankyouFeedback.jsx"));
const Survey = lazy(() => import("../survey/survey.jsx"));
const SurveyReports = lazy(() => import("../survey/surveyReports.jsx"));
const SurveyReportsCanada = lazy(() => import("../survey/surveyReportsCanada.jsx"));
const SurveySummary = lazy(() => import("../survey/surveySummary/surveySummary.jsx"));
const SurveySummaryCanada = lazy(() => import("../survey/surveySummaryCanada/surveySummary.jsx"));
const AuditReports = lazy(() => import("../dashboard/engagementReports.jsx"));
const AuditReportsCanada = lazy(() => import("../dashboard/engagementReportsCanada.jsx"));
const Unsubscribe = lazy(() => import("./unsubscribeAccount.jsx"));



const App = (props) => {
    const { user, userToken } = props;
    const [theme, setTheme] = useState({});
    const [isloading, setLoading] = useState(true);
    const visible = [
        // "/login",
        // "/forgotPassword",
        // "/signup",
        // "/signup/candidate",
        // "/signup/partner",
        // "/signup/nonProfitPartner",
        // "/signup/candidate",
        // "/signup/corporatePartner",
    ];

    useEffect(() => {
        fetchTheme();
        var link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = props?.tenantTheme.favicon;
    }, []);
    useEffect(() => {
        window.addEventListener('storage', () => {
            let reduxPersist = checkReduxPersistData()
            if (reduxPersist) {
                props._clearStoreOnEvent()
                toast.error("Session expired! Please login again.")
            }
        });
    }, [])
    useEffect(() => {
        getlanguages();
    }, [props.languageName]);
    const fetchTheme = () => {
        // let local_theme = localStorage.getItem("theme");
        let local_theme = props?.tenantTheme
        let decoded_theme = local_theme;
        if (local_theme != null && decoded_theme != null) {
            applyTheme(decoded_theme);
        }

        Axios.get("/api/v1/tenant/theme")
            .then((response) => {
                applyTheme(response.data.data);
            })
            .catch((error) => {
                setLoading(false);
            });
    };
    const getlanguages = () => {
        Axios.get(`/api/v1/language/translation/${props.languageName || "en"} `)
            .then((response) => {
                var obj = response.data.data
                props._languages(obj)
            })
    }

    const applyTheme = (theme) => {
        props._tenantTheme(theme);
        setTheme(theme);
        setLoading(false);
        // localStorage.setItem("theme", JSON.stringify(theme));
        // let favicon = document.getElementById("favicon");
        // console.log(favicon,"favv");
        // if (theme.favicon != null) {
        //     favicon.href = theme.favicon;
        // }

        if (theme.title != null) {
            document.title = theme.title;
        }
    };

    return (

        <Router>
            <Header theme={theme} isloading={isloading} visible={visible} />
            <div className="d-flex justify-content-center h-100">
                <AdminSideBar />
                <Suspense fallback={<Spinner />}>
                    <ErrorBoundary>
                        <Switch>
                            <PublicRoute exact path={`/`} component={process.env.CLIENT_NAME === "microsoft" ? Homepage : HomepageNew} />
                            <PublicRoute exact path={`/ca`} component={HomepageCanada} />
                            <PublicRoute exact path={`/login`} component={Login} />
                            <PublicRoute exact path={`/ca/login`} component={LoginCanada} />
                            <PublicRoute exact path={`/search`} component={Jobs} />
                            <PublicRoute exact path={"/demo_paginator"} component={DemoPaginator} />
                            <PublicRoute exact path={"/location/atlanta"} component={indexAtlanta} />
                            <PublicRoute exact path={"/pricing"} component={Pricing} />
                            <PublicRoute exact path={"/ca/pricing"} component={Pricing} />
                            <PublicRoute exact path={"/globallocations"} component={Globallocation} />
                            <PublicRoute exact path={"/ca/globallocations"} component={Globallocation} />
                            <PublicRoute exact path={"/faq"} component={Faq} />
                            <PublicRoute exact path={"/ca/faq"} component={Faq} />
                            <PublicRoute exact path={"/ca/search"} component={JobsCanada} />
                            <PublicRoute exact path={"/signup"} component={SignUp} />
                            <PublicRoute exact path={"/signup/candidate"} component={SignUp} />
                            <PrivateRoute exact auth={props.userToken} path={"/jobs/create"} component={AddJobDetails} />
                            <PublicRoute exact path={"/about"} component={About} />
                            <PublicRoute exact path={"/contact-us"} component={ContactUs} />
                            <PublicRoute exact path={"/privacy-policy"} component={PrivacyPolicy} />
                            <PublicRoute exact path={"/ca/about"} component={About} />
                            <PublicRoute exact path={"/ca/contact-us"} component={ContactUs} />
                            <PublicRoute exact path={"/ca/privacy-policy"} component={PrivacyPolicy} />
                            <PublicRoute exact path={"/languages"} component={Languages} />
                            <PublicRoute exact path={"/signup/nonProfitPartner"} component={PartnerSignUp} />
                            <PublicRoute exact path={"/signup/corporatePartner"} component={CorporatePartner} />
                            <PublicRoute exact path={"/signup"} component={SignUp} />
                            <PublicRoute exact path={"/signup/employer"} component={SignUpAdmin} />
                            <PublicRoute exact path={"/signup/skilling"} component={SignUpSkillingPartner} />
                            <PublicRoute exact path={"/ca/signup"} component={SignUpCanada} />
                            <PublicRoute exact path={"/ca/signup/employer"} component={SignUpAdminCanada} />
                            <PublicRoute exact path={"/ca/signup/skilling"} component={SignUpSkillingPartnerCanada} />
                            <PublicRoute exact path={"/jobs/:id"} component={ViewJob} />
                            <PublicRoute exact path={"/ca/jobs/:id"} component={ViewJobCanada} />
                            <PublicRoute exact path={"/thankYou"} component={ThankYou} />
                            <PublicRoute exact path={"/forgotPassword"} component={ForgotPassword} />
                            <PublicRoute exact path={"/ca/forgotPassword"} component={ForgotPasswordCanada} />
                            <PublicRoute exact path={"/verifyEmail"} component={VerifyEmail} />
                            <PublicRoute exact path={"/homepage_new"} component={HomepageNew} />
                            <PublicRoute exact path={"/passwordResetDone"} component={PasswordResetDone} />
                            <PublicRoute exact path={"/confirmPasswordReset"} component={ConfirmPasswordReset} />
                            <PublicRoute exact path={"/loginIndeed"} component={LoginIndeed} />
                            <PublicRoute exact path={"/linkedInLogin"} component={LinkedInLogin} />
                            <PublicRoute exact path={"/terms-of-service"} component={TermsOfService} />
                            <PublicRoute exact path={"/ca/terms-of-service"} component={TermsOfService} />
                            <PrivateRoute exact auth={props.userToken} path={"/homepage"} component={HomepageDashboard} />
                            <PublicRoute exact path={"/new_signin"} component={NewSignIn} />
                            <PublicRoute exact path={"/approval"} component={Approval} />
                            <PublicRoute exact path={"/approval1"} component={Approval1} />
                            <PublicRoute exact path={"/rejected"} component={Rejected} />
                            <PrivateRoute exact auth={props.userToken} path={"/onboarding"} component={onBoarding} />
                            <PublicRoute exact path={"/approve"} component={ApproveCredentials} />
                            <PublicRoute exact path={"/setpasswordpartner"} component={PartnerPasswordSet} />
                            <PublicRoute exact path={"/survey"} component={Survey} />
                            <PublicRoute exact path={"/thankYouFeedback"} component={ThankYouFeedback} />
                            <PrivateRoute exact auth={props.userToken} path={"/surveyReports"} component={SurveyReports} />
                            <PrivateRoute exact auth={props.userToken} path={"/surveyReports/ca"} component={SurveyReportsCanada} />
                            <PublicRoute exact auth={props.userToken} path={"/unsubscribeConfirm"} component={Unsubscribe} />
                            <PrivateRoute exact auth={props.userToken} path={"/surveySummary"} component={SurveySummary} />
                            <PrivateRoute exact auth={props.userToken} path={"/surveySummary/ca"} component={SurveySummaryCanada} />
                            <PrivateRoute exact auth={props.userToken} path={"/jobs/:id/applications"} component={RecruiterList} />
                            <PrivateRoute exact auth={props.userToken} path={"/jobs/edit/:id"} component={JobEdit} />
                            <PrivateRoute exact auth={props.userToken} path={"/jobs/:id/applicantlist"} component={ApplicantList} />
                            <PrivateRoute exact auth={props.userToken} path={"/simplifybot"} component={Simplifybot} />
                            <PrivateRoute exact auth={props.userToken} path={"/applications/:id"} component={ApplicantProfile} />
                            <PrivateRoute exact auth={props.userToken} path={"/jobSeekers/:id"} component={CandidateProfile} />
                            <PrivateRoute exact auth={props.userToken} path={"/dashboard"} component={Dashboard} />
                            <PrivateRoute exact auth={props.userToken} path={"/jobs"} component={Recruiter} />
                            <PrivateRoute exact auth={props.userToken} path={"/applications"} component={CandidatesApplications} />
                            <PrivateRoute exact auth={props.userToken} path={"/report"} component={Report} />
                            <PrivateRoute exact auth={props.userToken} path={"/report/currentPipeline"} component={CandidatePipeline} />
                            <PrivateRoute exact auth={props.userToken} path={"/report/applicationSource"} component={ApplicationSource} />
                            <PrivateRoute exact auth={props.userToken} path={"/report/historicPipeline"} component={HistoricPipeline} />
                            <PrivateRoute exact auth={props.userToken} path={"/report/hiringVelocity"} component={HiringVelocity} />
                            <PrivateRoute exact auth={props.userToken} path={"/report/successMetric"} component={SuccessMetric} />
                            <PrivateRoute exact auth={props.userToken} path={"/report/timeToHire"} component={TimeToHire} />
                            <PrivateRoute exact auth={props.userToken} path={"/interview"} component={Interview} />
                            <PrivateRoute exact auth={props.userToken} path={"/offers"} component={Offer} />
                            <PrivateRoute exact auth={props.userToken} path={"/jobSeekers"} component={AllCandidates} />
                            <PrivateRoute exact auth={props.userToken} path={"/advancedSearch"} component={AdvancedSearch} />
                            <PrivateRoute exact auth={props.userToken} path={"/approvals"} component={ApprovalList} />
                            <PrivateRoute exact auth={props.userToken} path={"/getUsers"} component={getUsers} />
                            <PrivateRoute exact auth={props.userToken} path={"/profile"} component={Profile} />
                            <PrivateRoute exact auth={props.userToken} path={"/inbox_messages"} component={Inbox} />
                            <PrivateRoute exact auth={props.userToken} path={"/setting"} component={Settings} />
                            <PrivateRoute exact auth={props.userToken} path={"/settingsV2"} component={SettingsV2} />
                            <PrivateRoute exact auth={props.userToken} path={"/application"} component={Applications} />
                            <PrivateRoute exact auth={props.userToken} path={"/nppreport/jobseekerjournal"} component={JobSeekerJournal} />
                            <PrivateRoute exact auth={props.userToken} path={"/nppreport/currentapplication"} component={CurrentApplication} />
                            <PrivateRoute exact auth={props.userToken} path={"/nppreport/jobactivity"} component={JobActivity} />
                            <PrivateRoute exact auth={props.userToken} path={"/nppreport/jobseekersuccessmetric"} component={JobSeekerSuccessMetric} />
                            <PrivateRoute exact auth={props.userToken} path={"/nppreport/openjobs"} component={OpenJobs} />
                            <PrivateRoute exact auth={props.userToken} path={"/nppreport"} component={NppReport} />
                            <PrivateRoute exact auth={props.userToken} path={"/compareApplicants"} component={CompareApplicants} />
                            <PublicRoute exact path={"/loginsso"} component={Loginsso} />
                            <PublicRoute exact path={"/privacy-policy-ep"} component={SignUpPrivacyEp} />
                            <PublicRoute exact path={"/privacy-policy-npp"} component={SignUpPrivacyNpp} />
                            <PrivateRoute exact auth={props.userToken} path={"/erd"} component={Erd} />
                            <PrivateRoute exact auth={props.userToken} path={"/ca/erd"} component={ErdCanada} />
                            <PrivateRoute exact auth={props.userToken} path={"/hiringTeam"} component={HiringTeam} />
                            <PrivateRoute exact auth={props.userToken} path={"/team"} component={Team} />
                            <PrivateRoute exact auth={props.userToken} path={"/auditReports"} component={AuditReports} />
                            <PrivateRoute exact auth={props.userToken} path={"/ca/auditReports"} component={AuditReportsCanada} />
                            <PublicRoute path={"/unauthorized"} component={Unauthorized} />
                            <PublicRoute path={"/ca/unauthorized"} component={Unauthorized} />
                            <PublicRoute path={"*"} component={Error404} />
                            <PublicRoute path={"/404"} component={Error404} />
                        </Switch>
                    </ErrorBoundary>
                    {/* <Footer theme={theme} isloading={isloading} visible={visible} /> */}
                </Suspense>
            </div>
        </Router>
    );
};

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        languages: state.authInfo.languages,
        languageName: state.authInfo.languageName,
        tenantTheme: state.authInfo.tenantTheme,
    };
}
export default connect(mapStateToProps, { _languages, _tenantTheme, _clearStoreOnEvent })(App);
