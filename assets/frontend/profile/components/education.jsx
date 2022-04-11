import React, { Component } from "react";
import Education from "./education_item.jsx";
import DeleteConfirmation from "./delete_confirmation.jsx";
import Modal from "react-bootstrap/Modal";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
// import "react-datepicker/src/stylesheets/datepicker.scss";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

class Profile extends Component {
    constructor(props) {
        super();
        this.state = {
            education: [],
            mode_education: "edit",
            education_index: null,
            education_modal: false,
            education_modal_data: {},
            addButtonEducation: false,
            isCurrentlyStudying: false,
            delete_confirm_modal: false,
        };
    }

    addEducation = () => {
        let educationData = JSON.parse(JSON.stringify(this.props.education));
        educationData[educationData.length] = {
            id: null,
            degree: "",
            end_date: null,
            start_date: null,
            // university_country: "",
            university_state: "",
            university_name: "",
            university_city: "",
            is_current: false,
        };
        this.setState(
            {
                mode_education: "add",
                addButtonEducation: true,
                // education: education,
                education_index: educationData.length - 1,
                education_modal: true,
                education_modal_data: educationData[educationData.length - 1],
            },
            () => { }
        );
    };

    editEducation = (index) => {
        this.setState({
            mode_education: "edit",
            education_index: index,
            education_modal: true,
            education_modal_data: this.props.education[index],
        });
    };

    closeEducationModal = () => {
        this.setState({ education_id: null, education_index: null, education_modal: false, education_modal_data: {} });
    };

    updateEducation = (data) => {
        // console.log(data);
        // let new_data = Object.assign(this.state.education_modal_data, data);
        // this.setState({ education_modal_data: new_data });.
        this.setState({ education_modal_data: { ...this.state.education_modal_data, ...data } });
    };
    validateEducation = () => {
        if (
            !this.state.education_modal_data.university_name &&
            !this.state.education_modal_data.degree &&
            !this.state.education_modal_data.start_date &&
            !this.state.education_modal_data.end_date
        ) {
            toast.error(this.props.t(this.props.language?.layout?.toast30_nt), { toastId: "id1" });
            return false;
        }
        if (!this.state.education_modal_data.university_name || !this.state.education_modal_data.degree) {
            toast.error(this.props.t(this.props.language?.layout?.toast30_nt), { toastId: "id2" });
            return false;
        }
        if (this.state.education_modal_data.is_current === false) {
            // we dont both dates if is_surrent is false
            if (!this.state.education_modal_data.start_date || !this.state.education_modal_data.end_date) {
                toast.error(this.props.t(this.props.language?.layout?.toast37_nt), { toastId: "id3" });
                return false;
            }
            if (
                Date.parse(this.state.education_modal_data.start_date) >=
                Date.parse(this.state.education_modal_data.end_date)
            ) {
                toast.error(this.props.t(this.props.language?.layout?.toast38_nt), { toastId: "id4" });
                return false;
            }
        } else {
            // we dont need end date if is_surrent is true
            if (!this.state.education_modal_data.start_date) {
                toast.error(this.props.t(this.props.language?.layout?.toast41_nt), { toastId: "id5" });
                return false;
            }
        }
        return true;
    };
    updateEducationToServer = () => {
        if (this.validateEducation()) {
            this.props.updateToServer(
                { education: this.state.education_modal_data },
                this.state.education_modal_data.id
            );
            this.setState({ education_modal: false });
        }
        return;
    };

    addEducationToServer = () => {
        if (this.validateEducation()) {
            this.props.addToServer({ education: this.state.education_modal_data });
            this.setState({ education_modal: false });
        }
        return;
    };
    deleteEducation = () => {
        this.props.delete({ education: {} }, this.state.education_modal_data.id);
        this.setState({ education_modal: false });
        this.statusDeleteConfirmModal(false);
    };
    statusDeleteConfirmModal = (status) => {
        this.props.setStateDeleteConfirmModal("education_delete_confirm_modal", status);
    };
    render() {
        const { t } = this.props;
        return (
            <div>
                <div className="d-flex justify-content-between">
                    <h3 className="flex-fill">{t(this.props.language?.layout?.js_profile_academicdetails)}</h3>
                    {!this.props.isPreviewMode && this.props.education.length !== 0 ? (
                        <a
                            tabIndex="0"
                            type="button"
                            className="btn buttonFocus text-primary d-print-none mt-n1 pr-0"
                            onClick={(e) => this.addEducation()}>
                            {/* <img src="/svgs/icons_new/plus-circle.svg" className="svg-sm svg-gray" title="Add" /> */}
                            {t(this.props.language?.layout?.js_profile_addacademicdetails)}
                        </a>
                    ) : null}
                </div>
                <hr className="mt-1" />
                {this.props.education.length === 0 ? (
                    <div className="text-muted">
                        {t(this.props.language?.layout?.js_profile_noacademicdetails)}
                        < a
                            tabIndex="0"
                            type="button"
                            className={
                                "btn buttonFocus text-primary d-print-none mt-n1 ml-2 " + (this.props.isPreviewMode ? "d-none" : "")
                            }
                            onClick={(e) => this.addEducation()
                            }>
                            {t(this.props.language?.layout?.js_profile_addacademicdetails)}
                        </a >
                    </div >
                ) : null
                }
                <ul className="vertical-timeline mt-4 mb-0 ml-3">
                    {this.props.education.map((item, index) => (
                        <>
                            {this.props.education.length == 1 ? (
                                <div className="pending pl-two-point-five mb-3 position-relative m-0">
                                    {/* <div className="bullet"></div> */}
                                    <Education
                                        isPreviewMode={this.props.isPreviewMode}
                                        index={index}
                                        key={item.id}
                                        item={item}
                                        editEducation={this.editEducation}
                                    />
                                </div>
                            ) : (
                                <li className="pending">
                                    <div className="bullet"></div>
                                    <Education
                                        isPreviewMode={this.props.isPreviewMode}
                                        index={index}
                                        key={item.id}
                                        item={item}
                                        editEducation={this.editEducation}
                                    />
                                </li>
                            )}
                        </>
                    ))}
                </ul>

                <Modal show={this.state.education_modal} size={"lg"} onHide={this.closeEducationModal}>
                    <div className="modal-content">
                        <div className="modal-header px-4">
                            <h5 className="modal-title" id="staticBackdropLabel">
                                {this.state.mode_education == "add" ? t(this.props.language?.layout?.js_profile_add) : t(this.props.language?.layout?.all_edit_nt)} {t(this.props.language?.layout?.profile_education_details_nt)}
                            </h5>
                            <button
                                type="button"
                                className="close animate-closeicon"
                                aria-label="Close"
                                onClick={this.closeEducationModal}
                                title={t(this.props.language?.layout?.all_close_nt)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body px-4 pt-0">
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active"> {t(this.props.language?.layout?.profile_education_university_nt)}*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                this.state.education_modal_data.university_name === "Null"
                                                    ? ""
                                                    : this.state.education_modal_data.university_name
                                            }
                                            onChange={(e) => this.updateEducation({ university_name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active"> {t(this.props.language?.layout?.profile_education_degree_nt)}*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                this.state.education_modal_data.degree === "Null"
                                                    ? ""
                                                    : this.state.education_modal_data.degree
                                            }
                                            onChange={(e) => this.updateEducation({ degree: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-4">
                                    <div className="form-group animated">
                                        <label className="form-label-active react-datepicker-popper">{t(this.props.language?.layout?.js_startdate)}*</label>
                                        <DatePicker
                                            className="w-100"
                                            selected={
                                                this.state.education_modal_data.start_date
                                                    ? new Date(this.state.education_modal_data.start_date)
                                                    : null
                                            }
                                            className="form-control"
                                            placeholder="mm-yyyy"
                                            autoComplete="off"
                                            closeOnSelect
                                            onChange={(date) =>
                                                this.updateEducation(
                                                    date
                                                        ? { start_date: format(date, "yyyy-MM") + "-05" }
                                                        : (this.state.education_modal_data.start_date = null)
                                                )
                                            }
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                            showFullMonthYearPicker
                                            placeholderText="mm-yyyy"
                                            maxDate={new Date()}

                                        />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group animated">
                                        <label className="form-label-active react-datepicker-popper">{t(this.props.language?.layout?.js_enddate)}*</label>
                                        <DatePicker
                                            className="w-100"
                                            selected={
                                                this.state.education_modal_data.end_date
                                                    ? new Date(this.state.education_modal_data.end_date)
                                                    : null
                                            }
                                            className="form-control"
                                            placeholder="mm-yyyy"
                                            autoComplete="off"
                                            onChange={(date) =>
                                                this.updateEducation(
                                                    date
                                                        ? { end_date: format(date, "yyyy-MM") + "-05" }
                                                        : (this.state.education_modal_data.end_date = null)
                                                )
                                            }
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                            showFullMonthYearPicker
                                            placeholderText="mm-yyyy"
                                            disabled={this.state.education_modal_data.is_current ? true : false}
                                        // maxDate={new Date()}

                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 mt-5">
                                    <div class="form-check custom-checkbox mb-0">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            id="defaultCheck11"
                                            checked={this.state.education_modal_data.is_current}
                                            onChange={(e) =>
                                                this.updateEducation({
                                                    is_current: !this.state.education_modal_data.is_current,
                                                })
                                            }
                                            required
                                        />
                                        <label class="form-check-label" for="defaultCheck11" tabIndex="0"></label>
                                        <span class="custom-checkbox-text stretched-link">{t(this.props.language?.layout?.profile_education_pursuing_nt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {this.state.mode_education === "edit" ? (
                            <div class="modal-footer d-flex justify-content-between py-3 px-4">
                                <div className="col-md-2 p-0">
                                    <img
                                        src="/svgs/icons_new/trash.svg"
                                        className="svg-sm pointer"
                                        title="Delete"
                                        tabIndex="0"
                                        onKeyPress={() => this.statusDeleteConfirmModal(true)}
                                        onClick={() => this.statusDeleteConfirmModal(true)}
                                    />
                                    {/* <button
                                       type="button"
                                       className="btn btn-outline-secondary btn-block"
                                       onClick={this.deleteWork}>
                                       Delete
                                   </button> */}
                                </div>
                                <div className="d-flex justify-content-around text-right col-md-4 pr-0 mx-0 my-1">
                                    <div className="col-md-6 p-0 mr-4">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-block"
                                            aria-label="Close"
                                            onClick={this.closeEducationModal}>
                                            {t(this.props.language?.layout?.js_account_cancel)}
                                        </button>
                                    </div>
                                    <div className="col-md-6 p-0 mr-4">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            onClick={this.updateEducationToServer}>
                                            {t(this.props.language?.layout?.ep_setting_cd_save)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="modal-footer py-3 px-4">
                                <div className="col-6 my-0"></div>
                                <div className="col-6 pr-0 mr-0">
                                    <div className="d-flex">
                                        <div className="col-md-6">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-block"
                                                aria-label="Close"
                                                onClick={this.closeEducationModal}>
                                                {t(this.props.language?.layout?.js_account_cancel)}
                                            </button>
                                        </div>
                                        <div className="col-md-6 p-0">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-block"
                                                onClick={this.addEducationToServer}>
                                                {t(this.props.language?.layout?.ep_setting_cd_save)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
                <DeleteConfirmation
                    delete_confirm_modal={this.props.delete_confirm_modal}
                    statusDeleteConfirmModal={this.statusDeleteConfirmModal}
                    delete={this.deleteEducation}
                />
            </div >
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(withTranslation()(Profile));