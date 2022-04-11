import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import Header from "./header.jsx";
import JobIndexTable from "./table.jsx";

const default_stats = { active_count: 0, paused_count: 0, expired_count: 0, closed_count: 0, draft_count: 0 };

const JobIndex = (props) => {
    const [stats, setStats] = useState(default_stats);

    useEffect(() => {
        Axios.get("/api/v1/recruiter/jobs/status/count", {
            headers: { Authorization: "Bearer " + props.token },
        }).then((response) => {
            if (response.data.status == 200) {
                setStats(response.data.data);
            }

            // setTotalFilterCount(response.data.data);
            // setFilterCount(response.data.data.data);
        });
    }, []);

    return (
        <div>
            {console.log("asd", props.token)}
            <Header stats={stats} />
            <JobIndexTable />
        </div>
    );
};

function mapStateToProps(state) {
    return {
        // theme: state.themeInfo.them,
        token: state.authInfo.userToken,
        // user: state.authInfo.user,
        // enrollmentCode: state.authInfo.enrollmentCode,
    };
}

export default connect(mapStateToProps, {})(JobIndex);
