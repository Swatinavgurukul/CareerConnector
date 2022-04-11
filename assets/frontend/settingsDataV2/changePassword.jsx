import React, { Component } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslation } from 'react-i18next';

export class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideCurrentPassword: true,
            currentPassword: "",
            hideNewPassword: true,
            newPassword: "",
            hideRePassword: true,
            rePassword: "",
            message: false,
        };
        this.generteForm = this.generteForm.bind(this);
    }

    toastConfig = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };
    generteForm = () => {
        return [
            {
                label: this.props.t(this.props.language?.layout?.ep_setting_password_currentpasswprd)+ "*",
                placeholder: this.props.t(this.props.language?.layout?.ep_setting_password_placeholder),
                id: "currentPassword",
                type: () => (this.state.hideCurrentPassword ? "password" : "text"),
                value: this.state.currentPassword,
                changeHandler: this.handlePasswordChange,
            },
            {
                label: this.props.t(this.props.language?.layout?.ep_setting_password_newpassword)+ "*",
                placeholder: this.props.t(this.props.language?.layout?.ep_setting_password_placeholder1),
                id: "newPassword",
                type: () => (this.state.hideNewPassword ? "password" : "text"),
                value: this.state.newPassword,
                changeHandler: this.handleNewPasswordChange,
            },
            {
                label: this.props.t(this.props.language?.layout?.ep_setting_password_reenter) + "*",
                placeholder: this.props.t(this.props.language?.layout?.ep_setting_password_placeholder3),
                id: "rePassword",
                type: () => (this.state.hideRePassword ? "password" : "text"),
                value: this.state.rePassword,
                changeHandler: this.handleRePassword,
            },
        ];
    };
    message = (e) => {
        this.setState({ message: true });
    };
    handlePasswordChange = (e) => {
        this.setState({ currentPassword: e.target.value });
    };

    handleNewPasswordChange = (e) => {
        this.setState({ newPassword: e.target.value });
    };

    handleRePassword = (e) => {
        this.setState({ rePassword: e.target.value });
    };

    showHidePwd = (e) => {
        var eyeIcon = e.target;
        var input = eyeIcon.parentElement.parentElement.previousElementSibling;
        if (input.type === "password") {
            input.type = "text";
            eyeIcon.src = "/svgs/icons_new/eye-off.svg";
        } else {
            input.type = "password";
            eyeIcon.src = "/svgs/icons_new/eye.svg";
        }
    };

    toggleEyeIcon = (e) => {
        if (e.code === "Enter") {
            var eyeIcon = e.target;
            var input = eyeIcon.parentElement.parentElement.previousElementSibling;
            if (input.type === "password") {
                input.type = "text";
                eyeIcon.src = "/svgs/icons_new/eye-off.svg";
            } else {
                input.type = "password";
                eyeIcon.src = "/svgs/icons_new/eye.svg";
            }
            }
    };

    validate = () => {
        // console.log(this.state);
        const regexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
        if (!this.state.currentPassword) {
            toast.error(this.props.t(this.props.language?.layout?.ep_setting_password_placeholder), { ...this.toastConfig, toastId: "id1" });
            return;
        }
        if (!this.state.newPassword) {
            toast.error(this.props.t(this.props.language?.layout?.ep_setting_password_placeholder1), { ...this.toastConfig, toastId: "id2" });
            return;
        }
        // validation as per current one in signup page
        if (this.state.newPassword.length < 8) {
            // toast.error("Please enter valid password containing at least 8 characters", {
            //     ...this.toastConfig,
            //     toastId: "id3",
            // });
            toast.error(
                this.props.t(this.props.language?.layout?.toast96_nt),
                {
                    ...this.toastConfig,
                    toastId: "id3",
                }
            );
            return;
        }
        // console.log("!regexp.test(newPassword)", !regexp.test(this.state.newPassword))
        if (!regexp.test(this.state.newPassword)) {
            toast.error(
                this.props.t(this.props.language?.layout?.toast96_nt),
                {
                    ...this.toastConfig,
                    toastId: "id3",
                }
            );
            return;
        }
        if (this.state.newPassword === this.state.currentPassword) {
            toast.error(this.props.t(this.props.language?.layout?.toast97_nt), { ...this.toastConfig, toastId: "id4" });
            return;
        }
        if (!this.state.rePassword) {
            toast.error(this.props.t(this.props.language?.layout?.toast98_nt), { ...this.toastConfig, toastId: "id5" });
            return;
        }
        if (this.state.rePassword !== this.state.newPassword) {
            toast.error(this.props.t(this.props.language?.layout?.toast99_nt), {
                ...this.toastConfig,
                toastId: "id6",
            });
            return;
        }
        // toast.error("Please enter valid password with a combination of at least 8 characters containing numbers, letters and special characters",{ position: "top-right, {...this.toastConfig",
        this.handlePasswordReset();
    };

    handlePasswordReset = () => {
        let temp = {};
        temp.old_password = this.state.currentPassword;
        temp.new_password = this.state.newPassword;
        temp.retype_password = this.state.rePassword;
        // console.log("password      ", temp);

        const endpoint = "/api/v1/password/change";
        Axios.put(endpoint, JSON.stringify(temp), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.props.userToken}`,
            },
        })
            .then((response) => {
                // console.log(response)
                if (response.status == 200) {
                    // console.log("updated")
                    toast.success(this.props.t(this.props.language?.layout?.toast100_nt), { ...this.toastConfig });
                }
            })
            .catch((error) => {
                // console.log();
                if (error.response.data.status == 400) {
                    toast.error(this.props.t(this.props.language?.layout?.toast101_nt), { ...this.toastConfig });
                }

            });
    };

    render() {
        const { t } = this.props;
        return (
            <div className="card  border-0 setting_input" id="Change_Password_settings" >
                <div className="card-body p-0">
                    <form className="py-4">
                        {this.generteForm().map((f) => (
                            <div className="form-group d-md-flex align-items-center mb-0" key={f.id}>
                                <label for={f.id} className="col-md-3 p-0 col-form-label">
                                    {f.label}
                                </label>
                                <div className="col-md-9 p-0">
                                    <div class="form-group mb-0">
                                        <input
                                            class="form-control rounded-0 px-4 border-dark mb-3"
                                            id={f.id}
                                            placeholder={f.placeholder}
                                            type={f.type()}
                                            value={f.value}
                                            onChange={f.changeHandler}
                                        />
                                        <div class="d-flex justify-content-end mr-3">
                                            <a class="icon-invert mt-n5 mb-4">
                                                <img
                                                    onClick={(event) => this.showHidePwd(event)}
                                                    onKeyPress={(e) => this.toggleEyeIcon(e)}
                                                    src="/svgs/icons_new/eye.svg"
                                                    alt="eye-icon"
                                                    className="svg-sm"
                                                    tabindex="0"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* <div className="form-group row px-5">
                                <div className="offset-md-3 col-md-8">
                                    <div className="text-muted h6">
                                        <div className="pb-3">Your password must be at least 8 characters long, contain at least one number, at least one special character and have a mixture of uppercase and lowercase letters..</div>
                                        <ul className="list-style pl-3">
                                            <li>Minimum 8 characters</li>
                                            <li>1 Upper case letter</li>
                                            <li>1 Lower case letter</li>
                                            <li>1 Numeric character</li>
                                            <li>1 Special character</li>
                                        </ul>
                                    </div>
                                </div>
                            </div> */}
                    </form>
                    <div className="d-lg-flex p-0">
                        <div className="col-lg-5 col-12 text-right p-0 mb-3">
                            {this.state.message == true ? <span className="text-success">Password Updated</span> : null} {/* {no_translated} */}
                        </div>
                        <div className="col-lg-7 col-12 text-right p-0">
                            {/* <button className="btn btn-outline-secondary btn-md px-4 px-md-5 mx-4" onClick={() => { window.location.href = "/" }}>
                                {t(this.props.language?.layout?.sp_setting_password_cancel)}
                            </button> */}
                            <button className="btn btn-primary btn-md px-4" onClick={(e) => this.validate()}>
                                {t(this.props.language?.layout?.sp_setting_password_savechanges)}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(withTranslation()(ChangePassword));
