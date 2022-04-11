import React, { Component } from "react";
import { Link } from "react-router-dom";
import { renderToLocaleDate } from "../modules/helpers.jsx";
import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { capitalizeFirstLetter } from "../modules/helpers.jsx";
import { jobStatus } from "../components/constants.jsx";
import { truncate } from "../modules/helpers.jsx";
import { Fragment } from "react";
import { withTranslation } from 'react-i18next';

class RowData extends Component {
    constructor(props) {
        super(props);
    }
    state = { expanded: false };

    render() {
        const { t } = this.props;
        const { user, actionsToPerform, theme, updateHiringMember, userRole } = this.props;
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
            <Fragment>
                <tr key="main">
                    <td className="pl-3 align-middle text-capitalize">
                        <div className="d-flex align-items-center">
                            <div
                                className="rounded-circle mr-2 text-center d-flex align-items-center justify-content-center text-uppercase mt-1"
                                style={{ width: "50px", height: "50px", backgroundColor: "#80808029" }}>
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
                            <div className="text-capitalize">
                                {(user.first_name == null || user.first_name == "") &&
                                    (user.last_name == null || user.last_name == "") ? (
                                    user.username
                                ) : (
                                    <span>
                                        {user.first_name}&nbsp;{user.last_name}
                                        {renderToLocaleDate(user.created_at) === renderToLocaleDate(new Date()) ? (
                                            <small className="px-2 rounded position-relative" style={{ top: "-10px", background: "#e2f505" }}>New</small>
                                        ) : (
                                            ""
                                        )}
                                    </span>
                                )}
                            </div>
                            <div>
                            </div>
                        </div>
                    </td>
                    <td className="pl-3 align-middle">{truncate(user.email, 20)}</td>
                    <td className="align-middle text-capitalize">{t(this.props.language?.layout?.member_nt)}</td>
                    {userRole.role_id == null &&
                        <td className="align-middle text-capitalize">{user.organization}</td>
                    }
                    {userRole.role_id == null ? <td className="pl-3 align-middle">{user.is_ca ? t(this.props.language?.layout?.globallocations_canada) :
                        t(this.props.language?.layout?.globallocations_us)}</td> : ""}
                    <td className="align-middle text-capitalize">{user.job_title == "null" || user.job_title == "undefined" ? "" : user.job_title}</td>
                    <td className="align-middle">{renderToLocaleDate(user.created_at)}</td>
                    <td className="align-middle">{renderToLocaleDate(user.updated_at)}</td>
                    <td className="align-middle">{user.is_active ? t(this.props.language?.layout?.ep_jobstatus_active) : t(this.props.language?.layout?.inactive_nt)}</td>
                    <td className="align-middle px-0">
                        <div className="d-flex align-items-baseline">
                            <div class="form-group animated form-primary-bg">
                                <div class="switch checkbox-switch switch-success mt-n1">
                                    <label>
                                        <input
                                            type="checkbox"
                                            id="customSwitch1"
                                            className=""
                                            name="is_active"
                                            checked={user.is_active}
                                            onChange={(e) => updateHiringMember(user.id, user, e.target.checked)}
                                        />
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                            <button className="btn btn-light btn-small" onClick={() => actionsToPerform("edit", user)}>
                                {t(this.props.language?.layout?.all_edit_nt)}
                            </button>
                        </div>
                    </td>
                </tr>
            </Fragment>
        ];
    }
}
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userRole: state.authInfo.user,
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, {})(withTranslation()(RowData));
