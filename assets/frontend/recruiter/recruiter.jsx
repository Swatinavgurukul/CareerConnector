import React, { useState, useEffect } from "react";
import Axios from "axios";
import Spinner from "../partials/spinner.jsx";
import { useOuterClick } from "../modules/helpers.jsx";
import TableData from "./AddJob/jobsTable/index.jsx";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import Fuse from "fuse.js";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/scss/main.scss";
import Spanish from "@uppy/locales/lib/es_ES";
import English from "@uppy/locales/lib/en_US";
import { renderToLocaleDate, capitalizeFirstLetter, truncate } from "../modules/helpers.jsx";
import ResumeDrop from "../profile/components/resumeDropzone.jsx";
import { Dashboard } from "@uppy/react";
import { useTranslation } from "react-i18next";
import { _multiJobUploadToken } from "../actions/actionsAuth.jsx";
import { jobstage, job_status1 } from "../../translations/helper_translation.jsx";

const Uppy = require("@uppy/core");
const Webcam = require("@uppy/webcam");
const XHRUpload = require('@uppy/xhr-upload')

const Recruiter = (props) => {
    const { t } = useTranslation();
    var tableJSON = [];
    props.user_type == null
        ? (tableJSON = [
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_jobs_title), key: "title" },
            { displayValue: t(props.language?.layout?.ep_jobs_status1), key: "status" },
            { displayValue: t(props.language?.layout?.employer_nt), key: "employer_partners" },
            { displayValue: t(props.language?.layout?.ep_jobs_location), key: "display_name" },
            { displayValue: t(props.language?.layout?.ep_jobs_type), key: "job_type" },
            { displayValue: t(props.language?.layout?.portal_nt), key: "user_is_ca" },
            { displayValue: t(props.language?.layout?.ep_jobs_lastupdated), key: "updated_at" },
            { displayValue: t(props.language?.layout?.ep_jobs_applications), key: "application_count" },
            { displayValue: t(props.language?.layout?.ep_jobs_actions) },
        ])
        : (tableJSON = [
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_jobs_title), key: "title" },
            { displayValue: t(props.language?.layout?.ep_jobs_status1), key: "status" },
            { displayValue: t(props.language?.layout?.ep_jobs_location), key: "display_name" },
            { displayValue: t(props.language?.layout?.ep_jobs_type), key: "job_type" },
            { displayValue: t(props.language?.layout?.ep_jobs_lastupdated), key: "updated_at" },
            { displayValue: t(props.language?.layout?.ep_jobs_applications), key: "application_count" },
            { displayValue: t(props.language?.layout?.ep_jobs_actions) },
        ]);
    const { theme } = props;
    const [jobCreate, setJobCreate] = useState("");
    const [data, setData] = useState([]);
    const [filterCount, setFilterCount] = useState([]);
    const [totalFilterCount, setTotalFilterCount] = useState([]);
    const [query, setQuery] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [status, setStatus] = useState("all");
    let [loading, setLoading] = useState(true);
    const [file, setFile] = useState("");
    const [edit, setEdit] = useState(false);
    const [statusModel, setStatusModel] = useState(true);
    const [spinner, setSpinner] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [isValidTitle, setIsValidTitle] = useState(true);
    const [isValidExternal, setIsValidExternal] = useState(true);
    const [title, setTitle] = useState("");
    const [externalUrl, setExternalUrl] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [colors, setColors] = useState([
        theme.all_color,
        theme.active_color,
        theme.paused_color,
        theme.interview_color,
        theme.closed_color,
        theme.offer_color,
    ]);
    const jobStatus = [
        { key: "all", value: t(props.language?.layout?.js_jobs_all) },
        { key: "active", value: t(props.language?.layout?.ep_jobstatus_active) },
        { key: "paused", value: t(props.language?.layout?.ep_jobstatus_paused) },
        { key: "draft", value: t(props.language?.layout?.ep_jobstatus_draft) },
        { key: "closed", value: t(props.language?.layout?.ep_jobstatus_closed) },
        { key: "Offered", value: t(props.language?.layout?.ep_jobstatus_offered) }];
    const [disable, setDisable] = useState(false);
    React.useMemo(() => {
        return Uppy({
            debug: true,
            autoProceed: false,
            locale: props.languageName === "en" ? English : Spanish,
            // allowMultipleUploads: true,
            restrictions: {
                // maxFileSize: 300000,
                maxNumberOfFiles: 10,
                // minNumberOfFiles: 1,
                allowedFileTypes: [".pdf", ".doc", ".docx"],
            },
            onBeforeUpload: (files) => {
                if (Object.keys(files).length == 0) {
                    toast.error(t(props.language?.layout?.toast109_nt));
                    setSpinner(false);
                    return;
                }
            }
        }).use(XHRUpload, {
            endpoint: 'api/v1/jobs/bulk/uploadfiles',
            headers: {
                Authorization: `Bearer ${props.userToken}`,
            },
            method: 'post',
            formData: true,
            fieldName: 'job_files',
            bundle: true,
        }).use(Webcam)
        // .use(Webcam, { id: "MyWebcam" })
    }, []);
    React.useEffect(() => {
        return () => uppy.close();
    }, []);


    useEffect(() => {
        updateStatus();
        getFilterCount();
        getalldata();
    }, [status]);
    const submit = () => {
        var validUrl = externalUrl.match(
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
        );

        if (!title) {
            toast.error(t(props.language?.layout?.toast73_nt));
            setIsValidTitle(false);
            return;
        }
        if (externalUrl !== "") {
            if (validUrl == null) {
                toast.error(t(props.language?.layout?.toast69_nt));
                return;
            }
        }
        if (!externalUrl) {
            toast.error(t(props.language?.layout?.toast74_nt));
            setValidExternal(false);
            return;
        }
        setDisable(true)
        let interviewQuestions = [{ "id": "legally_authorized", "type": "select", "question": "Are you legally authorized to work in the country of job location?", "options": [{ "label": "Yes", "value": "Yes" }, { "label": "No", "value": "No" }] }, { "id": "visa_sponsorship", "type": "select", "question": "Will you now, or ever, require VISA sponsorship in order to work in the country of job location?", "options": [{ "label": "Yes", "value": "Yes" }, { "label": "No", "value": "No" }] }]
        let formData = new FormData();
        formData.append("title", title);
        formData.append("custom_field1", externalUrl);
        formData.append("interview_questions", JSON.stringify(interviewQuestions));
        Axios({
            method: "post",
            url: "api/v1/jobs/create/url",
            data: formData,
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then(function (response) {
                if (response.data.status === 201) {
                    toast.success(t(props.language?.layout?.toast75_nt));
                    setTimeout(() => {
                        setDetailModal(false);
                        window.location.href = "/jobs";
                    }, 1000);
                }
                return;
            })
            .catch((error) => {
                toast.error(error.response.data.detail || "No response from server.");
                setDisable(false)
            });
    }

    const jobStageHandler = (language, key) =>{
        return(jobstage[language][key]);
    }
    const statusHandler = (language, key) => {
        return(job_status1[language][key]);
    }

    const updateStatus = (value, slug, tenant_email) => {
        if (!value) return;
        var obj = {};
        if (value == "active") {
            obj = {
                status: value,
                job_start_date: format(new Date(), "yyyy-MM-dd"),
                tenant_email: tenant_email
            };
        } else {
            obj = {
                status: value,
                tenant_email: tenant_email,
            };
        }
        let endPoint = props.user.user_id === 1 ? `api/v1/admin/job/status/${slug}` : `api/v1/recruiter/${slug}`
        Axios.put(endPoint, obj, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }).then((response) => {
            getFilterCount();
            getalldata();
            toast.success(`${t(props.language?.layout?.toast49_nt)} ${statusHandler(props?.languageName, obj.status)}`, {});
        })
            .catch((error) => {
                if (error.response.status == 400) {
                    toast.error(t(props.language?.layout?.toast76_nt));
                }
                // console.log(error);
            });;
    };
    const getFilterCount = () => {
        let endpoint = props.user.user_id == 1 ? 'api/v1/admin/jobs/status/count' : "api/v1/recruiter/jobs/status/count"
        Axios.get(endpoint, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }).then((response) => {
            setTotalFilterCount(response.data.data);
            setFilterCount(response.data.data.data);
        });
    };
    const closeHandler = () => {
        setDetailModal(false);
        setTitle("")
        setExternalUrl("")
    };
    const uploadMulti = () => {
        setSpinner(true);
        uppy.upload();
        uppy.on("complete", (result) => {
            props._multiJobUploadToken(result.successful[0] && result.successful[0].response.body.data.token)
        });
        uppy.on('upload-success', (file, response) => {
            setStatusModel(false);
            // closeModal("jobImport");
            setSpinner(false);
        })
        uppy.on('error', (error) => {
            setSpinner(false);
        })
    };

    const getalldata = () => {
        let apiEndPoint;
        if (status !== "") {
            apiEndPoint = props.user_type == null
                ? (`api/v1/admin/alljobs?status=${status}`)
                :
                (`/api/v1/recruiter?status=${status}`);
        } else {
            apiEndPoint = props.user_type == null
                ? (`api/v1/admin/alljobs`)
                :
                (`/api/v1/recruiter`);
        }
        Axios.get(apiEndPoint, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                if (Array.isArray(response.data.data)) {
                    setData(response.data.data);
                    setSearchData(response.data.data);
                } else {
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
    const statusFilter = (filterName) => {
        setStatus(filterName);
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
    function alljObTable() {
        let jobtable = null;
        if (data && data.length == 0) {
            jobtable = ServerStatusHandler();
        }
        if (data && data.length) {
            jobtable = (
                <TableData
                    data={data}
                    tableJSON={tableJSON}
                    actionsToPerform={actionsToDo}
                    updateStatus={updateStatus}
                />
            );
        }
        return jobtable;
    }

    const SearchInString = (str, query) => {
        return (String(str).trim().toLowerCase()).indexOf(String(query).toLowerCase().trim()) > -1;
    }

    const onSearch = (query) => {
        // if (query === "") {
        //     setQuery(query);
        //     getalldata();
        // } else {
        //     setQuery(query);
        //     const fuse = new Fuse(data, {
        //         keys: ["title", "location"],
        //     });
        //     let results = fuse.search(query);
        //     let searchResults = results.map((result) => result.item);
        //     setData(searchResults);
        // }
        setQuery(query);
        if (query === "") {
            setData(searchData);
        }
        else {
            const searchResults = [];
            searchData.forEach(item => {
                if (SearchInString(item.title, query) || SearchInString(item.display_name, query) ||
                    SearchInString(item.state, query) || SearchInString(item.country, query) || SearchInString(item.title_fr, query) || SearchInString(item.title_esp, query)) {
                    searchResults.push(item)
                }
            })
            setData(searchResults);
        }
    };
    const actionsToDo = (actionItem) => {
        if (actionItem === "jobImport") {
            setDeleteModal(true);
        }
    };
    const closeModal = (actionItem) => {
        if (actionItem === "jobImport") {
            setDeleteModal(false);
        }
    };

    const onUploadHandlerUppy = (data) => {
        let fileData = data[0];
        setFile(fileData);
    };
    const candidateDropdown = useOuterClick((ev) => {
        if (dropdown == true) {
            setDropdown(false);
        }
    });
    const createJob = () => {
        setSpinner(true);
        const formData = new FormData();
        formData.append("job_sample", file);
        Axios.post(`api/v1/jobs/bulk/uploadfiles`, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                setJobCreate(response.data.data);
                closeModal("jobImport");
                toast.success(response.data.message);
                updateStatus();
                getFilterCount();
                getalldata();
                setSpinner(false);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                closeModal("jobImport");
                setSpinner(false);
            });
    };
    const reloadforNotification = () => {
        !statusModel &&
            setTimeout(() =>
                window.location.reload()
                , 10000)
        setDeleteModal(false);
        uppy.reset();
        setStatusModel(true);
    }

    return (
        <div className="col-md-10 px-0">
            <div className="d-flex">
                <div className="container-fluid">
                    <div className="row pt-4 pb-2 px-3 gray-100">
                        <div className="col-lg-7 col-md-5 p-0">
                            <h4 className="mb-3">{t(props.language?.layout?.ep_jobs_alljobs)}</h4>
                        </div>
                        <div className="col-lg-5 col-md-7">
                            <div className="d-md-flex align-items-end justify-content-end">
                                <div class="form-group-md animated mr-md-3 mb-3 mb-md-0">
                                    <input
                                        role="search"
                                        type="text"
                                        class="form-control border-right-0 border-left-0 border-top-0 bg-light rounded-0 border-dark pl-4 pb-1"
                                        id="Search"
                                        name="Search"
                                        placeholder={t(props.language?.layout?.jobs_search)}
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
                                {props.user_type == 2 || props.user_type == 5 ? (<></>) : (
                                    <div className="d-flex">
                                        {props.user_type !== null &&
                                            // <button
                                            //     className="btn btn-primary border-0 mr-2"
                                            //     onClick={() => actionsToDo("jobImport")}>
                                            //     Import
                                            // </button>
                                            // ----------------------------------------
                                            <div ref={candidateDropdown} class="candidate dropdown ml-3" tabIndex="0">
                                                <a
                                                    className="btn btn-primary border-0 mr-2"
                                                    onClick={() => setDropdown(!dropdown)}
                                                >
                                                    {t(props.language?.layout?.ep_jobs_import)}
                                                </a>
                                                <div
                                                    class={
                                                        "dropdown-menu dropdown-menu-right rounded-0 py-2 " +
                                                        (dropdown ? "show" : "")
                                                    }
                                                >
                                                    <Link class="dropdown-item"
                                                        onClick={() => actionsToDo("jobImport")}
                                                    >
                                                        {t(props.language?.layout?.all_importjob_nt)}
                                                    </Link>
                                                    <Link class="dropdown-item"
                                                        onClick={() => setDetailModal(!detailModal)}
                                                    >
                                                        {t(props.language?.layout?.all_addurl_nt)}
                                                    </Link>
                                                </div>
                                            </div>
                                            // ----------------------------------------
                                        }
                                        <Link type="button" to="/jobs/create" tabIndex="-1">
                                            <button className="btn btn-primary border-0 px-2" tabIndex="0">+ {t(props.language?.layout?.ep_jobs_addjob)} </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 p-0">
                            <div className="d-flex align-items-center">
                                <img
                                    className="svg-lg-x2 mr-3 mb-2"
                                    src="svgs/rich_icons/jobs.svg"
                                    alt="Jobs Icon"
                                    title="Jobs Icon"
                                />
                                <div>
                                    <div className="d-md-flex d-lg-flex justify-content-end px-md-0">
                                        <p className=" d-flex text-capitalize mb-1">
                                            <span>{totalFilterCount.active_count}</span>
                                            <span>
                                                &nbsp;{totalFilterCount.active_count > 1 ? t(props.language?.layout?.ep_dashboard_activejobs) : t(props.language?.layout?.ep_jobs_activejobs)}
                                            </span>
                                        </p>
                                        {(props.user_type == 2 || props.user_type == 5) ? (
                                            ""
                                        ) : (
                                            <>
                                                <p className="d-flex text-capitalize mb-1">
                                                    <span>
                                                        {totalFilterCount.paused_count >= 1 ? (
                                                            <span>&nbsp;| {totalFilterCount.paused_count}</span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </span>
                                                    <span>
                                                        &nbsp;
                                                        {totalFilterCount.paused_count == 0
                                                            ? ""
                                                            : totalFilterCount.paused_count > 1
                                                                ? t(props.language?.layout?.all_pausedjobs_nt)
                                                                : t(props.language?.layout?.ep_jobs_pausedjobs)}
                                                    </span>
                                                </p>
                                                <p className="d-flex text-capitalize mb-1">
                                                    <span>
                                                        {totalFilterCount.closed_count >= 1 ? (
                                                            <span>&nbsp;| {totalFilterCount.closed_count}</span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </span>
                                                    &nbsp;
                                                    {totalFilterCount.closed_count == 0
                                                        ? ""
                                                        : totalFilterCount.closed_count > 1
                                                            ? t(props.language?.layout?.all_closedjobs_nt)
                                                            : t(props.language?.layout?.all_closedjob_nt)}
                                                </p>
                                                <p className="d-flex text-capitalize mb-1">
                                                    <span>
                                                        {totalFilterCount.expired_count >= 1 ? (
                                                            <span>&nbsp;| {totalFilterCount.expired_count}</span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </span>
                                                    <span>
                                                        &nbsp;
                                                        {totalFilterCount.expired_count == 0
                                                            ? ""
                                                            : totalFilterCount.expired_count > 1
                                                                ? t(props.language?.layout?.all_draftjobs_nt)
                                                                : t(props.language?.layout?.all_draftjob_nt)}
                                                    </span>
                                                </p>
                                                <p className="d-flex text-capitalize mb-1">
                                                    <span>
                                                        {totalFilterCount.offered_count >= 1 ? (
                                                            <span>&nbsp;| {totalFilterCount.offered_count}</span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </span>
                                                    <span>
                                                        &nbsp;
                                                        {totalFilterCount.offered_count == 0
                                                            ? ""
                                                            : totalFilterCount.offered_count > 1
                                                                ? t(props.language?.layout?.all_offerdjobs_nt)
                                                                : t(props.language?.layout?.all_offerdjob_nt)}
                                                    </span>
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    {/* <div>
                                        {totalFilterCount.active_count != 0 ||
                                        totalFilterCount.expired_count != 0 ||
                                        totalFilterCount.paused_count != 0 ||
                                        totalFilterCount.closed_count != 0 ? (
                                            <p>
                                                <i>
                                                    Latest job{" "}
                                                    <span className="text-capitalize text-dark">
                                                        {truncate(totalFilterCount.latest_job, 15)}
                                                    </span>
                                                    &nbsp;was created by{" "}
                                                    <span className="text-capitalize text-dark">
                                                        {(totalFilterCount.created_by_first_name == null ||
                                                            totalFilterCount.created_by_first_name == "") &&
                                                        (totalFilterCount.created_by_last_name == null ||
                                                            totalFilterCount.created_by_last_name == "") ? (
                                                            totalFilterCount.created_by_username
                                                        ) : (
                                                            <span>
                                                                {totalFilterCount.created_by_first_name}&nbsp;
                                                                {totalFilterCount.created_by_last_name}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span>
                                                        {totalFilterCount.created_at
                                                            ? formatDistance(
                                                                  subDays(new Date(totalFilterCount.created_at), 0),
                                                                  new Date()
                                                              ).replace("about", "")
                                                            : ""}
                                                    </span>
                                                    &nbsp;ago
                                                </i>
                                            </p>
                                        ) : (
                                            ""
                                        )}
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="d-flex justify-content-between my-3 pl-4">
                        <div className="d-md-flex align-items-center">
                            <h6 className="text-muted mr-2 mb-0">Filters</h6>
                            <div className="form-group ml-4 mb-0">
                                <select
                                    className="form-control p-0 rounded-0 pointer border-top-0 border-right-0 border-left-0 border-dark"
                                    style={{ fontSize: "12px" }}>
                                    <option value="" disabled selected className="d-none">
                                        Type (All)
                                    </option>
                                    <option value="2">Full Time</option>
                                    <option value="2">Part Time</option>
                                    <option value="2">Temporary</option>
                                    <option value="2">Contract</option>
                                    <option value="2">Internship</option>
                                    <option value="2">Other</option>
                                </select>
                            </div>
                            <div className="form-group mx-4 mb-0">
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
                    {(props.user_type == 2 || props.user_type == 5) ? (
                        ""
                    ) : (
                        <div className="d-md-flex align-items-center mt-4 mb-1 pl-2">
                            <div className="text-muted h6 mr-4">{t(props.language?.layout?.ep_jobs_status)}:</div>
                            <ul className="nav nav-pills nav-fill">
                                {jobStatus.map((count, key) => (
                                    <li className="mr-1 mb-1">
                                        <a
                                            className="nav-link rounded-pill py-0 pointer btn-sm btn text-capitalize"
                                            tabIndex="0"
                                            style={colors[key]}
                                            onClick={() => statusFilter(count.key)}>
                                            {count.value}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="row">
                        <div className="col-md-12 px-3">
                            <div className="card border-0">{loading ? <Spinner /> : alljObTable()}</div>
                        </div>
                    </div>
                    <Modal show={deleteModal} onHide={() => closeModal("jobImport")} size={"lg"}>
                        <div className="modal-content border-0">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                    {t(props.language?.layout?.all_fromfile_nt)}
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    aria-label="Close"
                                    title={t(props.language?.layout?.all_close_nt)}
                                    onClick={() => closeModal("jobImport")}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body px-4">
                                {statusModel ?
                                    <div className="upload-resume">
                                        <div className="row justify-content-center text-muted">
                                            <div className="col-md-7 p-4 border-right">
                                                <Dashboard
                                                    className="thin-scrollbar"
                                                    uppy={uppy}
                                                    hideUploadButton={true}
                                                    width={720}
                                                    height={360}
                                                    showProgressDetails={true}
                                                    showRemoveButtonAfterComplete={true}
                                                    hideCancelButton={false}
                                                    hideProgressAfterFinish={true}
                                                    thumbnailWidth={80}
                                                />
                                            </div>
                                            <div className="col-md-5 mt-5 pl-3">
                                                <h5>{t(props.language?.layout?.seeker_points_nt)}</h5>
                                                <p className="mb-1 ml-4"> {t(props.language?.layout?.js_supportedfile_nt)} : <strong>PDF</strong> {t(props.language?.layout?.all_or_nt)} <strong>DOC</strong></p>
                                                <ul>
                                                    {/* <li> {t(props.language?.layout?.js_uploadinstruction1_nt)}</li> */}
                                                    <li>{t(props.language?.layout?.uploadinginfo_nt)}</li>
                                                    <li>{t(props.language?.layout?.js_uploadinstruction2_nt)} : 2MB</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <>
                                        <div className="d-flex justify-content-center">
                                            <img src="/svgs/icons_new/clock.svg" alt="clock" class="svg-xl icon-blue mb-4" /></div>
                                        <div>{t(props.language?.layout?.seeker_uploadinfo_nt)}</div>
                                        <div>{t(props.language?.layout?.seeker_uploadinfo1_nt)}</div>
                                        <p className="mt-1">{t(props.language?.layout?.seeker_uploadinfo2_nt)}</p></>
                                }
                            </div>
                            <div className="modal-footer border-0">
                                {statusModel ?
                                    <div>
                                        <button className="btn btn-outline-secondary" onClick={() => {
                                            uppy.reset(); setDeleteModal(false);
                                            setSpinner(false); statusModel(true);
                                        }}> {t(props.language?.layout?.sp_adddetails_cancel)}</button>
                                        {spinner == false ? (
                                            <button className="btn btn-primary ml-3"
                                                onClick={() => uploadMulti()}> {t(props.language?.layout?.js_savencontinue_nt)}</button>
                                        ) : (
                                            <div class="bouncingLoader btn btn-primary ml-3">
                                                <div></div>
                                            </div>
                                        )}</div>
                                    : <button className="btn btn-primary ml-3" onClick={reloadforNotification}>{t(props.language?.layout?.all_close_nt)}</button>}
                            </div>
                        </div>
                    </Modal>
                    <Modal show={detailModal} onHide={closeHandler} size={"lg"}>
                        <div className="modal-content">
                            <div className="modal-header px-4">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                    {t(props.language?.layout?.all_addurl_nt)}
                                </h5>
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title={t(props.language?.layout?.all_close_nt)}
                                    onClick={closeHandler}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body px-4 pt-0">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group animated">
                                            <label
                                                className={
                                                    isValidTitle
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="title">
                                                {t(props.language?.layout?.ep_createjob_title)} *
                                            </label>
                                            <input
                                                type="text"
                                                className={isValidTitle ? "form-control" : "form-control border-danger"}
                                                name="title"
                                                aria-label="title"
                                                required
                                                id="id_title"
                                                value={title}
                                                onChange={(e) => {
                                                    setTitle(e.target.value);
                                                    setIsValidTitle(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group animated">
                                            <label
                                                className={
                                                    isValidExternal
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="externalUrl">
                                                {t(props.language?.layout?.ep_createjob_link)} *
                                            </label>
                                            <input
                                                type="text"
                                                className={isValidExternal ? "form-control" : "form-control border-danger"}
                                                name="externalUrl"
                                                aria-label="externalUrl"
                                                required
                                                id="id_externalUrl"
                                                value={externalUrl}
                                                onChange={(e) => {
                                                    setExternalUrl(e.target.value);
                                                    setIsValidExternal(true);
                                                }}
                                            />
                                            <p className="text-muted"> {t(props.language?.layout?.ep_createjob_linkdescription)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="text-center">
                                            <button
                                                type="submit"
                                                aria-label="submit"
                                                disabled={disable === true}
                                                className="btn btn-primary btn-lg mr-auto apply-button-background"
                                                onClick={submit}
                                            >
                                                {t(props.language?.layout?.ep_importjob_submit)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </div >
    );
};

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        user_type: state.authInfo.user.role_id,
        user: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
        userToken: state.authInfo.userToken,
    };
}

export default connect(mapStateToProps, { _multiJobUploadToken })(Recruiter);
