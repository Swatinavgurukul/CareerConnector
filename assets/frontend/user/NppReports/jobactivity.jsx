import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../../partials/spinner.jsx";
import ReportTable from "../reportViews/reportTable.jsx";
import { useTranslation } from "react-i18next";


const JobActivity = (props) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [disable, setDisable] = useState(false);
    const [data, setData] = useState([]);
    const downloadReport = () => {
        setDisable(true)
        const formData = new FormData();
        formData.append("status", "active");
        axios({
            url: `/api/v1/report/sp/jobactivity/download`,
            method: `get`,
            data: formData,
            responseType: "blob",
            headers: { Authorization: `Bearer ${props.userToken}` },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `job_activity.xlsx`);
            document.body.appendChild(link);
            link.click();
            setDisable(false);
        }).catch(() => {
            setDisable(false);
        });
    };

    const AlignAlphaAndNumberInTable = (dataList) => {
        const formatedDataList = [];
        dataList.map((each) => {
            formatedDataList.push({
                single: [
                    // { name: t(props.language?.layout?.ep_createjob_title), value: each.title },
                    {
                        name: t(props.language?.layout?.ep_createjob_title),
                        value: props.languageName == "en" ? each.title == null || each.title == "" ? each.title_fr : each.title : (props.languageName == "esp" ? each.title_esp == null || each.title_esp == "" ? each.title? each.title:each.title_fr : each.title_esp:
                         (props.languageName == "fr" ? each.title_fr == null || each.title_fr == "" ? each.title : each.title_fr : each.title))
                    },
                    { name: t(props.language?.layout?.ep_createjob_hiringmanager), value: each.hiring_manager },
                    props.userRole.role_id == null && { name: t(props.language?.layout?.portal_nt), value: each.user__is_ca ? t(props.language?.layout?.globallocations_canada) : t(props.language?.layout?.globallocations_us) },
                    { name: t(props.language?.layout?.js_jobs_location), value: each.location },
                    { name: t(props.language?.layout?.ep_jobseeker_companyname), value: each.company_name },
                    { name: t(props.language?.layout?.ep_createjob_dateopened), value: each.job_start_date },
                    { name: t(props.language?.layout?.Total_applications_submitted_nt), value: each.total_application },
                    { name: t(props.language?.layout?.jobcreate_position_nt), value: each.positions },
                    { name: t(props.language?.layout?.your_pool_of_applicants_nt), value: each.application_count },
                    { name: t(props.language?.layout?.ep_dashboard_interviews), value: each.interview_count },
                    { name: t(props.language?.layout?.ep_dashboard_hires), value: each.hired_count },
                ],
                // application_count: 16
                // each.company_name: "Contoso Employer Org"
                // hired_count: 0
                // hiring_manager: "Joshua"
                // interview_count: 0
                // job_end_date: "2021-05-03"
                // job_start_date: "2021-04-19"
                // job_status: "draft"
                // location: ""
                // positions: 2
                // title: "Program Manager"
                // total_application: 42
                double: [
                    {
                        head: "Count",
                        data: [
                            // { name: "applied", value: each.applied_count },
                            // { name: "screening", value: each.screening_count },
                            // { name: "interview", value: each.interview_count },
                            // { name: "offered", value: each.offered_count },
                            // { name: "hired", value: each.hired_count },
                            // { name: "declined", value: each.declined_count },
                            // { name: "onhold", value: each.onhold_count },
                            // { name: "rejected", value: each.rejected_count },

                        ],
                    },
                ],
            });
        });
        return formatedDataList;
    };
    useEffect(() => {
        const formData = new FormData();
        formData.append("status", "active");
        axios({
            url: `/api/v1/report/sp/jobactivity`,
            method: `get`,
            data: formData,
            responseType: "json",
            headers: { Authorization: `Bearer ${props.userToken}` },
        })
            .then((response) => {
                setLoading(false);
                setData(AlignAlphaAndNumberInTable(Object.values(response.data.data)));
            })
            .catch(() => {
                setLoading(false);
                setData([]);
            });
    }, [props.languageName,props.language]);

    return (
        <div className="col-md-10 px-0">
            <div className="container-fluid">
                <div className="row pt-4 px-3 gray-100">
                    <div class="col-md-12 my-2 p-0">
                        <div class="d-flex align-items-center justify-content-between icon-invert">
                            <h4>
                                <Link className="text-muted" to={`/nppreport/`}>
                                    {t(props.language?.layout?.ep_allreports)}
                                </Link>
                                <img src="/svgs/icons_new/chevron-right.svg" alt="Right Arrow" class="svg-sm mx-1" />
                                <span className="text-dark">{t(props.language?.layout?.job_activity_nt)}</span>
                            </h4>
                            {!disable ?
                            <button
                                className={data.length ? "icon-invert d-flex btn btn-primary" : "icon-invert btn btn-outline-secondary"}
                                disabled={!data.length}
                                onClick={downloadReport}>
                                <img
                                    src="/svgs/icons_new/download.svg"
                                    alt="download"
                                    className={"svg-sm mr-1 " + (!data.length ? "disabled" : "invert-color")}
                                />
                                {t(props.language?.layout?.download_nt)}
                            </button>:
                            <div className="bouncingLoader btn btn-primary" style={{paddingLeft: "2.5rem", paddingRight: "2.5rem"}}>
                                <div></div>
                            </div>}
                        </div>
                        <div className="d-flex align-items-center">
                            <img
                                className="svg-lg-x2 mr-3 mb-2"
                                src="svgs/rich_icons/Job_activity_report.svg"
                                alt="Report Details Icon"
                                title="Report Details Icon"
                            />
                            <div>
                                <p className="mb-1">{t(props.language?.layout?.jobs_posted_nt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row px-3 mb-5 pt-3">
                    <div className="col-md-12 p-0">
                        <div className="card border-0">{loading ? <Spinner /> : <ReportTable data={data} />}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
        userRole: state.authInfo.user,
    };
}

export default connect(mapStateToProps, {})(JobActivity);
