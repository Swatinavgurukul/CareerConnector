import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../partials/spinner.jsx";
import { Fragment } from "react";
import TableData from "./offersTable/index.jsx";
import Modal from "react-bootstrap/Modal";
import Fuse from "fuse.js";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/scss/main.scss";
import { calculateScore } from "../components/constants.jsx";
import OfferRelease from "../components/offerRelease.jsx";
import { useTranslation } from "react-i18next";
import { jobstage } from "../../translations/helper_translation.jsx";


const Offers = (props) => {
    const { t } = useTranslation();
    var tableJSON = [];
    tableJSON = props.userRole.role_id == null
        ? ([
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "first_name" },
            // { displayValue: "Job Score", key: "" },
            { displayValue: t(props.language?.layout?.ep_jobs_status), key: "status" },
            { displayValue: t(props.language?.layout?.contact_skillingpartner), key: "skilling_partner" },
            { displayValue: t(props.language?.layout?.employer_nt), key: "employer_partners" },
            { displayValue: t(props.language?.layout?.portal_nt), key: "user_is_ca" },
            { displayValue: t(props.language?.layout?.ep_createjob_title), key: "job_title" },
            { displayValue: t(props.language?.layout?.ep_application_jobstatus), key: "job_status" },
            { displayValue: t(props.language?.layout?.ep_application_appliedon), key: "user_last_updated" },
            // { displayValue: "Offered Date", key: "offered_date" },
            { displayValue: t(props.language?.layout?.ep_jobs_actions) },
        ]) : (props.userRole.role_id == 1 || props.userRole.role_id == 4) && process.env.CLIENT_NAME === "cc" ? [
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "first_name" },
            { displayValue: t(props.language?.layout?.all_jobscore_nt), key: "weighted_score" },
            { displayValue: t(props.language?.layout?.ep_jobs_status), key: "status" },
            { displayValue: t(props.language?.layout?.ep_createjob_title), key: "job_title" },
            { displayValue: t(props.language?.layout?.ep_application_jobstatus), key: "job_status" },
            { displayValue: t(props.language?.layout?.ep_application_appliedon), key: "user_last_updated" },
            { displayValue: t(props.language?.layout?.ep_jobs_offereddate), key: "offered_date" },
            { displayValue: t(props.language?.layout?.ep_jobs_actions) },
        ] : (props.userRole.role_id == 1 || props.userRole.role_id == 4) && process.env.CLIENT_NAME === "microsoft" ? [
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "first_name" },
            { displayValue: t(props.language?.layout?.all_jobscore_nt), key: "weighted_score" },
            { displayValue: t(props.language?.layout?.ep_jobs_status), key: "status" },
            { displayValue: t(props.language?.layout?.ep_createjob_title), key: "job_title" },
            { displayValue: t(props.language?.layout?.ep_application_jobstatus), key: "job_status" },
            { displayValue: t(props.language?.layout?.ep_application_appliedon), key: "user_last_updated" },
            { displayValue: t(props.language?.layout?.ep_jobs_offereddate), key: "offered_date" },
            { displayValue: t(props.language?.layout?.ep_jobs_actions) },
        ] :
            [
                // { displayValue: "", type: "checkbox" },
                { displayValue:t(props.language?.layout?.ep_dashboard_name), key: "first_name" },
                // { displayValue: "Job Score", key: "" },
                { displayValue: t(props.language?.layout?.ep_jobs_status), key: "status" },
                { displayValue: t(props.language?.layout?.ep_createjob_title), key: "job_title" },
                { displayValue: t(props.language?.layout?.ep_application_jobstatus), key: "job_status" },
                { displayValue: t(props.language?.layout?.ep_application_appliedon), key: "user_last_updated" },
                { displayValue: t(props.language?.layout?.ep_jobs_actions) },
            ]

    const { theme } = props;
    const [status, setStatus] = useState("");
    const [query, setQuery] = useState("");
    const [filterCount, setFilterCount] = useState([]);
    const [totalFilterCount, setTotalFIlterCount] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    let [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [openOfferModel, setOpenOfferModel] = useState(false);
    const [show, setShow] = useState(false);
    const [userData, setUserData] = useState("");
    const [allDataStatus, setAllDataStatus] = useState([]);
    const [searchData, setSearchData] = useState([]);

    useEffect(() => {
        getFilterCount();
        getCandidates();
        updateStatus();
    }, [status]);

    const getFilterCount = () => {
        let endpoint = props.userRole.user_id == 1 ? `api/v1/admin/applicants/offered/count` : `api/v1/recruiter/applicants/offered/count`

        axios
            .get(endpoint, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                setTotalFIlterCount(response.data.data);
                setFilterCount(response.data.data.data);
            });
    };

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

    const getCandidates = (pageNo) => {
        let apiEndPoint;
        if (status !== "") {
            apiEndPoint = `/api/v1/recruiter/applicants?status=${status}`;
        } else {
            apiEndPoint = props.userRole.role_id == null ? `api/v1/admin/allapplication?status=offered` : `/api/v1/recruiter/applicants/offered`;
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
                    setSearchData(updatedData);
                    setAllDataStatus(updatedData);
                } else {
                    setData([]);
                    setSearchData([]);
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
            // <div className="text-muted text-center p-5">
            //     <img
            //         src="/svgs/illustrations/EmptyStateListIllustration.svg"
            //         alt="Hero Image"
            //         className="svg-gray"
            //         style={{ height: "12rem" }}
            //     />
            //     <h3 className="pt-2">The List is Empty</h3>
            // </div>
            <div className="col-md-3 mx-auto">
                <div className="text-muted text-center mt-5 pt-5">
                    <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid" />
                    <h3 className="pt-2">{t(props.language?.layout?.all_empty_nt)}</h3>
                </div>
            </div>
        );
    };
    // const onSearch = (query) => {
    //     if (query === "") {
    //         setQuery(query);
    //         getCandidates();
    //     } else {
    //         setQuery(query);
    //         const fuse = new Fuse(data, {
    //             keys: ["first_name", "username", "last_name"],
    //         });
    //         let results = fuse.search(query);
    //         let searchResults = results.map((result) => result.item);
    //         setData(searchResults);
    //     }
    // };
    const SearchInString = (str, query) => {
        return (String(str).trim().toLowerCase()).indexOf(String(query).toLowerCase().trim()) > -1;
    }

    const onSearch = (query) => {
        setQuery(query);
        if (query === "") {
            setData(searchData);
        }
        else {
            const searchResults = [];
            searchData.forEach(item => {
                if (SearchInString(item.username, query) || SearchInString(item.first_name, query) ||
                    SearchInString(item.last_name, query)) {
                    searchResults.push(item)
                }
            })
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
    return (
        <div className="col-md-10 px-0">
            <div className="d-flex">
                <div className="container-fluid">
                    <div className="row pt-4 pb-2 px-3 gray-100">
                        <div className="col-md-6 p-0">
                            <h4 className="mb-3">{t(props.language?.layout?.ep_alloffers)}</h4>
                            <div className="d-flex align-items-center">
                                <img
                                    className="svg-lg-x2 mr-3 mb-2"
                                    src="svgs/rich_icons/offers.svg"
                                    alt="Offers Icon"
                                    title="Offers Icon"
                                />
                                <div>
                                    {totalFilterCount.offered_count != 0 ? (
                                        <p className="d-flex text-capitalize mb-1">
                                            <span>
                                                {totalFilterCount.offered_count}
                                                {totalFilterCount.offered_count <= 1 ? t(props.language?.layout?.all_offer) : t(props.language?.layout?.ep_offersheading)}
                                            </span>
                                            &nbsp;
                                            {/* Issued in last one month */}
                                        </p>
                                    ) : null}
                                    <p>
                                        {totalFilterCount.offered_count != 0 ? (
                                            <i>
                                                <span className="text-dark text-capitalize">
                                                    {totalFilterCount.lastweek_offered_count}
                                                    {totalFilterCount.lastweek_offered_count <= 1
                                                        ? t(props.language?.layout?.all_offer)
                                                        : t(props.language?.layout?.ep_offersheading)}
                                                </span>{" "}
                                                {/* 15 accepted, 3 Awaiting Acceptance, 2 Declined */}
                                            </i>
                                        ) : null}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 px-md-0 d-md-flex d-lg-flex justify-content-end">
                            <div>
                                <div className="d-md-flex align-items-end my-md-0 my-3">
                                    <div class="form-group-md animated mr-md-3">
                                        <input
                                            role="search"
                                            type="text"
                                            class="form-control border-right-0 border-left-0 border-top-0 bg-light rounded-0 border-dark pl-4 pb-1"
                                            id="Search"
                                            name="Search"
                                            placeholder={t(props.language?.layout?.homepage_search)}
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
                                    className="close animate-closeicon"
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
                    <OfferRelease
                        actionsToDo={actionsToDo}
                        closeModal={closeModal}
                        openModel={openOfferModel}
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
                                                type="offers"
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
        userToken: state.authInfo.userToken,
        theme: state.themeInfo.theme,
        userRole: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,

    };
}

export default connect(mapStateToProps, {})(Offers);
