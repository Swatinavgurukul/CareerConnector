import React, { useState } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const AdminMessages = (props) => {
    const { t } = useTranslation();
    // const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const messageArray = [];

    const addMessages = () => {
        // props.updateMessageData(subject, message);
        props.updateMessageData(message);
        // setSubject("");
        setMessage("");
    };
    const validate = () => {
        if (message === null || message === "") {
            toast.error(t(props.language?.layout?.toast23_nt))
            return;
        }
        addMessages();
    }
    if (props.messageData && props.messageData !== undefined && props.messageData.length > 0 && props.messageData.length !== undefined) {
        // for(var i in props.Messages) { ****x.is_user*****
        Object.values(props.messageData).map((x) => {
            messageArray.push(
                <div className="messages-view">
                    <div className="row p-3">

                        {x.is_user == true ? (
                            <div className={"col-1" + (props.user.is_user ? " ml-auto mr-2 mr-lg-0" : "")}>
                                {x.image != "" && x.image != null ? (
                                    <img src={x.image} alt="User" title="User" className="rounded-circle svg-md" />
                                ) : (
                                    <div
                                        className="rounded-circle text-capitalize d-flex align-items-center justify-content-center mr-3"
                                        style={{ width: "2rem", height: "2rem", backgroundColor: "#80808029" }}>
                                        {(x.subject.split(",")[0] != null && x.subject.split(",")[0] != "") ? x.subject.split(",")[0].charAt(0) : ""}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={"col-1" + (props.user.is_user ? "" : " ml-auto mr-2 mr-lg-0")}>
                                {x.image != "" && x.image != null ? (
                                    <img src={x.image} alt="User" title="User" className="rounded-circle svg-md" />
                                ) : (
                                    <div
                                        className="rounded-circle text-capitalize d-flex align-items-center justify-content-center mr-3"
                                        style={{ width: "2rem", height: "2rem", backgroundColor: "#80808029" }}>
                                        {(x.subject.split(",")[0] != null && x.subject.split(",")[0] != "") ? x.subject.split(",")[1].charAt(0) : ""}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={"col-10" + (x.is_user == true ? (props.user.is_user ? " mx-lg-5 mx-4 mt-n4 text-right" : " mt-1 ml-3 ml-lg-n1") : (props.user.is_user == false ? " mx-lg-5 mx-4 mt-n4 text-right" : " mt-1 ml-3 ml-lg-n1"))}>
                            {/* <h5 className="font-weight-bold mb-0 text-capitalize">{x.user_name}</h5> */}
                            <p className="font-weight-bold text-capitalize mr-2">{x.is_user ? x.subject.split(",")[0] : x.subject.split(",")[1]}</p>
                            <p className="mt-2 mb-0">{x.body}</p>
                            <small>
                                {x.created_at === null ? "" : format(new Date(x.created_at), "MMM dd, yyyy | HH:mm a")}
                            </small>
                        </div>
                    </div>
                    <div className="px-3">
                        <hr className="my-1" />
                    </div>
                </div>
            );
        });
        // }
    } else {
        messageArray.push(
            <div className="text-center">
                <img
                    src="/svgs/illustrations/candidate-message-empty-illustration.svg"
                    className="svg-gray mt-5rem mb-5"
                    alt="no data"
                />
                <h5>{t(props.language?.layout?.ep_jobseeker_nomessage)}</h5>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0">
            <div className={props.InboxAlignmentBorder ? "" : "border my-3"}>
                <div className="messages-view-box thin-scrollbar">{messageArray}</div>
                {/*   <hr className="border" /> */}
                <div className="message-box px-3">
                    {/*   <input
                        type="text"
                        className="form-control no-outline shadow-none pl-0"
                        id="subject"
                        placeholder="Type a subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    /> */}
                    <hr className="my-1" />
                    <textarea
                        className="form-control no-outline shadow-none pl-0"
                        style={{ resize: "none" }}
                        id="messagebox"
                        rows="4"
                        placeholder= {t(props.language?.layout?.message_write_nt)} 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}></textarea>
                    <div className="text-right">
                        <button onClick={validate} className="btn btn-primary brand-color my-4 px-3">
                            <img src="/svgs/icons_new/send.svg" alt="send" class="svg-xs mr-2 invert-color" />
                            {t(props.language?.layout?.ep_jobtitle_send)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        // theme: state.themeInfo.theme,
        user: state.authInfo.user,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(AdminMessages);
