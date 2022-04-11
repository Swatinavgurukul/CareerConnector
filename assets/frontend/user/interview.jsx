import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../partials/spinner.jsx";
import { Fragment } from "react";
import TableData from "./interviewTable/index.jsx";
import Modal from "react-bootstrap/Modal";
import Fuse from "fuse.js";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/scss/main.scss";
import { calculateScore } from "../components/constants.jsx";
import ScheduleInterview from "../components/ScheduleInterview.jsx";
import { useTranslation } from "react-i18next";
import { jobstage } from "../../translations/helper_translation.jsx";



const Interview = (props) => {
    const { t } = useTranslation();
    var tableJSON = [];
    tableJSON = props.userRole.role_id == null
        ? ([
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "first_name" },
            // { displayValue: "Job Score", key: "" },
            { displayValue: t(props.language?.layout?.ep_jobs_status) , key: "status" },
            { displayValue: t(props.language?.layout?.contact_skillingpartner), key: "skilling_partner" },
            { displayValue: t(props.language?.layout?.employer_nt), key: "employer_partners" },
            { displayValue: t(props.language?.layout?.portal_nt), key: "user_is_ca" },
            { displayValue: t(props.language?.layout?.ep_dashboard_jobtitle), key: "job_title" },
            { displayValue: t(props.language?.layout?.ep_application_jobstatus), key: "job_status" },
            { displayValue: t(props.language?.layout?.ep_application_appliedon), key: "user_last_updated" },
            // { displayValue: "Date", key: "interview_date" },
            // { displayValue: "Duration (min)", key: "interview_duration" },
            { displayValue: t(props.language?.layout?.ep_jobs_actions) },
        ]) : (props.userRole.role_id == 1 || props.userRole.role_id == 4) && process.env.CLIENT_NAME === "cc" ? [
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "first_name" },
            { displayValue: t(props.language?.layout?.all_jobscore_nt), key: "weighted_score" },
            { displayValue: t(props.language?.layout?.ep_jobs_status), key: "status" },
            { displayValue: t(props.language?.layout?.ep_createjob_title), key: "job_title" },
            { displayValue: t(props.language?.layout?.ep_application_jobstatus), key: "job_status" },
            { displayValue: t(props.language?.layout?.ep_application_appliedon), key: "user_last_updated" },
            { displayValue: t(props.language?.layout?.all_date), key: "interview_date" },
            { displayValue: t(props.language?.layout?.all_duration_nt), key: "interview_duration" },
            { displayValue: t(props.language?.layout?.ep_jobs_actions) },
        ] : (props.userRole.role_id == 1 || props.userRole.role_id == 4) && process.env.CLIENT_NAME === "microsoft" ? [
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "first_name" },
            { displayValue: t(props.language?.layout?.all_jobscore_nt), key: "weighted_score" },
            { displayValue: t(props.language?.layout?.ep_jobs_status), key: "status" },
            { displayValue: t(props.language?.layout?.ep_createjob_title), key: "job_title" },
            { displayValue: t(props.language?.layout?.ep_application_jobstatus), key: "job_status" },
            { displayValue: t(props.language?.layout?.ep_application_appliedon), key: "user_last_updated" },
            { displayValue: t(props.language?.layout?.all_date), key: "interview_date" },
            { displayValue: t(props.language?.layout?.all_duration_nt), key: "interview_duration" },
            { displayValue: t(props.language?.layout?.ep_jobs_actions) },
        ] :

            [
                // { displayValue: "", type: "checkbox" },
                { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "first_name" },
                // { displayValue: "Job Score", key: "" },
                { displayValue: t(props.language?.layout?.ep_jobs_status), key: "status" },
                { displayValue: t(props.language?.layout?.ep_createjob_title), key: "job_title" },
                { displayValue:  t(props.language?.layout?.ep_application_jobstatus), key: "job_status" },
                { displayValue: t(props.language?.layout?.ep_application_appliedon), key: "user_last_updated" },
                { displayValue: t(props.language?.layout?.interviewdate_nt), key: "interview_date" },
                { displayValue: t(props.language?.layout?.all_duration_nt), key: "interview_duration" },
                // { displayValue: "Actions" },
            ]
    {/* {no_translated} */ }
    const { theme } = props;
    const [status, setStatus] = useState("");
    const [query, setQuery] = useState("");
    const [filterCount, setFilterCount] = useState([]);
    const [totalFilterCount, setTotalFIlterCount] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    let [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [openModel, setOpenModel] = useState(false);
    const [userData, setUserData] = useState("");
    const [allDataStatus, setAllDataStatus] = useState([]);

    useEffect(() => {
        getFilterCount();
        getCandidates();
        updateStatus();
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
        let endpoint = props.userRole.user_id == 1 ? `api/v1/admin/applicants/interview/count` : `/api/v1/recruiter/applicants/interview/count`
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
            apiEndPoint = `/api/v1/recruiter/applicants?status=${status}`;
        } else {
            apiEndPoint = props.userRole.role_id == null ? `api/v1/admin/allapplication?status=interview` : `/api/v1/recruiter/applicants/interview`;
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
        if (actionItem === "close") {
            setShow(false);
        }
    };
    return (
        <div className="col-md-10 px-0">
            <div className="d-flex">
                <div className="container-fluid">
                    <div className="row pt-4 pb-2 px-3 gray-100">
                        <div className="col-md-6 px-md-0">
                            <h4 className="mb-3">{t(props.language?.layout?.ep_allinterviews)}</h4>
                            <div className="d-flex align-items-center">
                                <img
                                    className="svg-lg-x2 mr-3 mb-2"
                                    src="svgs/rich_icons/interview.svg"
                                    alt="Interview Icon"
                                    title="Interview Icon"
                                />
                                <div>
                                    {totalFilterCount.interview_count != 0 ? (
                                        <p className="d-flex text-capitalize mb-1">
                                            <span>
                                                {totalFilterCount.interview_count}
                                                {totalFilterCount.interview_count <= 1 ? t(props.language?.layout?.ep_jobtitle_interview) : t(props.language?.layout?.ep_dashboard_interviews)}
                                            </span>
                                            { }
                                            &nbsp;{t(props.language?.layout?.all_scheduled_nt)}
                                        </p>
                                    ) : null}
                                    <p>
                                        {totalFilterCount.lastweek_interview_count !== 0 ? (
                                            <i>
                                                <span className="text-dark text-capitalize">
                                                    {totalFilterCount.lastweek_interview_count}
                                                    {totalFilterCount.lastweek_interview_count <= 1
                                                        ? t(props.language?.layout?.ep_jobtitle_interview)
                                                        : t(props.language?.layout?.ep_dashboard_interviews)}
                                                </span>{" "}
                                                {t(props.language?.layout?.interview_planned_nt)}
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
                                            placeholder={t(props.language?.layout?.js_jobs_search)}
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
                    <Modal show={deleteModal} onHide={closeModal}>
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
                                        <button className="btn btn-outline-primary btn-block">{t(props.language?.layout?.all_yes_nt)}</button>
                                    </div>
                                    <div className="col-md-6">
                                        <button
                                            className="btn btn-primary btn-block"
                                            onClick={() => closeModal("delete")}>
                                            {t(props.language?.layout?.no_nt)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <ScheduleInterview
                        actionsToDo={actionsToDo}
                        closeModal={closeModal}
                        openModel={openModel}
                        show={show}
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
                                                type="interview"
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

export default connect(mapStateToProps, {})(Interview);
