import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const Datasaver = (props) =>{
    const{t} = useTranslation();

    const New =  [
        
    ]


};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps, {})(Datasaver);