import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../../partials/spinner.jsx";
import ReportTable from "./reportTable.jsx";
import { useTranslation } from "react-i18next";

const ApplicationSource = (props) => {
    const { t } = useTranslation();
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
                    { name: t(props.language?.layout?.reports_jobboard_nt), value: each.jobboard_name },
                    { name: t(props.language?.layout?.reports_jobcount_nt), value: each.job_count },
                    { name: t(props.language?.layout?.reports_board_nt), value: each.broad_strike_rate },
                    props.userRole.role_id == null && { name: t(props.language?.layout?.portal_nt), value: each.user__is_ca == undefined ? null:(each.user__is_ca ? t(props.language?.layout?.globallocations_canada) : t(props.language?.layout?.globallocations_us)) },

                ],
                double: [
                    {
                        head: "Count",
                        data: [
                            { name: t(props.language?.layout?.ep_application_applied), value: each.applied_count },
                            { name: t(props.language?.layout?.ep_application_screening), value: each.screening_count },
                            { name: t(props.language?.layout?.ep_application_interview), value: each.interview_count },
                            { name: t(props.language?.layout?.ep_application_offered), value: each.offered_count },
                            { name: t(props.language?.layout?.ep_application_hired), value: each.hired_count },
                            { name: t(props.language?.layout?.ep_application_declined), value: each.declined_count },
                            { name: t(props.language?.layout?.ep_application_onhold), value: each.onhold_count },
                            { name: t(props.language?.layout?.ep_application_rejected), value: each.rejected_count },
                        ],
                    },
                ],
            });
        });

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
    }, [props.language]);

    return (
        <div className="col-md-10 px-0">
            <div className="container-fluid">
                <div className="row pt-4 px-3 gray-100">
                    <div class="col-md-12 my-2 p-0">
                        <div class="d-flex align-items-center justify-content-between icon-invert">
                            <h4>
                                <Link className="text-muted" to={`/report/`}>
                                {t(props.language?.layout?.ep_allreports)}
                                </Link>
                                <img src="/svgs/icons_new/chevron-right.svg" alt="Right Arrow" class="svg-sm mx-1" />
                                <span className="text-dark">{props.location.props.title}</span>
                            </h4>
                            {!disable ?
                            <button
                                className={data.length ? "icon-invert d-flex btn btn-primary" : "icon-invert btn btn-outline-secondary"}
                                disabled={!data.length}
                                onClick={downloadReport}>
                                <img
                                    src="/svgs/icons_new/download.svg"
                                    alt="download"
                                    className={"svg-sm mr-1 " + (!data.length ? "disabled" : "invert-color")}
                                />
                                {t(props.language?.layout?.all_download)}
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
                                    <p className="mb-1">{text}</p>
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
        language: state.authInfo.language,
        userRole: state.authInfo.user,
    };
}

export default connect(mapStateToProps, {})(ApplicationSource);
