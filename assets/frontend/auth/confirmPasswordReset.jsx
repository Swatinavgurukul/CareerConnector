import React, { useEffect, useState } from "react";
import { isValidThemeLogo } from "../modules/helpers.jsx";
import Axios from "axios";
import Error404 from "../partials/Error404.jsx";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";


const PasswordReset = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [cnfPassword, setCnfPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [newVisible, setNewVisible] = useState(false);
    const [disable, setDisable] = useState(false);
    const [validPassword, setValidPassword] = useState(true);
    const [validReCnfPass, setValidCnfPass] = useState(true);
    const [resetUrl, setRestUrl] = useState(false);
    const [uidb64, setUidb64] = useState(null);
    const [token, setToken] = useState(null);
    const regexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

    const invalidTokenHandler = () => {
        toast.error((t(props.language?.layout?.toast1_nt)));
        setRestUrl(false);
        return;
    };

    const toggleEyeIcon = (e) => {
        if (e.code === "Enter") {
            setVisible(!visible);
        }
    };

    const toggleEyeIconDown = (e) => {
        if (e.code === "Enter") {
            setNewVisible(!newVisible)
        }
    };

    const checkResetUrl = () => {
        const urlPath = history.location.search;
        if (urlPath) {
            // check for empty query string
            setRestUrl(true);
            if (urlPath.indexOf("&") > -1 && urlPath.indexOf("?uidb64=") > -1 && urlPath.indexOf("token=") > -1) {
                // check for keys of following in query parameter
                const Uid_Token = urlPath.split("&");
                const qUidb64 = Uid_Token[0].split("?uidb64=")[1];
                const qToken = Uid_Token[1].split("token=")[1];
                if (qToken.length == 0 || qUidb64.length == 0) {
                    // check for empty values of reuired keys in query parameter
                    invalidTokenHandler();
                } else {
                    setUidb64(qUidb64);
                    setToken(qToken);
                    Axios.get(
                        `api/v1/password/reset/confirmPasswordReset?uidb64=${Uid_Token[0].split("?uidb64=")[1]}&token=${Uid_Token[1].split("token=")[1]
                        }`,
                        {}
                    )
                        .then((response) => { })
                        .catch(() => {
                            invalidTokenHandler();
                        });
                }
            } else {
                invalidTokenHandler();
            }
        }
    };

    // get uid and token fron url
    useEffect(() => {
        checkResetUrl();
    }, []);

    const submit = (event) => {
        event.preventDefault();
        if (password.length < 8) {
            toast.error(t(props.language?.layout?.msg_67)
            );
            setValidPassword(false);
            return;
        }
        if (password !== cnfPassword) {
            toast.error(t(props.language?.layout?.msg_68));
            setValidCnfPass(false);
            return;
        }
        if (!regexp.test(password)) {
            toast.error(
                t(props.language?.layout?.msg_67)
            );
            setValidPassword(false);
            return;
        }
        confirmPasswordReset(cnfPassword, uidb64, token);
        setCheckValue(false);
        setDisable(true);
    };
    const confirmPasswordReset = (cnfPassword, uidb64, token) => {
        Axios({
            method: "patch",
            url: "api/v1/register/setpassword/confirm",
            data: {
                password: cnfPassword,
                uidb64: uidb64,
                token: token,
            },
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(function (response) {
                if (response.status === 200) {
                    toast.success(t(props.language?.layout?.toast2_nt));
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 5000);
                }
            })
            .catch(function (response) {
                //handle error
                toast.error(t(props.language?.layout?.toast3_nt));
                setTimeout(() => {
                    window.location.href = "/forgotPassword";
                }, 5000);
            });
    };
    return (
        <>
            <div className="container-fluid h-100">
                <div className="row">
                    <div className="col-md-4 p-0 login_image d-flex flex-column h-100">
                        <img className="img-fluid m-0 p-0" src="/images/login.jpg" alt="image" width="100%" />
                    </div>
                    <div className="col-md-offset-4 col-md-4 m-auto">
                        <div className="auth-trans-bg rounded p-2">
                        {resetUrl ? (
                            <>
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
                                <form method="POST">
                                    <h4 className="text-center mb-2"> {t(props.language?.layout?.reset_heading_nt)}</h4>
                                    <div className="form-group animated">
                                        <label
                                            className={
                                                validPassword
                                                    ? "form-label-active text-green"
                                                    : "form-label-active text-danger bg-white"
                                            }
                                            for="password">
                                            {t(props.language?.layout?.ep_setting_password_newpassword)}*
                                        </label>
                                        <input
                                            type={visible ? "text" : "password"}
                                            aria-label="password"

                                            className={
                                                validPassword ? "form-control mb-3" : "form-control mb-3 border-danger"
                                            }
                                            id="password1"
                                            name="password1"
                                            required
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setValidPassword(true);
                                            }}
                                        />
                                        <div className="d-flex justify-content-end mr-3">
                                            <a
                                                className="icon-invert mt-n5 mb-4"
                                                onClick={(e) => setVisible(!visible)}
                                                onKeyPress={(e) => toggleEyeIcon(e)}
                                            >
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
                                            </a>
                                        </div>
                                    </div>
                                    <div className="form-group animated">
                                        <label
                                            className={
                                                validReCnfPass
                                                    ? "form-label-active text-green"
                                                    : "form-label-active text-danger bg-white"
                                            }
                                            for="password">
                                            {t(props.language?.layout?.reset_confirm_nt)}*
                                        </label>
                                        <input
                                            // type="text"
                                            type={newVisible ? "text" : "password"}
                                            className={
                                                validReCnfPass ? "form-control mb-3" : "form-control mb-3 border-danger"
                                            }
                                            id="password2"
                                            name="password2"
                                            aria-label="cnfpassword"
                                            required
                                            value={cnfPassword}
                                            onChange={(e) => {
                                                setCnfPassword(e.target.value);
                                                setValidCnfPass(true);
                                            }}
                                        />
                                        <div className="d-flex justify-content-end mr-3">
                                            {/* <a className="mt-n5 mb-4" > */}
                                            <a
                                                className="icon-invert mt-n5 mb-4"
                                                onClick={(e) => setNewVisible(!newVisible)}
                                                onKeyPress={(e) => toggleEyeIconDown(e)}
                                            >
                                                {/* <img src="/svgs/icons_new/eye-off.svg" alt="eye-slash-icon" className="svg-sm " id="eyeSlashIcon" /> */}
                                                <img
                                                    src={
                                                        newVisible
                                                            ? "/svgs/icons_new/eye-off.svg"
                                                            : "/svgs/icons_new/eye.svg"
                                                    }
                                                    alt="eye-slash-icon"
                                                    className="svg-sm"
                                                    id="eyeIcon1"
                                                    tabIndex="0"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg btn-block rounded-0 mb-3"
                                        area-lebel="reset password"
                                        disabled={disable === true}
                                        onClick={submit}>
                                        {t(props.language?.layout?.reset_heading_nt)}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="mt-0 pt-0">
                                <Error404 />
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        tenantTheme: state.authInfo.tenantTheme
    };
}
export default connect(mapStateToProps)(PasswordReset);
