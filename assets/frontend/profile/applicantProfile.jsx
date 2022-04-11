import React, { Component } from "react";
import Axios from "axios";
import Education from "./components/education.jsx";
import Certification from "./components/certificates.jsx";
import Accomplishments from "./components/Accomplishments.jsx";
import { truncate } from "../modules/helpers.jsx";
import Work from "./components/work.jsx";
import Jobscore from "./components/jobScore.jsx";
import Notes from "./components/notes.jsx";
import ProfileHeader from "./components/profile_header.jsx";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminMessages from "./components/adminMessages.jsx";
import { connect } from "react-redux";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import OtherAppliedJobs from "./components/otherJobsApplied.jsx";
import AdminSkills from "./components/adminSkills.jsx";
import { withTranslation } from 'react-i18next';
import { jobstage } from "../../translations/helper_translation.jsx";

const user_profile = {
    width: "10rem",
    height: "10rem",
};
// const default_user_object={}
class ApplicantProfile extends Component {
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
            modalOpen: false,
            isPreviewMode: true,
            description: "",
            showMore: true,
            job_details: [],
            application_journey: {},
            status: "",
            message: [],
            answer: [],
        };

        this.getData = this.getData.bind(this);
    }
    componentDidMount() {
        this.getData();
        this.updateStatus();
        this.getStatus();
    }
    getData = () => {
        let id_user = this.props.location.state.user_id;
        // console.log(this.props.match.params," check propss ", this.props.location.state.jobscore)
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
                this.setState({
                    user: { ...incoming_data },
                    isLoading: false,
                    initialUserData: { ...incoming_data },
                    resume_file: resume_file,
                    updated_at: updated_at,
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
        Axios.get(`/api/v1/recruiter/applicants/${this.props.match.params.id}/notes`, {
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
        Axios.get(`api/v1/recruiter/application/${this.props.match.params.id}/journey`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                this.setState({ application_journey: response.data.data });
                // console.log("ressssssssssssss   ", response.data.data)
            })
            .catch((error) => {
                if (error.status == 401) {
                    this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
        Axios.get(`api/v1/recruiter/applicants/${this.props.match.params.id}/message`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                this.setState({ message: response.data.data });
                // console.log("ressssssssssssss   ", response.data.data)
            })
            .catch((error) => {
                console.log(error);
            });
    };
    jobStageHandler = (language, key) =>{
        return(jobstage[language][key]);
    }

    updateStatus = (value, id) => {
        if (!value) return;
        let obj = {
            current_status: value,
        };
        Axios.put(`api/v1/recruiter/application/${id}`, obj, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                this.getStatus();
                toast.success(`${this.props.t(this.props.language?.layout?.toast45_nt)} ${this.jobStageHandler(this.props?.languageName, value)}`);
            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));
            });
    };
    getStatus = () => {
        Axios.get(`api/v1/recruiter/applicants/status/${this.props.match.params.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }).then((response) => {
            this.setState({ status: response.data.data.current_status });
            this.setState({ answer: response.data.data.answer != null ? response.data.data.answer && JSON.parse(response.data.data?.answer) : null });
        });
    };

    noteHandler = (data) => {
        Axios.post(
            `/api/v1/recruiter/applicants/${this.props.match.params.id}/notes`,
            {
                note_text: data,
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
        )
            .then((response) => {
                //  console.log(response.data.data)
                this.getData();
                toast.success(this.props.t(this.props.language?.layout?.toast50_nt));
            })
            .catch((error) => {
                toast.error(error.response.data.detail || this.props.t(this.props.language?.layout?.toast53_nt));
            });
    };
    // updateMessageData = (subject, body) => {
    updateMessageData = (body) => {
        let message_data = {
            body: body,
            subject: "subject",
            recruiter: this.props.user.user_id,
            user: this.state.user.availability_id,
            message_type: "application_message",
            is_read: 0,
            is_user: this.props.user.is_user,
            application: this.props.match.params.id,
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
    };

    show = () => {
        this.setState({ showMore: !this.state.showMore });
        this.state.showMore
            ? this.setState({ description: this.state.user.about_me })
            : this.setState({ description: truncate(this.state.user.about_me, 350) });
    };

    downloadResume = () => {
        let id = {
            user: this.props.location.state.user_id
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
                            <div class="d-flex align-items-center icon-invert">
                                <h4>
                                    <Link to={`/${this.props.location.state.type}`} className="text-muted">
                                        {this.props.location.state.type === "applications"
                                            ?  t(this.props.language?.layout?.ep_jobtitle_applications)
                                            : this.props.location.state.type === "interview"
                                                ? t(this.props.language?.layout?.ep_allinterviews)
                                                : this.props.location.state.type === "jobs"
                                                    ? t(this.props.language?.layout?.ep_jobs_alljobs)
                                                    : t(this.props.language?.layout?.ep_alloffers)}
                                    </Link>
                                    <img
                                        src="/svgs/icons_new/chevron-right.svg"
                                        alt="Right Arrow"
                                        class="svg-sm mx-1 disabled"
                                    />
                                    <Link
                                        to={`/jobs/${this.props.location.state.slug}/applications`}
                                        className="text-muted">
                                        {this.props.location.state.title}
                                    </Link>
                                    <img
                                        src="/svgs/icons_new/chevron-right.svg"
                                        alt="Right Arrow"
                                        class="svg-sm mx-1"
                                    />
                                    <span className="text-dark">{t(this.props.language?.layout?.view_app)}</span>
                                </h4>
                            </div>
                        </div>
                        {/* <div class="col-4 my-2 text-right px-md-0">
                            <button class="btn btn-sm prev-candidate-btn disabled mr-2">
                                <img src="/svgs/icons_new/chevron-left.svg" class="svg-sm mb-0" /> Prev Application
                            </button>
                            <button class="btn btn-sm prev-candidate-btn disabled ml-2">
                                Next Application <img src="/svgs/icons_new/chevron-right.svg" alt="Right Arrow" class="svg-sm mb-0" />
                            </button>
                        </div> */}
                    </div>
                    <ProfileHeader
                        user={this.state.user}
                        jobscore={this.props.location.state.jobscore}
                        updateStatus={this.updateStatus}
                        applicationId={this.props.match.params.id}
                        status={this.state.status}
                    />
                    <div class="row px-3 mt-4rem app-profile-mt">
                        <div class="col-md-3 pr-lg-4 pr-md-2 p-0">
                            {this.props.location.state.jobscore !== null && this.props.location.state.jobscore ? (
                                <Jobscore
                                    job_details={this.state.job_details}
                                    jobscore={this.props.location.state.jobscore}
                                    weightedScore={this.props.location.state.weightedScore}
                                    totalScore={this.props.location.state.totalScore}
                                />
                            ) : (
                                <Jobscore
                                    job_details={this.state.job_details}
                                    jobscore={this.props.location.state.jobscore}
                                    weightedScore={this.props.location.state.weightedScore}
                                    totalScore={this.props.location.state.totalScore}
                                />
                            )}
                            <div class="shadow-sm d-print-none mb-3">
                                {this.state.resume_file !== null && this.state.resume_file ? (
                                    <div class="border rounded p-3">
                                        <div class="text-muted d-flex justify-content-between mb-4">
                                            <h5>{t(this.props.language?.layout?.sp_viewseeker_addeddocuments)}</h5>
                                        </div>
                                        {/* {this.state.user.is_active == false ? "" : */}
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
                                                        alt="download"
                                                        src="/svgs/icons_new/download.svg"
                                                        class="svg-sm mr-2 mb-2 candidate-download-icon"
                                                    />
                                                </a>
                                                {/* <a href={this.props.src} download>{this.props.children}</a> */}
                                            </div>
                                        </div>
                                        {/* } */}
                                    </div>
                                ) : (
                                    <div class="border rounded p-3">
                                        <div className="mb-4">
                                            <h5 className="text-dark">{t(this.props.language?.layout?.sp_viewseeker_adddocuments)}</h5>
                                        </div>
                                        <div class="text-center">
                                            <h6 className="text-center">{t(this.props.language?.layout?.sp_viewseeker_noresume)}</h6>
                                        </div>
                                    </div>
                                )
                                }
                            </div>
                                <div className="shadow-sm mb-3">
                                    <div class="border rounded p-3">
                                        <div className="text-muted d-flex justify-content-between mb-3">
                                            <h5>{t(this.props.language?.layout?.sq_nt)}</h5>
                                        </div>
                                        {!this.state?.answer?.length ?
                                            <div className="d-flex justify-content-center">{t(this.props.language?.layout?.nodata_nt)}</div>
                                            :
                                            <div className="mb-3">
                                                {this.state.answer && this.state.answer.map((i) => (
                                                    <div>
                                                        <p> {i.id === "legally_authorized" ? "Are you legally authorized to work in the country of job location?" :
                                                            "Will you now, or ever, require VISA sponsorship in order to work in the country of job location?"}</p>
                                                        <p className="font-weight-bold text-capitalize">{i.answer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        }
                                    </div>
                                </div>
                        </div>
                        <div class="col-md-6 border p-3 rounded shadow-sm">
                            <Tabs
                                defaultActiveKey="Profile"
                                id="uncontrolled-tab-example"
                                className="nav-underline-primary">
                                <Tab eventKey="Profile" title={t(this.props.language?.layout?.seeker_profile)}>
                                    <div class="container-fluid px-md-0 mt-3">
                                        <div class="d-flex justify-content-between ">
                                            <h4 class="flex-fill">{t(this.props.language?.layout?.js_about_nt)}</h4>
                                        </div>
                                    </div>
                                    <hr className="mt-1" />
                                    <div className="d-flex">
                                        <p className="text-muted text-justify ">
                                            {this.state.description ? (
                                                this.state.description
                                            ) : (
                                                <div className="text-muted">{t(this.props.language?.layout?.sp_viewseeker_nodetails)}</div>
                                            )}
                                            {this.state.description && this.state.showMoreCheck ? (
                                                this.state.showMore ? (
                                                    <div
                                                        className="text-right text-primary mt-n3 pointer"
                                                        onClick={() => this.show()}>
                                                        <a type="button" tabIndex="0" class="btn buttonFocus text-primary py-1 d-print-none">{t(this.props.language?.all_showmore_nt)}</a>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="text-right text-primary mt-n1 pointer"
                                                        onClick={() => this.show()}>
                                                        <a type="button" tabIndex="0" class="btn buttonFocus text-primary py-1 d-print-none">{t(this.props.language?.all_showless_nt)}</a>
                                                    </div>
                                                )
                                            ) : null}
                                        </p>
                                    </div>

                                    <div className="container-fluid px-md-0">
                                        <div className="row">
                                            <div className="col-md-12 mb-2">
                                                <AdminSkills
                                                    skills={this.state.skill}
                                                    fromApplication="false"
                                                // addToServer={this.addToServer}
                                                // delete={this.delete}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <Work
                                                    isPreviewMode={this.state.isPreviewMode}
                                                    isAdminMode={true}
                                                    work={this.state.work}
                                                    getData={this.getData}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <Education
                                                    isPreviewMode={this.state.isPreviewMode}
                                                    education={this.state.education}
                                                    getData={this.getData}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <Certification
                                                    isPreviewMode={this.state.isPreviewMode}
                                                    certification={this.state.certificate}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <Accomplishments
                                                    isPreviewMode={this.state.isPreviewMode}
                                                    achievement={this.state.achievement}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="Message" title={t(this.props.language?.layout?.all_msg)} >
                                    <AdminMessages
                                        messageData={this.state.message}
                                        updateMessageData={this.updateMessageData}
                                    />
                                </Tab>
                                <Tab eventKey="otherappliedjobs" title={t(this.props.language?.layout?.ep_jobseeker_otherjobs)}>
                                    <OtherAppliedJobs applicationId={this.props.match.params.id} />
                                </Tab>
                            </Tabs>
                        </div>
                        <div class="col-md-3 pl-lg-4 pl-md-2 p-0 mt-md-0 mt-3">
                            <Notes
                                job_details={this.state.job_details}
                                noteHandler={this.noteHandler}
                                application_journey={this.state.application_journey}
                            />
                        </div>
                    </div >
                </div >
            </div >
        );
    }
}
function mapStateToProps(state) {
    return {
        user: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}
export default connect(mapStateToProps, {})(withTranslation()(ApplicantProfile));
