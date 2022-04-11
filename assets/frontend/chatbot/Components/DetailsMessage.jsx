import React from "react";
import { chatbotKeys } from "../../../translations/helper_translation.jsx";
import { connect } from "react-redux";

const DetailsMessage = ({ data, type, username, languageName}) => {
    const getTime = () => {
        var date = new Date();
        let time = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
        return time;
    };

    const requiredkeysHandler = (language, key) =>{
        return(chatbotKeys[language][key]);
    }

    return (
        <div className="w-100 mt-3">
            <div className="d-flex justify-content-end mr-2">
                <span className="pr-1">{username ? username.split(" ")[0] : "Guest User"}</span>
                <img src="/svgs/icons_new/chat_icon.svg" alt="Avatar" className="svg-sm" />
            </div>
            <div className="d-flex">
                <div className="col-md-10 offset-2 mt-2">
                    <div className="bot-message bot-usr-msg pb-4 border border-dark bg-white">
                        {Object.keys(data).map((item) => {
                            return (
                                <React.Fragment>
                                    <p
                                        className={
                                            item === "email"
                                                ? "text-truncate mb-0 pb-2"
                                                : "text-capitalize text-truncate mb-0 pb-2"
                                        }
                                        title={item === "resume" ? data[item] : ""}>
                                        <b>
                                        <span className="text-capitalize">{requiredkeysHandler(languageName, item)}: </span>
                                        </b>
                                        {data[item] ? data[item] : "-"}
                                    </p>
                                </React.Fragment>
                            );
                        })}
                        <small className="float-right">
                            <i>{getTime()}</i>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};
// export default DetailsMessage;
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(DetailsMessage);