import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { _setAuthData } from "../actions/actionsAuth.jsx";
import jwt_decode from "jwt-decode";
import GoogleLogin from "react-google-login";
import { useHistory } from "react-router-dom";

const GoogleSocialAuth = (props) => {
    const history = useHistory();

    const default_user_object = {
        authenticated: false,
        name: "",
        chat_id: "",
        is_user: true,
        user_id: null,
    };
    const googleResponse = (response) => {
        const accessToken = response.tokenObj.access_token;
        const expires_at = response.tokenObj.expires_at;
        // session.googleLogin(accessToken, expires_at);
        googleLogin(accessToken, expires_at);
    };
    const googleLogin = (accesstoken, expires_at) => {
        Axios.post("/api/v1/googlelogin", {
            access_token: accesstoken,
        })
            .then(function (response) {
                if (response.status === 200) {
                    updateUserFromToken(response.data.access_token, response.data.refresh_token);
                    history.push("/dashboard");
                }
            })
            .catch(function (error) {});
    };
    const updateUserFromToken = (access_token, refresh_token) => {
        let decoded = jwt_decode(access_token);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("expires_at", decoded.exp - 600);
        let user_object = Object.assign({}, default_user_object, {
            authenticated: true,
            user_id: decoded.user_id,
            is_user: decoded.is_user,
            name: decoded.full_name,
        });
        props._setAuthData(user_object, access_token, refresh_token);
    };
    return (
        <GoogleLogin
            render={(renderProps) => (

                // <button
                //     type="submit"
                //     className="btn btn-light btn-lg btn-block rounded-0 mb-3 mt-3"
                //     onClick={renderProps.onClick}>
                //     <img
                //         src="/svgs/social/google.svg"
                //         alt="Google"
                //         className="svg-sm mx-2"
                //         disabled={renderProps.disabled}
                //     />{" "}
                //     Sign in with Google
                // </button>

                <button type="submit" className="btn btn-lg" onClick={renderProps.onClick} style={{ border: "1px solid #d5d5d5" }}>
                    <img
                        className="img-fluid px-md-4"
                        src="/svgs/social/google-1.svg"
                        title="Google"
                        alt="Google Icon"
                    />
                </button>
            )}
            clientId="644686263472-k7fo8b9tu0i3dh4kcq8d82kofjhtq4v0.apps.googleusercontent.com"
            onSuccess={googleResponse}
            onFailure={googleResponse}
            cookiePolicy={"single_host_origin"}
        />
    );
};
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
    };
}
export default connect(mapStateToProps, { _setAuthData })(GoogleSocialAuth);
