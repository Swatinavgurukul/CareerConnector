import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../partials/spinner.jsx";
import { Fragment } from "react";
import TableData from "./table/index.jsx";
import Fuse from "fuse.js";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";

const locationsJSON = {
    country: false,
    state: false,
    city: true,
};

const Approvals = (props) => {
    const { t } = useTranslation();
    var tableJSON = [];

    tableJSON = [
        { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "full_name" },
        { displayValue: t(props.language?.layout?.ep_setting_bd_email), key: "email" },
        { displayValue: t(props.language?.layout?.all_organisation_nt), key: "skilling_partners" },
        { displayValue: t(props.language?.layout?.ep_jobs_type), key: "user_type" },
        { displayValue: t(props.language?.layout?.portal_nt), key: "is_ca" },
        { displayValue: "Status", key: "company" },
        { displayValue: t(props.language?.layout?.approved_nt), key: "is_approved" },
        { displayValue: "Erd", key: "is_erd" },
        { displayValue: "D.O.R", key:"created_at",title:true},
        { displayValue: t(props.language?.layout?.ep_jobs_actions) },
    ];

    const { theme } = props;
    const [status, setStatus] = useState("");
    const [query, setQuery] = useState("");
    const [filterCount, setFilterCount] = useState([]);
    let [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [candidateId, setCandidateId] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [archive, setArchive] = useState([]);
    useEffect(() => {
        getData();
        getFilterCount();
    }, [status]);

    const getFilterCount = () => {
        axios
            .get("api/v1/admin/homepage/approval/user/count", {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                setFilterCount(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    const onChangeStatus = (data, id) => {
        let obj = {};
        obj.current_status = data;
        // console.log(obj);
        axios
            .put(`api/v1/admin/homepage/approval/${id}`, JSON.stringify(obj), {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((response) => {
                toast.success(`${t(props.language?.layout?.user_nt)} ${response.data.data.current_status} ${t(props.language?.layout?.sucessfully_nt)}.`)
                getData();
                getFilterCount();
            })
            .catch((error) => { });
    };
    const onerdStatus = (data, id) => {
        let obj = {};
        obj.erd_status = data;
        // console.log(obj);
        axios
            .put(`api/v1/admin/homepage/erdstatus/${id}`, JSON.stringify(obj), {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((response) => {
                toast.success("Erd updated.")
                getData();
                getFilterCount();
            })
            .catch((error) => { });
    };

    const getData = (pageNo) => {
        let apiEndPoint;
        apiEndPoint = `api/v1/admin/homepage`;
        axios
            .get(apiEndPoint, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                if (Array.isArray(response.data.data)) {
                    var archiveList = response.data.data.filter((item) => {
                        return item.archive == false
                    });
                    setData(archiveList);
                }
                else {
                    setData([]);
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
    const showAllUsers = () => {
        let endPoint;
        endPoint = "/api/v1/admin/homepage";
        axios
            .get(endPoint, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                setData(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onSearch = (query) => {
        if (query === "") {
            setQuery(query);
            getData();
        } else {
            setQuery(query);
            const fuse = new Fuse(data, {
                keys: ["username", "company"],
            });
            let results = fuse.search(query);
            let searchResults = results.map((result) => result.item);
            setData(searchResults);
        }
    };
    const unArchiveUser = () => {
        let data = {
            candidate_ids: [candidateId]
        }
        axios
            .delete(`/api/v1/admin/approvals/archive`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` }, data
            })
            .then((response) => {
                if (response.status === 200) {
                    getData();
                    getFilterCount();
                    toast.success("Admin approvals unarchived Successfully.");
                }
            })
            .catch((err) => {
                if (err) {
                    toast.error(t(props.language?.layout?.toast58_nt));
                }
            });
    };
    const deleteArchire = () => {
        const data = {
            candidate_ids: [candidateId]
        }
        axios
            .post(`/api/v1/admin/approvals/archive`, data, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` }
            })
            .then((response) => {
                if (response.status === 200) {
                    getData();
                    getFilterCount();
                    toast.success("Admin approvals deleted Successfully.");
                }
            })
            .catch((err) => {
                if (err) {
                    toast.error(t(props.language?.layout?.toast58_nt));
                }
            });
    };

    const actionsToDo = (actionItem, id, archive) => {
        if (actionItem === "moreOptions") {
            setDeleteConfirmation(true);
            setCandidateId(id);
            setArchive(archive);
        }
    };

    const ServerStatusHandler = () => {
        return (
            <div className="col-md-3 mx-auto">
                <div className="text-muted text-center mt-5 pt-5">
                    <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid"/>
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
                            <h4 className="mb-3">{t(props.language?.layout?.approvals_nt)}</h4>
                            <div className="d-flex align-items-center">
                                <img
                                    className="svg-lg mr-3 mb-2"
                                    src="svgs/rich_icons/candidates.svg"
                                    alt="Candidates Icon"
                                />
                                <div>
                                    <p className="d-flex text-capitalize mb-1">
                                        {filterCount.admin_users_count != 0 ? (
                                            <span>
                                                {filterCount.admin_users_count} {t(props.language?.layout?.users_nt)} | {filterCount.ep_count} {t(props.language?.layout?.emppartner_nt)} | {filterCount.npp_count} {t(props.language?.layout?.contact_skillingpartner)}
                                            </span>
                                        ) : null}
                                        &nbsp;
                                    </p>
                                    <p className="d-flex text-capitalize mb-1">
                                        {filterCount.admin_users_count != 0 ? (
                                            <span>
                                                {filterCount.approved_count} {t(props.language?.layout?.approved_nt)} | {filterCount.pending_count}{" "}
                                                {t(props.language?.layout?.pending_nt)} | {filterCount.rejected_count} {t(props.language?.layout?.js_application_rejected)}
                                                | {filterCount.archive_count} Archived
                                            </span>
                                        ) : null}
                                        &nbsp;
                                    </p>

                                    {/* <p className="mb-3">
                                        {filterCount.new_candidates != 0 ? (
                                            <i>
                                                <span className="text-dark">
                                                    {filterCount.new_candidates}
                                                    {filterCount.new_candidates <= 1
                                                        ? " Job Seeker"
                                                        : " Job Seekers"}{" "}
                                                    added yesterday
                                                </span>
                                            </i>
                                        ) : null}
                                    </p> */}
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 d-md-flex d-lg-flex justify-content-end px-md-0">
                            <div>
                                <div className="d-md-flex align-items-end my-md-0 my-3">
                                    <div class="form-group-md animated">
                                        <input
                                            type="text"
                                            class="form-control border-right-0 border-left-0 border-top-0 bg-light rounded-0 border-dark pl-4 pb-1"
                                            id="Search"
                                            name="Search"
                                            placeholder= {t(props.language?.layout?.homepage_search)}
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

            <Modal show={deleteConfirmation} onHide={() => setDeleteConfirmation(false)} size={"md"}>
                        <div className="modal-content">
                            <div className="modal-header border-0 px-4">
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label= {t(props.language?.layout?.all_close_nt)}
                                    title= {t(props.language?.layout?.all_close_nt)}
                                    onClick={() => setDeleteConfirmation(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center px-4">
                                <h5>{t(props.language?.layout?.all_sure_nt)} {archive ? t(props.language?.layout?.all_unarchive_nt) : t(props.language?.layout?.all_archive_nt)}?</h5>
                                <div className="text-center my-4">
                                    <button className="btn btn-outline-primary mr-3" onClick={() => setDeleteConfirmation(false)}>{t(props.language?.layout?.no_nt)}</button>
                                    {archive ?
                                        <button className="btn btn-primary" onClick={() => { unArchiveUser(); setDeleteConfirmation(false) }}>&nbsp;{t(props.language?.layout?.all_yes_nt)}&nbsp;</button>
                                        :
                                        <button className="btn btn-primary" onClick={() => {deleteArchire(); setDeleteConfirmation(false) }}>&nbsp;{t(props.language?.layout?.all_yes_nt)}&nbsp;</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </Modal>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-12 px-3">
                            <div className="card border-0">
                           <small className="ml-auto position-relative" style={{ top: "18px" }}>{filterCount?.archive_count != 0 ? <Link onClick={() => showAllUsers()}>{t(props.language?.layout?.all_showrecords_nt)}</Link> : null}</small>
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <Fragment>
                                        {data && data.length !== 0 ? (
                                            <TableData
                                                data={data}
                                                tableJSON={tableJSON}
                                                onChangeStatus={onChangeStatus}
                                                onerdStatus={onerdStatus}
                                                actionsToPerform={actionsToDo}
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
        theme: state.themeInfo.them,
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        enrollmentCode: state.authInfo.enrollmentCode,
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, {})(Approvals);
