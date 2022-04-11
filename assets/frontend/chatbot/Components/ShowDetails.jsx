import React from "react";
import { useContext } from "react";
import { InputContext } from "../Context/InputContext.js";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { chatbotKeys } from "../../../translations/helper_translation.jsx";

const UserDetails = (props) => {
    const { t } = useTranslation();
    let { requiredKeys, user, confirmDetails, showResume, disableBtn, questions, cancelUpdate } = useContext(InputContext);

    const requiredkeysHandler = (language, key) =>{
        return(chatbotKeys[language][key]);
    }

    return (
        <React.Fragment>
            <div className="col-md-12">
                {/* <div className="d-flex justify-content-end mr-2">
                    <span className="pr-1">Guest User</span>
                    <img src="/svgs/icons/chat_icon.svg" alt="Avatar" className="svg-sm" />
                </div> */}
                <div className="col-md-12 px-3">
                    {requiredKeys.map((item) => {
                        return (
                            <div className="pt-1">
                                {/* <img src="/svgs/icons/chat_conversations.svg" className="svg-md" alt="user message" /> */}
                                <p
                                    className={
                                        item === "email"
                                            ? "text-truncate mb-0 pb-2"
                                            : "text-capitalize text-truncate mb-0 pb-2"
                                    }
                                    title={item === "resume" ? user[item] : ""}>
                                    <b>
                                        <span className="text-capitalize">{requiredkeysHandler(props?.languageName, item)}: </span>
                                    </b>
                                    {user[item] ? user[item] : "-"}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <div className="col-md-12 d-flex justify-content-center my-2">
                    <button type="button"
                        disabled={disableBtn}
                        id="noBtn"
                        className="btn btn-primary mr-2"
                        value="Cancel"
                        onClick={showResume}>
                        {t(props.language?.layout?.js_profile_updateresume)}
                    </button>
                    <button
                        type="button"
                        id="yesBtn"
                        className="btn btn-success bg-green text-white"
                        value="Confirm"
                        // onClick={confirmDetails}
                        onClick={questions !== null ? cancelUpdate : confirmDetails}
                        disabled={disableBtn}
                    >
                        {questions !== null ? t(props.language?.layout?.proceed_nt) : t(props.language?.layout?.all_apply_nt)}
                    </button>
                </div>
            </div>
            {/* <SelectOption k={data.key}/> */}
        </React.Fragment>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}
export default connect(mapStateToProps, {})(UserDetails);