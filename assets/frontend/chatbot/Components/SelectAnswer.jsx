import React from "react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { InputContext } from "../Context/InputContext";
import { connect } from "react-redux";

const SelectAnswer = (props) => {
    const { t } = useTranslation();
    let { answerSelected } = useContext(InputContext);
    return (
        <React.Fragment>
            <div className="col-md-12 d-flex justify-content-end px-0">
                <React.Fragment>
                    <button
                        type="button"
                        id="noBtn"
                        className="btn btn-light border border-danger"
                        value="No"
                        onClick={(e) => answerSelected(e.target.value, e)}>
                        {t(props.language?.layout?.no_nt)}
                    </button>
                    <button
                        type="button"
                        id="yesBtn"
                        className="btn btn-light text-white bg-primary ml-2"
                        value="Yes"
                        onClick={(e) => answerSelected(e.target.value, e)}>
                        {t(props.language?.layout?.all_yes_nt)} 
                    </button>
                </React.Fragment>
            </div>
        </React.Fragment>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(SelectAnswer);
