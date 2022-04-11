import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../partials/spinner.jsx";
import { Fragment } from "react";
import TableData from "./otherAppliedJobs/index.jsx";
import Modal from "react-bootstrap/Modal";
import Fuse from "fuse.js";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/scss/main.scss";
import { useTranslation } from "react-i18next";
import { jobstage } from "../../../translations/helper_translation.jsx";

const OtherJobsApplied = (props) => {
    const { t } = useTranslation();
    const { theme } = props;
    const [status, setStatus] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    let [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const tableJSON = [
        // { displayValue: "", type: "checkbox" },
        { displayValue:  t(props.language?.layout?.ep_jobseeker_companyname), key: "job_company" },
        { displayValue:  t(props.language?.layout?.ep_jobseeker_jobtitle), key: "job_title" },
        { displayValue: t(props.language?.layout?.ep_jobseeker_appliedon), key: "applied_on" },
        { displayValue:  t(props.language?.layout?.ep_jobs_status), key: "current_status" },
        { displayValue: t(props.language?.layout?.ep_jobseeker_jobstatus), key: "job_status" },
        { displayValue: t(props.language?.layout?.ep_jobs_actions) },
    ];
    useEffect(() => {
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
                toast.success(`${t(props.language?.layout?.toast45_nt)} ${jobStageHandler(props?.languageName, obj.current_status)}`, {});
            });
    };

    const getCandidates = () => {
        let apiEndPoint = props.candidate
            ? `/api/v1/recruiter/candidates/${props.id}/applied`
            : `/api/v1/recruiter/applicants/${props.applicationId}/other/applied`;

        axios
            .get(apiEndPoint, { headers: { Authorization: `Bearer ${props.userToken}` } })
            .then((response) => {
                setData(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    };

    const actionsToDo = (actionItem) => {
        if (actionItem === "delete") {
            setDeleteModal(true);
        }
    };
    const closeModal = (actionItem) => {
        if (actionItem === "delete") {
            setDeleteModal(false);
        }
    };
    return (
        <div className=" px-0">
            <div>
                <div className="container-fluid">
                    <Modal show={deleteModal} onHide={closeModal}>
                        <div className="modal-content p-3 border-0">
                            <div className="modal-header border-0 p-0">
                                <button
                                    type="button"
                                    className="close"
                                    aria-label="Close"
                                    title= {t(props.language?.layout?.all_close_nt)}
                                    onClick={() => closeModal("delete")}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                <p> {t(props.language?.layout?.all_suredelete_nt)} </p>
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
                                            <div className="col-md-3 mx-auto">
                                                <div className="text-muted text-center mt-5 pt-5">
                                                    <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid"/>
                                                    <h3 className="pt-2">{t(props.language?.layout?.all_empty_nt)}</h3>
                                                </div>
                                            </div>
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
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(OtherJobsApplied);
