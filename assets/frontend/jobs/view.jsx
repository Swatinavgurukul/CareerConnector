import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { _setAuthData, _billingAuth } from "../actions/actionsAuth.jsx";
import { useHistory, Link } from "react-router-dom";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
// import Error404 from "../partials/Error404.jsx";
// import { toast } from "react-toastify";
import "react-toastify/scss/main.scss";
import ReactDOM from "react-dom";
import jwt_decode from "jwt-decode";
import ReactHtmlParser from "react-html-parser";
import Chatbot from "../chatbot/index.jsx";
import { useSession } from "../components/SessionProvider.jsx";
import FooterUpdate from "../dashboard/_footer.jsx";
import {
    truncate,
    renderToLocaleDate,
    renderCurrencyRange,
    renderRange,
    resetToCapitalCasing,
} from "../modules/helpers.jsx";
import { getUserDetails } from "../chatbot/API/api.js";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { es, fr, enUS as en } from 'date-fns/locale';
import { job_type, education_language, job_category, job_industry, salary_time_type } from "../../translations/helper_translation.jsx";
import { _languageName } from "../actions/actionsAuth.jsx";
// toast.configure()
const ViewJob = (props) => {
    const { t } = useTranslation();
    const default_user_object = {
        authenticated: false,
        name: "",
        chat_id: "",
        is_user: true,
        user_id: null,
        role_id: null,
        is_consent: null,
        tenant_name: null,
    };
    const history = useHistory();
    const JobDescriptionLimit = 3500;
    const [job, setJob] = useState([]);
    const [jobDescription, setDescription] = useState("");
    const [showMore, setShowMore] = useState(false);
    const [displayingMore, setDisplayingMore] = useState(false);
    // const [isApplied, setIsApplied] = useState(false)
    const [checkApplied, setCheckApplied] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [toggeleApplyBtn, setToggelApplyBtn] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [subscribeMessage, setSubscribeMessage] = useState(t(props.language?.layout?.subsmsg_nt));
    const [showLoginMsg, setShowLoginMsg] = useState(false);
    const [showApplyBtn, setShowApplyBtn] = useState(true);
    const [languageName, setLanguageName] = useState('');
    const [dseEn, setDseEn] = useState("");
    const [dseEsp, setDseEsp] = useState("");
    const [dseFr, setDseFr] = useState("");

    const session = useSession();

    useEffect(() => {
        checkResetUrl();
    }, []);
    // console.log("process.env.CLIENT_NAME ===",process.env.CLIENT_NAME);
    const onApplyHandle = () => {
        // console.log("props............",props.user.authenticated)
        // if (props.user.authenticated) {
        //     setShowLoginMsg(true);
        //     setShowApplyBtn(false);
        //     return;
        // }
        setToggelApplyBtn(true);
        setBtnDisabled(true);
    };
    const checkResetUrl = () => {
        const urlPath = history.location.search;
        const baseUrl = history.location.pathname;
        if (urlPath.indexOf("&") > -1 && urlPath.indexOf("token=") > -1) {
            const Uid_Token = urlPath.split("&");
            const token = Uid_Token[0].split("?token=")[1]
            const email = Uid_Token[1].split("email=")[1]
            const body = {
                token: token,
                email: email
            }
            axios({
                method: "post",
                url: "/api/v1/sso_user",
                data: body,
                // headers: { Authorization: `Bearer ${props.userToken}` },
            })
                .then(function (response) {
                    if (response.data.status === 201) {
                        let decoded = jwt_decode(response.data.data.access_token);
                        updateUserFromToken(response.data.data.access_token, response.data.data.refresh_token);
                        if (decoded.is_user) {
                            history.push(baseUrl);
                        }
                        // else if (decoded.billing === false) {
                        //     history.push("/onboarding");
                        // } else if (decoded.user_id == 1) {
                        //     history.push("/dashboard");
                        // } else {
                        //     history.push("/homepage");
                        // }
                    }
                    return;
                })
                .catch(function (error) { });
        }
    }
    const updateUserFromToken = (access_token, refresh_token) => {
        localStorage.setItem("access_token", access_token);
        let decoded = jwt_decode(access_token);
        // console.log("decoded.........", decoded);
        let user_object = Object.assign({}, default_user_object, {
            authenticated: true,
            user_id: decoded.user_id,
            is_user: decoded.is_user,
            name: decoded.full_name,
            role_id: decoded.role_id,
            is_consent: decoded.is_consent,
            tenant_name: decoded.tenant_name,
        });
        props._setAuthData(user_object, access_token, refresh_token, decoded.exp - 600);
        props._billingAuth(decoded.billing);
    };
    useEffect(() => {
        let slug = props.match.params.id;
        let options = {};
        if (props.user.authenticated) {
            options = {
                headers: {
                    Authorization: `Bearer ${props.userToken}`,
                },
            };
        }
        axios
            .get("/api/v1/jobs/" + slug, options)
            .then((response) => {
                setJob(response.data.data);
                let job_desc;
                {
                    props?.languageName == "en" ?
                        job_desc = response.data.data.description == null || response.data.data.description == "" ? response.data.data.description_fr : response.data.data.description : ""
                }
                {
                    props?.languageName == "esp" ?
                        job_desc = response.data.data.description_esp == null || response.data.data.description_esp == "" ? response.data.data.description ?  response.data.data.description : response.data.data.description_fr  : response.data.data.description_esp : ""
                }
                {
                    props?.languageName == "fr" ?
                        job_desc = response.data.data.description_fr == null || response.data.data.description_fr == "" ? response.data.data.description : response.data.data.description_fr : ""
                }
                setDescription(job_desc);
                if (response.data.data.description.length > JobDescriptionLimit) {
                    setDescription(truncate(response.data.data.description, JobDescriptionLimit));
                    setShowMore(true);
                    // setJob(response.data.data);
                } else {
                    setShowMore(false);
                    setJob(response.data.data);
                }
            })
            .catch((resp) => {
                // console.log(resp.error);
            });

    }, [checkApplied, props?.languageName]);

    useEffect(() => {
        if (props.user.authenticated) {
            let { email } = jwt_decode(props.userToken);
            setUserEmail(email);
        }
    }, []);
    // console.log("props.user.authenticated", props.user.authenticated);

    // const onApplyHandle = () => {
    //     // setIsApplied(true);
    //     if (!props.userToken) {
    //         setShowLoginMsg(true);
    //         setShowApplyBtn(false);
    //     }
    //     setToggelApplyBtn(true);
    //     setBtnDisabled(true);
    // };

    const closeChatBotHandle = () => {
        // setIsApplied(false);
        setToggelApplyBtn(false);
        setBtnDisabled(false);
    };

    const subscribeHandler = (e) => {
        setDisabled(true);
        e.preventDefault();
        let options = {};
        // if (session.user.authenticated) {
        //     options.headers = {
        //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        //     };
        // }
        axios
            .post(`/api/v1/jobs/${job.slug}/alert`, { email: userEmail }, options)
            .then((resp) => {
                setSubscribeMessage(String(resp.data.message));
                if (resp.status === 201) setJob({ ...job, job_subscribed: true });
                if (resp.status === 200) setJob({ ...job, job_subscribed: true });
            })

            .catch((resp) => {
                // console.log(resp.error);
            });
    };

    const showLoginMessage = () => {
        setBtnDisabled(true);
        // console.log("showloginmessage");
        // return showLoginMsg && (<p>Kindly <a href="/signin">Login</a>to continue</p>)
    };
    const reApplyHandler = () => {
        axios
            .put(`/api/v1/jobs/${job.slug}/reapply`, {}, {
                headers: {
                    Authorization: `Bearer ${props.userToken}`,
                },
            })
            .then((resp) => {
                if (resp.status === 200) {
                    window.location.reload();
                }
            })

            .catch((resp) => {
                // console.log(resp.error);
            });
    }

    const jobTypeHandler = (language, key) => {
        return (job_type[language][key]);
    }
    const educationHandler = (language, key) => {
        return (education_language[language][key]);
    }
    const jobIndustryHandler = (language, key) => {
        return (job_industry[language][key]);
    }
    const jobCategoryHandler = (language, key) => {
        return (job_category[language][key]);
    }
    const salaryTypeHandler = (language, key) => {
        return (salary_time_type[language][key]);
    }
    const selectLanguage = (e) => {
        props._languageName(e.target.value)
        // let skillSet = job.skills.filter(skill => skill.language == e.target.value);
        // console.log("skillSet",skillSet)
        setLanguageName(e.target.value)
    }
    // console.log("job.skills",job.skills);
    return (
        <div className="w-100">
            <div className="container-fluid bg-theme-primary text-white px-3">
                <div className="col-lg-10 col-md-12 mx-auto p-0 py-4 d-flex justify-content-between">
                    <div className="col-md-6 col-7 p-0">
                        <Link onClick={() => history.goBack()} className="text-white h5 text-decoration-none">
                            &lt; {t(props.language?.layout?.js_backsearch_nt)}
                        </Link>
                    </div>
                    <div className="col-md-6 col-5 p-0">
                        <div className="text-right job_published">
                            {/* <div className="pr-2">
                                <span className='invert-color'>
                                    <img
                                        className="svg-sm mt-n1 mr-2"
                                        src="/svgs/icons_new/globe.svg"
                                        alt="Languages"
                                        title="Languages"
                                    />
                                </span>

                                <select
                                    className="form-select border rounded
                                form-select-sm"
                                    aria-label=".form-select-sm example"
                                    onChange={selectLanguage}
                                >
                                    <option disabled>{t(props.language?.layout?.seeker_select)}</option>
                                    {(job.title == null || "") || dseEn == null || "" ? "" :
                                        <option onClick={() => props._languageName("en")} selected={props.languageName === "en"} value="en" > EN </option>
                                    }
                                    {(job.title_esp == null || "") || dseEsp == null || "" ? "" :
                                        <option onClick={() => props._languageName("esp")} selected={props.languageName == "esp"} value="esp"> ESP </option>
                                    }
                                    {(job.title_fr == null || "") || dseFr == null || "" ? "" :
                                        <option onClick={() => props._languageName("fr")} selected={props.languageName == "fr"} value="fr"> FR </option>
                                    }
                                </select>
                            </div> */}
                            <h5 className="">
                                {job.updated_at
                                    ? `${t(props.language?.layout?.job_published_nt)}  : ${formatDistance(subDays(new Date(job.updated_at), 0), new Date(), { locale: props.languageName === "en" ? en : es })}  ${t(props.language?.layout?.all_ago_nt)}`
                                    : ""}
                            </h5>
                        </div>
                    </div>

                </div>
                <div className="d-md-flex mb-4">
                    <div className="d-md-flex col-lg-10 col-md-12 mx-auto p-0 pb-2">
                        <div className="col-lg-2 col-md-3 mr-lg-5"></div>
                        <div className="col-lg-6 col-md-5 p-0 mb-md-0 mb-4">
                            <div>
                                {props?.languageName == "en" ?
                                    <h2>{job.title == null ? job.title_fr : job.title}</h2> : ""}
                                {props?.languageName == "esp" ?
                                    <h2>{job.title_esp == null || job.title_esp == "" ? job.title ? job.title : job.title_fr  : job.title_esp}</h2> : ""}
                                {props?.languageName == "fr" ?
                                    <h2>{job.title_fr == null || job.title_fr == "" ? job.title : job.title_fr}</h2> : ""}
                                <h5 className="text-capitalize">
                                    {job.company_name} |
                                    {job.company_name && jobTypeHandler(props?.languageName, job.name) + job.name ? " | " : ""}
                                    {job.job_type ? jobTypeHandler(props.languageName, job.job_type) : ""}
                                </h5>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 mx-auto p-0">
                            <div className="d-flex">
                                {job.salary_min || job.salary_max ? (
                                    <div className="col-md-4 text-center px-0">
                                        <img
                                            alt="dollar"
                                            src="/svgs/icons_new/briefcase.svg"
                                            className="svg-md-2 invert-color"
                                        />
                                        <p
                                            className="mt-md-1 mb-0 text-capitalize"
                                            data-toggle="tooltip"
                                            data-placement="right">
                                            {renderCurrencyRange(job.salary_min, job.salary_max, "$")} <br />
                                            {job.salary_frequency ? salaryTypeHandler(props.languageName, job.salary_frequency) : ""}
                                        </p>
                                    </div>
                                ) : null}
                                {job.job_type ? (
                                    <div className="col-md-4 text-center">
                                        <img
                                            alt="time"
                                            src="/svgs/icons_new/clock.svg"
                                            className="svg-md-2 invert-color  p-1"
                                        />
                                        <p
                                            className="mt-md-1 mb-0 text-truncate text-capitalize"
                                            data-toggle="tooltip"
                                            data-placement="right"
                                            title={jobTypeHandler(props?.languageName, job.name)}>
                                            {job.job_type ? jobTypeHandler(props.languageName, job.job_type) : ""}
                                        </p>
                                    </div>
                                ) : null}
                                {job.display_name !== null && job.display_name !== "" ? (
                                    <div className="icon-invert col-md-4 p-0 text-center">
                                        <img
                                            alt="location"
                                            src="/svgs/icons_new/map-pin.svg"
                                            class="svg-md-2 invert-color p-1"
                                        />
                                        <p
                                            className="mt-md-1 mb-0  text-capitalize"
                                            data-toggle="tooltip"
                                            data-placement="right">
                                            {job.display_name},
                                            {job.state}
                                        </p>
                                    </div>
                                ) : null}
                                {/* <div className="icon-invert col-md-4 p-0 text-center">
                                        <img
                                            alt="arrow"
                                            src="/svgs/icons_new/globe.svg"
                                            class="svg-md-2 invert-color p-1"
                                        />
                                        <br/>
                                       <select
                                        className="form-select
                                        form-select-sm select_laung"
                                        aria-label=".form-select-sm example"
                                        onChange={selectLanguage}
                                        >
                                        <option disabled>Select</option>
                                            <option onClick={() => props._languageName("en")} selected={props.languageName === "en"} value="en" > EN </option>
                                            <option onClick={() => props._languageName("esp")} selected={props.languageName == "esp"} value="esp"> ESP </option>
                                            <option onClick={() => props._languageName("fr")} selected={props.languageName == "fr"}  value="fr"> FR </option>
                                        </select>
                                    </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-2" />
            </div>
            <div className="container-fluid px-3 mb-5">
                <div className="row">
                    {/* <div class="col-md-1 col-sm-0"></div> */}
                    <div className="offset-lg-1 col-lg-2 col-md-3 offset-0">
                        {/* <div class="offset-1 col-md-2"> */}
                        <div className="card bg-light mb-4">
                            <div className="card-body">
                                <h4>{t(props.language?.layout?.ep_createjob_function)}</h4>
                                <p>{jobCategoryHandler(props?.languageName, job.category)}</p>
                                <h4>{t(props.language?.layout?.all_industry)}</h4>
                                <p>{jobIndustryHandler(props?.languageName, job.industry)}</p>
                                <h4>{t(props.language?.layout?.sp_application_experience)}</h4>
                                <p className="text-capitalize">
                                    {renderRange(job.experience_min, job.experience_max, t(props.language?.layout?.all_years_nt))}
                                </p>
                                <h4>{t(props.language?.layout?.all_education_nt)}</h4>
                                <p>{educationHandler(props?.languageName, job.qualification)}</p>
                            </div>
                        </div>
                        {job.skills && job.skills.length ? (
                            <div className="card bg-light mb-4">
                                <div className="card-body">
                                    <h4>{t(props.language?.layout?.js_dashboard_skills)}</h4>
                                    <div className="w-100" >
                                        {job.skills.length ? (
                                            job.skills.filter(skill => skill.language == String(props?.languageName).toLowerCase()).length > 0 ?
                                                <>
                                                    {job.skills.map((skill) => (
                                                        <div class="nav nav-pills mr-1 mt-0 hoveredElement d-inline-block" >
                                                            {String(props?.languageName).toLowerCase() == skill.language && (
                                                                <div class="mb-1 d-flex border border-secondary rounded mr-1">
                                                                    <div class="text-decoration-none text-dark px-2 py-1">
                                                                        {skill.name}
                                                                    </div>
                                                                </div>)
                                                            }

                                                        </div>
                                                    ))}
                                                </>
                                                :
                                                <>
                                                    {job.skills.map((skill) => (
                                                        <div class="nav nav-pills mr-1 mt-0 hoveredElement d-inline-block" >
                                                            <div class="mb-1 d-flex border border-secondary rounded mr-1">
                                                                <div class="text-decoration-none text-dark px-2 py-1">
                                                                    {skill.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                        ) : (
                                            <p>{t(props.language?.layout?.all_noskill_nt)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        <div className="card bg-light mb-4">
                            <div className="card-body">
                                <h6>
                                    <b>{t(props.language?.layout?.all_sharejob_nt)}</b>
                                </h6>
                                <div className="d-flex justify-content-start">
                                    <a
                                        href={"https://www.facebook.com/sharer.php?u=" + window.location.href}
                                        target="_blank"
                                        rel="noopener">
                                        <img
                                            alt="Facebook"
                                            src="/svgs/social/facebook_solid.svg"
                                            className="svg-lg img-fluid"
                                        />
                                    </a>
                                    <a
                                        href={
                                            "https://www.linkedin.com/shareArticle?mini=true&url=" +
                                            window.location.href
                                        }
                                        target="_blank"
                                        rel="noopener"
                                        className="mx-3 mx-md-2 mx-lg-3">
                                        <img
                                            alt="Linkedin"
                                            src="/svgs/social/linkedin_solid.svg"
                                            className="svg-lg img-fluid"
                                        />
                                    </a>
                                    <a
                                        href={"https://twitter.com/intent/tweet?url=" + window.location.href}
                                        target="_blank"
                                        rel="noopener">
                                        <img alt="Twitter" src="/svgs/social/twitter.svg" className="svg-lg img-fluid" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-5 mt-3 mt-md-0">
                        <Tabs
                            id="controlled-tab-example"
                            className="nav-underline-primary"
                            defaultActiveKey={"jobDetails"}>
                            <Tab eventKey="jobDetails" title={t(props.language?.layout?.js_application_jobdetail)}>
                                <div id="job-details">
                                    <div className="container mt-3 px-0">
                                        <div className="d-flex"></div>
                                    </div>
                                    <div className="mt-3 overflow-wrap">
                                        <div>{ReactHtmlParser(jobDescription)}</div>
                                        <div className="pr-2">
                                            {job.custom_field1 ? (
                                                <Fragment>
                                                    <span>{t(props.language?.layout?.jobs_external_nt)}: </span>
                                                    <a
                                                        href={
                                                            job.custom_field1.startsWith("http://") ||
                                                                job.custom_field1.startsWith("https://")
                                                                ? job.custom_field1
                                                                : `http://${job.custom_field1}`
                                                        }
                                                        className="d-print-none"
                                                        target="_blank">
                                                        {job.title}
                                                    </a>
                                                </Fragment>
                                            ) : null}
                                            {showMore ? (
                                                displayingMore ? (
                                                    <Link
                                                        to={{
                                                            state: job.slug,
                                                        }}
                                                        className="float-right d-print-none"
                                                        onClick={() => {
                                                            setDisplayingMore(false);
                                                            setDescription(
                                                                truncate(job.description, JobDescriptionLimit)
                                                            );
                                                        }}>
                                                        {t(props.language?.layout?.all_showless_nt)}
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to={{
                                                            state: job.slug,
                                                        }}
                                                        className="float-right d-print-none bg-white"
                                                        onClick={() => {
                                                            setDisplayingMore(true);
                                                            setDescription(job.description);
                                                        }}>
                                                        {t(props.language?.layout?.all_showmore_nt)}
                                                    </Link>
                                                )
                                            ) : null}
                                        </div>
                                    </div>
                                    {/* <div className="ml-auto pt-1">
                                        {job.job_start_date ? (
                                            <div className="mt-1 mb-0 text-left text-md-left">Start Date</div>
                                        ) : null}
                                        {job.job_end_date ? (
                                            <div className="mt-1 mb-0 text-left text-md-left">End Date</div>
                                        ) : null}
                                    </div> */}
                                    <hr />
                                </div>
                            </Tab>
                            {job.company_logo ||
                                job.company_founded_year ||
                                job.company_country ||
                                job.company_description ? (
                                <Tab eventKey="companyDetails" title="Company Details">
                                    <div id="company-details">
                                        <div className="container mt-3 px-0">
                                            <div className="d-flex">
                                                {job.company_logo ? (
                                                    <div className="p-0 pr-4">
                                                        <img
                                                            alt="Company"
                                                            src={job.company_logo}
                                                            className="img-fluid"
                                                            width="200px"
                                                            height="200px"
                                                        />
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                                <div className="ml-auto">
                                                    {job.company_founded_year ? (
                                                        <p className="mt-1 mb-0 text-left text-md-right">
                                                            Estd. {job.company_founded_year}
                                                        </p>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {job.company_country ? (
                                                        <p className="text-left text-md-right">
                                                            {job.company_city} {job.company_country}
                                                        </p>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-2">{job.company_description ? job.company_description : ""}</p>
                                    </div>
                                </Tab>
                            ) : (
                                ""
                            )}
                        </Tabs>
                    </div>
                    <div className="col-lg-3 col-md-4 mb-sm-4 mb-4">
                        {toggeleApplyBtn && (
                            <Chatbot
                                isAuthenticated={session.user.authenticated}
                                intent="job.apply"
                                session={session}
                                checkApplied={checkApplied}
                                setCheckApplied={setCheckApplied}
                                closeChatBotHandle={closeChatBotHandle}
                                jobQuestions={job.interview_questions}
                                slug={job.slug}
                                isApplied={job.applied}
                                title={job.title}
                            />
                        )}
                        {!toggeleApplyBtn && (
                            <React.Fragment>
                                <div className="card">
                                    <div className="card-body">
                                        <h4>{t(props.language?.layout?.js_view_insight_nt)}</h4>

                                        <p className="mb-0 mt-3 ">
                                            <b>{job.total_applications}</b> {t(props.language?.layout?.js_total_nt)}
                                        </p>
                                        <p className="card-text apply-card mt-1 mb-0">
                                            <b>{job.yesterday_applications}</b> {t(props.language?.layout?.ep_application_receivedyesterday1)}
                                        </p>
                                        {job.job_start_date ? (
                                            <p className="mb-0 mt-1">
                                                {t(props.language?.layout?.all_publishdate_nt)} : {renderToLocaleDate(job.job_start_date)}
                                            </p>
                                        ) : null}
                                        {job.job_end_date ? (
                                            <p className="mb-0 mt-1">
                                                {t(props.language?.layout?.all_expirydate_nt)} : {renderToLocaleDate(job.job_end_date)} {/* {no_translated} */}
                                            </p>
                                        ) : null}
                                        {job.openings ? (
                                            <p className="mb-0 mt-1">
                                                {t(props.language?.layout?.js_positions_nt)} : {job.openings}
                                            </p>
                                        ) : <p className="mb-0 mt-1">{t(props.language?.layout?.js_positions_nt)} : <b>1</b></p>
                                        }
                                        {/* <p /> */}
                                        {!job.applied ? (
                                            <div className="mb-3 card-text apply-card2">
                                                {t(props.language?.layout?.js_applicant_nt)}
                                                <span
                                                    data-toggle="tooltip"
                                                    data-placement="right"
                                                    title={t(props.language?.layout?.view_abbr1_nt)}>
                                                    <img
                                                        className="mb-1 ml-1 svg-xs"
                                                        alt="info"
                                                        src="/svgs/icons_new/info.svg"
                                                    />
                                                </span>
                                            </div>
                                        ) : null}
                                        <div>
                                            {job.applied_at && props.user.authenticated ? (
                                                <div className={job.applied == "applied" || job.applied == "withdrawn" ? " mt-2" : ""}>
                                                    <p className={"text-brown font-weight-bold " + (job.applied == "applied" ? " pt-2 m-0 p-0" : "")}  >
                                                        <span>
                                                            <img
                                                                class="svg-xs"
                                                                alt="applied"
                                                                src="/svgs/icons_new/check-circle.svg"
                                                            />
                                                        </span>
                                                        &nbsp;
                                                        <React.Fragment>
                                                            {job.applied !== "withdrawn" ? (
                                                                <span>
                                                                    {job.applied_at == null || job.applied_at == false ?
                                                                        null :
                                                                        <React.Fragment>
                                                                            {" "}
                                                                            {t(props.language?.layout?.ep_jobtitle_applied)}{" "}
                                                                            {formatDistance(
                                                                                subDays(new Date(job.applied_at), 0),
                                                                                new Date(), { locale: props.languageName === "en" ? en : props.languageName === "es" ? es : fr }
                                                                            ).replace(t(props.language?.layout?.about_nt), "")}{" "}
                                                                            {t(props.language?.layout?.all_ago_nt)}
                                                                        </React.Fragment>
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    {job.withdrawn_at == null || job.withdrawn_at == false ?
                                                                        null :
                                                                        <React.Fragment>
                                                                            {" "}
                                                                            Withdrawn{" "}
                                                                            {formatDistance(
                                                                                subDays(new Date(job.withdrawn_at), 0),
                                                                                new Date()
                                                                            ).replace(t(props.language?.layout?.about_nt), "")}{" "}
                                                                            {t(props.language?.layout?.all_ago_nt)}

                                                                            <button
                                                                                className="btn btn-primary btn-lg btn-block mt-2 mb-n2"
                                                                                onClick={reApplyHandler}
                                                                            >
                                                                                {t(props.language?.layout?.reapply_nt)}
                                                                            </button>

                                                                        </React.Fragment>
                                                                    }
                                                                </span>
                                                            )}
                                                        </React.Fragment>

                                                    </p>
                                                </div>
                                            ) :
                                                process.env.CLIENT_NAME == "microsoft" && props.user.authenticated && props.user.is_user
                                                    ?
                                                    (
                                                        <button
                                                            className="btn btn-primary btn-lg btn-block"
                                                            onClick={onApplyHandle}
                                                        >
                                                            {t(props.language?.layout?.all_apply_nt)}
                                                        </button>
                                                    ) : process.env.CLIENT_NAME == "cc"

                                                        ?
                                                        (

                                                            <button
                                                                className="btn btn-primary btn-lg btn-block"
                                                                onClick={onApplyHandle}
                                                            >
                                                                {t(props.language?.layout?.all_apply_nt)}
                                                            </button>
                                                        ) :
                                                        (

                                                            <button
                                                                className="btn btn-primary btn-lg btn-block"
                                                                onClick={onApplyHandle}
                                                                disabled={btnDisabled}
                                                            >
                                                                {t(props.language?.layout?.all_apply_nt)}
                                                            </button>
                                                        )
                                            }
                                            <div class="text-center p-2">
                                                {!props.user.authenticated && process.env.CLIENT_NAME == "microsoft"
                                                    ? (
                                                        <Link to={{
                                                            pathname: "/login",
                                                            state: {
                                                               pathname: `/jobs/${job.slug}`,
                                                           },
                                                       }}>{t(props.language?.layout?.header_login)}</Link>
                                                        // <a
                                                        //     class="btn-block"
                                                        //     href="/login">
                                                        //     {t(props.language?.layout?.header_login)}
                                                        // </a>
                                                    ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mt-4" id="jobAlertCard">
                                    <div className="card-body d-inline-block">
                                        {/* {session.user.authenticated ? ( */}
                                        <div>
                                            {job.job_subscribed ? (
                                                <div className="d-flex text-success font-weight-bold">
                                                    <p class="mt-3">
                                                        <span>
                                                            <img
                                                                class="svg-xs"
                                                                alt="applied"
                                                                src="svgs/icons_new/check-circle.svg"
                                                            />
                                                        </span>
                                                        &nbsp;
                                                    </p>
                                                    <span className="d-flex align-items-center ml-1">
                                                    {t(props.language?.layout?.subsmsg_nt)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <form onSubmit={subscribeHandler}>
                                                    <div className="form-group animated mt-3">
                                                        <h4 className="text-start">{t(props.language?.layout?.js_createalert_nt)}</h4>
                                                        <p className="card-text mb-0">{t(props.language?.layout?.js_createalert_info_nt)}</p>
                                                        <label className="form-label-active text-green" htmlFor="email">
                                                            {t(props.language?.layout?.login_email)}
                                                        </label>
                                                        <input
                                                            type="email"
                                                            placeholder={t(props.language?.layout?.youremail_nt)}
                                                            className="form-control"
                                                            id="email"
                                                            required
                                                            onChange={(e) => setUserEmail(e.target.value)}
                                                            value={userEmail}
                                                            name="email"
                                                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{3,}$"
                                                        />
                                                        <button
                                                            className="btn btn-primary btn-lg float-right px-1 mt-3 col-md-6 col-12"
                                                            disabled={disabled}>
                                                            {t(props.language?.layout?.ep_importjob_submit)}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}{" "}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
            <FooterUpdate />
        </div>
    );
};
function mapStateToProps(state) {
    // console.log("state ", state);
    return {
        user: state.authInfo.user,
        userToken: state.authInfo.userToken,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

// export default connect(mapStateToProps, {})(ViewJob);
export default connect(mapStateToProps, { _languageName, _setAuthData, _billingAuth })(ViewJob);
