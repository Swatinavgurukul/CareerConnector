import React, { useEffect, useState } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import MessageChat from "./adminMessages.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";


const InboxChat = (props) => {
    const { t } = useTranslation();
    // const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // console.log(props.textData, " inn cahat ");
    }, [props.textData]);
    const updateMessageData = (body) => {
        // console.log("Came  in body update ", body);
        props.updateMessageDataForUser(body, message);
        // setMessage("");
    };

    return (

        <div>
        {props.textData && props.textData.length > 0 ? (
            <div>
             { props.headerName == "" ?"":
                    <div className="gray-100">
                        <div className="row align-items-center p-3 ">
                            <div className="col-1">
                                <div
                                    className="rounded-circle text-capitalize d-flex align-items-center justify-content-center mr-3"
                                    style={{ width: "2rem", height: "2rem", backgroundColor: "#80808029" }}>
                                    {props.headerName == null || props.headerName == ""
                                        ? ""
                                        : props.headerName.charAt(0)}
                                </div>
                            </div>
                            <div className="col-10 ml-3 ml-lg-n1">
                                <h5 className="font-weight-bold mb-0 text-capitalize">{props.headerName}</h5>
                                {/* <h5>UI/UX Designer at North Loop</h5> */}
                            </div>
                        </div>
                    </div>
                  }
                    <MessageChat
                        messageData={props.textData}
                        updateMessageData={updateMessageData}
                        InboxAlignmentBorder={true}
                    />
                </div>
            ) : (
                <div className="text-center mt-5rem">
                    <img
                        src="/svgs/illustrations/candidate-message-empty-illustration.svg"
                        className="svg-gray mt-5rem mb-5"
                        alt="no data"
                    />
                    <h5>{t(props.language?.layout?.message_nothing_nt)}</h5>  
                </div>
            )}
        </div>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps)(InboxChat);
