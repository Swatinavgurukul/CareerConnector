import React, { Component } from "react";
import Accomplishment from "./accomplishment_item.jsx";
import DeleteConfirmation from "./delete_confirmation.jsx";
import Modal from "react-bootstrap/Modal";
import { parse, format, formatDistanceStrict } from "date-fns";
import DatePicker from "react-datepicker";
// import "react-datepicker/src/stylesheets/datepicker.scss";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

// const default_user_object={}
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode_acheviment: "edit",
            acheviment_index: null,
            acheviment_modal: false,
            acheviment_modal_data: {},
            addButtonAcheviment: false,
            delete_confirm_modal: false,
        };
    }

    addAcheviment = () => {
        let achevimentData =
            this.props.achievement !== undefined ? JSON.parse(JSON.stringify(this.props.achievement)) : {};
        // console.log('achevimentData bef ', achevimentData)
        achevimentData[achevimentData.length] = {
            id: null,
            start_date: null,
            end_date: null,
        };
        this.setState(
            {
                mode_acheviment: "add",
                addButtonAcheviment: true,
                acheviment_index: achevimentData.length - 1,
                acheviment_modal: true,
                acheviment_modal_data: achevimentData[achevimentData.length - 1],
            },
            () => { }
        );
    };

    editAcheviment = (index) => {
        this.setState({
            mode_acheviment: "edit",
            acheviment_index: index,
            acheviment_modal: true,
            acheviment_modal_data: this.props.achievement[index],
        });
    };

    closeAchevimentModal = () => {
        this.setState({
            acheviment_id: null,
            acheviment_index: null,
            acheviment_modal: false,
            acheviment_modal_data: {},
        });
    };

    updateAcheviment = (data) => {
        // console.log(data);
        // let new_data = Object.assign(this.state.acheviment_modal_data, data);
        // this.setState({ acheviment_modal: new_data });
        this.setState({ acheviment_modal_data: { ...this.state.acheviment_modal_data, ...data } });
    };
    validAccomplishment = () => {
        if (!this.state.acheviment_modal_data.achievement_name
            && !Date.parse(this.state.acheviment_modal_data.start_date)
            && !Date.parse(this.state.acheviment_modal_data.end_date)
        ) {
            toast.error( this.props.t(this.props.language?.layout?.toast30_nt), { toastId: 'id1' });
            return false;
        }
        if (!this.state.acheviment_modal_data.achievement_name) {
            toast.error( this.props.t(this.props.language?.layout?.toast30_nt), { toastId: 'id2' });
            return false;
        }
        if (!this.state.acheviment_modal_data.start_date || !this.state.acheviment_modal_data.end_date) {
            toast.error(this.props.t(this.props.language?.layout?.toast37_nt), { toastId: 'id3' });
            return false;
        }
        if (
            Date.parse(this.state.acheviment_modal_data.start_date) >
            Date.parse(this.state.acheviment_modal_data.end_date)
        ) {
            toast.error(this.props.t(this.props.language?.layout?.toast38_nt), { toastId: 'id4' });
            return false;
        }
        return true;
    }

    updateAchevimentToServer = () => {
        console.log(this.state.acheviment_modal_data.achievement_name, "    this.state.acheviment_modal_data.achievement_name")
        if (this.validAccomplishment()) {
            this.props.updateToServer({ achievement: this.state.acheviment_modal_data }, this.state.acheviment_modal_data.id);
            this.setState({ acheviment_modal: false });
        }
        return;
    };

    addAchevimentToServer = () => {
        if (this.validAccomplishment()) {
            this.props.addToServer({ achievement: this.state.acheviment_modal_data });
            this.setState({ acheviment_modal: false });
        }
        return;
    };
    deleteAcheviment = () => {
        this.props.delete({ achievement: {} }, this.state.acheviment_modal_data.id);
        this.setState({ acheviment_modal: false });
        this.statusDeleteConfirmModal(false);
    };
    statusDeleteConfirmModal = (status) => {
        this.props.setStateDeleteConfirmModal("accomplishiment_delete_confirm_modal", status);
    };
    render() {
        const { t } = this.props;
        return (
            <div>
                <div className="d-flex justify-content-between">
                    <h3 className="flex-fill">{t(this.props.language?.layout?.js_accomplishment)}</h3>
                    {!this.props.isPreviewMode && this.props.achievement.length !== 0 ?
                        <a
                            tabIndex="0"
                            type="button"
                            className="btn buttonFocus text-primary d-print-none mt-n1 pr-0"
                            data-target="#toggle"
                            onClick={(e) => this.addAcheviment()}>
                            {t(this.props.language?.layout?.js_accomplishment_add)}
                        </a>
                        : null
                    }
                </div>
                <hr className="mt-1" />
                {
                    this.props.achievement.length === 0 ?
                        <div className="text-muted"> {t(this.props.language?.layout?.js_profile_nodetails_nt)}
                            <a
                                tabIndex="0"
                                type="button"
                                className={"btn buttonFocus text-primary d-print-none mt-n1 ml-2 " + (this.props.isPreviewMode ? "d-none" : "")}
                                data-target="#toggle"
                                onClick={(e) => this.addAcheviment()}>
                                {t(this.props.language?.layout?.js_accomplishment_add)}
                            </a>
                        </div >
                        : null
                }
                <ul className="vertical-timeline mt-3 mb-0 accomplishments">
                    {this.props.achievement.map((item, index) => (
                        <li className="pb-0 mb-3 position-relative m-0">
                            <Accomplishment
                                isPreviewMode={this.props.isPreviewMode}
                                index={index}
                                key={item.id}
                                item={item}
                                editAcheviment={this.editAcheviment}
                            />
                        </li>
                    ))}
                </ul>

                <Modal show={this.state.acheviment_modal} size={"lg"} onHide={this.closeAchevimentModal}>
                    <div className="modal-content" id="toggle">
                        <div className="modal-header px-4">
                            <h3 className="modal-title" id="staticBackdropLabel">
                                {this.state.mode_acheviment == "add" ? t(this.props.language?.layout?.js_profile_add) : t(this.props.language?.layout?.all_edit_nt)} {t(this.props.language?.layout?.js_accomplishment)} {/* {no_translated} */}
                            </h3>
                            <button
                                type="button"
                                className="close animate-closeicon"
                                aria-label="Close"
                                onClick={this.closeAchevimentModal}
                                title= {t(this.props.language?.layout?.all_close_nt)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body px-4 pt-0">
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active"> {t(this.props.language?.layout?.seeker_title)}*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={this.state.acheviment_modal_data.achievement_name === null ? "" : this.state.acheviment_modal_data.achievement_name}
                                            required
                                            onChange={(e) =>
                                                this.updateAcheviment({ achievement_name: e.target.value })
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
                                                this.state.acheviment_modal_data.start_date
                                                    ? new Date(this.state.acheviment_modal_data.start_date)
                                                    : null
                                            }
                                            className="form-control"
                                            placeholder="mm-yyyy"
                                            autoComplete="off"
                                            onChange={(date) =>
                                                this.updateAcheviment(
                                                    date
                                                        ? { start_date: format(date, "yyyy-MM") + "-05" }
                                                        : (this.state.acheviment_modal_data.start_date = null)
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
                                    <div className="form-group animated">
                                        <label className="form-label-active react-datepicker-popper">{t(this.props.language?.layout?.js_enddate)}*</label>
                                        <DatePicker
                                            className="w-100"
                                            selected={
                                                this.state.acheviment_modal_data.end_date
                                                    ? new Date(this.state.acheviment_modal_data.end_date)
                                                    : null
                                            }
                                            className="form-control"
                                            placeholder="mm-yyyy"
                                            autoComplete="off"
                                            onChange={(date) =>
                                                this.updateAcheviment(
                                                    date
                                                        ? { end_date: format(date, "yyyy-MM") + "-05" }
                                                        : (this.state.acheviment_modal_data.end_date = null)
                                                )
                                            }
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                            showFullMonthYearPicker
                                            placeholderText="mm-yyyy"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.state.mode_acheviment === t(this.props.language?.layout?.all_edit_nt) ? (
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
                                            onClick={this.closeAchevimentModal}>
                                            {t(this.props.language?.layout?.js_account_cancel)}
                                        </button>
                                    </div>
                                    <div className="col-md-6 p-0 mr-4">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            onClick={this.updateAchevimentToServer}>
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
                                                onClick={this.closeAchevimentModal}>
                                                {t(this.props.language?.layout?.js_account_cancel)}
                                            </button>
                                        </div>
                                        <div className="col-md-6 p-0">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-block"
                                                onClick={this.addAchevimentToServer}>
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
                    delete={this.deleteAcheviment}
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