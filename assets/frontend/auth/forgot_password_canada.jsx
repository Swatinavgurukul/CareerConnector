import React, { useState } from "react";
import { toast } from "react-toastify";
import { validate, res } from "react-email-validator";
import { isValidThemeLogo } from "../modules/helpers.jsx";
import axios from "axios";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next"

const ForgotPassword = (props) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [disable, setDisable] = useState(false);
    const [validEmail, setValidEmail] = useState(true);
    const handleKeyPress = (target) => {
        if (target.charCode == 13) {
            validateForgot();
        }
    }
    const sendPasswordResetEmail = (email) => {
        axios
            .post("/api/v1/password/reset", {
                email: email,
            })
            .then(function (response) {
                if (response.status === 200) {
                    // window.location.href = "/passwordResetDone";
                    toast.success(t(props.language?.layout?.toast11_nt));
                    // setTimeout(() => {
                    //     window.location.href = "/forgotPassword";
                    // }, 5000);
                }
                return null;
            })
            .catch(function (error) {
                // console.log(error.response.data,"errrr")
                // toast.error("Your email is not registered");
                toast.error(t(props.language?.layout?.toast12_nt))
            });
    };
    const validateForgot = () => {
        validate(email);
        if (!res) {
            toast.error(t(props.language?.layout?.toast13_nt));
            setValidEmail(false);
            return;
        } else {
            sendPasswordResetEmail(email);
            setDisable(false);
        }
    };
    return (
        <>
            <div className="container-fluid h-100">
                <div className="row">
                    <div className="col-md-4 p-0 login_image d-flex flex-column h-100">
                        <img className="img-fluid m-0 p-0" src="/images/login.jpg" alt=" image" width="100%" />
                    </div>
                    <div className="col-md-offset-4 col-md-4 m-auto">
                        <div className="auth-trans-bg rounded p-2">
                            <div className="mt-4 text-center">
                                <a href="/ca" className="navbar-brand">
                                    <img
                                        alt="microsoft"
                                        // src="/uploads/user_v1llv353bppo/career_connector.jpg"
                                        src={props?.tenantTheme.banner}
                                        style={{ height: "3rem" }}
                                    />
                                </a>
                            </div>
                            <div onKeyPress={handleKeyPress}>
                                <h4 class="text-center p-2">{t(props.language?.layout?.forgotpass_heading)}</h4>
                                <p class="text-center mb-0">
                                    {t(props.language?.layout?.forgotpass_description)}</p>
                                <div class="form-group animated mb-4">
                                    <label
                                        className={
                                            validEmail ? "form-label-active text-green" : "form-label-active text-danger bg-white"
                                        }
                                        for="email">
                                        {t(props.language?.layout?.forgotpass_email)}
                                    </label>
                                    <input
                                        type="email"
                                        className={validEmail ? "form-control" : "form-control border-danger"}
                                        id="email"
                                        aria-label="forgot"
                                        name="email"
                                        value={email || ""}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setValidEmail(true);
                                            setDisable(false);
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    class="btn btn-primary btn-lg btn-block rounded-0 mb-3"
                                    disabled={disable === true}
                                    onClick={validateForgot}>
                                    {t(props.language?.layout?.forgotpass_reset)}
                                </button>
                            </div>
                            <p class="text-center">
                                {t(props.language?.layout?.forgot_password_signin1)}<a href="/ca/login"> {t(props.language?.layout?.forgot_password_signin2)}</a> {t(props.language?.layout?.forgot_password_signin3)}
                            </p>
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
    }
}
export default connect(mapStateToProps)(ForgotPassword);
