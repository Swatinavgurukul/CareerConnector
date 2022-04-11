import React, { useState } from 'react';
import axios from 'axios'
import { _billingAuth } from "../actions/actionsAuth.jsx";
import { connect } from "react-redux";
const Erd = (props) => {
    const [url, setUrl] = useState("");
    const [disabl, setDisabled] = useState(true);

    const selectErdType = (e) => {
        setUrl(e.target.value);
        setDisabled(false)
    }

    const downloadCSV = () => {
        if (url == "user") {
            axios({
                url: "api/v1/user_csv/ca",
                method: "GET",
                responseType: "blob",
                headers: { Authorization: `Bearer ${props.userToken}` },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `user_erd.csv`);
                document.body.appendChild(link);
                link.click();
            });
        }
        if (url == "jobs") {
            axios({
                url: "api/v1/jobs_csv/ca",
                method: "GET",
                responseType: "blob",
                headers: { Authorization: `Bearer ${props.userToken}` },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `jobs_erd.csv`);
                document.body.appendChild(link);
                link.click();
            });
        }
        if (url == "tenant") {
            axios({
                url: "api/v1/tenant_csv/ca",
                method: "GET",
                responseType: "blob",
                headers: { Authorization: `Bearer ${props.userToken}` },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `tenant_erd.csv`);
                document.body.appendChild(link);
                link.click();
            });
        }
        if (url == "user applications") {
            axios({
                url: "api/v1/job_application/ca",
                method: "GET",
                responseType: "blob",
                headers: { Authorization: `Bearer ${props.userToken}` },
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `jobapplication_erd.csv`);
                document.body.appendChild(link);
                link.click();
            });
        }
    };
    return (
        <div>
            <div className="form-group animated ">
                <label for="exampleFormControlSelect1" className="form-label-active text-muted">
                    Export
                </label>
                <select
                    aria-label="Erd"
                    className="form-control"
                    name="Erd"
                    onChange={selectErdType}
                >
                    <option selected="" className="d-none">
                        Select option
                    </option>
                    <option value="user" >User</option>
                    <option value="jobs" >Jobs</option>
                    <option value="tenant" >Tenant</option>
                    <option value="user applications" >User Applications</option>
                </select>
            </div>
            <div className="text-center">
                <button className="btn btn-primary mt-5"
                    onClick={() => downloadCSV()}
                    disabled={disabl}
                > <img
                        src="/svgs/icons_new/download.svg"
                        alt="download"
                        className="svg-sm mr-1 invert-color"
                    />Download</button>
            </div>
        </div>
    )
};
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.them,
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        enrollmentCode: state.authInfo.enrollmentCode,
    };
}
export default connect(mapStateToProps, { _billingAuth })(Erd);
