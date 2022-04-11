import React, { Suspense, lazy, useState, useEffect, Fragment } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Accounts from "../setting_data/accounts.jsx";
import AppNotification from "../setting_data/appNotification.jsx";
import ChangePassword from "../setting_data/changePassword.jsx";
import JobPrefrence from "../setting_data/jobPrefrence.jsx";
import UserProfileHeader from "../profile/components/userProfileheader.jsx";
import AdminSetting from "./adminSetting.jsx";
import { connect } from "react-redux";
import Axios from "axios";
import { useTranslation } from "react-i18next";

const Setting = (props) => {
    const [incomming_data, setIncomming_data] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        getData();
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
    return (
        <Fragment>
            {props.user.role_id == 1 || props.user.role_id == 2 || props.user.role_id == 4 || props.user.role_id == 5? (
                <AdminSetting />
            ) : (
                <div className="col-lg px-0 pb-5">
                    <div>
                        <UserProfileHeader user={incomming_data} setting={true} />
                        <div class="col-lg-8 mx-auto mt-1 px-3">
                            <Tabs
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
                            </Tabs>
                        </div>
                    </div>
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
export default connect(mapStateToProps, {})(Setting);
