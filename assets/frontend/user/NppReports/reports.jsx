import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";


const Reports = (props) => {
    const { t } = useTranslation();
    return (
        <div className="col-md-10 px-0">
            <div className="container-fluid">
                <div className="row pt-4 px-3 gray-100">
                    <div className="col-md-6 p-0">
                        <h3 className="mb-3">{t(props.language?.layout?.reports_nt)}</h3>
                        <div className="d-flex align-items-center">
                            <img
                                className="svg-lg-x2 mr-3 mb-2"
                                src="svgs/rich_icons/reports.svg"
                                alt="Reports Icon"
                                title="Reports Icon"
                            />
                            <div>
                                <p className="mb-1">
                                    {t(props.language?.layout?.sp_report_info)}
                                </p>
                                <p> {t(props.language?.layout?.all_totalreports_nt)} : 5</p>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row px-3 mb-5">
                    <div className="basic-reports w-100">
                        <h5 className="border-bottom pb-1 mt-4">{t(props.language?.layout?.sp_report_basicreport)}</h5>
                        <div class="card-deck pt-2 ">
                            <a class="card border p-2 pointer text-decoration-none text-dark" href="/nppreport/jobseekerjournal" tabIndex="0">
                                <div className="d-flex align-items-center">
                                    <img
                                        className="mr-2 h-7rem p-1"
                                        src="svgs/rich_icons/Job_seeker_journal_report.svg"
                                        title="Report Details Icon"
                                        alt="Report Details Icon"
                                    />
                                    <div>
                                        <h5 className="font-weight-bold">{t(props.language?.layout?.reports_journal_nt)}</h5>
                                        <p className="text-muted mb-0  overflow-hidden h-4rem">
                                        {t(props.language?.layout?.seekers_registered_details_nt)}
                                        </p>
                                    </div>
                                </div>
                            </a>
                            <a class="card border p-2 pointer text-decoration-none text-dark" href="/nppreport/jobactivity" tabIndex="0">
                                <div className="d-flex align-items-center">
                                    <img
                                        className="mr-2 h-7rem p-1"
                                        src="svgs/rich_icons/Job_activity_report.svg"
                                        title="Report Details Icon"
                                        alt="Report Details Icon"
                                    />
                                    <div>
                                        <h5 className="font-weight-bold">{t(props.language?.layout?.job_activity_nt)}</h5>
                                        <p className="text-muted mb-0  overflow-hidden h-4rem">
                                        {t(props.language?.layout?.jobs_posted_nt)}
                                        </p>
                                    </div>
                                </div>
                            </a>
                            <a class="card border p-2 pointer text-decoration-none text-dark" href="/nppreport/openjobs"
                            tabIndex="0">
                                <div
                                    className="d-flex align-items-center pointer"
                                // onClick={() => getData("closed", "Historic_Pipeline")}
                                >
                                    <img
                                        className="mr-2 h-7rem p-1"
                                        src="svgs/rich_icons/Open_jobs_report.svg"
                                        title="Report Details Icon"
                                        alt="Report Details Icon"
                                    />
                                    <div>
                                        <h5 className="font-weight-bold">{t(props.language?.layout?.open_jobs_nt)}</h5>
                                        <p className="text-muted mb-0  overflow-hidden h-4rem">
                                        {t(props.language?.layout?.jobs_open_status_nt)}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="advanced-reports w-100 my-5">
                        <h5>{t(props.language?.layout?.ep_report_advancereport)}</h5>
                        <div class="card-deck pt-2">
                            <a class="card border p-2 pointer text-decoration-none text-dark"
                                href="/nppreport/currentapplication"
                            >
                                <div className="d-flex align-items-center">
                                    <img
                                        className="mr-2 h-7rem p-1"
                                        src="svgs/rich_icons/Current_application_summary.svg"
                                        title="Report Details Icon"
                                        alt="Report Details Icon"
                                    />
                                    <div>
                                        <h5 className="font-weight-bold">{t(props.language?.layout?.current_application_summary_nt)}</h5>
                                        <p className="text-muted mb-0  overflow-hidden h-4rem">
                                        {t(props.language?.layout?.applications_list_nt)}
                                        </p>
                                    </div>
                                </div>
                            </a>
                            <a class="card border p-2 pointer text-decoration-none text-dark"
                                href="/nppreport/jobseekersuccessmetric"

                            >
                                <div className="d-flex align-items-center">
                                    <img
                                        className="mr-2 h-7rem p-1"
                                        src="svgs/rich_icons/Job_seeker_success_metric.svg"
                                        title="Report Details Icon"
                                        alt="Report Details Icon"
                                    />
                                    <div>
                                        <h5 className="font-weight-bold">{t(props.language?.layout?.ep_report_sucessmetric)}</h5>
                                        <p className="text-muted mb-0  overflow-hidden h-4rem">
                                        {t(props.language?.layout?.captures_numbers_nt)}
                                        </p>
                                    </div>
                                </div>
                            </a>
                            <div class="card border-0 p-2"></div>
                            {/* <Link class="card border p-2 pointer text-decoration-none text-dark" to={{
                                pathname: "/report/successMetric",
                                props: {
                                    api: {
                                        method: 'get', status: "", endpoint: props.userRole.role_id == null ? "/api/v1/admin/report/candidatemetric" : "/api/v1/report/candidatemetric"
                                    },
                                    filename: "Candidate_Success_Metric", title: "Job Seeker Success Metric",
                                    desc: ["Captures the number of application a particular candidates go through before he / she being hired. It helps identifying top performing candidates in term of application conversion."],
                                    img: {
                                        src: "svgs/rich_icons/candidate_success_metric.svg",
                                        alt: "Report Details Icon"
                                    }
                                }
                            }}>
                                <div className="d-flex align-items-center">
                                    <img
                                        className="mr-2 h-7rem p-1"
                                        src="svgs/rich_icons/candidate_success_metric.svg"
                                        title="Report Details Icon"
                                        alt="Report Details Icon"
                                    />
                                    <div>
                                        <h5 className="font-weight-bold">Job Seeker Success Metric</h5>
                                        <p className="text-muted mb-0  overflow-hidden h-4rem">
                                            Captures the number of application a particular job seekers go through before he / she being hired. It helps identifying top performing candidates in term of application conversion.
                                        </p>
                                    </div>
                                </div>
                            </Link> */}
                        </div>
                    </div>
                    {/* <div className="compliance-reports w-100">
                        <h5>Compliance Reports</h5>
                        <div class="card-deck pt-2">
                            <Link class="card border p-2 pointer text-decoration-none text-dark" to={{
                                pathname: "/report/detail",
                                props: {
                                    api: {
                                        method: 'post', status: "", endpoint: "/api/v1/report"
                                    },
                                    filename: "Diversity_Reporting", title: "Diversity Reporting",
                                    desc: ["Help you to understand how compliant you are for diverse workforce"],
                                    img: {
                                        src: "svgs/rich_icons/diversity_reporting.svg",
                                        alt: "Report Details Icon"
                                    }
                                }
                            }}>
                                <div className="d-flex align-items-center">
                                    <img
                                        className="mr-2 h-7rem p-1"
                                        src="svgs/rich_icons/diversity_reporting.svg"
                                        title="Report Details Icon"
                                        alt="Report Details Icon"
                                    />
                                    <div>
                                        <h5 className="font-weight-bold">Diversity Reporting</h5>
                                        <p className="text-muted mb-0  overflow-hidden h-4rem">
                                            Reports display the current status of hiring process. this helps you to
                                            identify bottlenecks in process.
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            <div class="card border-0 p-2"></div>
                            <div class="card border-0 p-2"></div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        userRole: state.authInfo.user,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(Reports);
