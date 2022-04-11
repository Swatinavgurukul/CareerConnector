import React from "react";
import AdminDashboard from "../internal_dashboard/adminDashboard/index.jsx";
import RecruiterDashboard from "../internal_dashboard/recruiterDashboard/index.jsx";
// import UserDashboard from "../internal_dashboard/userDashboard/index.jsx";
import UserDashboardV2 from "../internal_dashboard/userDashboardV2/index.jsx";
import { connect } from "react-redux";

const Dashboard = (props) => {
    const DecideDashboardWithRole = () => {
        if (!props.user.is_user) {
            if (props.user.role_id == null) {
                // setRole("admin");
                return <AdminDashboard />;
            } else if (props.user.role_id == 1) {
                // setRole("hiring_manager");
                return <AdminDashboard />;
            } else if (props.user.role_id == 2 || props.user.role_id == 5) {
                // setRole("recruiter");
                return <RecruiterDashboard />;
            } else if (props.user.role_id == 4) {
                // setRole("recruiter");
                return <AdminDashboard />;
            }
        } else {
            // user dashboard here
            // return <UserDashboard />;
            return <UserDashboardV2 />;
        }
    };
    return <div className="col-lg-10 px-0">{DecideDashboardWithRole()}</div>;
};
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        refreshToken: state.authInfo.refreshToken,
        user: state.authInfo.user,
    };
}

export default connect(mapStateToProps, {})(Dashboard);
