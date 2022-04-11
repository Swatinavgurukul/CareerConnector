import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";


const Cards = (props) => {
    const { t } = useTranslation();

    // const [cardCount, setCardCount] = useState({
    //     applied_job: 0,
    //     interviews: 0,
    //     offered: 0,
    //     saved_job: 0
    // });

    // useEffect(() => {
    //    getCardsData();
    // }, []);


    // const getCardsData = (key) => {
    //     let apiEndPoint = "/api/v1/users/dashboard";
    //     if(key !== undefined && key !== "") {
    //         apiEndPoint = apiEndPoint+"?"+key;
    //     }
    //     axios.get(apiEndPoint, {
    //         headers: { Authorization: `Bearer ${props.userToken}` },
    //     })
    //     .then((response) => {
    //         let data = response.data.data;
    //         setCardCount({
    //             applied_job: data.applied_job,
    //             interviews: data.interviews,
    //             offered: data.offered,
    //             saved_job: data.saved_job
    //         });
    //     })
    //     .catch((error) => {
    //         console.error("Error", error); 
    //     });
    // }
    
    return (
        <div className="card px-2 py-3 rounded-xl border-grey" id="upcom-inter">
            <div className="d-md-flex justify-content-between mx-2">
                <h5 className="font-weight-bold h5-small">{t(props.language?.layout?.js_dashboard_summarycard)}</h5>
                <div className="mt-n2">
                    <select class="form-control border-white text-muted pointer" name="type" 
                            aria-label="select"
                            onChange={(e) => props.getCardsData(e.target.value)}>
                        <option value=""> {t(props.language?.layout?.js_dball_nt)}</option>
                        <option value="this_week=1">{t(props.language?.layout?.js_dbweek_nt)}</option>
                        <option value="month=1">{t(props.language?.layout?.js_dbmonth_nt)}</option>
                        <option value="month=6">{t(props.language?.layout?.js_db6month_nt)}</option>
                        <option value="last_one_year=1">{t(props.language?.layout?.js_dbyear_nt)}</option>
                    </select>
                </div>
            </div>
            <div className="d-md-flex mt-2 summary-cards">
                <div className="card-deck w-100 mx-0">
                    <div class="card rounded-xl px-2 py-3" style={{ backgroundColor: "#eaf9ff" }}>
                        <h5 className="font-weight-bold mb-0 h5-small">{t(props.language?.layout?.js_dashboard_appliedj)}<img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" title= {t(props.language?.layout?.jsdb_title1_nt)}/></h5>
                        <h1 className="text-center font-weight-bold p-4" style={{opacity: "1"}}>{ props.cardCount.applied_job}</h1>
                    </div>
                    <div class="card rounded-xl px-2 py-3" style={{ backgroundColor: "#f2dae5" }}>
                        <h5 className="font-weight-bold mb-0 h5-small"> {t(props.language?.layout?.all_interviewd_nt)} <img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" title={t(props.language?.layout?.jsdb_title2_nt)}/></h5>
                        <h1 className="text-center font-weight-bold p-4" style={{opacity: "1"}}>{ props.cardCount.interviews}</h1>
                    </div>
                    <div class="card rounded-xl px-2 py-3" style={{ backgroundColor: "#e5def2" }}>
                        <h5 className="font-weight-bold mb-0 h5-small"> {t(props.language?.layout?.js_application_offered)}<img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" title= {t(props.language?.layout?.jsdb_title3_nt)}/></h5>
                        <h1 className="text-center font-weight-bold p-4" style={{opacity: "1"}}>{ props.cardCount.offered}</h1>
                    </div>
                    <div class="card rounded-xl px-2 py-3" style={{ backgroundColor: "#e1f7f8" }}>
                        <h5 className="font-weight-bold mb-0 h5-small">{t(props.language?.layout?.js_application_savedjobs)}<img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" title= {t(props.language?.layout?.jsdb_title4_nt)}/></h5>
                        <h1 className="text-center font-weight-bold p-4" style={{opacity: "1"}}>{ props.cardCount.saved_job}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        userToken: state.authInfo.userToken
    };
}
export default connect(mapStateToProps)(Cards);
