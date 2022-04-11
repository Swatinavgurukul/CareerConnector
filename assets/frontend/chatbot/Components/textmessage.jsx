import React from "react";
import Parser from "html-react-parser";

const TextMessage = ({ message, type, username }) => {

    const getTime = ()=> {
        var date = new Date();
        let time = ("0" + date.getHours()).slice(-2)   + ":" +
        ("0" + date.getMinutes()).slice(-2)
        return time;
    }
    return (
        <div
            className={`d-flex flex-column mt-3 ${
                type === "user" ? "col-md-12 align-items-end  " : "col-md-10 align-items-start"
            }`}>
            {type === "bot" ? (
                <div>
                    <img src="/svgs/icons_new/bot_1.svg" alt="Avatar" className="svg-md" />
                    <span className="pl-1">Bot</span>
                </div>
            ) : null}
            {type === "user" ? (
                <div>
                    <span className="pr-1">{username ? username.split(" ")[0] : "Guest User"}</span>
                    <img src="/svgs/icons_new/chat_icon.svg" alt="Avatar" className="svg-sm" />
                </div>
            ) : null}
            <div
                className={`bot-message position-relative my-2 ${
                    type === "user" ? "border border-dark bg-white bot-usr-msg" : null
                }`}>
                <p className="m-0">{Parser(message)}</p>
                <small className="float-right">
                    <i>{getTime()}</i>
                </small>
            </div>
        </div>
    );
};
export default TextMessage;
