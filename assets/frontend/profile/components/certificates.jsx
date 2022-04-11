import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Certification from "./certification_item.jsx";
import DeleteConfirmation from "./delete_confirmation.jsx";
import { parse, format, formatDistanceStrict } from "date-fns";
import DatePicker from "react-datepicker";
// import "react-datepicker/src/stylesheets/datepicker.scss";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certification: [],
            mode_certification: "edit",
            certification_index: null,
            certification_modal: false,
            certification_modal_data: {},
            addButtonCertification: false,
            delete_confirm_modal: false,
        };
    }

    addCertification = () => {
        let certificationData =
            this.props.certification !== undefined ? JSON.parse(JSON.stringify(this.props.certification)) : {};
        certificationData[certificationData.length] = {
            id: null,
            start_date: null,
            end_date: null,
        };
        this.setState(
            {
                mode_certification: "add",
                addButtonCertification: true,
                certification_index: certificationData.length - 1,
                certification_modal: true,
                certification_modal_data: certificationData[certificationData.length - 1],
            },
            () => { }
        );
    };

    editCertification = (index) => {
        this.setState({
            mode_certification: "edit",
            certification_index: index,
            certification_modal: true,
            certification_modal_data: this.props.certification[index],
        });
    };

    closeCertificationModal = () => {
        this.setState({
            certification_id: null,
            certification_index: null,
            certification_modal: false,
            certification_modal_data: {},
        });
    };

    updateCertification = (data) => {
        // console.log(data);
        // let new_data = Object.assign(this.state.certification_modal_data, data);
        // this.setState({ certification_modal_data: new_data });
        this.setState({ certification_modal_data: { ...this.state.certification_modal_data, ...data } });
    };
    validCertificate = () => {
        if (!this.state.certification_modal_data.certification_name
            && !Date.parse(this.state.certification_modal_data.start_date)
            && !Date.parse(this.state.certification_modal_data.end_date)
        ) {
            toast.error(this.props.t(this.props.language?.layout?.msg_1), { toastId: 'id1' });
            return false;
        }
        if (!this.state.certification_modal_data.certification_name) {
            toast.error(this.props.t(this.props.language?.layout?.msg_1), { toastId: 'id2' });
            return false;
        }
        if (!this.state.certification_modal_data.start_date || !this.state.certification_modal_data.end_date) {
            toast.error(this.props.t(this.props.language?.layout?.toast39_nt), { toastId: 'id3' });
            return false;
        }
        if (
            Date.parse(this.state.certification_modal_data.start_date) >
            Date.parse(this.state.certification_modal_data.end_date)
        ) {
            toast.error(this.props.t(this.props.language?.layout?.toast40_nt), { toastId: 'id4' });
            return false;
        }
        return true;
    }
    updateCertificationToServer = () => {
        if (this.validCertificate()) {
            this.props.updateToServer({ certificate: this.state.certification_modal_data }, this.state.certification_modal_data.id);
            this.setState({ certification_modal: false });
        }
        return;
    };

    addCertificationToServer = () => {
        if (this.validCertificate()) {
            this.props.addToServer({ certificate: this.state.certification_modal_data });
            this.setState({ certification_modal: false });
        }
        return;
    };
    deleteCertification = () => {
        this.props.delete({ certificate: {} }, this.state.certification_modal_data.id);
        this.setState({ certification_modal: false });
        this.statusDeleteConfirmModal(false);
    };
    statusDeleteConfirmModal = (status) => {
        this.props.setStateDeleteConfirmModal("certificate_delete_confirm_modal", status);
    };
    render() {
        const { t } = this.props;
        return (
            <div>
                <div className="d-flex justify-content-between">
                    <h3 className="flex-fill">{t(this.props.language?.layout?.js_profile_certificates)}</h3>
                    {!this.props.isPreviewMode && this.props.certification.length !== 0 ?
                        <a
                            tabIndex="0"
                            type="button"
                            className="btn buttonFocus text-primary d-print-none mt-n1 pr-0"
                            onClick={(e) => this.addCertification()}>
                            {t(this.props.language?.layout?.js_profile_addcertificate)}
                        </a>
                        : null}
                </div>
                <hr className="mt-1" />
                {this.props.certification.length === 0 ?
                    <div className="text-muted">{t(this.props.language?.layout?.js_profile_nocertificated)}
                        <a
                            tabIndex="0"
                            type="button"
                            className={"btn buttonFocus text-primary d-print-none mt-n1 ml-2 " + (this.props.isPreviewMode ? "d-none" : "")}
                            onClick={(e) => this.addCertification()}>
                            {t(this.props.language?.layout?.js_profile_addcertificate)}
                        </a>
                    </div>
                    : null}
                <ul className="vertical-timeline mt-3 mb-0 certificates">
                    {this.props.certification.map((item, index) => (
                        <li className="pb-0 mb-3 position-relative m-0">
                            <Certification
                                isPreviewMode={this.props.isPreviewMode}
                                index={index}
                                key={item.id}
                                item={item}
                                editCertification={this.editCertification}
                            />
                        </li>
                    ))}
                </ul>

                <Modal show={this.state.certification_modal} size={"lg"} onHide={this.closeCertificationModal}>
                    <div className="modal-content" id="toggle">
                        <div className="modal-header px-4">
                            <h3 className="modal-title" id="staticBackdropLabel">
                                {this.state.mode_certification == "add" ? t(this.props.language?.layout?.js_profile_add) : t(this.props.language?.layout?.all_edit_nt)} {t(this.props.language?.layout?.js_profile_certificates)}
                            </h3>
                            <button
                                type="button"
                                className="close animate-closeicon"
                                aria-label="Close"
                                onClick={this.closeCertificationModal}
                                title={t(this.props.language?.layout?.all_close_nt)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body px-4 pt-0">
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active">{t(this.props.language?.layout?.sp_dashboard_name)}*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={this.state.certification_modal_data.certification_name === null ? "" : this.state.certification_modal_data.certification_name}
                                            required
                                            onChange={(e) =>
                                                this.updateCertification({ certification_name: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active react-datepicker-popper">{t(this.props.language?.layout?.js_issueddate)}*</label>
                                        <DatePicker
                                            className="w-100"
                                            selected={
                                                this.state.certification_modal_data.start_date
                                                    ? new Date(this.state.certification_modal_data.start_date)
                                                    : null
                                            }
                                            className="form-control"
                                            placeholder="mm-yyyy"
                                            autoComplete="off"
                                            onChange={(date) =>
                                                this.updateCertification(
                                                    date
                                                        ? { start_date: format(date, "yyyy-MM") + "-05" }
                                                        : (this.state.certification_modal_data.start_date = null)
                                                )
                                            }
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                            showFullMonthYearPicker
                                            placeholderText="mm-yyyy"
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    {this.state.certification_modal_data.no_expire === true ||
                                        (this.props.certification.no_expire !== false && (
                                            <div className="form-group animated">
                                                <label className="form-label-active react-datepicker-popper">
                                                    {t(this.props.language?.layout?.js_enddate)}*
                                                </label>
                                                <DatePicker
                                                    className="w-100"
                                                    selected={
                                                        this.state.certification_modal_data.end_date
                                                            ? new Date(this.state.certification_modal_data.end_date)
                                                            : null
                                                    }
                                                    className="form-control"
                                                    placeholder="mm-yyyy"
                                                    autoComplete="off"
                                                    onChange={(date) =>
                                                        this.updateCertification(
                                                            date
                                                                ? { end_date: format(date, "yyyy-MM") + "-05" }
                                                                : (this.state.certification_modal_data.end_date = null)
                                                        )
                                                    }
                                                    dateFormat="MM/yyyy"
                                                    showMonthYearPicker
                                                    showFullMonthYearPicker
                                                    placeholderText="mm-yyyy"
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                        {this.state.mode_certification === "edit" ? (
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
                                </div>
                                <div className="d-flex justify-content-around text-right col-md-4 pr-0 mx-0 my-1">
                                    <div className="col-md-6 p-0 mr-4">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-block"
                                            aria-label="Close"
                                            onClick={this.closeCertificationModal}>
                                            {t(this.props.language?.layout?.js_account_cancel)}
                                        </button>
                                    </div>
                                    <div className="col-md-6 p-0 mr-4">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            onClick={this.updateCertificationToServer}>
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
                                                onClick={this.closeCertificationModal}>
                                                {t(this.props.language?.layout?.js_account_cancel)}
                                            </button>
                                        </div>
                                        <div className="col-md-6 p-0">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-block"
                                                onClick={this.addCertificationToServer}>
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
                    delete={this.deleteCertification}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(withTranslation()(Profile));
