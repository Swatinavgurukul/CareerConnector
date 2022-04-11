import React, { useState, useEffect } from "react";
import Axios from "axios";
import ReactHtmlParser from "react-html-parser";
import { renderToLocaleDate } from "../../modules/helpers.jsx";
import { formatDistance, subDays } from "date-fns";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const ActivityStream = (props) => {
    const { t } = useTranslation();
    const [recentActivity, setRecentActivity] = useState([]);
    const [inactiveCandidate, setInactiveCandidate] = useState([]);
    const [upcomingInterview, setUpcomingInterview] = useState([]);
    const getData = () => {
        Axios.get(`/api/v1/recruiter/dashboard/activity`, {
            headers: { Authorization: `Bearer ${props.userToken}` },
        })
            .then((response) => {
                let activityData = [];
                Object.values(response.data.data).forEach((e) => {
                    Object.entries(e).forEach(([k, v]) => {
                        // if (k == "job") {
                        //     v.forEach((job) => {
                        //         activityData.push({
                        //             activity: `Job created for <strong>${job.title}</strong>.`,
                        //             date: job.created_at
                        //         })
                        //     })
                        // }

                        if (k == "applied_job") {
                            v.forEach((job) => {
                                activityData.push({
                                    activity: `<i>${job.user__first_name
                                        ? job.user__first_name.charAt(0).toUpperCase() +
                                    job.user__first_name.slice(1)
                                        : " "
                                        } ${job.user__last_name
                                            ? job.user__last_name.charAt(0).toUpperCase() +
                                            job.user__last_name.slice(1) +
                                            " "
                                            : ""
                                        }</i><strong>${t(props.language?.layout?.sp_jobtitle_applied)}</strong>${t(props.language?.layout?.allfor_nt)}<strong>
                                        ${props.languageName == "en" ? job.job__title == null || job.job__title == "" ? job.job__title_fr : job.job__title : (props.languageName == "esp" ? job.job__title_esp == null || job.job__title_esp == "" ? job.job__title ? job.job__title : job.job__title_fr : job.job__title_esp :
                                            (props.languageName == "fr" ? job.job__title_fr == null || job.job__title_fr == "" ? job.job__title : job.job__title_fr : job.job__title))}
                                         </strong>.`,
                                         //  ${job.job__title}
                                        //  </strong>.`,
                                    date: job.updated_at,
                                });
                            });
                        }
                    });
                });
                activityData.sort((a, b) => (a.date < b.date ? 1 : -1));
                setRecentActivity(activityData);
            })
            .catch((error) => {
                console.log(error);
            });
        Axios.get(`/api/v1/recruiter/dashboard/inactive`, {
            headers: { Authorization: `Bearer ${props.userToken}` },
        })
            .then((response) => {
                let inactiveData = [];
                response.data.data.forEach((e) => {
                    inactiveData.push(e);
                });
                setInactiveCandidate(inactiveData);
            })
            .catch((error) => {
                console.log(error);
            });
        Axios.get(`/api/v1/recruiter/dashboard/upcominginterviews`, {
            headers: { Authorization: `Bearer ${props.userToken}` },
        })
            .then((response) => {
                let interviews = [];
                response.data.data.forEach((e) => {
                    interviews.push(e);
                });
                setUpcomingInterview(interviews);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    useEffect(() => {
        getData();
    }, [props.languageName]);

    return (
        <div className="h-100">
            <div className="mb-3 d-flex flex-column" style={{ height: "10rem" }}>
                <div className="d-flex bg-white">
                    <div className="h5">
                    {t(props.language?.layout?.sp_dashboard_recentactivity)}{" "}
                        <abbr
                            title= {t(props.language?.layout?.dashboard_listdown_nt)}
                            className="align-top d-inline-flex">
                            <img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" />
                        </abbr>
                    </div>
                </div>
                <div className="border rounded h-100 overflow-auto thin-scrollbar" tabIndex="0">
                    <ul className="list-group">
                        {recentActivity.map((activity) => (
                            <li className="lightgrey list-group-item border-0 px-3 py-2">
                                <text className="d-flex flex-column">
                                    <text>{ReactHtmlParser(activity.activity)}</text>
                                    <div class="d-flex justify-content-between pb-0">
                                        <i className="small text-muted">{`${formatDistance(
                                            subDays(new Date(activity.date), 0),
                                            new Date()
                                        ).replace("about", " ")} ago`}</i>
                                        <text
                                            className="text-right font-weight-light text-muted"
                                            style={{ fontSize: "0.7rem" }}>
                                            {renderToLocaleDate(activity.date)}
                                        </text>
                                    </div>
                                </text>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mb-3 d-flex flex-column" style={{ height: "21rem" }}>
                <div className="d-flex bg-white">
                    <div className="h5">
                    {t(props.language?.layout?.sp_dashboard_inactiveseekers)}{" "}
                        <abbr
                            title= {t(props.language?.layout?.dashborad_abbr2_nt)}
                            className="align-top d-inline-flex">
                            <img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" />
                        </abbr>
                    </div>
                </div>
                <div className="border rounded h-100 thin-scrollbar " style={{ overflowY: "auto" }}>
                    <div className="table-responsive">
                        <table class="table" tabIndex="0">
                            <thead>
                                <tr>
                                    <th scope="col" className="align-top">{t(props.language?.layout?.sp_dashboard_name1)}</th>
                                    <th scope="col" className="align-top">{t(props.language?.layout?.sp_dashboard_jobapplied)}</th>
                                    <th scope="col" className="align-top">{t(props.language?.layout?.sp_dashboard_lastactive)}</th>
                                    {/* <th scope="col">Action</th> */}
                                </tr>
                            </thead>
                            {inactiveCandidate.map((candidate) => (
                                <tbody>
                                    <tr>
                                        <td className="text-capitalize align-top">{candidate.first_name} {candidate.last_name}</td>
                                        <td className="align-top">{candidate.job_applied}</td>
                                        <td className="align-top">{t(props.language?.layout?.never_nt)}</td>
                                        {/* <td>#</td> */}
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>
            </div>
            <div className="mb-3 d-flex flex-column">
                <div className="d-flex bg-white">
                    <h5>
                    {t(props.language?.layout?.sp_dashboard_upcominginterview)}{" "}
                        <abbr title= {t(props.language?.layout?.dashborad_abbr3_nt)} className="align-top d-inline-flex">
                            <img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" />
                        </abbr>
                    </h5>
                </div>
                <div
                    className="border rounded thin-scrollbar" tabIndex="0"
                    style={{ backgroundColor: "rgb(238, 250, 255)", height: "19rem", overflowY: "auto" }}>
                    <div className="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">{t(props.language?.layout?.sp_dashboard_name1)}</th>
                                    <th scope="col">{t(props.language?.layout?.sp_dashboard_date)}</th>
                                </tr>
                            </thead>
                            {upcomingInterview.length ? (
                                <tbody>
                                    {upcomingInterview.map((ui) => (
                                        <tr>
                                            <td className="text-capitalize">{ui.application__user__first_name || ""} {ui.application__user__last_name || ""}</td>
                                            <td>
                                                {renderToLocaleDate(ui.interview_date)},{" "}
                                                {(ui.interview_time || "").split(":").slice(0, 2).join(":")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            ) : (
                                <p className="p-3">{t(props.language?.layout?.nointerview_nt)}</p>
                            )}

                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        userRole: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName

    };
}
export default connect(mapStateToProps, {})(ActivityStream);