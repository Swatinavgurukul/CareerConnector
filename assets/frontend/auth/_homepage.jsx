import React from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const Homepage_Dashboard = (props) => {
    const { t } = useTranslation();
    // console.log("props", props);
    return (
        <div className="container-fluid">
            <div>
                <div className="career_connector p-2">
                    <h1 className="mt-3">
                    {t(props.language?.layout?.ep_hp_heading)} <b>{t(props.language?.layout?.ep_hp_heading2)}</b>
                    </h1>
                    <div className="pt-3 pb-2 h3">
                            {/* Homepage of "Company Name" */}
                            {props.user.tenant_name !== null ? props.user.tenant_name : null}
                    </div>
                    <p>{t(props.language?.layout?.sp_homepage_info)}</p>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <Link to="/dashboard">
                            <div
                                class="mx-2 mb-2 rounded p-3 text-center icon-invert"
                                style={{ backgroundColor: "rgb(188 236 255)" }}>
                                <div class="d-flex justify-content-between">
                                    <img class="img-fluid m-auto svg-lg" src="/svgs/icons_new/layout.svg" alt="image" />
                                </div>
                                <div className="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_homepage_view_dashboard)}</div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3">
                        <Link to="/jobs">
                            <div
                                class="mx-2 mb-2 rounded p-3 text-center icon-invert"
                                style={{ backgroundColor: "rgb(189 255 205)" }}>
                                <div class="d-flex justify-content-between">
                                    <img
                                        class="img-fluid m-auto svg-lg"
                                        src="/svgs/icons_new/briefcase.svg"
                                        alt="image"
                                    />
                                </div>
                                <div className="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_homepage_view_jobs)}</div>
                            </div>
                        </Link>
                    </div>
                    {/* rgb(227 255 194) */}
                    <div className="col-md-3">
                        <Link to="/jobs/create">
                            <div
                                class="mx-2 mb-2 rounded p-3 text-center icon-invert"
                                style={{ backgroundColor: "rgb(227 255 194)" }}>
                                <div class="d-flex justify-content-between">
                                    <img class="img-fluid m-auto svg-lg" src="/svgs/icons_new/users.svg" alt="image" />
                                </div>
                                <div className="card-text pt-4 pb-2 h5">{t(props.language?.layout?.ep_addjobs)}</div> {/* {no_translated} */}
                            </div>
                        </Link>
                    </div>
                </div>
                {/*  */}
                <div className="row mt-md-4">
                    {/* #bdffcd */}
                    <div className="col-md-3">
                        <Link to="/applications">
                            <div
                                class="mx-2 mb-2 rounded p-3 text-center icon-invert"
                                style={{ backgroundColor: "rgb(255 227 217)" }}>
                                <div class="d-flex justify-content-between">
                                    <img class="img-fluid m-auto svg-lg" src="/svgs/icons_new/file.svg" alt="image" />
                                </div>
                                <div className="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_homepage_view_applications)}</div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3">
                        <Link to="/interview">
                            <div
                                class="mx-2 mb-2 rounded p-3 text-center icon-invert"
                                style={{ backgroundColor: "rgb(255 236 180)" }}>
                                <div class="d-flex justify-content-between">
                                    <img
                                        class="img-fluid m-auto svg-lg"
                                        src="/svgs/icons_new/calendar.svg"
                                        alt="image"
                                    />
                                </div>
                                <div className="card-text pt-4 pb-2 h5">{t(props.language?.layout?.ep_view_interview)}</div> {/* {no_translated} */}
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3">
                        <Link to="/report">
                            <div
                                class="mx-2 mb-2 rounded p-3 text-center icon-invert"
                                style={{ backgroundColor: "rgb(255 221 238)" }}>
                                <div class="d-flex justify-content-between">
                                    <img
                                        class="img-fluid m-auto svg-lg"
                                        src="/svgs/icons_new/pie-chart.svg"
                                        alt="image"
                                    />
                                </div>
                                <div className="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_homepage_view_reports)}</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        user: state.authInfo.user,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(Homepage_Dashboard);
