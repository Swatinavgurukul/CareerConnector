import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import Avataaars from "../avataars/avataaars.jsx";
import ReactCropper from "../../components/image_cropper.jsx";
import { applicationStatus } from "../../components/constants.jsx";
import SocialLinks from "./social_links.jsx";
import options from "../avataars/avataaars_options.jsx";
import LocationSearchInput from "../../common/locations.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const locationsJSON = {
    country: false,
    state: false,
    city: true,
};
const UserProfileHeader = (props) => {
    const { t } = useTranslation();
    const [resend_verification, setResend_verification] = useState(false);
    const [modalOpen, setmodalOpen] = useState(false);
    const [userLocation, setUserLocation] = useState({});

    const verifyEmail = () => {
        showResults();
        let currentUserEmail = props.user.email;
        const formData = new FormData();
        formData.append("email", currentUserEmail);
        Axios.post("/api/v1/sendverificationlink", formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((response) => { })
            .catch((error) => { });
    };
    const showResults = () => {
        setResend_verification(true);
        setTimeout(() => hideResult(), 10000);
    };
    const change = (event) => {
        props.updateStatus(event.target.value, props.applicationId);
    };
    const hideResult = () => {
        setResend_verification(false);
    };
    const saveFullName = (fullName) => {
        if (fullName) {
            props.saveProfileDetails({ profile: props.user }, props.user.availability_id);
        }
    };

    const savePhoneNumber = () => {
        if (!props.user.phone.length || props.user.phone.length !== 10) {
            toast.error(t(props.language?.layout?.toast9_nt));
        } else {
            props.saveProfileDetails({ profile: { phone: props.user.phone } }, props.user.availability_id);
        }
        return;
    };

    const closeModal = () => {
        setmodalOpen(false);
    };
    const setLocationCity = (data, city, locationCity, plcaeId) => {
        let location = {};
        location.city = city[0];
        location.state = city[1];
        location.country = city[2];
        location.latitude = locationCity.lat;
        location.longitude = locationCity.lng;
        location.place_id = plcaeId;
        setUserLocation(location);
    };
    const setLocation = (location) => {
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
    return (
        <div className="container-fluid brand-color px-0 pb-2">
            <div class="row text-white prfileHeader_height px-2 mx-0">
                {props.setting ? (
                    <div class="col-lg-8 mx-auto pt-5 pl-md-3">
                        <div class="d-flex">
                            <h4 class="text-capitalize pt-5">
                                <img
                                    src="/svgs/icons_new/settings.svg"
                                    className="svg-sm invert-color mr-2"
                                    alt="settings"
                                />
                                {t(props.language?.layout?.js_profile_settings)}
                            </h4>
                        </div>
                    </div>
                ) : (
                    <div className="col-lg-10 mx-auto">
                        <div className="d-md-flex">
                            <div className="col-lg-2 col-md-3 p-0">
                                <Fragment>
                                    {/* <div
                                        className="rounded-circle mt-4rem mx-auto"
                                        style={{ width: "150px", height: "150px", background: "#666666" }}>
                                        {props.user.image ? (
                                            <img
                                                src={props.user.image}
                                                className="rounded-circle img-fluid"
                                                accept="image/jpeg,image/png"
                                                type="file"
                                                alt=  {t(props.language?.layout?.userimage_nt)}
                                                style={{ width: "150px", height: "150px" }}
                                            />
                                        ) : (
                                            <img
                                                src="/images/profile_dummy.png"
                                                class="rounded-circle img-fluid"
                                                accept="image/jpeg,image/png"
                                                type="file"
                                                alt=  {t(props.language?.layout?.userimage_nt)}
                                                style={{ width: "150px", height: "150px" }}
                                            />
                                        )}
                                    </div> */}
                                    <div
                                        className="rounded-circle mt-4rem mx-auto mr-2 text-center d-flex align-items-center justify-content-center text-uppercase"
                                        style={{ width: "150px", height: "150px", background: "#666666" }}>
                                        {props.user.image == "" || props.user.image == null ? (
                                            (props.user.first_name == null || props.user.first_name == "") &&
                                                (props.user.last_name == null || props.user.last_name == "") ? (
                                                props.user?.username?.charAt(0)
                                            ) : (
                                                <span className="h1 mb-0">
                                                    {props.user.first_name != null &&
                                                        props.user.first_name != "" &&
                                                        props.user.first_name.charAt(0)}
                                                    {props.user.last_name != null && props.user.last_name != "" && props.user?.last_name?.charAt(0)}
                                                </span>
                                            )
                                        ) : (
                                            <img src={props.user.image} className="rounded-circle img-fluid" alt="candidate profile image" />
                                        )}
                                    </div>
                                    {props.user.image ? (
                                        <div
                                            className={`d-flex justify-content-between mt-2 d-print-none ${props.isPreviewMode ? "invisible" : ""
                                                }`}>
                                            <button
                                                type="button"
                                                className="btn btn-dark py-1 mr-1"
                                                tabIndex="0"
                                                onKeyPress={() => props.statusDeleteConfirmModal(true)}
                                                onClick={() => props.statusDeleteConfirmModal(true)}>
                                                <img
                                                    src="/svgs/icons_new/trash.svg"
                                                    className="svg-xs invert-color mr-1 mt-n1"
                                                    title="Delete"
                                                    alt="delete"
                                                />
                                                {t(props.language?.layout?.all_delete_nt)}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-dark py-1"
                                                onClick={() => setmodalOpen(true)}>
                                                <img
                                                    src="/svgs/icons_new/camera.svg"
                                                    className="svg-xs invert-color mr-2 mt-n1"
                                                    title="Upload profile image"
                                                    alt="Upload profile image"
                                                />
                                                {t(props.language?.layout?.all_update_nt)}
                                            </button>
                                        </div>
                                    ) : null}

                                    {
                                        <ReactCropper
                                            openM={modalOpen}
                                            closeModal={closeModal}
                                            getData={props.getData}
                                            userImage={props.user.image}
                                            changeImageUploadingStatus={props.changeImageUploadingStatus}
                                            availability_id={props.user.availability_id}
                                        />
                                    }
                                </Fragment>
                                <Fragment>
                                    {props.message ? null : (
                                        <Avataaars
                                            isPreviewMode={props.isPreviewMode}
                                            availability_id={props.user.availability_id}
                                            getData={props.getData}
                                            userImage={props.user.image}
                                            changeImageUploadingStatus={props.changeImageUploadingStatus}
                                        />
                                    )}
                                </Fragment>
                            </div>
                            <div class="col-lg-10 col-md-9 userDetails p-0">
                                {props.edit_item != "name" ? (
                                    <div class="d-flex align-items-top">
                                        <h4 class="text-capitalize">
                                            {props.user.first_name != null ? props.user.first_name : ""} {""}
                                            {props.user.last_name != null ? props.user.last_name : ""}
                                            {props.user.first_name == null && props.user.last_name == null ? (
                                                <small>
                                                    <i>{t(props.language?.layout?.profile_providename_nt)}</i>
                                                </small>
                                            ) : (
                                                ""
                                            )}
                                        </h4>
                                        <button
                                            className={`btn icon-invert btn-primary d-print-none rounded-0 pt-0 ${props.isPreviewMode ? "invisible" : ""
                                                }`}
                                            type="button"
                                            onClick={(e) => props.setEditItem("name")}>
                                            <img
                                                src="/svgs/icons_new/edit-2.svg"
                                                className="svg-xs mb-1 invert-color"
                                                title={t(props.language?.layout?.all_edit_nt)}
                                                alt="edit"
                                            />
                                        </button>

                                        {props.profile || props.candidate || props.message ? (
                                            ""
                                        ) : (
                                            <p className="ml-3">
                                                <select
                                                    className="border-0 btn-sm py-0 text-capitalize"
                                                    onChange={change}
                                                    value={props.status}>
                                                    {applicationStatus.map((filter) => (
                                                        <option key={filter} value={filter}>
                                                            {filter}
                                                        </option>
                                                    ))}
                                                </select>
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div ref={props.setWrapperRef} className="text-white">
                                        <div
                                            className="d-md-flex position-relative user-inputs">
                                            <div className="form-group animated align-items-center">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder={t(props.labnuage?.layout?.profile_placeholder1_nt)}
                                                    value={props.user.first_name}
                                                    onChange={(e) => props.updateName("first_name", e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group animated align-items-center ml-md-3 mt-2 mt-md-0">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder={t(props.language?.layout?.profile_placeholder2_nt)}
                                                    value={props.user.last_name}
                                                    onChange={(e) => props.updateName("last_name", e.target.value)}
                                                />
                                            </div>
                                            {props.user.first_name ? (
                                                <div className="buttons text-right">
                                                    <button
                                                        type="button"
                                                        className="icon-invert btn btn-primary rounded-0"
                                                        onClick={() => saveFullName(props.user.first_name)}>
                                                        <img
                                                            src="/svgs/icons_new/check-circle.svg"
                                                            className={`svg-sm mt-1 invert-color ${props.user.first_name ? "" : "svg-disabled"
                                                                }`}
                                                            title={t(props.language?.layout?.ep_setting_cd_save)}
                                                            alt="save"
                                                        />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="icon-invert btn btn-primary rounded-0"
                                                        onClick={(e) => props.validateUserName(e)}>
                                                        <img
                                                            src="/svgs/icons_new/x-circle.svg"
                                                            className="svg-sm mt-1 invert-color"
                                                            title={t(props.language?.layout?.all_close_nt)}
                                                            alt="close"
                                                        />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="icon-invert bg-warning position-absolute py-1 px-2"
                                                    style={{ top: ".25rem", left: "28rem" }}
                                                    role="alert">
                                                    <img
                                                        src="/svgs/icons_new/alert-circle.svg"
                                                        className="svg-sm mr-1 invert-color"
                                                        title={t(props.language?.layout?.all_close_nt)}
                                                        alt="close"
                                                    />
                                                    {t(props.language?.layout?.profile_mandatory_nt)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="row profile_header">
                                    <div className="col-12 col-md-12 col-lg-4 py-2 py-lg-0">
                                        <div class="d-flex align-items-center mt-md-2">
                                            <p class="icon-invert my-0">
                                                <img
                                                    src="/svgs/icons_new/mail.svg"
                                                    class="svg-sm mr-2 mb-0 invert-color"
                                                    alt="mail"
                                                />
                                            </p>
                                            <div class="pl-2 pr-2 pb-0 mb-0 h6">
                                                {props.user.email != null ? props.user.email : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-3 py-2 py-lg-0">
                                        <div class="d-flex align-items-center mx-auto">
                                            {props.edit_item !== "phone" ? (
                                                <Fragment>
                                                    <p class="icon-invert my-0">
                                                        <img
                                                            src="/svgs/icons_new/phone.svg"
                                                            class="svg-sm mr-2 mb-0 invert-color"
                                                            alt="phone"
                                                        />
                                                    </p>
                                                    <div class="pl-2 pr-2 pb-0 mb-0 h6">
                                                        {props.user.phone !== "" && props.user.phone !== null
                                                            ? props.user.phone
                                                            : t(props.language?.layout?.profile_nocontact_nt)}
                                                    </div>
                                                    {props.profile ? (
                                                        <button
                                                            type="button"
                                                            className={`btn_primary icon-invert btn btn-primary rounded-0 ${props.isPreviewMode ? "invisible" : ""
                                                                }`}
                                                            onClick={(e) => props.setEditItem("phone")}>
                                                            <img
                                                                src="/svgs/icons_new/edit-2.svg"
                                                                className="svg-xs mb-1 invert-color"
                                                                title={t(props.language?.layout?.all_edit_nt)}
                                                                alt="edit"
                                                            />
                                                        </button>
                                                    ) : (
                                                        ""
                                                    )}
                                                </Fragment>
                                            ) : (
                                                " "
                                            )}

                                            {props.profile && props.edit_item === "phone" ? (
                                                <div ref={props.setWrapperRef} className="text-white mt-n1">
                                                    <div className="d-flex align-items-center">
                                                        <p className="icon-invert my-0">
                                                            <img
                                                                src="/svgs/icons_new/phone.svg"
                                                                className="svg-sm mr-2 invert-color"
                                                                alt="phone"
                                                            />
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
                                                                placeholder={t(props.language?.layout?.profile_phoneno_nt)}
                                                                value={props.user.phone != null ? props.user.phone : ""}
                                                                onChange={(e) =>
                                                                    props.updateName(
                                                                        "phone",
                                                                        Math.max(0, parseInt(e.target.value, 10))
                                                                            .toString()
                                                                            .slice(0, 10)
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="icon-invert btn btn-primary btn_primary rounded-0"
                                                            onClick={() => savePhoneNumber()}>
                                                            <img
                                                                src="/svgs/icons_new/check-circle.svg"
                                                                className="svg-sm invert-color"
                                                                title={t(props.language?.layout?.ep_setting_cd_save)}
                                                                alt="save"
                                                            />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="icon-invert btn btn-primary rounded-0"
                                                            onClick={(e) => props.validateUserName(e)}>
                                                            <img
                                                                src="/svgs/icons_new/x-circle.svg"
                                                                className="svg-sm invert-color"
                                                                title={t(props.language?.layout?.all_close_nt)}
                                                                alt="close"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-3">
                                        {props.edit_item !== "location" ? (
                                            <div class="d-flex align-items-center">
                                                <p class="icon-invert mt-0 mb-0">
                                                    <img
                                                        alt="location"
                                                        src="/svgs/icons_new/map-pin.svg"
                                                        class="svg-sm mr-2 mb-0 invert-color"
                                                    />
                                                </p>
                                                <div class="pl-2 pr-2 pb-0 mb-0 h6">
                                                    {props.user.city !== "" && props.user.city !== null
                                                        ? props.user.city + ", " + props.user.state
                                                        : t(props.language?.layout?.sp_viewseeker_locationnot)}
                                                </div>
                                                {props.profile ? (
                                                    <button
                                                        type="button"
                                                        className={`icon-invert btn btn-primary rounded-0 d-print-none ${props.isPreviewMode ? "invisible" : ""
                                                            }`}
                                                        onClick={(e) => props.setEditItem("location")}>
                                                        <img
                                                            src="/svgs/icons_new/edit-2.svg"
                                                            className="svg-xs mb-1 invert-color"
                                                            title={t(props.language?.layout?.all_edit_nt)}
                                                            alt="edit"
                                                        />
                                                    </button>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        ) : (
                                            " "
                                        )}
                                        {props.edit_item === "location" ? (
                                            <div ref={props.setWrapperRef} className="text-white mt-n1">
                                                <div className="d-flex align-items-center col-mb-3">
                                                    <p class="icon-invert mt-0 mb-0">
                                                        <img
                                                            src="/svgs/icons_new/map-pin.svg"
                                                            class="svg-sm mr-2 mb-0 invert-color"
                                                            alt="location"
                                                        />
                                                    </p>
                                                    <div className="form-group animated ml-1">
                                                        <LocationSearchInput
                                                            setLocationCity={setLocationCity}
                                                            locationsJSON={locationsJSON}
                                                            setLocation={setLocation}
                                                            city_aligment={true}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn icon-invert btn-primary rounded-0"
                                                        onClick={(e) =>
                                                            props.saveProfileDetails(
                                                                { location: userLocation },
                                                                props.user.availability_id
                                                            )
                                                        }>
                                                        <img
                                                            src="/svgs/icons_new/check-circle.svg"
                                                            className="svg-sm mt-1 invert-color"
                                                            title={t(props.language?.layout?.ep_setting_cd_save)}
                                                            alt="save"
                                                        />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn icon-invert btn-primary rounded-0"
                                                        onClick={(e) => props.validateUserName(e)}>
                                                        <img
                                                            src="/svgs/icons_new/x-circle.svg"
                                                            className="svg-sm mt-1 invert-color"
                                                            title={t(props.language?.layout?.all_close_nt)}
                                                            alt="close"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="col-12 col-md-6 ml-auto col-lg-2 mt-md-n5 mt-3 mt-lg-0">
                                        <div class="d-flex profile-input-height mt-md-n3 mb-3">
                                            {props.profile ? (
                                                <div className="d-flex ml-auto mt-md-n2">
                                                    <SocialLinks
                                                        saveProfileDetails={props.saveProfileDetails}
                                                        id={props.user.availability_id}
                                                        linkedin_link={props.user.linkedin_link}
                                                        facebook_link={props.user.facebook_link}
                                                        blog_link={props.user.blog_link}
                                                    />
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps)(UserProfileHeader);
