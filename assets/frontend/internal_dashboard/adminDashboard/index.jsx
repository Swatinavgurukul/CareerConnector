import React, { Component } from "react";
import Axios from "axios";
import Cards from "./cards.jsx";
import ActivityStream from "./activity.jsx";
import { Doughnut, HorizontalBar } from "react-chartjs-2";
import { interpolateColors, truncate } from "../../modules/helpers.jsx";
import Chart from "chart.js";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

// import DatePicker from "react-datepicker";
class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: "",
            welcome: "" || sessionStorage.getItem("welcome_message_admin"),
            count: {
                active_job: 0,
                application_received: 0,
                upcoming_interviews: 0,
                applicant_hired: 0,
            },
            source: {},
            fill_rate: {},
            density: [],
        };
    }
    getData = () => {
        let countApiEndPoint = this.props.userRole.role_id == null ? `/api/v1/admin/dashboard/count` : `/api/v1/recruiter/dashboard/count`;
        let sourceApiEndPoint = this.props.userRole.role_id == null ? `/api/v1/admin/dashboard/source` : `/api/v1/recruiter/dashboard/source`;
        let fillrateApiEndPoint = this.props.userRole.role_id == null ? `/api/v1/admin/dashboard/fillrate` : `/api/v1/recruiter/dashboard/fillrate`;
        let jobseekerDensityApiEndPoint = this.props.userRole.role_id == null ? `/api/v1/admin/dashboard/jobseekerdensity` : `/api/v1/recruiter/dashboard/candidate`;
        Axios.get(countApiEndPoint, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                const incoming_data = response.data.data;
                if (incoming_data) {
                    this.setState(Object.assign({}, { ...this.state, count: { ...incoming_data } }));
                }
            })
            .catch((error) => {
                if (error.status == 401) {
                    // this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
        Axios.get(sourceApiEndPoint, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                const incoming_data = response.data.data;
                if (incoming_data) {
                    this.setState(Object.assign({}, { ...this.state, source: { ...incoming_data } }));
                }
            })
            .catch((error) => {
                if (error.status == 401) {
                    // this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
        Axios.get(fillrateApiEndPoint, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                const incoming_data = response.data.data;
                if (incoming_data) {
                    this.setState(Object.assign({}, { ...this.state, fill_rate: { ...incoming_data } }));
                }
            })
            .catch((error) => {
                if (error.status == 401) {
                    // this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
        Axios.get(jobseekerDensityApiEndPoint, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                const incoming_data = response.data.data;
                if (incoming_data) {
                    this.setState(Object.assign({}, { ...this.state, density: incoming_data.splice(0, 5) }));
                }
            })
            .catch((error) => {
                if (error.status == 401) {
                    // this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
    };
    componentDidMount() {
        this.getData();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.languageName !== this.props.languageName) {
            this.getData();
        }
    }
    titleCase = (string) => {
        return string
            .toLowerCase()
            .split("_")
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    };
    render() {
        const { t } = this.props;
        const DoughnutData = {
            datasets: [
                {
                    data: [
                        this.state.fill_rate?.hired_jobs,
                        this.state.fill_rate?.openings_jobs - this.state.fill_rate?.hired_jobs,
                    ],
                    backgroundColor: ["rgb(80, 166, 255)", "rgb(229, 242, 255)"],
                    borderWidth: 0,
                },
            ],
            labels: [t(this.props.language?.layout?.dashboard_candidates_nt), t(this.props.language?.layout?.dashboard_remaining_nt)],
            radius: 10,
        };
        const DoughnutOptions = {
            responsive: true,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: `${this.state.fill_rate.fill_rate || 0}% ${t(this.props.language?.layout?.ep_dashboard_fillrate)}`,
                fontSize: 16,
                position: "bottom",
            },
            tooltips: {
                enabled: true,
                callbacks: {
                    label: (detail, data) => {
                        return `${data.labels[detail.index]} = ${data.datasets[0].data[detail.index]}`;
                    },
                },
            },
            animation: {
                animateScale: true,
                animateRotate: true,
            },
            circumference: Math.PI,
            rotation: Math.PI,
        };
        const ApplicationSourceData = {
            datasets: [
                {
                    data: Object.values(this.state.source),
                    backgroundColor: interpolateColors(
                        "rgb(218, 76, 98)",
                        "rgb(231, 222, 212)",
                        Object.keys(this.state.source).length
                    ).map((m) => `rgb(${m[0]}, ${m[1]}, ${m[2]})`),
                    borderWidth: 0,
                },
            ],
            labels: Object.keys(this.state.source).map((text) => this.titleCase(text)),
        };
        const ApplicationSourceOptions = {
            responsive: true,
            legend: {
                display: false,
                position: "bottom",
                align: "start",
                labels: {
                    boxWidth: 10,
                },
            },
            title: {
                // display: false
            },
            animation: {
                animateScale: true,
                animateRotate: true,
            },
        };
        const CandidateDensityData = {
            datasets: [
                {
                    data: this.state.density.map((each) => each.candidate_count),
                    backgroundColor: "rgb(240, 52, 110)",
                },
            ],
            labels: this.state.density.map((each) =>
                //  truncate(each.title, 15)
                this.props.languageName == "en" ? each.title == null || each.title == "" ? truncate(each.title_fr, 15) : truncate(each.title, 15) : (this.props.languageName == "esp" ? each.title_esp == null || each.title_esp == "" ? each.title ? truncate(each.title, 15) : truncate(each.title_fr, 15) : truncate(each.title_esp, 15) :
                    (this.props.languageName == "fr" ? each.title_fr == null || each.title_fr == "" ? truncate(each.title, 15) : truncate(each.title_fr, 15) : truncate(each.title, 15)))),
        };
        const CandidateDensityOptions = {
            responsive: true,
            legend: {
                display: false,
            },
            tooltips: {
                enabled: true,
                callbacks: {
                    label: (detail, data) => {
                        return `${this.state.density.map((m) => m.title)[detail.index]} = ${this.state.density.map((m) => m.candidate_count)[detail.index]
                            }`;
                    },
                },
            },
            scales: {
                xAxes: [
                    {
                        stacked: true,
                        ticks: {
                            min: 0,
                            max: this.state.density
                                .map((each) => each.candidate_count)
                                .sort()
                                .reverse()[0],
                            stepSize:
                                this.state.density.map((each) => each.candidate_count).reduce((a, b) => a + b, 0) % 10,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: (this.props.language?.layout?.ep_dashboard_candidates),
                            fontSize: 10,
                        },
                        gridLines: {
                            color: "black",
                            drawOnChartArea: false,
                            lineWidth: 2,
                        },
                    },
                ],
                yAxes: [
                    {
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: (this.props.language?.layout?.ep_dashboard_jobtitle),
                            fontSize: 10,
                        },
                        gridLines: {
                            color: "black",
                            drawOnChartArea: false,
                            lineWidth: 2,
                        },
                    },
                ],
            },
        };
        const RecruitmentFunnelData = {
            datasets: [
                {
                    data: [
                        this.state.count.application_received,
                        this.state.count.applicant_screening,
                        // this.state.count.applied_job,
                        this.state.count.upcoming_interviews,
                        this.state.count.applicant_offered,
                        this.state.count.applicant_hired,
                    ],
                    barPercentage: 1,
                    categoryPercentage: 1,
                    barThickness: "flex",
                    maxBarThickness: 30,
                    backgroundColor: interpolateColors("rgb(0, 20, 77)", "rgb(10, 97, 153)", 5).map(
                        (m) => `rgb(${m[0]}, ${m[1]}, ${m[2]})`
                    ),
                },
            ],
            labels: [
                t(this.props.language?.layout?.ep_dashboard_applicants_review),
                t(this.props.language?.layout?.ep_dashboard_screening_candidates),
                t(this.props.language?.layout?.ep_dashboard_interviews),
                t(this.props.language?.layout?.ep_dashboard_offeredapplications),
                t(this.props.language?.layout?.ep_dashboard_hires),
            ],
        };
        const RecruitmentFunnelOptions = {
            aspectRatio: 2,
            responsive: true,
            legend: {
                display: false,
            },
            animation: {
                onComplete: function (x) {
                    const chartInstance = x.chart;
                    const ctx = chartInstance.ctx;
                    const height = chartInstance.controller.boxes[0].bottom;
                    ctx.textAlign = "center";
                    ctx.fillStyle = "White";
                },
            },
            scales: {
                xAxes: [
                    {
                        display: false,
                        stacked: true,
                        ticks: {
                            min: 0,
                            max: Object.values(this.state.count).sort().reverse()[0],
                            stepSize: 1,
                        },
                        gridLines: {
                            drawOnChartArea: false,
                        },
                    },
                ],
                yAxes: [
                    {
                        stacked: true,
                        gridLines: {
                            color: "rgb(39, 130, 159)",
                            drawOnChartArea: false,
                            drawTicks: false,
                            lineWidth: 2,
                        },
                    },
                ],
            },
        };

        return (
            <div className="container-fluid pt-3">
                <div className="row px-3">
                    <div className="col-md-9 mt-4 p-0">
                        <Cards />
                        {/* <div class="d-flex">
                            {this.state.welcome != "hide" ? (
                                <div class="col-md-12 border rounded p-3 mb-3 text-center">
                                    <button
                                        class="btn btn-sm text-right float-right d-block px-0"
                                        onClick={() => {
                                            this.setState(Object.assign({}, { ...this.state, welcome: "hide" }));
                                            sessionStorage.setItem("welcome_message_admin", "hide");
                                        }}>
                                        <img src="/svgs/icons_new/x.svg" alt="close-sectoin-icon"></img>
                                    </button>
                                    <img
                                        src="/svgs/illustrations/dashboard-welcome-illustrator.svg"
                                        class="welcome-dashboard-illustration"
                                        alt="welcome to dashboard"></img>
                                    <h1 class="font-weight-bold text-dark mt-3 mb-2">Welcome to Career Connector</h1>
                                    <btn
                                        class="btn btn-lg btn-primary my-4 px-5 py-2"
                                        onClick={() => (window.location.href = "/jobs/create")}>
                                        + Add Jobs
                                    </btn>
                                </div>
                            ) : null}
                        </div> */}
                        <div className="d-md-flex">
                            <div className="col-md-4 p-0">
                                <div className="mb-3">
                                    <div className="d-flex bg-white">
                                        <h5>
                                            {t(this.props.language?.layout?.ep_dashboard_fillrate)}{" "}
                                            <abbr
                                                title={t(this.props.language?.layout?.dashborad_abbr4_nt)}
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr>
                                        </h5>
                                    </div>
                                    <div className="border rounded p-3 position-relative">
                                        {/* <DatePicker
                                            className="w-100 form-control"
                                            selected={this.state.startDate}
                                            onChange={date => this.state = {...this.state, startDate: date}}
                                            placeholder="mm-yyyy"
                                            autoComplete="off"
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                            showFullMonthYearPicker
                                            placeholderText="mm-yyyy"
                                        /> */}
                                        <Doughnut data={DoughnutData} options={DoughnutOptions} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex bg-white">
                                        <h5>
                                            {t(this.props.language?.layout?.ep_dashboard_applicationsource)}{" "}
                                            <abbr
                                                title={t(this.props.language?.layout?.dashborad_abbr8_nt)}
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr>
                                        </h5>
                                    </div>
                                    <div className="border rounded p-3 position-relative" tabIndex="0">
                                        {/* <p>Date here</p> */}
                                        {this.state.source.broadbean_jobs == 0 && this.state.source.linkedin_jobs == 0 && this.state.source.ziprecruiter_jobs == 0 ?
                                            t(this.props.language?.layout?.dashboard_external_nt) : <Doughnut data={ApplicationSourceData} options={ApplicationSourceOptions} />
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8 p-0 pl-3">
                                <div className="mb-3">
                                    <div className="d-flex bg-white">
                                        <h5>
                                            {t(this.props.language?.layout?.ep_dashboard_recrutementfunnel)} {" "}
                                            <abbr
                                                title={t(this.props.language?.layout?.dashborad_abbr9_nt)}
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr>
                                        </h5>
                                    </div>
                                    <div className="border rounded p-3 position-relative">
                                        {/* <p>Date here</p> */}
                                        <HorizontalBar
                                            data={RecruitmentFunnelData}
                                            options={RecruitmentFunnelOptions}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex bg-white">
                                        <h5>
                                            {t(this.props.language?.layout?.ep_dashboard_jsdensity)} {" "}
                                            <abbr
                                                title={t(this.props.language?.layout?.dashborad_abbr10_nt)}
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr>
                                        </h5>
                                    </div>
                                    <div className="border rounded p-3 position-relative">
                                        {/* <p>Date here</p> */}
                                        <HorizontalBar
                                            data={CandidateDensityData}
                                            options={CandidateDensityOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mt-4 pr-0">
                        <ActivityStream />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        userRole: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName

    };
}
export default connect(mapStateToProps, {})(withTranslation()(AdminDashboard));
