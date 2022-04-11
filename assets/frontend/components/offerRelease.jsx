import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Axios from "axios";
import ReactQuill from "react-quill";
import { connect } from "react-redux";
import ResumeDrop from "../profile/components/resumeDropzone.jsx";
import { toast } from "react-toastify";
import UppyUploadFiles from "../recruiter/uppyUploadFile.jsx";
import { withTranslation } from 'react-i18next';

class OfferRelease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidateEmail: "",
            emailSubject: "",
            // emailBody: this.msg,
            attachedFile: "",
            onchangeText: "",
            emailSubjectInput: "",
            msg: ""
        };
    }

    componentDidUpdate(preProps) {
        // console.log("this.props.userData update out : ", this.props.userData ? "hi" : "hello");
        // console.log("this.props.userData",this.props.userData.job_title);
        if (this.props.userData && this.props.userData.job_title !== preProps.userData.job_title) {
            this.setState({
                emailSubjectInput:this.props.t(this.props.language?.layout?.greeting1_nt)  + this.props.userData.job_title + this.props.t(this.props.language?.layout?.greeting2_nt) + this.props.userData.employer_partners, msg:
                this.props.t(this.props.language?.layout?.greeting3_nt)
                    + this.props.userData.job_title +
                    `. ${this.props.t(this.props.language?.layout?.greeting4_nt)}<p><br></p> <br> ${this.props.t(this.props.language?.layout?.greeting5_nt)}<p><br></p> <br>  ${this.props.t(this.props.language?.layout?.greeting6_nt)} <br></p>`
            });
        }
    }
    offerReleaseHandler = () => {
        let result = this.state.msg.replace(/<(?!br\s*\/?)[^>]+>/g, '\n');
        let formData = new FormData();
        formData.append("email_to", this.props.userData.email);
        formData.append(
            "email_subject", this.state.emailSubjectInput
            // this.state.onchangeText == ""
            //     ? "Offer - " +
            //           this.props.userData.job_title +
            //           " | " +
            //           this.props.userData.first_name +
            //           " " +
            //           (this.props.userData.last_name !== null ? this.props.userData.last_name : "")
            //     : this.state.onchangeText
        );
        formData.append("email_body", result);
        formData.append("attachement", this.state.attachedFile);
        Axios.post(`api/v1/recruiter/send_offerletter`, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                toast.success(this.props.t(this.props.language?.layout?.toast120_nt));
            })
            .catch((error) => {
                toast.error(this.props.t(this.props.language?.layout?.toast121_nt));
            });
    };
    onUploadHandlerUppy = (data) => {
        let fileData = data[0];
        this.setState({ attachedFile: fileData });
    };
    setData = () => {
        let data = "Offer - " + this.props.userData.job_title + " | " + this.props.userData.username;
        this.setState({ emailSubject: data });
    };

    onSubmit = () => {

        if (this.state.emailSubjectInput === "") {
            toast.error(this.props.t(this.props.language?.layout?.toast122_nt));
            return;
        }

        if (this.state.msg === "") {
            toast.error(this.props.t(this.props.language?.layout?.toast123_nt));
            return;
        }
        if (this.state.attachedFile.size > 10000000) {
            toast.error(this.props.t(this.props.language?.layout?.toast124_nt));
            return;
        }

        this.offerReleaseHandler();
        this.props.closeModal("offerRelease");
        // }
    };
    render() {
        const { t } = this.props; 
        return (
            <div>
                <Modal size={"lg"} show={this.props.openModel} onHide={() => this.props.closeModal("offerRelease")}>
                    <Modal.Header className="pb-0 pl-4 border-0" closeButton>
                        <h5 className="modal-title mr-3" id="staticBackdropLabel">
                        {t(this.props.language?.layout?.olheading_nt)}
                        </h5>
                    </Modal.Header>
                    <Modal.Body className="pt-0 px-4">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group animated">
                                    <label className="form-label-active text-muted">{t(this.props.language?.layout?.canemail_nt)} *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.props.userData.email}
                                        required
                                        disabled
                                    // onChange={}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group animated">
                                    <label className="form-label-active text-muted">{t(this.props.language?.layout?.emailsub_nt)} *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            this.state.emailSubjectInput || ""
                                            // this.state.onchangeText == ""
                                            //     ? "Offer - " +
                                            //       this.props.userData.job_title +
                                            //       " | " +
                                            //       this.props.userData.first_name +
                                            //       " " +
                                            //       (this.props.userData.last_name !== null
                                            //           ? this.props.userData.last_name
                                            //           : "")
                                            //     : this.state.onchangeText
                                        }
                                        onChange={(e) => this.setState({ emailSubjectInput: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div class="form-group animated">
                                    <label class="form-label-active text-muted">{t(this.props.language?.layout?.emailbody_nt)} *</label>
                                    <ReactQuill
                                        placeholder={t(this.props.language?.layout?.entersomething_nt)}
                                        theme="snow"
                                        modules={this.modules}
                                        formats={this.formats}
                                        value={this.state.msg}
                                        onChange={(e) => this.setState({ msg: e })}></ReactQuill>
                                </div>
                            </div>
                        </div>
                        <div className="row pt-4">
                            <div className="col-md-12">
                                <ResumeDrop filesdata={this.onUploadHandlerUppy} />
                            </div>
                        </div>
                        {/* <div className="form-check custom-checkbox d-flex justify-content-start mb-0 mt-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="OfferSent"
                                name="OfferSent"
                            />
                            <label className="form-check-label" for="OfferSent"></label>
                            <span className="custom-checkbox-text stretched-link">
                                <p className="small">Offer sent via external channel</p>
                            </span>
                        </div> */}

                        <div className="row align-items-end">
                            <div className="col-md-12">
                                <div className="modal-footer mt-2 pl-0 pr-0 border-0">
                                    <div className="d-flex">
                                        {/* <div className="col-md-6">
                                            <button type="button" className="btn btn-outline-secondary btn-block">
                                                Cancel
                                            </button>
                                        </div> */}
                                        <div className="col-md-12">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-block"
                                                onClick={() => this.onSubmit()}>
                                                {t(this.props.language?.layout?.ep_jobtitle_send)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal
                    size="lg"
                // show={this.props.openModel} onHide={() => this.props.closeModal("closeoffer")}
                >
                    <Modal.Header className="pb-0 pl-4  border-0" closeButton>
                        <h5 className="modal-title mr-3" id="staticBackdropLabel">
                            Offer letter
                        </h5>
                        <div className="form-check custom-checkbox d-flex justify-content-end mb-0">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                // value={viaExternal}
                                id="OfferSent"
                                name="OfferSent"
                            // onChange={handleChangeViaExternal}
                            />
                            <label className="form-check-label" for="OfferSent"></label>
                            <span className="custom-checkbox-text stretched-link">
                                <p className="small">Offer sent via external channel</p>
                            </span>
                        </div>
                    </Modal.Header>
                    <Modal.Body className="mt-4">
                        <div className="row">
                            <div className="col-md-6">
                                <UppyUploadFiles />
                                {/* <Dashboard uppy={uppy} hideUploadButton={true} allowedFileTypes={["image/*"]} height="150px" /> */}
                            </div>
                            <div className="col-md-6">
                                <div className="float-right">
                                    <h5 className="pt-4 mb-0">Great!</h5>
                                    <small className="text-muted">Want to upload the offer letter here...</small>
                                    <div className="mt-4">
                                        <p className="font-weight-bold mb-0">Points to be considered</p>
                                        <small>For Supported File Type: PDF or Doc</small>
                                        <ul>
                                            <li>One file to be uploaded.</li>
                                            <li>Max file Size (per file) : 5 MB</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-end">
                            <div className="col-md-12">
                                <div className="modal-footer mt-2 pl-0 pr-0 border-0">
                                    <button type="button" className="btn btn-primary">
                                        No, I’m okay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        user: state.authInfo.user,
        userToken: state.authInfo.userToken,
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, {})(withTranslation()(OfferRelease));
