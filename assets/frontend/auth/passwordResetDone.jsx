import React from "react";
import { isValidThemeLogo } from "../modules/helpers.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const PasswordResetDone = (props) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 p-0 login_image d-flex flex-column">
                        <img className="img-fluid m-0 p-0" src="/images/login.jpg" alt="image" width="100%" />
                    </div>
                    <div className="col-md-offset-4 col-md-4 m-auto">
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
                        <h2 class="text-center mb-2">{t(props.language?.layout?.forgotpass_heading)}</h2>
                        <div class="jumbotron bg-primary">
                            <h3 class="text-center text-white">{t(props.language?.layout?.fogotpass_email_nt)}</h3>
                            <p class="text-white text-justify">
                                {t(props.language?.layout?.fogotpass_email_info_nt)}
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
    };
}

export default connect(mapStateToProps)(PasswordResetDone);
