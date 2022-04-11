import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Spinner from "../../partials/spinner.jsx";
import { Fragment } from "react";
import TableData from "../../user/candidatesTable/index.jsx";
import Modal from "react-bootstrap/Modal";
import { useOuterClick } from "../../modules/helpers.jsx";
import Fuse from "fuse.js";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { validate, res } from "react-email-validator";
import { expFilter } from "../../components/constants.jsx";
import { Dashboard } from "@uppy/react";
import { DebounceInput } from "react-debounce-input";

const Uppy = require("@uppy/core");
const Webcam = require("@uppy/webcam");

import InviteCandidate from "../../user/inviteCandidate.jsx";
import { truncate } from "../../modules/helpers.jsx";
import { Link } from "react-router-dom";

const Candidates = (props) => {
    var tableJSON = [];

    props.user.role_id == null
        ? (tableJSON = [
              // { displayValue: "", type: "checkbox" },
              { displayValue: "Name", key: "username" },
              { displayValue: "Email", key: "email" },
              { displayValue: "Skilling Partner", key: "skilling_partners" },
              { displayValue: "Experience", key: "experience" },
              { displayValue: "Company", key: "company" },
              { displayValue: "Job Applied", key: "application_count" },
              { displayValue: "Actions" },
          ])
        : (tableJSON = [
              // { displayValue: "", type: "checkbox" },
              { displayValue: "Name", key: "username" },
              { displayValue: "Email", key: "email" },
              { displayValue: "Experience", key: "experience" },
              { displayValue: "Company", key: "company" },
              { displayValue: "Job Applied", key: "application_count" },
              { displayValue: "Actions" },
          ]);

    const [status, setStatus] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    let [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState("");

    const [skillingPartnerId, setSkillingPartnerId] = useState("");

    const [visible, setVisible] = useState({
        skillPartner: false,
    });
    const [manuallyData, setManuallyData] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        user_location: "",
    });

    useEffect(() => {
        getFilterCount();
        getCandidates();
        getDataKey();
        if (props.user.role_id == null) {
            skillingPartnerHandler();
        }

        // assignJobHandler();
    }, [status]);
    // useEffect(() => {
    //     if (skillPartnerQuerry.id !== "") {
    //         skillingPartnerAdminHandler()
    //     }
    // }, [skillPartnerQuerry.id])
    useEffect(() => {
        if (skillingPartnerId !== "") {
            skillingPartnerAdminHandler();
        }
    }, [skillingPartnerId]);

    // useEffect(() => {
    //     document.addEventListener("mousedown", handleClick, false);
    //     return () => document.removeEventListener("mousedown", handleClick, false);
    // }, []);

    const getFilterCount = () => {
        let endpoint =
            props.user.user_id == 1 ? "api/v1/admin/candidates/count" : "api/v1/recruiter/candidates/status/count";
        axios
            .get(endpoint, {
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

    const skillingPartnerHandler = () => {
        axios
            .get(`api/v1/admin/partner`, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                // console.log("respppp", response.data.data)
                setSkillingPartner(response.data.data);
            });
    };
    const skillingPartnerAdminHandler = () => {
        axios
            .get(`api/v1/admin/skillingpartner/${skillingPartnerId}`, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                setSkillingPartnerAdmin(response.data.data);
            });
    };

    const handleClick = (e) => {
        if (skillPartnerRef.current.contains(e.target)) {
            return;
        }
        setVisible({ ...visible, skillPartner: false });
    };

    // const assignJobHandler = (id) => {
    //     setUserId(id);
    //     setDeleteModal(true);
    // };
    const inviteCandidateHandler = (id) => {
        setUserId(id);
        setDeleteModal(true);
    };
    // const closeAssignModal = () => {
    //     setDeleteModal(false);
    // };
    const closeinviteModal = () => {
        setDeleteModal(false);
    };
    const getCandidates = (pageNo) => {
        let apiEndPoint;
        if (status !== "") {
            apiEndPoint =
                props.user.role_id == null
                    ? `/api/v1/admin/alljobseeker?status=${status}`
                    : `api/v1/recruiter/candidates?status=${status}`;
        } else {
            apiEndPoint = props.user.role_id == null ? `/api/v1/admin/alljobseeker` : `api/v1/recruiter/${props.appId}/similar_candidates`;
        }
        axios
            .get(apiEndPoint, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                if (Array.isArray(response.data.data)) {
                    setData(response.data.data);
                    setAllDataStatus(response.data.data);
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
    const getDataKey = () => {
        axios
            .get("api/v1/setting/tenant/key", {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                setKey(response.data.data.tenant_key);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const actionsToDo = (actionItem) => {
        if (actionItem === "delete") {
            setDeleteModal(true);
        }
        if (actionItem === "upload") {
            setUploadModal(true);
        }
    };
    const ServerStatusHandler = () => {
        return (
            <div className="text-muted text-center p-5">
                <img
                    src="/svgs/illustrations/seo.svg"
                    alt="Hero Image"
                    className="svg-gray"
                    style={{ height: "12rem" }}
                />
                <h3 className="pt-2">Data Not Found...</h3>
            </div>
        );
    };

    return (
        <div className="col px-0">
            <div className="d-flex">
                <InviteCandidate showinviteModal={deleteModal} closeinviteModal={closeinviteModal} userId={userId} />
                <div className="row mt-4">
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
                                            // assignJobHandler={assignJobHandler}
                                            inviteCandidateHandler={inviteCandidateHandler}
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
    );
};
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.them,
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        enrollmentCode: state.authInfo.enrollmentCode,
    };
}

export default connect(mapStateToProps, {})(Candidates);
