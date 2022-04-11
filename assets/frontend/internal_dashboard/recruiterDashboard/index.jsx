import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Doughnut, HorizontalBar } from "react-chartjs-2";
import { truncate } from "../../modules/helpers.jsx";
import Cards from "./cards.jsx";
import LineChart from "./chart.jsx";
import ActivityStream from "./activity.jsx";
import { withTranslation } from 'react-i18next';
// import DatePicker from "react-datepicker";
class RecruiterDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: "",
            ApplicationDensityList: [],
            appDensityOpen: false,
            appDensityMaxSelectCount: 1,
            TimeToHire: [],
            fill_rate: {
                fill_rate: 0,
                hired_jobs: 0,
                openings_jobs: 0
            },
        };
        this.UpdateApplicationDensity = this.UpdateApplicationDensity.bind(this);
        this.ToggleApplicationDensityList = this.ToggleApplicationDensityList.bind(this);
    }
    getData = () => {
        Axios.get(`/api/v1/recruiter/dashboard/fillrate`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
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
        Axios.get(`/api/v1/recruiter/dashboard/application_density`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                let data = [];
                let count = 1;
                Object.values(response.data.data).forEach((density) => {
                    data.push({
                        // label: density.title,
                        label: this.props.languageName == "en" ? density.job__title : (this.props.languageName == "esp" ? density.job__title_esp == null || density.job__title_esp == "" ? density.job__title : density.job__title_esp :
                              (this.props.languageName == "fr" ? density.job__title_fr == null || density.job__title_fr == "" ? density.job__title : density.job__title_fr : density.job__title)),
                        count: density.applied_count !==null ? density.applied_count : "0" ,
                        selected: false,
                        id: count,
                    });
                    count += 1;
                });
                // console.log("response.data.data",response.data.data[0].openings);
                data.sort((a, b) => (a.count < b.count ? 1 : 0));
                if(data.length >= 5){
                data[0].selected = true;
                data[1].selected = true;
                data[2].selected = true;
                data[3].selected = true;
                data[4].selected = true;
                }else{
                    data.map(d => d.selected = true);
                }
                this.setState(Object.assign({}, { ...this.state, ApplicationDensityList: data }));
            })
            .catch((error) => {
                console.log(error);
            });

        Axios.get(`/api/v1/recruiter/dashboard/timetohire`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                let timeToHire = [];
                response.data.data.forEach((data) => {
                    timeToHire.push({
                        job_title: data.jobtitle,
                        days: data.days,
                    });
                });
                this.setState(Object.assign({}, { ...this.state, TimeToHire: timeToHire }));
            })
            .catch((error) => {
                console.log(error);
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
    UpdateMaxCount() {
        // not working
        if (this.state.ApplicationDensityList.filter((m) => m.selected).length <= 5) {
            this.setState(
                Object.assign(
                    {},
                    {
                        ...this.state,
                        appDensityMaxSelectCount: this.state.ApplicationDensityList.filter((m) => m.selected).length,
                    }
                )
            );
            // console.log(this.state.appDensityMaxSelectCount)
        } else {
            console.log("Max Selection Reached");
        }
    }
    ToggleApplicationDensityList() {
        this.setState({ ...this.state, appDensityOpen: !this.state.appDensityOpen });
    }
    UpdateApplicationDensity(dep) {
        const newAppDensityList = this.state.ApplicationDensityList.slice();
        // console.log(this.state.appDensityMaxSelectCount)
        if (this.state.ApplicationDensityList[dep.id - 1].selected == true) {
            // decrease counter
            newAppDensityList[dep.id - 1].selected = !newAppDensityList[dep.id - 1].selected;
            this.setState(
                Object.assign(
                    {},
                    {
                        ...this.state,
                        ApplicationDensityList: newAppDensityList,
                        appDensityMaxSelectCount: this.state.appDensityMaxSelectCount - 1,
                    }
                )
            );
        } else {
            // increase counter
            if (this.state.appDensityMaxSelectCount >= 5) {
                // already 5
                console.log("Max Selection Reached");
            } else {
                newAppDensityList[dep.id - 1].selected = !newAppDensityList[dep.id - 1].selected;
                this.setState(
                    Object.assign(
                        {},
                        {
                            ...this.state,
                            ApplicationDensityList: newAppDensityList,
                            appDensityMaxSelectCount: this.state.appDensityMaxSelectCount + 1,
                        }
                    )
                );
            }
        }
    }
    render() {
        const { t } = this.props;
        const DoughnutData = {
            datasets: [
                {
                    data: [
                        this.state.fill_rate.hired_jobs,
                        this.state.fill_rate.openings_jobs - this.state.fill_rate.hired_jobs || 1,
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
        const TimeToHireData = {
            datasets: [
                {
                    data: this.state.TimeToHire.map((m) => m.days),
                    barPercentage: 1,
                    categoryPercentage: 1,
                    maxBarThickness: 25,
                    barThickness: "flex",
                    backgroundColor: "rgb(133, 220, 122)",
                },
            ],
            labels: this.state.TimeToHire.map((m) => truncate(m.job_title, 15)),
        };
        const TimeToHireOptions = {
            aspectRatio: 2,
            responsive: true,
            legend: {
                display: false,
            },
            tooltips: {
                enabled: true,
                callbacks: {
                    label: (detail, data) => {
                        return `${this.state.TimeToHire.map((m) => m.job_title)[detail.index]} = ${this.state.TimeToHire.map((m) => m.days)[detail.index]
                            }`;
                    },
                },
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: t(this.props.language?.layout?.sp_dashboard_days),
                        },
                        stacked: true,
                        ticks: {
                            min: 0,
                            max: this.state.TimeToHire.map((m) => m.days)
                                .sort()
                                .reverse()[0],
                            stepSize: 10,
                        },
                        gridLines: {
                            drawOnChartArea: false,
                            color: "black",
                            lineWidth: 1,
                        },
                    },
                ],
                yAxes: [
                    {
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: t(this.props.language?.layout?.sp_dashboard_jobtitle),
                        },
                        gridLines: {
                            drawOnChartArea: false,
                            drawTicks: false,
                            color: "black",
                            lineWidth: 1,
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
                        {/* {this.state.welcome != "hide" ? (
                            <div class="col-md-12 border rounded p-3 mb-3 text-center">
                                <button
                                    class="btn btn-sm text-right float-right d-block px-0"
                                    onClick={() => {
                                        this.setState(Object.assign({}, { ...this.state, welcome: "hide" }));
                                        sessionStorage.setItem("welcome_message_recruiter", "hide");
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
                                    onClick={() => (window.location.href = "/jobSeekers")}>
                                    + Add Candidate
                                </btn>
                            </div>
                        ) : null} */}
                        <div className="d-md-flex">
                            <div className="col-md-4 p-0">
                                {/* <div className="mb-3">
                                    <div className="d-flex bg-white">
                                        <div className="h5">
                                        {t(this.props.language?.layout?.sp_dashboard_fillrate)}{" "}
                                            <abbr
                                                title= {t(this.props.language?.layout?.dashborad_abbr4_nt)}
                                                className="align-top d-inline-flex icon-invert">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr>
                                        </div>
                                    </div>
                                    <div className="border rounded p-3 position-relative" >
                                        <Doughnut data={DoughnutData} options={DoughnutOptions} />
                                    </div>
                                </div> */}
                                <div className="mb-3">
                                    <div className="d-flex bg-white">
                                        <h5>
                                            {t(this.props.language?.layout?.sp_dashboard_applicationdensity)}{" "}
                                            <abbr
                                                title={t(this.props.language?.layout?.dashborad_abbr5_nt)}
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr>
                                        </h5>
                                    </div>
                                    <div className="border rounded p-3 position-relative rounded overflow-auto thin-scrollbar" tabIndex="0" style={{ height: "15rem" }}>
                                        {/* <p>Date here</p> */}
                                        <div className="d-flex flex-row-reverse icon-invert">
                                            <img
                                                tabIndex="0"
                                                src="/svgs/icons_new/more-vertical.svg"
                                                class="svg-sm pointer"
                                                alt="menu"
                                                onClick={this.ToggleApplicationDensityList}
                                            />
                                        </div>
                                        {this.state.appDensityOpen ? (
                                            <div className="d-flex justify-content-end mt-1">
                                                <div className="border p-2 position-absolute bg-white pr-2">
                                                    <p>{t(this.props.language?.layout?.sp_dashboard_select)}</p>
                                                    {this.state.ApplicationDensityList.map((dep) => (
                                                        <div class="form-check" key={`id_${dep.id}`}>
                                                            <input
                                                                class="form-check-input pointer"
                                                                onClick={() => this.UpdateApplicationDensity(dep)}
                                                                type="checkbox"
                                                                checked={dep.selected}
                                                                id={`id_${dep.id}`}
                                                                name={`id_${dep.id}`}
                                                            />
                                                            <label
                                                                class="form-check-label pointer"
                                                                for={`id_${dep.id}`}>
                                                                {dep.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                        {this.state.ApplicationDensityList.map((dep) =>
                                            dep.selected ? (
                                                <div key={`id_${dep.id}`} className="py-1">
                                                    <div>{dep.label}</div>
                                                    <div className="font-weight-bold">{dep.count}</div>
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8 p-0 px-0 px-md-3">
                                <div className="mb-3">
                                    <div className="bg-white">
                                        <h5>
                                            {t(this.props.language?.layout?.sp_dashboard_timetohire)}{" "}
                                            <abbr
                                                title={t(this.props.language?.layout?.dashborad_abbr6_nt)}
                                                className="align-top d-inline-flex icon-invert">
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
                                        <HorizontalBar data={TimeToHireData} options={TimeToHireOptions} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="bg-white">
                                        <h5>
                                            {t(this.props.language?.layout?.sp_dashboard_tracker)}{" "}
                                            <abbr
                                                title={t(this.props.language?.layout?.dashborad_abbr7_nt)}
                                                className="align-top d-inline-flex icon-invert">
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
                                        <LineChart />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mt-4 p-0">
                        <ActivityStream />
                    </div>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    // console.log("state ", state);
    return {
        userToken: state.authInfo.userToken,
        refreshToken: state.authInfo.refreshToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName

    };
}
export default connect(mapStateToProps, {})(withTranslation()(RecruiterDashboard));
