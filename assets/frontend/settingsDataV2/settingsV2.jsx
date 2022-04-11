import React, { Suspense, lazy, useState, useEffect, Fragment } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Nav from 'react-bootstrap/Nav'
import Accounts from "../settingsDataV2/accounts.jsx";
import AppNotification from "../settingsDataV2/appNotification.jsx";
import ChangePassword from "../settingsDataV2/changePassword.jsx";
import JobPrefrence from "../settingsDataV2/jobPrefrence.jsx";
import UserProfileHeader from "../profile/components/userProfileheader.jsx";
import AdminSetting from "../setting_data/adminSetting.jsx";
import { connect } from "react-redux";
import Axios from "axios";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const SettingV2 = (props) => {
    const [incomming_data, setIncomming_data] = useState([]);
    const { t } = useTranslation();
    const [settingData, setSettingData] = useState({
        phone: "",
        email: "",
        id: "",
        secondary_email: "",
    });
    const [accSetting, setAccSetting] = useState({
        primaryEmail: "",
        phone: "",
        secondary_email: "",
        locale: ""
    });
    const [notificationData, setNotificationData] = useState({
        id: "",
        notify_phone: false,
        notify_primary_email: false,
        notify_secondary_email: false,
    })

    useEffect(() => {
        getData();
        getProfileData();
    }, []);

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

    const getProfileData = () => {
        Axios.get("/api/v1/profilesetting", {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                const accountSettingData = response.data.data.account;
                setSettingData(accountSettingData);
                setAccSetting({
                    ...accSetting,
                    primaryEmail: response.data.data.account.email,
                    secondary_email: response.data.data.account.secondary_email,
                    phone: response.data.data.account.phone,
                    locale: response.data.data.locale
                });
                setNotificationData({
                    ...notificationData,
                    id: response.data.data.app_notifications.id,
                    notify_phone: response.data.data.app_notifications.notify_phone,
                    notify_primary_email: response.data.data.app_notifications.notify_primary_email,
                    notify_secondary_email: response.data.data.app_notifications.notify_secondary_email,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Fragment>
            {props.user.role_id == 1 || props.user.role_id == 2 || props.user.role_id == 4 || props.user.role_id == 5 ? (
                <AdminSetting />
            ) : (
                <div className="col-lg px-0 pb-5">

                    <Tab.Container id="left-tabs-example" defaultActiveKey="jobprefrence">
                        <div className="d-lg-flex mt-5 justify-content-center">
                            {/* <UserProfileHeader user={incomming_data} setting={true} /> */}
                            <div className="col-lg-2">
                                <h5 className="d-flex align-items-center rounded border-silver p-3 mt-2">
                                    <img
                                        src="/svgs/icons_new/settings.svg"
                                        className="svg-sm mr-2 my-1"
                                        alt="mail"
                                    />
                                    {t(props.language?.layout?.ep_setting_header)}
                                </h5>
                                <Nav variant="pills" className="rounded flex-column left-side-tabs border-silver mt-3 h-22rem">
                                    <Nav.Item>
                                        <Nav.Link eventKey="accounts" className="py-3">
                                            <img
                                                src="/svgs/icons_new/users.svg"
                                                className="svg-sm mr-2 mt-n1 svg-gray"
                                                alt="mail"
                                            />
                                           {t(props.language?.layout?.js_account_accounts)}
                                        </Nav.Link>
                                    </Nav.Item>
                                    <div className="dropdown-divider mx-3"></div>
                                    <Nav.Item>
                                        <Nav.Link eventKey="jobprefrence" className="py-3">
                                            <img
                                                src="/svgs/icons_new/briefcase.svg"
                                                className="svg-sm mr-2 mt-n1 svg-gray"
                                                alt="mail"
                                            />
                                            {t(props.language?.layout?.js_jobpreference_preferences)}
                                        </Nav.Link>
                                    </Nav.Item>
                                    <div className="dropdown-divider mx-3"></div>
                                    <Nav.Item>
                                        <Nav.Link eventKey="changepassword" className="py-3">
                                            <img
                                                src="/svgs/icons_new/change-password.svg"
                                                className="svg-sm mr-2 mt-n1"
                                                alt="mail"
                                            />
                                            {t(props.language?.layout?.settings_changepassword_nt)}
                                        </Nav.Link>
                                    </Nav.Item>
                                    <div className="dropdown-divider mx-3"></div>
                                    <Nav.Item>
                                        <Nav.Link eventKey="appnotification" className="py-3">
                                            <img
                                                src="/svgs/icons_new/notification.svg"
                                                className="svg-sm mr-2 mt-n1"
                                                alt="mail"
                                            />
                                            {t(props.language?.layout?.js_notifications_notifications)}
                                        </Nav.Link>
                                    </Nav.Item>
                                    <div className="dropdown-divider mx-3"></div>
                                </Nav>
                            </div>
                            <div className="col-lg-8 mt-2 p-4 border-silver rounded ml-2">
                                {/* <Tabs
                                defaultActiveKey="accounts"
                                id="uncontrolled-tab-example"
                                className="nav-underline-primary">
                                <Tab eventKey="accounts" title={t(props.language?.layout?.js_account_accounts)}>
                                    <Accounts />
                                </Tab>
                                {
                                    props.user.user_id == 1 || props.user.role_id == 4 ? "" :
                                        <Tab eventKey="jobprefrence" title={t(props.language?.layout?.js_jobpreference_preferences)}>
                                            <JobPrefrence />
                                        </Tab>
                                }
                                <Tab eventKey="changepassword" title= {t(props.language?.layout?.settings_changepassword_nt)}>
                                    <ChangePassword />
                                </Tab>
                                {
                                    props.user.role_id == 4 ? "" :
                                        <Tab eventKey="appnotification" title={t(props.language?.layout?.js_notifications_notifications)}>
                                            <AppNotification />
                                        </Tab>
                                }
                            </Tabs> */}
                                <Tab.Content>
                                    <Tab.Pane eventKey="accounts">
                                        <Accounts settingData={settingData}
                                            setSettingData={setSettingData}
                                            accSetting={accSetting}
                                            setAccSetting={setAccSetting}
                                            getData={getProfileData} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="jobprefrence">
                                        <JobPrefrence />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="changepassword">
                                        <ChangePassword />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="appnotification">
                                        <AppNotification notificationData={notificationData}
                                            setNotificationData={setNotificationData}
                                            getData={getProfileData} />
                                    </Tab.Pane>
                                </Tab.Content>
                            </div>
                        </div>
                    </Tab.Container>
                </div>
            )}
        </Fragment>
    );
};
function mapStateToProps(state) {
    return {
        token: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(SettingV2);
