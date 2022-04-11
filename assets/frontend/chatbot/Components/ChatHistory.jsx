import React from "react";
import DetailsMessage from "./DetailsMessage.jsx";
import TextMessage from "./textmessage.jsx";

const ChatHistory = ({ chats, showTyping, scrollDiv, username }) => {
    return (
        <React.Fragment>
            <div className={`row thin-scrollbar border border-top-0 d-flex flex-row history-height pb-2`}>
                {chats &&
                    chats.map((chat, index) => {
                        return (
                            <React.Fragment>
                                {chat.data.type === "text" ? (
                                    <TextMessage message={chat.data.value} type={chat.type} username={username} />
                                ) : chat.data.type === "details" ? (
                                    <DetailsMessage data={chat.data.value} type={chat.type} username={username} />
                                ) : null}
                            </React.Fragment>
                        );

                        // return <TextMessage message={chat.value} type={chat.type} ></TextMessage>;
                    })}
                {showTyping()}
                <span ref={scrollDiv}></span>
            </div>
        </React.Fragment>
    );
};

export default ChatHistory;
