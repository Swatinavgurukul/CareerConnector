import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Axios from "axios";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { format } from "date-fns";
import axios from "axios";
import TimezoneSelect from "react-timezone-select";
import { withTranslation } from 'react-i18next';

class ScheduleInterview extends Component {
    msg = `${this.props.t(this.props.language?.layout?.interview_invite_nt)}<p><br> <br></p> ${this.props.t(this.props.language?.layout?.interview_invite1_nt)}`;
    constructor(props) {
        super(props);
        this.state = {
            resume: "",
            message: this.msg,
            onchangeText: "",
            subject: "",
            setTimeHours: "",
            duration: "",
            interviewAddress: "",
            interviewTimezone: "",
            timezoneText: [],
            emailSubject: "",
        };
    }
    setDateTime = () => {
        const data = Date.now();
        this.setState({ setTimeHours: data });
    };
    componentDidMount() {
        this.setDateTime();
        // this.timezoneHandler();
    }
    componentDidUpdate(preProps) {
        // console.log("this.props.userData update out : ", this.props.userData ? "hi" : "hello");
        if (this.props.userData && this.props.userData.job_title !== preProps.userData.job_title) {
            // console.log("this.props.userData update in : ", this.props.userData);
            // [Company_name] Interview for [Job_title] role
            // this.setState({ emailSubject: this.props.userData.employer_partners +" Interview for - " + this.props.userData.job_title + " role " });
            this.setState({ emailSubject: this.props.userData.employer_partners + " Interview for " + this.props.userData.job_title + " role " });
            // + this.props.userData.first_name || "" + " | " + this.props.userData.last_name || ""
        }
    }
    fileUpload = (data) => {
        var fileData = data[0];
        this.setState({ resume: fileData });
    };

    interviewHandler = () => {
        let formData = new FormData();
        formData.append("interview_date", format(this.state.setTimeHours, "yyyy-MM-dd"));
        formData.append("interview_time", format(this.state.setTimeHours, "HH:mm:ss.uuuuuu"));
        formData.append("interviewer", this.props.user.user_id);
        formData.append("candidate", this.props.userData.user_id);
        formData.append("email_to", this.props.userData.email);
        formData.append("duration", this.state.duration);
        formData.append("interview_address", this.state.interviewAddress);
        formData.append("is_scheduled", true);
        formData.append("application", this.props.userData.id);
        formData.append("interview_timezone", this.state.interviewTimezone);

        formData.append(
            "email_subject", this.state.emailSubject
            // this.state.onchangeText == ""
            //     ? "Interview Scheduled - " +
            //           this.props.userData.this.state.job_title || "" +
            //           " | " +
            //           this.props.userData.first_name +
            //           " " +
            //           (this.props.userData.last_name !== null ? this.props.userData.last_name : "")
            //     : this.state.onchangeText
        );
        // let result = this.state.message.replace(/(<([^>]+)>)/gi, "\n");
        let result = this.state.message.replace(/<(?!br\s*\/?)[^>]+>/g, '\n');
        formData.append("email_body", result);

        Axios.post(`api/v1/recruiter/schedule_interview`, formData, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                toast.success(this.props.t(this.props.language?.layout?.toast27_nt));
                if (response.data.status === 201) {
                    this.props.updateStatus("interview", this.props.userData.id);
                }
            })
            .catch((error) => {
                toast.error(this.props.t(this.props.language?.layout?.toast28_nt));
            });
    };
    // timezoneHandler = () => {
    //     axios
    //         .get("api/v1/recruiter/get/timezone", {
    //             headers: { Authorization: `Bearer ${this.props.userToken}` },
    //         })
    //         .then((response) => {
    //             this.setState({ timezoneText: response.data.data != null ? response.data.data : null });
    //             closeHandler();
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };
    modules = {
        toolbar: [
            [{ align: "right" }, { align: "center" }],
            ["bold", "italic", "underline"],
        ],
    };
    formats = [
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "align",
    ];
    closeHandler = () => {
        this.setState({ duration: "", interviewAddress: "", interviewTimezone: "" });
        this.props.closeModal("closeScheduleInterview");
    };
    onSubmit = () => {

        if (this.state.emailSubject === "") {
            toast.error(this.props.t(this.props.language?.layout?.toast22_nt));
            return;
        }
        if (this.state.message === "") {
            toast.error(this.props.t(this.props.language?.layout?.toast23_nt));
            return;
        }
        if (this.state.setTimeHours === "") {
            toast.error(this.props.t(this.props.language?.layout?.toast24_nt));
            return;
        }
        if (this.state.interviewTimezone === "") {
            toast.error(this.props.t(this.props.language?.layout?.toast25_nt));
            return;
        }
        if (this.state.duration === "") {
            toast.error(this.props.t(this.props.language?.layout?.toast26_nt));
            return;
        }

        this.interviewHandler();
        this.closeHandler();
    };
    render() {
        const { t } = this.props;
        return (
            <div>
                <Modal size={"lg"} show={this.props.openModel} onHide={() => this.closeHandler()}>
                    <div className="mb-4">
                        <div className="modal-content p-3 border-0">
                            <div className="modal-header border-0 p-0">
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title= {t(this.props.language?.layout?.all_close_nt)}
                                    onClick={() => this.closeHandler()}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="form-group animated ">
                                <label class="form-label-active text-muted"> {t(this.props.language?.layout?.interview_subject_nt)}</label>
                                <input
                                    class="form-control"
                                    placeholder={t(this.props.language?.layout?.interview_entersubject_nt)}
                                    value={this.state.emailSubject}
                                    // value={
                                    //     "Interview Scheduled - " +
                                    //     this.state.emailSubject.job_title +
                                    //     " | " +
                                    //     this.state.emailSubject.first_name +
                                    //     " " +
                                    //     (this.state.emailSubject.last_name !== null
                                    //         ? this.state.emailSubject.last_name
                                    //         : "")
                                    // }
                                    onChange={(e) => this.setState({ emailSubject: e.target.value })}
                                />
                            </div>
                            <div class="form-group animated">
                                <label class="form-label-active text-muted">{t(this.props.language?.layout?.ep_message)} *</label>
                                <ReactQuill
                                    placeholder= {t(this.props.language?.layout?.msg_58)}
                                    theme="snow"
                                    modules={this.modules}
                                    formats={this.formats}
                                    value={this.state.message}
                                    onChange={(e) => this.setState({ message: e })}></ReactQuill>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-md-12">
                                    <div class="form-group animated">
                                        <label class="form-label-active react-datepicker-popper text-muted z-indexCustom" for="">
                                        {t(this.props.language?.layout?.interview_date_nt)} *
                                        </label>
                                        <DatePicker
                                            className="w-100"
                                            showTimeSelect
                                            selected={this.state.setTimeHours}
                                            className="form-control"
                                            placeholder="mm/yyyy "
                                            minDate={new Date()}
                                            onChange={(date) => this.setState({ setTimeHours: date })}
                                            timeIntervals={15}
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            placeholderText="yyyy-mm-dd"
                                        />
                                        <div class="d-flex justify-content-end mr-3">
                                            <div class="mt-n5 mb-4" style={{ zIndex: 1 }}>
                                                <img
                                                    src="/svgs/icons_new/calendar.svg"
                                                    alt="calendar"
                                                    class="svg-sm mt-3 mr-n2"
                                                    id="calendar"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div class="form-group animated input-group-focus">
                                        <label class="form-label-active z-index4 z-indexCustom text-muted">{t(this.props.language?.layout?.ep_interviews_timezone)} *</label>
                                        {/* <div class="form-group animated mt-4"> */}
                                        <TimezoneSelect
                                            value={this.state.interviewTimezone}
                                            onChange={(e) => this.setState({ interviewTimezone: e.value })}
                                        />
                                        {/* </div> */}
                                        {/* <select
                                            aria-label="timezone"
                                            className="form-control"
                                            name="timezone"
                                            onChange={(e) => this.setState({ interviewTimezone: e.target.value})}
                                            value={this.state.interviewTimezone}>
                                            <option selected="" className="d-none">
                                                Select
                                            </option>
                                            {this.state.timezoneText !== null &&
                                                this.state.timezoneText.map((option) => (
                                                    <option value={option.utc[0]}>{option.text}</option>
                                                ))}
                                        </select> */}
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-6">
                                    <div class="form-group animated">
                                        <label class="form-label-active text-muted z-indexCustom"> {t(this.props.language?.layout?.interview_duration_nt)} *</label>
                                        <select
                                            className="form-control"
                                            value={this.state.duration}
                                            onChange={(e) => this.setState({ duration: e.target.value })}>
                                            <option selected="" className="d-none">
                                            {t(this.props.language?.layout?.seeker_select)}
                                            </option>
                                            <option value="15">15 {t(this.props.language?.layout?.interview_mins_nt)}</option>
                                            <option value="30">30 {t(this.props.language?.layout?.interview_mins_nt)}</option>
                                            <option value="45">45 {t(this.props.language?.layout?.interview_mins_nt)}</option>
                                            <option value="60"> 1 {t(this.props.language?.layout?.interview_hour_nt)}</option>
                                            <option value="90">1 {t(this.props.language?.layout?.interview_hour_nt)} 30{t(this.props.language?.layout?.interview_mins_nt)}</option>
                                            <option value="120">2 {t(this.props.language?.layout?.interview_hours_nt)}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 pb-3">
                                    <div class="form-group animated">
                                        <label class="form-label-active text-muted ">{t(this.props.language?.layout?.ep_interviews_link)}</label>
                                        <input
                                            class="form-control"
                                            name="Interview address"
                                            autocomplete="off"
                                            value=""
                                            placeholder= {t(this.props.language?.layout?.ep_interviews_add)}
                                            value={this.state.interviewAddress}
                                            onChange={(e) => this.setState({ interviewAddress: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end my-3">
                                <button className="btn btn-primary ml-2" onClick={this.onSubmit}>
                                    {this.props.userData.is_scheduled ? t(this.props.language?.layout?.interview_reschedule_nt) : t(this.props.language?.layout?.interview_schedule_nt)}
                                </button>
                            </div>
                        </div>
                    </div>
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
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(withTranslation()(ScheduleInterview));
