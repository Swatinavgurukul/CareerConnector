import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import TableData from "./AddJob/jobsListTable/index.jsx";
import Spinner from "../partials/spinner.jsx";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { capitalizeFirstLetter } from "../modules/helpers.jsx";
// import { jobStatus } from "../components/constants.jsx";
import { toast } from "react-toastify";
import "react-toastify/scss/main.scss";
import ScheduleInterview from "../components/ScheduleInterview.jsx";
import OfferRelease from "../components/offerRelease.jsx";
import { calculateScore, calculateJobScore, calculateCustomScore } from "../components/constants.jsx";
import { _compareApplicants } from "../actions/actionsAuth.jsx";
import Slider from 'react-rangeslider';
import { useTranslation } from "react-i18next";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import DiscoveryTableData from "../user/discoverTable/index.jsx"
import InviteCandidate from "../user/inviteCandidate.jsx"
import { job_type, jobstage, job_status1 } from "../../translations/helper_translation.jsx";
import { es, enUS as en } from 'date-fns/locale'

const recruiterlist = (props) => {
    const { t } = useTranslation();
    const [scoreSortKey, setScoreSortKey] = useState(false);
    var tableJSON = [];
    tableJSON = props.user.role_id == 2 || props.user.role_id == 5
        ? ([
            { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "username" },
            { displayValue: t(props.language?.layout?.ep_jobs_status1), key: "status" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_experience), key: "experiance" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_location), key: "user_city" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_source), key: "" },
            { displayValue: t(props.language?.layout?.workauthorization_nt), key: "answer" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_appliedon), key: "created_at" },
        ])
        : props.userRole.role_id == null ? ([
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "username" },
            { displayValue: t(props.language?.layout?.ep_jobs_status1), key: "status" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_experience), key: "experiance" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_location), key: "user_city" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_source), key: "" },
            { displayValue: t(props.language?.layout?.workauthorization_nt), key: "answer" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_appliedon), key: "created_at" },
            { displayValue: t(props.language?.layout?.ep_jobs_actions), key: "" },
        ]) : process.env.CLIENT_NAME === "cc" ? ([
            { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "username" },
            { displayValue: t(props.language?.layout?.all_jobscore_nt), key: scoreSortKey ? "totalScore" : "weighted_score" },
            { displayValue: t(props.language?.layout?.ep_jobs_status1), key: "status" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_experience), key: "experiance" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_location), key: "user_city" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_source), key: "" },
            { displayValue: t(props.language?.layout?.workauthorization_nt), key: "answer" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_appliedon), key: "created_at" },
            { displayValue: t(props.language?.layout?.ep_jobs_actions), key: "" },
        ]) :
            process.env.CLIENT_NAME === "microsoft" ? ([
                { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "username" },
                { displayValue: t(props.language?.layout?.all_jobscore_nt), key: scoreSortKey ? "totalScore" : "weighted_score" },
                { displayValue: t(props.language?.layout?.ep_jobs_status1), key: "status" },
                { displayValue: t(props.language?.layout?.ep_jobtitle_experience), key: "experiance" },
                { displayValue: t(props.language?.layout?.ep_jobtitle_location), key: "user_city" },
                { displayValue: t(props.language?.layout?.ep_jobtitle_source), key: "" },
                { displayValue: t(props.language?.layout?.workauthorization_nt), key: "answer" },
                { displayValue: t(props.language?.layout?.ep_jobtitle_appliedon), key: "created_at" },
                { displayValue: t(props.language?.layout?.ep_jobs_actions), key: "" },
            ]) :
                ([
                    { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "username" },
                    { displayValue: t(props.language?.layout?.ep_jobs_status1), key: "status" },
                    { displayValue: t(props.language?.layout?.ep_jobtitle_experience), key: "experiance" },
                    { displayValue: t(props.language?.layout?.ep_jobtitle_location), key: "user_city" },
                    { displayValue: t(props.language?.layout?.ep_jobtitle_source), key: "" },
                    { displayValue: t(props.language?.layout?.workauthorization_nt), key: "answer" },
                    { displayValue: t(props.language?.layout?.ep_jobtitle_appliedon), key: "created_at" },
                    { displayValue: t(props.language?.layout?.ep_jobs_actions), key: "" },
                ])
    let discoverytableJSON = [];
    discoverytableJSON = [
        // { displayValue: "", type: "checkbox" },
        { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "first_name" },
        { displayValue: t(props.language?.layout?.all_jobscore_nt), key: "weighted_score" },
        { displayValue: t(props.language?.layout?.sp_adddetails_email), key: "email" },
        { displayValue: t(props.language?.layout?.ep_application_experience), key: "experience" },
        { displayValue: t(props.language?.layout?.all_company), key: "job_company" },
        { displayValue: t(props.language?.layout?.sp_js_jobapplied), key: "jobs_applied_count" },
        { displayValue: t(props.language?.layout?.sp_jobs_actions) },
    ]

    const { theme } = props;
    const [recruiterData, setRecruiterData] = useState([]);
    const [discoverData, setDiscoverData] = useState([]);
    const [filterCount, setFilterCount] = useState([]);
    const [allData, setAllData] = useState([]);
    const [prevJob, setPrevJob] = useState("");
    const [nextJob, setNextJob] = useState("");
    const [status, setStatus] = useState("");
    const [openModel, setOpenModel] = useState(false);
    const [openOfferModel, setOpenOfferModel] = useState(false);
    let [loading, setLoading] = useState(true);
    let [discoverloading, setDiscoverLoading] = useState(true);
    const [userData, setUserData] = useState("");
    const [scoreChange, setScoreChanges] = useState({});
    const [scoreChangeCheck, setScoreChangesCheck] = useState({});
    const [expand, setExpand] = useState(true)
    const [expandScores, setExpandScores] = useState(false)
    const [compareApplicantsLists, setCompareApplicantsLists] = useState([]);
    const [jobSlug, setJobSlug] = useState([]);
    const history = useHistory();
    const [rangeScore, setRangeScore] = useState({});
    const [deleteModal, setDeleteModal] = useState(false);
    const [userId, setUserId] = useState("");
    const [pageNumber, setPageNumber] = useState("");

    const [colors, setColors] = useState([
        theme.all_color,
        theme.screening_color,
        theme.interview_color,
        theme.offer_color,
        theme.active_color,
        theme.closed_color,
        theme.paused_color,
        theme.all_color,
        theme.closed_color,
    ]);
    const applicationStatus = [
        { key: "applied", value: t(props.language?.layout?.ep_applicationstatus_applied) },
        { key: "screening", value: t(props.language?.layout?.ep_applicationstatus_screening) },
        { key: "interview", value: t(props.language?.layout?.ep_applicationstatus_interview) },
        { key: "offered", value: t(props.language?.layout?.ep_applicationstatus_offered) },
        { key: "hired", value: t(props.language?.layout?.ep_applicationstatus_hired) },
        { key: "declined", value: t(props.language?.layout?.ep_applicationstatus_declined) },
        { key: "on-hold", value: t(props.language?.layout?.ep_applicationstatus_onhold) },
        { key: "rejected", value: t(props.language?.layout?.ep_applicationstatus_rejected) },
        { key: "withdrawn", value: t(props.language?.layout?.ep_applicationstatus_withdrawn) },
    ]
    // console.log(scoreSortKey,"scoreSortKey")
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <p
            className="text-dark"
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}>
            {children}
        </p>
    ));

    useEffect(() => {
        updateStatus();
        updateApplicationStatus();
        recruiterFilterHandler(props.location.pathname);
    }, [status]);

    useEffect(() => {
        props._compareApplicants([]);
    }, []);
    useEffect(() => {
        discoverHandler()
    }, [pageNumber]);
    const jobStageHandler = (language, key) => {
        return (jobstage[language][key]);
    }
    const statusHandler = (language, key) => {
        return (job_status1[language][key]);
    }
    const updateApplicationStatus = (value, id) => {
        if (!value) return;
        let obj = {
            current_status: value,
        };
        Axios.put(`api/v1/recruiter/application/${id}`, obj, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }).then((response) => {
            recruiterFilterHandler(props.location.pathname);
            recruiterHandler(props.location.pathname);
            toast.success(`${t(props.language?.layout?.toast45_nt)} ${jobStageHandler(props?.languageName, obj.current_status)}`, {});
        });
    };
    const updateStatus = (value, slug) => {
        if (!value) return;
        let obj = {
            status: value,
        };
        Axios.put(`api/v1/recruiter/${slug}`, obj, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }).then((response) => {
            recruiterFilterHandler(props.location.pathname);
            recruiterHandler(props.location.pathname);
            toast.success(`${t(props.language?.layout?.toast49_nt)} ${statusHandler(props?.languageName, obj.status)}`, {});
        });
    };
    const recruiterFilterHandler = (slugname) => {
        let endpoint =
            props.userRole.user_id == 1
                ? `api/v1/admin/${props.match.params.id}/application/count`
                : `api/v1/recruiter/${props.match.params.id}/application/status/count`;
        Axios.get(endpoint, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((resp) => {
                setAllData(resp.data.data);
                setPrevJob(resp.data.data.previous_slug);
                setNextJob(resp.data.data.next_slug);
                setFilterCount(resp.data.data.data);
                // application/status/count => custom_field4 to category_score
                recruiterHandler(JSON.parse(resp.data.data.category_score));
                let customFields = JSON.parse(resp.data.data.category_score)
                let suggestedScore = {}
                if (customFields !== null) {
                    for (let key in customFields) {
                        if (key)
                            asssign(key, customFields[key], suggestedScore)
                    }
                    setRangeScore(suggestedScore)
                }
            })
            .catch((error) => { });
    };

    const scoringNum = (num) => {
        let y = num % 1
        let n = y.toString();
        if (n[2] <= 5) {
            let z = Math.floor(num)
            return z;
        }
        else {
            let z = Math.ceil(num)
            return z;
        }
    }

    const asssign = (key, value, dataObj) => {
        switch (key) {
            case 'Skills':
                dataObj['skills'] = scoringNum(value * 100)
                break;
            case 'Education':
                dataObj['education'] = scoringNum(value * 100)
                break;
            case 'Certifications':
                dataObj['certification'] = scoringNum(value * 100)
                break;
            case 'Industries':
                dataObj['industry'] = scoringNum(value * 100)
                break;
            case 'JobTitles':
                dataObj['jobTitle'] = scoringNum(value * 100)
                break;
            case 'ManagementLevel':
                dataObj['mgmtLevel'] = scoringNum(value * 100)
                break;
        }
    }
    const pageNumberHandler = (value) => {
        setPageNumber(value);
    }
    const discoverHandler = () => {
        let apiEndPoint;
        if (pageNumber) {
            apiEndPoint = `api/v1/recruiter/discover/jobseekers/${props.history?.location?.state?.slug}?page=${pageNumber}`;
        }
        else {
            apiEndPoint = `api/v1/recruiter/discover/jobseekers/${props.history?.location?.state?.slug}`
        }
        Axios.get(apiEndPoint, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                setDiscoverData(response.data.data)
                setDiscoverLoading(false);

            })
            .catch((error) => {
                if (error) {
                    DiscoverStatusHandler();
                }
                setDiscoverLoading(false);
            })
    }
    const recruiterHandler = (custom) => {
        let apiEndPoint;
        if (props.userRole.role_id == null) {
            apiEndPoint = `api/v1/admin/${props.match.params.id}/allapplication`
        } else {
            if (status !== "") {
                props.userRole.role_id == 1 || props.userRole.role_id == 4
                    ? (apiEndPoint = `api/v1/hiring/${props.match.params.id}/applicants?status=${status}`)
                    : (apiEndPoint = `api/v1/recruiter/${props.match.params.id}/applicants?status=${status}`);
            } else {
                props.userRole.role_id == 1 || props.userRole.role_id == 4
                    ? (apiEndPoint = `api/v1/hiring/${props.match.params.id}/applicants`)
                    : (apiEndPoint = `api/v1/recruiter/${props.match.params.id}/applicants`);
            }
        }
        Axios.get(apiEndPoint, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((resp) => {
                let Jobb = []
                resp.data.data.forEach((item) => {
                    Jobb.push(item.job_slug)
                })
                setJobSlug(Jobb[0]);
                let updatedData = [];
                setScoreChanges(resp.data.data);
                setScoreChangesCheck(resp.data.data);
                custom !== null ?
                    resp.data.data.forEach((item) => {
                        // if (item.sov_score) {
                        //     var totalScore = calculateCustomScore(custom, item?.sov_score)
                        //     item.totalScore = totalScore;
                        //     updatedData.push(item);
                        // } else {
                        item.totalScore = item.weighted_score;
                        updatedData.push(item);
                        // }
                    }) :
                    resp.data.data.forEach((item) => {
                        item.totalScore = item.weighted_score;
                        updatedData.push(item);
                    });
                if (custom === null) {
                    let suggestScore = {
                        skills: 20,
                        education: 20,
                        certification: 0,
                        industry: 20,
                        jobTitle: 20,
                        mgmtLevel: 20
                    }
                    resp.data.data.forEach((item) => {
                        if (item.suggested_score !== 0) {
                            suggestScore.skills = scoringNum(item?.suggested_score?.Skills * 100);
                            suggestScore.certification = scoringNum(item?.suggested_score?.Certifications * 100);
                            suggestScore.education = scoringNum(item?.suggested_score?.Education * 100);
                            suggestScore.executivetype = scoringNum(item?.suggested_score?.ExecutiveType * 100);
                            suggestScore.industry = scoringNum(item?.suggested_score?.Industries * 100);
                            suggestScore.jobTitle = scoringNum(item?.suggested_score?.JobTitles * 100);
                            suggestScore.languages = scoringNum(item?.suggested_score?.Languages * 100);
                            suggestScore.mgmtLevel = scoringNum(item?.suggested_score?.ManagementLevel * 100);
                            return suggestScore;
                        }
                    });
                    setRangeScore(suggestScore);
                }
                setRecruiterData(updatedData);
                setCreatedUser(updatedData.created_by);
                setPrevJob(updatedData.previous_job);
                setNextJob(updatedData.next_job);
                var salary = updatedData.salary_frequency.split("-");
                var freq = salary.map((s) => {
                    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                });
                setSalaryFrequency(freq.join("-"));
                setLoading(false);
            })
            .catch((error) => {
                if (error) {
                    ServerStatusHandler();
                }
                setLoading(false);
            });
    };
    const checkFilter = (filterName) => {
        if (status === filterName) {
            setStatus("");
        } else {
            setStatus(filterName);
        }
    };
    const change = (event) => {
        updateStatus(event.target.value, allData.slug);
    };

    const actionsToDo = (actionItem, userData) => {
        if (actionItem === "scheduleInterview") {
            setOpenModel(true);
        }
        if (actionItem === "offerRelease") {
            setOpenOfferModel(true);
        }
        if (actionItem === "open") {
            setShow(true);
        }
        setUserData(userData);
    };
    const discoveractionsToDo = (actionItem) => {
        if (actionItem === "delete") {
            setDeleteModal(true);
        }
    }
    const closeModal = (actionItem) => {
        if (actionItem === "closeScheduleInterview") {
            setOpenModel(false);
        }
        if (actionItem === "offerRelease") {
            setOpenOfferModel(false);
        }
        if (actionItem === "close") {
            setShow(false);
        }
    };
    const ServerStatusHandler = () => {
        return (
            <div className="col-md-3 mx-auto">
                <div className="text-muted text-center mt-5 pt-5">
                    <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid" />
                    <h3 className="pt-2">{t(props.language?.layout?.all_empty_nt)}</h3>
                </div>
            </div>
        );
    };
    const DiscoverStatusHandler = () => {
        return (
            <div className="col-md-3 mx-auto">
                <div className="text-muted text-center mt-5 pt-5">
                    <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid" />
                    <h5 className="pt-2">{t(props.language?.layout?.nomatches_nt)}</h5>
                </div>
            </div>
        );
    };
    const applyRange = () => {
        let scoreCha = JSON.parse(JSON.stringify(scoreChange))
        scoreChangeCheck.forEach((item, i) => {
            var scoresds = calculateJobScore(item.sov_score, rangeScore);
            scoreCha[i].sov_job = item.sov_score;
            scoreCha[i].totalScore = scoresds.totalScore
            setScoreChanges(scoreCha)
        });
        setScoreSortKey(true)
        setRecruiterData(scoreCha);
    };
    const handlerCompareApplicants = (event, id) => {
        let check = event;
        if (check) {
            compareApplicantsLists.push(id);
            setCompareApplicantsLists([...compareApplicantsLists]);
            props._compareApplicants(compareApplicantsLists);
        } else {
            var idsList = compareApplicantsLists.filter((compare) => {
                return compare != id;
            });
            setCompareApplicantsLists([...idsList]);
            props._compareApplicants(idsList);
        }
    };

    const validate = () => {
        if (compareApplicantsLists.length == 1) {
            toast.error("Select minimum 2 applicants to compare.");
            return;
        }
        if (compareApplicantsLists.length == 0) {
            toast.error("Select applicants to compare.");
            return;
        }
        if (compareApplicantsLists.length > 4) {
            toast.error("Max 4 applicants can be compared.");
            return;
        }

        history.push({
            pathname: "/compareApplicants",
            state: {
                jobTitle: allData.title,
                jobSlug: jobSlug,
                recruiterData: recruiterData
            },
        });
    }

    const removeCandidates = () => {
        setCompareApplicantsLists([]);
        props._compareApplicants([]);
    }
    const handleSelect = (key) => {
        if (key === "discover") {
            discoverHandler()
        }
    };
    const inviteCandidateHandler = (id) => {
        setUserId(id);
        setDeleteModal(true);
    };
    const closeinviteModal = () => {
        setDeleteModal(false);
    };
    const jobStatus = [
        { key: "active", value: t(props.language?.layout?.ep_jobstatus_active) },
        { key: "paused", value: t(props.language?.layout?.ep_jobstatus_paused) },
        { key: "closed", value: t(props.language?.layout?.ep_jobstatus_closed) },
        { key: "draft", value: t(props.language?.layout?.ep_jobstatus_draft) },
        { key: "Offered", value: t(props.language?.layout?.ep_jobstatus_offered) }];


    const jobTypeHandler = (language, key) => {
        return (job_type[language][key]);
    }
    return (
        <div className="col-md-10 px-0">
            <div className="d-flex">
                <div className="container-fluid">
                    <div className="d-md-flex justify-content-between pt-4 px-2 gray-100">
                        <div className="col-md-6 p-0">

                            <div className="d-flex align-items-center mb-3 icon-invert">
                                <h4 className="mb-0">
                                    <Link aria-labelledby='all Jobs' to={`/jobs/`} className="text-muted">
                                        {t(props.language?.layout?.sp_jobs_alljobs)}
                                    </Link>
                                    <img
                                        className="svg-sm mx-1"
                                        src="svgs/icons_new/chevron-right.svg"
                                        title="Arrow"
                                        alt="Arrow Icon"
                                    />
                                    <span className="text-capitalize">{allData.title}</span>
                                </h4>
                                <div className="ml-3">
                                    {props.user.role_id == 2 || props.user.role_id == 5 ? (
                                        <span
                                            className="text-capitalize px-2 rounded"
                                            style={
                                                allData.status == "active"
                                                    ? theme.active_color
                                                    : allData.status == "paused"
                                                        ? theme.paused_color
                                                        : allData.status == "draft"
                                                            ? theme.interview_color
                                                            : allData.status == "closed"
                                                                ? theme.closed_color
                                                                : allData.status == "offered"
                                                                    ? theme.offer_color
                                                                    : theme.all_color
                                            }
                                            aria-label="status"
                                        >
                                            {statusHandler(props?.languageName, allData.status)}
                                        </span>
                                    ) : (
                                        <select
                                            className="border-0 btn-sm py-0 text-capitalize"
                                            style={
                                                allData.status == "active"
                                                    ? theme.active_color
                                                    : allData.status == "paused"
                                                        ? theme.paused_color
                                                        : allData.status == "draft"
                                                            ? theme.interview_color
                                                            : allData.status == "closed"
                                                                ? theme.closed_color
                                                                : allData.status == "offered"
                                                                    ? theme.offer_color
                                                                    : theme.all_color
                                            }
                                            aria-label="status"
                                            onChange={change}
                                            value={allData.status}>
                                            {jobStatus.map((filter) => (
                                                <option className="bg-white" key={filter.key} value={filter.key}>
                                                    {filter.value}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <img
                                    className="svg-lg-x2 mr-3 mb-2"
                                    src="svgs/temp/application.svg"
                                    alt="Application Icon"
                                    title="Application Icon"
                                />
                                <div>
                                    <div className="d-flex">
                                        <p className="d-flex mb-0">
                                            {allData.job_city == null ? "" : <p>{allData.job_city} | </p>}
                                        </p>
                                        <p className=" d-flex text-capitalize mb-0">
                                            {allData.salary_max == null ? (
                                                ""
                                            ) : (
                                                <p className="mb-0">${allData.salary_max}</p>
                                            )}
                                            &nbsp;
                                            {allData.salary_max == null
                                                ? ""
                                                : capitalizeFirstLetter(allData.salary_frequency)}
                                        </p>{" "}
                                        <p className="d-flex text-capitalize mb-0">
                                            {allData.job_type == null ? (
                                                ""
                                            ) : (
                                                <p> | {jobTypeHandler(props?.languageName, allData.job_type)}</p>
                                            )}
                                        </p>
                                    </div>
                                    <p className="mb-0">
                                        {allData.applicants != 0 ? (
                                            <span className="text-dark">
                                                {allData.applicants}
                                                {recruiterData.application_count >= 1 ? t(props.language?.layout?.sp_application_applicants) : t(props.language?.layout?.all_applicant)}
                                            </span>
                                        ) : null}
                                        <span className="text-dark">&nbsp;&nbsp;|&nbsp;</span> {t(props.language?.layout?.all_createdby_nt)}&nbsp;
                                        <span>{allData.created_by}</span>&nbsp;
                                        <span>
                                            {allData.created_at
                                                ? formatDistance(
                                                    subDays(new Date(allData.created_at), 0),
                                                    new Date(), { locale: props.languageName === "en" ? en : es }
                                                ).replace("about", "")
                                                : ""}
                                        </span>
                                        &nbsp;{t(props.language?.layout?.all_ago_nt)}&nbsp;
                                        <span className="text-dark"> | </span> &nbsp;
                                        <span className="d-inline-flex">
                                            {t(props.language?.layout?.all_publishedon_nt)}&nbsp;
                                            {/* <Link to={`/jobs/`} className="pointer text-dark"> */}
                                            {t(props.language?.layout?.all_careerspage_nt)}
                                            {/* </Link> */}
                                            {/* &nbsp;and &nbsp;
                                            <span> 0 other job boards </span> */}
                                            {/* <Dropdown drop="down">
                                                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                                        4 other job boards
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="bg-light thin-scrollbar dropdown-height">
                                                        <Dropdown.Item eventKey="1" className="p-2 dropdown_item">
                                                            <div className="d-flex small align-items-baseline">
                                                                <h6 className="mb-0 ml-2">Linkedin</h6>
                                                                &nbsp;&nbsp;(Published on 10-2-2021)
                                                            </div>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="1" className="p-2 dropdown_item">
                                                            <div className="d-flex small align-items-baseline">
                                                                <h6 className="mb-0 ml-2">Indeed</h6>
                                                                &nbsp;&nbsp;(Published on 10-2-2021)
                                                            </div>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="1" className="p-2 dropdown_item">
                                                            <div className="d-flex small align-items-baseline">
                                                                <h6 className="mb-0 ml-2">Naukri</h6>
                                                                &nbsp;&nbsp;(Published on 10-2-2021)
                                                            </div>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="1" className="p-2 dropdown_item">
                                                            <div className="d-flex small align-items-baseline">
                                                                <h6 className="mb-0 ml-2">Careerbuilder</h6>
                                                                &nbsp;&nbsp;(Published on 10-2-2021)
                                                            </div>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </u> */}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 px-md-0">
                            {props.user.role_id == 2 || props.user.role_id == 5 ? (
                                ""
                            ) : (
                                <div className="icon-invert d-flex align-items-end justify-content-end mt-3 mt-md-0">
                                    {props.user.role_id == 1 || props.user.role_id == 4 ? (
                                        ""
                                    ) : (
                                        <Fragment className="icon-invert">
                                            <Link
                                                to={{
                                                    pathname: `/jobs/${allData.slug}`,
                                                    data: allData.slug,
                                                    state: allData.slug,
                                                }}>
                                                <img
                                                    src="/svgs/icons_new/external-link.svg"
                                                    className="svg-sm svg-gray mt-n3"
                                                    title="View job"
                                                    alt="Search Icon"
                                                />
                                            </Link>
                                            <img
                                                src="/svgs/icons_new/edit-2.svg"
                                                className="svg-sm mx-4 mb-2 svg-gray pointer"
                                                alt="Edit Icon"
                                                title="Edit"
                                            />{" "}
                                        </Fragment>
                                    )}
                                    {/* <img
                                        src="/svgs/icons_new/download.svg"
                                        className="svg-sm mb-2 svg-gray pointer"
                                        alt="Download Icon"
                                        title="Download"
                                    /> */}
                                    {props.user.role_id === 1 || props.user.role_id === 4 ? null : (
                                        <div className="d-flex">
                                            <button type="button" class="btn btn-light mx-4">
                                                Import
                                            </button>
                                            <button type="button" class="btn btn-primary border-0">
                                                + Add Candidates
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* temporarily current job slug added */}
                            <div className="d-flex justify-content-end mt-4 pt-2">
                                {/* <Link
                                    className={`text-muted ${nextJob === null ? "disabled" : "text-decoration-none"}`}
                                    to={`/jobs/${allData.next_slug}/applications`}>
                                    <div
                                        onClick={() => recruiterHandler("/job/" + allData.next_slug)}
                                        className={"mr-4 disabled"}>
                                        <img
                                            className="svg-sm svg-gray"
                                            src="svgs/icons_new/chevron-left.svg"
                                            title="Previous"
                                            alt="Arrow Icon"
                                        />
                                        Prev Job
                                    </div>
                                </Link>
                                <Link
                                    className={`text-muted ${prevJob === null ? "disabled" : "text-decoration-none"}`}
                                    to={`/jobs/${prevJob == null ? "" : allData.previous_slug}/applications`}>
                                    <div
                                        onClick={() => recruiterHandler("/job/" + allData.previous_slug)}
                                        className={"disabled"}>
                                        Next Job
                                        <img
                                            className="svg-sm svg-gray"
                                            src="svgs/icons_new/chevron-right.svg"
                                            title="Next"
                                            alt="Arrow Icon"
                                        />
                                    </div>
                                </Link> */}
                            </div>
                        </div>
                    </div>
                    <div className="px-2 pt-2">
                        <Tabs
                            defaultActiveKey="allapplications"
                            onSelect={handleSelect}
                            id="uncontrolled-tab-example"
                            className="nav-underline-primary">
                            <Tab eventKey="allapplications" title={t(props.language?.layout?.ep_jobtitle_applications)} >
                                {/* <h4 className="mb-4 mt-4">{t(props.language?.layout?.sp_jobtitle_allapplications)}</h4> */}                        {/* <div className="d-flex justify-content-between my-3 pl-4">
                            <div className="d-flex align-items-center">
                                <h6 className="text-muted mb-0">Filters</h6>
                                <div className="form-group ml-4 mb-0">
                                    <select
                                        className="form-control p-0 rounded-0 pointer border-top-0 border-right-0 border-left-0 border-dark"
                                        style={{ fontSize: "12px" }}>
                                        <option value="" disabled selected className="d-none">
                                            Sourced
                                        </option>
                                        <option value="1">.....</option>
                                        <option value="2">.....</option>
                                    </select>
                                </div>
                                <div className="form-group mx-4 mb-0">
                                    <select
                                        className="form-control p-0 rounded-0 pointer border-top-0 border-right-0 border-left-0 border-dark"
                                        style={{ fontSize: "12px" }}>
                                        <option value="" disabled selected className="d-none">
                                            In Last 30 days
                                        </option>
                                        <option value="1">1 Day</option>
                                        <option value="2">3 Days</option>
                                        <option value="7">7 Days</option>
                                        <option value="30">30 Days</option>
                                    </select>
                                </div>
                                <div className="form-group mb-0">
                                    <select
                                        className="form-control p-0 rounded-0 pointer border-top-0 border-right-0 border-left-0 border-dark"
                                        style={{ fontSize: "12px" }}>
                                        <option value="" disabled selected className="d-none">
                                            Experience
                                        </option>
                                        <option value="1"> 0-2 Years</option>
                                        <option value="1"> 2-5 Years</option>
                                        <option value="1"> 5-8 Years</option>
                                        <option value="1"> &gt; 8 Years</option>
                                    </select>
                                </div>
                            </div>
                        </div> */}
                                <ScheduleInterview
                                    actionsToDo={actionsToDo}
                                    closeModal={closeModal}
                                    openModel={openModel}
                                    updateStatus={updateApplicationStatus}
                                    userData={userData}
                                />
                                <OfferRelease
                                    actionsToDo={actionsToDo}
                                    closeModal={closeModal}
                                    openModel={openOfferModel}
                                    updateStatus={updateStatus}
                                    userData={userData}
                                />
                                {compareApplicantsLists.length !== 0 ? (

                                    <div className="mt-3" style={{ width: "fit-content" }}>
                                        <button type="button" className="close ml-3 mt-n2" aria-label="Close" title="Close" onClick={removeCandidates}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        <img className="svg-sm mr-2" src="svgs/icons_new/detail-fill-icon.svg" title="Information" alt="Info" />
                                        <small>{props.compareApplicants.length} candidates selected</small>
                                        <div className="d-md-flex mt-3">
                                            <button onClick={validate} className="btn btn-outline-primary px-3" disabled={!recruiterData.length}>
                                                <img className="svg-sm mr-2 icon-blue" src="svgs/icons_new/compare-black-icon.svg" title="Compare Applicants" alt="Compare" />
                                                Compare
                                            </button>
                                            {/* <button className="btn btn-outline-primary mx-3 px-4">
                                    <img className="svg-sm mr-2" src="svgs/icons_new/mail.svg" title="Email" alt="Email"/>
                                    Email
                                </button>
                                <button className="btn btn-outline-primary px-4">
                                    <img className="svg-sm mr-2" src="svgs/icons_new/mail.svg" title="SMS" alt="SMS"/>
                                    SMS
                                </button>
                                <button className="btn btn-outline-primary mx-3">
                                    <img className="svg-sm mr-2" src="svgs/icons_new/mail.svg" title="Change Status" alt="Change Status"/>
                                    Change Status
                                </button>
                                <button className="btn btn-outline-primary">
                                    <img className="svg-sm mr-2" src="svgs/icons_new/mail.svg" title="Delete" alt="Delete"/>
                                    Delete selected
                                </button> */}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="filter-status">
                                        {/* <div className="d-md-flex align-items-center mb-3 pl-3">
                                    <h6 className="text-muted mb-0">Filters</h6>
                                    <div className="form-group ml-4 mb-0">
                                        <select
                                            className="form-control p-0 rounded-0 pointer border-top-0 border-right-0 border-left-0 border-dark"
                                            style={{ fontSize: "12px" }}>
                                            <option value="" disabled selected className="d-none">
                                                Sourced
                                            </option>
                                            <option value="1">.....</option>
                                            <option value="2">.....</option>
                                        </select>
                                    </div>
                                    <div className="form-group mx-4 mb-0">
                                        <select
                                            className="form-control p-0 rounded-0 pointer border-top-0 border-right-0 border-left-0 border-dark"
                                            style={{ fontSize: "12px" }}>
                                            <option value="" disabled selected className="d-none">
                                                In Last 30 days
                                            </option>
                                            <option value="1">1 Day</option>
                                            <option value="2">3 Days</option>
                                            <option value="7">7 Days</option>
                                            <option value="30">30 Days</option>
                                        </select>
                                    </div>
                                    <div className="form-group mb-0">
                                        <select
                                            className="form-control p-0 rounded-0 pointer border-top-0 border-right-0 border-left-0 border-dark"
                                            style={{ fontSize: "12px" }}>
                                            <option value="" disabled selected className="d-none">
                                                Experience
                                            </option>
                                            <option value="1"> 0-2 Years</option>
                                            <option value="1"> 2-5 Years</option>
                                            <option value="1"> 5-8 Years</option>
                                            <option value="1"> &gt; 8 Years</option>
                                        </select>
                                    </div>
                                </div> */}
                                        <div className="d-md-flex mt-4 mb-1 pl-3">
                                            <div className="text-muted h6 mr-4">{t(props.language?.layout?.ep_jobs_status1)}:</div>
                                            <ul className="nav nav-pills nav-fill">
                                                {/* {filterCount.map((item, key) => (
                                            <li className="mr-1 mb-1">
                                                <a
                                                    className="nav-link rounded-pill py-0 pointer btn-sm btn "
                                                    tabIndex="0"
                                                    style={colors[key]}
                                                    onClick={() => checkFilter(item.status)}>
                                                    {item.display_name} ({item.count})
                                                </a>
                                            </li>
                                        ))} */}
                                                {applicationStatus.map((item, key) => (
                                                    <li className="mr-1 mb-1">
                                                        <a
                                                            className="nav-link rounded-pill py-0 pointer btn-sm btn text-capitalize"
                                                            tabIndex="0"
                                                            style={colors[key]}
                                                            onClick={() => checkFilter(item.key)}>
                                                            {item.value}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                            {props.user.role_id == 1 ?
                                                <button
                                                    type="button"
                                                    class="btn btn-light ml-auto mt-n2"
                                                    aria-label="Open"
                                                    title={t(props.language?.layout?.open_nt)}
                                                    onClick={() => setExpandScores(!expandScores)}>
                                                    {t(props.language?.layout?.scoring_nt)}
                                                    <img src={"/svgs/icons_new/" + (expandScores ? "chevron-up" : "chevron-down") + ".svg"}
                                                        alt="chevron" className="svg-xs ml-2" />
                                                </button> : ""
                                            }
                                        </div>
                                    </div>
                                )}
                                {(expandScores && compareApplicantsLists.length === 0) ? <div className="row h-5rem mt-n3">
                                    <div className="col">
                                        <div className="row">
                                            <div className="col-md-2">
                                                <div
                                                    className="text-right text-danger position-relative"
                                                    style={{ top: "2.4rem" }}>
                                                    {rangeScore.skills}%
                                                </div>
                                                <div class="form-group animated mt-n4">
                                                    <label className="custom-range-label" for="customRange">
                                                        {t(props.language?.layout?.js_dashboard_skills)}
                                                        <abbr
                                                            title={t(props.language?.layout?.interview_abbr1_nt)}
                                                            className="align-top d-inline-flex">
                                                            <img
                                                                src="/svgs/icons_new/info.svg"
                                                                alt="info"
                                                                className="svg-xs-1 align-top"
                                                            />
                                                        </abbr>
                                                    </label>
                                                    <Slider
                                                        min={0}
                                                        max={100}
                                                        value={rangeScore.skills}
                                                        orientation='horizontal'
                                                        onChange={(value) => setRangeScore({ ...rangeScore, skills: value })
                                                        }

                                                    />
                                                    {/* <input
                                                type="range"
                                                className="custom-range"
                                                min="0"
                                                max="100"
                                                id="customRange"
                                                name="skills"
                                                onInput={changeValue}
                                                value={rangeScore.skills}
                                            /> */}
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div
                                                    className="text-right text-danger position-relative"
                                                    style={{ top: "2.4rem" }}>
                                                    {rangeScore.certification}%
                                                </div>
                                                <div class="form-group animated mt-n4">
                                                    <label className="custom-range-label" for="customRange1">
                                                        {t(props.language?.layout?.profile_certification_nt)}
                                                        <abbr
                                                            title={t(props.language?.layout?.interview_abbr2_nt)}
                                                            className="align-top d-inline-flex">
                                                            <img
                                                                src="/svgs/icons_new/info.svg"
                                                                alt="info"
                                                                className="svg-xs-1 align-top"
                                                            />
                                                        </abbr>
                                                    </label>
                                                    <Slider
                                                        min={0}
                                                        max={100}
                                                        value={rangeScore.certification}
                                                        orientation='horizontal'
                                                        onChange={(value) => setRangeScore({ ...rangeScore, certification: value })
                                                        }
                                                    />
                                                    {/* <input
                                                type="range"
                                                className="custom-range"
                                                min="0"
                                                max="100"
                                                id="customRange1"
                                                name="certification"
                                                onInput={changeValue}
                                                value={rangeScore.certification}
                                            /> */}
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div
                                                    className="text-right text-danger position-relative"
                                                    style={{ top: "2.4rem" }}>
                                                    {rangeScore.industry}%
                                                </div>
                                                <div class="form-group animated mt-n4">
                                                    <label className="custom-range-label" for="customRange2">
                                                        {t(props.language?.layout?.all_industry)}
                                                        <abbr
                                                            title={t(props.language?.layout?.interview_abbr3_nt)}
                                                            className="align-top d-inline-flex">
                                                            <img
                                                                src="/svgs/icons_new/info.svg"
                                                                alt="info"
                                                                className="svg-xs-1 align-top"
                                                            />
                                                        </abbr>
                                                    </label>
                                                    <Slider
                                                        min={0}
                                                        max={100}
                                                        value={rangeScore.industry}
                                                        orientation='horizontal'
                                                        onChange={(value) => setRangeScore({ ...rangeScore, industry: value })
                                                        }
                                                    />
                                                    {/* <input
                                                type="range"
                                                className="custom-range"
                                                min="0"
                                                max="100"
                                                id="customRange2"
                                                name="industry"
                                                onInput={changeValue}
                                                value={rangeScore.industry}
                                            /> */}
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div
                                                    className="text-right text-danger position-relative"
                                                    style={{ top: "2.4rem" }}>
                                                    {rangeScore.education}%
                                                </div>
                                                <div class="form-group animated mt-n4">
                                                    <label className="custom-range-label" for="customRange3">
                                                        {t(props.language?.layout?.all_education_nt)}
                                                        <abbr
                                                            title={t(props.language?.layout?.interview_abbr4_nt)}
                                                            className="align-top d-inline-flex">
                                                            <img
                                                                src="/svgs/icons_new/info.svg"
                                                                alt="info"
                                                                className="svg-xs-1 align-top"
                                                            />
                                                        </abbr>
                                                    </label>
                                                    <Slider
                                                        min={0}
                                                        max={100}
                                                        value={rangeScore.education}
                                                        orientation='horizontal'
                                                        onChange={(value) => setRangeScore({ ...rangeScore, education: value })
                                                        }
                                                    />
                                                    {/* <input
                                                type="range"
                                                className="custom-range"
                                                min="0"
                                                max="100"
                                                id="customRange3"
                                                name="education"
                                                onInput={changeValue}
                                                value={rangeScore.education}
                                            /> */}
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div
                                                    className="text-right text-danger position-relative"
                                                    style={{ top: "2.4rem" }}>
                                                    {rangeScore.mgmtLevel}%
                                                </div>
                                                <div class="form-group animated mt-n4">
                                                    <label className="custom-range-label" for="customRange4">
                                                        {t(props.language?.layout?.profile_management_nt)}
                                                        <abbr
                                                            title={t(props.language?.layout?.interview_abbr5_nt)}
                                                            className="align-top d-inline-flex">
                                                            <img
                                                                src="/svgs/icons_new/info.svg"
                                                                alt="info"
                                                                className="svg-xs-1 align-top"
                                                            />
                                                        </abbr>
                                                    </label>
                                                    <Slider
                                                        min={0}
                                                        max={100}
                                                        value={rangeScore.mgmtLevel}
                                                        orientation='horizontal'
                                                        onChange={(value) => setRangeScore({ ...rangeScore, mgmtLevel: value })
                                                        }
                                                    />
                                                    {/* <input
                                                type="range"
                                                className="custom-range"
                                                min="0"
                                                max="100"
                                                id="customRange4"
                                                name="mgmtLevel"
                                                onInput={changeValue}
                                                value={rangeScore.mgmtLevel}
                                            /> */}
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div
                                                    className="text-right text-danger position-relative"
                                                    style={{ top: "2.4rem" }}>
                                                    {rangeScore.jobTitle}%
                                                </div>
                                                <div class="form-group animated mt-n4">
                                                    <label className="custom-range-label" for="customRange5">
                                                        {t(props.language?.layout?.homepage_jobtitle)}
                                                        <abbr
                                                            title={t(props.language?.layout?.interview_abbr6_nt)}
                                                            className="align-top d-inline-flex">
                                                            <img
                                                                src="/svgs/icons_new/info.svg"
                                                                alt="info"
                                                                className="svg-xs-1 align-top"
                                                            />
                                                        </abbr>
                                                    </label>

                                                    <Slider
                                                        min={0}
                                                        max={100}
                                                        value={rangeScore.jobTitle}
                                                        orientation='horizontal'
                                                        onChange={(value) => setRangeScore({ ...rangeScore, jobTitle: value })
                                                        }
                                                    />
                                                    {/* <input
                                                type="range"
                                                className="custom-range"
                                                min="0"
                                                max="100"
                                                id="customRange5"
                                                name="jobTitle"
                                                onInput={changeValue}
                                                value={rangeScore.jobTitle}
                                            /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-2 text-center d-flex flex-column pt-4 mt-4">
                                        <div className="mx-auto"><button
                                            className="btn btn-primary px-4"
                                            onClick={() => applyRange()}
                                            disabled={
                                                rangeScore.skills +
                                                    rangeScore.certification +
                                                    rangeScore.industry +
                                                    rangeScore.education +
                                                    rangeScore.mgmtLevel +
                                                    rangeScore.jobTitle ==
                                                    100
                                                    ? false
                                                    : true
                                            }>
                                            {t(props.language?.layout?.all_apply_nt)}  ({rangeScore.skills +
                                                rangeScore.certification +
                                                rangeScore.industry +
                                                rangeScore.education +
                                                rangeScore.mgmtLevel +
                                                rangeScore.jobTitle})
                                        </button></div>
                                        <div>{rangeScore.skills +
                                            rangeScore.certification +
                                            rangeScore.industry +
                                            rangeScore.education +
                                            rangeScore.mgmtLevel +
                                            rangeScore.jobTitle == 100 ? "" :
                                            <small className="text-warning">{t(props.language?.layout?.range100_nt)}</small>}</div>
                                    </div>
                                </div> : null}

                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <Fragment>
                                        {recruiterData && recruiterData.length !== 0 ? (
                                            <TableData
                                                data={recruiterData}
                                                tableJSON={tableJSON}
                                                actionsToPerform={actionsToDo}
                                                updateStatus={updateApplicationStatus}
                                                type="jobs"
                                                expand={expand}
                                                handlerCompareApplicants={handlerCompareApplicants}
                                                compreApplicantsLength={compareApplicantsLists}
                                            />
                                        ) : (
                                            ServerStatusHandler()
                                        )}
                                    </Fragment>
                                )}
                            </Tab>
                            {(props.user.role_id == 2 || props.user.role_id == 5) && <Tab eventKey="discover" title={t(props.language?.layout?.discover_nt)} >
                                {discoverloading ? (
                                    <Spinner />
                                ) : (
                                    <Fragment>
                                        {discoverData && discoverData.length !== 0 ? (
                                            <DiscoveryTableData
                                                data={discoverData}
                                                tableJSON={discoverytableJSON}
                                                actionsToPerform={discoveractionsToDo}
                                                // assignJobHandler={assignJobHandler}
                                                inviteCandidateHandler={inviteCandidateHandler}
                                                pageNumberHandler={pageNumberHandler}
                                            />
                                        ) : (
                                            DiscoverStatusHandler()
                                        )}
                                    </Fragment>
                                )}
                            </Tab>}
                        </Tabs>
                    </div>

                </div>
            </div>
            <InviteCandidate
                showinviteModal={deleteModal}
                closeinviteModal={closeinviteModal}
                userId={userId}
            />
        </div>

    );

};
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        user: state.authInfo.user,
        userRole: state.authInfo.user,
        compareApplicants: state.authInfo.compareApplicants,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, { _compareApplicants })(recruiterlist);
