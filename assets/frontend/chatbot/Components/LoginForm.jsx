import React, { useContext, useState } from "react";

import { InputContext } from "../Context/InputContext.js";

const LoginForm = () => {
    let { formOnChangeHandler, captureLogin, formValues, error, disableBtn } = useContext(InputContext);
    const [visible, setVisible] = useState(false);

    return (
        <div id="login_form" className="col-md-12">
            <form className="mt-2">
                <div className="form-group">
                    <input type="email" className="form-control" autocomplete="off" value={formValues.email} readOnly />
                </div>
                <div className="form-group">
                    <input
                        type={visible ? "text" : "password"}
                        className="form-control mb-3"
                        onChange={formOnChangeHandler("password")}
                    />
                    <div className="d-flex justify-content-end mr-3">
                        <div className="icon-invert mt-n5 mb-4" onClick={(e) => setVisible(!visible)}>
                            <img
                                src={visible ? "/svgs/icons_new/eye-off.svg" : "/svgs/icons_new/eye.svg"}
                                alt="eye-slash-icon"
                                className="svg-sm"
                                id="eyeIcon"
                                tabIndex="0"
                            />
                        </div>
                    </div>
                </div>
                {error ? <p className="text-danger">{error}</p> : null}
                <button
                    type="submit"
                    class="btn btn-light bg-primary text-white mx-auto d-block rounded mb-3"
                    disabled={disableBtn}
                    onClick={captureLogin}>
                    Sign In
                </button>
            </form>
        </div>
    );
};
export default LoginForm;
