import React from "react";
import { useContext } from "react";

import { InputContext } from "../Context/InputContext.js";

const GeoLocation = ({ ans, id }) => {
    let { formOnChangeHandler, answerSelected, formValues, error } = useContext(InputContext);
    return (
        <React.Fragment>
            <div className="col-md-12 p-0" id="geolocation">
                {error ? <p className="text-danger pl-2 mb-0">{error}</p> : null}
                <form className="d-flex">
                    <input
                        name="location"
                        placeholder="Location"
                        type="text"
                        className="form-control border-0"
                        onChange={formOnChangeHandler("geolocation")}
                    />

                    <button
                        className="btn btn-primary ml-1 rounded"
                        onClick={(e) => answerSelected(formValues.geolocation, e)}>
                        Submit
                    </button>
                </form>
            </div>
        </React.Fragment>
    );
};
export default GeoLocation;
