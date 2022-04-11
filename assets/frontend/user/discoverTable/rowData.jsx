import React, { Component } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { renderToLocaleDate } from "../../modules/helpers.jsx";
import { truncate } from "../../modules/helpers.jsx";
import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { Mailto } from "../../components/constants.jsx";
import { withTranslation } from 'react-i18next';
import { useOuterClick } from "../../modules/helpers.jsx";

class RowData extends Component {
    state = { expanded: false, favourite: true };

    toggleExpander = (e) => {
        if (!this.state.expanded) {
            this.setState({ expanded: true });
        } else {
            this.setState({ expanded: false });
        }
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

    downloadResume = () => {
        let id = {
            user: this.props.user.id
        }
        axios.post("api/v1/users/resume-download-log", id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        }).then((response) => {
            // toast.success("resume downloaded successfully");
        })
        .catch((error) => {
            toast.error("Somthing went wrong.");
        });
    };

    render() {
        const { t } = this.props;
        const { user, actionsToPerform, theme, assignJobHandler, inviteCandidateHandler } = this.props;
        const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
            <p
                className="text-dark mb-0"
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
                <td className="align-middle">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div
                                className="rounded-circle mr-2 text-center d-flex align-items-center justify-content-center text-uppercase mt-1"
                                style={{ width: "60px", height: "60px", backgroundColor: "#80808029" }}>
                                {user.user_image == "" || user.user_image == null ? (
                                    (user.first_name == null || user.first_name == "") &&
                                        (user.last_name == null || user.last_name == "") ? (
                                        user?.username?.charAt(0)
                                    ) : (
                                        <span>
                                            {user.first_name != null &&
                                                user.first_name != "" &&
                                                user.first_name.charAt(0)}
                                            {user.last_name != null && user.last_name != "" && user.last_name.charAt(0)}
                                        </span>
                                    )
                                ) : (
                                    <img src={user.user_image} className="svg-xl" alt="candidate profile image" />
                                )}
                            </div>
                            <div>
                                <h5 className="text-capitalize">
                                    {(user.first_name == null || user.first_name == "") &&
                                        (user.last_name == null || user.last_name == "") ? (
                                        user.username
                                    ) : (
                                        <span>
                                            {user.first_name}&nbsp;{user.last_name}
                                        </span>
                                    )}
                                </h5>
                                <div className="d-flex justify-content-between">
                                    <p className="icon-invert d-flex mb-0 mr-2">
                                        <img src="/svgs/icons_new/phone.svg" class="svg-xs mr-1 mt-1 svg-gray" alt="phone" />
                                        <span style={{ wordBreak: "normal" }}>
                                            {user.phone == null || user.phone == ""
                                                ? t(this.props.language?.layout?.no_contact_nt)
                                                : user.phone}
                                        </span>
                                    </p>
                                    {user.user_city ? (
                                        <p className="icon-invert d-flex align-items-center mb-0">
                                            <img src="/svgs/icons_new/map-pin.svg" class="svg-xs mr-1 svg-gray" alt="location" />
                                            <span className="text-muted" title={user.user_city}>
                                                {truncate(user.user_city, 20)}
                                            </span>
                                        </p>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="btn btn-sm btn-light icon-invert"
                            aria-label="Open"
                            title="Open"
                            onClick={this.toggleExpander}>
                            <img src="/svgs/icons_new/chevron-down.svg" alt="chevron" className="svg-xs mt-1" />
                        </button>
                    </div>
                </td>
                <td className="align-middle">
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
                                stroke-dasharray={`${user?.weighted_score != null ? user.weighted_score : 0},100`}
                                d="M18 2.0845
                               a 15.9155 15.9155 0 0 1 0 31.831
                               a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="23.35" class="percentage text-green">
                                {user?.weighted_score != null ? user.weighted_score : 0}
                            </text>
                        </svg>
                    </div>
                </td>



                <td className="pl-3 align-middle">
                    <p className="icon-invert mb-1 mr-3 d-flex">
                        <img src="/svgs/icons_new/mail.svg" class="svg-xs mr-1 mt-1 svg-gray" alt="Email" />
                        <Mailto email={user.email} subject="" body="">
                            <span style={{ wordBreak: "normal" }} title={user.email}>{truncate(user.email, 20)}</span>
                        </Mailto>
                    </p>
                </td>

                <td className="pl-3 align-middle">{user.experience}</td>
                <td className="pl-3 align-middle">
                    {user.job_company}
                    {/* {user.user_city} {user.user_state_code} */}
                </td>
                <td className="pl-3 align-middle text-capitalize">{user.jobs_applied_count != null ? user.jobs_applied_count : 0}</td>
                <td className="align-middle text-center px-0 ">
                    <>
                        <div class="btn-group  position-relative" role="group" aria-label="Basic example">
                            <Link to={`/jobSeekers/${user.id}`} tabIndex="-1">
                                <button className="btn btn-light btn-small" tabIndex="0">{t(this.props.language?.layout?.sp_js_view)}</button>
                            </Link>
                            <button
                                class="btn btn-light btn-small"
                                onClick={() => {
                                    actionsToPerform("delete");
                                    inviteCandidateHandler(user.id);
                                }}>
                                {t(this.props.language?.layout?.sp_js_invite)}
                            </button>
                            {/* {process.env.CLIENT_NAME === "cc" && */}
                            {/* <Dropdown drop="down" className="pt-1 bg-light">
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    <img src="/svgs/icons_new/more-vertical.svg" className="svg-sm pointer" alt="more" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="drop-menu-position">
                                    <Dropdown.Item eventKey="1" className="dropdown_item">
                                        <div className="" onClick={() => actionsToPerform("moreOptions", user.user_id, user.archive)}>
                                            {user.archive == false ? t(this.props.language?.layout?.all_archive_nt) : t(this.props.language?.layout?.all_unarchive_nt)}
                                        </div>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}
                            {/* } */}
                        </div>

                    </>
                    {/* <button
                        class="btn btn-light btn-small"
                        onClick={() => {
                            actionsToPerform("delete");
                            assignJobHandler(user.user_id);
                        }}>
                        Assign
                    </button> */}
                    {/* </div> */}
                </td>
            </tr>,
                        this.state.expanded ? (
                            <tr className="expandable" key="tr-expander">
                                <td className="p-0 align-middle" colSpan={12}>
                                    <div ref="expanderBody" className="">
                                        <div className="w-100">
                                            <div>
                                                <div className="card border-right border-left rounded-0">
                                                    <div className="d-flex p-2 justify-content-between">
                                                        <div className="d-flex col-lg-3 col-md-5 justify-content-between align-items-center">
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
                                                                            <span style={{ wordBreak: "normal" }}>
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
                                                                            {" "}
                                                                            {(user.first_name == null || user.first_name == "") &&
                                                                                (user.last_name == null || user.last_name == "") ? (
                                                                                user.username
                                                                            ) : (
                                                                                <span style={{ wordBreak: "normal" }}>
                                                                                    {user.first_name}&nbsp;{user.last_name}
                                                                                </span>
                                                                            )}
                                                                        </h5>
                                                                    </div>
                                                                </div>
                                                                <p className="icon-invert mb-1">
                                                                    <img
                                                                        src="/svgs/icons_new/mail.svg"
                                                                        alt="email"
                                                                        class="svg-xs mr-3 svg-gray"
                                                                    />
                                                                    <span>{truncate(user.email.toLowerCase(), 22)}</span>
                                                                </p>
                                                                <p className="icon-invert mb-0">
                                                                    <img
                                                                        src="/svgs/icons_new/phone.svg"
                                                                        alt="phone"
                                                                        class="svg-xs mr-3 svg-gray"
                                                                    />
                                                                    <span style={{ wordBreak: "normal" }}>
                                                                        {user.phone == null || user.phone == ""
                                                                            ? t(this.props.language?.layout?.no_contact_nt)
                                                                            : user.phone}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                            <div className="d-flex align-items-center pl-0 pr-4">
                                                                <span className="font-weight-bold mr-2">{t(this.props.language?.layout?.all_jobscoredetails_nt)}</span>
                                                                <div className="vertical"></div>
                                                                <div className="d-flex flex-column">
                                                                    <div className="d-flex justify-content-start">
                                                                        {" "}
                                                                        <p class="col-6 mb-0">
                                                                            {t(this.props.language?.layout?.js_profile_skill)}
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
                                                                                        user.job_score_details &&
                                                                                            user.job_score_details.skills !== null
                                                                                            ? user.job_score_details.skills
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
                                                                                user.job_score_details && user.job_score_details.skills !== null
                                                                                    ? this.scoringNum(user.job_score_details.skills)
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
                                                                                        user.job_score_details &&
                                                                                            user.job_score_details.certification !== null
                                                                                            ? user.job_score_details.certification
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
                                                                                user.job_score_details &&
                                                                                    user.job_score_details.certification !== null
                                                                                    ? this.scoringNum(user.job_score_details.certification)
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
                                                                                        user.job_score_details &&
                                                                                            user.job_score_details.industry !== null
                                                                                            ? user.job_score_details.industry
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
                                                                                user.job_score_details && user.job_score_details.industry !== null
                                                                                    ? this.scoringNum(user.job_score_details.industry)
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
                                                                                        user.job_score_details &&
                                                                                            user.job_score_details.education !== null
                                                                                            ? user.job_score_details.education
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
                                                                                user.job_score_details &&
                                                                                    user.job_score_details.education !== null
                                                                                    ? this.scoringNum(user.job_score_details.education)
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
                                                                                        user.job_score_details &&
                                                                                            user.job_score_details.management_level !==
                                                                                            null
                                                                                            ? user.job_score_details.management_level
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
                                                                                user.job_score_details &&
                                                                                    user.job_score_details.management_level !== null
                                                                                    ? this.scoringNum(user.job_score_details.management_level)
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
                                                                                        user.job_score_details &&
                                                                                            user.job_score_details.job_title !== null
                                                                                            ? user.job_score_details.job_title
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
                                                                                user.job_score_details &&
                                                                                    user.job_score_details.job_title !== null
                                                                                    ? this.scoringNum(user.job_score_details.job_title)
                                                                                    : 0
                                                                                // : user.sov_job && user.sov_job.job_title !== null
                                                                                //     ? user.sov_job.job_title
                                                                                //     : 0
                                                                            }

                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                                            <div>
                                                                <div className="pb-3">
                                                                    <a
                                                                        aria-labelledby="Download Resume"
                                                                        className="icon-invert btn-svg-sm rounded btn-light text-decoration-none"
                                                                        href={"/media/" + user.resume_file}
                                                                        download
                                                                        onClick={this.downloadResume}>
                                                                        <img
                                                                            src="/svgs/icons_new/download.svg"
                                                                            alt="search"
                                                                            className={` svg-xs mr-2 ${user.resume_file == null || user.resume_file == ""
                                                                                ? "disabled"
                                                                                : ""
                                                                                }`}
                                                                        />
                                                                        {t(this.props.language?.layout?.ep_jobtitle_downloadresume)}
                                                                    </a>
                                                                </div>
                                                                <div className="icon-invert">

                                                                    <Link
                                                                        aria-labelledby="View Profile"
                                                                        className="btn-svg-sm rounded btn-light text-decoration-none"
                                                                        // to={{
                                                                        //     pathname: "/applications/" + user.id,
                                                                        //     state: {
                                                                        //         user_id: user.user_id,
                                                                        //         jobscore: user.sov_job == undefined ? user.job_score_details : user.sov_job,
                                                                        //         title: user.job_title,
                                                                        //         slug: user.job_slug,
                                                                        //         type: this.props.type,
                                                                        //         weightedScore: user.weighted_score,
                                                                        //         totalScore: user?.totalScore
                                                                        //     },
                                                                        // }}
                                                                        to={`/jobSeekers/${user.id}`}
                                                                        >
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
                        ) : null,
        ];
    }
}
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userRole: state.authInfo.user,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(withTranslation()(RowData));
