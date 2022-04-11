import React, { Component } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { renderToLocaleDate } from "../../../modules/helpers.jsx";
import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { jobstage, job_status1 } from "../../../../translations/helper_translation.jsx";

class RowData extends Component {
    state = {
        expanded: false,
        favourite: true,
    };

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

    statusHandler = (language, key) => {
        return(job_status1[language][key]);
    }
    jobStageHandler = (language, key) =>{
        return(jobstage[language][key]);
    }

    render() {
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
                <td className="pl-3 text-capitalize align-middle">
                    <div className="d-flex justify-content-between align-items-center ">
                        {user.job_company !== null || user.job_company !== "" ? user.job_company : null}
                    </div>
                </td>
                <td className="align-middle">
                    <div class="single-chart ml-4">
                        {user.job_title !== null || user.job_title !== "" ? user.job_title : null}
                    </div>
                </td>
                <td className="pl-3 text-capitalize align-middle">
                    <div className="d-flex justify-content-between align-items-center ">
                        {user.applied_on !== null || user.applied_on !== ""
                            ? renderToLocaleDate(user.applied_on)
                            : null}
                    </div>
                </td>

                <td className="pl-3 align-middle text-capitalize">
                    <div>
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
                                    : theme.all_color
                            }>
                            {this.jobStageHandler(this.props?.languageName, user.current_status)}
                        </span>
                    </div>
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
                                    ? theme.offer_color
                                    : user.job_status == "closed"
                                    ? theme.closed_color
                                    : theme.all_color
                            }>
                            {this.statusHandler(this.props?.languageName, user.job_status)}
                        </span>
                    </div>
                </td>
                <td className="icon-invert align-middle text-center px-0">
                    <Link
                        to={{
                            pathname: "/jobs/" + user.slug,
                            state: user.slug,
                        }}>
                        <img
                            src="/svgs/icons_new/external-link.svg"
                            alt="View Job"
                            title="View Job"
                            className="svg-xs ml-2 svg-gray pointer"
                        />
                    </Link>
                </td>
            </tr>,
        ];
    }
}

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(RowData);
