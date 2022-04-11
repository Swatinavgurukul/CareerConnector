import React, { useContext } from "react";
import { InputContext } from "../Context/InputContext";

const InputDefault = () => {
    let { sendMessage, formOnChangeHandler, formValues } = useContext(InputContext);

    const send = (e) => {
        e.preventDefault();
        if (formValues.text) {
            sendMessage("user", formValues.text);
            formValues.text = "";
        }
    };
    return (
        <div className="col-md-12 p-0" id="AnswerInputBox">
            <form className="d-flex">
                <input
                    type="text"
                    name="input"
                    className="form-control border-0"
                    value={formValues.text}
                    onChange={formOnChangeHandler("text")}
                />
                <button className="btn btn-light ml-1 rounded" onClick={(e) => send(e)}>
                    <img src="/svgs/icons_new/chevron-right.svg" alt="Right Arrow" className="svg-sm" />
                </button>
            </form>
        </div>
    );
};

export default InputDefault;
