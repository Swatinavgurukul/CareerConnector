import React, { Component } from "react";
// import { format, formatDistance, formatRelative, subDays } from "date-fns";
import Axios from "axios";
import Cards from "./cards.jsx";
import { Doughnut, Polar } from "react-chartjs-2";
import ReactHtmlParser from "react-html-parser";
import JobCard from "../../jobs/jobCard.jsx";
import { connect } from "react-redux";
import { interpolateColors, renderToLocaleDate, truncate } from "../../modules/helpers.jsx";
import { formatDistance, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { withTranslation } from 'react-i18next';

class UserDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resume_data: {},
            skills: [],
            recommendedJob: [],
            profileActivity: [],
            lessSkills: false,
            showHide: false,
            show: false,
            type: "",
            message: "",
        };
    }
    componentDidMount() {
        this.getData();
        this.recommendedJobs();
    }
    handleModalShowHide() {
        this.setState({ showHide: !this.state.showHide });
    }
    handleModalShow() {
        this.setState({ show: !this.state.show });
    }
    validation = () => {
        if (!this.state.type || !this.state.message) {
            toast.error (this.props.t(this.props.language?.layout?.msg_1)); 
            return;
        } else {
            this.submitData();
            this.reset();
        }
    };
    reset = () => {
        this.setState({ type: "" });
        this.setState({ message: "" });
        this.setState({ show: false });
        this.setState({ showHide: false });
    };

    submitData = () => {
        let formData = new FormData();
        formData.append("feedback_type", `Microsoft Career Connector - ${this.state.type}`);
        formData.append("description", this.state.message);
        formData.append("page", window.location.href);
        Axios.post("api/v1/feedback", formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                toast.success(this.props.t(this.props.language?.layout?.toast29_nt));
            })
            .catch((error) => {
                toast.error(this.props.t(this.props.language?.layout?.toast28_nt));
            });
    };
    recommendedJobs = () => {
        // console.log("recommended Jobs");
        let options = {};
        if (localStorage.getItem("access_token")) {
            options = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            };
        }
        Axios.get("/api/v1/jobs?page=1", options)
            .then((response) => {
                let result = response.data.data;
                // console.log("resilts.........................data.", result.data)
                this.setState(Object.assign({}, { ...this.state, recommendedJob: result.data }));
                if (!result || result.data.length == 0) {
                    // setIsJobAvailable(false);
                } else {
                    // setIsJobAvailable(true);
                    // setData(result.data);
                }
                // setLoading(false);
            })
            .catch((error) => {
                if (error) {
                    // setIsJobAvailable(false)
                    // setLoading(false);
                }
            });
    };
    getData = () => {
        // .....................Profile Activity................................................................
        Axios.get(`/api/v1/users/dashboard/activity`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                // console.log("response Profile activity : ",response.data.data)
                let incoming_data = response.data.data;
                let activityData = [];
                Object.values(incoming_data).forEach((e) => {
                    Object.entries(e).forEach(([k, v]) => {
                        if (k == "saved_job") {
                            v.forEach((job) => {
                                activityData.push({
                                    activity: `${t(this.props.language?.layout?.dashboard_msg_nt)} <strong>${job.job__title}</strong>.`,
                                    date: job.updated_at,
                                });
                            });
                        }
                        if (k == "applied_job") {
                            v.forEach((job) => {
                                activityData.push({
                                    activity: `${t(this.props.language?.layout?.dashboard_msg1_nt)} <strong>${job.job__title}</strong>.`,
                                    date: job.updated_at,
                                });
                            });
                        }
                        if (k == "resume_updated") {
                            v.forEach((job) => {
                                activityData.push({
                                    activity: t(this.props.language?.layout?.dashboard_msg2_nt),
                                    date: job.updated_at,
                                });
                            });
                        }
                        if (k == "profile_updated") {
                            v.forEach((job) => {
                                activityData.push({
                                    activity: t(this.props.language?.layout?.dashboard_msg1_nt),
                                    date: job.updated_at,
                                });
                            });
                        }
                    });
                });
                activityData.sort((a, b) => (a.date < b.date ? 1 : -1));
                this.setState(Object.assign({}, { ...this.state, profileActivity: activityData }));
            })
            .catch((error) => {
                if (error.status == 401) {
                    // this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
        // .....................Profile Activity................................................................
        const user_id = this.props.user.user_id;
        Axios.get(`/api/v1/users/details/${user_id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                let skillList = [];
                const skillName = response.data.data.skill.map((m) => m.skills);
                const totalSkills = skillName.length;
                const skillScore = skillName.map(() => Math.floor(Math.random() * 10));
                const skillColor = interpolateColors("rgb(9, 116, 168)", "rgb(151, 247, 237)", totalSkills).map(
                    (m) => `rgb(${m[0]}, ${m[1]}, ${m[2]})`
                );
                for (let i = 0; i < totalSkills; i++) {
                    skillList.push({
                        score: skillScore[i],
                        color: skillColor[skillScore[i] % totalSkills],
                        name: skillName[i],
                    });
                }
                this.setState(Object.assign({}, { ...this.state, skills: skillList }));
            })
            .catch((error) => {
                console.log(error);
            });
        // ---------------------------resume score n besise of skills--------------------------------------------
        Axios.get(`/api/v1/profile_score/${user_id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                let incoming_data = response.data.data;
                this.setState(Object.assign({}, { ...this.state, resume_data: incoming_data }));
            })
            .catch((error) => {
                if (error.status == 401) {
                    // this.setState(Object.assign({}, {...this.state, isLoading: false, errorCode: "logged_out" }));
                }
            });
    };
    render() {
        const { t } = this.props;
        let resume_score = 0;
        Object.values(this.state.resume_data).map((x) => {
            resume_score += x;
        });
        // console.log("data.id", this.state.recommendedJob[4].id)
        if (this.state.resume_data.about_me === 0 && this.state.resume_data.personal_info !== 0) {
            resume_score = resume_score - this.state.resume_data.personal_info;
        }

        const CircularData = {
            datasets: [
                {
                    data: [
                        this.state.resume_data.about_me,
                        this.state.resume_data.education_details,
                        this.state.resume_data.personal_info,
                        this.state.resume_data.skills,
                        this.state.resume_data.trainings_certification,
                        this.state.resume_data.uploads,
                        this.state.resume_data.work_experience,
                    ],
                    backgroundColor: interpolateColors("rgb(27, 119, 163)", "rgb(243, 243, 243)", 7).map(
                        (m) => `rgb(${m[0]}, ${m[1]}, ${m[2]})`
                    ),
                    borderWidth: 0,
                },
            ],
            labels: [
                "About me",
                "Academic Details",
                "Personal Information",
                "Skills",
                "Certifications",
                "Uploads",
                "Work Experience",
            ],
        };
        const CircularOptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
                position: "bottom",
                align: "start",
                labels: {
                    display: true,
                },
            },
            title: {
                display: true,
                text: resume_score + "%",
                position: "bottom",
                fontSize: "20",
                fontColor: "#30336E",
            },
            animation: {
                animateScale: true,
                animateRotate: true,
            },
            rotation: Math.PI,
            tooltips: {
                enabled: true,
            },
            radius: "500",
        };
        const PolarData = {
            datasets: [
                {
                    data: this.state.skills.map((m) => m.score).slice(0, 10),
                    backgroundColor: this.state.skills.map((m) => m.color).slice(0, 10),
                    borderWidth: 3,
                },
            ],
            labels: this.state.skills.map((m) => truncate(m.name, 30)).slice(0, 10),
        };
        const PolarOptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
                labels: {
                    display: true,
                },
            },
            title: {
                display: false,
            },
            animation: {
                animateScale: true,
                animateRotate: true,
            },
            tooltips: {
                enabled: true,
            },
        };
        return (
            <div className="container-fluid pt-3 px-3">
                <div className="col-md-12 mt-4 p-0">
                    <div className="d-md-flex mb-1">
                        <div className="col-md-9 p-0">
                            <Cards />
                            {/* {this.state.welcome != "hide" ? (
                                <div class="col-md-12 border rounded p-3 mb-3 text-center">
                                    <button class="btn btn-sm text-right float-right d-block px-0" onClick={() => {
                                        this.setState(Object.assign({}, { ...this.state, welcome: "hide" }));
                                        sessionStorage.setItem('welcome_message_user', "hide")
                                    }}>
                                        <img src="/svgs/icons_new/x.svg" alt="close-sectoin-icon"></img>
                                    </button>
                                    <img src="/svgs/illustrations/dashboard-welcome-illustrator.svg" class="welcome-dashboard-illustration" alt="welcome to dashboard"></img>
                                    <h1 class="font-weight-bold text-dark mt-3 mb-2">Welcome to Career Connector</h1>
                                    <btn class="btn btn-lg btn-primary my-4 px-5 py-2" onClick={() => window.location.href = "/search"}>Apply Jobs</btn>
                                </div>
                            ) : null} */}
                            <div className="d-md-flex mb-3 profile-score">
                                <div className="col-md-4 p-0 pr-md-3 mb-3 h-100">
                                    <div className="bg-white">
                                        <h5>
                                        {t(this.props.language?.layout?.js_dashboard_profilescore)} {" "}
                                            <abbr
                                                title= {t(this.props.language?.layout?.dasboard_displays_nt)}
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr>{" "}
                                        </h5>
                                    </div>
                                    <div className="border rounded p-3" style={{ height: "13.5rem" }}>
                                        {resume_score ? (
                                            <p>
                                                <Link
                                                    className="pb-2 text-primary"
                                                    style={{ textDecoration: "underline" }}
                                                    to="/profile">
                                                    {t(this.props.language?.layout?.js_dashboard_link)}
                                                </Link>{" "}
                                                {t(this.props.language?.layout?.js_dashboard_link1)} 
                                            </p>
                                        ) : null}
                                        <div className=" position-relative">
                                            <Doughnut data={CircularData} options={CircularOptions} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8 p-0 h-100">
                                    <div className="bg-white">
                                        <h5>
                                        {t(this.props.language?.layout?.js_dashboard_skills)} {" "}
                                            <abbr
                                                title= {t(this.props.language?.layout?.dashborad_abbr_nt)}
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr>{" "}
                                        </h5>
                                    </div>
                                    <div className="border rounded p-3 d-flexflex-column" style={{ height: "13.5rem" }}>
                                        {this.state.skills.length == 0 ? (
                                            <h5>{"No skills added"}</h5>
                                        ) : (
                                            <>
                                                {this.state.skills.length ? (
                                                    <p className="m-0">
                                                        {this.state.skills.length >= 10
                                                            ? t(this.props.language?.layout?.dashboard_topskills_nt)
                                                            : t(this.props.language?.layout?.js_dashboard_topskills)}
                                                    </p>
                                                ) : (
                                                    <p>
                                                        <a
                                                            className="pb-2"
                                                            style={{
                                                                color: "rbg(0, 173, 239)",
                                                                textDecoration: "underline",
                                                            }}
                                                            to="/profile">
                                                            {t(this.props.language?.layout?.js_dashboard_link)}
                                                        </a>{" "}
                                                        {t(this.props.language?.layout?.js_dashboard_link1)}
                                                    </p>
                                                )}
                                                <div className="position-relative">
                                                    <Polar data={PolarData} options={PolarOptions} />
                                                </div>
                                                {this.state.skills.length >= 10 ? (
                                                    <p
                                                        className="icon-invert text-primary float-right pointer user-select-none"
                                                        onClick={() => {
                                                            this.setState(
                                                                Object.assign(
                                                                    {},
                                                                    {
                                                                        ...this.state,
                                                                        lessSkills: !this.state.lessSkills,
                                                                    }
                                                                )
                                                            );
                                                        }}>
                                                        {this.state.lessSkills ? t(this.props.language?.layout?.dashboard_lessskills_nt) : t(this.props.language?.layout?.dashboard_moreskills_nt)}
                                                        <img
                                                            src="/svgs/icons_new/chevron-down.svg"
                                                            alt={this.state.lessSkills ? "less" : "more"}
                                                            style={{
                                                                transform: this.state.lessSkills
                                                                    ? "rotate(180deg)"
                                                                    : "rotate(0deg)",
                                                            }}
                                                        />
                                                    </p>
                                                ) : null}
                                            </>
                                        )}
                                    </div>
                                    {this.state.lessSkills ? (
                                        <div
                                            style={{
                                                zIndex: 10,
                                                position: "absolute",
                                            }}
                                            className="border rounded p-3 w-100 bg-white">
                                            {this.state.skills
                                                .map((m) => m.name)
                                                .splice(10)
                                                .map((skill) => (
                                                    <div class="nav nav-pills mr-1 mt-0 hoveredElement d-inline-block">
                                                        <div class="mb-1 d-flex border border-secondary rounded mr-1">
                                                            <a class="text-decoration-none px-2 py-1 text-secondary">
                                                                {skill}
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 pl-md-3 p-0">
                            <div className="h-100">
                                <div className="d-flex flex-column" style={{ height: "26.1rem" }}>
                                    {/* feedback & contact */}
                                    <div className="mt-md-4 pt-1">
                                        <div class="d-md-flex feedback_contact">
                                            {/* <div role="group" aria-label="Basic example"> */}
                                            <div className="col-md-6 p-0">
                                                <button
                                                    type="button"
                                                    onClick={() => this.handleModalShowHide()}
                                                    class="w-100 btn btn-black text-white border-0 rounded-0 border border-white bg-secondary">
                                                    <img
                                                        className="svg-sm invert-color"
                                                        src="/svgs/icons_new/help-circle.svg"
                                                        title="Help"
                                                        alt="Help Icon"
                                                    />
                                                    &nbsp; {t(this.props.language?.layout?.js_dashboard_contact)}
                                                </button>
                                            </div>
                                            <div className="col-md-6 p-0">
                                                <button
                                                    type="button"
                                                    onClick={() => this.handleModalShow()}
                                                    class="w-100 btn btn-black text-white border-0 rounded-0 border border-white bg-secondary feedback_btn">
                                                    <img
                                                        className="svg-sm pointer invert-color "
                                                        src="/svgs/temp/feedback.svg"
                                                        title="Feedback"
                                                        alt="Extend Icon"
                                                    />
                                                    &nbsp;{t(this.props.language?.layout?.js_dashboard_feedback)}
                                                </button>
                                            </div>
                                            {/* </div> */}
                                        </div>
                                    </div>
                                    {/* feedback & contact */}
                                    <div className="d-flex bg-white mt-3">
                                        <h5>
                                        {t(this.props.language?.layout?.js_dashboard_activity)} {" "}
                                            <abbr
                                                title= {t(this.props.language?.layout?.dashborad_abbr1_nt)}
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr>{" "}
                                        </h5>
                                    </div>
                                    <div className="border rounded h-100 overflow-auto thin-scrollbar" tabIndex="0">
                                        <ul className="list-group">
                                            {this.state.profileActivity.map((activity) => (
                                                <li className="lightgrey list-group-item border-0 px-3 py-2">
                                                    <text className="d-flex flex-column">
                                                        <text>{ReactHtmlParser(activity.activity)}</text>
                                                        <div class="d-flex justify-content-between pb-0">
                                                            <i className="small text-muted">
                                                                {`${formatDistance(
                                                                    subDays(new Date(activity.date), 0),
                                                                    new Date()
                                                                ).replace("about", "")} ago`}
                                                            </i>
                                                            <text
                                                                className="text-right font-weight-light text-muted"
                                                                style={{ fontSize: "0.7rem" }}>
                                                                {renderToLocaleDate(activity.date)}
                                                            </text>
                                                        </div>
                                                    </text>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row px-2 mb-3">
                        <div className="bg-white">
                            <h5 className="m-0">
                            {t(this.props.language?.layout?.js_dashboard_reccomendedjob)} {" "}
                                <abbr
                                    title= {t(this.props.language?.layout?.dasboard_displaysbest_nt)}
                                    className="align-top d-inline-flex">
                                    <img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" />
                                </abbr>{" "}
                            </h5>
                        </div>
                        {/* <div className="border rounded p-4">
                            <div class="d-flex">
                                {data.map((e) => (
                                    <JobCard item={e} loading={false} />
                                ))}
                            </div>
                        </div> */}
                        <div className="col-md-12">
                            {this.state.recommendedJob && this.state.recommendedJob.length !== 0 ? (
                                <div className="row mt-2 border rounded p-4">
                                    {this.state.recommendedJob
                                        .filter((data, index) => index < 4)
                                        .map((data) => {
                                            return <JobCard item={data} loading={false} />;
                                        })}
                                </div>
                            ) : (
                                <div className="row mt-3 border rounded p-4 d-flex justify-content-center">
                                    <p className="">{t(this.props.language?.layout?.dashboard_nojobs_nt)}</p>
                                </div>
                            )}
                        </div>
                        {/*Recommended Jobs */}
                    </div>
                </div>
                <div>
                    <Modal size="lg" show={this.state.showHide}>
                        <Modal.Header className="b-0" closeButton onClick={() => this.handleModalShowHide()}>
                            <h4 className="modal-title font-weight-bold" id="staticBackdropLabel">
                            {t(this.props.language?.layout?.all_contact_nt)}
                            </h4>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="modal-body px-3 icon-invert d-flex align-items-center">
                                <div className="col h-100 d-flex justify-content-center">
                                    <ul
                                        className="list-unstyled mb-0 h-100 d-flex flex-column justify-content-around"
                                        style={{ width: "fit-content" }}>
                                        <li className="icon-invert d-flex align-items-center my-4">
                                            <img src="/svgs/icons_new/phone.svg" alt="phone" className="svg-lg mr-3" />
                                            <a href="tel://+1 888-323-7470" className="display-5 text-danger h1">
                                                +1 888-323-7470
                                            </a>
                                        </li>
                                        <li className="icon-invert d-flex align-items-center mb-4">
                                            <img src="/svgs/icons_new/mail.svg" alt="email" className="svg-lg mr-3" />
                                            <a href="mailto:support@simplifyhire.com" className="h2">
                                                support@simplifyhire.com
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                    <Modal size="lg" show={this.state.show}>
                        <Modal.Body>
                            <div className="modal-content pt-1">
                                <Modal.Header closeButton onClick={() => this.handleModalShow()}>
                                    <Modal.Title>{t(this.props.language?.layout?.feedbackform_nt)}</Modal.Title>
                                </Modal.Header>
                                <div className="modal-body px-3 pt-0">
                                    <div class="form-group animated">
                                        <label for="exampleFormControlSelect1" className="form-label-active text-muted">
                                        {t(this.props.language?.layout?.ep_jobs_type)} *
                                        </label>
                                        <select
                                            className="form-control text-muted"
                                            value={this.state.type}
                                            onChange={(e) => this.setState({ type: e.target.value })}>
                                            <option selected="" className="d-none">
                                            {t(this.props.language?.layout?.ep_setting_bd_select)} {t(this.props.language?.layout?.ep_jobs_type)}
                                            </option>
                                            <option value="Complaints">{t(this.props.language?.layout?.feedbackform_type_nt)}</option>
                                            <option value="Suggestions">{t(this.props.language?.layout?.feedbackform_type1_nt)}</option>
                                            <option value="Questions">{t(this.props.language?.layout?.feedbackform_type2_nt)}</option>
                                            <option value="Others">{t(this.props.language?.layout?.feedbackform_type3_nt)}</option>
                                        </select>
                                    </div>
                                    <div class="form-group animated mb-3">
                                        <label class="form-label-active text-muted" for="textarea">
                                        {t(this.props.language?.layout?.seeker_des)}  *
                                        </label>
                                        <textarea
                                            rows="3"
                                            type="text"
                                            class="form-control p-3"
                                            id="textarea"
                                            name="textarea"
                                            placeholder= {t(this.props.language?.layout?.feedback_suggestiion_nt)}
                                            value={this.state.message}
                                            onChange={(e) => this.setState({ message: e.target.value })}
                                        // this.setState({[field]: value});
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer py-2 px-3">
                                    <button className="btn btn-primary" onClick={() => this.validation()}>
                                    {t(this.props.language?.layout?.ep_importjob_submit)}
                                    </button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
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
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(withTranslation()(UserDashboard));
