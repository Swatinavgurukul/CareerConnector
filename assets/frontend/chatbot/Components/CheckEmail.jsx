import React, { useContext } from "react";

import { InputContext } from "../Context/InputContext.js";

const CheckEmail = () => {
    let { formOnChangeHandler, captureEmail, error } = useContext(InputContext);
    const showForm = () => {
        return (
            <div id="form" className="col-md-12 p-0">
                {/* <h6 className="mt-2 mb-2">Apply Now</h6> */}
                {error ? <p className="text-danger">{error}</p> : null}

                <form className="d-flex flex-row">
                    <React.Fragment>
                        <input
                            name="email"
                            type="email"
                            className="form-control border-0"
                            id="exampleFormControlInput1"
                            placeholder="Enter your email"
                            onChange={formOnChangeHandler("email")}
                        />

                        <button className="btn btn-light bg-primary text-white rounded ml-1" onClick={captureEmail}>
                            Submit
                        </button>
                    </React.Fragment>
                </form>
            </div>
        );
    };
    return <>{showForm()}</>;
};
export default CheckEmail;
