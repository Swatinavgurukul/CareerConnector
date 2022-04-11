import React from "react";
import { useContext } from "react";

import { InputContext } from "../Context/InputContext.js";

const AnswerInputBox = ({ ans, id }) => {
    let { formOnChangeHandler, answerSelected, formValues, error } = useContext(InputContext);
    return (
        <React.Fragment>
            <div className="col-md-12 p-0" id="AnswerInputBox">
                {error ? <p className="text-danger pl-2 mb-0">{error}</p> : null}

                <form className="d-flex">
                    <input
                        type="number"
                        min="0"
                        id="input"
                        name="input"
                        className="form-control border-0"
                        placeholder="Pay"
                        onChange={formOnChangeHandler("payrate")}
                    />

                    <button
                        className="btn btn-primary rounded ml-1"
                        onClick={(e) => answerSelected(formValues.payrate, e)}>
                        Send
                    </button>
                </form>
            </div>
        </React.Fragment>
    );
};
export default AnswerInputBox;
