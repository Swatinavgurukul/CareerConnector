import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useSession } from "../components/SessionProvider.jsx";
import Notifications from "./notifications.jsx";
import { useOuterClick } from "../modules/helpers.jsx";
import { isValidThemeLogo } from "../modules/helpers.jsx";
import { connect } from "react-redux";
import { _logout, _checkLogin, _profileImage, _canadaPath } from "../actions/actionsAuth.jsx";
import Axios from "axios";
import MessageNotification from "./messageNotification.jsx";
import i18n from '../dashboard/i18n';
import { useTranslation } from "react-i18next";
import Reportissue from "../dashboard/Feedback.jsx";
import Contact from "./contact.jsx";
import { Fragment } from "react";
import { capitalizeFirstLetter } from "../modules/helpers.jsx";
import { _languageName } from "../actions/actionsAuth.jsx";


const Header = (props) => {
    const { t } = useTranslation();
    const profileDropdown = useOuterClick((ev) => {
        if (showNav) {
            setNav(false);
        }
        if (dropdown == true) {
            setDropdown(false);
        }
    });
    const questionDropdown = useOuterClick((ev) => {
        if (helpDropdown == true) {
            setHelpDropdown(false);
        }
    });
    const default_user_object = {
        authenticated: false,
        name: "",
        chat_id: "",
        is_user: true,
        user_id: null,
        role_id: null,
    };
    const session = useSession();
    const location = useLocation();
    const history = useHistory();
    const [showNav, setNav] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [helpDropdown, setHelpDropdown] = useState(false);
    const [show, setShow] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [languageDropdown, setLanguageDropdown] = useState(false);
    const visible = ["/login", "/forgotPassword", "/signup", "/demo2", "/demo3", "/demo4", "/loginsso"];
    const toggleDropdown = (e) => {
        if (e.code === "Enter") {
            setDropdown(!dropdown);
        }
    };
    const toggleHelpDropdown = (e) => {
        if (e.code === "Enter") {
            setHelpDropdown(!helpDropdown);
        }
    };
    const openModel = (action) => {
        if (action === "open") {
            setShow(true);
        }
    };
    const languagesDropdown = useOuterClick((ev) => {
        if (languageDropdown == true) {
            setLanguageDropdown(false);
        }
    });
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
    function getCountry(latLngs) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': latLngs },
            function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        for (var i = 0; i < results[0].address_components.length; i++) {
                            if (results[0].address_components[i].types[0] == "country") {
                                if (results[0].address_components[i].short_name === "CA") {
                                    if (props.changeCountry == "" || props.changeCountry == "ca") {
                                        props._canadaPath("ca");
                                        if (window?.location?.pathname == "/") {
                                            history.push("/ca")
                                        }
                                    }
                                } else {
                                    if (props.changeCountry == "ca") {
                                        props._canadaPath("ca")
                                    }
                                    else if (history?.location?.pathname == "/ca") {
                                        props._canadaPath("ca")
                                    }
                                    else {
                                        props._canadaPath(null)
                                        // if (window?.location?.pathname == "/ca") {
                                        //     history.push("/")
                                        // }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        )

    }
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        let latLng = {
            // lat: 50.288055, lng: -107.793892
            lat: latitude, lng: longitude
        };
        getCountry(latLng)
    }
    const getNavigatorLanguage = () => {
        let geo = navigator.geolocation.getCurrentPosition(success, null, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
        if (navigator.languages && navigator.languages.length) {
            return navigator.languages[0];
        } else {
            return navigator.userLanguage || navigator.language || navigator.browserLanguage || "en";
        }
    };
    useEffect(() => {
        let title = history.location.pathname.replace("/", "");
        title == "" ? "Career Connector" : (document.title = `${props?.tenantTheme.title} | ` + capitalizeFirstLetter(title));
    }, [history.location.pathname]);
    const logoutHandler = () => {
        props._logout()
    }
    useEffect(() => {
        props._checkLogin();
        getNavigatorLanguage();
        window.addEventListener('languagechange', function () {
            if (getNavigatorLanguage() == "fr" || getNavigatorLanguage() == "fr-CA" || getNavigatorLanguage() == "fr-FR" || getNavigatorLanguage() == "fr-CH") {
                props._languageName("fr")
            } else if (getNavigatorLanguage() == "es") {
                props._languageName("esp")
            } else {
                props._languageName("en")
            }
        });
    }, []);
    useEffect(() => {
        history?.location?.pathname == "/ca" ? props._canadaPath("ca") : (history?.location?.pathname == "/" ? props._canadaPath(null) : null)
    }, [history.location.pathname])

    const selectLanguage = (e) => {
        props._languageName(e.target.value)
    }

    return props.visible.indexOf(location.pathname) === -1 ? (

        location.pathname == "/new_signin" ?
            <></>
            :
            <div className="mb-4rem">
                <nav
                    class="navbar navbar-expand-lg navbar-light bg-white p-0 m-0 border-bottom fixed-top shadow-sm"
                    tabIndex="0">

                    {location.pathname == "/homepage_new" || process.env.CLIENT_NAME === "cc" ?
                        <a href="/homepage_new" className=" icon-invert c-logo navbar-brand">
                            <img
                                alt="Simplify"
                                src={props?.tenantTheme?.logo}
                                // src="/uploads/user_v1llv353bppo/simplify_logo.png"
                                // width="527px"
                                // height="136px"
                                class="logo"
                            />
                        </a>
                        : (
                            props.user.is_cananda === true ?
                                <a href="/ca" className=" icon-invert c-logo navbar-brand">
                                    <img
                                        alt="Microsoft"
                                        // src="/uploads/user_v1llv353bppo/microsoft.svg"
                                        src={props?.tenantTheme?.logo}
                                        // width="527px"
                                        // height="136px"
                                        class="logo"
                                    />
                                </a> :
                                <a href={props.canadaPath == null ? "/" : `/${props.canadaPath}`} className=" icon-invert c-logo navbar-brand">
                                    <img
                                        alt="Microsoft"
                                        // src="/uploads/user_v1llv353bppo/microsoft.svg"
                                        src={props?.tenantTheme?.logo}
                                        // width="527px"
                                        // height="136px"
                                        class="logo"
                                    />
                                </a>
                        )}
                    <button
                        class="navbar-toggler border-0"
                        title="Collapse Button"
                        type="button"
                        onClick={() => setNav(!showNav)}>
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class={`collapse navbar-collapse ${showNav ? "d-block" : "d-none"}`}>
                        <ul class="navbar-nav">
                            {props.user.authenticated && props.user.is_user ? (
                                <li className="nav-item">
                                    {/* no_translated */}
                                    <Link
                                        aria-labelledby="Dashboard"
                                        className={`p-md-10 p-lg-4 sidebar-heading ${location.pathname === "/dashboard" ? "active" : ""
                                            }`}
                                        to="/dashboard" onClick={() => setNav(false)}>
                                        {t(props.language?.layout?.homepage_jobseekers_dashboard)}
                                    </Link>
                                </li>
                            ) : null}
                            {props.user.authenticated && props.user.is_user ? (
                                <li className="nav-item">
                                    {/* no_translated */}
                                    {props.user.is_cananda === true ?
                                        (
                                            <Link
                                                aria-labelledby="Search"
                                                className={`p-md-10 p-lg-4 sidebar-heading ${location.pathname === "/ca/search" ? "active" : ""
                                                    }`}
                                                to="/ca/search" onClick={() => setNav(false)}>
                                                {t(props.language?.layout?.jsdb_browse_nt)}
                                            </Link>
                                        ) :
                                        (
                                            <Link
                                                aria-labelledby="Search"
                                                className={`p-md-10 p-lg-4 sidebar-heading ${location.pathname === "/search" ? "active" : ""
                                                    }`}
                                                to={props.canadaPath == null ? "/search" : `/${props.canadaPath}/search`} onClick={() => setNav(false)}>
                                                {t(props.language?.layout?.jsdb_browse_nt)}
                                            </Link>
                                        )
                                    }
                                </li>
                            ) : null}
                        </ul>
                        <ul class="navbar-nav ml-md-auto">
                            {/* <li className="nav-item">
                                {(props.billing === null || props.billing === true) && !props.user.is_user ? (
                                    <Link
                                        aria-labelledby="Home"
                                        className="icon-invert p-md-10 p-lg-4 sidebar-heading"
                                        to="/"
                                        onClick={() => setNav(false)}>
                                        <img
                                            className="svg-sm"
                                            src="svgs/icons_new/home.svg"
                                            title="home"
                                            alt="Home Icon"
                                        />
                                    </Link>
                                ) : null}
                            </li> */}
                            {/* {props.user.authenticated && props.user.is_user ? (
                            <li className="nav-item">
                                no_translated
                                <Link
                                    aria-labelledby="Dashboard"
                                    className={`p-md-10 p-lg-4 sidebar-heading ${location.pathname === "/dashboard" ? "active" : ""
                                        }`}
                                    to="/dashboard" onClick={() => setNav(false)}>
                                    {t(props.language?.layout?.homepage_jobseekers_dashboard)}
                                </Link>
                            </li>
                        ) : null} */}
                            {!props.user.authenticated && props.user.is_user ? (
                                <>
                                    <li
                                        className="nav-item dropdown icon-invert "
                                        tabIndex="0"
                                        onKeyPress={(e) => toggleLanguageDropdown(e)}>
                                        <a
                                            className="p-md-10 p-lg-4 sidebar-heading"
                                            ref={languagesDropdown}
                                            onClick={() => setLanguageDropdown(!languageDropdown)}>
                                            <img
                                                className="svg-sm"
                                                src="svgs/icons_new/globe.svg"
                                                title="Help Circle"
                                                alt="Help Icon"
                                            />
                                            <img
                                                className="svg-sm ml-1"
                                                src="svgs/icons_new/chevron-down.svg"
                                                title="Arrow"
                                                alt="Arrow Icon"
                                            />
                                        </a>
                                        <a
                                            className={"icon-invert dropdown-menu dropdown-menu-right rounded-bottom text-decoration-none" + (
                                                languageDropdown ? " show" : "")}>
                                            <a class="dropdown-item pointer" onClick={() => props._languageName("en")}>EN</a>
                                            <a class="dropdown-item pointer" onClick={() => props._languageName("esp")}>ESP</a>
                                            <a class="dropdown-item pointer" onClick={() => props._languageName("fr")}>FR</a>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        {/* no_translated */}
                                        <Link
                                            aria-labelledby="Search"
                                            className={`p-md-10 p-lg-4 sidebar-heading ${location.pathname === "/search" ? "active" : ""
                                                }`}
                                            to={props.canadaPath == null ? "/search" : `/${props.canadaPath}/search`} onClick={() => setNav(false)}>
                                            {t(props.language?.layout?.header_jobs)}
                                        </Link>
                                    </li>
                                </>
                            ) : null}
                            {/* {props.user.authenticated && props.user.is_user ? (
                            <li className="nav-item">
                                <Link
                                    aria-labelledby="Applications"
                                    className={`p-md-10 p-lg-4 sidebar-heading ${location.pathname === "/application" ? "active" : ""
                                        }`}
                                    to="/application" onClick={() => setNav(false)}>
                                    {t(props.language?.layout?.ep_jobs_applications)}
                                </Link>

                            </li>
                        ) : null} */}

                            {location.pathname === "/" ||
                                location.pathname === "/location/huston" ||
                                location.pathname === "/location/atlanta" ? (
                                <>
                                    {!props.user.is_user && (props.billing === null || props.billing === true) ? (
                                        <li className="nav-item">
                                            {/* not_translated */}
                                            <Link
                                                aria-labelledby="Dashboard"
                                                className="p-md-10 p-lg-4 sidebar-heading"
                                                to="/dashboard"
                                                onClick={() => setNav(false)}>
                                                {t(props.language?.layout?.homepage_jobseekers_dashboard)}
                                            </Link>
                                        </li>
                                    ) : null}
                                </>
                            ) : null}

                            {props.user.authenticated && (props.billing === null || props.billing === true) ? (
                                <>
                                    <li
                                        className="nav-item dropdown icon-invert "
                                        tabIndex="0"
                                        onKeyPress={(e) => toggleLanguageDropdown(e)}>
                                        <a
                                            className="p-md-10 p-lg-4 sidebar-heading"
                                            ref={languagesDropdown}
                                            onClick={() => setLanguageDropdown(!languageDropdown)}>
                                            <img
                                                className="svg-sm"
                                                src="svgs/icons_new/globe.svg"
                                                title="Help Circle"
                                                alt="Help Icon"
                                            />
                                            <img
                                                className="svg-sm ml-1"
                                                src="svgs/icons_new/chevron-down.svg"
                                                title="Arrow"
                                                alt="Arrow Icon"
                                            />
                                        </a>
                                        <a
                                            className={"icon-invert dropdown-menu dropdown-menu-right rounded-bottom text-decoration-none" + (
                                                languageDropdown ? " show" : "")}>
                                            <a class="dropdown-item pointer" onClick={() => props._languageName("en")}>EN</a>
                                            <a class="dropdown-item pointer" onClick={() => props._languageName("esp")}>ESP</a>
                                            <a class="dropdown-item pointer" onClick={() => props._languageName("fr")}>FR</a>
                                        </a>
                                    </li>
                                    <li>
                                        <Link aria-labelledby="Messages" to="/inbox_messages">
                                            <MessageNotification />
                                        </Link>
                                    </li>
                                </>
                            ) : null}
                            <li>
                                {props.user.authenticated && (props.billing === null || props.billing === true) ? (
                                    <Notifications />
                                ) : (
                                    <></>
                                )}
                            </li>
                            {props.user.authenticated && props.user.is_user ? (
                                <>
                                    <Reportissue openModel={openModel} closeModal={closeModal} show={show} />
                                    <Contact openModel={openContactModel} closeModal={closeContactModal} show={showContact} />
                                    <li
                                        ref={questionDropdown}
                                        className="nav-item dropdown icon-invert "
                                        tabIndex="0"
                                        onKeyPress={(e) => toggleHelpDropdown(e)}>
                                        <a
                                            className="p-md-10 p-lg-4 sidebar-heading"
                                            onClick={() => setHelpDropdown(!helpDropdown)}>
                                            <img
                                                className="svg-sm"
                                                src="svgs/icons_new/help-circle.svg"
                                                title="Help Circle"
                                                alt="Help Icon"
                                            />
                                        </a>
                                        <a
                                            className={"icon-invert dropdown-menu dropdown-menu-right rounded-bottom text-decoration-none" + (
                                                helpDropdown ? " show" : "")}>
                                            <Link className="dropdown-item" to="/faq" onClick={() => setNav(false)}>
                                                {t(props.language?.layout?.faq_heading)}
                                            </Link>
                                            <a onClick={() => openModel("open")} className="dropdown-item pointer">
                                                {t(props.language?.layout?.js_dashboard_feedback)}
                                            </a>
                                            <a onClick={() => openContactModel("open")} className="dropdown-item pointer">
                                                {t(props.language?.layout?.js_dashboard_contact)}
                                            </a>
                                        </a>
                                    </li>
                                    {/* <li
                                        className="nav-item dropdown icon-invert "
                                        tabIndex="0"
                                        onKeyPress={(e) => toggleLanguageDropdown(e)}>
                                        <a
                                            className="p-md-10 p-lg-4 sidebar-heading"
                                            ref={languagesDropdown}
                                            onClick={() => setLanguageDropdown(!languageDropdown)}>
                                            <img
                                                className="svg-sm"
                                                src="svgs/icons_new/globe.svg"
                                                title="Help Circle"
                                                alt="Help Icon"
                                            />
                                            <img
                                                className="svg-sm ml-1"
                                                src="svgs/icons_new/chevron-down.svg"
                                                title="Arrow"
                                                alt="Arrow Icon"
                                            />
                                        </a>
                                        <a
                                            className={"icon-invert dropdown-menu dropdown-menu-right rounded-bottom text-decoration-none" + (
                                                languageDropdown ? " show" : "")}>
                                            <a class="dropdown-item pointer" onClick={() => props._languageName("en")}>EN</a>
                                            <a class="dropdown-item pointer" onClick={() => props._languageName("esp")}>ESP</a>
                                            <a class="dropdown-item pointer" onClick={() => props._languageName("fr")}>FR</a>
                                        </a>
                                    </li> */}

                                </>
                            ) : null}
                            {props.user.authenticated ? (
                                <li
                                    ref={profileDropdown}
                                    className="nav-item dropdown icon-invert "
                                    tabIndex="0"
                                    onKeyPress={(e) => toggleDropdown(e)}>
                                    <a
                                        className="p-md-10 p-lg-3 sidebar-heading"
                                        // replace
                                        onClick={() => setDropdown(!dropdown)}>
                                        <div
                                            className="rounded-circle text-capitalize d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "2.25rem",
                                                height: "2.25rem",
                                                backgroundColor: "#80808029",
                                            }}>
                                            {((props.profileImage == "" || props.profileImage == null) && (props.user.user_image == "" || props.user.user_image == null)) ? (
                                                props?.user?.name === null || props?.user?.name === undefined ? "U" : props?.user?.name?.charAt(0)) : (
                                                <img src={props.profileImage ? props.profileImage : props.user.user_image} className="svg-lg rounded-circle" alt="candidate profile image" />
                                            )}
                                        </div>
                                        {/* <img
                                        className="svg-sm ml-4 "
                                        src="svgs/icons_new/chevron-down.svg"
                                        title="Arrow"
                                        alt="Arrow Icon"
                                    /> */}
                                    </a>
                                    <a
                                        className={
                                            dropdown
                                                ? "icon-invert dropdown-menu dropdown-menu-right rounded-bottom show text-decoration-none"
                                                : "icon-invert dropdown-menu dropdown-menu-right rounded-bottom text-decoration-none"
                                        }>

                                        <div className="d-flex text-capitalize align-items-center dropdown-item">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center mr-2"
                                                style={{
                                                    width: "2.25rem",
                                                    height: "2.25rem",
                                                    backgroundColor: "#80808029",
                                                }}>
                                                {((props.profileImage == "" || props.profileImage == null) && (props.user.user_image == "" || props.user.user_image == null)) ? (
                                                    props?.user?.name === null || props?.user?.name === undefined ? "U" : props?.user?.name?.charAt(0)) : (
                                                    <img src={props.profileImage ? props.profileImage : props.user.user_image} className="svg-lg rounded-circle" alt="candidate profile image" />
                                                )}
                                            </div>
                                            {props.user.name === null || props?.user?.name === undefined ? "User" : props.user.name}
                                        </div>
                                        <div class="dropdown-divider"></div>
                                        {/* no_translated */}
                                        {props.user.is_user ? (
                                            <Link className="dropdown-item" to="/profile" onClick={() => setNav(false)}>
                                                {t(props.language?.layout?.seeker_profile)}
                                            </Link>
                                        ) : (
                                            <></>
                                        )}
                                        {props.user.is_user ? (
                                            <Link className="dropdown-item" to="/application" onClick={() => setNav(false)}>
                                                {t(props.language?.layout?.jsbd_myjobs_nt)}
                                            </Link>
                                        ) : (null
                                        )}



                                        {/* {props.user.authenticated && props.user.is_user ? (
                            <li className="nav-item">
                                <Link
                                    aria-labelledby="Applications"
                                    className={`p-md-10 p-lg-4 sidebar-heading ${location.pathname === "/application" ? "active" : ""
                                        }`}
                                    to="/application" onClick={() => setNav(false)}>
                                    {t(props.language?.layout?.ep_jobs_applications)}
                                </Link>

                            </li>
                        ) : null}    */}



                                        {props.billing === null || props.billing === "" || props.billing === true ? (
                                            <Link className="dropdown-item" to="/settingsv2" onClick={() => setNav(false)}>
                                                {t(props.language?.layout?.ep_setting_header)}
                                            </Link>
                                        ) : null}
                                        {/* <div class="dropdown-divider"></div> */}
                                        {props.user.user_id == 1 ? (
                                            <div>
                                                <Link className="dropdown-item" to="/getUsers" onClick={() => setNav(false)}>
                                                    Impersonate
                                                </Link>
                                                {/* <div class="dropdown-divider"></div> */}
                                            </div>
                                        ) : null}
                                        {/* no_translated */}
                                        {props.user.role_id == 3 ? (
                                            <>
                                                <div>
                                                    <Link className="dropdown-item" to={props.canadaPath == null ? "/erd" : `/${props.canadaPath}/erd`} onClick={() => setNav(false)}>
                                                        Export
                                                    </Link>
                                                    {/* <div className="dropdown-divider"></div> */}
                                                </div>
                                                <div>
                                                    <Link className="dropdown-item" to={props.canadaPath == null ? "/auditReports" : `/${props.canadaPath}/auditReports`} onClick={() => setNav(false)}>
                                                        Report
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link className="dropdown-item" to={props.canadaPath == null ? "/surveySummary" : `/surveySummary/${props.canadaPath}`} onClick={() => setNav(false)}>
                                                        Survey
                                                    </Link>
                                                </div>
                                            </>
                                        ) : null}
                                        <Link className="dropdown-item" onClick={() => logoutHandler()}>
                                            {t(props.language?.layout?.seeker_logout)}
                                        </Link>
                                    </a>
                                </li>
                            ) : (
                                <Fragment>
                                    {location.pathname == "/homepage_new" ?
                                        <>
                                            <li className="nav-item">
                                                <Link className="p-md-10 p-lg-4 sidebar-heading" to="/signup" onClick={() => setNav(false)}>
                                                    Sign Up
                                                </Link>
                                            </li>

                                        </>
                                        : null}
                                    <li className="nav-item">
                                        <Link className="p-md-10 p-lg-4 sidebar-heading" to={process.env.CLIENT_NAME === "microsoft" ? props.canadaPath == null ? "/login" : `/${props.canadaPath}/login` : "/new_signin"} onClick={() => setNav(false)}>
                                            {t(props.language?.layout?.header_login)}
                                        </Link>
                                    </li>
                                </Fragment>

                            )}
                        </ul>
                    </div>
                </nav>
            </div>
    ) : (
        <></>
    );
};

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        billing: state.authInfo.billing,
        language: state.authInfo.language,
        tenantTheme: state.authInfo.tenantTheme,
        profileImage: state.authInfo.profileImage,
        canadaPath: state.authInfo.canadaPath,
        languageName: state.authInfo.languageName,
        changeCountry: state.authInfo.changeCountry

    };
}
function mapDispatchToProps(dispatch) {
    return {
        _logout: () => dispatch(_logout()),
        _checkLogin: () => dispatch(_checkLogin()),
        _profileImage: () => dispatch(_profileImage()),
        _languageName: (value) => dispatch(_languageName(value)),
        _canadaPath: (value) => dispatch(_canadaPath(value))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);
