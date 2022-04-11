import React, { useEffect, useState } from "react";
import Axios from "axios";
import Spinner from "../partials/spinner.jsx";
import { truncate } from "../modules/helpers.jsx";
import { formatDistance, subDays, format } from "date-fns";
import { useOuterClick } from "../modules/helpers.jsx";
import { connect } from "react-redux";
import { _checkLogin } from "../actions/actionsAuth.jsx";
import { Link, useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const MessageNotification = (props) => {
    const history = useHistory();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isToggled, setToggled] = useState(false);
    const [count, setCount] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    const messageNotification = [];
    // const [seeMoreButton, setSeeMoreButton] = useState(false);

    const MSGNotificationDropdown = useOuterClick((ev) => {
        if (isToggled == true) {
            setToggled(false);
        }
    });

    useEffect(() => {
        // session.checkLogin();
        props._checkLogin();

        fetchNotifications();
    }, [pageCount,props.messageCount]);

    // const fetchNotifications = () => {
    //     Axios.get("/api/v1/recruiter/applicants/notify/messages", {
    //         headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    //     })

    //         .then((response) => {
    //             setData(response.data.data.data);
    //             setLoading(false);
    //             setCount(response.data.data.unread_count);
    //             let objDiv = document.getElementById("notifications");
    //             objDiv.scrollTop = objDiv.scrollHeight;
    //         })
    //         .catch((error) => {});
    // };
    const fetchNotifications = () => {
        Axios.get("/api/v1/recruiter/applicants/messages", {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })

            .then((response) => {
                setCount(response.data.data.unread_count);
            })
            .catch((error) => { });
    };

    const toggleNotifications = () => {
        setToggled(!isToggled);
    };
    const markAsRead = (i) => {
        Axios.put(
            "/api/v1/recruiter/applicants/notify/messages/" + data[i].id,
            {},
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            }
        )
            .then((res) => {
                if (res.status == 200) {
                    // fetchNotifications();
                }
            })
            .catch((error) => {
                toast.error(error.response.data.detail || "No response from server.");
            });
    };
    // console.log(props.messageCount,"count props")
    // console.log(count,"just count")

    return (
        <div>
                <div className="nav-item p-md-10 p-lg-4 sidebar-heading h-100"
                    //  onClick={toggleNotifications}
                    tabIndex="-1">
                    <div
                        className="d-flex icon-invert">
                        {count !== 0  ? (


                                 <a className="nav-link btn-svg d-flex order-1 p-0 pt-1 notification-icon position-relative">
                            <span className="badge badge-pill badge-danger">{count !== 0 ? count : " "}</span>
                             {/*   <div
                                className="text-primary bg-danger position-absolute z-index4"
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    marginLeft: "13px",
                                    marginTop: "-5px",
                                }}>
                                </div> */}
                        </a>

                        ) : (
                            ""
                        )}
                        <img id="Messages" src="/svgs/icons_new/message_header.svg" alt="Messages" className="svg-sm" />
                    </div>
                </div>

            {/*
            <div className="dropdown notify-icon">
                <div
                    ref={MSGNotificationDropdown}
                    className="p-lg-3 nav-item text-center dropdown position-absolute w-100 h-100"
                    style={{ top: 0, left: 0, zIndex: 1 }}>
                    <div
                        id="Notification"
                        className={
                            "dropdown-menu bg-white text-dark w-100 thin-scrollbar not-dropdown-menu navbar-dropdown " +
                            (isToggled == true ? " show " : "")
                        }
                        style={{ position: "absolute", top: "0px", borderRadius: "0px 0px 10px 10px" }}>
                        <div className="border border-left-0 border-right-0 border-top-0 border-white">
                            {loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    {data && data.length > 0 ? (
                                        data.map((data, index) => (
                                            <div
                                                onClick={(e) => {
                                                    markAsRead(index);
                                                    history.push("/inbox_messages");
                                                    setToggled(!isToggled);
                                                }}>
                                                <div class=" text-decoration-none">
                                                    <div
                                                        className="lightgrey position-relative"
                                                        style={{ zIndex: "0" }}>
                                                        <div class="media p-3">
                                                            <div
                                                                className="rounded-circle text-capitalize d-flex align-items-center justify-content-center mr-3"
                                                                style={{
                                                                    width: "2rem",
                                                                    height: "2rem",
                                                                    backgroundColor: "#80808029",
                                                                }}>
                                                                {data.user_name == null || data.user_name == ""
                                                                    ? ""
                                                                    : data.user_name.charAt(0)}
                                                            </div>
                                                            <div
                                                                class=
                                                                "media-body ">
                                                                <div className="d-flex justify-content-between">
                                                                    <div>
                                                                        <h6
                                                                            className=
                                                                            "text-capitalize m-0 font-weight-bold">
                                                                            {data.user_name}
                                                                        </h6>
                                                                    </div>
                                                                    <div
                                                                        className={`text-primary mt-1 ${data.is_read ? "bg-light" : "brand-color"
                                                                            }`}
                                                                        style={{
                                                                            width: "10px",
                                                                            height: "10px",
                                                                            borderRadius: "50%",
                                                                        }}></div>
                                                                </div>

                                                                <p
                                                                    className={
                                                                        "my-1 " +
                                                                        (data.is_read ? "text-muted" : "text-dark")
                                                                    }>
                                                                    {truncate(data.body, 116)}
                                                                </p>
                                                                <div className="d-flex justify-content-between">
                                                                    <i
                                                                        className={
                                                                            "small " +
                                                                            (data.is_read ? "text-muted" : "text-dark")
                                                                        }>
                                                                        {formatDistance(
                                                                            subDays(new Date(data.created_at), 0),
                                                                            new Date()
                                                                        ).replace("about", "")}{" "}
                                                                        ago
                                                                    </i>
                                                                    <i
                                                                        className={
                                                                            "small " +
                                                                            (data.is_read ? "text-muted" : "text-dark")
                                                                        }>
                                                                        {new Date(data.created_at).toLocaleTimeString(
                                                                            navigator.language,
                                                                            {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            }
                                                                        ) +
                                                                            "," +
                                                                            " " +
                                                                            format(
                                                                                new Date(data.created_at),
                                                                                "dd-LL-yyyy"
                                                                            )}
                                                                    </i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="px-3">
                                                            <hr className="my-0" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center pt-2" onClick={(e) => {
                                            history.push("/inbox_messages");
                                            setToggled(!isToggled);
                                        }}>
                                            {" "}
                                            You do not have any message notifications now
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

             */}
        </div>
    );
};

function mapStateToProps(state) {
    return {
        token: state.authInfo.userToken,
        user: state.authInfo.user,
        messageCount: state.authInfo.messageCount,

    };
}
function mapDispatchToProps(dispatch) {
    return {
        _checkLogin: () => dispatch(_checkLogin()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageNotification);
