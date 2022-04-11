import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
// Capture 404 error in Rollbar
const Loading = (props) => {
    const { t } = useTranslation();
    return (
        <div>
            <h5 className="loading-text">{t(props.language?.layout?.loginloading_nt)}</h5>
            <div className="text-center">
                <img src="/images/loading.gif" className="login-loading-image" title="loader" />
            </div>
        </div>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps)(Loading);
