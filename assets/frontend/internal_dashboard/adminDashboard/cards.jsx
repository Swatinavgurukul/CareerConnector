import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const Cards = (props) => {
    const { t } = useTranslation();
    const [cardData, setCardData] = useState({
        active_jobs: 0,
        application_received: 0,
        upcoming_interviews: 0,
        applicant_hired: 0,
    });
    useEffect(() => {
        let apiEndPoint = props.userRole.role_id == null ? `/api/v1/admin/dashboard/count` : `/api/v1/recruiter/dashboard/count`
        axios.get(apiEndPoint, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                const incoming_data = response.data.data;
                console.log(incoming_data)
                if (incoming_data) {
                    setCardData({
                        active_jobs: response.data.data.active_jobs,
                        application_received: response.data.data.application_received,
                        upcoming_interviews: response.data.data.upcoming_interviews,
                        applicant_hired: response.data.data.applicant_hired,
                    });
                }
            })
            .catch((error) => {
                if (error.status == 401) {
                    // this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
    }, []);
    return (
        <div className="mb-3">
            <h5>{t(props.language?.layout?.sp_dashboard_summarycard)}<abbr title= {t(props.language?.layout?.sp_title_nt)} className="align-top d-inline-flex"><img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" /></abbr> </h5>
                <div className="d-md-flex">
                    <div className="card-deck w-100">
                    <div class="card rounded p-3" style={{ backgroundColor: "rgb(214, 243, 255)" }}>
                        <div class="d-flex justify-content-between icon-invert">
                            <div>
                                <h1 className="mr-auto" style={{ color: "rgb(34, 142, 223)" }}>{cardData.active_jobs}</h1>
                            </div>
                            <img
                                class="svg-lg svg-gray rounded-0 "
                                src="svgs/icons_new/briefcase.svg"
                                alt="Active Jobs" />
                        </div>
                        <div class="card-text pt-4 pb-2 h5">{t(props.language?.layout?.ep_dashboard_activejobs)}</div>
                    </div>
                    <div class="card rounded p-3" style={{ backgroundColor: "rgb(190, 255, 206)" }}>
                        <div class="d-flex justify-content-between icon-invert">
                            <div>
                                <h1 className="mr-auto" style={{ color: "rgb(7, 127, 4)" }}>{cardData.application_received}</h1>
                            </div>
                            <img
                                class="svg-lg svg-gray rounded-0 "
                                src="svgs/temp/application_received.svg"
                                alt="Application Received" />
                        </div>
                        <div class="card-text pt-4 pb-2 h5">{t(props.language?.layout?.ep_dashboard_applicationreceived)}</div>
                    </div>
                    <div class="card rounded p-3" style={{ backgroundColor: "rgb(255, 241, 213)" }}>
                        <div class="d-flex justify-content-between icon-invert">
                            <div>
                                <h1 className="mr-auto" style={{ color: "rgb(167 100 0)" }}>{cardData.upcoming_interviews}</h1>
                            </div>
                            <img
                                class="svg-lg svg-gray rounded-0"
                                src="svgs/temp/interview.svg"
                                alt="Upcoming Interviews" />
                        </div>
                        <div class="card-text pt-4 pb-2 h5">{t(props.language?.layout?.ep_dashboard_cominginterviews)}</div>
                    </div>
                    <div class="card rounded p-3" style={{ backgroundColor: "rgb(230, 217, 255)" }}>
                        <div class="d-flex justify-content-between icon-invert">
                            <div>
                                <h1 className="mr-auto" style={{ color: "rgb(139, 52, 193)" }}>{cardData.applicant_hired}</h1>
                            </div>
                            <img
                                class="svg-lg svg-gray rounded-0"
                                src="svgs/temp/hired.svg"
                                alt="Job Seekers Hired" />
                        </div>
                        <div class="card-text pt-4 pb-2 h5">{t(props.language?.layout?.ep_dashboard_jshired)}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        userRole: state.authInfo.user,
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(Cards);