import React, { Component } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

class Personal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resend_verification: false,
        };
    }

    verifyEmail = () => {
        this.showResults();
        let currentUserEmail = this.props.user.email;
        const formData = new FormData();
        formData.append("email", currentUserEmail);
        Axios.post("/api/v1/sendverificationlink", formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => { });
    };

    showResults = () => {
        this.setState({ resend_verification: true });
        setTimeout(() => this.hideResult(), 10000);
    };

    hideResult = () => {
        this.setState({ resend_verification: false });
    };

    saveFullName = (fullName) => {
        if (fullName) {
            this.props.saveProfileDetails({ profile: this.props.user }, this.props.user.availability_id);
        }
    };

    savePhoneNumber = () => {
        if (!this.props.user.phone.length || this.props.user.phone.length !== 10) {
            toast.error(this.props.t(this.props.language?.layout?.toast79_nt), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                toastId: "required1",
            });
            
        } else {
            this.props.saveProfileDetails(
                { profile: { phone: this.props.user.phone } },
                this.props.user.availability_id
            );
        }
        return;
    };

    render() {
        const { t } = this.props;
        return (
            <>
                {this.props.edit_item != "name" ? (
                    <div className=" icon-invert d-flex align-items-center mb-2">
                        <h2 className="mb-2">
                            {this.props.user.first_name != null ? this.props.user.first_name : ""}
                            {"  "}
                            {/* {this.props.user.last_name != null ? this.props.user.last_name : ""} */}
                            {this.props.user.first_name == null && this.props.user.last_name == null ? (
                                <small>
                                    <i>{t(this.props.language?.layout?.profile_providename_nt)}</i> 
                                </small>
                            ) : (
                                ""
                            )}
                        </h2>
                        <button
                            className={`btn no-outline icon-invert d-print-none rounded-0 ${this.props.isPreviewMode ? "invisible" : ""
                                }`}
                            type="button"
                            onClick={(e) => this.props.setEditItem("name")}>
                            <img src="/svgs/icons_new/edit-2.svg" className="svg-xs invert-color mb-1" title= {t(this.props.language?.layout?.all_edit_nt)} />
                        </button>
                    </div>
                ) : (
                    <div ref={this.props.setWrapperRef} className="text-white">
                        <div className="d-flex">
                            <div className="form-group animated d-flex">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder= {t(this.props.language?.layout?.all_fullname_nt)}
                                    value={this.props.user.first_name}
                                    onChange={(e) => this.props.updateName("first_name", e.target.value)}
                                />
                            </div>
                            <div
                                className={`alert bg-warning position-absolute py-1 px-2 ${this.props.user.first_name ? "d-none" : "d-block"
                                    }`}
                                style={{ top: "1rem", left: "14rem" }}
                                role="alert">
                                <img
                                    src="/svgs/icons_new/alert-circle.svg"
                                    className="svg-sm invert-color mr-1"
                                    title= {t(this.props.language?.layout?.all_close_nt)}
                                />
                                {t(this.props.language?.layout?.all_mandatory_nt)}
                            </div>
                            <button
                                type="button"
                                className="btn no-outline rounded-0"
                                onClick={() => this.saveFullName(this.props.user.first_name)}>
                                <img
                                    src="/svgs/icons_new/check-circle.svg"
                                    className={`svg-sm invert-color mt-1 ${this.props.user.first_name ? "" : "svg-disabled"
                                        }`}
                                    title={t(this.props.language?.layout?.ep_setting_cd_save)}
                                />
                            </button>
                            <button
                                type="button"
                                className="btn no-outline rounded-0"
                                onClick={(e) => this.props.validateUserName(e)}>
                                <img
                                    src="/svgs/icons_new/x-circle.svg"
                                    className="svg-sm invert-color mt-1"
                                    title= {t(this.props.language?.layout?.all_close_nt)}
                                />
                            </button>
                        </div>
                    </div>
                )}
                <div className=" icon-invert d-flex align-items-center">
                    <img src="/svgs/icons_new/mail.svg" className="svg-sm invert-color" />
                    <h6 className="pt-2 px-2">{this.props.user.email != null ? this.props.user.email : ""}</h6>
                </div>
                <div className="d-flex">
                    {this.props.edit_item !== "phone" && (
                        <div className=" icon-invert d-flex align-items-center profile-input-height">
                            <p className="icon-invert mt-0 mb-1">
                                <img src="/svgs/icons_new/phone.svg" className="svg-sm invert-color" />
                            </p>
                            <h6 className="pl-2 pr-2 pb-0 mb-0 ">
                                {this.props.user.phone !== "" && this.props.user.phone !== null
                                    ? this.props.user.phone
                                    : t(this.props.language?.layout?.profile_nocontact_nt)}
                            </h6>

                            <button
                                type="button"
                                className={`btn no-outline rounded-0 ${this.props.isPreviewMode ? "invisible" : ""}`}
                                onClick={(e) => this.props.setEditItem("phone")}>
                                <img
                                    src="/svgs/icons_new/edit-2.svg"
                                    className="svg-xs invert-color mb-1"
                                    title={t(this.props.language?.layout?.all_edit_nt)}
                                />
                            </button>
                        </div>
                    )}
                    {this.props.edit_item === "phone" && (
                        <div ref={this.props.setWrapperRef} className="text-white mt-2">
                            <div className="d-flex">
                                <p className="icon-invert mt-2">
                                    <img src="/svgs/icons_new/phone.svg" className="svg-sm invert-color" />
                                </p>
                                <div className="form-group animated">
                                    <input
                                        type="number"
                                        class="form-control ml-1"
                                        minlength="10"
                                        maxlength="10"
                                        name="phone"
                                        required=""
                                        id="id_phone"
                                        pattern="[0-9]{10}"
                                        value="3475648756"
                                        placeholder= {t(this.props.language?.layout?.profile_phoneno_nt)}
                                        value={this.props.user.phone != null ? this.props.user.phone : ""}
                                        onChange={(e) =>
                                            this.props.updateName(
                                                "phone",
                                                Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 10)
                                            )
                                        }
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn no-outline rounded-0"
                                    onClick={() => this.savePhoneNumber()}>
                                    <img
                                        src="/svgs/icons_new/check-circle.svg"
                                        className="svg-sm invert-color mt-1"
                                        title={t(this.props.language?.layout?.ep_setting_cd_save)}
                                    />
                                </button>
                                <button
                                    type="button"
                                    className="btn no-outline rounded-0"
                                    onClick={(e) => this.props.validateUserName(e)(e)}>
                                    <img
                                        src="/svgs/icons_new/x-circle.svg"
                                        className="svg-sm invert-color mt-1"
                                        title= {t(this.props.language?.layout?.all_close_nt)}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                    {this.props.edit_item !== "location" && (
                        <div className=" icon-invert d-flex align-items-center profile-input-height">
                            <p className="icon-invert mt-0 mb-1">
                                <img src="/svgs/icons_new/map-pin.svg" className="svg-sm invert-color" />
                            </p>
                            <h6 className="pl-2 pr-2 pb-0 mb-0 ">
                                {this.props.user.location !== "" && this.props.user.location !== null
                                    ? this.props.user.location
                                    : t(this.props.language?.layout?.sp_viewseeker_locationnot)}
                            </h6>

                            <button
                                type="button"
                                className={`btn no-outline  icon-invert rounded-0 d-print-none ${this.props.isPreviewMode ? "invisible" : ""
                                    }`}
                                onClick={(e) => this.props.setEditItem("location")}>
                                <img
                                    src="/svgs/icons_new/edit-2.svg"
                                    className="svg-xs invert-color mb-1"
                                    title={t(this.props.language?.layout?.all_edit_nt)}
                                />
                            </button>
                        </div>
                    )}
                    {this.props.edit_item === "location" && (
                        <div ref={this.props.setWrapperRef} className="text-white mt-2">
                            <div className="d-flex">
                                <div className="form-group animated">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Location"
                                        value={this.props.user.location != null ? this.props.user.location : ""}
                                        onChange={(e) => this.props.updateName("location", e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn no-outline rounded-0"
                                    onClick={(e) => this.props.validateUserName(e)}>
                                    <img
                                        src="/svgs/icons_new/check-circle.svg"
                                        className="svg-sm invert-color mt-1"
                                        title= {t(this.props.language?.layout?.ep_setting_cd_save)}
                                    />
                                </button>
                                <button
                                    type="button"
                                    className="btn no-outline rounded-0"
                                    onClick={(e) => this.props.validateUserName(e)}>
                                    <img
                                        src="/svgs/icons_new/x-circle.svg"
                                        className="svg-sm invert-color mt-1"
                                        title= {t(this.props.language?.layout?.all_close_nt)}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(withTranslation()(Personal));