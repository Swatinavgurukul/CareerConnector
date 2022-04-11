import React, { Component } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { renderToLocaleDate } from "../../modules/helpers.jsx";
import { truncate } from "../../modules/helpers.jsx";
import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { Mailto } from "../../components/constants.jsx";
import { withTranslation } from 'react-i18next';
import { useOuterClick } from "../../modules/helpers.jsx";

class RowData extends Component {
    state = { expanded: false };

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
                {this.props.userRole.role_id == null ? <td className="pl-3 align-middle">{user.skilling_partner}</td> : ""}
                {this.props.userRole.role_id == null ? <td className="pl-3 align-middle">{user.is_ca ? t(this.props.language?.layout?.globallocations_canada) :
                    t(this.props.language?.layout?.globallocations_us)}</td> : ""}
                {this.props.userRole.role_id == null ? <td className="pl-3 align-middle">{renderToLocaleDate(user.created_at)}</td> :
                    <td className="pl-3 align-middle">{user.experience}</td>}
                {this.props.userRole.role_id == null ? <td className="pl-3 align-middle">{renderToLocaleDate(user.last_login)}</td> :
                    <td className="pl-3 align-middle">
                        {user.company}
                        {/* {user.user_city} {user.user_state_code} */}
                    </td>}
                <td className="pl-3 align-middle text-capitalize">{user.application_count}</td>
                <td className="align-middle text-center px-0 ">
                    <>
                        <div class="btn-group  position-relative" role="group" aria-label="Basic example">
                            <Link to={`/jobSeekers/${user.user_id}`} tabIndex="-1">
                                <button className="btn btn-light btn-small" tabIndex="0">{t(this.props.language?.layout?.sp_js_view)}</button>
                            </Link>
                            <button
                                class="btn btn-light btn-small"
                                onClick={() => {
                                    actionsToPerform("delete");
                                    inviteCandidateHandler(user.user_id);
                                }}>
                                {t(this.props.language?.layout?.sp_js_invite)}
                            </button>
                            {/* {process.env.CLIENT_NAME === "cc" && */}
                            <Dropdown drop="down" className="pt-1 bg-light">
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
                            </Dropdown>
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
