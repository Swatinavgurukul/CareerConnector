import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ReactDOM from "react-dom";
import { useState } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { surveyData } from "../../translations/helper_translation.jsx";

const RoportIssue = (props) => {
    const { t } = useTranslation();
    const surveyDataHandler = (language,key) => {
        return(surveyData[language][key]);
    }
    return (
        <div className="container-fluid h-100 px-0">
            <div className="bg-silver pt-4 pb-2">
                <div className="col-lg-10 mx-auto">
                    <h4 className="text-capitalize">{surveyDataHandler(props?.languageName, props?.location?.state?.surveyTitle).split("-")[0]} - {props?.location?.state?.userName !== undefined ? props.location.state.userName : props.location.state.jobTitle }
                    </h4>
                </div>                                                                  
            </div>
            <div className="text-center mt-5rem pt-5">
                <img
                    className="img-fluid w-10 h-10rem"
                    src="svgs/rich_icons/thank-you-clapping-hand.svg"
                    alt="Clapping Hand Icon"
                    title="Clapping Hand Icon"
                />
                <h2 className="pt-4">{t(props.language?.layout?.comp_survey)}</h2>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(RoportIssue);
