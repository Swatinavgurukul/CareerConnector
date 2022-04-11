import React, { Component } from "react";
import { Link } from "react-router-dom";
import { renderToLocaleDate } from "../../../modules/helpers.jsx";
import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { capitalizeFirstLetter } from "../../../modules/helpers.jsx";
// import { jobStatus } from "../../../components/constants.jsx";
import { truncate } from "../../../modules/helpers.jsx";
import { withTranslation } from 'react-i18next';
import { job_type, job_status1 , salary_time_type } from "../../../../translations/helper_translation.jsx";


class RowData extends Component {
    constructor(props) {
        super(props);
    }
    state = { expanded: false };

    toggleExpander = (e) => {
        if (!this.state.expanded) {
            this.setState({ expanded: true });
        } else {
            this.setState({ expanded: false });
        }
    };
    change = (event) => {
        this.props.updateStatus(event.target.value, this.props.user.slug);
    };

    statusChange = (value) => {
        this.props.updateStatus(value, this.props.user.slug);
    };

    getNames = (city, state, country) => {
        let finalString = "";
        if (city && city.length > 0) {
            finalString += city;
        }
        if (state && state.length > 0) {
            finalString += ", " + state;
        }
        if (country && country.length > 0) {
            finalString += ", " + country;
        }
        return finalString;
    };

    jobstatusHandler = () => {
        const jobStatus = [{ key: "active", value: this.props?.t(this.props.language?.layout?.ep_jobstatus_active) },
        { key: "paused", value: this.props?.t(this.props.language?.layout?.ep_jobstatus_paused) },
        { key: "closed", value: this.props?.t(this.props.language?.layout?.ep_jobstatus_closed) },
        { key: "draft", value: this.props?.t(this.props.language?.layout?.ep_jobstatus_draft) },
        { key: "Offered", value: this.props?.t(this.props.language?.layout?.ep_jobstatus_offered) }];
        return jobStatus;
    }
    statusHandler = (language, key) => {
        return(job_status1[language][key]);
    }
    jobTypeHandler = (language, key) => {
        return(job_type[language][key]);
    }
    salaryTimeType = (language, key) => {
        return(salary_time_type[language][key]);
    }
    render() {
        const { t } = this.props;
        let jobStatus = this.jobstatusHandler();
        const { user, actionsToPerform, theme } = this.props;
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
                <td className="pl-3 align-middle">
                    {" "}
                    <div className="d-flex justify-content-between align-items-center text-capitalize">
                        <span title={user.title}>
                            <Link
                                aria-describedby="Job Title"
                                to={{
                                    pathname: `/jobs/${user.slug}/applications`,
                                    state: { slug: user.slug },
                                }}>

                                {/* {this.props.languageName == "en" ? truncate(user.title, 35) : "" } */}
                                {this.props.languageName == "en" ?
                                    user.title == null || user.title =="" ? truncate(user.title_fr, 35) : truncate(user.title, 35) : ""}
                                {this.props.languageName == "esp" ?
                                    user.title_esp == null || user.title_esp == ""  ? user.title ? truncate(user.title, 35) : truncate(user.title_fr, 35) : truncate(user.title_esp, 35) : ""
                                }
                                {this.props.languageName == "fr" ?
                                    user.title_fr == null || user.title_fr == "" ? truncate(user.title, 35) : truncate(user.title_fr, 35) : ""
                                }
                            </Link>{" "}
                        </span>
                        <button
                            type="button"
                            aria-describedby="closeDescription"
                            class="btn btn-sm btn-light icon-invert"
                            title={t(this.props.language?.layout?.open_nt)}
                            onClick={this.toggleExpander}>
                            <img src="/svgs/icons_new/chevron-down.svg" alt="chevron" className="svg-xs mt-1" />
                        </button>
                    </div>
                </td>
                {this.props.user_type == 2 || this.props.user_type == 5 ? (
                    <td className="align-middle user-select-none">
                        <span
                            className="border-0 btn-sm py-0 text-capitalize"
                            style={
                                user.status == "active"
                                    ? theme.active_color
                                    : user.status == "paused"
                                        ? theme.paused_color
                                        : user.status == "draft"
                                            ? theme.interview_color
                                            : user.status == "closed"
                                                ? theme.closed_color
                                                : user.status == "Offered"
                                                    ? theme.offer_color
                                                    : theme.all_color
                            }>
                            {this.statusHandler(this.props?.languageName, user.status)}
                        </span>
                    </td>
                ) : (
                    <td className="align-middle">
                        <select
                            className="border-0 btn-sm py-0 text-capitalize"
                            style={
                                user.status == "active"
                                    ? theme.active_color
                                    : user.status == "paused"
                                        ? theme.paused_color
                                        : user.status == "draft"
                                            ? theme.interview_color
                                            : user.status == "closed"
                                                ? theme.closed_color
                                                : user.status == "Offered"
                                                    ? theme.offer_color
                                                    : theme.all_color
                            }
                            aria-label="status"
                            onChange={this.change}
                            value={user.status}>
                            {jobStatus.map((filter) =>
                                <option className="bg-white" key={filter.key} value={filter.key}>
                                    {filter.value}
                                </option>
                            )}
                        </select>
                    </td>
                )}
                {this.props.user_type == null &&
                    <td className="pl-3 align-middle">{user.employer_partners}</td>}

                <td className="pl-3 align-middle">
                    {user.remote_location == false ? (
                        user.display_name !== "" && user.display_name !== null ?
                            this.getNames(user.display_name, user.state, user.country) : ""
                    )
                        : t(this.props.language?.layout?.remotelocation_nt)}
                </td>
                <td className="pl-3 align-middle  text-capitalize">
                    {this.jobTypeHandler(this.props?.languageName, user.job_type)}
                </td>
                {this.props.user_type == null ? <td className="pl-3 align-middle">{user.user_is_ca ? t(this.props.language?.layout?.globallocations_canada) :
                    t(this.props.language?.layout?.globallocations_us)}</td> : ""}
                <td className="pl-3 align-middle">{renderToLocaleDate(user.updated_at)}</td>
                <td className="pl-3 align-middle text-center">{user.application_count}</td>
                {this.props.user_type == 2 || this.props.user_type == 5 ? (
                    <td className="align-middle text-center px-0">
                        {/* <button className="btn btn-light"> */}
                        <label tabIndex="0">
                            <Link
                                aria-hidden="true"
                                tabIndex="-1"
                                className="btn btn-light text-dark text-decoration-none"
                                to={{
                                    pathname: `/jobs/${user.slug}/applications`,
                                    state: { slug: user.slug },
                                }}>
                                {t(this.props.language?.layout?.ep_jobs_view)}
                            </Link>
                            {/* </button> */}
                        </label>
                    </td>
                ) : (
                    <td className="align-middle text-left px-0">
                        {user.status == "draft" ? (
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button className="btn btn-light" onClick={() => this.statusChange("active")}>
                                    {t(this.props.language?.layout?.all_publish_nt)}
                                </button>
                                <Link
                                    tabIndex="-1"
                                    to={{
                                        pathname: `/jobs/edit/${user.slug}`,
                                        state: { slug: user.slug },
                                    }}>
                                    <button tabIndex="0" className="btn btn-light">{t(this.props.language?.layout?.all_edit_nt)}</button>
                                </Link>
                                {/* <button className="btn btn-light">Delete</button> */}
                            </div>
                        ) : user.status == "active" ? (
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button className="btn btn-light" onClick={() => this.statusChange("paused")}>
                                    {t(this.props.language?.layout?.all_pause_nt)}
                                </button>
                                <Link
                                    className="text-dark text-decoration-none"
                                    to={{
                                        pathname: `/jobs/${user.slug}/applications`,
                                        state: { slug: user.slug },
                                    }}>
                                    <button tabIndex="-1" className="btn btn-light ">{t(this.props.language?.layout?.ep_jobs_view)}</button>
                                </Link>
                                <button className="btn btn-light" onClick={() => this.statusChange("closed")}>
                                    {t(this.props.language?.layout?.all_close_nt)}
                                </button>
                            </div>
                        ) : user.status == "paused" ? (
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button className="btn btn-light" onClick={() => this.statusChange("active")}>
                                    {t(this.props.language?.layout?.all_activate_nt)}
                                </button>
                                <button className="btn btn-light"
                                    onClick={() => this.statusChange("closed")}>{t(this.props.language?.layout?.ep_jobs_closed)}</button>
                                <Link
                                    tabIndex="-1"
                                    to={{
                                        pathname: `/jobs/edit/${user.slug}`,
                                        state: { slug: user.slug },
                                    }}>
                                    <button className="btn btn-light"> {t(this.props.language?.layout?.all_edit_nt)}</button>
                                </Link>
                            </div>
                        ) : user.status == "offered" ? (
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button className="btn btn-light" onClick={() => this.statusChange("offered")}>
                                    {t(this.props.language?.layout?.jobs_view)}  {t(this.props.language?.layout?.all_offer)}
                                </button>
                                <button className="btn btn-light" onClick={() => this.statusChange("closed")}>
                                    {t(this.props.language?.layout?.ep_jobtitle_accepted)}
                                </button>
                                <button className="btn btn-light" onClick={() => this.statusChange("active")}>
                                    {t(this.props.language?.layout?.ep_application_declined)}
                                </button>
                            </div>
                        ) : user.status == "closed" ? (
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button className="btn btn-light" onClick={() => this.statusChange("active")}>
                                    {t(this.props.language?.layout?.all_publish_nt)}
                                </button>
                            </div>
                        ) : (
                            ""
                        )}
                    </td>
                )}
            </tr>,
            this.state.expanded && (
                <tr className="expandable" key="tr-expander">
                    <td className="p-0 align-middle text-capitalize" colSpan={12}>
                        <div ref="expanderBody" className="">
                            <div className="w-100">
                                <div>
                                    {" "}
                                    <div className="card border-right border-left rounded-0">
                                        <div className="justify-content-between d-flex p-md-2 p-lg-3">
                                            <div className="d-flex align-items-center pr-3">
                                                <div>
                                                    <div>
                                                        <div className="d-flex mb-1 justify-content-between">
                                                            {/* <h5>{truncate(user.title, 35)}</h5> */}
                                                            <h5>
                                                            {this.props.languageName == "en" ?
                                                                user.title == null || user.title =="" ? truncate(user.title_fr, 35) : truncate(user.title, 35) : ""}
                                                                {this.props.languageName == "esp" ?
                                                                    user.title_esp == null|| user.title_esp == "" ? user.title ? truncate(user.title, 35) : truncate(user.title_fr, 35) : truncate(user.title_esp, 35) : ""
                                                                }
                                                                {this.props.languageName == "fr" ?
                                                                    user.title_fr == null|| user.title_fr == "" ? truncate(user.title, 35) : truncate(user.title_fr, 35) : ""
                                                                }
                                                            </h5>
                                                            <div className="ml-3">
                                                                <span
                                                                    className="px-2 small rounded"
                                                                    style={
                                                                        user.status == "active"
                                                                            ? theme.active_color
                                                                            : user.status == "paused"
                                                                                ? theme.paused_color
                                                                                : user.status == "draft"
                                                                                    ? theme.interview_color
                                                                                    : user.status == "closed"
                                                                                        ? theme.closed_color
                                                                                        : user.status == "Offered"
                                                                                            ? theme.offer_color
                                                                                            : theme.all_color
                                                                    }>
                                                                    {this.statusHandler(this.props?.languageName, user.status)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="mb-1">
                                                        {t(this.props.language?.layout?.ep_jobs_experience)} &nbsp;:&nbsp;{" "}
                                                        <span className="text-muted">
                                                            {user.experience_min != null &&
                                                                (user.experience_max == null ||
                                                                    user.experience_max == "0") ? (
                                                                <span>
                                                                    starts at{" "}
                                                                    {user.experience_min < 9 && user.experience_min > 1
                                                                        ? "0" + user.experience_min + " " + t(this.props.language?.layout?.all_years_nt)
                                                                        : "0" + user.experience_min + " " +  t(this.props.language?.layout?.year_nt)}
                                                                </span>
                                                            ) : (user.experience_min == null ||
                                                                user.experience_min == "0") &&
                                                                user.experience_max != null ? (
                                                                <span>
                                                                    {t(this.props.language?.layout?.upto_nt)}{" "}
                                                                    {user.experience_max > 1
                                                                        ? user.experience_max + " " + t(this.props.language?.layout?.all_years_nt)
                                                                        : user.experience_max + " " + t(this.props.language?.layout?.year_nt)}
                                                                </span>
                                                            ) : user.experience_min != null &&
                                                                user.experience_max != null ? (
                                                                <span>
                                                                    {user.experience_min < 9
                                                                        ? "0" + user.experience_min
                                                                        : user.experience_min}{" "}
                                                                    -{" "}
                                                                    {user.experience_max < 9
                                                                        ? "0" + user.experience_max
                                                                        : user.experience_max}{" "}
                                                                    {t(this.props.language?.layout?.all_years_nt)}
                                                                </span>
                                                            ) : (
                                                                " "
                                                            )}
                                                        </span>
                                                    </p>
                                                    <p className="mb-0">
                                                        {t(this.props.language?.layout?.ep_jobs_salary)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        :&nbsp;{" "}
                                                        <span className="text-grey">
                                                            {user.salary_min != null &&
                                                                (user.salary_max == null || user.salary_max == "0") ? (
                                                                <span>
                                                                    {t(this.props.language?.layout?.startsat_nt)} $
                                                                    {user.salary_min < 9
                                                                        ? "0" + user.salary_min
                                                                        : user.salary_min}
                                                                </span>
                                                            ) : (user.salary_min == null || user.salary_min == "0") &&
                                                                user.salary_max != null ? (
                                                                <span>
                                                                    {t(this.props.language?.layout?.upto_nt)} $
                                                                    {user.salary_max < 9
                                                                        ? "0" + user.salary_max
                                                                        : user.salary_max}
                                                                </span>
                                                            ) : user.salary_min != null && user.salary_max != null ? (
                                                                <span>
                                                                    $
                                                                    {user.salary_min < 9
                                                                        ? "0" + user.salary_min
                                                                        : user.salary_min}{" "}
                                                                    - $
                                                                    {user.salary_max < 9
                                                                        ? "0" + user.salary_max
                                                                        : user.salary_max}
                                                                </span>
                                                            ) : (
                                                                " "
                                                            )}{" "}
                                                            {user.salary_min == null && user.salary_max == null
                                                                ? ""
                                                                : this.salaryTimeType(this.props?.languageName, user.salary_frequency)
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column justify-content-center pr-3">
                                                <p className="mb-1 d-flex">
                                                    <div>{t(this.props.language?.layout?.ep_jobs_postedon)}</div>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;
                                                    <div className="text-muted">
                                                        {user.job_start_date == null
                                                            ? "Not yet published"
                                                            : renderToLocaleDate(user.job_start_date)}
                                                    </div>
                                                </p>
                                                <p className="mb-1 d-flex">
                                                    <div>{t(this.props.language?.layout?.ep_jobs_publishedon)}</div>&nbsp;&nbsp;:&nbsp;&nbsp;
                                                    <div className="text-muted">
                                                        {user.job_publish_date == null
                                                            ? "N/A"
                                                            : renderToLocaleDate(user.job_publish_date)}
                                                    </div>
                                                </p>
                                                <p className="mb-0 d-flex">
                                                    <div>{t(this.props.language?.layout?.ep_jobs_closingon)}</div>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;
                                                    <div className="text-muted">
                                                        {user.job_end_date == null
                                                            ? "N/A"
                                                            : renderToLocaleDate(user.job_end_date)}
                                                    </div>
                                                </p>
                                                {/* <strong>Industry</strong>
                                                <span className="text-muted">{user.industry}</span>
                                                <strong>Department</strong>
                                                <span className="text-muted">Product Management</span> */}
                                            </div>
                                            {/* <div className="d-flex flex-column col-md-2 justify-content-center">
                                                <strong>Hiring manager</strong>
                                                <span className="text-muted">M.S.Subhalaxmi</span>
                                            </div> */}
                                            <div className="d-flex flex-column justify-content-center pr-">
                                                <strong>{t(this.props.language?.layout?.ep_jobs_joblocation)}</strong>
                                                <span className="text-muted">
                                                    {this.getNames(user.display_name, user.state)}
                                                </span>
                                                <strong>{t(this.props.language?.layout?.ep_jobs_jobtype)}</strong>
                                                <span className="text-muted">
                                                    {user.job_type === null
                                                        ? "---"
                                                        : this.jobTypeHandler(this.props?.languageName, user.job_type)}
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column justify-content-center">
                                                <div className="icon-invert pb-3">
                                                    <img
                                                        src="/svgs/icons_new/external-link.svg"
                                                        alt="search"
                                                        className="svg-xs mr-2"
                                                    />
                                                    <span>
                                                        <Link
                                                            className="text-dark"
                                                            to={{
                                                                pathname: `/jobs/${user.slug}/applications`,
                                                                state: { slug: user.slug },
                                                            }}>
                                                            {t(this.props.language?.layout?.ep_jobs_view)}
                                                        </Link>
                                                    </span>
                                                </div>
                                                <div className="icon-invert">
                                                    <img
                                                        src="/svgs/icons_new/globe.svg"
                                                        alt="search"
                                                        className="svg-xs mr-2"
                                                    />
                                                    <Link
                                                        className="text-dark"
                                                        to={{
                                                            pathname: `/jobs/${user.slug}`,
                                                            data: user.slug,
                                                            state: user.slug,
                                                        }}>
                                                        <span>{t(this.props.language?.layout?.ep_jobs_goto_carrersite)}</span>
                                                    </Link>
                                                </div>
                                                {/* <div className="d-flex">
                                                    <img
                                                        src="/svgs/icons_new/trending-up.svg"
                                                        alt="search"
                                                        className="svg-xs mr-2"
                                                    />
                                                    <span className="pointer">
                                                        <Dropdown drop="down">
                                                            <Dropdown.Toggle
                                                                as={CustomToggle}
                                                                id="dropdown-custom-components">
                                                                View applied boards
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className="bg-light thin-scrollbar dropdown-height">
                                                                <Dropdown.Item
                                                                    eventKey="1"
                                                                    className="p-2 dropdown_item">
                                                                    <div className="d-flex small align-items-baseline">
                                                                        <h6 className="mb-0 ml-2">Linkedin</h6>
                                                                        &nbsp;&nbsp;(Published on 10-2-2021)
                                                                    </div>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    eventKey="1"
                                                                    className="p-2 dropdown_item">
                                                                    <div className="d-flex small align-items-baseline">
                                                                        <h6 className="mb-0 ml-2">Indeed</h6>
                                                                        &nbsp;&nbsp;(Published on 10-2-2021)
                                                                    </div>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    eventKey="1"
                                                                    className="p-2 dropdown_item">
                                                                    <div className="d-flex small align-items-baseline">
                                                                        <h6 className="mb-0 ml-2">Naukri</h6>
                                                                        &nbsp;&nbsp;(Published on 10-2-2021)
                                                                    </div>
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    eventKey="1"
                                                                    className="p-2 dropdown_item">
                                                                    <div className="d-flex small align-items-baseline">
                                                                        <h6 className="mb-0 ml-2">Careerbuilder</h6>
                                                                        &nbsp;&nbsp;(Published on 10-2-2021)
                                                                    </div>
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </span>
                                                </div> */}
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
        user_type: state.authInfo.user.role_id,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName
    };
}

export default connect(mapStateToProps, {})(withTranslation()(RowData));
