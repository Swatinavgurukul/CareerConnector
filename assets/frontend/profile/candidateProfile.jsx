import React, { Component } from "react";
import Axios from "axios";
import Education from "./components/education.jsx";
import Certification from "./components/certificates.jsx";
import { truncate } from "../modules/helpers.jsx";
import Work from "./components/work.jsx";
import Notes from "./components/notes.jsx";
import ResumeScore from "./components/resumeScore.jsx";
import ProfileHeader from "./components/profile_header.jsx";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import AdminSkills from "./components/adminSkills.jsx";
import UppyUpload from "../user/uppyUpload.jsx";
import { toast } from "react-toastify";
import DeleteConfirmation from "./components/delete_confirmation.jsx";
import ResumeDrop from "../profile/components/resumeDropzone.jsx";
import AdminMessages from "./components/adminMessages.jsx";
import { connect } from "react-redux";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import OtherAppliedJobs from "./components/otherJobsApplied.jsx";
import SimilarCandidates from "./components/similarcandidates.jsx";
import { withTranslation } from 'react-i18next';

class UserProfile extends Component {
    constructor(props) {
        super();
        this.state = {
            initialUserData: {},
            user: {
                id: null,
                email: "",
                first_name: null,
                last_name: null,
                image: null,
                phone: null,
                location: null,
                about_me: "",
                show_profile: false,
                email_verified: false,
                linkdein_link: "",
                facebook_link: "",
                resume_parsed: false,
                blog_link: "",
            },
            edit_item: null,
            education: [],
            work: [],
            acheviment: [],
            errorCode: null,
            certificate: [],
            skill: [],
            achievement: [],
            loading: false,
            resume_file: null,
            updated_at: null,
            archived: null,
            modalOpen: false,
            description: "",
            showMore: true,
            resume_data: {},
            job_details: [],
            fileModal: false,
            work_delete_confirm_modal: false,
            education_delete_confirm_modal: false,
            certificate_delete_confirm_modal: false,
            message: [],
            resumeFileData: "",
            uploadCheck: false,
            uploadResumeRecheck: false,
            confirmResumeUpload: false,
            resumeFileadded: "",
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.getData = this.getData.bind(this);
    }
    componentDidMount() {
        window.addEventListener("mousedown", this.clickHandler);
        this.getData();
        this.notes();
    }
    clickHandler(e) {
        let isInsideClick = this.node ? ReactDOM.findDOMNode(this.node).contains(e.target) : false;
        if (this.state.edit_item && !isInsideClick) {
            if (this.state.edit_item === "aboutme" && (this.state.user.about_me == this.state.checkAboutMe) === false) {
                if (window.confirm("Changes made will be discarded. Do you want to proceed?")) {
                    this.setState({ edit_item: true });
                    this.validateUserName();
                } else {
                }
            } else {
                this.setState({ edit_item: true });
                this.validateUserName();
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener("onmousedown", this.clickHandler);
    }

    getData = () => {
        let id_user = this.props.match.params.id;
        // console.log(this.props.location.job_id)
        Axios.get(`/api/v1/users/details/${id_user}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                let incoming_data = response.data.data;
                this.setState({ ...incoming_data, isLoading: false });
            })
            .catch((error) => {
                if (error.status == 401) {
                    this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
        Axios.get(`/api/v1/users/profile/${id_user}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                let incoming_data = response.data.data;
                let resume_file = response.data.data.resume_file;
                let updated_at = response.data.data.updated_at;
                let archive = response.data.data.archive;
                this.setState({
                    user: { ...incoming_data },
                    isLoading: false,
                    initialUserData: { ...incoming_data },
                    resume_file: resume_file,
                    updated_at: updated_at,
                    archived: archive
                });
                if (incoming_data.about_me.length > 350) {
                    this.setState({ description: truncate(incoming_data.about_me, 350), showMoreCheck: true });
                } else {
                    this.setState({ showMoreCheck: false, description: incoming_data.about_me });
                }
            })
            .catch((error) => {
                if (error.status == 401) {
                    this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
        Axios.get(`/api/v1/profile_score/${id_user}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                let incoming_data = response.data.data;
                // console.log(incoming_data);
                this.setState({ resume_data: incoming_data });
            })
            .catch((error) => {
                if (error.status == 401) {
                    // this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
        Axios.get(`/api/v1/recruiter/user/${id_user}/message`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                // console.log(response.data.data);
                // let incoming_data = response.data.data;
                this.setState({ message: response.data.data });
            })
            .catch((error) => {
                if (error.status == 401) {
                    this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
    };
    notes = () => {
        Axios.get(`/api/v1/recruiter/user/${this.props.match.params.id}/notes`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                this.setState({ job_details: response.data.data });
                // console.log("ressssssssssssss   ", response.data.data)
            })
            .catch((error) => {
                if (error.status == 401) {
                    this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
    };

    delete = (data, id) => {
        let self = this;
        const endpoint = `/api/v1/users/details/${id}`;
        Axios.delete(endpoint, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            data,
        })
            .then((response) => {
                self.getData();
                toast.success(this.props.t(this.props.language?.layout?.toast52_nt));
            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));
            });
    };

    addToServer = (data) => {
        let self = this;
        const endpoint = `/api/v1/users/details/${this.props.match.params.id}`;
        Axios.post(endpoint, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                self.getData();
                toast.success(this.props.t(this.props.language?.layout?.toast54_nt));
            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));
            });
    };

    updateToServer = (data, id) => {
        self = this;
        const endpoint = `/api/v1/users/details/${id}`;
        this.setState({ work_modal: false });
        Axios.put(endpoint, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                self.getData();
                toast.success(this.props.t(this.props.language?.layout?.toast54_nt));
            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));
            });
    };

    updateName = (key, value) => {
        // console.log(key,value)
        let user = this.state.user;
        user[key] = value;
        this.setState({ user });
    };

    setWrapperRef(node) {
        this.node = node;
    }
    noteHandler = (data) => {
        Axios.post(
            `/api/v1/recruiter/user/${this.props.match.params.id}/notes`,
            {
                note_text: data,
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
        )
            .then((response) => {
                //  console.log(response.data.data)
                this.notes();
                toast.success(this.props.t(this.props.language?.layout?.toast55_nt));
            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));
            });
    };
    show = () => {
        this.setState({ showMore: !this.state.showMore });
        this.state.showMore
            ? this.setState({ description: this.state.user.about_me })
            : this.setState({ description: truncate(this.state.user.about_me, 350) });
    };

    saveProfileDetails = (data, id) => {
        // console.log(data, "  in save profile ", id);
        self = this;
        const endpoint = `/api/v1/users/profile/${id}`;
        this.setState({ edit_item: null, show_profile: !this.state.user.show_profile });
        Axios.put(endpoint, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                self.getData();
                toast.success(this.props.t(this.props.language?.layout?.toast54_nt));
            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));
            });
    };

    validateUserName = (e) => {
        if (JSON.stringify(this.state.user) !== JSON.stringify(this.state.initialUserData)) {
            this.setState({ user: JSON.parse(JSON.stringify(this.state.initialUserData)) });
        }
        this.setState({ edit_item: null });
    };
    //   };
    resumeUploadAfter = () => {
        this.setState({ loading: true });
        setTimeout(() => this.resumeUploadAfterGetData(), 5000);
    };
    resumeUploadAfterGetData = () => {
        window.location.reload();
        this.setState({ uploadCheck: false });
    };
    resumeRecheck = () => {
        this.setState({ confirmResumeUpload: true });
        this.setState({ uploadResumeRecheck: false });
        this.checkUpload(this.state.resumeFileadded);
    };
    closeResumeCheck = () => {
        this.setState({ uploadResumeRecheck: false, fileModal: false });
    };
    onUploadHandlerUppy = (e) => {
        if (this.state.user.resume_parsed && this.state.confirmResumeUpload === false) {
            this.setState({ resumeFileadded: e, uploadResumeRecheck: true });
            return;
        } else {
            this.checkUpload(e);
        }
    };
    checkUpload = (data) => {
        this.setState({ uploadCheck: true });
        // console.log(data, "daaaaa");
        let fileData = data[0];
        const formData = new FormData();
        formData.append("resume_file", fileData);
        Axios.put(`/api/v1/uploadresume/${this.props.match.params.id}`, formData, {
            headers: {
                "Content-Type": "application/pdf",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                this.getData();
                toast.success(this.props.t(this.props.language?.layout?.toast56_nt));
                this.setState({ fileModal: false })
            })
            .catch((error) => {
                this.setState({ fileModal: false })
                if (error.response.data.resume_file !== undefined) {
                    toast.error(error.response.data.resume_file[0]);
                } else {
                    toast.error(this.props.t(this.props.language?.layout?.toast53_nt));
                }
            });
        this.resumeUploadAfter();
    };
    // updateMessageData = (subject, body) => {
    updateMessageData = (body) => {
        let message_data = {
            body: body,
            subject: "subject",
            recruiter: this.props.user.user_id,
            user: this.props.match.params.id,
            message_type: "candidate_message",
            is_read: 0,
            is_user: this.props.user.is_user,
            application: null,
        };
        Axios.post(`/api/v1/recruiter/user/${this.props.match.params.id}/message`, message_data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                this.getData();
                toast.success(this.props.t(this.props.language?.layout?.toast51_nt));
            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));
            });
        // console.log("came in here")
    };

    changeImageUploadingStatus = (status) => {
        this.setState({ isImageUploading: status });
    };

    setStateDeleteConfirmModal = (_key, status) => {
        _key === "work_delete_confirm_modal" && this.setState({ work_delete_confirm_modal: status });
        _key === "education_delete_confirm_modal" && this.setState({ education_delete_confirm_modal: status });
        _key === "certificate_delete_confirm_modal" && this.setState({ certificate_delete_confirm_modal: status });
        _key === "accomplishiment_delete_confirm_modal" &&
            this.setState({ accomplishiment_delete_confirm_modal: status });
    };

    unArchiveUser = () => {
        const data = {
            candidate_ids: [this.props.match.params.id]
        }
        Axios
            .post(`/api/v1/recruiter/candidates/archive`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
            })
            .then((response) => {
                if(response.status === 200){
                    toast.success(this.props.t(this.props.language?.layout?.toast57_nt));
                    setTimeout(() => ( window.location.href = "/jobSeekers"), 5000);
                }
            })
            .catch((err) => {
                if(err){
                    toast.error(this.props.t(this.props.language?.layout?.toast58_nt));
                }
            });
    };

     deleteJobSeeker = () => {
        const data = {
            candidate_ids: [this.props.match.params.id]
        }
        Axios
            .delete(`/api/v1/recruiter/candidates/archive`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}`}, data 
            })
            .then((response) => {
                if(response.status === 200){
                    toast.success(t(props.language?.layout?.unarchived_toast_nt));
                    setTimeout(() => ( window.location.href = "/jobSeekers"), 5000);
                }
            })
            .catch((err) => {
                if(err){
                    toast.error(this.props.t(this.props.language?.layout?.toast58_nt));
                }
            });
    };

    downloadResume = () => {
        let id = {
            user: this.props.match.params.id
        }
         Axios.post("api/v1/users/resume-download-log", id, {
             headers: {
                 Authorization: `Bearer ${localStorage.getItem("access_token")}`,
             },
         }).then((response) => {
         })
         .catch((error) => {
            toast.error("Somthing went wrong.");
        });
     };

    render() {
        const { t } = this.props;
        return (
            <div className="col-md-10 px-0">
                <div class="container-fluid">
                    <div class="row align-items-center gray-100 pt-3 px-3">
                        <div class="col-md-8 my-2 p-0">
                            <div class=" icon-invert d-flex align-items-center">
                                <h2>
                                    <Link className="text-muted" to={`/jobSeekers`}>
                                        {t(this.props.language?.layout?.ep_jobseeker_all)}
                                    </Link>
                                    <img
                                        src="/svgs/icons_new/chevron-right.svg"
                                        alt="Right Arrow"
                                        class="svg-sm mx-1"
                                    />
                                    <span className="text-dark"> {t(this.props.language?.layout?.ep_jobseeker_view)}</span>
                                </h2>
                            </div>
                        </div>
                        {/* <div class="col-md-4 my-2 px-md-0 text-right">
                            <button class="btn btn-sm prev-candidate-btn disabled mr-2">
                                <img src="/svgs/icons_new/chevron-left.svg" class="svg-sm mb-0" /> Prev Candidate
                            </button>
                            <button class="btn btn-sm prev-candidate-btn disabled ml-2">
                                Next Candidate <img src="/svgs/icons_new/chevron-right.svg" alt="Right Arrow" class="svg-sm mb-0" />
                            </button>
                        </div> */}
                    </div>

                    <ProfileHeader
                        candidate={true}
                        user={this.state.user}
                        getData={this.getData}
                        setWrapperRef={this.setWrapperRef}
                        saveProfileDetails={this.saveProfileDetails}
                        availability_id={this.state.user.availability_id}
                        userImage={this.state.user.image}
                        changeImageUploadingStatus={this.changeImageUploadingStatus}
                        deleteJobSeeker={this.deleteJobSeeker}
                        archive={this.state.archived}
                        unArchiveUser={this.unArchiveUser}
                    />

                    <Modal
                        show={this.state.fileModal}
                        onHide={() => this.setState({ fileModal: false })}
                        size={"lg"}
                        centered>
                        <div className="modal-content">
                            <div className="modal-header px-4">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                {t(this.props.language?.layout?.js_upload_nt)}
                                </h5>
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title={t(this.props.language?.layout?.all_close_nt)}
                                    onClick={() => this.setState({ fileModal: false })}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-7">
                                        <ResumeDrop filesdata={this.onUploadHandlerUppy} />
                                    </div>
                                    <div className="col-md-5">
                                        <div className="vl">
                                            <div className="suportfile ml-3">
                                                <p> {t(this.props.language?.layout?.js_supportedfile_nt)} : <span className="pdf_Doc">PDF {t(this.props.language?.layout?.all_or_nt)} Doc</span></p> 
                                                <ul>
                                                    <li> {t(this.props.language?.layout?.js_uploadinstruction1_nt)}</li> 
                                                    <li> {t(this.props.language?.layout?.js_uploadinstruction2_nt)} : 2MB</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer py-3 px-4">
                                <div className="mx-auto">
                                    {this.state.uploadCheck === false ? (
                                        ""
                                    ) : (
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal>
                    {/* ) : (
                        ""
                    )} */}
                    <div class="d-md-flex mt-4rem candidate-profile-mt">
                        <div class="col-md-3 pr-lg-4 pr-md-2">
                            <div class="shadow-sm d-print-none mb-3">
                                <ResumeScore
                                    resumeFile={this.state.resume_file}
                                    updated={this.state.updated_at}
                                    // isPreviewMode={this.state.isPreviewMode}
                                    // seePreview={this.seePreview}
                                    // show_profile={this.state.user.show_profile}
                                    resume_data={this.state.resume_data}
                                    loading={this.state.loading}
                                    resume_parsed={this.state.user.resume_parsed}
                                    // saveProfileDetails={this.saveProfileDetails}
                                    // availability_id={this.state.user.availability_id}
                                    // resumeupload={this.uploadResume}
                                    candidateProfile={true}
                                />
                                {this.state.resume_file !== null && this.state.resume_file ? (

                                    <div class="border rounded p-3 mt-2">
                                        <div class="text-muted d-flex justify-content-between mb-4">
                                            <h5>{t(this.props.language?.layout?.sp_viewseeker_addeddocuments)}</h5>
                                        </div>
                                        <div class="row mb-3 d-flex justify-content-between">
                                            <div class="col-10">
                                                <a
                                                    data-toggle="modal"
                                                    // onClick={() => setShowModal(true)}
                                                    data-target="#myModal"
                                                    class="mb-1 text-dark text-decoration-none small pointer-content d-flex align-items-start text-break">
                                                    <img
                                                        src="/svgs/icons_new/file.svg"
                                                        class="svg-sm mb-2 mr-2"
                                                        alt="file"
                                                    />
                                                    {truncate(this.state.resume_file, 25)}
                                                </a>
                                            </div>
                                            <div class="col-2 px-0">
                                                <a
                                                    href={"/media/resume/" + this.state.resume_file}
                                                    download
                                                    onClick={this.downloadResume}
                                                    class="icon-invert text-dark mb-0">
                                                    <img
                                                        src="/svgs/icons_new/download.svg"
                                                        alt="download"
                                                        class="svg-sm mr-2 mb-2 candidate-download-icon"
                                                    />
                                                </a>
                                                {/* <a href={this.props.src} download>{this.props.children}</a> */}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <button
                                                className="btn btn-primary my-3"
                                                onClick={() => this.setState({ fileModal: true })}>
                                                {t(this.props.language?.layout?.ep_setting_bd_upload)}{" "}
                                                <img
                                                    src="/svgs/icons_new/upload.svg"
                                                    alt="upload"
                                                    className="invert-color ml-3"
                                                />{" "}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border rounded p-lg-3 p-md-2 p-3">
                                        <div className="mb-4">
                                            <h5 className="text-dark">{t(this.props.language?.layout?.sp_viewseeker_adddocuments)}</h5>
                                        </div>
                                        <div class="text-center">
                                            {/*  <h6 className="text-center">No resume</h6> */}
                                            <h6 className="py-5">{t(this.props.language?.layout?.sp_viewseeker_noresume)}</h6>
                                            {/* <ResumeDrop filesdata={this.onUploadHandlerUppy} /> */}
                                        </div>
                                        <div className="text-center">
                                            <button
                                                className="btn btn-primary my-3"
                                                onClick={() => this.setState({ fileModal: true })}>
                                                 {t(this.props.language?.layout?.ep_setting_bd_upload)}{" "}
                                                <img
                                                    src="/svgs/icons_new/upload.svg"
                                                    className="invert-color ml-3"
                                                    alt="upload"
                                                />{" "}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div className="border rounded shadow-sm mb-3 px-3">
                                <Tabs
                                    defaultActiveKey="Profile"
                                    id="uncontrolled-tab-example"
                                    className="nav-underline-primary">
                                    <Tab eventKey="Profile" title={t(this.props.language?.layout?.seeker_profile)}>
                                        <div class="container-fluid px-md-0 mt-3">
                                            <div class="d-flex justify-content-between ">
                                                <h3 class="flex-fill">{t(this.props.language?.layout?.js_about_nt)} </h3>
                                                {this.state.edit_item !== "aboutme" && this.state.description ? (
                                                    <a
                                                        tabIndex="0"
                                                        type="button"
                                                        className="btn buttonFocus text-primary d-print-none mt-n1 pr-0"
                                                        data-target="#toggle"
                                                        onClick={() => this.setState({ edit_item: "aboutme" })}>
                                                        {t(this.props.language?.layout?.sp_viewseeker_addabout)}
                                                    </a>
                                                ) : null}
                                            </div>
                                            <hr className="mt-1" />
                                            <div className="col-md-12 px-md-0">
                                                <div className="position-relative p-0" style={{ bottom: "54px" }}>
                                                    {this.state.edit_item === "aboutme" && (
                                                        <div className="" ref={this.setWrapperRef}>
                                                            <div className="text-right">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-secondary py-0 mr-2"
                                                                    onClick={(e) => this.validateUserName(e)}>
                                                                    {/* <img
                                                                    src="/svgs/icons_new/x-circle.svg"
                                                                    className="svg-xs svg-gray"
                                                                    title="Close"
                                                                /> */}
                                                                    {t(this.props.language?.layout?.sp_adddetails_cancel)}
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary py-0"
                                                                    onClick={(id) =>
                                                                        this.saveProfileDetails(
                                                                            { aboutme: this.state.user },
                                                                            this.state.user.id
                                                                        )
                                                                    }>
                                                                    {/* <img
                                                                    src="/svgs/icons_new/check-circle.svg"
                                                                    className="svg-xs"
                                                                    title="Save"
                                                                /> */}
                                                                    {t(this.props.language?.layout?.ep_setting_cd_save)}
                                                                </button>
                                                            </div>
                                                            <textarea
                                                                type="text"
                                                                className="form-control text-muted border border-dark rounded-0 mytextarea mt-4"
                                                                rows="4"
                                                                placeholder= {t(this.props.language?.layout?.jssummary_nt)}
                                                                name="aboutme"
                                                                defaultValue={
                                                                    this.state.user.about_me === null
                                                                        ? ""
                                                                        : this.state.user.about_me
                                                                }
                                                                onChange={(e) =>
                                                                    this.updateName("about_me", e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {this.state.edit_item !== "aboutme" && (
                                                <div className="d-flex">
                                                    <p className="text-muted text-justify ">
                                                        {this.state.description ? (
                                                            this.state.description
                                                        ) : (
                                                            <div className="text-muted">
                                                                {t(this.props.language?.layout?.sp_viewseeker_nodetails)}
                                                                <a
                                                                    tabIndex="0"
                                                                    type="button"
                                                                    className="btn buttonFocus text-primary d-print-none mt-n1 ml-2"
                                                                    data-target="#toggle"
                                                                    onClick={() =>
                                                                        this.setState({ edit_item: "aboutme" })
                                                                    }>
                                                                    {t(this.props.language?.layout?.sp_viewseeker_addabout)}
                                                                </a>
                                                            </div>
                                                        )}
                                                        {this.state.description && this.state.showMoreCheck ? (
                                                            this.state.showMore ? (
                                                                <div
                                                                    tabIndex="0"
                                                                    className="text-right text-primary mt-n3 pointer"
                                                                    onClick={() => this.show()}>
                                                                    <a type="button" tabIndex="0" class="btn buttonFocus text-primary py-1 d-print-none">more</a>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    tabIndex="0"
                                                                    className="text-right text-primary mt-n1 pointer"
                                                                    onClick={() => this.show()}>
                                                                    <a type="button" tabIndex="0" class="btn buttonFocus text-primary py-1 d-print-none">Show less</a>

                                                                </div>
                                                            )
                                                        ) : null}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="container-fluid px-md-0">
                                            <div className="row">
                                                <div className="col-md-12 mb-2">
                                                    <AdminSkills
                                                        skills={this.state.skill}
                                                        addToServer={this.addToServer}
                                                        delete={this.delete}
                                                    />
                                                </div>
                                                <div className="col-md-12 mt-2">
                                                    <Certification
                                                        delete_confirm_modal={
                                                            this.state.certificate_delete_confirm_modal
                                                        }
                                                        setStateDeleteConfirmModal={this.setStateDeleteConfirmModal}
                                                        certification={this.state.certificate}
                                                        addToServer={this.addToServer}
                                                        updateToServer={this.updateToServer}
                                                        delete={this.delete}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <Work
                                                        delete_confirm_modal={this.state.work_delete_confirm_modal}
                                                        setStateDeleteConfirmModal={this.setStateDeleteConfirmModal}
                                                        work={this.state.work}
                                                        getData={this.getData}
                                                        addToServer={this.addToServer}
                                                        updateToServer={this.updateToServer}
                                                        delete={this.delete}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <Education
                                                        delete_confirm_modal={this.state.education_delete_confirm_modal}
                                                        setStateDeleteConfirmModal={this.setStateDeleteConfirmModal}
                                                        education={this.state.education}
                                                        getData={this.getData}
                                                        addToServer={this.addToServer}
                                                        updateToServer={this.updateToServer}
                                                        delete={this.delete}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="Message" title= {t(this.props.language?.layout?.all_msg)}>
                                        <AdminMessages
                                            messageData={this.state.message}
                                            updateMessageData={this.updateMessageData}
                                        />
                                    </Tab>
                                    <Tab eventKey="otherappliedjobs" title= {t(this.props.language?.layout?.js_dashboard_appliedj)}>
                                        <OtherAppliedJobs id={this.props.match.params.id} candidate={true} />
                                    </Tab>
                                    {/* <Tab eventKey="similarCandidates" title="Similar Candidates">
                                        <SimilarCandidates  appId={this.props.match.params.id}/>
                                    </Tab> */}
                                </Tabs>
                            </div >
                        </div >
                        <div class="col-md-3 pl-lg-4 pl-md-2">
                            <Notes
                                job_details={this.state.job_details}
                                noteHandler={this.noteHandler}
                                noApplicationStatus={true}
                            />
                        </div>
                    </div >
                    <Modal
                        size="sm"
                        show={this.state.uploadResumeRecheck}
                        onHide={() => this.setState({ uploadResumeRecheck: false })}>
                        <div className="modal-content p-3 border-0">
                            <div className="modal-header border-0 p-0">
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title={t(this.props.language?.layout?.all_close_nt)}
                                    onClick={() => this.setState({ uploadResumeRecheck: false })}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                <p>
                                {t(this.props.language?.layout?.js_uploadinfo1_nt)} {" "} 
                                </p>
                                <p>{t(this.props.language?.layout?.profile_note_nt)} - {t(this.props.language?.layout?.js_uploadinfo2_nt)}</p> 
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <button
                                            className="btn btn-outline-secondary btn-block"
                                            onClick={() => this.closeResumeCheck()}>
                                            {t(this.props.language?.layout?.no_nt)}
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <button
                                            className="btn btn-primary btn-block"
                                            onClick={() => this.resumeRecheck()}>
                                            {t(this.props.language?.layout?.all_yes_nt)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <DeleteConfirmation
                        delete_confirm_modal={this.state.img_delete_confirm_modal}
                        delete={this.deleteImage}
                    />
                </div >
            </div >
        );
    }
}
function mapStateToProps(state) {
    return {
        user: state.authInfo.user,
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(withTranslation()(UserProfile));
