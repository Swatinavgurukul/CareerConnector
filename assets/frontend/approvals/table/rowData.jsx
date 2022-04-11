import React, { Component } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { renderToLocaleDate } from "../../modules/helpers.jsx";
import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { applicationStatus } from "../../components/constants.jsx";
import { truncate } from "../../modules/helpers.jsx";
import { event } from "@fullstory/browser";
import { calculateScore } from "../../components/constants.jsx";
import { Fragment } from "react";
import { withTranslation } from 'react-i18next';

class RowData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            favourite: true,
        };
    }


    statusChange = (value, id) => {
        this.props.onChangeStatus(value, id);
    };


    render() {
        const { t } = this.props;
        const { user, actionsToPerform, closeModal, theme } = this.props;
        const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
            <p
                className="text-dark mb-0 mt-1"
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
                <td className="pl-3 text-capitalize align-middle">
                    <div className="d-flex justify-content-between align-items-center">
                        {/* <Link
                            to={{
                                pathname: "/applications/" + user.id,
                                state: {
                                    user_id: user.user_id,
                                    jobscore: user.sov_score,
                                    title: user.job_title,
                                    slug: user.job_slug,
                                    type: this.props.type,
                                },
                            }}> */}
                        {(user.full_name == null || user.full_name == "") ? (
                            null
                        ) : (
                            <span>
                                {user.full_name}
                            </span>
                        )}
                        {/* </Link> */}
                    </div>
                </td>
                <td className="align-middle">{user.email}</td>

                {/* {this.props.userAdmin.role_id == null ? (
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
                                <option className="bg-white" key={filter} value={filter}>
                                    {filter}
                                </option>
                            ))}
                        </select>
                    </td>
                )} */}
                <td className="pl-3 align-middle">{user.tenant_name}</td>
                <td className="pl-3 align-middle">{user.user_type}</td>
                {this.props.userAdmin.role_id == null ? <td className="pl-3 align-middle">{user.is_ca ?
                    t(this.props.language?.layout?.globallocations_canada) :
                    t(this.props.language?.layout?.globallocations_us)}</td> : ""}
                <td className="pl-3 align-middle text-capitalize">
                    <div>
                        <span
                            className="px-2 rounded"
                            style={
                                user.current_status == "approved"
                                    ? theme.active_color
                                    : user.job_status == "paused"
                                        ? theme.paused_color
                                        : user.job_status == "rejected"
                                            ? theme.interview_color
                                            : theme.all_color
                            }>
                            {user.current_status}
                        </span>
                    </div>
                </td>
                <td className="align-middle">{user.is_approved ? "True" : "False"}</td>
                <td className="align-middle">
                <div class="switch checkbox-switch switch-success">
                            <label>
                                <input
                                    type="checkbox"
                                    id="customSwitc1"
                                    className=""
                                    name="is_erd"
                                    checked={user.is_erd}
                                    onChange={(e) => this.props.onerdStatus(e.target.checked, user.id)}
                                />
                                <span></span>
                            </label>
                        </div>
                </td>
                <td className="align-middle">{renderToLocaleDate(user.created_at)}</td>
                <td className="align-middle">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button className="btn btn-light" onClick={() => this.statusChange("approved", user.id)}>
                            {t(this.props.language?.layout?.approve_nt)}
                        </button>

                        <button className="btn btn-light" onClick={() => this.statusChange("rejected", user.id)}>
                            {t(this.props.language?.layout?.ep_jobtitle_reject)}
                        </button>
                        <Dropdown drop="down" className="bg-light">
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    <img src="/svgs/icons_new/more-vertical.svg" className="svg-sm pointer" alt="more" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="drop-menu-position">
                                    <Dropdown.Item eventKey="1" className="dropdown_item">
                                        <div onClick={() => actionsToPerform("moreOptions", user.id, user.archive)}>
                                            {user.archive == false ? t(this.props.language?.layout?.all_archive_nt) : t(this.props.language?.layout?.all_unarchive_nt)}
                                        </div>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                    </div>
                </td>
            </tr>,
        ];
    }
}
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userAdmin: state.authInfo.user,
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, {})(withTranslation()(RowData));
