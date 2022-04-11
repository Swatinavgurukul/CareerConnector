import React, { Component } from "react";
import WorkItem from "./work_item.jsx";
import DeleteConfirmation from "./delete_confirmation.jsx";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { parse, format, formatDistanceStrict } from "date-fns";
import LocationSearchInput from "../../common/locations.jsx";
import DatePicker, { setDefaultLocale } from "react-datepicker";
import { Link } from "react-router-dom";
import "react-datepicker/src/stylesheets/datepicker.scss";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

setDefaultLocale('en')
class Work extends Component {
    constructor(props) {
        super();
        this.state = {
            work: [],
            mode: "edit",
            work_index: null,
            work_modal: false,
            work_modal_data: {},
            addButtonWork: false,
            isCurrentWorking: false,
            delete_confirm_modal: false,
            isLocation: false
        };
    }

    addWork = () => {
        let work = JSON.parse(JSON.stringify(this.props.work));

        work[work.length] = {
            id: null,
            title: "",
            org_state: "",
            organization: "",
            city: "",
            org_country: "",
            description: "",
            start_date: null,
            end_date: null,
            employment_type: "",
            is_current: false,
        };
        this.setState({
            mode: "add",
            work_index: work.length - 1,
            work_modal: true,
            work_modal_data: work[work.length - 1],
        });
        // this.addWorkToServer();
    };
    editWork = (index) => {
        // console.log(this.props.work[index])
        this.setState({
            mode: "edit",
            work_index: index,
            work_modal: true,
            work_modal_data: this.props.work[index],
            isLocation: true
        });
    };
    closeWorkModal = () => {
        this.setState({ work_id: null, work_index: null, work_modal: false, work_modal_data: {} });
    };
    updateWork = (data) => {
        // let new_data = Object.assign(this.state.work_modal_data, data);
        // this.setState({ work_modal_data: new_data });
        this.setState({ work_modal_data: { ...this.state.work_modal_data, ...data } });
        // console.log(data);
    };

    validateWorkExperience = () => {
        if (
            !this.state.work_modal_data.title &&
            !this.state.work_modal_data.organization &&
            !this.state.work_modal_data.start_date &&
            !this.state.work_modal_data.end_date
        ) {
            toast.error(this.props.t(this.props.language?.layout?.toast30_nt), { toastId: "id1" });
            return false;
        }
        if (!this.state.work_modal_data.title || !this.state.work_modal_data.organization) {
            toast.error(this.props.t(this.props.language?.layout?.toast30_nt), { toastId: "id2" });
            return false;
        }
        if (this.state.work_modal_data.is_current === false) {
            // we dont both dates if is_surrent is false
            if (!this.state.work_modal_data.start_date || !this.state.work_modal_data.end_date) {
                toast.error(this.props.t(this.props.language?.layout?.toast37_nt), { toastId: "id3" });
                return false;
            }
            if (Date.parse(this.state.work_modal_data.start_date) >= Date.parse(this.state.work_modal_data.end_date)) {
                toast.error(this.props.t(this.props.language?.layout?.toast38_nt), { toastId: "id4" });
                return false;
            }
        } else {
            // we dont need end date if is_surrent is true
            if (!this.state.work_modal_data.start_date) {
                toast.error(this.props.t(this.props.language?.layout?.toast41_nt), { toastId: "id5" });
                return false;
            }
        }
        return true;
    };

    updateWorkToServer = () => {
        if (this.validateWorkExperience()) {
            this.props.updateToServer({ work: this.state.work_modal_data }, this.state.work_modal_data.id);
            this.setState({ work_modal: false });
        }
        return;
    };

    addWorkToServer = () => {
        // console.log("coming into add work", this.state.work_modal_data);
        if (this.validateWorkExperience()) {
            this.props.addToServer({ work: this.state.work_modal_data });
            this.setState({ work_modal: false });
        }
        return;
    };

    deleteWork = () => {
        this.props.delete({ work: {} }, this.state.work_modal_data.id);
        this.setState({ work_modal: false });
        this.statusDeleteConfirmModal(false);
    };
    statusDeleteConfirmModal = (status) => {
        this.props.setStateDeleteConfirmModal("work_delete_confirm_modal", status);
    };

    locationsJSON = {
        country: false,
        state: false,
        city: true,
    };

    setLocationCity = (data, city, locationCity, plcaeId) => {
        this.updateWork({ city: city[0] })
    };

    setLocation = (location) => {
        let totalAddress = [];
        let adr = location && location["address"];
        for (let i = 0; i < adr.length; i++) {
            if (
                adr[i].types[0] === "locality" ||
                adr[i].types[0] === "administrative_area_level_1" ||
                adr[i].types[0] === "country"
            ) {
                totalAddress.push(adr[i].long_name);
            }
        }
    };

    locationChange = (value) => {
        this.updateWork({ city: value });
    }
    render() {
        const { t } = this.props;
        return (
            <div>
                <div className="d-flex justify-content-between">
                    <h3 className="flex-fill">{t(this.props.language?.layout?.js_profile_experience)}  </h3>
                    {!this.props.isPreviewMode && this.props.work.length !== 0 ? (
                        <a
                            tabIndex="0"
                            type="button"
                            className="btn buttonFocus text-primary d-print-none mt-n1 pr-0"
                            data-target="#toggle"
                            onClick={(e) => this.addWork()}>
                            {t(this.props.language?.layout?.js_profile_addexperience)}
                        </a>
                    ) : null}
                </div>
                <hr className="mt-1" />
                {this.props.work.length === 0 ? (
                    <div className="text-muted">
                        {t(this.props.language?.layout?.js_profile_noexperience)}
                        <a
                            tabIndex="0"
                            type="button"
                            className={
                                "btn buttonFocus text-primary d-print-none mt-n1 ml-2 " +
                                (this.props.isPreviewMode ? "d-none" : "")
                            }
                            data-target="#toggle"
                            onClick={(e) => this.addWork()}>
                            {t(this.props.language?.layout?.js_profile_addexperience)}
                        </a>
                    </div>
                ) : null}
                <ul className="vertical-timeline mt-4 mb-0 ml-3">
                    {this.props.work.map((item, index) => (
                        <>
                            {this.props.work.length == 1 ? (
                                <li className="p-0">
                                    <div className="pending pl-two-point-five mb-3 position-relative m-0 pb-0">
                                        {/* <div className="bullet"></div> */}
                                        <WorkItem
                                            isPreviewMode={this.props.isPreviewMode}
                                            isAdminMode={this.props.isAdminMode}
                                            index={index}
                                            key={item.id}
                                            item={item}
                                            editWork={this.editWork}
                                        />
                                    </div>
                                </li>
                            ) : (
                                <li className="pending pb-0">
                                    <div className="bullet"></div>
                                    <WorkItem
                                        isPreviewMode={this.props.isPreviewMode}
                                        isAdminMode={this.props.isAdminMode}
                                        index={index}
                                        key={item.id}
                                        item={item}
                                        editWork={this.editWork}
                                    />
                                </li>
                            )}
                        </>
                    ))}
                </ul>

                <Modal size="lg" show={this.state.work_modal} onHide={this.closeWorkModal}>
                    <div className="modal-content" id="toggle">
                        <div className="modal-header px-4">
                            <h3 className="modal-title" id="staticBackdropLabel">
                                {this.state.mode == "add" ? t(this.props.language?.layout?.js_profile_add) : t(this.props.language?.layout?.all_edit_nt)} {t(this.props.language?.layout?.js_profile_experience)}
                            </h3>
                            <button
                                type="button"
                                className="close animate-closeicon"
                                aria-label="Close"
                                onClick={this.closeWorkModal}
                                title={t(this.props.language?.layout?.all_close_nt)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body pt-0 px-4">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active">{t(this.props.language?.layout?.js_application_jobtitle)}*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                this.state.work_modal_data.title === null
                                                    ? ""
                                                    : this.state.work_modal_data.title
                                            }
                                            required
                                            onChange={(e) => this.updateWork({ title: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group animated">
                                        <label for="exampleFormControlSelect1" class="form-label-active">
                                        {t(this.props.language?.layout?.all_employment_nt)}
                                        </label>
                                        <select
                                            className="form-control"
                                            id="exampleFormControlSelect1"
                                            value={
                                                this.state.work_modal_data.employment_type === null
                                                    ? ""
                                                    : this.state.work_modal_data.employment_type
                                            }
                                            onChange={(e) => this.updateWork({ employment_type: e.target.value })}>
                                            {/* <option value="">Employment Type</option> */}
                                            <option value="">{t(this.props.language?.layout?.seeker_select)}</option>
                                            <option value="Full Time">{t(this.props.language?.layout?.js_jobs_fulltime)}</option>
                                            <option value="Part Time">{t(this.props.language?.layout?.js_jobs_parttime)}</option>
                                            <option value="Contract">{t(this.props.language?.layout?.js_jobs_contract)}</option>
                                            <option value="Internship">{t(this.props.language?.layout?.js_jobs_internship)}</option>
                                            <option value="Permanent">{t(this.props.language?.layout?.all_permanent_nt)}</option> 
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active">{t(this.props.language?.layout?.all_organisation_nt)}*</label> 
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                this.state.work_modal_data.organization === null
                                                    ? ""
                                                    : this.state.work_modal_data.organization
                                            }
                                            onChange={(e) => this.updateWork({ organization: e.target.value })}
                                        />{" "}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active z-index4">{t(this.props.language?.layout?.js_jobs_location)}</label>
                                        {/* <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                this.state.work_modal_data.city === undefined
                                                    ? this.state.work_modal_data.city === null ? ""
                                                        : this.state.work_modal_data.city : this.state.work_modal_data.city
                                            }
                                            onChange={(e) => this.updateWork({ city: e.target.value })}

                                        /> */}
                                        <LocationSearchInput
                                            setLocationCity={this.setLocationCity}
                                            locationsJSON={this.locationsJSON}
                                            setLocation={this.setLocation}
                                            city_aligment={true}
                                            displayValue={true}
                                            value={this.state.work_modal_data.city}
                                            isLocation={this.state.isLocation}
                                            locationChange={this.locationChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active react-datepicker-popper">{t(this.props.language?.layout?.js_startdate)}*</label>
                                        <DatePicker
                                            className="w-100"
                                            selected={
                                                this.state.work_modal_data.start_date
                                                    ? new Date(this.state.work_modal_data.start_date)
                                                    : null
                                            }
                                            locale='en'
                                            className="form-control"
                                            placeholder="mm/yyyy"
                                            autoComplete="off"
                                            onChange={(date) =>
                                                this.updateWork(
                                                    date
                                                        ? { start_date: format(date, "yyyy-MM") + "-05" }
                                                        : (this.state.work_modal_data.start_date = null)
                                                )
                                            }
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                            showFullMonthYearPicker
                                            placeholderText="mm/yyyy"
                                            maxDate={new Date()}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active react-datepicker-popper">{t(this.props.language?.layout?.js_enddate)}*</label>
                                        <DatePicker
                                            className="w-100"
                                            selected={
                                                this.state.work_modal_data.end_date
                                                    ? new Date(this.state.work_modal_data.end_date)
                                                    : null
                                            }
                                            className="form-control"
                                            placeholder="mm/yyyy"
                                            autoComplete="off"
                                            onChange={(date) =>
                                                this.updateWork(
                                                    date
                                                        ? { end_date: format(date, "yyyy-MM") + "-05" }
                                                        : (this.state.work_modal_data.end_date = null)
                                                )
                                            }
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                            showFullMonthYearPicker
                                            placeholderText="mm/yyyy"
                                            disabled={this.state.work_modal_data.is_current ? true : false}
                                            maxDate={new Date()}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-12 d-flex align-items-end">
                                    <div class={`form-check custom-checkbox mb-0 d-block"}`}>
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            id="defaultCheck11"
                                            checked={this.state.work_modal_data.is_current}
                                            onChange={(e) =>
                                                this.updateWork({ is_current: !this.state.work_modal_data.is_current })
                                            }
                                        />
                                        <label class="form-check-label" for="defaultCheck11" tabIndex="0" onKeyDown={e => e.key === "Enter" && this.updateWork({ is_current: !this.state.work_modal_data.is_current })}></label>
                                        <span class="custom-checkbox-text stretched-link">{t(this.props.language?.layout?.currentjob_nt)}</span> 
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active">{t(this.props.language?.layout?.seeker_des)}</label>
                                        <textarea
                                            type="text"
                                            className="form-control rounded-1 mytextarea"
                                            rows="4"
                                            name="description"
                                            value={
                                                this.state.work_modal_data.description === null
                                                    ? ""
                                                    : this.state.work_modal_data.description
                                            }
                                            onChange={(e) => this.updateWork({ description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {this.state.mode === "edit" ? (
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
                                            onClick={this.closeWorkModal}>
                                            {t(this.props.language?.layout?.js_account_cancel)}
                                        </button>
                                    </div>
                                    <div className="col-md-6 p-0 mr-4">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            onClick={this.updateWorkToServer}>
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
                                                onClick={this.closeWorkModal}>
                                                {t(this.props.language?.layout?.js_account_cancel)}
                                            </button>
                                        </div>
                                        <div className="col-md-6 p-0">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-block"
                                                onClick={this.addWorkToServer}>
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
                    delete={this.deleteWork}
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

export default connect(mapStateToProps, {})(withTranslation()(Work));