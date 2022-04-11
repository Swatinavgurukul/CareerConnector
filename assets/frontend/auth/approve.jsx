import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { getQueryParameters, isValidThemeLogo } from "../modules/helpers.jsx";
import { connect } from "react-redux";

const ApproveCredentials = (props) => {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    useEffect(() => {
        let queryParamsUrl = getQueryParameters(history.location.search);
        axios
            .get("/api/v1/adminlink?uidb64=" + queryParamsUrl.uidb64 + "&token=" + queryParamsUrl.token)
            .then((response) => {
                setSuccessMessage(response.data.message);
            })
            .catch((error) => {
                if (error.response.data.message) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage("Error while loading the page");
                }
            });
    }, []);

    return (
        <div className="w-100">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div className="col-md-4 p-0 login_image d-flex flex-column">
                        <img className="img-fluid m-0 p-0" src="/images/login.jpg" alt="image" />
                    </div>
                    <div className="col-md-offset-4 col-md-4">
                        <div className="text-center">
                            <a aria-labelledby="microsoft" href="/" className="navbar-brand">
                                <img
                                    alt="microsoft"
                                    // src="/uploads/user_v1llv353bppo/career_connector.jpg"
                                    src={props?.tenantTheme.banner}
                                    style={{ height: "3rem" }}
                                />
                            </a>
                        </div>
                        {successMessage.length ? (
                            <h4 className="text-success text-center pt-4">{successMessage}</h4>
                        ) : null}
                        {errorMessage.length ? <h4 className="text-danger text-center pt-4">{errorMessage}</h4> : null}
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
        </div>
    );
};
function mapStateToProps(state) {
    return {
        user: state.authInfo.user,
        tenantTheme: state.authInfo.tenantTheme

    };
}

export default connect(mapStateToProps)(ApproveCredentials);
