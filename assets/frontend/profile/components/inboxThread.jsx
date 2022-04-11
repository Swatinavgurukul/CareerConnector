import React, { useEffect, useState } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import InboxChat from "./inboxChat.jsx";
import Axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const InboxThread = (props) => {
    const { t } = useTranslation();
    const [textData, setTextData] = useState([]);
    const [dataValue, setDataValue] = useState("");
    const [name, setName] = useState("");
    var threadData = [];
    // var name = "";
    //   console.log(props.user.role_id , props.user.user_id,"props")
    const [disbles, setDisbles] = useState({
        isAll: true,
        isUnread: false,
    });
    const toAllElements = () => {
        setDisbles({ isAll: true, isUnread: false });
    };
    const toUnreadElements = () => {
        setDisbles({ isAll: false, isUnread: true });
    };

    const onClickHandleFromThread = (data, values) => {
        // console.log(data, values, " in onClickHandleFromThread INBOX ");
        setDataValue(values);
        setTextData(data);
        // setName(props.user.is_user ? data[0].subject.split(",")[1] : data[0].subject.split(",")[0]);
        if(data ===null){
            setName(props.user.is_user ? data[0].subject.split(",")[1] : data[0].subject.split(",")[0]);
          }
    };

    const updateMessageDataForUser = (body, data1) => {
        // console.log(props.data[dataValue], " in mess age ", textData[0]);
        let message_data = {
            body: body,
            subject: "subject",
            recruiter: props.user.is_user ? textData[0].recruiter_id : props.user.user_id,
            user: textData[0].user_id,
            message_type: textData[0].message_type,
            is_read: 0,
            is_user: props.user.is_user,
            application: textData[0].application_id,
        };
        Axios.post(`/api/v1/recruiter/user/${props.user.user_id}/message`, message_data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                props.fetchNotifications();
                onClickHandleFromThread(props.data[dataValue], dataValue);
            })
            .catch((error) => {
                toast.error(error.response.data.detail || "No response from server.");
            });
        // console.log("came in here")
    };

    const onClicktoRead = (message, val,val1) => {
        // console.log(message,val,val1,"val")
        let apiEndPoint;
        if (val !== null) {
            apiEndPoint = `/api/v1/recruiter/messages/${message}/${val1}/${val}`;
        } else {
            apiEndPoint = `/api/v1/recruiter/messages/${message}/${val1}`;
        }
        Axios.put(apiEndPoint,{},{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            }
        )
            .then((resp) => {
                props.fetchNotifications();
            })
            .catch((error) => {
                toast.error(error.response.data.detail || "No response from server.");
            });
    };

    useEffect(() => {
        if (dataValue) {
            onClickHandleFromThread(props.data[dataValue], dataValue);
        }
    }, [props.data]);
    if (props.data && props.data !== undefined && props.data.length>0 && props.data.length !== undefined) {

    Object.keys(props.data).map((x) => {
        // name = props.user.is_user
        //     ? props.data[x][props.data[x].length - 1].subject.split(",")[1]
        //     : props.data[x][props.data[x].length - 1].subject.split(",")[0];
        threadData.push(
            // props.data[x][props.data[x].length-1]
            <div
                className="lightgrey"
                tabIndex="0"
                onClick={() => {
                    onClickHandleFromThread(props.data[x], x);
                    // onClicktoRead(
                    //     props.data[x][0].message_type,
                    //     props.data[x][0].message_type === "application_message"
                    //         ? props.data[x][0].application_id
                    //         : props.user.is_user === false
                    //         ? props.data[x][0].user_id
                    //         : props.data[x][0].recruiter_id
                    // );
                    props.data[x][0].message_type === "application_message" ?

                    onClicktoRead(props.data[x][0].message_type , props.data[x][0].application_id , props.user.is_user === false ?  props.data[x][0].user_id : props.data[x][0].recruiter_id )
                    :
                    onClicktoRead(props.data[x][0].message_type , null , props.user.is_user === false ?  props.data[x][0].user_id : props.data[x][0].recruiter_id)
                }}
                    onKeyPress={() => {
                    onClickHandleFromThread(props.data[x], x);
                    props.data[x][0].message_type === "application_message" ?

                    onClicktoRead(props.data[x][0].message_type , props.data[x][0].application_id , props.user.is_user === false ?  props.data[x][0].user_id : props.data[x][0].recruiter_id )
                    :
                    onClicktoRead(props.data[x][0].message_type , null , props.user.is_user === false ?  props.data[x][0].user_id : props.data[x][0].recruiter_id)
                }}>
                {" "}
                <div class="media p-3">
                        <div
                            className="rounded-circle text-capitalize d-flex align-items-center justify-content-center mr-3"
                            style={{ width: "2rem", height: "2rem", backgroundColor: "#80808029" }}>
                            {props.data[x][props.data[x].length - 1] && props.data[x][props.data[x].length - 1] !== null ||
                                props.data[x][props.data[x].length - 1] !== undefined
                                ? props.user.is_user
                                    ? props.data[x][props.data[x].length - 1].subject.split(",")[1].charAt(0)
                                    : props.data[x][props.data[x].length - 1].subject.split(",")[0].charAt(0)
                                : ""}
                        </div>
                    <div
                        class={
                            "media-body " +
                            (props.data[x][props.data[x].length - 1].is_read !==undefined && props.data[x][props.data[x].length - 1].is_read  ? "text-muted" : "text-dark")
                        }>
                        <div className="d-flex justify-content-between">
                            <h5 className="font-weight-bold text-capitalize">
                                {props.data[x][props.data[x].length - 1] &&
                                props.data[x][props.data[x].length - 1] !== null ||
                                props.data[x][props.data[x].length - 1] !== undefined
                                    ? props.user.is_user
                                        ? props.data[x][props.data[x].length - 1].subject.split(",")[1]
                                        : props.data[x][props.data[x].length - 1].subject.split(",")[0]
                                    : ""}
                            </h5>
                            {/* <div className="brand-color text-white rounded-circle svg-xs text-center"><small style={{position: "relative", top: "-3px"}}>1</small></div> */}

                            { props.user.is_user === false ? (
                                props.data[x].find((o) => o.is_read === false && o.is_user === true) ? (
                                    <div
                                        className="text-primary mt-1 brand-color"
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                        }}></div>
                                ) : (
                                    <div
                                        className="text-primary mt-1 text-muted"
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                        }}></div>
                                )
                            ) : props.data[x].find((o) => o.is_read === false && o.is_user === false) ? (
                                <div
                                    className="text-primary mt-1 brand-color"
                                    style={{
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "50%",
                                    }}></div>
                            ) : (
                                <div
                                    className="text-primary mt-1 text-muted"
                                    style={{
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "50%",
                                    }}></div>
                            )}
                        </div>

                        <p className="mb-1">{props.data[x][props.data[x].length - 1].body !==undefined ? props.data[x][props.data[x].length - 1].body:""}</p>
                        <div className="text-right">
                            <small>
                                {props.data[x][props.data[x].length - 1].created_at === null ||
                                    props.data[x][props.data[x].length - 1].created_at === undefined

                                    ? ""
                                    : format(
                                          new Date(props.data[x][props.data[x].length - 1].created_at),
                                          "MMM dd, yyyy | HH:mm a"
                                      )}
                            </small>
                        </div>
                    </div>
                </div>
                <hr className="my-0" />
            </div>
        );
    })}

    // console.log(threadData)
    return (
        <div class="card-deck my-5">
            <div class="card col-lg-6 col-xl-5 p-0 mr-3">
                <div className="messages-view-box thin-scrollbar">
                    <div className="row px-2 py-3 border-bottom align-items-center">
                        <div className="col-xl-auto d-flex align-items-center">
                        <div className="col-4 col-md-3 col-xl-auto">
                                <h6 className="pt-2"> {t(props.language?.layout?.message_filters_nt)}</h6>
                            </div>
                            <div className="col-8 col-md-9 col-xl-auto">
                                <ul className="nav nav-pills nav-fill">
                                    <li className="mr-2">
                                        <a
                                            tabIndex="0"
                                            className={
                                                "nav-link rounded-pill py-0 pointer btn-sm btn " +
                                                (disbles.isAll ? "btn-secondary" : "btn-outline-secondary")
                                            }
                                            onClick={() => {
                                                props.fetchNotifications("all");
                                                toAllElements();
                                            }}>
                                            {t(props.language?.layout?.jobs_jobtype_all)} ({props.allCount !== null ? props.allCount : "0"})
                                        </a>
                                    </li>
                                    <li className="">
                                        <a
                                            tabIndex="0"
                                            className={
                                                "nav-link rounded-pill py-0 pointer btn btn-sm " +
                                                (disbles.isUnread ? "btn-secondary" : "btn-outline-secondary")
                                            }
                                            onClick={() => {
                                                props.fetchNotifications("read");
                                                toUnreadElements();
                                            }}>
                                            {t(props.language?.layout?.message_unread_nt)} ({props.unreadCount !== null ? props.unreadCount : "0"})
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                            <div className="col-xl-auto d-flex align-items-center ml-xl-auto">
                            <div className="col-4 col-md-3 col-xl-auto">
                                <h6 className="pt-2">{t(props.language?.layout?.message_sortby_nt)} :</h6> 
                            </div>
                            <div className="col-8 col-md-9 col-xl-auto">
                                <select
                                    className="border btn-sm py-0 text-capitalize"
                                    aria-label="status"
                                    onChange={() => props.sorting()}>
                                    <option className="bg-white" value="Latest">
                                    {t(props.language?.layout?.message_latest_nt)}
                                    </option>
                                    <option className="bg-white" value="old">
                                    {t(props.language?.layout?.message_old_nt)}
                                    </option>
                                </select>
                            </div>
                            </div>

                    </div>

                    {/*     <div class="d-flex border-bottom px-4 py-1">
                        <img src="/svgs/icons_new/search.svg" alt="search" class="svg-xs disabled mt-2 mr-4" />
                        <input
                            type="text"
                            className="form-control no-outline shadow-none pl-0"
                            placeholder="Search messages"
                        />
                    </div> */}

                    {props.data.length > 0 ? (
                        threadData
                    ) : (
                        <div className="text-center mt-5 pt-5">
                            <img
                                src="/svgs/illustrations/EmptyStateListIllustration.svg"
                                className="svg-gray img-fluid px-5"
                            />
                            <h5 className="pt-4">{t(props.language?.layout?.all_empty_nt)}</h5> 
                        </div>
                    )}
                </div>
            </div>
            <div class="card col-lg-6 p-0">
                <InboxChat textData={textData} updateMessageDataForUser={updateMessageDataForUser} headerName={name} />
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        refreshToken: state.authInfo.refreshToken,
        user: state.authInfo.user,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(InboxThread);
