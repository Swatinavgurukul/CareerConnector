import React, { Component } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { renderToLocaleDate } from "../../modules/helpers.jsx";
import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
// import { applicationStatus } from "../../components/constants.jsx";
import { truncate } from "../../modules/helpers.jsx";
import { event } from "@fullstory/browser";
import { calculateScore } from "../../components/constants.jsx";
import { Fragment } from "react";
import { withTranslation } from 'react-i18next';
import axios from "axios";
import { job_status1, jobstage } from "../../../translations/helper_translation.jsx";

class RowData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            favourite: true,
        };
    }

    toggleExpander = (e) => {
        if (!this.state.expanded) {
            this.setState({ expanded: true });
        } else {
            this.setState({ expanded: false });
        }
    };

    change = (event) => {
        this.props.updateStatus(event.target.value, this.props.user.id);
    };

    statusChange = (value, userData) => {
        if (value == "interview") {
            this.props.actionsToPerform("scheduleInterview", userData);
            return;
        }
        if (value == "offered") {
            this.props.actionsToPerform("offerRelease", userData);
            return;
        }
        this.props.updateStatus(value, this.props.user.id);
    };
    statusHandler = (language, key) => {
        return(job_status1[language][key]);
    }
    copy = (e) => {
        this.textArea.select();
        document.execCommand('copy');
        e.target.focus();
    };
    scoringNum = (num) => {
        let y = num % 1
        let n = y.toString();
        if (n[2] <= 5) {
            let z = Math.floor(num)
            return z;
        }
        else {
            let z = Math.ceil(num)
            return z;
        }
    }
    jobStageHandler = (language, key) =>{
        return(jobstage[language][key]);
    }
    applicationStatusHandler = () => {
        const applicationStatus = process.env.CLIENT_NAME === "cc" ? [
            { key: "applied", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_applied) },
            { key: "screening", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_screening) },
            { key: "interview", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_interview) },
            { key: "offered", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_offered) },
            { key: "withdrawn", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_withdrawn) },
            { key: "hired", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_hired) },
            { key: "declined", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_declined) },
            { key: "on-hold", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_onhold) },
            { key: "rejected", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_rejected) },
        ] :
            [
                { key: "applied", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_applied) },
                { key: "screening", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_screening) },
                { key: "interview", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_interview) },
                { key: "offered", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_offered) },
                { key: "hired", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_hired) },
                { key: "declined", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_declined) },
                { key: "on-hold", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_onhold) },
                { key: "rejected", value: this.props.t(this.props.language?.layout?.ep_applicationstatus_rejected) },
            ]
        return applicationStatus;
    }
    downloadResume = () => {
        let id = {
            user: this.props.user.user_id
        }
        axios.post("api/v1/users/resume-download-log", id, {
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
        let applicationStatus = this.applicationStatusHandler();
        const { user, actionsToPerform, closeModal, theme } = this.props;
        const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
            <p
                className="text-dark"
                href=""
                ref={ref}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}>
                {children}
            </p>
        ));
        return [
            <tr key="main">
                {/* <td className="pl-3 align-middle">
                    <input
                        checked={this.props.selectAll || this.state.checkValue}
                        onChange={(e) => this.setState({ checkValue: e.target.checked })}
                        className=""
                        type="checkbox"
                    />
                </td> */}
                <td className="pl-3 text-capitalize align-middle">
                    <div className="d-flex justify-content-between align-items-center">
                        <Link
                            aria-describedby="Job Title"
                            to={{
                                pathname: "/applications/" + user.id,
                                state: {
                                    user_id: user.user_id,
                                    jobscore: user.sov_score,
                                    title: user.job_title,
                                    slug: user.job_slug,
                                    type: this.props.type,
                                    weightedScore: user.weighted_score,
                                    totalScore: user?.totalScore
                                },
                            }}>
                            {/* user_id: user.user_id,
                                    jobscore: user.sov_job == undefined ? user.sov_score : user.sov_job,
                                    title: user.job_title,
                                    slug: user.job_slug,
                                    type: this.props?.type,
                                    weightedScore: user.weighted_score,
                                    totalScore: user?.totalScore */}
                            {(user.first_name == null || user.first_name == "") &&
                                (user.last_name == null || user.last_name == "") ? (
                                user.username
                            ) : (
                                <span>
                                    {user.first_name}&nbsp;{user.last_name}
                                </span>
                            )}
                        </Link>
                        {user.current_status == "interview" ? (
                            <span className="px-1 rounded small mb-2 mr-3" style={theme.active_color}>
                                {t(this.props.language?.layout?.all_new_nt)}
                            </span>
                        ) : (
                            ""
                        )}
                        <button
                            type="button"
                            class="btn btn-sm btn-light icon-invert"
                            aria-label="Open"
                            title={t(this.props.language?.layout?.open_nt)}
                            onClick={this.toggleExpander}>
                            <img src="/svgs/icons_new/chevron-down.svg" alt="chevron" className="svg-xs mt-1" />
                        </button>
                    </div>
                </td>
                {this.props.userAdmin.role_id == 1 || this.props.userAdmin.role_id == 4 ? <td className="align-middle">
                    <div
                        class="single-chart ml-4"
                        title={t(this.props.language?.layout?.all_abbr1_nt)}>
                        <svg viewBox="0 0 36 36" class="circular-chart circular-progressbar">
                            <path
                                class="circle-bg"
                                d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                class="circle"
                                stroke-dasharray={`${user.totalScore == undefined ? (user.weighted_score && user.weighted_score != null ? user.weighted_score : 0) :
                                    (user.totalScore && user.totalScore != null ? user.totalScore : 0)},100`}
                                d="M18 2.0845
                               a 15.9155 15.9155 0 0 1 0 31.831
                               a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="23.35" class="percentage text-green">
                                {user.totalScore == undefined ? (user.weighted_score != null ? user.weighted_score : 0) :
                                    (user.totalScore != null ? user.totalScore : 0)}
                            </text>
                        </svg>
                    </div>
                </td> : null}
                {this.props.userAdmin.role_id == 2 || this.props.userAdmin.role_id == 5 ? (
                    <td className="align-middle text-capitalize">
                        {" "}
                        <span
                            className="px-2 rounded small"
                            style={
                                user.current_status == "applied"
                                    ? theme.all_color
                                    : user.current_status == "screening"
                                        ? theme.screening_color
                                        : user.current_status == "interview"
                                            ? theme.interview_color
                                            : user.current_status == "offered"
                                                ? theme.offer_color
                                                : user.current_status == "withdrawn"
                                                    ? theme.closed_color
                                                    : user.current_status == "hired"
                                                        ? theme.active_color
                                                        : user.current_status == "declined"
                                                            ? theme.closed_color
                                                            : user.current_status == "on-hold"
                                                                ? theme.paused_color
                                                                : user.current_status == "rejected"
                                                                    ? theme.all_color
                                                                    : theme.all_color
                            }
                            aria-label="status">
                            {this.jobStageHandler(this.props?.languageName, user.current_status)}
                        </span>
                    </td>
                ) : (
                    <td className="align-middle">
                        <select
                            className="border-0 btn-sm py-0 text-capitalize"
                            style={
                                user.current_status == "applied"
                                    ? theme.all_color
                                    : user.current_status == "screening"
                                        ? theme.screening_color
                                        : user.current_status == "interview"
                                            ? theme.interview_color
                                            : user.current_status == "offered"
                                                ? theme.offer_color
                                                : user.current_status == "withdrawn"
                                                    ? theme.closed_color
                                                    : user.current_status == "hired"
                                                        ? theme.active_color
                                                        : user.current_status == "declined"
                                                            ? theme.closed_color
                                                            : user.current_status == "on-hold"
                                                                ? theme.paused_color
                                                                : theme.all_color
                            }
                            aria-label="status"
                            onChange={(event) => this.change(event)}
                            value={user.current_status}>
                            {applicationStatus.map((filter) => (
                                <option className="bg-white" key={filter.key} value={filter.key}>
                                    {filter.value}
                                </option>
                            ))}
                        </select>
                    </td>
                )}
                {this.props.userAdmin.role_id == null ?
                    <Fragment>
                        <td className="pl-3 align-middle">{user.skilling_partner}</td>
                        <td className="pl-3 align-middle">{user.employer_partners}</td>
                    </Fragment>
                    : ""}
                 {this.props.userAdmin.role_id == null ? <td className="pl-3 align-middle">{user.user_is_ca ? t(this.props.language?.layout?.globallocations_canada) :
                    t(this.props.language?.layout?.globallocations_us)}</td> : ""}
                <td className="pl-3 align-middle">
                    {/* {user.job_title} */}
                    {/* {this.props.languageName == "en" ? truncate(user.job_title, 35) : "" } */}

                        {this.props.languageName == "en" ?
                                    user.job_title == null || user.job_title =="" ? truncate(user.job_title_fr, 35) : truncate(user.job_title , 35) : ""}
                        {this.props.languageName == "esp" ?
                            user.job_title_esp == null || user.job_title_esp == ""  ? user.job_title ? truncate(user.job_title, 35) : truncate(user.job_title_fr, 35) : truncate(user.job_title_esp, 35) : ""
                        }
                        {this.props.languageName == "fr" ?
                                user.job_title_fr == null || user.job_title_fr == ""  ? truncate(user.job_title, 35) : truncate(user.job_title_fr, 35) : ""
                        }
                </td>
                <td className="pl-3 align-middle text-capitalize">
                    <div>
                        <span
                            className="px-2 rounded"
                            style={
                                user.job_status == "active"
                                    ? theme.active_color
                                    : user.job_status == "paused"
                                        ? theme.paused_color
                                        : user.job_status == "draft"
                                            ? theme.interview_color
                                            : user.job_status == "closed"
                                                ? theme.closed_color
                                                : user.job_status == "offered"
                                                    ? offer_color
                                                    : theme.all_color
                            }
                        >
                            {this.statusHandler(this.props?.languageName, user.job_status)}
                            {/* {user.job_status} */}
                        </span>
                    </div>
                </td>
                <td className="pl-3 align-middle text-capitalize">{!user?.answer?.length || user?.answer == "[]" ? "N/A" : user?.answer && JSON.parse(user?.answer)[0]?.answer == "Yes" ? t(this.props.language?.layout?.all_yes_nt) : t(this.props.language?.layout?.no_nt) }</td>
                <td className="pl-3 align-middle">{renderToLocaleDate(user.created_at)}</td>
                {this.props.userAdmin.role_id == 2 || this.props.userAdmin.role_id == 5 ? (
                    ""
                ) : (
                    <td className="align-middle text-left px-0">
                        {user.current_status == "applied" ? (
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button className="btn btn-light" onClick={() => this.statusChange("screening")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_shortlist)}
                                </button>
                                <button className="btn btn-light" onClick={() => this.statusChange("on-hold")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_hold)}
                                </button>
                                <button className="btn btn-light" onClick={() => this.statusChange("rejected")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_reject)}
                                </button>
                            </div>
                        ) : user.current_status == "screening" ? (
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button
                                    className="btn btn-light"
                                    onClick={() => this.props.updateStatus("interview", this.props.user.id)}>
                                    {t(this.props.language?.layout?.ep_jobtitle_interview)}
                                </button>
                                <button className="btn btn-light" onClick={() => this.statusChange("on-hold")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_hold)}
                                </button>
                                <button className="btn btn-light" onClick={() => this.statusChange("rejected")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_reject)}
                                </button>
                            </div>
                        ) : user.current_status == "interview" ? (
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button className="btn btn-light" onClick={() => this.statusChange("interview", user)}>
                                    {user.is_scheduled ? t(this.props.language?.layout?.all_reschedule_nt) : t(this.props.language?.layout?.sp_jobtitle_schedule)}
                                </button>
                                {/* <button className="btn btn-light" disabled>
                                    Reschedule
                                </button> */}
                                <button className="btn btn-light" onClick={() => this.statusChange("rejected")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_reject)}
                                </button>
                            </div>
                        ) : user.current_status == "offered" ? (
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button className="btn btn-light" onClick={() => this.statusChange("offered", user)}>
                                    {t(this.props.language?.layout?.ep_jobtitle_send)}
                                </button>
                                <button className="btn btn-light" onClick={() => this.statusChange("declined")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_decline)}
                                </button>
                                <button className="btn btn-light" onClick={() => this.statusChange("hired")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_accepted)}
                                </button>
                            </div>
                        ) : user.current_status == "rejected" ? (
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button className="btn btn-light" onClick={() => this.statusChange("screening")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_shortlist)}
                                </button>
                                <button className="btn btn-light" onClick={() => this.statusChange("on-hold")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_hold)}
                                </button>
                            </div>
                        ) : user.current_status == "on-hold" ? (
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button className="btn btn-light" onClick={() => this.statusChange("screening")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_shortlist)}
                                </button>
                                <button className="btn btn-light" onClick={() => this.statusChange("rejected")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_reject)}
                                </button>
                            </div>
                        ) : user.current_status == "Declined" ? (
                            ""
                        ) : user.current_status == "hired" ? (
                            ""
                        ) : (
                            ""
                        )}
                    </td>
                )}
            </tr>,
            this.state.expanded && (
                <tr className="expandable" key="tr-expander">
                    <td className="p-0 align-middle" colSpan={12}>
                        <div ref="expanderBody" className="">
                            <div className="w-100">
                                <div>
                                    {" "}
                                    <div className="card border-right border-left rounded-0">
                                        <div className="d-flex p-2 justify-content-between">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="col-md-3 p-0">
                                                    <div
                                                        className="rounded-circle mr-2 text-center d-flex align-items-center justify-content-center text-uppercase mt-1"
                                                        style={{
                                                            width: "60px",
                                                            height: "60px",
                                                            backgroundColor: "#80808029",
                                                        }}>
                                                        {user.user_image == "" || user.user_image == null ? (
                                                            (user.first_name == null || user.first_name == "") &&
                                                                (user.last_name == null || user.last_name == "") ? (
                                                                user?.username?.charAt(0)
                                                            ) : (
                                                                <span>
                                                                    {user.first_name != null &&
                                                                        user.first_name != "" &&
                                                                        user.first_name.charAt(0)}
                                                                    {user.last_name != null &&
                                                                        user.last_name != "" &&
                                                                        user.last_name.charAt(0)}
                                                                </span>
                                                            )
                                                        ) : (
                                                            <img
                                                                src={user.user_image}
                                                                className="svg-xl"
                                                                alt="candidate profile image"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div>
                                                        <div className="d-flex mb-1">
                                                            <h5 className="mr-3 text-capitalize">
                                                                {(user.first_name == null || user.first_name == "") &&
                                                                    (user.last_name == null || user.last_name == "") ? (
                                                                    user.username
                                                                ) : (
                                                                    <span>
                                                                        {user.first_name}&nbsp;{user.last_name}
                                                                    </span>
                                                                )}
                                                            </h5>
                                                            <div>
                                                                <span
                                                                    className="px-2 rounded small text-capitalize"
                                                                    style={
                                                                        user.current_status == "applied"
                                                                            ? theme.all_color
                                                                            : user.current_status == "screening"
                                                                                ? theme.screening_color
                                                                                : user.current_status == "interview"
                                                                                    ? theme.interview_color
                                                                                    : user.current_status == "offered"
                                                                                        ? theme.offer_color
                                                                                        : user.current_status == "withdrawn"
                                                                                            ? theme.closed_color
                                                                                            : user.current_status == "hired"
                                                                                                ? theme.active_color
                                                                                                : user.current_status == "declined"
                                                                                                    ? theme.closed_color
                                                                                                    : user.current_status == "on-hold"
                                                                                                        ? theme.paused_color
                                                                                                        : user.current_status == "rejected"
                                                                                                            ? theme.all_color
                                                                                                            : theme.all_color
                                                                    }>
                                                                   {this.jobStageHandler(this.props?.languageName, user.current_status)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="icon-invert mb-1 d-flex">
                                                        <img
                                                            src="/svgs/icons_new/mail.svg"
                                                            alt="email"
                                                            class="svg-xs mr-2 mt-2 svg-gray"
                                                        />

                                                        <input
                                                            aria-label="emailID"
                                                            class="border-0"
                                                            ref={(textarea) => this.textArea = textarea}
                                                            value={user.email.toLowerCase()}></input>
                                                        <button className="btn btn-light btn-sm rounded" onClick={this.copy}>
                                                            {" "}
                                                            <img
                                                                src="/svgs/icons_new/copy.svg"
                                                                class="svg-xs svg-gray pointer"
                                                                title={t(this.props.language?.layout?.copymail_nt)}
                                                                alt="copy"
                                                            />
                                                        </button>
                                                    </p>
                                                    <div className="d-flex">
                                                        <p className="icon-invert d-flex align-items-center mb-0 ">
                                                            <img
                                                                src="/svgs/icons_new/phone.svg"
                                                                class="svg-xs mr-2 svg-gray"
                                                                alt="phone"
                                                            />
                                                            <span>
                                                                {user.phone == null || user.phone == ""
                                                                    ? t(this.props.language?.layout?.no_contact_nt)
                                                                    : user.phone}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {this.props.userAdmin.role_id == 1 || this.props.userAdmin.role_id == 4 ? <div className="d-flex align-items-center pl-0">
                                                <span className="font-weight-bold mr-2"> {t(this.props.language?.layout?.all_jobscoredetails_nt)}</span>
                                                <div className="vertical"></div>
                                                <div className="d-flex flex-column">
                                                    <div className="d-flex justify-content-start">
                                                        {" "}
                                                        <p class="col-6 mb-0 p-0 pl-1">
                                                            {t(this.props.language?.layout?.js_dashboard_skills)}
                                                            <abbr
                                                                title={t(this.props.language?.layout?.interview_abbr1_nt)}
                                                                className="align-top d-inline-flex">
                                                                <img
                                                                    src="/svgs/icons_new/info.svg"
                                                                    alt="info"
                                                                    className="svg-xs-1 align-top"
                                                                />
                                                            </abbr>
                                                        </p>
                                                        <div
                                                            class="progress mt-2"
                                                            style={{ height: "6px", width: "145px" }}>
                                                            <div
                                                                class="progress-bar bg-success"
                                                                role="progressbar"
                                                                aria-label="skills"
                                                                aria-valuenow="87"
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                                style={{
                                                                    width: ` ${user.sov_score && user.sov_score.skills !== null
                                                                        ? user.sov_score.skills
                                                                        : 0
                                                                        }% `,
                                                                }}></div>
                                                        </div>
                                                        <p class="col-2 mb-0 text-green d-flex justify-content-center p-0">
                                                            {user.sov_score && user.sov_score.skills !== null
                                                                ? this.scoringNum(user.sov_score.skills)
                                                                : 0}

                                                        </p>
                                                    </div>
                                                    <div className="d-flex justify-content-start">
                                                        {" "}
                                                        <p class="col-6 mb-0 p-0 pl-1">
                                                            {t(this.props.language?.layout?.profile_certification_nt)}
                                                            <abbr
                                                                title={t(this.props.language?.layout?.interview_abbr2_nt)}
                                                                className="align-top d-inline-flex">
                                                                <img
                                                                    src="/svgs/icons_new/info.svg"
                                                                    alt="info"
                                                                    className="svg-xs-1 align-top"
                                                                />
                                                            </abbr>
                                                        </p>
                                                        <div
                                                            class="progress mt-2"
                                                            style={{ height: "6px", width: "145px" }}>
                                                            <div
                                                                class="progress-bar bg-success"
                                                                role="progressbar"
                                                                aria-valuenow="87"
                                                                aria-label="certificates"
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                                style={{
                                                                    width: ` ${user.sov_score &&
                                                                        user.sov_score.certification !== null
                                                                        ? user.sov_score.certification
                                                                        : 0
                                                                        }% `,
                                                                }}></div>
                                                        </div>
                                                        <p class="col-2 mb-0 text-green d-flex justify-content-center p-0">
                                                            {user.sov_score && user.sov_score.certification !== null
                                                                ? this.scoringNum(user.sov_score.certification)
                                                                : 0}

                                                        </p>
                                                    </div>
                                                    <div className="d-flex justify-content-start">
                                                        {" "}
                                                        <p
                                                            class="col-6 mb-0 p-0 pl-1"
                                                        >
                                                            {t(this.props.language?.layout?.all_industry)}
                                                            <abbr
                                                                title={t(this.props.language?.layout?.interview_abbr3_nt)}
                                                                className="align-top d-inline-flex">
                                                                <img
                                                                    src="/svgs/icons_new/info.svg"
                                                                    alt="info"
                                                                    className="svg-xs-1 align-top"
                                                                />
                                                            </abbr>
                                                        </p>
                                                        <div
                                                            class="progress mt-2"
                                                            style={{ height: "6px", width: "145px" }}>
                                                            <div
                                                                class="progress-bar bg-success"
                                                                role="progressbar"
                                                                aria-valuenow="87"
                                                                aria-valuemin="0"
                                                                aria-label="industry"
                                                                aria-valuemax="100"
                                                                style={{
                                                                    width: ` ${user.sov_score &&
                                                                        user.sov_score.industry !== null
                                                                        ? user.sov_score.industry
                                                                        : 0
                                                                        }% `,
                                                                }}></div>
                                                        </div>
                                                        <p class="col-2 mb-0 text-green d-flex justify-content-center p-0">
                                                            {user.sov_score && user.sov_score.industry !== null
                                                                ? this.scoringNum(user.sov_score.industry)
                                                                : 0}

                                                        </p>
                                                    </div>
                                                    <div className="d-flex justify-content-start">
                                                        {" "}
                                                        <p
                                                            class="col-6 mb-0 p-0 pl-1"
                                                        >
                                                            {t(this.props.language?.layout?.all_education_nt)}
                                                            <abbr
                                                                title={t(this.props.language?.layout?.interview_abbr4_nt)}
                                                                className="align-top d-inline-flex">
                                                                <img
                                                                    src="/svgs/icons_new/info.svg"
                                                                    alt="info"
                                                                    className="svg-xs-1 align-top"
                                                                />
                                                            </abbr>
                                                        </p>
                                                        <div
                                                            class="progress mt-2"
                                                            style={{ height: "6px", width: "145px" }}>
                                                            <div
                                                                class="progress-bar bg-success"
                                                                role="progressbar"
                                                                aria-valuenow="87"
                                                                aria-label="education"
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                                style={{
                                                                    width: ` ${user.sov_score &&
                                                                        user.sov_score.education !== null
                                                                        ? user.sov_score.education
                                                                        : 0
                                                                        }% `,
                                                                }}></div>
                                                        </div>
                                                        <p class="col-2 mb-0 text-green d-flex justify-content-center p-0">
                                                            {user.sov_score && user.sov_score.education !== null
                                                                ? this.scoringNum(user.sov_score.education)
                                                                : 0}

                                                        </p>
                                                    </div>

                                                    <div className="d-flex justify-content-start">
                                                        <p
                                                            class="col-6 mb-0 p-0 pl-1"
                                                        >
                                                            {t(this.props.language?.layout?.profile_management_nt)}
                                                            <abbr
                                                                title={t(this.props.language?.layout?.interview_abbr5_nt)}
                                                                className="align-top d-inline-flex">
                                                                <img
                                                                    src="/svgs/icons_new/info.svg"
                                                                    alt="info"
                                                                    className="svg-xs-1 align-top"
                                                                />
                                                            </abbr>
                                                        </p>
                                                        <div
                                                            class="progress mt-2"
                                                            style={{ height: "6px", width: "145px" }}>
                                                            <div
                                                                class="progress-bar bg-success"
                                                                role="progressbar"
                                                                aria-valuenow="87"
                                                                aria-label="management"
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                                style={{
                                                                    width: ` ${user.sov_score &&
                                                                        user.sov_score.management_level !== null
                                                                        ? user.sov_score.management_level
                                                                        : 0
                                                                        }% `,
                                                                }}></div>
                                                        </div>
                                                        <p class="col-2 mb-0 text-green d-flex justify-content-center p-0">
                                                            {user.sov_score && user.sov_score.management_level !== null
                                                                ? this.scoringNum(user.sov_score.management_level)
                                                                : 0}

                                                        </p>
                                                    </div>
                                                    <div className="d-flex justify-content-start">
                                                        {" "}
                                                        <p
                                                            class="col-6 mb-0 p-0 pl-1"
                                                        >
                                                            {t(this.props.language?.layout?.ep_createjob_title)}
                                                            <abbr
                                                                title={t(this.props.language?.layout?.interview_abbr6_nt)}
                                                                className="align-top d-inline-flex">
                                                                <img
                                                                    src="/svgs/icons_new/info.svg"
                                                                    alt="info"
                                                                    className="svg-xs-1 align-top"
                                                                />
                                                            </abbr>
                                                        </p>
                                                        <div
                                                            class="progress mt-2"
                                                            style={{ height: "6px", width: "145px" }}>
                                                            <div
                                                                class="progress-bar bg-success"
                                                                role="progressbar"
                                                                aria-valuenow="87"
                                                                aria-label="titlejob"
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                                style={{
                                                                    width: ` ${user.sov_score &&
                                                                        user.sov_score.job_title !== null
                                                                        ? user.sov_score.job_title
                                                                        : 0
                                                                        }% `,
                                                                }}></div>
                                                        </div>
                                                        <p class="col-2 mb-0 text-green d-flex justify-content-center p-0">
                                                            {user.sov_score && user.sov_score.job_title !== null
                                                                ? this.scoringNum(user.sov_score.job_title)
                                                                : 0}

                                                        </p>
                                                    </div>
                                                </div>
                                            </div> : <div className="d-flex align-items-center pl-0"></div>}
                                            <div className="d-flex flex-column justify-content-center align-items-start px-0">
                                                <strong>{t(this.props.language?.layout?.ep_application_designation)}</strong>
                                                <span
                                                    className="text-muted"
                                                    title={user.designation}
                                                    style={{ wordBreak: "break-all" }}>
                                                    {truncate(user.designation, 15)}
                                                </span>
                                                <strong>{t(this.props.language?.layout?.ep_application_experience)}</strong>
                                                <span className="text-muted">
                                                    {user.experience == null || user.experience == ""
                                                        ? "---"
                                                        : user.experience <= 1
                                                            ? user.experience + " " + t(this.props.language?.layout?.year_nt)
                                                            : user.experience + " " + t(this.props.language?.layout?.all_years_nt)}
                                                </span>
                                                <strong>{t(this.props.language?.layout?.ep_application_appliedon1)}</strong>
                                                <span className="text-muted">
                                                    {renderToLocaleDate(user.created_at)}
                                                </span>
                                            </div>
                                            {/* <div
                                            className="col-1 d-flex flex-column justify-content-center align-items-start px-0"
                                            style={{ wordBreak: "break-all" }}>
                                            <strong>Designation</strong>
                                            <span className="text-muted" title={user.designation}>
                                                {truncate(user.designation, 35)}
                                            </span> */}
                                            {/* <strong>Source</strong>
                                            <span className="text-muted">career portal</span>
                                            <strong>Job location</strong>
                                            <span className="text-muted">{user.user_city}</span> */}
                                            {/* </div> */}
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div>
                                                    <div className="pb-3">
                                                    {user.resume == null || user.resume == "" ?
                                                        ( <a
                                                            aria-labelledby="Download Resume"
                                                            className="disabled
                                                            icon-invert btn-svg-sm rounded btn-light text-decoration-none d-flex pr-0"
                                                            style={{ wordBreak: "break-all" }}
                                                            href={"/media/" + user.resume}
                                                            download
                                                            onClick={this.downloadResume}>
                                                            <img
                                                                src="/svgs/icons_new/download.svg"
                                                                alt="search"
                                                                className="svg-xs"
                                                            />
                                                            <span className="ml-2">{t(this.props.language?.layout?.ep_jobtitle_downloadresume)}</span>
                                                        </a>)
                                                     : (
                                                        <a
                                                            aria-labelledby="Download Resume"
                                                            className="
                                                            icon-invert btn-svg-sm rounded btn-light text-decoration-none d-flex pr-0"
                                                            style={{ wordBreak: "break-all" }}
                                                            href={"/media/" + user.resume}
                                                            download
                                                            onClick={this.downloadResume}>
                                                            <img
                                                                src="/svgs/icons_new/download.svg"
                                                                alt="search"
                                                                className="svg-xs"
                                                            />
                                                            <span className="ml-2">{t(this.props.language?.layout?.ep_jobtitle_downloadresume)}</span>
                                                        </a>
                                                    )}

                                                    </div>
                                                    <div className="">
                                                        <Link
                                                            aria-labelledby="View Profile"
                                                            className="icon-invert btn-svg-sm rounded btn-light text-decoration-none"
                                                            to={{
                                                                pathname: "/applications/" + user.id,
                                                                state: {
                                                                    user_id: user.user_id,
                                                                    jobscore: user.sov_score,
                                                                    title: user.job_title,
                                                                    slug: user.job_slug,
                                                                    type: this.props.type,
                                                                    weightedScore: user.weighted_score,
                                                                    totalScore: user?.totalScore
                                                                },
                                                            }}>
                                                            <img
                                                                src="/svgs/icons_new/external-link.svg"
                                                                alt="search"
                                                                className="svg-xs mr-2"
                                                            />
                                                            <span>{t(this.props.language?.layout?.ep_jobtitle_viewprofile)}</span>
                                                        </Link>
                                                    </div>
                                                    {/* <div>
                                                    <img
                                                        src={
                                                            this.state.favourite ? "/svgs/icons_new/heart.svg" : "/svgs/icons/red-heart.svg"
                                                        }
                                                        onClick={(e) => this.setState({favourite: !this.state.favourite})}
                                                        class="svg-xs mr-2 svg-gray pointer"
                                                    />
                                                    <span>Mark as favourite</span>
                                                </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            ),
        ];
    }
}
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userAdmin: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(withTranslation()(RowData));
