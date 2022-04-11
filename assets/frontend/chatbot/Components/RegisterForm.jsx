import React, { useContext } from "react";
import { ChatHistoryContext } from "../Context/ChatHistoryContext";
import { InputContext } from "../Context/InputContext";
import { connect } from "react-redux";
import { _setAuthData } from "../../actions/actionsAuth.jsx";

const RegisterForm = (props) => {
    let { formOnChangeHandler, captureRegisterDetails, user, error, disableBtn } = useContext(InputContext);
    // console.log("useruseruseruseruser",props)
    return (
        <div className="col-md-12 bg-white rounded-bottom rounded-left">
            <div>
                <form className="mt-2">
                    <React.Fragment>
                        <div className="form-group">
                            <input
                                name="name"
                                type="text"
                                class="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Enter your full name"
                                onChange={formOnChangeHandler("name")}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                name="email"
                                type="email"
                                class="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Enter your email"
                                value={user.email}
                                onChange={formOnChangeHandler("email")}
                                readOnly={props.user.authenticated}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                name="phone"
                                type="number"
                                class="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Enter your number"
                                maxlength="10"
                                onChange={formOnChangeHandler("phone")}
                            />
                        </div>

                        <div class="form-group d-flex">
                            <input
                                type="file"
                                class="form-control-file mt-3"
                                id="exampleFormControlFile1"
                                // accept=".pdf,.doc"
                                onChange={formOnChangeHandler("file")}></input>
                            <span
                                className="align-self-end"
                                data-toggle="tooltip"
                                data-placement="right"
                                title="Supported file docx and pdf.">
                                <img class="mb-1 ml-1 svg-xs" alt="info" src="/svgs/icons_new/info.svg" />
                            </span>
                        </div>

                        {error ? <p className="text-danger">{error}</p> : null}
                        <button
                            className="btn btn-light text-white bg-primary mx-auto d-block rounded my-3"
                            disabled={disableBtn}
                            onClick={(e) => captureRegisterDetails(e)}>
                            Register
                        </button>
                    </React.Fragment>
                </form>
            </div>
        </div>
    );
};
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
    };
}

export default connect(mapStateToProps, { _setAuthData })(RegisterForm);
