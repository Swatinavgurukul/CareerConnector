import React, { } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AppNotification = (props) => {

    const { t } = useTranslation();

    const handlePasswordReset = () => {
        let temp = {};
        temp.notify_primary_email = props.notificationData.notify_primary_email;
        temp.notify_secondary_email = props.notificationData.notify_secondary_email;
        temp.notify_phone = props.notificationData.notify_phone;

        const endpoint = `/api/v1/profilesetting/${props.user.user_id}`;
        Axios.put(endpoint, JSON.stringify({ app_notifications: temp }), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.userToken}`,
            },
        })
            .then((response) => {
                // console.log(response);
                if (response.status == 200) {
                    toast.success(t(props.language?.layout?.toast89_nt), {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
            .catch((error) => {
                toast.error("Something went wrong")
            });
    };

    return (
        <div className="card border-0 pt-3 rounded-0" id="Notifications_settings">
            <div className="card-body p-0 pb-5">
                <p>{t(props.language?.layout?.js_notifications_enablenotifications)}</p>
                <form className="d-flex flex-row text-muted pt-2">
                    <div className="form-check custom-checkbox mr-4 pl-1 pt-1">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="defaultCheck2"
                            value={props.notificationData.notify_primary_email}
                            checked={props.notificationData.notify_primary_email}
                            onChange={(e) => props.setNotificationData({ ...props.notificationData, notify_primary_email: e.target.checked })}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="defaultCheck2"
                            tabIndex="0"
                            onKeyDown={e => e.key === "Enter" && props.setNotificationData({ ...props.notificationData, notify_primary_email: e.target.checked })}>
                        </label>
                        <span className="custom-checkbox-text mr-4">{t(props.language?.layout?.js_notifications_primaryemail)}</span>
                    </div>
                    <div className="form-check custom-checkbox mr-4 pl-1 pt-1">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="defaultCheck01"
                            value={props.notificationData.notify_secondary_email}
                            checked={props.notificationData.notify_secondary_email}
                            onChange={(e) => props.setNotificationData({ ...props.notificationData, notify_secondary_email: e.target.checked })}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="defaultCheck01"
                            tabIndex="0"
                            onKeyDown={e => e.key === "Enter" && props.setNotificationData({ ...props.notificationData, notify_secondary_email: e.target.checked })}>
                        </label>
                        <span className="custom-checkbox-text stretched-link mr-4">{t(props.language?.layout?.js_notifications_secondaryemail)}</span>
                    </div>
                    {/* <div className="form-check custom-checkbox border border-dark pl-1 pt-1">
                     <span className="custom-checkbox-text stretched-link mr-4">Mobile SMS</span>
                     <input className="form-check-input"
                      type="checkbox"
                      id="defaultCheck02"
                      value={state.notify_phone}
                      checked={state.notify_phone}
                      onChange={handleMobileSmsStatus}
                      />
                     <label className="form-check-label" htmlFor="defaultCheck02"></label>
                  </div> */}
                </form>
            </div>

            <div className="d-md-flex p-0">
                <div className="col-12 text-right p-0 mt-3">
                    {/* <button
                        className="btn btn-outline-secondary btn-md px-4 px-md-5 mx-4"
                        onClick={() => { window.location.href = "/" }}>
                        {t(props.language?.layout?.js_notifications_cancel)}
                    </button> */}
                    <button
                        className="btn btn-primary btn-md px-4"
                        onClick={(e) => handlePasswordReset()}>
                        {t(props.language?.layout?.js_notifications_savechanges)}
                    </button>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        user: state.authInfo.user,
        userToken: state.authInfo.userToken,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(AppNotification);
