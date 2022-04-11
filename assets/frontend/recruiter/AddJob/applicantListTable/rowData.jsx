import React, { Component } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { renderToLocaleDate } from "../../../modules/helpers.jsx";
import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
// import { applicationStatus } from "../../../components/constants.jsx";
import { withTranslation } from 'react-i18next';
import axios from "axios";

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
        const { user, actionsToPerform, theme } = this.props;
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
                <td className="pl-3 align-middle text-capitalize">
                    <div className="d-flex justify-content-between align-items-center">
                        <Link
                            aria-describedby="Job"
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
                            {(user.first_name == null || user.first_name == "") &&
                                (user.last_name == null || user.last_name == "") ? (
                                user.username
                            ) : (
                                <span>
                                    {user.first_name}&nbsp;{user.last_name}
                                </span>
                            )}
                            {user.current_status == "interview" ? (
                                <span className="px-1 rounded small ml-3" style={theme.active_color}>
                                    New
                                </span>
                            ) : (
                                ""
                            )}
                        </Link>
                        <button
                            type="button"
                            class="icon-invert btn btn-sm btn-light"
                            aria-label="Open"
                            title= {t(this.props.language?.layout?.open_nt)}
                            onClick={this.toggleExpander}>
                            <img src="/svgs/icons_new/chevron-down.svg" alt="chevron" className="svg-xs mt-1" />
                        </button>
                    </div>
                </td>
                <td className="pl-3 align-middle">{user.designation}</td>
                {/* <td className="align-middle">
                    <div
                        class="single-chart ml-4"
                        title="The overall job score represents a fit between the candidate profile and job requirement.">
                        <svg viewBox="0 0 36 36" class="circular-chart" style={{ width: "26%" }}>
                            <path
                                class="circle-bg"
                                d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                class="circle"
                                stroke-dasharray={`${user.score != null ? user.score : 0},100`}
                                d="M18 2.0845
                               a 15.9155 15.9155 0 0 1 0 31.831
                               a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="23.35" class="percentage text-green">
                                {user.score != null ? user.score : 0}
                            </text>
                        </svg>
                    </div>
                </td> */}
                {this.props.userAdmin.role_id == 2 ? (
                    <td className="align-middle text-capitalize">
                        {" "}
                        <span
                            className="px-2 rounded"
                            style={
                                user.current_status == "applied"
                                    ? theme.all_color
                                    : user.current_status == "screening"
                                        ? theme.screening_color
                                        : user.current_status == "interview"
                                            ? theme.interview_color
                                            : user.current_status == "offered"
                                                ? theme.offer_color
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
                            {user.current_status}
                        </span>
                    </td>
                ) : (
                    <td className="align-middle text-capitalize">
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
                <td className="align-middle">{user.source}</td>
                <td className="pl-3 align-middle">{renderToLocaleDate(user.created_at)}</td>
                {this.props.userAdmin.role_id == 2 ? (
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
                                    {user.is_scheduled ? t(this.props.language?.layout?.all_reschedule_nt) : t(this.props.language?.layout?.ep_jobtitle_schedule)}
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
                    <td className="p-0 align-middle " colSpan={12}>
                        <div ref="expanderBody" className="">
                            <div className="w-100">
                                <div>
                                    {" "}
                                    <div className="card border-right border-left rounded-0">
                                        <div className="d-flex p-2 justify-content-between">
                                            <div className="d-flex col-md-3 justify-content-between align-items-center">
                                                <div className="col-md-3 mr-3">
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
                                                <div className="col-md-9">
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
                                                                    {user.current_status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="icon-invert mb-1">
                                                        <img
                                                            src="/svgs/icons_new/mail.svg"
                                                            alt="email"
                                                            class="svg-xs mr-3 svg-gray"
                                                        />
                                                        <span>{user.email.toLowerCase()}</span>
                                                    </p>
                                                    <p className="icon-invert mb-0">
                                                        <img
                                                            src="/svgs/icons_new/phone.svg"
                                                            alt="phone"
                                                            class="svg-xs mr-3 svg-gray"
                                                        />
                                                        <span>
                                                            {user.phone == null || user.phone == ""
                                                                ? t(this.props.language?.layout?.no_contact_nt)
                                                                : user.phone}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            {process.env.ENVIORNMENT === "development" && this.props.userAdmin.role_id != 2 ?
                                                <div className="d-flex align-items-center pl-0 pr-4">
                                                    <span className="font-weight-bold mr-2">{t(this.props.language?.layout?.all_jobscoredetails_nt)}</span>
                                                    <div className="vertical"></div>
                                                    <div className="d-flex flex-column">
                                                        <div className="d-flex justify-content-start">
                                                            {" "}
                                                            <p class="col-6 mb-0">
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
                                                                    aria-valuenow="87"
                                                                    aria-label="skills"
                                                                    aria-valuemin="0"
                                                                    aria-valuemax="100"
                                                                    style={{
                                                                        width: ` ${
                                                                            // user.sov_job === undefined
                                                                            // ?
                                                                            user.sov_score &&
                                                                                user.sov_score.skills !== null
                                                                                ? user.sov_score.skills
                                                                                : 0
                                                                            // : user.sov_job &&
                                                                            //     user.sov_job.skills !== null
                                                                            //     ? user.sov_job.skills
                                                                            //     : 0
                                                                            }% `,
                                                                    }}></div>
                                                            </div>
                                                            <p class="col-2 mb-0 text-green d-flex justify-content-center">
                                                                {
                                                                    // user.sov_job === undefined
                                                                    //     ?
                                                                    user.sov_score && user.sov_score.skills !== null
                                                                        ? this.scoringNum(user.sov_score.skills)
                                                                        : 0
                                                                    // : user.sov_job && user.sov_job.skills !== null
                                                                    //     ? user.sov_job.skills
                                                                    //     : 0
                                                                }

                                                            </p>
                                                        </div>
                                                        <div className="d-flex justify-content-start">
                                                            {" "}
                                                            <p class="col-6 mb-0">
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
                                                                    aria-label="certification"
                                                                    aria-valuemin="0"
                                                                    aria-valuemax="100"
                                                                    style={{
                                                                        width: ` ${
                                                                            // user.sov_job === undefined
                                                                            // ?
                                                                            user.sov_score &&
                                                                                user.sov_score.certification !== null
                                                                                ? user.sov_score.certification
                                                                                : 0
                                                                            // : user.sov_job &&
                                                                            //     user.sov_job.certification !== null
                                                                            //     ? user.sov_job.certification
                                                                            //     : 0
                                                                            }% `,
                                                                    }}></div>
                                                            </div>
                                                            <p class="col-2 mb-0 text-green d-flex justify-content-center">
                                                                {
                                                                    // user.sov_job === undefined
                                                                    //     ?
                                                                    user.sov_score &&
                                                                        user.sov_score.certification !== null
                                                                        ? this.scoringNum(user.sov_score.certification)
                                                                        : 0
                                                                    // : user.sov_job &&
                                                                    //     user.sov_job.certification !== null
                                                                    //     ? user.sov_job.certification
                                                                    //     : 0
                                                                }

                                                            </p>
                                                        </div>
                                                        <div className="d-flex justify-content-start">
                                                            {" "}
                                                            <p
                                                                class="col-6 mb-0"
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
                                                                    aria-label="industry"
                                                                    aria-valuemin="0"
                                                                    aria-valuemax="100"
                                                                    style={{
                                                                        width: ` ${
                                                                            // user.sov_job === undefined
                                                                            // ?
                                                                            user.sov_score &&
                                                                                user.sov_score.industry !== null
                                                                                ? user.sov_score.industry
                                                                                : 0
                                                                            // : user.sov_job &&
                                                                            //     user.sov_job.industry !== null
                                                                            //     ? user.sov_job.industry
                                                                            //     : 0
                                                                            }% `,
                                                                    }}></div>
                                                            </div>
                                                            <p class="col-2 mb-0 text-green d-flex justify-content-center">
                                                                {
                                                                    // user.sov_job === undefined
                                                                    //     ?
                                                                    user.sov_score && user.sov_score.industry !== null
                                                                        ? this.scoringNum(user.sov_score.industry)
                                                                        : 0
                                                                    // : user.sov_job && user.sov_job.industry !== null
                                                                    //     ? user.sov_job.industry
                                                                    //     : 0
                                                                }

                                                            </p>
                                                        </div>
                                                        <div className="d-flex justify-content-start">
                                                            {" "}
                                                            <p
                                                                class="col-6 mb-0"
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
                                                                        width: ` ${
                                                                            // user.sov_job === undefined
                                                                            // ?
                                                                            user.sov_score &&
                                                                                user.sov_score.education !== null
                                                                                ? user.sov_score.education
                                                                                : 0
                                                                            // : user.sov_job &&
                                                                            //     user.sov_job.education !== null
                                                                            //     ? user.sov_job.education
                                                                            //     : 0
                                                                            }% `,
                                                                    }}></div>
                                                            </div>
                                                            <p class="col-2 mb-0 text-green d-flex justify-content-center">
                                                                {
                                                                    // user.sov_job === undefined
                                                                    //     ?
                                                                    user.sov_score &&
                                                                        user.sov_score.education !== null
                                                                        ? this.scoringNum(user.sov_score.education)
                                                                        : 0
                                                                    // : user.sov_job && user.sov_job.education !== null
                                                                    //     ? user.sov_job.education
                                                                    //     : 0
                                                                }

                                                            </p>
                                                        </div>
                                                        <div className="d-flex justify-content-start">
                                                            <p
                                                                class="col-6 mb-0"
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
                                                                    aria-label="management level"
                                                                    aria-valuemin="0"
                                                                    aria-valuemax="100"
                                                                    style={{
                                                                        width: ` ${
                                                                            // user.sov_job === undefined
                                                                            // ?
                                                                            user.sov_score &&
                                                                                user.sov_score.management_level !==
                                                                                null
                                                                                ? user.sov_score.management_level
                                                                                : 0
                                                                            // : user.sov_job &&
                                                                            //     user.sov_job.management_level !== null
                                                                            //     ? user.sov_job.management_level
                                                                            //     : 0
                                                                            }% `,
                                                                    }}></div>
                                                            </div>
                                                            <p class="col-2 mb-0 text-green d-flex justify-content-center">
                                                                {
                                                                    // user.sov_job === undefined
                                                                    //     ?
                                                                    user.sov_score &&
                                                                        user.sov_score.management_level !== null
                                                                        ? this.scoringNum(user.sov_score.management_level)
                                                                        : 0
                                                                    // : user.sov_job &&
                                                                    //     user.sov_job.management_level !== null
                                                                    //     ? user.sov_job.management_level
                                                                    //     : 0
                                                                }

                                                            </p>
                                                        </div>
                                                        <div className="d-flex justify-content-start">
                                                            {" "}
                                                            <p
                                                                class="col-6 mb-0"
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
                                                                    aria-label="jobtitle"
                                                                    aria-valuemin="0"
                                                                    aria-valuemax="100"
                                                                    style={{
                                                                        width: ` ${
                                                                            // user.sov_job === undefined
                                                                            // ?
                                                                            user.sov_score &&
                                                                                user.sov_score.job_title !== null
                                                                                ? user.sov_score.job_title
                                                                                : 0
                                                                            // : user.sov_job &&
                                                                            //     user.sov_job.job_title !== null
                                                                            //     ? user.sov_job.job_title
                                                                            //     : 0
                                                                            }% `,
                                                                    }}></div>
                                                            </div>
                                                            <p class="col-2 mb-0 text-green d-flex justify-content-center">
                                                                {
                                                                    // user.sov_job === undefined
                                                                    //     ?
                                                                    user.sov_score &&
                                                                        user.sov_score.job_title !== null
                                                                        ? this.scoringNum(user.sov_score.job_title)
                                                                        : 0
                                                                    // : user.sov_job && user.sov_job.job_title !== null
                                                                    //     ? user.sov_job.job_title
                                                                    //     : 0
                                                                }

                                                            </p>
                                                        </div>
                                                    </div>
                                                </div> : <div className="d-flex align-items-center pl-0 pr-4"></div>}
                                            <div className="d-flex flex-column col-md-2 justify-content-center align-items-start px-0">
                                                <div className="mb-2">
                                                    <strong>{t(this.props.language?.layout?.ep_jobtitle_updatedon)} :</strong>&nbsp;
                                                    <span className="text-muted">
                                                        {renderToLocaleDate(user.updated_at)}
                                                    </span>
                                                </div>
                                                <div className="mb-2">
                                                    <strong>{t(this.props.language?.layout?.ep_jobtitle_otherapplied_jobs)} : </strong>&nbsp;
                                                    <span>{user.other_jobs_count} {t(this.props.language?.layout?.header_jobs)}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-2 d-flex align-items-center justify-content-center">
                                                <div>
                                                    <div className="pb-3">
                                                        <a
                                                            aria-labelledby="Download Resume"
                                                            className="icon-invert btn-svg-sm rounded btn-light text-decoration-none"
                                                            href={"/media/" + user.resume}
                                                            download
                                                            onClick={this.downloadResume}>
                                                            <img
                                                                src="/svgs/icons_new/download.svg"
                                                                alt="search"
                                                                className={` svg-xs mr-2 ${user.resume == null || user.resume == ""
                                                                    ? "disabled"
                                                                    : ""
                                                                    }`}
                                                            />
                                                            {t(this.props.language?.layout?.ep_jobtitle_downloadresume)}
                                                        </a>
                                                        {/* <a
                                                            href={"/media/" + user.resume}
                                                            download
                                                            class={`text-dark ${
                                                                user.resume == null || user.resume == ""
                                                                    ? "disabled"
                                                                    : ""
                                                            }`}>
                                                        </a> */}
                                                    </div>
                                                    <div className="icon-invert">
                                                        <Link
                                                            aria-labelledby="View Profile"
                                                            className="btn-svg-sm rounded btn-light text-decoration-none"
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
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(withTranslation()(RowData));
