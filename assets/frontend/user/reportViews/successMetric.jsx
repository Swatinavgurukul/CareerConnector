import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../../partials/spinner.jsx";
import ReportTable from "./reportTable.jsx";

const SuccessMetric = (props) => {
    if (props.location.props === undefined) {
        window.location.href = "/report";
    }
    const [loading, setLoading] = useState(true);
    const [disable, setDisable] = useState(false);
    const [data, setData] = useState([]);
    const downloadReport = () => {
        setDisable(true);
        const formData = new FormData();
        formData.append("status", props.location.props.api.status);
        axios({
            url: `${props.location.props.api.endpoint}/download`,
            method: `${props.location.props.api.method}`,
            data: formData,
            responseType: "blob",
            headers: { Authorization: `Bearer ${props.userToken}` },
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${props.location.props.filename}.xlsx`);
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
                    { name: "candidate_name", value: each.candidate_name },
                    { name: "status", value: each.status },
                    { name: "last_activity_on", value: each.last_activity_on },
                    { name: "applied_count", value: each.applied_count },
                    { name: "hired_count", value: each.hired_count },
                    { name: "location", value: each.location },
                ],
                double: [],
            });
        });
        console.log(formatedDataList);
        return formatedDataList;
    };
    useEffect(() => {
        const formData = new FormData();
        formData.append("status", props.location.props.api.status);
        axios({
            url: `${props.location.props.api.endpoint}`,
            method: `${props.location.props.api.method}`,
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
    }, []);

    return (
        <div className="col-md-10 px-0">
            <div className="container-fluid">
                <div className="row pt-4 px-3 gray-100">
                    <div class="col-md-12 my-2 p-0">
                        <div class="d-flex align-items-center justify-content-between icon-invert">
                            <h4>
                                <Link className="text-muted" to={`/report/`}>
                                    All Reports
                                </Link>
                                <img src="/svgs/icons_new/chevron-right.svg" alt="Right Arrow" class="svg-sm mx-1" />
                                <span className="text-dark">{props.location.props.title}</span>
                            </h4>
                            {!disable ?
                            <button
                                className={data.length ? "icon-invert d-flex btn btn-primary" : "icon-invert d-flex btn btn-outline-secondary"}
                                disabled={!data.length}
                                onClick={downloadReport}>
                                <img
                                    src="/svgs/icons_new/download.svg"
                                    alt="download"
                                    className={"svg-sm mr-1 " + (!data.length ? "disabled" : "invert-color")}
                                />
                                Download
                            </button>:
                            <div className="bouncingLoader btn btn-primary" style={{paddingLeft: "2.5rem", paddingRight: "2.5rem"}}>
                                <div></div>
                            </div>}
                        </div>
                        <div className="d-flex align-items-center">
                            <img
                                className="svg-lg-x2 mr-3 mb-2"
                                src={props.location.props.img.src}
                                alt={props.location.props.img.alt}
                                title={props.location.props.img.alt}
                            />
                            <div>
                                {props.location.props.desc.map((text) => (
                                    <p className="text-capitalize mb-1">{text}</p>
                                ))}
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
    };
}

export default connect(mapStateToProps, {})(SuccessMetric);
