import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";
import Spinner from "../partials/spinner.jsx";
import { truncate } from "../modules/helpers.jsx";
import { formatDistance, subDays, format } from "date-fns";
import { useOuterClick } from "../modules/helpers.jsx";
import { connect } from "react-redux";
import { _checkLogin } from "../actions/actionsAuth.jsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { es, fr, enUS as en } from 'date-fns/locale';

const Notifications = (props) => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isToggled, setToggled] = useState(false);
    const [count, setCount] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [seeMoreButton, setSeeMoreButton] = useState(false);
    const [showMore, setShowMore] = useState("");
    const [text, settext] = useState(false);
    const [jobSeekerCopied, setJobSeekerCopied] = useState([]);
    const [skipped, setSkipped] = useState([]);
    const [jobsUploadSuccess, setJobsUploadSuccess] = useState([]);
    const [jobsUploadFailed, setJobsUploadFailed] = useState([]);
    const [jobsUploadStatus, setJobsUploadStatus] = useState({});
    const [uploadStatus, setUploadStatus] = useState([]);
    const [uploadingData, setUploadingData] = useState([]);
    const [openModel, setOpenModel] = useState(false);
    const [openJobModel, setOpenJobModel] = useState(false);
    const [clear, setClear] = useState("");

    // const NotificationDropdown = useOuterClick((ev) => {
    //     if ( isToggled == true) {
    //         setToggled(false);
    //     }
    // });
    // console.log(props.multiresumeToken,"multiresumeToken")
    const NotificationDropdown = useRef(null);
    useEffect(() => {
        document.addEventListener("mousedown", handleClick, false);
        return () => document.removeEventListener("mousedown", handleClick, false);
    }, []);
    const handleClick = (e) => {
        if (NotificationDropdown.current.contains(e.target)) {
            return;
        }
        setToggled(false);
    };

    const toggleonEnter = (e) => {
        if (e.code === "Enter") {
            setToggled(!isToggled);
        }
    };

    useEffect(() => {
        // session.checkLogin();
        props._checkLogin();

        fetchNotifications();
    }, [pageCount,props.languageName]);

    const fetchNotifications = () => {
        const lang = props.languageName
        // Axios.get("/api/v1/notifications/all?page=1&lang=en")
        Axios.get("/api/v1/notifications/all?page=" + pageCount+"&lang="+ lang, {
            headers: { Authorization: `Bearer ${props.token}` },
        })
            .then((response) => {
                setData(response.data.data.data);
                setLoading(false);
                setCount(response.data.data.unread_count);
                response.data.data.total_pages === response.data.data.page_number ? setSeeMoreButton(true) : "";
                let objDiv = document.getElementById("notifications");
                objDiv.scrollTop = objDiv.scrollHeight;
            })
            .catch((error) => { });
    };

    const toggleNotifications = () => {
        setToggled(!isToggled);

    };

    const showMoreMessages = (e) => {
        let nextPage = JSON.parse(JSON.stringify(pageCount)) + 1;
        let temp = data;
        setData(data.concat(temp));
        setPageCount(nextPage);
    };

    const markAllRead = () => {
        Axios.put(`api/v1/notifications/unread`, JSON.stringify(), {
            headers: { Authorization: `Bearer ${props.token}` },
        }).then((response) => {
            if (response.status == 200) {
                fetchNotifications();
            }
        });
    };

    const markAsRead = (i) => {
        data[i]["is_read"] = true;
        var options = {
            headers: { Authorization: `Bearer ${props.token}` },
        };
        let obj = {
            is_read: true,
        };
        Axios.put("/api/v1/notification/" + data[i].id, JSON.stringify(obj), options)
            .then((res) => {
                if (res.status == 200) {
                    fetchNotifications();
                }
            })
            .catch((error) => {
                toast.error(error.response.data.detail || "No response from server.");
            });
    };
    const showTrucateData = (id) => {
        if (text === true && id === showMore) {
            setShowMore("");
            settext(!text);
        } else {
            setShowMore(id);
            settext(!text);
        }
    };
    const checkUploadStatus = (duration) => {
        let apiEndPoint;
        if (duration == null && props.multiresumeToken != null || duration == null && props.multiresumeToken != undefined) {
            apiEndPoint = `api/v1/recruiter/bulk/resume/dataprocess/status?token=${props.multiresumeToken}`
        }
        else if (duration !== null && duration !== undefined) {
            apiEndPoint = `api/v1/recruiter/bulk/resume/dataprocess/status?duration=${duration}`
        }
        else {
            apiEndPoint = `api/v1/recruiter/bulk/resume/dataprocess/status?duration=all`
        }

        Axios
            .get(apiEndPoint, {
                headers: { Authorization: `Bearer ${props.token}` }
            })
            .then((response) => {
                setUploadingData(response.data.data.summary.already_existing_files);
                setJobSeekerCopied(response.data.data.summary.newly_created_files);
                setSkipped(response.data.data.summary.skipped_files);
                setUploadStatus(response.data.data.summary);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };
    const checkJobsUploadStatus = (duration) => {
        let apiEndPoint;
        if (duration == null && props.multiJobUploadToken != null || duration == null && props.multiJobUploadToken != undefined) {
            apiEndPoint = `api/v1/jobs/bulk/dataprocess/status?token=${props.multiJobUploadToken}`
        }
        else if (duration !== null && duration !== undefined) {
            apiEndPoint = `api/v1/jobs/bulk/dataprocess/status?duration=${duration}`
        }
        else {
            apiEndPoint = `api/v1/jobs/bulk/dataprocess/status?duration=all`
        }

        Axios
            .get(apiEndPoint, {
                headers: { Authorization: `Bearer ${props.token}` }
            })
            .then((response) => {
                setJobsUploadStatus(response.data.data.summary);
                setJobsUploadSuccess(response.data.data.summary.success_files);
                setJobsUploadFailed(response.data.data.summary.failed_files);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    // var Interval;
    const uploadingStatus = () => {
        if (props.user.role_id === 1) {
            setOpenJobModel(!openJobModel);
            setToggled(false)
            checkJobsUploadStatus();
        } else {
            setOpenModel(!openModel);
            setToggled(false)
            checkUploadStatus();
        }
    }
    return (
        <div ref={NotificationDropdown}>
            <a
                className="nav-item p-md-10 p-lg-4 sidebar-heading h-100"
                onClick={toggleNotifications}
                tabIndex="0"
                onKeyPress={(e) => toggleonEnter(e)}>
                <div
                    className={
                        "d-flex align-items-center icon-invert " + (count === 0 ? "justify-content-center" : " pl-2")
                    }
                    style={{ top: 0, left: 0, zIndex: 2 }}>
                    {count !== 0 ? (
                        <a className="nav-link btn-svg d-flex order-1 p-0 pt-1 notification-icon position-relative">
                            <span className="badge badge-pill badge-danger">{count !== 0 ? count : " "}</span>
                        </a>
                    ) : (
                        ""
                    )}
                    <img
                        id="notification"
                        src="/svgs/icons_new/bell_new.svg"
                        alt="Notifications"
                        className="svg-sm"
                        width="16"
                    />
                </div>
            </a>
            <div className="dropdown notify-icon" >
                <div
                    // ref={NotificationDropdown}
                    className="p-lg-3 nav-item text-center dropdown w-100 h-100"
                >
                    <div
                        id="Notify"

                        className={
                            "dropdown-menu bg-white text-dark w-100 thin-scrollbar not-dropdown-menu navbar-dropdown " +
                            (isToggled == true ? " show " : "")
                        }
                        style={{ position: "absolute", top: "0px", borderRadius: "0px 0px 10px 10px" }}>
                        <div className="border border-left-0 border-right-0 border-top-0 border-white">
                            {loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    {data.length > 0 ? (
                                        data.map((data, index) => (
                                            <div
                                                key={data.id}
                                                className="lightgrey position-relative pointer"
                                                style={{ zIndex: "0" }}
                                                tabIndex="0"
                                                onClick={(e) => markAsRead(index)}
                                                onKeyPress={(e) => markAsRead(index)}>
                                                <div class="row p-2"
                                                    onClick={data.model_type =="uploaded_files" ? () => { uploadingStatus(); props.user.role_id === 1 ? checkJobsUploadStatus() : checkUploadStatus(); } : null}>
                                                    <p
                                                        className={`px-3 mb-0 col-md-11 ${data.is_read ? "text-muted" : "text-dark"
                                                            }`}>
                                                        {/* {text.id && text.id=== data.id?data.message:truncate(data.message, 116)} */}
                                                        {/*{data.message.includes("Uploaded files are processed successfully") ?
                                                        <span className="pointer" onClick={() => {uploadingStatus();checkUploadStatus(); }}>
                                                        {showMore !== "" && showMore == data.id
                                                            ? data.message
                                                            : truncate(data.message, 116)}
                                                    </span> : */}
                                                        <a>
                                                            {showMore !== "" && showMore == data.id
                                                                ? data.message
                                                                : truncate(data.message, 116)}
                                                        </a>
                                                        {/*  }  */}
                                                        <div
                                                            tabIndex="0"
                                                            onKeyPress={() => showTrucateData(data.id)}
                                                            className="float-right text-primary pointer"
                                                            onClick={() => showTrucateData(data.id)}>
                                                            {data.model_type =="uploaded_files" || data.model_type =="change_password"  ? "" :
                                                                <span>
                                                                    {showMore !== "" && showMore == data.id && text == true
                                                                        ? t(props.language?.layout?.all_less_nt)
                                                                        : t(props.language?.layout?.all_showmore_nt)}
                                                                </span>
                                                            }
                                                        </div>
                                                    </p>
                                                    <div
                                                        className={`text-primary mt-2 ${data.is_read ? "bg-light" : "brand-color"
                                                            }`}
                                                        style={{
                                                            width: "10px",
                                                            height: "10px",
                                                            // backgroundColor: "blue",
                                                            borderRadius: "50%",
                                                        }}></div>
                                                </div>
                                                <div class="d-flex justify-content-between px-3 pb-2"
                                                    onClick={data.model_type =="uploaded_files" ? () => { uploadingStatus(); props.user.role_id === 1 ? checkJobsUploadStatus() : checkUploadStatus() } : null}>
                                                    <i className={`small ${data.is_read ? "text-muted" : "text-dark"}`}>
                                                        {formatDistance(
                                                            subDays(new Date(data.created_at), 0),
                                                            new Date(), { locale: props.languageName === "en" ? en : props.languageName === "es"? es: fr }
                                                        ).replace("about", "")}{" "}
                                                        {t(props.language?.layout?.all_ago_nt)}
                                                    </i>
                                                    <i className={`small ${data.is_read ? "text-muted" : "text-dark"}`}>
                                                        {new Date(data.updated_at).toLocaleTimeString(
                                                            navigator.language,
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        ) +
                                                            "," +
                                                            " " +
                                                            format(new Date(data.updated_at), "dd-LL-yyyy")}
                                                    </i>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center pt-2"> {t(props.language?.layout?.js_nonotification_nt)}</p>
                                    )}
                                </>
                            )}
                            {data && data.length > 0 && (
                                <div className="d-flex justify-content-between px-3 notification-buttons">
                                    <button
                                        tabIndex="0"
                                        onClick={(e) => showMoreMessages(e)}
                                        onKeyPress={(e) => showMoreMessages(e)}
                                        disabled={seeMoreButton}
                                        className="btn btn-outline-dark rounded my-3 mt-1 btn-sm">
                                        {t(props.language?.layout?.all_show_more_nt)}
                                    </button>
                                    <button
                                        tabIndex="0"
                                        onClick={() => markAllRead()}
                                        onKeyPress={() => markAllRead()}
                                        disabled={count === 0}
                                        className="btn btn-light my-3 mt-1 btn-sm">
                                        {t(props.language?.layout?.all_markrread_nt)}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={openModel} onHide={() => {
                setOpenModel(false); clearInterval(clear);
            }} size={"lg"} centered>
                <div className="modal-header border-0 p-3">
                    <h5 className="modal-title" id="staticBackdropLabel">
                    {t(props.language?.layout?.importfin_nt)}
                    </h5>
                    <button
                        type="button"
                        className="close animate-closeicon"
                        aria-label="Close"
                        title="Close"
                        onClick={() => { setOpenModel(false); clearInterval(clear); }}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-content border-0 p-3" >
                    <div className="confirm-details thin-scrollbar p-2" style={{ border: "2px solid #0f0f104a" }}>
                        {jobSeekerCopied?.length === 0 && skipped?.length === 0 && uploadingData?.length === 0 ?
                            <div className="col-md-3 mx-auto">
                                <div className="text-muted text-center mt-5 pt-5">
                                    <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid" />
                                    <h3 className="pt-2">{t(props.language?.layout?.all_empty_nt)}</h3>
                                </div>
                            </div> :
                            <Fragment>
                                {jobSeekerCopied.map(data => (
                                    <div className="row justify-content-between py-2">
                                        <div className="col-md-8 d-flex">
                                            <img src="/svgs/icons_new/pdf_icon.svg" alt="pdfIcon" class="svg-sm mr-2" />
                                            <table>
                                                <tbody>
                                                    <tr className="" style={{ wordBreak: "break-all" }}>{data.resume_file}</tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-4 d-flex justify-content-between px-5">
                                            <table className="col-md-9">
                                                <tbody>
                                                    <tr className="text-success">{t(props.language?.layout?.sucess_nt)}</tr>
                                                </tbody>
                                            </table>
                                            <table className="col-md-3">
                                                <tbody>
                                                    <tr><img src="/svgs/icons_new/success.svg" alt="success" class="svg-sm mx-2" /></tr>
                                                </tbody>
                                            </table>
                                            {/*  <table className="col-md-3">
                                <tbody>
                                    <tr><img src="/svgs/icons_new/trash.svg" alt="delete" class="svg-sm" /></tr>
                                </tbody>
                              </table>
                              <div className="col-md-3"></div>  */}
                                        </div>
                                    </div>))}
                                {skipped.map(data => (
                                    <div className="row justify-content-between py-2">
                                        <div className="col-md-8 d-flex">
                                            <img src="/svgs/icons_new/pdf_icon.svg" alt="pdfIcon" class="svg-sm mr-2" />
                                            <table>
                                                <tbody>
                                                    <tr className="" style={{ wordBreak: "break-all" }}>{data.resume_file}</tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-4 d-flex justify-content-between px-5">
                                            <table className="col-md-9">
                                                <tbody>
                                                    <tr className="text-danger">{t(props.language?.layout?.notparsed_nt)}</tr>
                                                </tbody>
                                            </table>
                                            <table className="col-md-3">
                                                <tbody>
                                                    <tr><img src="/svgs/icons_new/x-circle-red.svg" alt="close" class="svg-sm-1 mx-1 invert-color" /></tr>
                                                </tbody>
                                            </table>
                                            {/*   <div className="col-md-3"></div> */}
                                        </div>
                                    </div>))}
                                {uploadingData.map(data => (
                                    <div className="row justify-content-between py-2">
                                        <div className="col-md-8 d-flex">
                                            <img src="/svgs/icons_new/pdf_icon.svg" alt="pdfIcon" class="svg-sm mr-2" />
                                            <table>
                                                <tbody>
                                                    <tr className="" style={{ wordBreak: "break-all" }}>{data.resume_file}</tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-4 d-flex justify-content-between px-5">
                                            <table className="col-md-9">
                                                <tbody>
                                                    <tr className="text-danger">{t(props.language?.layout?.alexists_nt)}</tr>
                                                </tbody>
                                            </table>
                                            <table className="col-md-3">
                                                <tbody>
                                                    <tr><img src="/svgs/icons_new/alert.svg" alt="close" class="svg-sm mx-2" /></tr>
                                                </tbody>
                                            </table>
                                            {/*   <div className="col-md-3"></div> */}
                                        </div>
                                    </div>))}
                            </Fragment>
                        }
                    </div>

                </div>
                <div className="modal-footer border-0 justify-content-between">
                    <div className="d-flex align-items-center">
                        <img src="/svgs/icons_new/success.svg" alt="success" class="svg-sm mr-2" /><p className="mr-3 mb-0">{uploadStatus.newly_created_count} {t(props.language?.layout?.sucess_nt)}</p>
                        {props.user.role_id != 1 && <><img src="/svgs/icons_new/alert.svg" alt="alert" class="svg-sm mr-2" /><p className="mb-0 mr-3">{uploadStatus.already_existing_count}{t(props.language?.layout?.skipped_nt)}</p></>}
                        <img src="/svgs/icons_new/x-circle-red.svg" alt="close" class="svg-sm-1 mr-2 invert-color" /><p className="mb-0">{uploadStatus.skipped_count} {t(props.language?.layout?.failed_nt)}</p>
                        <div className="ml-5 d-flex align-items-center">
                            <div className="pr-2">{t(props.language?.layout?.interview_duration_nt)}</div>
                            <select
                                onChange={(e) => checkUploadStatus(e.target.value)}
                                className="form-control custom-select text-muted rounded-0 px-2 py-1">
                                <option value="" disabled selected>{t(props.language?.layout?.seeker_select)}</option>
                                <option value="all">{t(props.language?.layout?.jobs_jobtype_all)}</option>
                                <option value="15">15 {t(props.language?.layout?.interview_mins_nt)}</option>
                                <option value="30">30 {t(props.language?.layout?.interview_mins_nt)}</option>
                                <option value="45">45 {t(props.language?.layout?.interview_mins_nt)}</option>
                                <option value="60">1 {t(props.language?.layout?.interview_hour_nt)}</option>
                                <option value="90">1 {t(props.language?.layout?.interview_hour_nt)} 30 {t(props.language?.layout?.interview_mins_nt)}</option>
                                <option value="120">2 {t(props.language?.layout?.interview_hours_nt)}</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn btn-secondary" onClick={() => { setOpenModel(false); clearInterval(clear); }}>{t(props.language?.layout?.all_close_nt)}</button>
                </div>
            </Modal>
            <Modal show={openJobModel} onHide={() => {
                setOpenJobModel(false); clearInterval(clear);
            }} size={"lg"} centered>
                <div className="modal-header border-0 p-3">
                    <h5 className="modal-title" id="staticBackdropLabel">
                    {t(props.language?.layout?.importfin_nt)}
                    </h5>
                    <button
                        type="button"
                        className="close animate-closeicon"
                        aria-label="Close"
                        title="Close"
                        onClick={() => { setOpenJobModel(false); clearInterval(clear); }}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-content border-0 p-3" >
                    <div className="confirm-details thin-scrollbar p-2" style={{ border: "2px solid #0f0f104a" }}>
                        {jobsUploadSuccess?.length === 0 && jobsUploadFailed?.length === 0 ?
                            <div className="col-md-3 mx-auto">
                                <div className="text-muted text-center mt-5 pt-5">
                                    <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid" />
                                    <h3 className="pt-2">{t(props.language?.layout?.all_empty_nt)}</h3>
                                </div>
                            </div> : <Fragment>
                                {jobsUploadSuccess.map(data => (
                                    <div className="row justify-content-between py-2">
                                        <div className="col-md-8 d-flex">
                                            <img src="/svgs/icons_new/pdf_icon.svg" alt="pdfIcon" class="svg-sm mr-2" />
                                            <table>
                                                <tbody>
                                                    <tr className="" style={{ wordBreak: "break-all" }}>{data.job_file}</tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-4 d-flex justify-content-between px-5">
                                            <table className="col-md-9">
                                                <tbody>
                                                    <tr className="text-success">{t(props.language?.layout?.sucess_nt)}</tr>
                                                </tbody>
                                            </table>
                                            <table className="col-md-3">
                                                <tbody>
                                                    <tr><img src="/svgs/icons_new/success.svg" alt="success" class="svg-sm mx-2" /></tr>
                                                </tbody>
                                            </table>
                                            {/*  <table className="col-md-3">
                                <tbody>
                                    <tr><img src="/svgs/icons_new/trash.svg" alt="delete" class="svg-sm" /></tr>
                                </tbody>
                              </table>
                              <div className="col-md-3"></div>  */}
                                        </div>
                                    </div>))}
                                {jobsUploadFailed.map(data => (
                                    <div className="row justify-content-between py-2">
                                        <div className="col-md-8 d-flex">
                                            <img src="/svgs/icons_new/pdf_icon.svg" alt="pdfIcon" class="svg-sm mr-2" />
                                            <table>
                                                <tbody>
                                                    <tr className="" style={{ wordBreak: "break-all" }}>{data.job_file}</tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-4 d-flex justify-content-between px-5">
                                            <table className="col-md-9">
                                                <tbody>
                                                    <tr className="text-danger">{t(props.language?.layout?.notparsed_nt)}</tr>
                                                </tbody>
                                            </table>
                                            <table className="col-md-3">
                                                <tbody>
                                                    <tr><img src="/svgs/icons_new/x-circle-red.svg" alt="close" class="svg-sm-1 mx-1 invert-color" /></tr>
                                                </tbody>
                                            </table>
                                            {/*   <div className="col-md-3"></div> */}
                                        </div>
                                    </div>))}
                            </Fragment>
                        }
                    </div>
                </div>
                <div className="modal-footer border-0 justify-content-between">
                    <div className="d-flex align-items-center">
                        <img src="/svgs/icons_new/success.svg" alt="success" class="svg-sm mr-2" /><p className="mr-3 mb-0">{jobsUploadStatus.success_count} {t(props.language?.layout?.sucess_nt)}</p>
                        <img src="/svgs/icons_new/x-circle-red.svg" alt="close" class="svg-sm-1 mr-2 invert-color" /><p className="mb-0">{jobsUploadStatus.failed_count} {t(props.language?.layout?.failed_nt)}</p>
                        <div className="ml-5 d-flex align-items-center">
                            <div className="pr-2">{t(props.language?.layout?.interview_duration_nt)}</div>
                            <select
                                onChange={(e) => checkJobsUploadStatus(e.target.value)}
                                className="form-control custom-select text-muted rounded-0 px-2 py-1">
                                <option value="" disabled selected>{t(props.language?.layout?.seeker_select)}</option>
                                <option value="all">{t(props.language?.layout?.jobs_jobtype_all)}</option>
                                <option value="15">15 {t(props.language?.layout?.interview_mins_nt)}</option>
                                <option value="30">30 {t(props.language?.layout?.interview_mins_nt)}</option>
                                <option value="45">45 {t(props.language?.layout?.interview_mins_nt)}</option>
                                <option value="60">1 {t(props.language?.layout?.interview_hour_nt)}</option>
                                <option value="90">1 {t(props.language?.layout?.interview_hour_nt)} 30 {t(props.language?.layout?.interview_mins_nt)}</option>
                                <option value="120">2 {t(props.language?.layout?.interview_hours_nt)}</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn btn-secondary" onClick={() => { setOpenJobModel(false); clearInterval(clear); }}>{t(props.language?.layout?.all_close_nt)}</button>
                </div>
            </Modal>
        </div >
    );
};

function mapStateToProps(state) {
    return {
        token: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
        multiresumeToken: state.authInfo.multiresumeToken,
        multiJobUploadToken: state.authInfo.multiJobUploadToken
    };
}
function mapDispatchToProps(dispatch) {
    return {
        _checkLogin: () => dispatch(_checkLogin()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
