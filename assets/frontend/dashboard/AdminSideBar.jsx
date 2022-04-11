import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { _checkLogin } from "../actions/actionsAuth.jsx";
import Reportissue from "../dashboard/Feedback.jsx";
import Contact from "./contact.jsx";
import { useTranslation } from "react-i18next";
import { _languageName } from "../actions/actionsAuth.jsx";

const AdminSideBar = (props) => {
    const { t } = useTranslation();
    const location = useLocation();
    const visible = [
        "dashboard",
        "jobs",
        "homepage",
        "applications",
        "interview",
        "report",
        "nppreport",
        "offers",
        "jobSeekers",
        "settingsv2",
        "inbox_messages",
        "approvals",
        "compareApplicants",
        "advancedSearch",
        "hiringTeam",
        "team",
        "surveySummary",
        "surveyReports"
    ];
    const [show, setShow] = useState(false);
    const [showContact, setShowContact] = useState(false);

    const openModel = (action) => {
        if (action === "open") {
            setShow(true);
        }
    };
    const closeModal = (action) => {
        if (action === "close") {
            setShow(false);
        }
    };
    const openContactModel = (action) => {
        if (action === "open") {
            setShowContact(true);
        }
    };
    const closeContactModal = (action) => {
        if (action === "close") {
            setShowContact(false);
        }
    };

    const { theme } = props;

    const data = [
        {
            name: t(props.language?.layout?.sidebar_homepage_nt),
            url: "/homepage",
            icon: "/svgs/icons_new/grid.svg",
            role: ["hiring_manager", "recruiter", "hiring_member", "recruiter_member"],
        },
        {
            name: t(props.language?.layout?.homepage_employerpartner_dashboard),
            url: "/dashboard",
            icon: "/svgs/icons_new/layout.svg",
            role: ["admin", "hiring_manager", "recruiter", "hiring_member", "recruiter_member"],
        },
        {
            name: t(props.language?.layout?.approvals_nt),
            url: "/approvals",
            icon: "/svgs/icons_new/user-check.svg",
            role: ["admin"],
        },
        { name: t(props.language?.layout?.homepage_jobseekers), url: "/jobSeekers", icon: "/svgs/icons_new/users.svg", role: ["admin", "recruiter", "recruiter_member"] },
        {
            name: t(props.language?.layout?.header_jobs),
            url: "/jobs",
            icon: "/svgs/icons_new/briefcase.svg",
            role: ["admin", "hiring_manager", "recruiter", "hiring_member", "recruiter_member"],
        },
        {
            name: t(props.language?.layout?.ep_jobs_applications),
            url: "/applications",
            icon: "/svgs/icons_new/file.svg",
            role: ["admin", "hiring_manager", "recruiter", "hiring_member", "recruiter_member"],
        },
        {
            name: t(props.language?.layout?.ep_jobtitle_interview),
            url: "/interview",
            icon: "/svgs/icons_new/calendar.svg",
            role: ["admin", "hiring_manager", "hiring_member"],
        },
        { name: t(props.language?.layout?.ep_offersheading), url: "/offers", icon: "/svgs/icons_new/user-check.svg", role: ["admin", "hiring_manager", "hiring_member"] },
        {
            name: props.user.role_id == null ? t(props.language?.layout?.ep_report_heading) : t(props.language?.layout?.reports_nt),
            url: "/report",
            icon: "/svgs/icons_new/pie-chart.svg",
            role: ["admin", "hiring_manager", "hiring_member"],
        },
        {
            name: props.user.role_id == null ? t(props.language?.layout?.sprepprts_nt) : t(props.language?.layout?.reports_nt),
            url: "/nppreport",
            icon: "/svgs/icons_new/pie-chart.svg",
            role: ["admin", "recruiter", "recruiter_member"],
        },
        {
            name: t(props.language?.layout?.sidebar_hiringteam_nt),
            url: "/hiringTeam",
            icon: "/svgs/icons_new/hiring-team.svg",
            role: ["admin", "hiring_manager"],
        },
        {
            name: t(props.language?.layout?.sidebar_team_nt),
            url: "/team",
            icon: "/svgs/icons_new/hiring-team.svg",
            role: ["admin", "recruiter"],
        },
    ];

    const [role, setRole] = useState("none");
    const [showsideNav, setsideNav] = useState(false);

    useEffect(() => {
        props._checkLogin();
    }, []);

    const selectLanguage = (e) => {
        props._languageName(e.target.value)
    }

    useEffect(() => {
        if (!props.user.is_user) {
            if (props.user.role_id == null) {
                setRole("admin");
            } else if (props.user.role_id == 1) {
                setRole("hiring_manager");
            } else if (props.user.role_id == 2) {
                setRole("recruiter");
            } else if (props.user.role_id == 4) {
                setRole("hiring_member");
            } else if (props.user.role_id == 5) {
                setRole("recruiter_member");
            }
        }
    });
    let urlElements = window.location.href.split("/");
    // console.log(location.state)
    return props.user.authenticated &&
        (visible.indexOf(urlElements[3]) === -1) === false &&
        !props.user.is_user &&
        window.location.pathname !== `/jobs/${location.state}` ? (
        <div className="col-md-2 col p-0 h-100">
            <div className="sidebar-menu icon-invert" tabIndex="-1">
                <label class="navbar-toggler sidebar-icon border-0 pr-1" aria-describedby="closeDescription" title="Collapse Button" type="button" onClick={() => setsideNav(!showsideNav)} tabIndex="-1">
                    <span class="navbar-toggler-icon"></span>
                    <span className="small text-primary"></span>
                </label>
            </div>
            <div
                className={`collapse navbar-collapse h-100 ${showsideNav ? "d-block" : "d-none"} d-md-block`}
                onClick={() => setsideNav(!showsideNav)}>
                <div class="d-flex flex-column pt-4rem vertical-nav thin-scrollbar" style={{ 'overflow-y': 'auto' }}>
                    <span
                        className="sidenav-close-icon d-md-none d-block text-right p-2 pointer"
                        onClick={() => setsideNav(!showsideNav)}>
                        <img
                            className="svg-sm invert-color"
                            src="/svgs/icons_new/x.svg"
                            title="Close"
                            alt="Close Icon"
                        />
                    </span>
                    <ul className="navbar-nav">
                        {/* {console.log(window.location.host,location.pathname)} */}
                        {data.map((item) =>
                            item.role.indexOf(role) !== -1 ? (
                                <li className="nav-item">
                                    <Link
                                        className={
                                            window.location.href.indexOf(window.location.host + item.url) !== -1
                                                ? "sidebar-heading active"
                                                : "sidebar-heading"
                                        }
                                        to={item.url}
                                        style={theme.sidebar_heading}>
                                        <img className="svg-sm mr-2 invert-color" src={item.icon} title={item.name} />
                                        {item.name}
                                    </Link>
                                </li>
                            ) : (
                                <></>
                            )
                        )}
                    </ul>
                    <Reportissue openModel={openModel} closeModal={closeModal} show={show} />
                    <Contact openModel={openContactModel} closeModal={closeContactModal} show={showContact} />
                    <div class="d-flex align-items-end justify-content-between bg-black mt-auto">
                        <div class="btn-group btn-block" role="group" aria-label="Basic example">
                            <div tabIndex="0">
                                <a
                                    type="button"
                                    onClick={() => openContactModel("open")}
                                    class="btn btn-black text-white">
                                    <img
                                        className="svg-sm invert-color"
                                        src="/svgs/icons_new/help-circle.svg"
                                        title="Help"
                                        alt="Help Icon"
                                    />
                                    &nbsp; {t(props.language?.layout?.js_dashboard_contact)}
                                </a>
                            </div>
                            <div tabIndex="0">
                                <a type="button" onClick={() => openModel("open")} class="btn btn-black text-white">
                                    <img
                                        className="svg-sm invert-color pointer"
                                        src="/svgs/temp/feedback.svg"
                                        title="Feedback"
                                        alt="Extend Icon"
                                    />
                                    &nbsp; {t(props.language?.layout?.js_dashboard_feedback)}
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* <div class="d-flex align-items-end pl-2 ml-1 my-2 mb-3 bg-black">
                        <Link to="/languages" className="icon-invert">
                            <img
                                className="svg-sm mt-n1 mr-2 invert-color"
                                src="/svgs/icons_new/globe.svg"
                                alt="Languages"
                                title="Languages"
                            />
                        </Link>
                        <select
                            className="form-select bg-black text-white col-md-3 pl-0
                                form-select-sm" style={{outline: "none"}}
                            aria-label=".form-select-sm example"
                            value={props?.languageName}
                            onChange={selectLanguage}
                        >
                            <option disabled>{t(props.language?.layout?.seeker_select)}</option>
                            <option onClick={() => props._languageName("en")} selected={props.languageName === "en"} value="en" > EN </option>
                            <option onClick={() => props._languageName("esp")} selected={props.languageName == "esp"} value="esp"> ESP </option>
                            <option onClick={() => props._languageName("fr")} selected={props.languageName == "fr"} value="fr"> FR </option>
                        </select>
                    </div> */}
                </div>
            </div>
        </div>
        // </div>
    ) : null;
};
function mapStateToProps(state) {
    return {
        token: state.authInfo.userToken,
        user: state.authInfo.user,
        theme: state.themeInfo.theme,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}
// function mapDispatchToProps(dispatch) {
//     return {
//         // _checkLogin: () => dispatch(_checkLogin()),
//     };
// }

export default connect(mapStateToProps, { _languageName, _checkLogin })(AdminSideBar);
