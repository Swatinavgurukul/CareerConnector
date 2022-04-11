import React, { Suspense, lazy, useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const NotificationsSetting = (props) => {

    const { t } = useTranslation();

    const postData = () => {
        Axios.put(`api/v1/setting/partner`, 
        {...props.data,  weekely_jobs_summary: props?.data?.weekely_jobs_summary, 
            daily_jobs_summary: props?.data?.daily_jobs_summary,
            organization: {
                name: props.org.name,
            },
            social_profile: {
                facebook_link: props.link.facebook_link,
                twitter_link: props.link.twitter_link,
                linkedin_link: props.link.linkedin_link,
            },
            designation: {
                department: props.dep.department,
                job_title: props.dep.job_title,
            }},
            { headers: { "content-type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                if (response.status === 200) {
                    toast.success(t(props.language?.layout?.toast90_nt));
                }
            })
            .catch((error) => {
                if (error) {
                    toast.error(t(props.language?.layout?.toast91_nt));
                }
            });
    };

    return (
        <div className="card border-0 mt-5 ml-3 rounded-0" id="Notifications_settings">
        <div className="card-body p-0 pb-5">
            <p>Jobs Summary Notifications</p>
            <form className="d-flex flex-row text-muted pt-2">
                <div className="form-check custom-checkbox mr-4 pl-1 pt-1">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="defaultCheck2"
                        value={props?.data?.daily_jobs_summary}
                        checked={props?.data?.daily_jobs_summary}
                        onChange={(e) => props.setData({ ...props?.data, daily_jobs_summary: e.target.checked })}
                    />
                    <label
                        className="form-check-label"
                        htmlFor="defaultCheck2"
                        tabIndex="0"
                        // onKeyDown={e => e.key === "Enter" && props.setData({ ...props?.data, daily_jobs_summary: e.target.checked })}
                        >
                    </label>
                    <span className="custom-checkbox-text mr-4">Daily</span>
                </div>
                <div className="form-check custom-checkbox mr-4 pl-1 pt-1">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="defaultCheck01"
                        value={props?.data?.weekely_jobs_summary}
                        checked={props?.data?.weekely_jobs_summary}
                        onChange={(e) => props.setData({ ...props?.data, weekely_jobs_summary: e.target.checked })}
                    />
                    <label
                        className="form-check-label"
                        htmlFor="defaultCheck01"
                        tabIndex="0"
                        // onKeyDown={e => e.key === "Enter" && props.setData({ ...props?.data, weekely_jobs_summary: e.target.checked })}
                        >
                    </label>
                    <span className="custom-checkbox-text stretched-link mr-4">Weekly</span>
                </div>
            </form>
        </div>

        <div className="d-md-flex p-0">
            <div className="col-12 text-right p-0 mt-3">
            <button className="btn btn-outline-secondary btn-md px-4 px-md-5 mx-4" >
                     {t(props.language?.layout?.sp_setting_password_cancel)}
                 </button>
                <button className="btn btn-primary btn-md px-5" onClick={(e) => postData()}>
                     {t(props.language?.layout?.ep_setting_cd_save)}
                 </button>
            </div>
        </div>
    </div>
    );
};
function mapStateToProps(state) {
    return {
        token: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(NotificationsSetting);
