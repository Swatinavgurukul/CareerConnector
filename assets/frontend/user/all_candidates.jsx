import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Spinner from "../partials/spinner.jsx";
import { Fragment } from "react";
import TableData from "./candidatesTable/index.jsx";
import Modal from "react-bootstrap/Modal";
import { useOuterClick } from "../modules/helpers.jsx";
import Fuse from "fuse.js";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { validate, res } from "react-email-validator";
import { expFilter } from "../components/constants.jsx";
import UppyUploadFiles from "../user/uppyUpload.jsx";
import { Dashboard } from "@uppy/react";
import Spanish from "@uppy/locales/lib/es_ES";
import English from "@uppy/locales/lib/en_US";
import { DebounceInput } from "react-debounce-input";
import { _advanceSearchData, _multiresumeToken } from "../actions/actionsAuth.jsx";
import { getQueryParameters, removeEmpty, getQueryString } from "../modules/helpers.jsx";
import { useHistory } from "react-router-dom";

const Uppy = require("@uppy/core");
const Webcam = require("@uppy/webcam");
const XHRUpload = require('@uppy/xhr-upload')
const StatusBar = require('@uppy/status-bar')
// const Uppy = require("@uppy/core");
// const Webcam = require("@uppy/webcam");
import TagsInput from "react-tagsinput";
import JobAssign from "./jobAssign.jsx";
import Dropzone from "react-dropzone";
import InviteCandidate from "./inviteCandidate.jsx";
import LocationSearchInput from "../common/locations.jsx";
// import ResumeDrop from "../profile/components/resumeDropzone.jsx";
import FileDropZone from "../profile/components/fileDropzone.jsx";
import SkillsDropDown from "../profile/components/skills_dropdown.jsx";
import { truncate } from "../modules/helpers.jsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const locationsJSON = {
    country: false,
    state: false,
    city: true,
};


const Candidates = (props) => {
    const { t } = useTranslation();
    var tableJSON = [];
    props.user.role_id == null
        ? (tableJSON = [
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "username" },
            { displayValue: t(props.language?.layout?.sp_adddetails_email), key: "email" },
            { displayValue: t(props.language?.layout?.contact_skillingpartner), key: "skilling_partners" },
            // { displayValue: t(props.language?.layout?.ep_application_experience), key: "experience" },
            // { displayValue: t(props.language?.layout?.all_company), key: "company" },
            { displayValue: t(props.language?.layout?.portal_nt), key: "is_ca" },
            { displayValue: t(props.language?.layout?.datejoined_nt), key: "created_at" },
            { displayValue: t(props.language?.layout?.lastlogin_nt), key: "last_login" },
            { displayValue: t(props.language?.layout?.sp_js_jobapplied), key: "application_count" },
            { displayValue: t(props.language?.layout?.sp_jobs_actions) },
        ])
        : (tableJSON = [
            // { displayValue: "", type: "checkbox" },
            { displayValue: t(props.language?.layout?.ep_dashboard_name), key: "username" },
            { displayValue: t(props.language?.layout?.sp_adddetails_email), key: "email" },
            { displayValue: t(props.language?.layout?.ep_application_experience), key: "experience" },
            { displayValue: t(props.language?.layout?.all_company), key: "company" },
            { displayValue: t(props.language?.layout?.sp_js_jobapplied), key: "application_count" },
            { displayValue: t(props.language?.layout?.sp_jobs_actions) },
        ]);

    //restrict - , ., e values in input
    const history = useHistory();
    const [symbolsArr] = useState(["e", "E", "-", "."]);
    const { theme } = props;
    const [status, setStatus] = useState("");
    const [query, setQuery] = useState("");
    const [filterCount, setFilterCount] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [uploadModal, setUploadModal] = useState(false);
    const [bulkUploadModal, setBulkUploadModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    let [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [allDataStatus, setAllDataStatus] = useState([]);
    const [showNav, setNav] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [divs, setDivs] = useState(false);
    const [userId, setUserId] = useState("");
    const [candidateId, setCandidateId] = useState("");
    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState("");
    const [uploadMultipleData, setUploadMultipleData] = useState([]);
    const [resumeFileData, setresumeFileData] = useState("");
    const [key, setKey] = useState("");
    const [resumeResponseData, setResumeResponseData] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [showDiv, setShowDiv] = useState(true);
    const [closeDiv, setCloseDiv] = useState(false);
    const [next, setNext] = useState(true);
    const [jobSeekerCopied, setJobSeekerCopied] = useState([]);
    const [skipped, setSkipped] = useState([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [skillingPartner, setSkillingPartner] = useState([]);
    const [skillingPartnerAdmin, setSkillingPartnerAdmin] = useState([]);
    const [skillingPartnerId, setSkillingPartnerId] = useState("");
    const [skillingPartnerKey, setSkillingPartnerKey] = useState("");
    const [skillingPartnerAdminId, setSkillingPartnerAdminId] = useState("");
    const [searchNames, setSearchNames] = useState([]);
    const [search, setSearch] = useState({});
    const [archive, setArchive] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [skillPartnerQuerry, setSkillPartnerQuerry] = useState({
        id: '',
        value: '',
        key: ''
    })
    const [filterSkillPartner, setFilterSkillPartner] = useState('')
    const [visible, setVisible] = useState({
        skillPartner: false
    })
    const [manuallyData, setManuallyData] = useState({
        title: "",
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        user_location: "",
    });
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regexExp = /^[a-zA-Z0-9+.]+$/;
    const candidateDropdown = useOuterClick((ev) => {
        if (dropdown == true) {
            setDropdown(false);
        }
    });
    // const skillPartnerRef = useRef(null);

    React.useMemo(() => {
        return Uppy({
            debug: true,
            autoProceed: false,
            locale: props.languageName === "en" ? English : Spanish,
            // allowMultipleUploads: true,
            restrictions: {
                // maxFileSize: 300000,
                maxNumberOfFiles: 25,
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
            endpoint: 'api/v1/recruiter/bulk/resume/uploadfiles',
            headers: {
                Authorization: `Bearer ${props.userToken}`,
            },
            method: 'post',
            formData: true,
            fieldName: 'resume_files',
            bundle: true,
        }).use(Webcam)
        // .use(Webcam, { id: "MyWebcam" })
    }, []);
    React.useEffect(() => {
        return () => uppy.close();
    }, []);

    useEffect(() => {
        getFilterCount();
        getCandidates();
        getDataKey();
        if (props.user.role_id == null) {
            skillingPartnerHandler()
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
            skillingPartnerAdminHandler()
        }
    }, [skillingPartnerId])

    // useEffect(() => {
    //     document.addEventListener("mousedown", handleClick, false);
    //     return () => document.removeEventListener("mousedown", handleClick, false);
    // }, [])

    useEffect(() => {
        props._advanceSearchData({advanceSearchResults: [], searchName: ""});
        searchHandler();
    }, [])

    const downloadCSV = () => {
        axios({
            url: "api/v1/recruiter/candidates/create/bulk",
            method: "GET",
            responseType: "blob",
            headers: { Authorization: `Bearer ${props.userToken}` },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `file.csv`);
            document.body.appendChild(link);
            link.click();
        });
    };

    const getFilterCount = () => {
        let endpoint = props.user.user_id == 1 ? 'api/v1/admin/candidates/count' : "api/v1/recruiter/candidates/status/count"
        axios
            .get(endpoint, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                setFilterCount(response.data.data);
            })
            .catch((error) => {

                setLoading(false);
            });
    };

    const showHandler = () => {
        uploadMulti();
        // setSpinner(true);
        // setTimeout(() => onMultiUpload(), 2000);
    };

    const closeUndoHandler = () => {
        setCloseDiv(true);
    };
    const skillingPartnerHandler = () => {
        axios
            .get(`api/v1/admin/partner`, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                // console.log("respppp", response.data.data)
                setSkillingPartner(response.data.data)

            });
    };
    const skillingPartnerAdminHandler = () => {
        axios
            .get(`api/v1/admin/skillingpartner/${skillingPartnerId}`, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {

                setSkillingPartnerAdmin(response.data.data)
            });
    };
    const getSkillPartner = (e) => {
        setSkillPartnerQuerry({ ...skillPartnerQuerry, value: e.target.value })
        // console.log(querry)
        const fuse = new Fuse(skillingPartner, {
            keys: [
                'name'
            ]
        });
        let result = fuse.search(e.target.value);
        setFilterSkillPartner(result)
        if (!visible.empPartner) {
            setVisible({ ...visible, skillPartner: true })
        }

    }
    const selectItem = (item) => {
        setSkillPartnerQuerry({
            ...skillPartnerQuerry,
            id: item.item.id,
            value: item.item.name,
            key: item.item.key
        });
        setVisible({ ...visible, skillPartner: false })
    };
    // const handleClick = (e) => {

    //     if (skillPartnerRef.current.contains(e.target)) {
    //         return;
    //     }
    //     setVisible({ ...visible, skillPartner: false });

    // };



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
            apiEndPoint = props.user.role_id == null
                ? (`/api/v1/admin/alljobseeker?status=${status}`)
                :
                `api/v1/recruiter/candidates?status=${status}`;
        } else {
            apiEndPoint = props.user.role_id == null
                ? (`/api/v1/admin/alljobseeker`)
                :
                `api/v1/recruiter/candidates`;
        }
        axios
            .get(apiEndPoint, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                if (Array.isArray(response.data.data)) {
                    var archiveList = response.data.data.filter((item) => {
                        return item.archive == false
                    });
                    props.advanceSearchData.advanceSearchResults.length > 0 ? setData(props.advanceSearchData.advanceSearchResults) :  setData(archiveList);
                    setSearchData(archiveList);
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

    const showAllUsers = () => {
        let endPoint;
        endPoint = props.user.role_id === null ?
            "/api/v1/admin/alljobseeker" : "/api/v1/recruiter/candidates";
        axios
            .get(endPoint, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                setData(response.data.data);
                setSearchData(response.data.data);
            })
            .catch((error) => {
                console.log(error);
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
    const experianceFilter = (min_exp, max_exp) => {
        axios
            .get(`api/v1/recruiter/candidates?min_exp=${min_exp}&max_exp=${max_exp}`, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                setData(response.data.data);
            });
    };
    const change = (event) => {
        let arr = JSON.parse(JSON.stringify(expFilter)).filter((item) => {
            if (item.key === event.target.value) {
                return item.value;
            }
        });

        let exp = arr[0].value;
        experianceFilter(exp[0], exp[1]);
    };
    const checkFilter = (filterName) => {
        if (status === filterName) {
            setStatus("");
        } else {
            setStatus(filterName);
        }
    };

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
                    SearchInString(item.last_name, query) || SearchInString(item.company, query) || SearchInString(item.email, query)) {
                    searchResults.push(item)
                }
            })
            setData(searchResults);
        }
    };

    const actionsToDo = (actionItem, id, archive) => {
        if (actionItem === "delete") {
            setDeleteModal(true);
        }
        if (actionItem === "upload") {
            setUploadModal(true);
        }
        if (actionItem === "moreOptions") {
            setDeleteConfirmation(true);
            setCandidateId(id);
            setArchive(archive);
        }
    };

    const unArchiveUser = () => {
        const data = {
            candidate_ids: [candidateId]
        }
        axios
            .post(`/api/v1/recruiter/candidates/archive`, data, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` }
            })
            .then((response) => {
                if (response.status === 200) {
                    getCandidates();
                    getFilterCount();
                    toast.success(t(props.language?.layout?.toast57_nt));
                }
            })
            .catch((err) => {
                if (err) {
                    toast.error(t(props.language?.layout?.toast58_nt));
                }
            });
    };

    const deleteJobSeeker = () => {
        let data = {
            candidate_ids: [candidateId]
        }
        axios
            .delete(`/api/v1/recruiter/candidates/archive`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` }, data
            })
            .then((response) => {
                if (response.status === 200) {
                    getCandidates();
                    getFilterCount();
                    toast.success(t(props.language?.layout?.unarchived_toast_nt));
                }
            })
            .catch((err) => {
                if (err) {
                    toast.error(t(props.language?.layout?.toast58_nt));
                }
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
    const closeModal = (actionItem) => {
        if (actionItem === "delete") {
            setDeleteModal(false);
        }
        if (actionItem === "upload") {
            uppy.cancelAll();
            setShowDiv(true);
            setUploadModal(false);
        }
    };
    const onSubmit = () => {
        setSpinner(true);
        // if (!manuallyData.firstname || !manuallyData.lastname) {
        //     toast.error("Please enter required details", { ...toastConfig });
        //     return false;
        // }
        // if (!manuallyData.phone) {
        //     toast.error("Please enter your phone number", { ...toastConfig });
        //     return;
        // }
        if (manuallyData.phone.length !== 10) {
            toast.error(t(props.language?.layout?.toast79_nt));
            setSpinner(false);
            return;
        }
        // if (!manuallyData.email.length) {
        //     toast.error("Please enter your email", { ...toastConfig });
        //     return;
        // }
        if(!regexExp.test(manuallyData.email.split("@")[0])){
            toast.error(t(props.language?.layout?.toast83_nt));
            setSpinner(false);
            return;
        }
        if (!regex.test(manuallyData.email)){
            toast.error(t(props.language?.layout?.toast83_nt));
            setSpinner(false);
            return;
        }
        // validate(manuallyData.email);
        // if (!res) {
        //     toast.error(t(props.language?.layout?.toast83_nt));
        //     setSpinner(false);
        //     return;
        // }

        let formData = new FormData();
        // formData.append("full_name", full_name);
        formData.append("title", manuallyData.title == undefined ? "" : manuallyData.title);
        formData.append("first_name", manuallyData.firstname);
        formData.append("last_name", manuallyData.lastname);
        formData.append("email", manuallyData.email);
        formData.append("phone", manuallyData.phone);
        formData.append("password", "testpassword");
        formData.append("area_code", +1);
        formData.append("resume_file", resumeFileData);
        formData.append("set_password", "yes");
        formData.append("created_by", props.user.user_id);
        formData.append("language_preference", props.languageName);
        { props.user.role_id == null ? formData.append("key", skillingPartnerKey) : formData.append("key", key) }
        axios({
            method: "post",
            url: "/api/v1/register",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((response) => {
                getCandidates();
                toast.success(t(props.language?.layout?.toast110_nt));
                setTimeout(() => {
                    setDetailModal(false);
                    setSpinner(false);
                    props.history.push(`/jobSeekers/${response.data.data.id}`, "OpenDefalutModal");
                }, 1000);
            })
            .catch((error) => {
                toast.error(error.response.data.data || t(props.language?.layout?.toast53_nt));
                setSpinner(false);
                return;
            });
    };
    const onInputChange = (e) => {
        if (e.target.name === "phone") {
            var num = e.target.value.toString().slice(0, 10);
            setManuallyData({ ...manuallyData, [e.target.name]: num });
        } else if (e.target.name === "email") {
            setManuallyData({ ...manuallyData, [e.target.name]: e.target.value });
        } else {
            if (!e.target.value.startsWith(" ")) {
                setManuallyData({ ...manuallyData, [e.target.name]: e.target.value });
            } else {
                toast.error(t(props.language?.layout?.toast111_nt))
            }
            {/* {no_translated} */ }
        }
    };

    // const checkExtension = (filetype, data) => {
    //     Object.values(data)
    //         .filter((y) => y.extension !== filetype)
    //         .map((x) => {
    //             uppy.removeFile(x.id);
    //         });
    // };
    // const onMultiUpload = () => {
    //     uppy.upload();
    //     uppy.on("complete", (result) => {
    //         checkExtension(result.successful[0].extension, result.successful[0].data);
    //         // console.log(result, "Upload complete! We’ve uploaded these files:", result);
    //         const formData = new FormData();
    //         formData.append("files", result.successful[0].data);

    //         axios({
    //             url: "api/v1/recruiter/candidates/create/bulk",
    //             method: "POST",
    //             data: formData,
    //             responseType: "blob",
    //             headers: { Authorization: `Bearer ${props.userToken}` },
    //         })
    //             .then((response) => {
    //                 getFilterCount();
    //                 getCandidates();
    //                 closeModal("upload");
    //                 toast.info(response.statusText);
    //             })
    //             .catch((err) => {
    //                 closeModal("upload");
    //                 toast.error(err.response.statusText);
    //                 return;
    //             });
    //     });
    // };

    const handleChange = (tags) => {
        setTags(tags);
    };
    const onChangeInput = (tag) => {
        const validTag = tag.replace(/([^\w-\s]+)|(^\s+)/g, "");
        //   .replace(/\s+/g, "-");
        setTag(validTag);
    };
    const changeSkillingPartner = (event) => {
        let arr = skillingPartner.map((item) => {
            if (item.id == event.target.value) {
                setSkillingPartnerId(item.id)
                setSkillingPartnerKey(item.key)
            }
        });
    };
    const closeHandler = () => {
        setManuallyData("");
        setTags([]);
        setSpinner(false);
        setDetailModal(false);
    };
    const setLocationCity = (data, city, locationCity, plcaeId) => {
        let location = {};
        // console.log(city, " in city ", locationCity, plcaeId);
        location.city = city[0];
        location.state = city[1];
        location.country = city[2];
        location.latitude = locationCity.lat;
        location.longitude = locationCity.lng;
        location.place_id = plcaeId;
        setManuallyData({ ...manuallyData, user_location: location });
        // props.updateName("location",location)
        // props.saveProfileDetails({ profile: { location: location } }, props.user.availability_id)
        // console.log(location)
    };
    const setLocation = (location) => {
        let totalAddress = [];
        let adr = location && location["address"];
        for (let i = 0; i < adr.length; i++) {
            if (
                adr[i].types[0] === "locality" ||
                adr[i].types[0] === "administrative_area_level_1" ||
                adr[i].types[0] === "country"
            ) {
                totalAddress.push(adr[i].long_name);
            }
        }
    };

    const onUploadHandlerUppy = (data) => {
        let fileData = data[0];
        const formData = new FormData();
        formData.append("resume_file", fileData);
        setresumeFileData(fileData);
    };

    const uploadMulti = () => {
        setSpinner(true);
        uppy.upload();
        uppy.on("complete", (result) => {
            props._multiresumeToken(result.successful[0] && result.successful[0].response.body.data.token)
            Object.values(result.successful).map((x) => {
                uploadMultipleData.push(x.data);
            });
        });
        uppy.on('upload-success', (file, response) => {
            setNext(false);
            setSpinner(false);
        })
        uppy.on('error', (error) => {
            setSpinner(false);
        })
    };

    const onMultiUpload = () => {
        let formData = new FormData();
        uploadMultipleData.forEach((file) => {
            formData.append("resume_files", file);
        });
        axios
            .post(`api/v1/recruiter/bulk/resume/uploadfiles`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${props.userToken}`,
                },
            })
            .then((response) => {
                setNext(false);
                setSpinner(false);
                setResumeResponseData(response.data.data);
                uppy.reset();
                setUploadMultipleData([]);
                setShowDiv(false);
                if (response.status == 200) {
                    toast.success(t(props.language?.layout?.toast112_nt));
                    getFilterCount();
                    getCandidates();
                }
                setBulkUploadModal(false);
                // var skipped = response.data.data.filter(data => {
                //     return data.remarks === 'Already exists';
                // }
                // );
                // setSkipped(skipped);
                // var jobSeekersCopied = response.data.data.filter(data => {
                //     return data.remarks === 'New';
                // }
                // );
                // setJobSeekerCopied(jobSeekersCopied);
            })
            .catch((err) => {
                setSpinner(false);
                setShowDiv(false);
                uppy.reset();
                setUploadMultipleData([]);
                setBulkUploadModal(false);
                if (response.status == 400) {
                    toast.error(t(props.language?.layout?.toast109_nt));
                }
                return;
            });
    };




    const uploadResumeData = () => {
        axios
            .put(`/api/v1/recruiter/bulk/candidate/update`, resumeResponseData, {
                headers: { Authorization: `Bearer ${props.userToken}` }
            })
            .then((response) => {
                setBulkUploadModal(false);
                if (response.status == 200) {
                    toast.success(response.data.message);
                }
                getFilterCount();
                getCandidates();
                uppy.reset();
                setNext(true);
            })
            .catch((err) => {
                toast.error(err.response.message);
                uppy.reset();
                setNext(true);
            });
    };

    // const updateResumeData = (e, result, index) => {
    //     var data = { ...result, [e.target.name]: e.target.value }
    //     resumeResponseData[index] = data;
    //     setResumeResponseData([...resumeResponseData])
    // }

    var renderArray = [];

    // renderArray.push(
    //     <>
    //         <div className="table-responsive">
    //             <table class="table table-bordered table-sm thin-scrollbar" style={{ border: "2px solid #0c0b0b85" }}>
    //                 <thead className="bg-light">
    //                     <tr>
    //                         <th scope="col">First name</th>
    //                         <th scope="col">Last name</th>
    //                         <th scope="col">Email</th>
    //                         <th scope="col">Phone</th>
    //                         <th scope="col">Remarks</th>
    //                     </tr>
    //                 </thead>
    //                 {resumeResponseData.map((result, index) => (
    //                     <tbody>
    //                         <td className=""><input
    //                             type="text"
    //                             value={result.first_name}
    //                             className="border-0 text-capitalize"
    //                             id="first_name"
    //                             name="first_name"
    //                             aria-label="first_name"
    //                             onChange={(e) => updateResumeData(e, result, index)}
    //                         /></td>
    //                         <td className=""><input
    //                             type="text"
    //                             value={result.last_name}
    //                             className="border-0 text-capitalize"
    //                             id="last_name"
    //                             name="last_name"
    //                             aria-label="last_name"
    //                             onChange={(e) => updateResumeData(e, result, index)}
    //                         /></td>
    //                         <td className=""><input
    //                             type="email"
    //                             value={result.email}
    //                             className="border-0"
    //                             id="email"
    //                             name="email"
    //                             aria-label="email"
    //                             onChange={(e) => updateResumeData(e, result, index)}
    //                         /></td>
    //                         <td className=""><input
    //                             // type="number"
    //                             value={result.phone}
    //                             className="border-0"
    //                             id="phone"
    //                             name="phone"
    //                             aria-label="phone"
    //                             onChange={(e) => updateResumeData(e, result, index)}
    //                         /></td>
    //                         <td className="text-capitalize">{result.remarks == "Already exists" ? <span className="text-danger">{result.remarks}</span> : result.remarks}</td>
    //                     </tbody>
    //                 ))}
    //             </table>
    //         </div>
    //     </>
    // );
    const reloadforNotification = () => {
        !next &&
            setTimeout(() =>
                window.location.reload()
                , 10000)
        setBulkUploadModal(false);
        uppy.reset();
        setNext(true);
    }

    const searchHandler = () => {
        axios
            .get("/api/v1/jobseeker/search/param", { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } })
            .then((response) => {
                //    console.log(response.data.data);
                setSearchNames(response.data.data);
                if(props.advanceSearchData.advanceSearchResults.length > 0){
                let compare = response.data.data.filter((d) => {
                    return  d.name === props.advanceSearchData.searchName
                  })
                  setSearch(JSON.stringify(compare[0]));
                }
            })
            .catch((error) => {
                if (error) {
                    toast.error(t(props.language?.layout?.toast58_nt));
                }
            });
    };

    const searchFromDropdown = (query_string) => {
        axios
            .get("/api/v1/recruiter/candidates?" + query_string, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } })
            .then((response) => {
                setData(response.data.data);
                if (response.data.data == 0) {
                    toast.error(t(props.language?.layout?.toast113_nt));
                    return;
                }
            })
            .catch((error) => {
                if (error) {
                    toast.error(t(props.language?.layout?.toast58_nt));
                }
            });
    };

    const updateDropdownSearch = (data) => {
        setSearch(data);
        let url_params = getQueryParameters(history.location.search);
        let selectData = JSON.parse(data);
        let filter_params = Object.assign({}, selectData.params, url_params);
        let final_filters = removeEmpty(filter_params);
        let query_string = getQueryString(final_filters);
        // setFilter(final_filters);
        searchFromDropdown(query_string);
    }

    return (
        <div className="col-md-10 px-0">
            <div className="d-flex">
                <div className="container-fluid">
                    <div className="d-md-flex pt-4 px-2 gray-100">
                        <div className="col-md-6 p-0">
                            <h4 className="mb-3"> {t(props.language?.layout?.sp_viewseeker_alljs)}</h4>
                            <div className="d-flex align-items-center">
                                <img
                                    className="svg-lg mr-3 mb-2"
                                    src="svgs/rich_icons/candidates.svg"
                                    alt="Candidates Icon"
                                />
                                <div>
                                    <p className="d-flex text-capitalize mb-1">
                                        {filterCount.candidate_count != 0 ? (
                                            <span>
                                                {filterCount.candidate_count}{" "}
                                                {filterCount.candidate_count <= 1 ? t(props.language?.layout?.sp_js) : t(props.language?.layout?.sp_js_seekers)}
                                            </span>
                                        ) : null}
                                    </p>
                                    <p className="mb-1">
                                        {filterCount.new_candidates != 0 ? (
                                            <i>
                                                <span className="text-dark">
                                                    {filterCount.new_candidates}{" "}
                                                    {filterCount.new_candidates <= 1
                                                        ? t(props.language?.layout?.sp_js)
                                                        : t(props.language?.layout?.sp_js_seekers)}
                                                    &nbsp;{t(props.language?.layout?.sp_added)}
                                                </span>
                                            </i>
                                        ) : null}
                                    </p>
                                    <p className="mb-2">
                                        {filterCount.archive_count != 0 ? (
                                            <span className="text-dark">
                                                {filterCount.archive_count}{" "}
                                                {filterCount.archive_count <= 1
                                                    ? t(props.language?.layout?.sp_js)
                                                    : t(props.language?.layout?.sp_js_seekers)}
                                                &nbsp;archived
                                            </span>
                                        ) : null}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 d-md-flex d-lg-flex justify-content-end px-md-0">
                            <div>
                                <div className="d-md-flex align-items-end my-md-0 my-3">
                                    <div class="form-group-md animated mb-3 mb-md-0">
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
                                    {/* <img
                                        src="/svgs/icons_new/edit-2.svg"
                                        className="svg-sm mx-4 mb-2 pointer"
                                        alt="Edit Icon"
                                        title="Edit"
                                    />
                                    <img
                                        src="/svgs/icons_new/download.svg"
                                        className="svg-sm mb-2 pointer"
                                        alt="Download Icon"
                                        title="Download"
                                    /> */}
                                    {/* <button type="button" class="btn btn-light mx-md-4 mr-4">
                                        Import
                                    </button> */}

                                    <div ref={candidateDropdown} class="candidate dropdown ml-3" tabIndex="0">
                                        <a className="btn btn-primary border-0" onClick={() => setDropdown(!dropdown)}>
                                            + {t(props.language?.layout?.sp_js_addseeker)}
                                        </a>
                                        <div
                                            class={
                                                "dropdown-menu dropdown-menu-right rounded-0 py-2 " +
                                                (dropdown ? "show" : "")
                                            }>
                                            <Link class="dropdown-item" onClick={() => setBulkUploadModal(!bulkUploadModal)}>
                                                {t(props.language?.layout?.addseeker_upload_nt)}
                                            </Link>
                                            <Link class="dropdown-item" onClick={() => setDetailModal(!detailModal)}>
                                                {t(props.language?.layout?.addseeker_manually_nt)}
                                            </Link>
                                            {/*  <Link class="dropdown-item" onClick={() => uploadingStatus()}>
                                                Status
                                            </Link> */}
                                        </div>
                                    </div>

                                    {/* <div class="ml-3" tabIndex="0"> */}
                                    {/* <button
                                        // type="submit"
                                        className="btn btn-primary ml-md-3 "
                                        onClick={() => setDetailModal(!detailModal)}>
                                        + Add Job Seeker
                                    </button> */}
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal show={bulkUploadModal} onHide={reloadforNotification} size={"lg"} centered>
                        <div className="modal-content">
                            <div className="modal-header px-4 border-0">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                    {next ? t(props.language?.layout?.seeker_upload_nt) : t(props.language?.layout?.seeker_import_nt)}
                                </h5>
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title= {t(props.language?.layout?.all_close_nt)}
                                    onClick={reloadforNotification}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body px-4">
                                {next ?
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
                                                    <li> {t(props.language?.layout?.js_uploadinstruction1_nt)}</li>
                                                    <li>{t(props.language?.layout?.js_uploadinstruction2_nt)} : 2MB</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    // <div className="confirm-details">{renderArray}</div>
                                    <>
                                        <div className="d-flex justify-content-center">
                                            <img src="/svgs/icons_new/clock.svg" alt="clock" class="svg-xl icon-blue mb-4" /></div>
                                        <div>{t(props.language?.layout?.seeker_uploadinfo_nt)}</div>
                                        <div>{t(props.language?.layout?.seeker_uploadinfo1_nt)}</div>
                                        <p className="mt-1">{t(props.language?.layout?.seeker_uploadinfo2_nt)}</p></>
                                }
                            </div>
                            <div className="modal-footer border-0">
                                {/* <div className="row col-md-12"> */}
                                {/* <div className="col-md-6">
                                        {
                                            next ? "" : <div className="d-flex">
                                                <><img src="/svgs/icons_new/success.svg" alt="success" class="svg-sm mr-2" /><p className="mr-3">{jobSeekerCopied.length} Job seekers copied</p></>
                                                <><img src="/svgs/icons_new/alert.svg" alt="success" class="svg-sm mr-2" /><p>{skipped.length} Skipped</p></></div>
                                        }
                                    </div> */}
                                {/* <div className="col-md-6 text-right"> */}
                                {next ?
                                    <div>
                                        <button className="btn btn-outline-secondary" onClick={() => {
                                            setBulkUploadModal(false);
                                            setResumeResponseData([]); setSpinner(false); setNext(true); uppy.reset();
                                        }}> {t(props.language?.layout?.sp_adddetails_cancel)}</button>
                                        {spinner == false ? (
                                            <button className="btn btn-primary ml-3"
                                                onClick={() => showHandler()}> {t(props.language?.layout?.js_savencontinue_nt)}</button>
                                        ) : (
                                            <div class="bouncingLoader btn btn-primary ml-3">
                                                <div></div>
                                            </div>
                                        )}</div>
                                    : <button className="btn btn-primary ml-3" onClick={reloadforNotification}> {t(props.language?.layout?.all_close_nt)}</button>}
                                {/* </div> */}
                                {/* </div> */}
                            </div>
                        </div>
                    </Modal>

                    <Modal show={uploadModal} onHide={() => closeModal("upload")} size={"xl"} centered>
                        <div className="modal-content">
                            <div className="modal-header px-4">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                    Upload Candidates  {/* {no_translated} */}
                                </h5>
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title= {t(props.language?.layout?.all_close_nt)}
                                    onClick={() => closeModal("upload")}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body px-4">
                                <div class="row justify-content-center">
                                    <div class="col-md-8 text-center">
                                        <div class="card-group">
                                            <div class="card border-0">
                                                <div
                                                    class={
                                                        "card-body" +
                                                        (showDiv ? " timeline-item-progress" : " timeline-item-finish")
                                                    }>
                                                    <div class="timeline-item-icon">
                                                        <span class="timeline-icon">
                                                            {showDiv ? (
                                                                1
                                                            ) : (
                                                                <img
                                                                    src="/svgs/icons_new/check.svg"
                                                                    class="svg-xs invert-color"
                                                                />
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div class="d-inline-block">
                                                        <h6 class="timeline-item-title mt-3"></h6>
                                                        <br />
                                                        <span class="font-weight-bold">Uploads</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card border-0">
                                                <div class={"card-body" + (showDiv ? "" : " timeline-item-progress")}>
                                                    <div class="timeline-item-icon">
                                                        <span class="timeline-icon">2</span>
                                                    </div>
                                                    <div class="d-inline-block">
                                                        <br />
                                                        <span class="font-weight-bold">Confirmation Details</span>
                                                        {/* {no_translated} */}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {showDiv ? (
                                    <div className="upload-resume">
                                        <div className="row justify-content-center text-muted">
                                            <div className="col-auto m-5">
                                                <Dashboard
                                                    className="thin-scrollbar"
                                                    uppy={uppy}
                                                    hideUploadButton={true}
                                                    width={720}
                                                    height={360}
                                                />
                                                {/* <UppyUploadFiles width={800} height={400} allowedFileType={['.pdf']} onBlukUpload={onBlukUpload}/> */}

                                                {/* <Dashboard uppy={uppy} hideUploadButton={true} allowedFileTypes={["image/*"]} /> */}
                                            </div>
                                            {/* <div className="col-md-5 pl-4 pr-0">
                                                <h6 className="font-weight-bold text-right text-dark mb-5">
                                                    <a download class="text-dark mb-0 pointer" onClick={() => downloadCSV()}>
                                                        <u> Download sample file.csv </u>
                                                        <img
                                                            src="/svgs/icons_new/download.svg"
                                                            className="svg-xs ml-2"
                                                            alt="Upload Icon"
                                                            title="Upload"
                                                        />
                                                    </a>
                                                </h6>
                                                <h5>Points to be considered</h5>
                                                <div className="pl-2">
                                                    <p>For Supported File Type: PDF or Doc</p>
                                                    <ul className="pl-3">
                                                        <li>One candidate profile per documents</li>
                                                        <li>Max file Size (per file) : 5 MB</li>
                                                    </ul>
                                                    <p>For Supported File Type: CSV</p>
                                                    <ul className="pl-3">
                                                        <li>One candidate data per row in the file</li>
                                                        <li>
                                                            The following feilds are mandatory: First name, Last Name, Phone
                                                            Number, Email
                                                    </li>
                                                        <li>
                                                            File should contain the same columns in same order(downlond sample
                                                            file.csv)
                                                    </li>
                                                    </ul>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="confirm-details thin-scrollbar">{renderArray}</div>
                                )}
                            </div>
                            {showDiv ? (
                                <div className="modal-footer py-3 px-4">
                                    <div className="d-flex justify-content-end">
                                        <button
                                            className="btn btn-outline-secondary mr-3 px-5"
                                            onClick={() => closeModal("upload")}>
                                            Cancel {/* {no_translated} */}

                                        </button>
                                        {/* <button className="btn btn-primary brand-color" onClick={() => onMultiUpload()}>
                                        Upload
                                    </button> */}

                                        {spinner === false ? (
                                            <button className="btn btn-primary brand-color px-5" onClick={showHandler}>
                                                Next {/* {no_translated} */}

                                            </button>
                                        ) : (
                                            <div class="spinner-border text-primary" role="status">
                                                <span class="sr-only">Loading... {/* {no_translated} */}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="modal-footer py-3 px-4">
                                    <div className="d-flex justify-content-end">
                                        <button
                                            className="btn btn-outline-secondary mr-3 px-5"
                                            onClick={() => closeModal("upload")}>
                                            Cancel {/* {no_translated} */}

                                        </button>
                                        {/* <button className="btn btn-primary brand-color" onClick={() => onMultiUpload()}>
                                        Upload
                                    </button> */}
                                        <button className="btn btn-primary brand-color px-5" onClick={showHandler}>
                                            Upload {/* {no_translated} */}

                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Modal>
                    <Modal show={detailModal} onHide={closeHandler} size={"lg"}>
                        <div className="modal-content">
                            <div className="modal-header px-4">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                    {t(props.language?.layout?.js_addseeker_details_nt)}
                                </h5>
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title= {t(props.language?.layout?.all_close_nt)}
                                    onClick={closeHandler}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body px-4 pt-0">
                                {props.user.role_id == null && <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group animated">
                                            <label for="skilling_partner" className="form-label-active z-indexCustom">
                                                Skilling Partner *
                                            </label>
                                            {/* <DebounceInput
                                            className="form-control"
                                            minLength={2}
                                            id="job_title"
                                            debounceTimeout={500}
                                            onChange={getSkillPartner}
                                            value={skillPartnerQuerry.value}

                                        />
                                        {skillPartnerQuerry !== '' &&
                                        <div
                                            ref={skillPartnerRef}
                                            className={`Jobtemplate thin-scrollbar ${visible.skillPartner ? "visible-template" : ""}`}>

                                                <ul className="p-0 mb-1">
                                                    {filterSkillPartner.length === 0  && (
                                                        <li key="" className="dropdown_item text-center ">
                                                            Job template results not found
                                                        </li>
                                                    )}
                                                    {filterSkillPartner &&
                                                        filterSkillPartner.map((item) => (
                                                            <li
                                                                key={item.id}
                                                                onClick={() => selectItem(item)}
                                                                className="dropdown_item sidebar-heading">
                                                                <div className="item_text1">{item.item.name}</div>
                                                            </li>
                                                        ))}
                                                </ul>

                                        </div>} */}
                                            <select
                                                id="skilling_partner"
                                                className="form-control"
                                                value={skillingPartnerId}
                                                onChange={changeSkillingPartner}
                                            >
                                                <option value="" disabled selected className="d-none">
                                                    Select
                                                </option>
                                                {skillingPartner.map((item) => (
                                                    <option value={item.id}>{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group animated">
                                            <label for="skilling_partnerAdmin" className="form-label-active z-indexCustom">
                                                Skilling Partner Admin *
                                            </label>
                                            <select
                                                id="skilling_partnerAdmin"
                                                className="form-control"
                                                value={skillingPartnerAdminId}
                                                onChange={(e) => setSkillingPartnerAdminId(e.target.value)}
                                            >
                                                <option value="" disabled selected className="d-none">
                                                    Select
                                                </option>
                                                {skillingPartnerAdmin.map((item) => (
                                                    <option value={item.id}>{item.email}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>}
                                <div className="row">
                                    <div className="col-md-2">
                                        <div className="form-group animated">
                                            <label className="form-label-active z-indexCustom " for="title">
                                                {t(props.language?.layout?.seeker_title)}
                                            </label>
                                            <select className="form-control" aria-label="title" name="title" value={manuallyData.title} onChange={(e) => onInputChange(e)}>
                                                <option selected="" className="d-none">
                                                    {t(props.language?.layout?.sp_setting_bd_select)}
                                                </option>
                                                <option value="mr">{t(props.language?.layout?.skilling_signup_selectoption_mr)}</option>
                                                <option value="ms">{t(props.language?.layout?.skilling_signup_selectoption_ms)}</option>
                                                <option value="mrs">{t(props.language?.layout?.skilling_signup_selectoption_mrs)}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div class="form-group animated">
                                            <label class="form-label-active z-indexCustom">{t(props.language?.layout?.seeker_firstname)} </label>
                                            <input
                                                aria-label="firstname"
                                                class="form-control"
                                                name="firstname"
                                                value={manuallyData.firstname}
                                                onChange={(e) => onInputChange(e)}
                                                autocomplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div class="form-group animated">
                                            <label class="form-label-active z-indexCustom">{t(props.language?.layout?.seeker_lastname)}</label>
                                            <input
                                                class="form-control"
                                                aria-label="lastname"
                                                name="lastname"
                                                value={manuallyData.lastname}
                                                onChange={(e) => onInputChange(e)}
                                                autocomplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div class="form-group animated">
                                            <label class="form-label-active z-indexCustom"> {t(props.language?.layout?.seeker_phone)} </label>
                                            <input
                                                aria-label="phonenumber"
                                                min="0"
                                                type="number"
                                                onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                                value={manuallyData.phone}
                                                onChange={(e) => onInputChange(e)}
                                                name="phone"
                                                class="form-control"
                                                autocomplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div class="form-group animated">
                                            <label class="form-label-active z-indexCustom"> {t(props.language?.layout?.seeker_email)} </label>
                                            <input
                                                aria-label="emailId"
                                                type="email"
                                                class="form-control"
                                                name="email"
                                                value={manuallyData.email}
                                                onChange={(e) => onInputChange(e)}
                                                autocomplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid">
                                <div className="row p-3">
                                    <div class="align-item-center col-md-7">
                                        <FileDropZone filesdata={onUploadHandlerUppy} />
                                    </div>
                                    <div class="align-item-center col-md-5">
                                        <div className="vl mt-2">
                                            <div className="suportfile ml-3">
                                                <p> {t(props.language?.layout?.js_supportedfile_nt)} : <span className="pdf_Doc">PDF {t(props.language?.layout?.all_or_nt)} Doc</span></p>
                                                <ul>
                                                    <li>{t(props.language?.layout?.js_uploadinstruction2_nt)} : 2MB</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer py-3 px-4">
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-outline-secondary mr-3 px-5" onClick={closeHandler}>
                                        {t(props.language?.layout?.sp_adddetails_cancel)}
                                    </button>
                                    {spinner === false ? (
                                        <button
                                            className="btn btn-primary brand-color px-4"
                                            disabled={
                                                !(
                                                    // manuallyData.title &&
                                                    manuallyData.firstname &&
                                                    manuallyData.lastname &&
                                                    manuallyData.phone &&
                                                    manuallyData.email
                                                )
                                            }
                                            onClick={onSubmit}>
                                            {t(props.language?.layout?.js_addseeker_nt)}
                                        </button>
                                    ) : (
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="sr-only">Loading...</span> {/* {no_translated} */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal>
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
                                        <button className="btn btn-primary" onClick={() => { deleteJobSeeker(); setDeleteConfirmation(false) }}>&nbsp;{t(props.language?.layout?.all_yes_nt)}&nbsp;</button>
                                        :
                                        <button className="btn btn-primary" onClick={() => { unArchiveUser(); setDeleteConfirmation(false) }}>&nbsp;{t(props.language?.layout?.all_yes_nt)}&nbsp;</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </Modal>

                    <InviteCandidate
                        showinviteModal={deleteModal}
                        closeinviteModal={closeinviteModal}
                        userId={userId}
                    />
                    {/*   <JobAssign showAssignModal={deleteModal} closeAssignModal={closeAssignModal} userId={userId} />   */}

                    <div className="mt-3 advance-search">
                        {/* <h4 className="mb-3">All Job Seekers</h4> */}
                        <div className="d-md-flex align-items-end">
                            {/* <div class="form-group-md animated mb-3 mb-md-0">
                                <input
                                    role="search"
                                    type="text"
                                    class="form-control border-right-0 border-left-0 border-top-0 bg-light rounded-0 border-dark pl-4 pb-1"
                                    id="Search"
                                    name="Search"
                                    placeholder="Search ..."
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
                            </div> */}
                            {process.env.CLIENT_NAME === "cc" &&
                                <>
                                    <Link className="h5 mb-0 mx-3 text-muted" to="/advancedSearch">
                                        Advanced search
                                    </Link>
                                    <div className="form-group-md animated mb-3 mb-md-0 col-lg-3 pr-0">
                                        <div class="icon-invert d-flex justify-content-start" style={{ marginBottom: "-1.8rem" }}>
                                            <img
                                                src="/svgs/icons_new/align.svg"
                                                alt="align"
                                                class="svg-sm mx-1"
                                            />
                                        </div>
                                        <select
                                            value={search}
                                            onChange={(e) => updateDropdownSearch(e.target.value)}
                                            aria-label="search name"
                                            className="form-control text-capitalize pl-4">
                                            <option selected className="d-none">Select Saved Search</option>
                                            {!searchNames.length && <option disabled selected>No data</option>}
                                            {searchNames.map((data) => (
                                                <option value={JSON.stringify(data)}>{data.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div class={`icon-invert border border-left-0 rounded-right py-1 pt-2 d-flex justify-content-end ${search && search.length == undefined ? "disabled" : ""}`}>
                                        <Link className=""

                                            to={{
                                                pathname: `/advancedSearch`,
                                                state: search,
                                                editSearch: true,
                                                isLocation: true
                                            }}>
                                            <img
                                                src="/svgs/icons_new/edit-2.svg"
                                                alt="search"
                                                class="svg-xs mx-2 pointer"
                                            /></Link>
                                    </div></>}
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-md-12 px-3">
                            <div className="card border-0">
                                <small className="ml-auto position-relative" style={{ top: "18px" }}>{filterCount.archive_count != 0 ? <Link onClick={() => showAllUsers()}>{t(props.language?.layout?.all_showrecords_nt)}</Link> : null}</small>
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
        </div >
    );
};
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.them,
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        enrollmentCode: state.authInfo.enrollmentCode,
        advanceSearchData: state.authInfo.advanceSearchData,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, { _advanceSearchData, _multiresumeToken })(Candidates);
