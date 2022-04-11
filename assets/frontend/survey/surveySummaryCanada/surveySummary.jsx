import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../partials/spinner.jsx";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/scss/main.scss";
import TableData from "./index.jsx";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";

const surveySummary = (props) => {
    const { t } = useTranslation();
    var tableJSON = [];
    tableJSON = [
        { displayValue: "Survey Name", key: "name" },
        { displayValue: "Survey For", key: "" },
        { displayValue: "Status", key: "" },
        { displayValue: "Sent Out To", key: "sent_out" },
        { displayValue: "Responses", key: "responses" },
        { displayValue: "Summary", key: "" },
        { displayValue: "Survey Responses", key: "" },
    ]

    let [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [count, setCount] = useState();

    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        axios
            .get("api/v1/admin/reports/survey/ca", { headers: { Authorization: `Bearer ${props.userToken}` } })
            .then((response) => {
                var activeCount = response.data.data && response.data.data.map(d => d.is_active);
                setCount(activeCount.length);
                setData(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                if (error) {
                    ServerStatusHandler();
                }
                setLoading(false);
            });
    };

    const ServerStatusHandler = () => {
        return (
            <div className="col-md-3 mx-auto">
                <div className="text-muted text-center mt-5 pt-5">
                    <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid" />
                    <h3 className="pt-2"> {t(props.language?.layout?.all_empty_nt)}</h3>
                </div>
            </div>
        );
    };

    const downloadReport = (id, name) => {
        axios({
            url: `/api/v1/admin/report/surveyfeedback/ca/${id}`,
            method: `get`,
            responseType: "blob",
            headers: { Authorization: `Bearer ${props.userToken}` },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${name}.xlsx`);
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
                            <h4 className="mb-3">All Surveys</h4>
                            <div className="d-flex align-items-center">
                                <img
                                    className="svg-lg-x2 mr-3 mb-2"
                                    src="svgs/rich_icons/hiring_team.svg"
                                    alt="Hiring Icon"
                                    title="Hiring Icon"
                                />
                                <div>
                                    <p className="mb-1">
                                        {data && data.length} Surveys
                                    </p>
                                    <p>{count} Active Surveys</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 px-3">
                            <div className="card border-0">
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <Fragment>
                                        {data && data.length !== 0 ? (
                                            <TableData
                                                data={data}
                                                tableJSON={tableJSON}
                                                downloadReport={downloadReport}
                                            />
                                        ) : (
                                            ServerStatusHandler()
                                        )}
                                    </Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userToken: state.authInfo.userToken,
        userRole: state.authInfo.user,
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, {})(surveySummary);
