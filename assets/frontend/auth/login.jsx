import React, { useState, useEffect } from "react";
import GoogleSocialAuth from "./googleLogin.jsx";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { validate, res } from "react-email-validator";
import { isValidThemeLogo } from "../modules/helpers.jsx";
import { connect } from "react-redux";
import Axios from "axios";
import { _setAuthData, _billingAuth, _languageName } from "../actions/actionsAuth.jsx";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next"

function Login(props) {
    const history = useHistory();
    const { t } = useTranslation();
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [roleId, setRoleId] = useState(null)
    let [token, setToken] = useState("");
    let [visible, setVisible] = useState(false);
    let [openModel, setOpenModel] = useState(false);
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const default_user_object = {
        authenticated: false,
        name: "",
        chat_id: "",
        is_user: true,
        user_id: null,
        role_id: null,
        is_consent: null,
        tenant_name: null,
        is_cananda: false
    };
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regexExp = /^[a-zA-Z0-9+.]+$/;
    
    const handleKeyPress = (target) => {
        if (target.charCode == 13) {
            validateLogin();
        }
    };
    const signIn = () => {
        return Axios.post("/api/v1/token", { username, password })
            .then((response) => {
                if (response.status === 200) {
                    let response_data = response.data;
                    let decoded = jwt_decode(response_data.access);
                    setToken(response_data.access);
                    setRoleId(decoded.role_id);
                    // console.log("decoded.is_consent",decoded.is_consent);
                    // if (decoded.role_id == null && decoded.is_consent === false) {
                    if (decoded.is_consent === false) {
                        setOpenModel(true)
                    } else {
                        updateUserFromToken(response_data.access, response_data.refresh);
                        // }
                        // verbose == true ? (window.location.href = "/",) : response.status ;
                        // if (verbose == true) {
                        //     window.location.href = "/jobs";
                        //     return "login successfully done";
                        // } else {
                        //     return "login successfully done";
                        // }
                        // window.location.href = "/jobs";
                        if (props.location.state !== undefined) {
                            if (decoded.role_id == 1) {
                                history.replace(props.location.state.from);
                            }
                            if (decoded.role_id == null) {
                                history.replace(props.location.state.pathname);
                            }
                        }else {
                            if (decoded.is_user) {
                                history.push("/dashboard");
                            } else if (decoded.billing === false) {
                                history.push("/onboarding");
                            } else if (decoded.user_id == 1) {
                                history.push("/dashboard");
                            } else {
                                history.push("/homepage");
                            }
                        }
                    }
                }
            })
            .catch((error) => {
                //console.log(error.response,"indode : error")
                // old one .............................
                if (error.response.data.detail) {
                    // console.log('inside',error.response.data.detail)
                    toast.error(t(props.language?.layout?.emailpass_nt));
                    // setTimeout(() => {
                    //     window.location.href = "/login";
                    // }, 5000);
                    return error.response.data.detail;
                    // if (verbose == true) {
                    //     toast.error(error.response.data.detail);
                    //     window.location.href = "/";
                    //     return error.response.data.detail;
                    // }
                    // else {
                    //     return error.response.data.detail;
                    // }
                }
                if (error.response.data?.message?.length) {
                    error.response.data.message[0] === "Sorry, your account is inactive. Please contact your administrator." ? toast.error(t(props.language?.layout?.toast141_nt)) : error.response.data.message[0] === "Account doesn't exist." ? toast.error(t(props.language?.layout?.toast142_nt)) : toast.error(t(props.language?.layout?.toast143_nt));
                    // console.log('inside',error.response.data.detail)
                    // setTimeout(() => {
                    //     window.location.href = "/login";
                    // }, 5000);
                    return error.response.data.message[0];
                    // if (verbose == true) {
                    //     toast.error(error.response.data.detail);
                    //     window.location.href = "/";
                    //     return error.response.data.detail;
                    // }
                    // else {
                    //     return error.response.data.detail;
                    // }
                }
                // old one .............................
                // if (error.response.status === 400) {
                //     if (verbose == true) {
                //         toast.error(error.response.data.non_field_errors[0]);
                //         return error.response.data.non_field_errors[0];
                //     } else {
                //         return error.response.data.non_field_errors[0];
                //     }
                // }
                // if (error.response.status === 401) {
                //     if (verbose == true) {
                //         toast.error(error.response.data.detail);
                //         return error.response.data.detail;
                //     } else {
                //         return error.response.data.detail;
                //     }
                // }
            });
    };
    const updateUserFromToken = (access_token, refresh_token) => {
        let decoded = jwt_decode(access_token);
        // console.log(decoded, "decoded")
        //Not using anywhere. Only for chatbot..
        localStorage.setItem("access_token", access_token);
        // handle decode error
        let user_object = Object.assign({}, default_user_object, {
            authenticated: true,
            user_id: decoded.user_id,
            is_user: decoded.is_user,
            name: decoded.full_name,
            role_id: decoded.role_id,
            is_consent: decoded.is_consent,
            tenant_name: decoded.tenant_name,
            is_cananda: decoded.canada,
            language: decoded.language
        });
        props._setAuthData(user_object, access_token, refresh_token, decoded.exp - 600);
        props._billingAuth(decoded.billing);
        props._languageName(decoded.language);

        // Save User Object in Localstorage
    };

    const validateLogin = () => {
        if(!regexExp.test(username.split("@")[0])){
            toast.error(t(props.language?.layout?.toast13_nt));
            setValidEmail(false);
            return;
        }
        if (!regex.test(username)){
            toast.error(t(props.language?.layout?.toast13_nt));
            setValidEmail(false);
            return;
        }
        // validate(username);
        // if (!res) {
        //     toast.error(t(props.language?.layout?.toast13_nt));
        //     setValidEmail(false);
        //     return;
        // }
        if (password.length < 8) {
            toast.error((t(props.language?.layout?.toast14_nt)));
            setValidPassword(false);
            return;
        }
        signIn();
    };
    const consentHandler = () => {
        Axios.post("/api/v1/userconsent", {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    signIn();
                }
            })
    }
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 p-0 login_image d-flex flex-column">
                        <img className="img-fluid m-0 p-0" src="/images/login.jpg" alt=" image" />
                    </div>
                    <div className="col-md-offset-4 col-md-4 m-auto px-3">
                        <div className="auth-trans-bg rounded p-2">
                            <div className="text-center">
                                <a href="/" className="navbar-brand">
                                    <img
                                        alt="microsoft"
                                        // src="/uploads/user_v1llv353bppo/career_connector.jpg"
                                        src={props?.tenantTheme.banner}
                                        style={{ height: "3rem" }}
                                    />
                                </a>
                            </div>
                            <div className="row" onKeyPress={handleKeyPress}>
                                <div className="col-md-12">
                                    <div className="form-group animated">
                                        <label
                                            className={
                                                validEmail
                                                    ? "form-label-active text-green"
                                                    : "form-label-active text-danger bg-white"
                                            }
                                            for="email">
                                            {t(props.language?.layout?.login_email)}
                                        </label>
                                        <input
                                            type="email"
                                            className={validEmail ? "form-control" : "form-control border-danger"}
                                            aria-label="name"
                                            autocomplete="off"
                                            autofocus="true"
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                                setValidEmail(true);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group animated">
                                        <label
                                            className={
                                                validPassword
                                                    ? "form-label-active text-green"
                                                    : "form-label-active text-danger bg-white"
                                            }
                                            for="password">
                                            {t(props.language?.layout?.login_password)}
                                        </label>
                                        <input
                                            type={visible ? "text" : "password"}
                                            aria-label="password"
                                            className={
                                                validPassword ? "form-control mb-3" : "form-control mb-3 border-danger"
                                            }
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setValidPassword(true);
                                            }}
                                        />
                                        <div className="d-flex justify-content-end mr-3">
                                            <div className="icon-invert mt-n5 mb-4" onClick={(e) => setVisible(!visible)}>
                                                <img
                                                    src={
                                                        visible
                                                            ? "/svgs/icons_new/eye-off.svg"
                                                            : "/svgs/icons_new/eye.svg"
                                                    }
                                                    alt="eye-slash-icon"
                                                    className="svg-sm"
                                                    id="eyeIcon"
                                                    tabIndex="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg btn-block rounded-0"
                                        onClick={validateLogin}

                                    >
                                        {t(props.language?.layout?.login_signin)}
                                    </button>
                                    <a
                                        href="https://accelerate.cynaptx.com/public-login?client_id=632734b15c2c45c58193ebd9220f7364&client_secret=e029b6609bd842b182057aad0b4f4dc6&redirect_url=https://careerconnector.simplifyhire.com/loginsso"
                                        type="submit"
                                        className="btn btn-light btn-lg btn-block rounded-0"
                                    >
                                        {t(props.language?.layout?.login_cynaptx)}
                                    </a>
                                    {/* <div>
                                      <a
                                        href={`https://secure.indeed.com/oauth/v2/authorize?client_id=${process.env.INDEED_CLIENT_ID}&redirect_uri=${process.env.INDEED_REDIRECT_URI}&response_type=code&scope=email+offline_access+employer_access `}
                                        type="submit"
                                        className="btn btn-light btn-lg btn-block rounded-0">
                                   Sign in with Indeed
                                    </a>
                                    </div> */}
                                    {/* <div>
                                      <GoogleSocialAuth />
                                    </div> */}
                                    <div className="text-center my-3">
                                        {/* <a className="text-decoration-none" href="#">
                                            <LinkedInLogin />
                                        </a> */}

                                    </div>

                                    {process.env.CLIENT_NAME === "cc" &&
                                        <div className="d-flex justify-content-around">
                                            <div>
                                                <GoogleSocialAuth />
                                            </div>
                                            <div>
                                                <a href={`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&state=123456&scope=r_liteprofile%20r_emailaddress`}>
                                                    {/* Log in with Linked In */}
                                                    <button className="btn btn-lg mx-3" style={{ border: "1px solid #d5d5d5" }}>
                                                        <img
                                                            className="img-fluid px-3"
                                                            src="/svgs/social/linkedin-1.svg"
                                                            title="LinkedIn"
                                                            alt="LinkedIn Icon"
                                                        />
                                                    </button>
                                                </a>
                                            </div>
                                            <div>
                                                <a
                                                    href={`https://secure.indeed.com/oauth/v2/authorize?client_id=${process.env.INDEED_CLIENT_ID}&redirect_uri=${process.env.INDEED_REDIRECT_URI}&response_type=code&scope=email+offline_access+employer_access `}>
                                                    <button className="btn btn-lg" style={{ border: "1px solid #d5d5d5" }}>
                                                        <img
                                                            className="img-fluid px-4"
                                                            src="/svgs/social/indeed-1.svg"
                                                            title="Indeed"
                                                            alt="Indeed Icon"
                                                        />
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    }

                                    <div className="text-center m-3">
                                        <a href="/forgotPassword" className="text-primary">
                                            {t(props.language?.layout?.login_forgotpassword)}
                                        </a>
                                    </div>

                                    <p className="text-center">
                                        {t(props.language?.layout?.login_signup1)} <a href="/">{t(props.language?.layout?.login_signup2)}</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal size={"lg"} show={openModel} onHide={() => setOpenModel(false)}>
                        <div className="mb-4">
                            <div className="modal-content p-3 border-0">
                                <h5 className="pt-4">{t(props.language?.layout?.login_acceptterm)}</h5>
                                <p className="pt-5">
                                    {t(props.language?.layout?.login_iteminfo)}&nbsp;
                                    {
                                        roleId === 1 || roleId === 4 ?
                                            <Link to="/privacy-policy-ep" target="_blank">
                                                {t(props.language?.layout?.employer_signup_terms_and_conditions2)}
                                            </Link>
                                            : ""
                                    }

                                    {
                                        roleId === 2 || roleId === 5 ?
                                            <Link to="/privacy-policy-npp" target="_blank">
                                                {t(props.language?.layout?.employer_signup_terms_and_conditions2)}
                                            </Link>
                                            : ""
                                    }

                                    {
                                        roleId == null ?
                                            <Link to="/privacy-policy" target="_blank">
                                                {t(props.language?.layout?.employer_signup_terms_and_conditions2)}
                                            </Link>
                                            : ""
                                    }
                                    &nbsp;{t(props.language?.layout?.login_iteminforeq)}


                                </p>
                                <div className="d-flex justify-content-end mt-3">
                                    <div>
                                        <button className="btn btn-outline-secondary btn-md px-4 px-md-5 mr-4" onClick={() => setOpenModel(false)}>
                                            {t(props.language?.layout?.ep_setting_password_cancel)}
                                        </button>
                                        <button className="btn btn-primary btn-md px-5" onClick={() => consentHandler()}>
                                            {t(props.language?.layout?.login_agree)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
}

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        billing: state.authInfo.billing,
        language: state.authInfo.language,
        tenantTheme: state.authInfo.tenantTheme
    };
}

export default connect(mapStateToProps, { _setAuthData, _billingAuth, _languageName })(Login);
