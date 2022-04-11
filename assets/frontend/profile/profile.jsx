import React, { Component } from "react";
import Axios from "axios";
import Education from "./components/education.jsx";
import Certification from "./components/certificates.jsx";
import Accomplishments from "./components/Accomplishments.jsx";
import Skills from "./components/skills.jsx";
import DeleteConfirmation from "./components/delete_confirmation.jsx";
import ResumeScore from "./components/resumeScore.jsx";
import Personal from "./components/personal_details.jsx";
import { truncate } from "../modules/helpers.jsx";
import Work from "./components/work.jsx";
import ReactDOM from "react-dom";
import SocialLinks from "./components/social_links.jsx";
import ReactCropper from "../components/image_cropper.jsx";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ProfileHeader from "./components/profile_header.jsx";
import UserProfileHeader from "./components/userProfileheader.jsx";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { _profileImage } from "../actions/actionsAuth.jsx";
const user_profile = {
    width: "10rem",
    height: "10rem",
};
// const default_user_object={}
class Profile extends Component {
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
            resume_data: {},
            resume_file: null,
            resume_bulkfile: [],
            updated_at: null,
            modalOpen: false,
            img_delete_confirm_modal: false,
            work_delete_confirm_modal: false,
            education_delete_confirm_modal: false,
            certificate_delete_confirm_modal: false,
            accomplishiment_delete_confirm_modal: false,
            isImageUploading: false,
            isPreviewMode: false,
            description: "",
            showMore: true,
            showMoreCheck: true,
            user_id: "",
            alignment: { education: 2, accomplishments: 4, work: 1, certification: 3 },
            dataConformation: false,
            checkAboutMe: "",
            uploadResumeRecheck: false,
            uploadbulkResumeRecheck: false,
            confirmResumeUpload: false,
            resumeFileadded: "",
            uploadbulkCheck: false,
            pdfData: "",
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.getData = this.getData.bind(this);
    }
    componentDidMount() {
        window.addEventListener("mousedown", this.clickHandler);
        this.getData();
    }
    isSubstr = (first, second) => {
        if (first.length > second.length) {
            return first.includes(second);
        }
        return second.includes(first);
    };
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

    setWrapperRef(node) {
        // console.log("wrapper ", node);
        // if(this.state.edit_item=== false ){
        this.node = node;
        // }
        // this.setState({ dataConformation: true });
        // console.log(this.state.edit_item, " edit ");
    }
    // updateName = (key, value) => {
    //     console.log("update only about")
    //     let user = this.state.user;
    //     user[key] = value;
    //     this.setState({ user });
    // };
    updateName = (key, value) => {
        // console.log(key,value)
        let user = {...this.state.user};
        user[key] = value;
        this.setState({ user });
    };
    getData = () => {
        let id_user = this.props.user.user_id;
        Axios.get(`/api/v1/users/details/${id_user}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                let incoming_data = response.data.data;
                // console.log("check inc ", incoming_data);
                // this.setState({ alignment: incoming_data.alignment });
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
            
                this.setState({
                    checkAboutMe: response.data.data.about_me,
                    user: { ...incoming_data },
                    isLoading: false,
                    initialUserData: { ...incoming_data },
                    resume_file: resume_file,
                    updated_at: updated_at,
                });
                this.props._profileImage(incoming_data.image);
                if (incoming_data.about_me && incoming_data.about_me.length > 350) {
                    this.setState({ description: truncate(incoming_data.about_me, 350), showMoreCheck: true });
                } else {
                    this.setState({ showMoreCheck: false, description: incoming_data.about_me });
                }

                this.formateResumeUpdatedDate();
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
                this.setState({ resume_data: incoming_data, isLoading: false });
            })
            .catch((error) => {
                if (error.status == 401) {
                    this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
        {
            process.env.CLIENT_NAME === "cc" &&
                Axios.get("api/v1/user/resumes", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                })
                    .then((response) => {
                        let incoming_data = response.data.data;
                        // let resume_file = response.data.data;
                        // let updated_at = response.data.data;

                        this.setState({
                            // checkAboutMe: response.data.data.about_me,
                            user: { ...incoming_data },
                            isLoading: false,
                            initialUserData: { ...incoming_data },
                            resume_bulkfile: incoming_data,
                            // updated_at: incoming_data,
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
        };
    }

    delete = (data, id) => {
        let self = this;
        const endpoint = `/api/v1/users/details/${id}`;
        Axios.delete(`/api/v1/users/details/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            data,
        })
            .then((response) => {
                self.getData();
                toast.success(this.props.t(this.props.language?.layout?.toast52_nt))
            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));
            });
    };

    addToServer = (data) => {
        // console.log(data);
        // console.log(data)
        let self = this;
        // const csrfToken = cookie.load("csrftoken");
        const endpoint = `/api/v1/users/details/${this.props.user.user_id}`;
        Axios.post(endpoint, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                self.getData();
                toast.success(this.props.t(this.props.language?.layout?.toast59_nt))
            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));
            });
    };

    updateToServer = (data, id) => {
        self = this;
        // console.log(id," in update profile ",data)
        // const csrfToken = cookie.load("csrftoken");
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
                toast.success(this.props.t(this.props.language?.layout?.toast59_nt))
            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));
            });
    };
    deleteImage = () => {
        // console.log("came into delete");
        self = this;
        const endpoint = `/api/v1/deleteimage/${this.state.user.id}`;
        Axios.delete(endpoint, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                self.getData();
                this.statusDeleteConfirmModal(false);
                toast.success(this.props.t(this.props.language?.layout?.toast60_nt))

            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));

            });
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
                  setTimeout(() => {
                    self.getData()
                  }, 1000);
                toast.success(this.props.t(this.props.language?.layout?.toast59_nt))
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

    resumeUploadAfterGetData = () => {
        window.location.reload();
        this.setState({ loading: false });
    };

    resumeUploadAfter = () => {
        this.setState({ loading: true });
        // console.log("in load");
        setTimeout(() => this.resumeUploadAfterGetData(), 15000);
    };

    isValidFileType = (fName) => {
        let extensionLists = ["pdf", "doc", "docx"];
        return extensionLists.indexOf(fName.split(".").pop()) > -1;
    };
    resumebulkRecheck = (e) => {
        // console.log("came into recheck")
        this.setState({ pdfData: e.target.files[0] });
        this.setState({ uploadbulkResumeRecheck: e.target.files[0] ? true : false });
        if (this.state.uploadbulkResumeRecheck == false) {
            e.target.value = null;
        }

    };

    checkUpload = (e) => {
        if (e?.target?.files[0] && !this.isValidFileType(e.target.files[0].name)) {
            toast.error("Please choose pdf or doc file");
            return;
        }
        if (e?.target?.files[0] && e.target.files[0].size > 1000000) {
            toast.error("File size should be less than 1MB");
            return;
        }

        if (process.env.CLIENT_NAME === "cc" && this.state.pdfData && !this.isValidFileType(this.state.pdfData.name)) {
            toast.error(this.props.t(this.props.language?.layout?.toast43_nt));
            return;
        }
        if (process.env.CLIENT_NAME === "cc" && this.state.pdfData && this.state.pdfData.size > 1000000) {
            toast.error(this.props.t(this.props.language?.layout?.toast61_nt));
            return;
        }
        this.resumeUploadAfter();
        let fileData = process.env.CLIENT_NAME === "cc" ? this.state.pdfData : e?.target?.files[0];
        const formData = new FormData();
        formData.append("resume_file", fileData);
        Axios.put(`/api/v1/uploadresume/${this.props.user.user_id}`, formData, {
            headers: {
                "Content-Type": "application/pdf",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                // this.setState({ uploadResumeRecheck: false })
                self = this;
                self.getData();
                toast.success(this.props.t(this.props.language?.layout?.toast56_nt));

            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
        // }

        // this.setState({ uploadbulkResumeRecheck: false });
    };

    uploadResume = (e) => {
        if (this.state.user.resume_parsed && this.state.confirmResumeUpload === false) {
            this.setState({ resumeFileadded: e, uploadResumeRecheck: true })
            return;
        }
        else {
            this.checkUpload(e)
        }
    }
    resumeRecheck = () => {
        // console.log("came into recheck")
        this.setState({ confirmResumeUpload: true,uploadResumeRecheck:false })
        //  console.log(this.state.resumeFileadded)
        this.checkUpload(this.state.resumeFileadded)
    }
    checkuploadPost = (e) => {
        if (this.state.pdfData && !this.isValidFileType(this.state.pdfData.name)) {
            toast.error("Please choose pdf or doc file");
            return;
        }
        if (this.state.pdfData && this.state.pdfData.size > 1000000) {
            toast.error("File size should be less than 1MB");
            return;
        }

        this.resumeUploadAfter();
        let fileData = this.state.pdfData;
        const formData = new FormData();
        formData.append("file", fileData);
        // console.log(fileData, "file");

        Axios.post("api/v1/user/resume_upload", formData, {
            headers: {
                "Content-Type": "application/pdf",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                // this.setState({ uploadbulkResumeRecheck: false });
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };
    checkHandler = (data) => {
        const formData = new FormData();

        formData.append("resume", data);

        Axios.put("api/v1/user/resumes", formData, {
            headers: {
                "Content-Type": "application/pdf",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                this.setState({ uploadResumeRecheck: false });

                this.getData();
                toast.success(response.data.message);
            })
            .catch((error) => {
                toast.error(error.response.data.detail || "No response from server.");
            });
    };
    resumeDeleteHandler = (data) => {
        Axios.delete("/api/v1/user/resumes", {
            data: { resume: data },
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })

            .then((response) => {
                this.getData();
                toast.success(response.data.message);
            })
            .catch((error) => {
                toast.error(error.response.data.detail || "No response from server.");
            });
    };

    closeModal = () => {
        this.setState({ modalOpen: false });
    };
    changeImageUploadingStatus = (status) => {
        this.setState({ isImageUploading: status });
    };
    seePreview = () => {
        this.setState({ isPreviewMode: !this.state.isPreviewMode });
    };
    setEditItem = (value) => {
        this.setState({ edit_item: value });
    };
    formateResumeUpdatedDate = () => {
        var updatedDate = new Date(this.state.updated_at).setHours(0, 0, 0, 0);
        var todayDate = new Date().setHours(0, 0, 0, 0);
        var formatedDate = format(updatedDate, "do LLL yyyy");
        updatedDate.valueOf() === todayDate.valueOf()
            ? this.setState({ updated_at: "Today" })
            : this.setState({ updated_at: formatedDate });
    };
    setStateDeleteConfirmModal = (_key, status) => {
        _key === "work_delete_confirm_modal" && this.setState({ work_delete_confirm_modal: status });
        _key === "education_delete_confirm_modal" && this.setState({ education_delete_confirm_modal: status });
        _key === "certificate_delete_confirm_modal" && this.setState({ certificate_delete_confirm_modal: status });
        _key === "accomplishiment_delete_confirm_modal" &&
            this.setState({ accomplishiment_delete_confirm_modal: status });
    };
    statusDeleteConfirmModal = (status) => {
        this.setState({ img_delete_confirm_modal: status });
    };

    show = () => {
        this.setState({ showMore: !this.state.showMore });
        this.state.showMore
            ? this.setState({ description: this.state.user.about_me })
            : this.setState({ description: truncate(this.state.user.about_me, 350) });
    };

    render() {
        const { t } = this.props;
        return (
            <div className="col px-0">
                {this.props.user.is_user ? (
                    <UserProfileHeader
                        profile="true"
                        setEditItem={this.setEditItem}
                        edit_item={this.state.edit_item}
                        user={this.state.user}
                        getData={this.getData}
                        isPreviewMode={this.state.isPreviewMode}
                        setWrapperRef={this.setWrapperRef}
                        updateName={this.updateName}
                        saveProfileDetails={this.saveProfileDetails}
                        validateUserName={this.validateUserName}
                        availability_id={this.state.user.availability_id}
                        userImage={this.state.user.image}
                        modalOpen={this.state.modalOpen}
                        statusDeleteConfirmModal={this.statusDeleteConfirmModal}
                        changeImageUploadingStatus={this.changeImageUploadingStatus}
                    />
                ) : (
                    <ProfileHeader
                        setEditItem={this.setEditItem}
                        edit_item={this.state.edit_item}
                        user={this.state.user}
                        getData={this.getData}
                        isPreviewMode={this.state.isPreviewMode}
                        setWrapperRef={this.setWrapperRef}
                        updateName={this.updateName}
                        saveProfileDetails={this.saveProfileDetails}
                        validateUserName={this.validateUserName}
                        availability_id={this.state.user.availability_id}
                        userImage={this.state.user.image}
                        modalOpen={this.state.modalOpen}
                        statusDeleteConfirmModal={this.statusDeleteConfirmModal}
                        changeImageUploadingStatus={this.changeImageUploadingStatus}
                    />
                )}
                <div className="container-fluid overflow-hidden userDetails userprofile-mt pt-2">
                    <div className="col-lg-10 mx-auto">
                        <div className="d-md-flex">
                            <div className="col-md-3 pr-lg-4 pr-md-0 p-0 d-print-none">
                                <div className="container-fluid">
                                    <div class="mt-3">
                                        <h3 class="ml-n2 h4">{t(this.props.language?.layout?.js_dashboard_skills)}</h3>
                                        {this.state.isPreviewMode === true && this.state.skill.length === 0 ? null : (
                                            <div class="border mx-n2 rounded row py-2 pl-2 pr-2">
                                                <Skills
                                                    isPreviewMode={this.state.isPreviewMode}
                                                    skills={this.state.skill}
                                                    addToServer={this.addToServer}
                                                    delete={this.delete}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 pt-3 px-md-4 p-0">
                                <div className="container-fluid px-md-0 p-0">
                                    <div className="d-flex justify-content-between ">
                                        <h3 class="flex-fill h4">
                                            {t(this.props.language?.layout?.js_profile_aboutme)}
                                        </h3>
                                        {!this.state.isPreviewMode &&
                                            this.state.edit_item !== "aboutme" &&
                                            this.state.description ? (
                                            <a
                                                tabIndex={0}
                                                type="button"
                                                className="btn buttonFocus text-primary d-print-none mt-n1 pr-0"
                                                data-target="#toggle"
                                                onClick={() => this.setState({ edit_item: "aboutme" })}>
                                                {t(this.props.language?.layout?.js_profile_addaboutme)}
                                            </a>
                                        ) : null}
                                    </div>
                                    <hr className="mt-1" />
                                    <div className="col-md-12">
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
                                                            {t(this.props.language?.layout?.js_notifications_cancel)}
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
                                                            {t(this.props.language?.layout?.ep_setting_cd_save)}{" "}
                                                        </button>
                                                    </div>
                                                    {this.state.edit_item === "aboutme" && (
                                                        <textarea
                                                            type="text"
                                                            className="input_profile form-control text-muted border border-dark rounded-0 mytextarea mt-4"
                                                            rows="4"
                                                            placeholder= {t(this.props.language?.layout?.js_profile_aboutme)}
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
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {this.state.edit_item !== "aboutme" && (
                                        <div className="d-flex">
                                            <p className="text-muted text-justify ">
                                                {/* {!this.state.isPreviewMode
                                                    ? this.state.description
                                                    : this.state.initialUserData.about_me} */}
                                                {this.state.description ? (
                                                    this.state.description
                                                ) : (
                                                    <div className="text-muted">
                                                        {t(this.props.language?.layout?.profile_nodetails_nt)}
                                                        <a
                                                            tabIndex="0"
                                                            type="button"
                                                            className={
                                                                "btn buttonFocus text-primary d-print-none mt-n1 ml-2 " +
                                                                (this.state.isPreviewMode ? "d-none" : "")
                                                            }
                                                            data-target="#toggle"
                                                            onClick={() => this.setState({ edit_item: "aboutme" })}>
                                                            {t(this.props.language?.layout?.js_profile_addaboutme)}
                                                        </a>
                                                    </div>
                                                )}
                                                {!this.state.isPreviewMode &&
                                                    this.state.description &&
                                                    this.state.showMoreCheck ? (
                                                    this.state.showMore ? (
                                                        <div className="text-right">
                                                            <a
                                                                tabIndex="0"
                                                                className="text-primary pointer text-decoration-none"
                                                                onClick={() => this.show()}>
                                                                {t(this.props.language?.layout?.all_showmore_nt)}
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div className="text-right">
                                                            <a
                                                                className="text-primary pointer text-decoration-none"
                                                                onClick={() => this.show()}>
                                                                {t(this.props.language?.layout?.all_showless_nt)}
                                                            </a>
                                                        </div>
                                                    )
                                                ) : null}
                                            </p>
                                        </div>
                                    )}

                                    {/* {this.state.edit_item !== "aboutme" && (
                                        <div className="d-flex">
                                            <p className="text-muted text-justify ">
                                                {!this.state.isPreviewMode
                                                    ? this.state.description
                                                    : this.state.initialUserData.about_me}
                                                {!this.state.isPreviewMode &&
                                                this.state.description &&
                                                this.state.showMoreCheck ? (
                                                    this.state.showMore ? (
                                                        <div
                                                            className="float-right pointer text-primary d-print-none"
                                                            onClick={() => this.show()}>
                                                            more
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="float-right pointer text-primary d-print-none"
                                                            onClick={() => this.show()}>
                                                            Show less
                                                        </div>
                                                    )
                                                ) : null}
                                            </p>
                                        </div>
                                    )} */}
                                </div>

                                <div className="d-none d-print-block">
                                    <div className="container-fluid">
                                        <h4 class="ml-n2">Skills </h4>
                                        <div class="mx-n2 rounded row py-2 pl-2 pr-2">
                                            <Skills
                                                isPreviewMode={this.state.isPreviewMode}
                                                skills={this.state.skill}
                                                addToServer={this.addToServer}
                                                delete={this.delete}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr className="d-none d-print-block mt-0" />
                                <div className="container-fluid px-md-0 p-0">
                                    <div className="row">
                                        <div className={"col-md-12 order-" + this.state.alignment.work}>
                                            <Work
                                                delete_confirm_modal={this.state.work_delete_confirm_modal}
                                                setStateDeleteConfirmModal={this.setStateDeleteConfirmModal}
                                                isPreviewMode={this.state.isPreviewMode}
                                                work={this.state.work}
                                                getData={this.getData}
                                                addToServer={this.addToServer}
                                                updateToServer={this.updateToServer}
                                                delete={this.delete}
                                            />
                                        </div>
                                        <div className={"col-md-12 order-" + this.state.alignment.education}>
                                            <Education
                                                delete_confirm_modal={this.state.education_delete_confirm_modal}
                                                setStateDeleteConfirmModal={this.setStateDeleteConfirmModal}
                                                isPreviewMode={this.state.isPreviewMode}
                                                education={this.state.education}
                                                getData={this.getData}
                                                addToServer={this.addToServer}
                                                updateToServer={this.updateToServer}
                                                delete={this.delete}
                                            />
                                        </div>
                                        <div className={"col-md-12 order-" + this.state.alignment.certification}>
                                            <Certification
                                                delete_confirm_modal={this.state.certificate_delete_confirm_modal}
                                                setStateDeleteConfirmModal={this.setStateDeleteConfirmModal}
                                                isPreviewMode={this.state.isPreviewMode}
                                                certification={this.state.certificate}
                                                addToServer={this.addToServer}
                                                updateToServer={this.updateToServer}
                                                delete={this.delete}
                                            />
                                        </div>
                                        <div className={"col-md-12 order-" + this.state.alignment.accomplishments}>
                                            <Accomplishments
                                                delete_confirm_modal={this.state.accomplishiment_delete_confirm_modal}
                                                setStateDeleteConfirmModal={this.setStateDeleteConfirmModal}
                                                isPreviewMode={this.state.isPreviewMode}
                                                achievement={this.state.achievement}
                                                addToServer={this.addToServer}
                                                updateToServer={this.updateToServer}
                                                delete={this.delete}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 pl-lg-4 pl-md-0 d-print-none mt-md-5 p-0">
                                {process.env.CLIENT_NAME === "cc" ?
                                    <ResumeScore
                                        resumebulkFile={this.state.resume_bulkfile}
                                        updated={this.state.updated_at}
                                        isPreviewMode={this.state.isPreviewMode}
                                        seePreview={this.seePreview}
                                        show_profile={this.state.user.show_profile}
                                        resume_data={this.state.resume_data}
                                        loading={this.state.loading}
                                        resume_parsed={this.state.user.resume_parsed}
                                        saveProfileDetails={this.saveProfileDetails}
                                        availability_id={this.state.user.availability_id}
                                        resumeupload={this.resumebulkRecheck}
                                        checkHandler={this.checkHandler}
                                        resumeDeleteHandler={this.resumeDeleteHandler}
                                    />
                                    :

                                    <ResumeScore
                                        resumeFile={this.state.resume_file}
                                        updated={this.state.updated_at}
                                        isPreviewMode={this.state.isPreviewMode}
                                        seePreview={this.seePreview}
                                        show_profile={this.state.user.show_profile}
                                        resume_data={this.state.resume_data}
                                        loading={this.state.loading}
                                        resume_parsed={this.state.user.resume_parsed}
                                        saveProfileDetails={this.saveProfileDetails}
                                        availability_id={this.state.user.availability_id}
                                        resumeupload={this.uploadResume}
                                    />
                                }


                            </div>
                        </div>
                    </div>
                    <Modal size="sm" show={this.state.dataConformation}>
                        <div className="modal-content p-3 border-0">
                            <div className="modal-header border-0 p-0">
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title={t(this.props.language?.layout?.all_close_nt)}
                                // onClick={() => props.statusDeleteConfirmModal(false)}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                <p> {t(this.props.language?.layout?.all_suredelete_nt)} </p>
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <button
                                            className="btn btn-outline-secondary btn-block"
                                            onClick={() => this.setState({ dataConformation: false })}>
                                            {t(this.props.language?.layout?.no_nt)}
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <button className="btn btn-primary btn-block">{t(this.props.language?.layout?.all_yes_nt)}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <Modal size="sm" show={this.state.uploadResumeRecheck} onHide={() => this.setState({ uploadResumeRecheck: false })}>
                        <div className="modal-content p-3 border-0">
                            <div className="modal-header border-0 p-0">

                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title={t(this.props.language?.layout?.all_close_nt)}
                                    onClick={() => this.setState({ uploadResumeRecheck: false })}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                <p>{t(this.props.language?.layout?.js_uploadinfo1_nt)}</p>
                                <p>{t(this.props.language?.layout?.profile_note_nt)} - {t(this.props.language?.layout?.js_uploadinfo2_nt)}</p>
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <button
                                            className="btn btn-outline-secondary btn-block"
                                            onClick={() => this.setState({ uploadResumeRecheck: false })}>
                                            {t(this.props.language?.layout?.no_nt)}
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <button className="btn btn-primary btn-block" onClick={() => this.resumeRecheck()}>{t(this.props.language?.layout?.all_yes_nt)}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        size="md"
                        show={this.state.uploadbulkResumeRecheck}
                        onHide={() => this.setState({ uploadbulkResumeRecheck: false, pdfData: "" })}>
                        <div className="modal-content p-3 border-0">
                            <div className="modal-header border-0 p-0">
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title= {t(this.props.language?.layout?.all_close_nt)}
                                    onClick={() => this.setState({ uploadbulkResumeRecheck: false, pdfData: "" })}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="d-flex">
                                    <div className="icon-invert pr-2 ">
                                        <img src="/svgs/icons_new/clock.svg" className="svg-sm " alt="file" />
                                    </div>
                                    <div>
                                        <h5>{!this.state.resume_bulkfile?.length ? "Upload Resume" : "Update Resume"}</h5>
                                    </div>
                                </div>
                                <div className="d-flex ml-4 pl-1 mt-3 mb-2 align-items-center">
                                    <div className="icon-invert pr-2 ">
                                        <img src="/svgs/icons_new/file.svg" className="svg-sm-1" alt="file" />
                                    </div>
                                    <div className="px-2">
                                        <p className="mb-0">
                                            {(this.state.pdfData && this.state.pdfData.name == undefined) ||
                                                (this.state.pdfData && this.state.pdfData.name == null)
                                                ? null
                                                : this.state.pdfData && this.state.pdfData.name}
                                        </p>
                                    </div>
                                </div>

                                <label class="btn ml-4 pl-2 mt-3 m-0 p-0">
                                    <div class="form-check custom-checkbox">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            id="defaultCheck1"
                                            checked={this.state.uploadbulkCheck}
                                            onChange={(e) => this.setState({ uploadbulkCheck: e.target.checked })}
                                        />
                                        <label class="form-check-label" for="defaultCheck1"></label>
                                        <span
                                            class={
                                                "custom-checkbox-text stretched-link ml-2 " +
                                                (this.state.uploadbulkCheck ? " text-success" : "")
                                            }>
                                            {!this.state.resume_bulkfile?.length ? "Upload my profile with this uploaded resume" : "Update my profile with this updated resume"}
                                        </span>
                                    </div>
                                </label>

                                <div className="text-right">
                                    <button
                                        className="btn btn-primary btn-md"
                                        onClick={() => {
                                            this.state.uploadbulkCheck ? this.checkUpload() : "";
                                            this.checkuploadPost();
                                            this.setState({ uploadbulkResumeRecheck: false });
                                        }}>
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <DeleteConfirmation
                        delete_confirm_modal={this.state.img_delete_confirm_modal}
                        statusDeleteConfirmModal={this.statusDeleteConfirmModal}
                        delete={this.deleteImage}
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    // console.log("state ", state);
    return {
        userToken: state.authInfo.userToken,
        refreshToken: state.authInfo.refreshToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        profileImage: state.authInfo.profileImage
    };
}

export default connect(mapStateToProps, {_profileImage})(withTranslation()(Profile));
