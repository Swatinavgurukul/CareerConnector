import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
// Capture 404 error in Rollbar

const Unauthorized = (props) => {
    const { t } = useTranslation();

    return (
        <div className="text-center pt-5 mt-5">
            <img
                src="/svgs/illustrations/error colored.svg"
                className="zero-state-image"
                style={{ height: "auto", width: "25rem" }}
                alt="Unauthorized Error"
            />
            <h2>{t(props.language?.layout?.notauthorized_nt)}</h2>
            <Link
                to="/"
                type="submit"
                className="btn btn-primary btn-lg rounded-0 my-4"
                >
               {t(props.language?.layout?.notauthorized_link_nt)}
            </Link>
        </div>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps)(Unauthorized);

