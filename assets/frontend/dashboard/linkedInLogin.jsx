import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import { _setAuthData } from "../actions/actionsAuth.jsx";
import jwt_decode from "jwt-decode";
import { getQueryParameters, removeEmpty, getQueryString } from "../modules/helpers.jsx";
import Loader from "../partials/loading.jsx";

class LinkedInLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            default_user_object: {
                authenticated: false,
                name: "",
                chat_id: "",
                is_user: true,
                user_id: null,
            }
        };
    }
    componentDidMount() {
        this.linkedinLoginFunction();
    }

    linkedinLoginFunction = () => {
        let urlPath = getQueryParameters(window.location.href);
        let url_data = urlPath.code;
        if (url_data) {
            Axios
                .post(`/api/v1/linkedin_login?code=${url_data}`, {})
                .then((response) => {
                    if (response.status === 200) {
                        this.updateUserFromToken(response.data.access_token, response.data.refresh_token);
                        window.location.href = "/dashboard";
                    }
                })
                .catch((error) => {
                    window.location.href = "/login";
                })
        }

    };

    updateUserFromToken = (access_token, refresh_token) => {
        let decoded = jwt_decode(access_token);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("expires_at", decoded.exp - 600);
        let user_object = Object.assign({}, this.state.default_user_object, {
            authenticated: true,
            user_id: decoded.user_id,
            is_user: decoded.is_user,
            name: decoded.full_name,
        });
        this.props._setAuthData(user_object, access_token, refresh_token, decoded.exp - 600);
    };

    render() {
        return (<div><Loader/></div>);
    }
}



function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        refreshToken: state.authInfo.refreshToken,
        user: state.authInfo.user,
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, { _setAuthData })(withTranslation()(LinkedInLogin));
