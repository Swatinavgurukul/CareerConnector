import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const Result404 = (props) => {
    const { t } = useTranslation();
    return (
        <div className="col-md-4 mx-auto py-5 text-center">
            <img
                src="/svgs/illustrations/EmptyStateListIllustration.svg"
                alt="Hero Image"
                className="zero-state-image img-fluid"
            />
            <h2>{t(props.language?.layout?.all_empty_nt)}</h2>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps)(Result404);