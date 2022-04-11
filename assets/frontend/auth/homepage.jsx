import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { getQueryParameters, getQueryString } from "../modules/helpers.jsx";
import { useTranslation } from "react-i18next";

const HomepageDashboard = (props) => {
    const { t } = useTranslation();
    const [key, setKey] = useState("");
    const [code, setCode] = useState("VuZCwccC6bXgY3rTqV1yhh2nCYm60e");
    const history = useHistory();

    useEffect(() => {
        getData();
    }, []);
    const getData = () => {
        axios
            .get("api/v1/setting/tenant/key", {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                setKey(response.data.data.tenant_key);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const copy = () => {
        var copyText = document.querySelector(".myInput");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
    };

    const ssoSubmit = (e) => {
        let query_params = {};
        query_params.code = code
        let updated_url = "?" + getQueryString(query_params);
        history.push("/ssocallback" + updated_url);
    };
    const authorize = () => {
        axios
            .get("/api/v1/o/authorize/?response_type=code&client_id=Lj12HIuUXR4kGtGFUE7GFfS2WiDIwPmcjK064ETl&redirect_uri=http://127.0.0.1:8000/noexist/callback", {
            })
            .then((response) => {
                console.log(response, "resp")
                // setCode("VuZCwccC6bXgY3rTqV1yhh2nCYm60e")
                // ssoSubmit()
            })
            .catch((error) => {
                console.log(error);
                // setCode("VuZCwccC6bXgY3rTqV1yhh2nCYm60e")
                // ssoSubmit()
            });
    }
    return (
        <div className="container-fluid">
            <div>
                <div className="career_connector p-2">
                    <h1 className="mt-3">
                    {t(props.language?.layout?.ep_hp_heading)}<b> {t(props.language?.layout?.ep_hp_heading2)}</b>
                       
                    </h1>
                    <div className="pt-3 pb-2 h3">
                        {/* Homepage of "Company Name" */}
                        {props.user.tenant_name !== null ? props.user.tenant_name : null}
                    </div>
                    <div className="d-md-flex justify-content-between icon-invert">
                        <div>
                            <p>{t(props.language?.layout?.sp_homepage_info)} </p>
                        </div>
                        <div className="icon-invert">
                            {/* <button className="btn btn-primary" onClick={authorize}>Authorize</button> */}
                            <p className="d-flex justify-content-end" title="Jobseeker can signup using this key.">
                            {t(props.language?.layout?.sp_homepage_signupcode)}:{" "}
                                <input
                                    className="myInput border-0 w-25 mr-2 bg-light font-weight-bold"
                                    readOnly
                                    title={key}
                                    value={key}></input>
                                <img
                                    src="/svgs/icons_new/copy.svg"
                                    className="svg-xs ml-1 mt-1 svg-gray"
                                    onClick={copy}
                                    alt="copy"
                                    title="copy"
                                />
                            </p>
                        </div>
                    </div>
                    {/* {props.user.role_id === 2 ? ( */}

                    {/* ) : null} */}
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <Link to="/dashboard">
                            <div
                                class="mx-2 mb-2 rounded p-3 text-center"
                                style={{ backgroundColor: "rgb(188 236 255)" }}>
                                <div class="d-flex justify-content-between icon-invert">
                                    <img class="img-fluid m-auto svg-lg" src="/svgs/icons_new/layout.svg" alt="image" />
                                </div>
                                <div className="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_homepage_view_dashboard)}</div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3">
                        <Link to="/jobs">
                            <div
                                class="mx-2 mb-2 rounded p-3 text-center"
                                style={{ backgroundColor: "rgb(189 255 205)" }}>
                                <div class="d-flex justify-content-between icon-invert">
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
                        <Link to="/jobSeekers">
                            <div
                                class="mx-2 mb-2 rounded p-3 text-center"
                                style={{ backgroundColor: "rgb(227 255 194)" }}>
                                <div class="d-flex justify-content-between icon-invert">
                                    <img class="img-fluid m-auto svg-lg" src="/svgs/icons_new/users.svg" alt="image" />
                                </div>
                                <div className="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_homepage_addseeker)}</div>
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
                                class="mx-2 mb-2 rounded p-3 text-center"
                                style={{ backgroundColor: "rgb(255 227 217)" }}>
                                <div class="d-flex justify-content-between icon-invert">
                                    <img class="img-fluid m-auto svg-lg" src="/svgs/icons_new/file.svg" alt="image" />
                                </div>
                                <div className="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_homepage_view_applications)}</div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3">
                        <Link to="/jobSeekers">
                            <div
                                class="mx-2 mb-2 rounded p-3 text-center"
                                style={{ backgroundColor: "rgb(255 236 180)" }}>
                                <div class="d-flex justify-content-between icon-invert">
                                    <img class="img-fluid m-auto svg-lg" src="/svgs/icons_new/users.svg" alt="image" />
                                </div>
                                <div className="card-text pt-4 pb-2 h5">{t(props.language?.layout?.sp_homepage_view_jobseeker)}</div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3">
                        <Link to="/nppreport">
                            <div
                                class="mx-2 mb-2 rounded p-3 text-center"
                                style={{ backgroundColor: "rgb(255 221 238)" }}>
                                <div class="d-flex justify-content-between icon-invert">
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

export default connect(mapStateToProps, {})(HomepageDashboard);
