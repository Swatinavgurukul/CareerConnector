import React from "react";
import { useContext } from "react";
import { InputContext } from "../Context/InputContext.js";

const Calender = () => {
    let { formOnChangeHandler, answerSelected, formValues, error } = useContext(InputContext);
    const getTodaysDate = () => {
        let todaysDate = new Date();
        let year = todaysDate.getFullYear();
        let month = ("0" + (todaysDate.getMonth() + 1)).slice(-2);
        let day = ("0" + todaysDate.getDate()).slice(-2);
        let minDate = year + "-" + month + "-" + day;
        return minDate;
    };
    return (
        <React.Fragment>
            <div className="col-md-12 p-0" id="date">
                {error ? <p className="text-danger pl-2 mb-0">{error}</p> : null}
                <form className="d-flex">
                    <input
                        type="date"
                        id="calender"
                        className="form-control border-0"
                        name="calendar"
                        min={getTodaysDate()}
                        // max="2021-05-30"
                        onChange={formOnChangeHandler("date")}
                    />

                    <button
                        className="btn btn-primary ml-1 rounded"
                        onClick={(e) => answerSelected(formValues.date, e)}>
                        Submit
                    </button>
                </form>
            </div>
        </React.Fragment>
    );
};
export default Calender;
