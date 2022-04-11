import React from "react";
import { _setAuthData, _billingAuth } from "../actions/actionsAuth.jsx";
import Loader from "../partials/loginloading.jsx";
import { connect } from "react-redux";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { getQueryParameters } from "../modules/helpers.jsx";

const LoginIndeed = (props) => {
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
        let urlPath = getQueryParameters(history.location.search);
        let url_data = urlPath.code;

        Axios.post("api/v1/indeed_login", { code: url_data }, { headers: { "Content-Type": "application/json" } })
            .then((response) => {
                if (response.status == 200) {
                    updateUserFromToken(response.data.access_token, response.data.refresh_token);
                    let decoded = jwt_decode(response.data.access_token);
                    if (decoded.is_user) {
                        history.push("/dashboard");
                    }
                }
            })
            .catch((error) => {
                toast.error("Email Id not found from Indeed");
                setTimeout(() => {
                    history.push("/login");
                }, 5000);
            });
    }, []);

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
    };

    return (
        <div>
            <Loader />
        </div>
    );
};

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        billing: state.authInfo.billing,
    };
}
export default connect(mapStateToProps, { _setAuthData, _billingAuth })(LoginIndeed);
