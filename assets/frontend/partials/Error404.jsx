import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// Capture 404 error in Rollbar

const Error404 = (props) => {
    const { t } = useTranslation();
    return (
        <div className="col-md-4 mx-auto py-5 text-center">
            <img
                src="/svgs/illustrations/error colored.svg"
                className="zero-state-image img-fluid"
                alt="Page Not Found"
            />
            <h2>{t(props.language?.layout?.error404_nt)}</h2>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps)(Error404);
