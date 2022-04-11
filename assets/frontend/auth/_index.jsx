import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { _setAuthData } from "../actions/actionsAuth.jsx";
import HomepageDashboard from "./homepage.jsx";
import Homepage_Dashboard from "./_homepage.jsx";
// https://careerconnector.simplifyhire.com/homepage
// Career Connector
// Welcome to career connector, powered by Simplify Workforce
// ep@simplify.com

// npp@simplify.com

// user@simplify.com

// testpassword

function MasterHomepage(props) {
    return (
        <>
            {props.user.role_id == 1 && props.user.is_user == false ? <Homepage_Dashboard /> : ""}
            {props.user.role_id == 2 || props.user.role_id == 5 ? <HomepageDashboard /> : ""}
            {props.user.role_id == 4 ? <Homepage_Dashboard /> : ""}
        </>
    );
}

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
    };
}

export default connect(mapStateToProps, { _setAuthData })(MasterHomepage);
