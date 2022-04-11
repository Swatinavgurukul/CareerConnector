import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";


const Cards = (props) => {
    const { t } = useTranslation();
    const [cardData, setCardData] = useState({
        profile_view: 0,
        applied_jobs: 0,
        saved_jobs: 0,
    });
    useEffect(() => {
        // ---------------------------bookmarks save jobs, applied jobs, profile view total count---------------------------------------------
        axios.get(`/api/v1/users/dashboard`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                let incoming_data = response.data.data;
                setCardData({
                    profile_view: incoming_data.profile_view,
                    applied_jobs: incoming_data.applied_job,
                    saved_jobs: incoming_data.saved_job,
                })
            })
            .catch((error) => {
                if (error.status == 401) {
                    // this.setState(Object.assign({}, {...this.state, isLoading: false, errorCode: "logged_out" }));
                }
            });
    }, []);
    return (
        <div className="mb-3">
            <h5>{t(props.language?.layout?.js_dashboard_summarycard)} <abbr title= {t(props.language?.layout?.sp_title_nt)} className="align-top d-inline-flex"><img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" /></abbr> </h5>
            <div className="d-md-flex">
                <div className="card-deck w-100">
                    <div class="card rounded p-3" style={{ backgroundColor: "rgb(214, 243, 255)" }}>
                        <div class="d-flex justify-content-between icon-invert">
                            <div>
                                <h1 className="mr-auto" style={{ color: "rgb(26, 110, 173)" }}>{cardData.profile_view}</h1>
                            </div>
                            <img
                                class="svg-lg svg-gray "
                                src="/svgs/temp/profile_view.svg"
                                alt="Profile View" />
                        </div>
                        <h5 class="card-text pt-4 pb-2">{t(props.language?.layout?.js_dashboard_viewprofile)}</h5>
                    </div>
                    <div class="card rounded p-3" style={{ backgroundColor: "rgb(190, 255, 206)"}}>
                        <div class="d-flex justify-content-between icon-invert">
                            <div>
                                <h1 className="mr-auto" style={{ color: "rgb(7, 127, 4)" }}>{cardData.applied_jobs}</h1>
                            </div>
                            <img
                                class="svg-lg svg-gray "
                                src="svgs/temp/applied_jobs.svg"
                                alt="Applied Jobs" />
                        </div>
                        <h5 class="card-text pt-4 pb-2">{t(props.language?.layout?.js_dashboard_appliedj)}</h5>
                    </div>
                    <div class="card rounded p-3" style={{ backgroundColor: "rgb(255, 241, 213)" }}>
                    <div class="d-flex justify-content-between icon-invert">
                        <div>
                            <h1 className="mr-auto" style={{ color: "rgb(190, 123, 22)" }}>{cardData.saved_jobs}</h1>
                        </div>
                        <img
                            class="svg-lg svg-gray "
                            src="svgs/temp/saved_jobs.svg"
                            alt="Saved Jobs" />
                    </div>
                    <h5 class="card-text pt-4 pb-2">{t(props.language?.layout?.js_dashboard_savedj)}</h5>
                </div>
                </div>
            </div>
        </div>
    )
}
function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps)(Cards);
