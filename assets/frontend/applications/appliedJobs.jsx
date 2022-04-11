import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { parse, format, formatDistanceStrict } from "date-fns";
import { Link, useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";
import DataNotFound from "../partials/data404.jsx";
import TableData from "../modules/list_pagination/index.jsx";
import Spinner from "../partials/spinner.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";


const AppliedJobs = (props) => {
    const { t } = useTranslation();
    const [totalPages, setTotalPages] = useState(0);
    const [errorDisplay, setErrorDisplay] = useState(false);
    var tableJSON = [];
    tableJSON = process.env.CLIENT_NAME === "cc" ? [
        { displayValue: t(props.language?.layout?.js_application_companyname), key: "company", format: false, sort: true },
        { displayValue: t(props.language?.layout?.js_application_jobtitle), key: "title", format: false, sort: true, Title: true },
        { displayValue: t(props.language?.layout?.js_application_dateapplied), key: "created_at", format: true, sort: true },
        { displayValue: t(props.language?.layout?.js_application_status), key: "current_status", format: false, sort: true, statusTranslate: true },
        { displayValue: t(props.language?.layout?.js_application_applied), key: "", format: false, sort: false, jobDetails: true },
        { displayValue: t(props.language?.layout?.js_application_viewdetail), key: "", format: false, sort: false, Details: true },
    ] :
        [
            { displayValue: t(props.language?.layout?.js_application_companyname), key: "company", format: false, sort: true },
            { displayValue: t(props.language?.layout?.js_application_jobtitle), key: "title", format: false, sort: true, Title: true },
            { displayValue: t(props.language?.layout?.js_application_dateapplied), key: "created_at", format: true, sort: true },
            { displayValue: t(props.language?.layout?.js_application_status), key: "current_status", format: false, sort: true, statusTranslate: true },
            // { displayValue: t(props.language?.layout?.js_application_applied), key: "", format: false, sort: false, jobDetails: true },
            { displayValue: t(props.language?.layout?.js_application_viewdetail), key: "", format: false, sort: false, Details: true },

        ]

    return (
        <div>
            {props.loading ? (
                <Spinner />
            ) : (
                <Fragment>
                    {props.appJobsData === null || !props.appJobsData.length || errorDisplay ? (
                        <DataNotFound />
                    ) : (
                        <TableData getAppliedData={props.getAppliedData} data={props.appJobsData} tableJSON={tableJSON} />
                    )}
                </Fragment>
            )}
        </div>
    );
};

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(AppliedJobs);
