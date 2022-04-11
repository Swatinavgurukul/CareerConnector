import React, { Component } from "react";
// import { format, formatDistance, formatRelative, subDays } from "date-fns";
import Axios from "axios";
import { Line } from "react-chartjs-2";
import ReactHtmlParser from "react-html-parser";
import { connect } from "react-redux";
import { interpolateColors, renderToLocaleDate } from "../../modules/helpers.jsx";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { withTranslation } from 'react-i18next';
import Cards from "./cards.jsx";
import RecommendedJobs from "./recommendedJobs.jsx";
import { truncate, renderRange, renderCurrencyRange, resetToCapitalCasing } from "../../modules/helpers.jsx";
import MyCloud from "../cloudTags.jsx";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

class UserDashboardV2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            upcomIntData: [],
            resume_data: {},
            profile_data: {},
            profile_skills: [],
            last_login_time: "",
            recommJobsData: [],
            profileHeight: 0,
            upcomHeight: 0,
            profileData: [],
            resumeCount: "",
            cardCount: {
                applied_job: 0,
                interviews: 0,
                offered: 0,
                saved_job: 0
            }
        };
    }

    componentDidMount() {
        this.getUpcomingInterviews();
        this.getProfileData();
        this.getRecommendedJobs();
        this.profilePerformance("this_week=1");
        this.getCardsData();
        this.setState({ profileHeight: document.getElementById("profile-perf").offsetHeight -34 });
        this.setState({ upcomHeight: document.getElementById("upcom-inter").offsetHeight + 34 });
    }

    getUpcomingInterviews() {
        // Upcoming Interviews Data
        Axios.get("/api/v1/users/dashboard/upcominginterviews", {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                this.setState({ upcomIntData: response.data.data });
            })
            .catch((error) => {
            });
    }

    getProfileData = () => {
        let id_user = this.props.user.user_id;

        // Profile Details
        Axios.get(`/api/v1/users/details/${id_user}`, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                let incoming_data = response.data.data;
                this.setState({ profile_data: incoming_data.user_info });
                this.setState({
                    last_login_time: formatDistance(
                        subDays(new Date(incoming_data.user_info.last_login), 0),
                        new Date()
                    ).replace("about", "")
                });
                this.setState({ profile_skills: incoming_data.skill });
            })
            .catch((error) => {
            });

        // Profile Score
        Axios.get(`/api/v1/profile_score/${id_user}`, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                let incoming_data = response.data.data;
                this.setState({ resume_data: incoming_data });
            })
            .catch((error) => {
            });
    };

    getRecommendedJobs() {
        // Recommended Jobs Data
        Axios.get("/api/v1/users/dashboard/recommendedjobs", {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                this.setState({ recommJobsData: response.data.data });
            })
            .catch((error) => {
            });
    }

    removeJobCard = (slug) => {
        Axios.post(`/api/v1/users/dashboard/recommendedjobs/${slug}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                if (response.data.status == 201) {
                    toast.success(this.props.t(this.props.language?.layout?.toast116_nt))
                    this.getRecommendedJobs();
                }
            })
            .catch((error) => {
                if (error) {
                    toast.error(this.props.t(this.props.language?.layout?.toast58_nt))
                }
            });
    }

    markAsBookmark = (slug) => {
        Axios.put(
            `/api/v1/jobs/${slug}/bookmark`,
            {},
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            }
        ).then((res) => {
            if (res.status == 201) {
                toast.success(this.props.t(this.props.language?.layout?.toast31_nt));
                this.getCardsData();
                this.getRecommendedJobs();
            }
            if (res.status == 200) {
                toast.success(this.props.t(this.props.language?.layout?.toast32_nt));
                this.getRecommendedJobs();
                this.getCardsData();
            }
        });
    };

    profilePerformance(key) {
        // console.log(key);
        let apiEndPoint = "/api/v1/users/dashboard/profileperformance";
        if (key !== undefined && key !== "") {
            apiEndPoint = apiEndPoint + "?" + key;
        }
        Axios.get(apiEndPoint, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                this.setState({ profileData: response.data.data });
                this.setState({ resumeCount: response.data.data.resume_downloads.reduce((a, b) => a + b, 0) })
            })
            .catch((error) => {
                if (error) {
                    this.setState({ isLoading: false, errorCode: "logged_out" });
                }
            });
    }

    getCardsData = (key) => {
        let apiEndPoint = "/api/v1/users/dashboard";
        if (key !== undefined && key !== "") {
            apiEndPoint = apiEndPoint + "?" + key;
        }
        Axios.get(apiEndPoint, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                let data = response.data.data;
                this.setState({ cardCount: data })
            })
            .catch((error) => {
                console.error("Error", error);
            });
    }

    timeToMins = (time) => {
        var arr = time.split(':');
        return arr[0] * 60 + +arr[1];
    }

    timeFromMins = (mins) => {
        function min(n) { return (n < 10 ? '0' : '') + n; }
        var h = (mins / 60 | 0) % 24;
        var m = mins % 60;
        return min(h) + ':' + min(m);
    }

    addTimes = (t0, t1, date) => {
        var time = this.timeFromMins(this.timeToMins(t0) + this.timeToMins(t1));
        return new Date(date + " " + time).toLocaleTimeString(navigator.language,
            {
                hour: "2-digit",
                minute: "2-digit",
            });
    }

    renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {`${this.state.resumeCount} ${this.props.t(this.props.language?.layout?.profile_hm_nt)}`}
        </Tooltip>
    );

    render() {
        const { t } = this.props;

        const { profile_data, upcomIntData, resume_data, profile_skills, profileHeight, upcomHeight, recommJobsData } = this.state;

        var temp = 0;
        var resume_result = 0;
        Object.values(resume_data).map((x) => {
            resume_result = temp + x;
            temp = resume_result;
        });
        if (resume_data.about_me === 0 && resume_data.personal_info !== 0) {
            resume_result = resume_result - resume_data.personal_info;
        }


        // Line Chart Data
        const data = {
            labels: this.state.profileData.lable,
            datasets: [
                {
                    label: t(this.props.language?.layout?.jsdb_profileview_nt),
                    lineTension: 0,
                    data: this.state.profileData.profile_counts,
                    fill: false,
                    backgroundColor: 'rgb(255, 255, 255)',
                    borderColor: 'rgba(38, 128, 235) ',
                    yAxisID: 'y-axis-1',

                },
                // {
                //     label: 'Search Appearances',
                //     data: [300, 120, 400, 500, 300, 200],
                //     fill: false,
                //     backgroundColor: 'rgb(255, 255, 255)',
                //     borderColor: 'rgba(255, 169, 210)',
                //     yAxisID: 'y-axis-2',
                //     lineTension: 0,
                // },
                {
                    label: t(this.props.language?.layout?.jsdb_download_nt),
                    lineTension: 0,
                    data: this.state.profileData.resume_downloads,
                    fill: false,
                    backgroundColor: 'rgb(255, 255, 255)',
                    borderColor: 'rgba(100, 161, 100)',
                    yAxisID: 'y-axis-1',
                },
            ],
        };

        const options = {
            legend: {
                display: false,
            },
            responsive: true,
            aspectRatio: 1,
            scales: {
                yAxes: [
                    {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-axis-1',
                    },
                    // {
                    //     type: 'linear',
                    //     display: false,
                    //     position: 'right',
                    //     id: 'y-axis-2',
                    // },
                    {
                        type: 'linear',
                        display: false,
                        position: 'left',
                        id: 'y-axis-3',
                    },
                ],
            },
        };

        return (
            <div className="container-fluid">
                <div className="d-lg-flex mt-5">
                    <div className="col-lg-4 mb-3">
                        {/* Profile Layout */}
                        <div className="card p-3 rounded-xl border-grey profile-view-dash" style={{ height: upcomHeight + "px" }}>
                            <div className="d-md-flex justify-content-between mb-1">
                                <h5 className="font-weight-bold h5-small"> {t(this.props.language?.layout?.seeker_profile)}</h5>
                                <small>{t(this.props.language?.layout?.ep_jobs_lastupdated)}{" "}{ this.state.last_login_time != "less than a minute" ? t(this.props.language?.layout?.lessthanmin_nt) : this.state.last_login_time } {t(this.props.language?.layout?.all_ago_nt)}</small>
                            </div>
                            <div className="profile-image d-flex align-items-center">
                                {/* <div className="rounded-circle my-2">
                                    <img
                                        src={(profile_data.user_image == "" || profile_data.user_image == null) ? "/svgs/icons_new/user-icon.svg" : profile_data.user_image}
                                        className="rounded-circle svg-lg-x2"
                                        alt={t(this.props.language?.layout?.userimage_nt)}
                                    />
                                </div> */}
                                <div
                                className="rounded-circle mr-2 text-center d-flex align-items-center justify-content-center text-uppercase mt-1"
                                style={{ width: "60px", height: "60px", backgroundColor: "#80808029" }}>
                                {profile_data.user_image == "" || profile_data.user_image == null ? (
                                    (profile_data.first_name == null || profile_data.first_name == "") &&
                                        (profile_data.last_name == null || profile_data.last_name == "") ? (
                                            profile_data?.username?.charAt(0)
                                    ) : (
                                        <span>
                                            {profile_data.first_name != null &&
                                                profile_data.first_name != "" &&
                                                profile_data.first_name.charAt(0)}
                                            {profile_data.last_name != null && profile_data.last_name != "" && profile_data?.last_name?.charAt(0)}
                                        </span>
                                    )
                                ) : (
                                    <img src={profile_data.user_image} className="svg-lg-x2" alt="candidate profile image" />
                                )}
                            </div>
                                <h5 className="pl-3 text-capitalize h5-small">
                                    {(profile_data.first_name == null || profile_data.first_name == "") &&
                                        (profile_data.last_name == null || profile_data.last_name == "") ? (
                                        profile_data.username
                                    ) : (
                                        profile_data.first_name + " " + profile_data.last_name
                                    )}
                                </h5>
                            </div>
                            <div className="progress-completion my-2">
                                <p className="mb-0"> {t(this.props.language?.layout?.jsdb_progress_nt)}</p>
                                <div className="d-flex">
                                    <div className="progress mt-2 mr-3" style={{ height: "10px", width: "80%" }}>
                                        <div className="progress-bar" aria-label="progressbar" role="progressbar" style={{ width: resume_result + "%", background: "#85dc7a" }}></div>
                                    </div>
                                    <div>{resume_result}%</div>
                                </div>
                            </div>
                            <div className="profile-button my-2">
                                <Link
                                    to="/profile"
                                    type="button"
                                    className="btn btn btn-primary px-4">
                                    {resume_result !== 100 ? t(this.props.language?.layout?.jsdb_update_nt) : t(this.props.language?.layout?.jsdb_review_nt)}
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 mb-3">
                            {/* Cards */}
                            <Cards cardCount={this.state.cardCount}
                            getCardsData={this.getCardsData} />
                    </div>    
                </div>
                <div className="d-lg-flex">
                    <div className="col-lg-4 mb-5 pb-1 mb-lg-0 pb-lg-0">
                        {/* Upcoming Interviews */}
                        <div className="card p-3 rounded-xl border-grey" style={{ height: profileHeight + "px" }}>
                            <h5 className="font-weight-bold h5-small">{t(this.props.language?.layout?.ep_dashboard_cominginterviews)}</h5>
                            {upcomIntData === undefined || !upcomIntData.length ? (
                                <div className="text-center mt-4 mb-5">
                                    <img
                                        className="img-fluid"
                                        src="/svgs/illustrations/no-upcoming-interview.svg"
                                        alt="No Notes"
                                    />
                                    <p className="text-muted mt-2 mb-1">{t(this.props.language?.layout?.jsdb_nointerviews_nt)}</p>
                                    <p className="text-muted">{t(this.props.language?.layout?.jsdb_try_nt)}</p>
                                </div>
                            ) : (
                                <div className="thin-scrollbar note-view h-auto pt-3">
                                    {upcomIntData.map((data, index) => (
                                        <div className="d-flex align-items-center rounded-xl border elevation-1 hover-elevation-2 bg-light mr-3 mb-4">
                                            <div className="bg-light text-center px-4">
                                                <p className="font-weight-bold mb-0">{format(new Date(data.interview_date), "eee dd")} </p>
                                                <small>{format(new Date(data.interview_date), "MMMyy")}</small>
                                            </div>
                                            <div className="flex-grow-1 bg-white border-left rounded-right-radius p-3">
                                                <h5 className="font-weight-bold h5-small">{data.application__job__company_name}</h5>
                                                <h6 className="mb-1">{data.application__job__title}</h6>
                                                <small>
                                                    {new Date(data.interview_date + " " + data.interview_time).toLocaleTimeString(navigator.language,
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )} - {data.interview_time ? this.addTimes(data.interview_time.split('.')[0], `00:${data.duration}:00`, data.interview_date) : ""}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-8">
                        {/* Profile Performance */}
                        <div className="card p-3 rounded-xl border-grey" id="profile-perf" style={{marginTop: "-34px"}}>
                            <div className="d-md-flex justify-content-between">
                                <h5 className="font-weight-bold h5-small">{t(this.props.language?.layout?.jsdb_performance_nt)}</h5>
                                <div className="mt-n2">
                                    <select className="form-control border-white text-muted pointer" name="type" aria-label="select"
                                        onChange={(e) => this.profilePerformance(e.target.value)}>
                                        {/* <option value="today">Today</option> */}
                                        <option value="this_week=1">{t(this.props.language?.layout?.js_dbweek_nt)}</option>
                                        <option value="month=1">{t(this.props.language?.layout?.js_dbmonth_nt)}</option>
                                        <option value="month=6">{t(this.props.language?.layout?.js_db6month_nt)}</option>
                                        <option value="">{t(this.props.language?.layout?.js_dbyear_nt)}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="d-md-flex">
                                <div className="col-md-12 py-4">
                                    <Line data={data} options={options} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center mt-4 font-weight-bold">
                                        <div
                                            className="rounded mr-3"
                                            style={{
                                                width: "1.3rem",
                                                height: "1.3rem",
                                                backgroundColor: "rgba(38, 128, 235)",
                                            }}>
                                        </div>
                                        {t(this.props.language?.layout?.jsdb_profileview_nt)}
                                        {/* <abbr className="svg-xs-1 align-top ml-1 mt-n2"> <OverlayTrigger
                                            placement="right"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={this.renderTooltip}>
                                            <img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" />
                                        </OverlayTrigger></abbr> */}
                                    </div>

                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center font-weight-bold mt-4">
                                        <div
                                            className="rounded mr-3"
                                            style={{
                                                width: "1.3rem",
                                                height: "1.3rem",
                                                backgroundColor: "rgba(100, 161, 100)",
                                            }}>
                                        </div>
                                        {t(this.props.language?.layout?.jsdb_download_nt)}
                                        {/* <abbr className="svg-xs-1 align-top ml-1 mt-n2"> <OverlayTrigger
                                            placement="right"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={this.renderTooltip}>
                                            <img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" />
                                        </OverlayTrigger></abbr> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-lg-flex mt-3">
                    <div className="col-lg-4 mb-3">
                        {/* Skills */}
                        <div className="card p-3 rounded-xl border-grey h-22rem">
                            <h5 className="font-weight-bold mb-3 h5-small">{t(this.props.language?.layout?.js_profile_skills)}</h5>
                            <div className="thin-scrollbar note-view h-auto">
                                <div className="row justify-content-center">
                                    {!profile_skills.length ?
                                        <div className="text-center my-5">
                                            <img
                                                className="img-fluid"
                                                src="/svgs/illustrations/no-skills.svg"
                                                alt="No Notes"
                                            />
                                            <p className="text-muted my-3">{t(this.props.language?.layout?.jsbd_noskill_nt)}</p>
                                            <div className="profile-button">
                                                <Link
                                                    to="/profile"
                                                    type="button"
                                                    className="btn btn btn-primary px-4">
                                                    + {t(this.props.language?.layout?.js_profile_addskills)}
                                                </Link>
                                            </div>
                                        </div> :
                                        <MyCloud data={profile_skills}></MyCloud>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        {/* Recommended Jobs */}
                        <div className="card py-3 rounded-xl bg-light border-grey h-22rem">
                            <div>
                                <h5 className="font-weight-bold h5-small px-3">{t(this.props.language?.layout?.js_dashboard_reccomendedjob)}</h5>
                                <div className="pt-4 px-2">
                                    {!recommJobsData.length ?
                                        <div className="col-md-4 mx-auto py-5 text-center">
                                            <img
                                                src="/svgs/illustrations/EmptyStateListIllustration.svg"
                                                alt="Hero Image"
                                                className="zero-state-image img-fluid"
                                            />
                                            <h2>{t(this.props.language?.layout?.jsdb_empty_nt)}</h2>
                                        </div> :

                                        <RecommendedJobs deviceType={"desktop"} data={recommJobsData}
                                            markAsBookmark={this.markAsBookmark}
                                            removeJobCard={this.removeJobCard} />
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        refreshToken: state.authInfo.refreshToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps, {})(withTranslation()(UserDashboardV2));
