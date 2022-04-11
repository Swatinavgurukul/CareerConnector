import React from "react";
import { useContext } from "react";
import { InputContext } from "../Context/InputContext";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const ConfirmApply = (props) => {
    const { t } = useTranslation();
    let { confirmApplication, closeChatBotHandle, confirmDetails } = useContext(InputContext);
    return (
        <div className="col-md-12 d-flex justify-content-between p-0">
            <React.Fragment>
                <button type="button" id="noBtn" className="btn btn-light" value="Cancel" onClick={closeChatBotHandle}>
               {t(props.language?.layout?.js_account_cancel)}
                </button>
                <button
                    type="button"
                    id="yesBtn"
                    className="btn btn-success"
                    value="Apply"
                    onClick={(e) => confirmDetails(e.target.value)}>
                    {t(props.language?.layout?.all_apply_nt)}
                </button>
            </React.Fragment>
        </div>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}
export default connect(mapStateToProps, {})(ConfirmApply);
