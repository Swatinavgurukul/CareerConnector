import React, { useState, Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import { calculateScore } from "../../components/constants.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const jobScore = (props) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const modalClose = () => {
        setShowModal(false);
    };
    const scoringNum = (num) => {
        let y = num % 1
        let n = y.toString();
        if (n[2] <= 5) {
            let z = Math.floor(num)
            return z;
        }
        else {
            let z = Math.ceil(num)
            return z;
        }
    }
    var score = props?.totalScore == undefined ? props.weightedScore : props?.totalScore
    return (
        <Fragment>
            {props.user_type.role_id == 1 || props.user_type.role_id == 4 ? (
                <div class="shadow-sm border rounded p-1 d-print-none mb-4">
                    <div class="mt-3 px-3">
                        <div class="text-muted d-flex align-items-center justify-content-between mb-2">
                            <h5>{t(props.language?.layout?.profile_matchscore_nt)}</h5>
                            <div
                                class="job-score-block"
                                title={t(props.language?.layout?.all_abbr1_nt)}>
                                <div class="single-chart">
                                    <svg viewBox="0 0 36 36" class="circular-chart">
                                        <path
                                            class="circle-bg"
                                            d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            class="circle"
                                            stroke-dasharray={`${score && score !== null ? score : 0},100`}
                                            d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <text x="18" y="23.35" class="percentage text-green">
                                            {score && score !== null ? score : 0}
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {/* {process.env.ENVIORNMENT === "development" ? */}
                         <div class="row">
                            <div class="col-12">
                                <div class="row mb-2">
                                    <div class="col-10">
                                        <p class="mb-1 small "> {t(props.language?.layout?.js_dashboard_skills)}
                                            <abbr
                                                title="List of skills required or attained."
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr></p>
                                        <div class="progress mb-1" style={{ height: "10px" }}>
                                            <div
                                                aria-label="Aria Name"
                                                id="combo22"
                                                class="progress-bar bg-success"
                                                role="progressbar"
                                                aria-valuenow="87"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{
                                                    width: ` ${score && props.jobscore.skills !== null
                                                        ? scoringNum(props.jobscore.skills)
                                                        : 0
                                                        }% `,
                                                }}></div>
                                        </div>
                                    </div>
                                    <div class="col-2 align-self-end text-right p-0">
                                        <p class="text-green mb-0">
                                            {props.jobscore && props.jobscore.skills !== null
                                                ? scoringNum(props.jobscore.skills)
                                                : 0}

                                        </p>
                                    </div>
                                </div>
                                <div class="row mb-2" >
                                    <div class="col-10">
                                        <p class="mb-1 small "> {t(props.language?.layout?.profile_certification_nt)}
                                            <abbr
                                                title="List of certifications required or attained."
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr></p>
                                        <div class="progress mb-1" style={{ height: "10px" }}>
                                            <div
                                                aria-label="Aria Name1"
                                                id="combo1"
                                                class="progress-bar bg-success"
                                                role="progressbar"
                                                aria-valuenow="87"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{
                                                    width: ` ${props.jobscore && props.jobscore.certification !== null
                                                        ? scoringNum(props.jobscore.certification)
                                                        : 0
                                                        }% `,
                                                }}></div>
                                        </div>
                                    </div>
                                    <div class="col-2 align-self-end text-right p-0">
                                        <p class="text-green mb-0">
                                            {props.jobscore && props.jobscore.certification !== null
                                                ? scoringNum(props.jobscore.certification)
                                                : 0}

                                        </p>
                                    </div>
                                </div>
                                <div
                                    class="row mb-2"
                                >
                                    <div class="col-10">
                                        <p class="mb-1 small"> {t(props.language?.layout?.all_industry)}
                                            <abbr
                                                title="Calculated by an analysis of skills to fit a resume or job into categories such as Information Technology → Programming or Finance → Accounting."
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr></p>
                                        <div class="progress mb-1" style={{ height: "10px" }}>
                                            <div
                                                aria-label="Aria Name2"
                                                id="combo2"
                                                class="progress-bar bg-success"
                                                role="progressbar"
                                                aria-valuenow="87"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{
                                                    width: ` ${props.jobscore && props.jobscore.industry !== null
                                                        ? scoringNum(props.jobscore.industry)
                                                        : 0
                                                        }% `,
                                                }}></div>
                                        </div>
                                    </div>
                                    <div class="col-2 align-self-end text-right p-0">
                                        <p class="text-green mb-0">
                                            {props.jobscore && props.jobscore.industry !== null
                                                ? scoringNum(props.jobscore.industry)
                                                : 0}

                                        </p>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-10">
                                        <p class="mb-1 small">  {t(props.language?.layout?.all_education_nt)}
                                            <abbr
                                                title="Highest degree level required or attained."
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr></p>
                                        <div class="progress mb-1" style={{ height: "10px" }}>
                                            <div
                                                aria-label="Aria Name3"
                                                id="combo3"
                                                class="progress-bar bg-success"
                                                role="progressbar"
                                                aria-valuenow="87"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{
                                                    width: ` ${props.jobscore && props.jobscore.education !== null
                                                        ? scoringNum(props.jobscore.education)
                                                        : 0
                                                        }% `,
                                                }}></div>
                                        </div>
                                    </div>
                                    <div class="col-2 align-self-end text-right p-0">
                                        <p class="text-green mb-0">
                                            {props.jobscore && props.jobscore.education !== null
                                                ? scoringNum(props.jobscore.education)
                                                : 0}

                                        </p>
                                    </div>
                                </div>

                                <div
                                    class="row mb-3"
                                >
                                    <div class="col-10">
                                        <p class="mb-1 small">  {t(props.language?.layout?.profile_management_nt)}
                                            <abbr
                                                title="The level of management required or attained, from low-level leadership and supervisory positions, to mid-level managers and directors, to high-level VPs, to C-level executives."
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr></p>
                                        <div class="progress mb-1" style={{ height: "10px" }}>
                                            <div
                                                aria-label="Aria Name4"
                                                id="combo4"
                                                class="progress-bar bg-success"
                                                role="progressbar"
                                                aria-valuenow="87"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{
                                                    width: ` ${props.jobscore && props.jobscore.management_level !== null
                                                        ? scoringNum(props.jobscore.management_level)
                                                        : 0
                                                        }% `,
                                                }}></div>
                                        </div>
                                    </div>
                                    <div class="col-2 align-self-end text-right p-0">
                                        <p class="text-green mb-0">
                                            {props.jobscore && props.jobscore.management_level !== null
                                                ? scoringNum(props.jobscore.management_level)
                                                : 0}

                                        </p>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-10">
                                        <p class="mb-1 small"> {t(props.language?.layout?.ep_dashboard_jobtitle)}
                                            <abbr
                                                title="Exact and partial match position titles."
                                                className="align-top d-inline-flex">
                                                <img
                                                    src="/svgs/icons_new/info.svg"
                                                    alt="info"
                                                    className="svg-xs-1 align-top"
                                                />
                                            </abbr></p>
                                        <div class="progress mb-1" style={{ height: "10px" }}>
                                            <div
                                                aria-label="Aria Name5"
                                                id="combo5"
                                                class="progress-bar bg-success"
                                                role="progressbar"
                                                aria-valuenow="87"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{
                                                    width: ` ${props.jobscore && props.jobscore.job_title !== null
                                                        ? scoringNum(props.jobscore.job_title)
                                                        : 0
                                                        }% `,
                                                }}></div>
                                        </div>
                                    </div>
                                    <div class="col-2 align-self-end text-right p-0">
                                        <p class="text-green mb-0">
                                            {props.jobscore && props.jobscore.job_title !== null
                                                ? scoringNum(props.jobscore.job_title)
                                                : 0}

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                         {/* : null} */}
                    </div>
                </div>
            ) : null}
        </Fragment>
    );
};

function mapStateToProps(state) {
    return {
        user_type: state.authInfo.user,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(jobScore);