import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { parse, format, formatDistanceStrict } from "date-fns";
import { Link, useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";
import DataNotFound from "../partials/data404.jsx";
import TableData from "../modules/list_pagination/index.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const SavedJobs = (props) => {
    const { t } = useTranslation();


    const tableJSON = [
        { displayValue: t(props.language?.layout?.js_application_companyname), key: "company", format: false, sort: true },
        { displayValue: t(props.language?.layout?.js_application_jobtitle), key: "title", format: false, sort: true, Title : true },
        { displayValue: t(props.language?.layout?.user_datesaved_nt), key: "created_at", format: true, sort: true },
        { displayValue: t(props.language?.layout?.js_application_viewdetail), key: "", format: false, sort: false, Details: true },
    ];


    // const [savJobsData, savedJobsData] = useState([])
    // const [totalPages, setTotalPages] = useState(0)

    // useEffect(() => {
    //     getSavedData()
    // }, []);

    //     const getSavedData=(pageNo)=>{
    //         let apiEndPoint;
    //         if(pageNo){
    //             apiEndPoint = `/api/v1/jobs/user/bookmarks?page=${pageNo}`
    //         }else{
    //             apiEndPoint = "/api/v1/jobs/user/bookmarks"
    //         }
    //         axios.get(apiEndPoint,{ headers: {"Authorization" : `Bearer ${localStorage.getItem("access_token")}`}}).then((response) => {
    //             savedJobsData(response.data.data.data)
    //             setTotalPages(response.data.data.total_pages)
    //         });
    //     }
    //
    return (
        <div>
            {props.errorDisplay || props.savJobsData === null || !props.savJobsData.length ? (
                <DataNotFound />
            ) : (
                <TableData data={props.savJobsData} tableJSON={tableJSON} />
            )}
        </div>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps)(SavedJobs);
