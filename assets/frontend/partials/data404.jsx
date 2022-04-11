import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const DataNotFound = (props) => {
    const { t } = useTranslation();
    return (
        <div className="col-md-3 mx-auto">
            <div className="text-muted text-center mt-5 pt-5">
                <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid"/>
                <h3 className="pt-2"> {t(props.language?.layout?.all_empty_nt)}</h3>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps)(DataNotFound);