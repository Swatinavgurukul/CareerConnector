import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { getQueryParameters, isValidThemeLogo } from "../modules/helpers.jsx";
import { connect } from "react-redux";

const Approval = (props) => {
    const history = useHistory();

    const [message, setMessage] = useState("");

    /**
     * verifying Email
     */
    const approvalHandle = () => {
        let queryParamsUrl = getQueryParameters(history.location.search);
        axios
            .get("api/v1/approval?uidb64=" + queryParamsUrl.uidb64 + "&token=" + queryParamsUrl.token)
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                setMessage(error.response.data.message);
            });
    };
    useEffect(() => {
        approvalHandle();
    }, []);

    return (
        <>
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-md-4 p-0 login_image d-flex flex-column justify-content-end">
                        <img className="img-fluid m-0 p-0" src="/svgs/illustrations/login.svg" />
                    </div>
                    <div className="col-md-offset-4 col-md-4 m-auto">
                        <div className="text-center">
                            <a aria-labelledby="microsoft" href="/" className="navbar-brand">
                                <img
                                    alt="microsoft"
                                    // src="/uploads/user_v1llv353bppo/career_connector.jpg"
                                    src={props?.tenantTheme.banner}
                                    style={{ height: "3rem" }}
                                />
                            </a>
                            {/* {props.isloading === false ? (
                                isValidThemeLogo(props.theme.logo) ? (
                                    <img alt="microsoft" src={props.theme.logo} className="logo border-0" />
                                ) : (
                                    <img alt="microsoft" src="/images/logo.png" className="logo border-0" />
                                )
                            ) : (
                                <div></div>
                            )} */}
                        </div>
                        <h4 className="text-success text-center pt-4">{message}</h4>
                        {!props.user.authenticated ? (
                            <p className="text-center pt-1">
                                If you want to login? <a aria-labelledby="Signin" href="/login"> Sign In</a>
                                {/* {no_translated} */}
                            </p>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
function mapStateToProps(state) {
    return {
        user: state.authInfo.user,
        tenantTheme: state.authInfo.tenantTheme
    };
}

export default connect(mapStateToProps)(Approval);
