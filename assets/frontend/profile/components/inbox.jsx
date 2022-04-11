import React, { useState, useEffect } from "react";
import InboxThread from "./inboxThread.jsx";
import InboxChat from "./inboxChat.jsx";
import Axios from "axios";
import UserProfileHeader from "./userProfileheader.jsx";
import { connect } from "react-redux";
import {_messageCountAuth } from "../../actions/actionsAuth.jsx";
import { useTranslation } from "react-i18next";

const Inbox = (props) => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [textData, setTextData] = useState([]);
    const [incomming_data, setIncomming_data] = useState([]);
    const [dataValue, setDataValue] = useState("");
    const [allCount, setAllCount] = useState("");
    const [unreadCount, setUnreadCount] = useState("");

    useEffect(() => {
        fetchNotifications();
        getData();
    }, []);

    const fetchNotifications = (value) => {
        let apiEndPoint;
        if (value === "read") {
            apiEndPoint = "/api/v1/recruiter/applicants/messages?unread=True";
        } else {
            apiEndPoint = "/api/v1/recruiter/applicants/messages";
        }

        Axios.get(apiEndPoint, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                props._messageCountAuth(response.data.data.unread_count)
                setData(response.data.data.data);
                setAllCount(response.data.data.total_count);
                setUnreadCount(response.data.data.unread_count);
                sorting(response.data.data.data);
            })
            .catch((error) => {});
    };

    const sorting = (dataList) => {
        var sortData = dataList ? dataList : data
        let sorted_data = sortData.reverse()
        setData([...sorted_data]);
    };
    // console.log(props.user, "ssdd");
    const getData = () => {
        Axios.get(`/api/v1/users/profile/${props.user.user_id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                setIncomming_data(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                // if (error.status == 401) {
                //     // this.setState({ isLoading: false, errorCode: "logged_out" });
                // }
            });
    };

    const onClickHandleFromThread = (data, values) => {
        // console.log(data, values ," in onClickHandleFromThread INBOX ");
        setDataValue(values);
        setTextData(data);
    };
    const updateMessageDataForUser = (body, data1) => {
        // console.log(data[dataValue], " in mess age ", textData[0]);
        let message_data = {
            body: body,
            subject: "subject",
            recruiter: textData[0].recruiter_id,
            user: props.user.user_id,
            message_type: textData[0].message_type,
            is_read: 0,
            is_user: props.user.is_user,
            application: null,
        };
        Axios.post(`/api/v1/recruiter/user/${props.user.user_id}/message`, message_data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                fetchNotifications();
                onClickHandleFromThread(data[dataValue], dataValue);
            })
            .catch((error) => {});
        // console.log("came in here")
    };
    // console.log(props.messageCount,"inbox")

    return (
        <div class="container-fluid px-0">
            {/*   <UserProfileHeader user={incomming_data} message={true} getData={getData} isPreviewMode={true} /> */}
            <div class="row text-white prfileHeader_height brand-color px-2 pt-5 mx-0">
                <div class="col-lg-10 p-0 mx-auto pt-5">
                    <div class="d-flex">
                        <h1 class="h4 text-capitalize">
                            <img
                                src="/svgs/icons_new/message_black.svg"
                                className="svg-md invert-color mr-2"
                                alt="message"
                            />
                            {t(props.language?.layout?.js_messages)}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="row mx-0">
                <div className="col-lg-10 mx-auto">
                    {/*  <h5>Messages</h5>
                    <hr className="mt-1" /> */}
                    <InboxThread
                        data={data}
                        onClickHandleFromThread={onClickHandleFromThread}
                        fetchNotifications={fetchNotifications}
                        user={props.user}
                        allCount={allCount}
                        unreadCount={unreadCount}
                        sorting={sorting}
                    />
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {

    return {
        // theme: state.themeInfo.theme,
        user: state.authInfo.user,
        messageCount: state.authInfo.messageCount,
        language: state.authInfo.language


    };
}

export default connect(mapStateToProps, {_messageCountAuth})(Inbox);