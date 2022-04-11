import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../partials/spinner.jsx";
import { Fragment } from "react";
import TableData from "./candidates_applicationsTable/index.jsx";
import { jobsFilterData } from "../components/constants.jsx";
import Modal from "react-bootstrap/Modal";
import Fuse from "fuse.js";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/scss/main.scss";
import ScheduleInterview from "../components/ScheduleInterview.jsx";
import OfferRelease from "../components/offerRelease.jsx";
import { calculateScore } from "../components/constants.jsx";
import { useTranslation } from "react-i18next";
import { jobstage } from "../../translations/helper_translation.jsx";

const Candidates = (props) => {
    const { t } = useTranslation();
    var tableJSON = [];
    tableJSON = props.userRole.role_id == 2 || props.userRole.role_id == 5
        ? ([
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.sp_application_name), key: "username" },
            //   { displayValue: "Job Score", key: "score" },
            { displayValue: t(props.language?.layout?.sp_application_status1), key: "current_status" },
            { displayValue: t(props.language?.layout?.sp_application_jobtitle), key: "job_title" },
            { displayValue: t(props.language?.layout?.sp_application_jobstatus), key: "job_status" },
            { displayValue: t(props.language?.layout?.workauthorization_nt), key: "answer" },
            { displayValue: t(props.language?.layout?.sp_application_appliedon), key: "created_at" },
        ])
        : props.userRole.role_id == null ? ([
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.sp_application_name), key: "username" },
            // { displayValue: "Job Score", key: "score" },
            { displayValue: t(props.language?.layout?.sp_application_status1), key: "current_status" },
            { displayValue: t(props.language?.layout?.contact_skillingpartner), key: "skilling_partner" },
            { displayValue: t(props.language?.layout?.contact_employerpartner), key: "employer_partners" },
            { displayValue: t(props.language?.layout?.portal_nt), key: "user_is_ca" },
            { displayValue: t(props.language?.layout?.sp_application_jobtitle), key: "job_title" },
            { displayValue: t(props.language?.layout?.sp_application_jobstatus), key: "job_status" },
            { displayValue: t(props.language?.layout?.workauthorization_nt), key: "answer" },
            { displayValue: t(props.language?.layout?.sp_application_appliedon), key: "created_at" },
            { displayValue: t(props.language?.layout?.sp_jobs_actions) },
        ]) : process.env.CLIENT_NAME === "cc" ? ([
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.sp_application_name), key: "username" },
            { displayValue: t(props.language?.layout?.all_jobscore_nt), key: "weighted_score" },
            { displayValue: t(props.language?.layout?.sp_application_status1), key: "current_status" },
            { displayValue: t(props.language?.layout?.sp_application_jobtitle), key: "job_title" },
            { displayValue: t(props.language?.layout?.sp_application_jobstatus) },
            { displayValue: t(props.language?.layout?.workauthorization_nt), key: "answer" },
            { displayValue: t(props.language?.layout?.sp_application_appliedon), key: "created_at" },
            { displayValue: t(props.language?.layout?.sp_jobs_actions) },
        ]) :
            process.env.CLIENT_NAME === "microsoft" ? ([
                // { displayValue: "", type: "checkbox" },
                { displayValue: t(props.language?.layout?.sp_application_name), key: "username" },
                { displayValue: t(props.language?.layout?.all_jobscore_nt), key: "weighted_score" },
                { displayValue: t(props.language?.layout?.sp_application_status1), key: "current_status" },
                { displayValue: t(props.language?.layout?.sp_application_jobtitle), key: "job_title" },
                { displayValue: t(props.language?.layout?.sp_application_jobstatus) },
                { displayValue: t(props.language?.layout?.workauthorization_nt), key: "answer" },
                { displayValue: t(props.language?.layout?.sp_application_appliedon), key: "created_at" },
                { displayValue: t(props.language?.layout?.sp_jobs_actions) },
            ]) : ([
                // { displayValue: "", type: "checkbox" },
                { displayValue: t(props.language?.layout?.sp_application_name), key: "username" },
                // { displayValue: "Job Score", key: "score" },
                { displayValue: t(props.language?.layout?.sp_application_status1), key: "current_status" },
                { displayValue: t(props.language?.layout?.sp_application_jobtitle), key: "job_title" },
                { displayValue: t(props.language?.layout?.sp_application_jobstatus), key: "job_status" },
                { displayValue: t(props.language?.layout?.workauthorization_nt), key: "answer" },
                { displayValue: t(props.language?.layout?.sp_application_appliedon), key: "created_at" },
                { displayValue: t(props.language?.layout?.sp_jobs_actions) },
            ])

    const { theme } = props;
    const [status, setStatus] = useState("");
    const [query, setQuery] = useState("");
    const [filterCount, setFilterCount] = useState([]);
    const [totalFilterCount, setTotalFIlterCount] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    let [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [allDataStatus, setAllDataStatus] = useState([]);
    const [openModel, setOpenModel] = useState(false);
    const [openOfferModel, setOpenOfferModel] = useState(false);
    const [userData, setUserData] = useState("");
    const [colors, setColors] = useState([
        theme.all_color,
        theme.screening_color,
        theme.interview_color,
        theme.offer_color,
        theme.active_color,
        theme.closed_color,
        theme.paused_color,
        theme.all_color,
        theme.closed_color
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
    useEffect(() => {
        updateStatus();
        getFilterCount();
        getCandidates();
    }, [status]);

    const jobStageHandler = (language, key) =>{
        return(jobstage[language][key]);
    }

    const updateStatus = (value, id) => {
        if (!value) return;
        let obj = {
            current_status: value,
        };
        axios
            .put(`api/v1/recruiter/application/${id}`, obj, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                getCandidates();
                getFilterCount();
                toast.success(`${t(props.language?.layout?.toast45_nt)} ${jobStageHandler(props?.languageName, obj.current_status)}`, {});
            });
    };

    const getFilterCount = () => {
        let endpoint = props.userRole.user_id == 1 ? `api/v1/admin/application/count` : "api/v1/recruiter/application/status/count"
        axios
            .get(endpoint, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                setTotalFIlterCount(response.data.data);
                setFilterCount(response.data.data.data);
            });
    };

    const getCandidates = (pageNo) => {
        let apiEndPoint;
        if (status !== "") {
            apiEndPoint = props.userRole.role_id == 1 || props.userRole.role_id == 4
                ? (`api/v1/hiring/applicants?status=${status}`)
                : props.userRole.role_id == null ? (`api/v1/admin/allapplication?status=${status}`) : (`api/v1/recruiter/applicants?status=${status}`)
        } else {
            apiEndPoint = props.userRole.role_id == 1 || props.userRole.role_id == 4
                ? (`api/v1/hiring/applicants`)
                : props.userRole.role_id == null ? (`api/v1/admin/allapplication`)
                    : (`api/v1/recruiter/applicants`)
        }
        axios
            .get(apiEndPoint, { headers: { Authorization: `Bearer ${props.userToken}` } })
            .then((response) => {
                let updatedData = [];
                response.data.data.forEach((item) => {
                    let score = calculateScore(item.sov_score);
                    item.score = score;
                    updatedData.push(item);
                });
                if (Array.isArray(updatedData)) {
                    setData(updatedData);
                    setAllDataStatus(updatedData);
                } else {
                    setData([]);
                    setAllDataStatus([]);
                }
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

    const onSearch = (query) => {
        if (query === "") {
            setQuery(query);
            getCandidates();
        } else {
            setQuery(query);
            const fuse = new Fuse(data, {
                keys: ["first_name","username"],
            });
            let results = fuse.search(query);
            let searchResults = results.map((result) => result.item);
            setData(searchResults);
        }
    };
    const actionsToDo = (actionItem, userData) => {
        if (actionItem === "delete") {
            setDeleteModal(true);
        }
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
        if (actionItem === "delete") {
            setDeleteModal(false);
        }
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
    return (
        <div className="col-md-10 px-0">
            <div className="d-flex">
                <div className="container-fluid">
                    <div className="row pt-4 pb-2 px-3 gray-100">
                        <div className="col-md-6 px-md-0">
                            <h4 className="mb-3">{t(props.language?.layout?.sp_application_allapplications)}</h4>
                            <div className="d-flex align-items-center">
                                <img
                                    className="svg-lg-x2 mr-3 mb-2"
                                    src="svgs/rich_icons/applications.svg"
                                    alt="Application Icon"
                                    title="Application Icon"
                                />
                                <div>
                                    <p className="d-flex text-capitalize mb-1">
                                        <span>
                                            {totalFilterCount.applicants}{" "}
                                            {totalFilterCount.applicants <= 1 ?  t(props.language?.layout?.all_applicant) :  t(props.language?.layout?.sp_application_applicants)}
                                        </span>
                                    </p>
                                    <p>
                                        {totalFilterCount.yesterday_applicants !== 0 ? (
                                            <i>
                                                <span className="text-dark text-capitalize">
                                                    {totalFilterCount.yesterday_applicants}
                                                    {totalFilterCount.yesterday_applicants <= 1
                                                        ? t(props.language?.layout?.ep_application_nt)
                                                        : t(props.language?.layout?.ep_jobs_applications)}
                                                </span>{" "}
                                                {t(props.language?.layout?.ep_application_receivedyesterday)}
                                            </i>
                                        ) : null}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 px-md-0 d-md-flex d-lg-flex justify-content-end">
                            <div>
                                <div className="d-md-flex align-items-end my-md-0 my-3">
                                    <div class="form-group-md animated mr-3">
                                        <input
                                            role="search"
                                            type="text"
                                            class="form-control border-right-0 border-left-0 border-top-0 bg-light rounded-0 border-dark pl-4 pb-1"
                                            id="Search"
                                            name="Search"
                                            placeholder={t(props.language?.layout?.sp_application_search)}
                                            value={query}
                                            onChange={(e) => onSearch(e.target.value)}
                                        />
                                        <div class="icon-invert d-flex justify-content-start">
                                            <img
                                                src="/svgs/icons_new/search.svg"
                                                alt="search"
                                                class="svg-xs mt-n4 mr-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="d-flex justify-content-between my-3 pl-4">
                        <div className="d-md-flex align-items-center">
                            <h6 className="text-muted mb-0">Filters</h6>
                            <div className="form-group ml-md-4 mb-0">
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
                            <div className="form-group mx-md-4 mb-0">
                                <select
                                    className="form-control p-0 rounded-0 pointer border-top-0 border-right-0 border-left-0 border-dark"
                                    style={{ fontSize: "12px" }}>
                                    <option value="" disabled selected className="d-none">
                                        Job Posted
                                    </option>
                                    <option value="1">1 Day</option>
                                    <option value="2">3 Days</option>
                                    <option value="1">7 Days</option>
                                    <option value="1">30 Days</option>
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
                    <div className="d-md-flex mt-4 mb-1">
                        <div className="text-muted h6 mr-4 ml-2">{t(props.language?.layout?.sp_application_status)}</div>
                        <div className="p-0 pl-2">
                            <ul className="nav nav-pills nav-fill">
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
                                {/* <li className="mr-1 mb-1">
                                    <a
                                        className="nav-link rounded-pill py-0 pointer btn-sm btn"
                                        tabIndex="0"
                                        style={colors[key]}
                                        onClick={() => checkFilter(item.status)}>
                                        {applicationStatus.value} ({item.count})
                                    </a>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                    <Modal show={deleteModal} onHide={closeModal} closeModal={closeModal}>
                        <div className="modal-content p-3 border-0">
                            <div className="modal-header border-0 p-0">
                                <button
                                    type="button"
                                    className="close"
                                    aria-label="Close"
                                    title="Close"
                                    onClick={() => closeModal("delete")}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                <p>{t(props.language?.layout?.all_suredelete_nt)} </p>
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <button
                                            className="btn btn-outline-secondary btn-block"
                                            onClick={() => closeModal("delete")}>
                                            {t(props.language?.layout?.no_nt)}
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <button className="btn btn-primary btn-block">{t(props.language?.layout?.all_yes_nt)}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <ScheduleInterview
                        actionsToDo={actionsToDo}
                        closeModal={closeModal}
                        openModel={openModel}
                        updateStatus={updateStatus}
                        userData={userData}
                    />
                    <OfferRelease
                        actionsToDo={actionsToDo}
                        closeModal={closeModal}
                        openModel={openOfferModel}
                        updateStatus={updateStatus}
                        userData={userData}
                    />
                    <div className="row">
                        <div className="col-md-12 px-3">
                            <div className="card border-0">
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <Fragment>
                                        {data && data.length !== 0 ? (
                                            <TableData
                                                data={data}
                                                tableJSON={tableJSON}
                                                actionsToPerform={actionsToDo}
                                                updateStatus={updateStatus}
                                                type="applications"
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
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userToken: state.authInfo.userToken,
        userRole: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(Candidates);
