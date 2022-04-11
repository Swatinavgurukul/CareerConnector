import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import BasicDetails from "./BasicDetails.jsx";
import ChangePassword from "./changePassword.jsx";
import BillingDetails from "./BillingDetails.jsx";
import BillingDetailsNpp from "./billingDetailsNpp.jsx";
import NotificationSettings from "./notificationSettings.jsx";
import axios from "axios";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const AdminSetting = (props) => {
    const { t } = useTranslation();
    const [key, setKey] = useState("");
    const [data, setData] = useState();
    const [link, setLink] = useState({
        facebook_link: "",
        linkedin_link: "",
        twitter_link: "",
    });
    const [org, setOrg] = useState({
        name: "",
    });
    const [dep, setDep] = useState({
        department: "",
        job_title: "",
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios
            .get("api/v1/setting/tenant/key", {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                setKey(response.data.data.tenant_key);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    
    const notificationsData = (data) => {
        setData(data.account);
        setLink(data.social_profile_links);
        setOrg(data.organization);
        setDep(data.designation_details);
    }

    const copy = () => {
        var copyText = document.querySelector(".myInput");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
    };
    return (
        <div className="container-fluid">
            <div className="row pt-3 px-3 gray-100">
                <div className="col-md-12 my-2 px-md-0">
                    <div className="d-flex align-items-center justify-content-between icon-invert">
                        <h4 className="text-muted">
                        {t(props.language?.layout?.ep_setting_header)}
                            <img src="/svgs/icons_new/chevron-right.svg" alt="Right Arrow" class="svg-sm mx-1" />
                            <span className="text-dark">{t(props.language?.layout?.ep_setting_header_viewprofie)}</span>
                        </h4>
                    </div>
                    <div className="d-md-flex align-items-end justify-content-between mt-2">
                        <div className="d-flex">
                            <img
                                className="svg-lg-x2 mr-3 mb-2"
                                src="/svgs/rich_icons/settings.svg"
                                alt="Reports Icon"
                                title="Reports Icon"
                            />

                            <div>
                                <p className="mb-1">{t(props.language?.layout?.ep_setting_header_settings)} </p>
                                <p>{t(props.language?.layout?.ep_setting_header_description)}</p>
                            </div>
                        </div>
                        <div className="icon-invert">
                            {props.user.role_id === 2 ? (
                                <p className="d-flex justify-content-end">
                                    {t(props.language?.layout?.seeker_signupcode)}:{" "}
                                    <input
                                        className="myInput border-0 w-25 mr-2 bg-light font-weight-bold"
                                        readOnly
                                        title={key}
                                        value={key}></input>
                                    <img
                                        src="/svgs/icons_new/copy.svg"
                                        className="svg-xs ml-1 mt-1 svg-gray"
                                        onClick={copy}
                                        alt="copy"
                                    />
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row pt-4 px-3">
                <div className="col-md-12 my-2 px-0">
                    <Tabs defaultActiveKey="basic" id="uncontrolled-tab-example" className="nav-underline-primary">
                        <Tab eventKey="basic" title= {t(props.language?.layout?.ep_setting_bd)} >
                            <BasicDetails notificationsData={notificationsData}/>
                        </Tab>
                        <Tab eventKey="password" title= {t(props.language?.layout?.settings_password_nt)}>
                            <div className="row row align-items-center">
                                <div className="col-md-8 mt-4">
                                    <ChangePassword />
                                </div>
                                <div className="col-md-4 text-muted my-4 my-md-0">
                                    <p className="mb-0">
                                        - {t(props.language?.layout?.sp_setting_password_instruction)}
                                    </p>
                                    <p className="mb-0">- {t(props.language?.layout?.sp_setting_password_instruction1)}</p>
                                    <p className="mb-0">- {t(props.language?.layout?.sp_setting_password_instruction2)}</p>
                                    <p className="mb-0">
                                        - {t(props.language?.layout?.sp_setting_password_instruction3)}
                                    </p>
                                </div>
                            </div>
                        </Tab>
                        {props.user.role_id === 1 ? (
                            <Tab eventKey="billing" title= {t(props.language?.layout?.settings_companydetails_nt)}>
                                <BillingDetails />
                            </Tab>
                        ) : null}
                        {props.user.role_id === 2 ? (
                            <Tab eventKey="billing" title= {t(props.language?.layout?.settings_companydetails_nt)}> 
                                <BillingDetailsNpp />
                            </Tab>
                        ) : null}
                        {props.user.role_id === 1 ? (
                            <Tab eventKey="Notifications" title= "Notifications"> 
                                <NotificationSettings data={data} setData={setData} org={org} dep={dep} link={link}/>
                            </Tab>
                        ) : null}
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        user: state.authInfo.user,
        language: state.authInfo.language
        
    };
}

export default connect(mapStateToProps, {})(AdminSetting);
