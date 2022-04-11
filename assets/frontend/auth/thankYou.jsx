import React, { useState } from "react";
import { connect } from "react-redux";
import { _setAuthData } from "../../frontend/actions/actionsAuth.jsx";
import { useTranslation } from "react-i18next";

function ThankYou(props) {
    const { t } = useTranslation();
    return (
        <>
            <div className="container-fluid h-100">
                <div className="row">
                    <div className="col-md-4 p-0 login_image d-flex flex-column h-100">
                        <img className="img-fluid m-0 p-0" src="/images/login.jpg" alt="image" />
                    </div>
                    <div className="col-md-offset-2 col-md-6 mx-auto mt-5rem pt-1 px-3 ">
                        <div className="mr-1 ml-1 thankYou">
                            <div className="auth-trans-bg rounded pt-2 mt-lg-4">
                                <div className="mt-5 text-center">
                                    <a href="/" className="navbar-brand">
                                        <img
                                            alt="microsoft"
                                            // src="/uploads/user_v1llv353bppo/career_connector.jpg"
                                            src={props?.tenantTheme.banner}
                                            style={{ height: "3rem" }}
                                        />
                                    </a>
                                </div>
                            </div>
                            <div>
                                <div className="text-center mt-5 lead">
                                    <p>{t(props.language?.layout?.thankyou_nt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        tenantTheme: state.authInfo.tenantTheme
    };
}
export default connect(mapStateToProps, { _setAuthData })(ThankYou);
