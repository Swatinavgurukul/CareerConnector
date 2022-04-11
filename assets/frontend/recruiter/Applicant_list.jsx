import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import { format, formatDistance, subDays } from "date-fns";
import TableData from "./AddJob/applicantListTable/index.jsx";
import Spinner from "../partials/spinner.jsx";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import { capitalizeFirstLetter } from "../modules/helpers.jsx";
import { toast } from "react-toastify";
import "react-toastify/scss/main.scss";
import Tooltip from "react-bootstrap/Tooltip";
import Fuse from "fuse.js";
import ScheduleInterview from "../components/ScheduleInterview.jsx";
import OfferRelease from "../components/offerRelease.jsx";
import { calculateScore } from "../components/constants.jsx";
import { useTranslation } from "react-i18next";
import { job_status1, jobstage } from "../../translations/helper_translation.jsx";

const ApplicantList = (props) => {
    const { t } = useTranslation();
    var tableJSON = [];
    props.userRole.role_id == 2
        ? (tableJSON = [
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_name), key: "username" },
            { displayValue: t(props.language?.layout?.ep_application_designation), key: "designation" },
            //   { displayValue: "Job Score", key: "sov_score" },
            { displayValue: t(props.language?.layout?.js_application_status), key: "status" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_source), key: "" },
            { displayValue: t(props.language?.layout?.lastdate_nt), key: "updated_at" },
        ])
        : (tableJSON = [
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_name), key: "username" },
            { displayValue: t(props.language?.layout?.ep_application_designation), key: "designation" },
            //   { displayValue: "Job Score", key: "sov_score" },
            { displayValue: t(props.language?.layout?.js_application_status), key: "status" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_source), key: "" },
            { displayValue: t(props.language?.layout?.lastdate_nt), key: "updated_at" },
            { displayValue: t(props.language?.layout?.ep_jobtitle_actions), key: "" },
        ]);
    {/* {no_translated} */ }
    const { theme } = props;
    const [recruiterData, setRecruiterData] = useState([]);
    const [filterCount, setFilterCount] = useState([]);
    const [allData, setAllData] = useState([]);
    const [status, setStatus] = useState("");
    let [loading, setLoading] = useState(true);
    const [openModel, setOpenModel] = useState(false);
    const [query, setQuery] = useState("");
    const [userData, setUserData] = useState("");
    const [openOfferModel, setOpenOfferModel] = useState(false);
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
        recruiterHandler(props.location.state.slug);
        recruiterFilterHandler(props.location.state.slug);
    }, [status]);
    
    const jobStageHandler = (language, key) =>{
        return(jobstage[language][key]);
    }

    const statusHandler = (language, key) => {
        return(job_status1[language][key]);
    }

    const updateApplicationStatus = (value, id) => {
        if (!value) return;
        let obj = {
            current_status: value,
        };
        Axios.put(`api/v1/recruiter/application/${id}`, obj, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }).then((response) => {
            recruiterHandler(props.location.state.slug);
            recruiterFilterHandler(props.location.state.slug);
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
            recruiterHandler(props.location.state.slug);
            recruiterFilterHandler(props.location.state.slug);
            toast.success(`${t(props.language?.layout?.toast49_nt)} ${statusHandler(props?.languageName, obj.status)}`, {});
        });
    };
    const recruiterFilterHandler = (slugname) => {
        Axios.get(`api/v1/recruiter/${slugname}/application/status/count`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((resp) => {
                setAllData(resp.data.data);
                setFilterCount(resp.data.data.data);
            })
            .catch((error) => { });
    };
    const recruiterHandler = (slugname) => {
        let apiEndPoint;
        if (status !== "") {
            props.userRole.role_id == 1
                ? (apiEndPoint = `api/v1/hiring/${slugname}/applicants?status=${status}`)
                : (apiEndPoint = `api/v1/recruiter/${slugname}/applicants?status=${status}`);
        } else {
            props.userRole.role_id == 1
                ? (apiEndPoint = `api/v1/hiring/${slugname}/applicants`)
                : (apiEndPoint = `api/v1/recruiter/${slugname}/applicants`);
        }
        Axios.get(apiEndPoint, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((resp) => {
                let updatedData = [];
                resp.data.data.forEach((item) => {
                    let score = calculateScore(item.sov_score);
                    item.score = score;
                    updatedData.push(item);
                });
                setRecruiterData(updatedData);
                setCreatedUser(updatedData.created_by);

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
    const onSearch = (query) => {
        if (query === "") {
            setQuery(query);
            recruiterHandler();
        } else {
            setQuery(query);
            const fuse = new Fuse(data, {
                keys: ["username"],
            });
            let results = fuse.search(query);
            let searchResults = results.map((result) => result.item);
            setData(searchResults);
        }
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

    return (
        <div className="col-md-10 px-0">
            <div className="d-flex">
                <div className="container-fluid">
                    <div className="row d-flex justify-content-between pt-4 px-3 gray-100">
                        <div className="col-md-8 px-md-0">
                            <div className="d-flex align-items-center mb-3 icon-invert">
                                <h4 className="mb-0">
                                    <Link to={`/jobs/`} className="text-muted">
                                        {t(props.language?.layout?.ep_jobs_alljobs)}
                                    </Link>
                                    <img
                                        className="svg-sm mx-1 disabled"
                                        src="svgs/icons_new/chevron-right.svg"
                                        title="Arrow"
                                        alt="Arrow Icon"
                                    />
                                    <span className="text-muted">{allData.title}</span>
                                    <img
                                        className="svg-sm mx-1"
                                        src="svgs/icons_new/chevron-right.svg"
                                        title="Arrow"
                                        alt="Arrow Icon"
                                    />{" "}
                                    {t(props.language?.layout?.ep_jobs_view)}
                                </h4>
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
                                        <p className="d-flex mb-2">
                                            {allData.job_city == null ? "" : <p>{allData.job_city} | </p>}
                                        </p>
                                        <p className=" d-flex text-capitalize mb-1">
                                            {allData.salary_max == null ? "" : <p>{allData.salary_max}</p>}&nbsp;
                                            {capitalizeFirstLetter(allData.salary_frequency)}
                                        </p>{" "}
                                        <p className="d-flex text-capitalize mb-1">
                                            {allData.job_type == null ? (
                                                ""
                                            ) : (
                                                <p> | {capitalizeFirstLetter(allData.job_type)}</p>
                                            )}
                                        </p>
                                    </div>
                                    <p className="mb-0">
                                        {allData.applicants !== 0 ? (
                                            <span className="text-dark">
                                                {allData.applicants}
                                                {recruiterData.application_count >= 1 ? t(props.language?.layout?.sp_application_applicants) : t(props.language?.layout?.all_applicant)}
                                            </span>
                                        ) : null}
                                        <span className="text-dark">&nbsp;&nbsp;|&nbsp;</span> {t(props.language?.layout?.all_createdby_nt)}&nbsp;
                                        <span>
                                            {allData.created_at
                                                ? formatDistance(
                                                    subDays(new Date(allData.created_at), 0),
                                                    new Date()
                                                ).replace("about", "")
                                                : ""}
                                        </span>
                                        &nbsp; {t(props.language?.layout?.all_ago_nt)}&nbsp;
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/*
                        <div className="col-md-4 px-md-0">
                            <div className="d-flex align-items-end justify-content-end">
                                {props.userRole.role_id === 1 ? null : (
                                 <button type="button" class="btn btn-primary border-0" style={theme.brand_color}>
                                        + Add Candidates
                                    </button>
                                )}
                            </div>
                        </div>
 */}

                    </div>
                    <div className="">
                        <div className="d-flex justify-content-between">
                            <h4 className="mb-2 mt-4 px-2">{t(props.language?.layout?.all_applicantlist)}</h4>
                            <div class="form-group-md animated mb-2 mt-4 px-2">
                                <input
                                    type="text"
                                    class="form-control border-right-0 border-left-0 border-top-0 rounded-0 border-dark pl-4 pb-1"
                                    id="Search"
                                    name="Search"
                                    placeholder={t(props.language?.layout?.homepage_search)}
                                    value={query}
                                    onChange={(e) => onSearch(e.target.value)}
                                />
                                <div class="icon-invert d-flex justify-content-start">
                                    <img src="/svgs/icons_new/search.svg" alt="search" class="svg-xs mt-n4 mr-3" />
                                </div>
                            </div>
                        </div>
                        {/* <div className="d-flex justify-content-between mb-3 pl-4">
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
                        </div>  */}
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
                        <div className="d-flex align-items-center pl-4 mt-2 mb-4">
                            <div className="text-muted mb-0 h6">{t(props.language?.layout?.ep_jobs_status)}</div>
                            <ul className="nav nav-pills nav-fill row pl-4">
                                {filterCount.map((item, key) => (
                                    <li className="nav-item ml-md-2 ">
                                        <a
                                            className="nav-link rounded-pill py-0 pointer btn-sm btn "
                                            tabIndex="0"
                                            style={colors[key]}
                                            onClick={() => checkFilter(item.status)}>
                                            {item.display_name} ({item.count})
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {loading ? (
                            <Spinner />
                        ) : (
                            <Fragment>
                                {recruiterData && recruiterData.length !== 0 ? (
                                    <TableData
                                        data={recruiterData}
                                        tableJSON={tableJSON}
                                        updateStatus={updateApplicationStatus}
                                        actionsToPerform={actionsToDo}
                                        type="jobs"
                                    />
                                ) : (
                                    ServerStatusHandler()
                                )}
                            </Fragment>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userRole: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(ApplicantList);
