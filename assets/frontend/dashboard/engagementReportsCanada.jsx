import React, { useEffect, useState } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const AuditReports = (props) => {
    const { t } = useTranslation();
    const [reportType, setReportType] = useState();
    const [period, setPeriod] = useState();
    const [disable, setDisable] = useState(true);

    const getAuditReports = () => {
            Axios({
                url: `api/v1/admin/reports/auditlogin/ca?report_type=${reportType}&period=${period}`,
                method: `get`,
                responseType: "blob",
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${reportType}_reports.xlsx`);
                document.body.appendChild(link);
                link.click();
            });
    };

    return (
        <div>
            <div className="d-flex mx-auto mt-5">
                <div className="mr-2">
                    <div className="form-group">
                        <select
                            aria-label="Company Names"
                            className="form-control"
                        onChange={(e) => {setReportType(e.target.value); period && setDisable(false);}}
                        value={reportType}
                        >
                            <option selected>Select Report Type</option>
                            <option value="all">All</option>
                            <option value="unique">Unique</option>
                            <option value="rolewise">Rolewise</option>
                        </select>
                    </div>
                </div>
                <div className="">
                    <div className="form-group">
                        <select
                            aria-label="Company Names"
                            className="form-control"
                        onChange={(e) => {setPeriod(e.target.value); reportType && setDisable(false);}}
                        value={period}
                        >
                            <option selected>Select Period</option>
                            <option value="7" >Weekly</option>
                            <option value="30">Monthly</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end"><button className="btn btn-primary" disabled={disable} onClick={getAuditReports}>Download</button></div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps)(AuditReports);
