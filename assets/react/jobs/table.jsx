import React, { Component } from "react";
import { connect } from "react-redux";

const JobIndexTable = (props) => {
    return <h1>Hello</h1>;
};

function mapStateToProps(state) {
    return {
        // theme: state.themeInfo.them,
        // userToken: state.authInfo.userToken,
        // user: state.authInfo.user,
        // enrollmentCode: state.authInfo.enrollmentCode,
    };
}

export default connect(mapStateToProps, {})(JobIndexTable);
