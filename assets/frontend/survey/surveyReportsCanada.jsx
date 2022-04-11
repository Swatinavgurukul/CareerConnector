import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ReactDOM from "react-dom";
import { useState } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import ProgressBar from 'react-bootstrap/ProgressBar'

const surveyReports = (props) => {
    const { t } = useTranslation();
    const [data, setData] = useState({});

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        Axios.get(`api/v1/admin/reports/surveysummary/ca/${props.location.state.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                setData(response.data.data)
            })
            .catch((error) => {
                if (error) {
                    toast.error("Something went wrong");
                }
            });
    };

    const mapObj = {
        "{Enter Name}": "Job Seeker",
        "{Enter Open Position Name}": "open position",
    };

    const downloadReport = () => {
        Axios({
            url: `/api/v1/admin/report/surveyfeedback/ca/${props.location.state.id}`,
            method: `get`,
            responseType: "blob",
            headers: { Authorization: `Bearer ${props.userToken}` },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${data.survey_title.split("-")[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
        });
    };

    return (
        <div className="col-md-10 px-0">
            <div className="d-flex">
                <div className="container-fluid">
                    <div className="row pt-4 pb-2 px-3 gray-100">
                        <div className="col-md-6 px-md-0">
                            <h4 className="mb-3">{data.survey_title && data.survey_title.replace(/{Enter Name}|{Enter Open Position Name}/g, "Summary Reports")}</h4>
                            <div className="d-flex align-items-center">
                                <img
                                    className="svg-lg-x2 mr-3 mb-2"
                                    src="svgs/rich_icons/hiring_team.svg"
                                    alt="Hiring Icon"
                                    title="Hiring Icon" />
                                <div>
                                    <p className="mb-1">
                                        5 Responses
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 px-md-0 d-md-flex justify-content-end align-items-center">
                            <div>
                                <div className="my-md-0 my-3">
                                    <button
                                        className="icon-invert d-flex btn btn-primary" onClick={downloadReport}>
                                        <img
                                            src="/svgs/icons_new/download.svg"
                                            alt="download"
                                            className="svg-sm mr-1 invert-color"
                                        />
                                        {t(props.language?.layout?.all_download)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-9 mx-auto">
                        <div className="card border-0">
                            {data && Object.entries(data).map(([index, value]) => {
                                return (
                                    typeof (value) === "object" &&
                                    <div className="mt-5">
                                        <h3>{value.display_title && value.display_title.replace(/{Enter Name}|{Enter Open Position Name}/g, function (matched) { return mapObj[matched] })}</h3>
                                        <p className="text-muted">5 out of 5 answered</p>
                                        {value.answers &&
                                            value.is_sub_question != true ?
                                            Object.entries(value.answers).map(([key, item]) => (
                                                <div className="row align-items-end pl-2 my-5">
                                                    <div className="mr-3 text-center d-flex align-items-center justify-content-center text-uppercase mt-1"
                                                        style={{ width: "55px", height: "55px", borderRadius: "8px", backgroundColor: "rgba(4, 135, 175, 0.1)" }}><span style={{ fontSize: "20px", color: "rgb(4, 135, 175)" }}>{item}</span></div>
                                                    <div style={{ width: "532px" }}>
                                                        <div className="d-flex justify-content-between"><p>{key}</p>
                                                            <p>{item / 5 * 100}% <span className="text-muted">/ {item} resp.</span></p></div>
                                                        <div><ProgressBar style={{ height: "1.3rem" }} variant="info" now={item / 5 * 100} /></div></div>
                                                </div>
                                            )) : null}
                                        {value.sub_questions &&
                                            value.is_sub_question != false ? (
                                            <div className="table-responsive col-md-8">
                                                <table className="table table-borderless text-center">
                                                    {Object.entries(value.sub_questions).map(([i, data]) => (
                                                        <tbody>
                                                            {i == 1 &&
                                                                <tr>
                                                                    <td></td>
                                                                    {Object.entries(data.answers).map(([k, v]) => (
                                                                        <>
                                                                            <td className="align-middle">{k}</td>
                                                                        </>
                                                                    ))}
                                                                </tr>}
                                                            <tr>
                                                                <td className="text-left col-md-3 align-middle">{data.display_title}</td>
                                                                {Object.entries(data.answers).map(([a, b]) => (
                                                                    <>
                                                                        <td className="px-1">
                                                                            <div className="col-md-12  py-3 rounded text-center d-flex align-items-center justify-content-center text-uppercase"
                                                                                style={{ backgroundColor: b == 1 ? "rgba(4, 135, 175, 0.28)" : b > 1 ? "rgba(4, 135, 175, 0.56)" : "rgba(4, 135, 175, 0.04)" }}><span style={{ color: "rgb(4, 135, 175)" }}>{b / 5 * 100}%</span></div>
                                                                        </td>
                                                                    </>
                                                                ))}
                                                            </tr>
                                                        </tbody>))}
                                                </table>
                                            </div>) : null}
                                        {index.length - 1 || Object.keys(data).length == index ? "" : <hr></hr>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, {})(surveyReports);
