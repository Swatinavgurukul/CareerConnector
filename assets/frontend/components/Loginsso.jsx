import React from "react";
import { _setAuthData, _billingAuth } from "../actions/actionsAuth.jsx";
import Loader from "../partials/loginloading.jsx";
import { connect } from "react-redux";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import { useTranslation } from "react-i18next"

const Loginsso = (props) => {
    const { t } = useTranslation();
    const history = useHistory();

    const default_user_object = {
        authenticated: false,
        name: "",
        chat_id: "",
        is_user: true,
        user_id: null,
        role_id: null,
        is_consent: null,
        tenant_name: null,
    };

    useEffect(() => {
        fetch("https://accelerate.cynaptx.com/context/v2",
            {
                mode: 'cors',
                credentials: 'include',
                method: "POST"
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(data => userGetting(data.username))
            .catch((error) => {
                toast.error(t(props.language?.layout?.toast21_nt));
                setTimeout(() => {
                    history.push("/login");
                }, 5000);
            });
    }, []);
    const userGetting = (email) => {
        const body = {
            token: "abc",
            email: email,
        };
        Axios({
            method: "post",
            url: "/api/v1/sso_user",
            data: body,
        })
            .then((response) => {
                let access_token = response.data.data.access_token;
                let refresh_token = response.data.data.refresh_token;
                let decoded = jwt_decode(access_token);
                updateUserFromToken(access_token, refresh_token);
                if (decoded.is_user) {
                    history.push("/dashboard");
                }
            })
            .catch((error) => {
                toast.error("Email Id not found from Cynaptx");
                setTimeout(() => {
                    history.push("/login");
                }, 5000);
            });
    };

    const updateUserFromToken = (access_token, refresh_token) => {
        let decoded = jwt_decode(access_token);
        localStorage.setItem("access_token", access_token);
        let user_object = Object.assign({}, default_user_object, {
            authenticated: true,
            user_id: decoded.user_id,
            is_user: decoded.is_user,
            name: decoded.full_name ? decoded.full_name : "User",
            role_id: decoded.role_id,
            is_consent: decoded.is_consent,
            tenant_name: decoded.tenant_name,
        });
        props._setAuthData(user_object, access_token, refresh_token, decoded.exp - 600);
        props._billingAuth(decoded.billing);
        // Save User Object in Localstorage
    };

    return (
        <div>
            <Loader />
        </div>
    )
}

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        billing: state.authInfo.billing,
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, { _setAuthData, _billingAuth })(Loginsso);
