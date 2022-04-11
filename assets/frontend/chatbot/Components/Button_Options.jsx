import React, { useContext } from "react";
import { InputContext } from "../Context/InputContext.js";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const Button_Options = (props) => {
    let { buttonOptionOnClick } = useContext(InputContext);
    const { t } = useTranslation();

    return (
        <div className="col-md-12 my-3 d-flex justify-content-between" id="AnswerInputBox">
            <button className="btn btn-light p-2 " onClick={() => buttonOptionOnClick("jobs")}>
                <small>{t(props.language?.layout?.js_application_viewmore)}</small>
            </button>

            <button className="btn btn-light p-2" onClick={() => buttonOptionOnClick("profile")}>
                <small> {t(props.language?.layout?.js_application_visitprofile)}</small>
            </button>

            <button className="btn btn-primary p-2" onClick={() => buttonOptionOnClick("close")}>
                <small> {t(props.language?.layout?.js_application_closechat)} </small>
            </button>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps)(Button_Options);


