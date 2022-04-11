import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";


const Cards = (props) => {
    const { t } = useTranslation();
    const [cardData, setCardData] = useState({
        active_applications: 0,
        applicant_hired: 0,
        total_candidates: 0,
        upcoming_interviews: 0,
    });
    useEffect(() => {
        axios.get(`/api/v1/recruiter/dashboard/count`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                // Recruiter
                setCardData({
                    active_applications: response.data.data.active_applications,
                    applicant_hired: response.data.data.applicant_hired,
                    total_candidates: response.data.data.total_candidates,
                    upcoming_interviews: response.data.data.upcoming_interviews,
                })
                // Hiring
                // cards["active_jobs"] = response.data.data.active_jobs;
                // cards["applicant_hired"] = response.data.data.applicant_hired;
                // cards["application_received"] = response.data.data.application_received;
                // cards["upcoming_interviews"] = response.data.data.upcoming_interviews;

            })
            .catch((error) => {
                console.log(error);
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
                                <h1 className="mr-auto" style={{ color: "#3f51b5" }}>{cardData.total_candidates}</h1>
                            </div>
                            <img
                                class="svg-lg svg-gray rounded-0"
                                src="svgs/temp/all_candidates.svg"
                                alt="Total Job Seekers" />
                        </div>
                        <div class="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_dashboard_totalseekers)}</div>
                    </div>
                    {/* <div class="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_dashboard_totalseekers)}</div> */}
                <div class="card rounded p-3" style={{ backgroundColor: "rgb(214, 243, 255)" }}>
                    <div class="d-flex justify-content-between">
                        <div>
                            <h1 className="mr-auto" style={{ color: "rgb(34, 142, 223)" }}>{cardData.active_applications}</h1>
                        </div>
                        <img
                            class="svg-lg svg-gray rounded-0"
                            src="svgs/temp/active_candidates.svg"
                            alt="Active Candidates" />
                        {/* <div class="card-text pt-4 pb-2 h5">Active Applications</div> */}
                        </div>
                        <div class="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_dashboard_activeapplications)}
                    </div>

                </div>
                <div class="card rounded p-3" style={{ backgroundColor: "rgb(255, 241, 213)" }}>
                    <div class="d-flex justify-content-between">
                        <div>
                            <h1 className="mr-auto" style={{ color: "rgb(190, 123, 22)" }}>{cardData.upcoming_interviews}</h1>
                        </div>
                        <img
                            class="svg-lg svg-gray rounded-0"
                            src="svgs/temp/interview.svg"
                            alt="Upcoming Interviews" />
                        {/* <div class="card-text pt-4 pb-2 h5">Upcoming Interviews</div> */}
                    </div>
                    <div class="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_dashboard_upcominginterviews)}</div>
                </div>
                <div class="card rounded p-3" style={{ backgroundColor: "rgb(230, 217, 255)" }}>
                    <div class="d-flex justify-content-between">
                        <div>
                            <h1 className="mr-auto" style={{ color: "rgb(139, 52, 193)" }}>{cardData.applicant_hired}</h1>
                        </div>
                        <img
                            class="svg-lg svg-gray rounded-0"
                            src="svgs/temp/hired.svg"
                            alt="Job Seekers Hired" />
                        {/* <div class="card-text pt-4 pb-2 h5">Job Seekers Hired</div> */}
                    </div>
                    <div class="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_dashboard_seekershired)}</div>
                </div>
            </div>
        </div>
        </div>
    )
}
function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    }
}
export default connect(mapStateToProps)(Cards);
