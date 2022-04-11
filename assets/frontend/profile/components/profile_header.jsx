import React, { useState, useEffect, useRef, Fragment } from "react";
// import { applicationStatus } from "../../components/constants.jsx";
import JobAssign from "../../user/jobAssign.jsx";
import ReactCropper from "../../components/image_cropper.jsx";
import { connect } from "react-redux";
import InviteCandidate from "../../user/inviteCandidate.jsx";
import { toast } from "react-toastify";
import LocationSearchInput from "../../common/locations.jsx";
import { validate, res } from "react-email-validator";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useOuterClick } from "../../modules/helpers.jsx";
import { jobstage } from "../../../translations/helper_translation.jsx";

const ProfileHeader = (props) => {
    const { t } = useTranslation();
    const locationsJSON = {
        country: false,
        state: false,
        city: true,
    };

    const [invitemodal, setInviteModal] = useState(false);
    const [modalOpen, setmodalOpen] = useState(false);
    const [initialUserData, setInitialUserData] = useState([]);
    const [userLocation, setUserLocation] = useState({});
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [moreOptions, setMoreOptions] = useState(false);
    const insideClickRef = useRef(null);

    const [user, setUser] = useState({
        id: null,
        email: "",
        first_name: null,
        last_name: null,
        image: null,
        phone: null,
        location: null,
    });
    const applicationStatus = [
        { key: "applied", value: t(props.language?.layout?.ep_applicationstatus_applied) },
        { key: "screening", value: t(props.language?.layout?.ep_applicationstatus_screening) },
        { key: "interview", value: t(props.language?.layout?.ep_applicationstatus_interview) },
        { key: "offered", value: t(props.language?.layout?.ep_applicationstatus_offered) },
        { key: "hired", value: t(props.language?.layout?.ep_applicationstatus_hired) },
        { key: "declined", value: t(props.language?.layout?.ep_applicationstatus_declined) },
        { key: "on-hold", value: t(props.language?.layout?.ep_applicationstatus_onhold) },
        { key: "rejected", value: t(props.language?.layout?.ep_applicationstatus_rejected) },
        { key: "withdrawn", value: t(props.language?.layout?.ep_applicationstatus_withdrawn) },
    ]
    useEffect(() => {
        setUser(props.user);
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, [props.user]);

    const [edit_item, setEditItemValue] = useState(null);

    const handleClickOutside = (e) => {
        if (insideClickRef.current && !insideClickRef.current.contains(e.target)) {
            setEditItemValue(null);
            closeDeleteHandler();
        }
    };

    const change = (event) => {
        props.updateStatus(event.target.value, props.applicationId);
    };

    const setEditItem = (value) => {
        setEditItemValue(value);
    };

    const updateName = (e) => {
        if (e.target.name === "phone") {
            var phonenum = Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 10);
            setUser({ ...user, [e.target.name]: phonenum });
        } else if (e.target.name === "email") {
            setUser({ ...user, [e.target.name]: e.target.value });
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const saveFullName = (fullName) => {
        // console.log(fullName)
        if (fullName) {
            props.saveProfileDetails({ profile: user }, props.user.availability_id);
            setEditItemValue(null);
        }
    };

    const savePhoneNumber = () => {
        if (!user.phone.length || user.phone.length !== 10) {
            toast.error("Please enter your valid phone number.");
        } else {
            props.saveProfileDetails({ profile: { phone: user.phone } }, props.user.availability_id);
            setEditItemValue(null);
        }
        return;
    };

    const saveLocationDetails = () => {
        props.saveProfileDetails({ location: userLocation }, props.user.availability_id);
        setEditItemValue(null);
    };

    const closeModal = () => {
        setmodalOpen(false);
    };

    const closeDeleteHandler = () => {
        setUser(props.user);
        setEditItemValue(null);
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
        // console.log(location)
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

    const candidateDropdown = useOuterClick((ev) => {
        if (moreOptions == true) {
            setMoreOptions(false);
        }
    });
    const jobStageHandler = (language, key) => {
        return (jobstage[language][key]);
    }

    return (
        <div class="d-lg-flex gray-100 h-7rem pt-4 pb-md-3">
            <div className="col-lg-3">
                <div class="pb-2 d-flex justify-content-center">
                    {props.user.image ? (
                        <div>
                            <div className="candidate-profileWrap">
                                <img src={props.user.image} className="candidate-profile-image" alt={t(props.language?.layout?.userimage_nt)} />
                            </div>
                            {props.candidate ? (
                                <div className="text-center">
                                    <img
                                        src="/svgs/icons_new/camera.svg"
                                        alt="Upload profile image"
                                        class="svg-md pointer px-1 position-relative bg-white rounded-circle"
                                        onClick={() => setmodalOpen(true)}
                                        style={{ top: "-40px", left: "58px" }}
                                    />
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    ) : (
                        // <img src="/images/dummy.jpg" className="candidate-profile-image" alt="User image" />
                        <div>
                            <div
                                className="rounded-circle mx-auto d-flex align-items-center text-capitalize  justify-content-center mt-1"
                                style={{ width: "8rem", height: "8rem", backgroundColor: "#80808029" }}>
                                {(props.user.first_name == null || props.user.first_name == "") &&
                                    (props.user.last_name == null || props.user.last_name == "") ? (
                                    props.user.username == null || props.user.username == "" ? (
                                        " "
                                    ) : (
                                        props.user.username.charAt(0)
                                    )
                                ) : (
                                    <span>
                                        {props.user.first_name != null && props.user.first_name.charAt(0)}&nbsp;
                                        {props.user.last_name != null && props.user.last_name.charAt(0)}
                                    </span>
                                )}
                            </div>
                            {props.candidate ? (
                                <div className="text-center">
                                    <img
                                        src="/svgs/icons_new/camera.svg"
                                        class="svg-md pointer px-1 position-relative bg-white rounded-circle"
                                        onClick={() => setmodalOpen(true)}
                                        style={{ top: "-35px", left: "48px" }}
                                        alt="Upload profile image"
                                    />
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    )}
                    <ReactCropper
                        openM={modalOpen}
                        closeModal={closeModal}
                        getData={props.getData}
                        userImage={props.user.image}
                        changeImageUploadingStatus={props.changeImageUploadingStatus}
                        availability_id={props.user.availability_id}
                    />
                </div>
            </div>
            <div class="col-lg-7">
                {edit_item != "name" ? (
                    <div class="d-flex align-items-top mb-3 mb-md-0">
                        <h2 class="userName text-capitalize">
                            {props.user.first_name != null ? props.user.first_name : ""}{" "}
                            {props.user.last_name !== null ? props.user.last_name : ""}
                            {props.candidate && props.user.first_name == null && props.user.last_name == null ? (
                                <small>
                                    <i>{t(props.language?.layout?.profile_providename_nt)}</i>
                                </small>
                            ) : (
                                ""
                            )}
                        </h2>

                        {props.candidate ? (
                            <button
                                className="btn icon-invert btn btn-light rounded-0 pt-0"
                                type="button"
                                onClick={(e) => setEditItem("name")}>
                                <img src="/svgs/icons_new/edit-2.svg" className="svg-xs mb-1" title={t(props.language?.layout?.all_edit_nt)} />
                            </button>
                        ) : (
                            <Fragment>
                                {props?.userData?.role_id === 2 || props?.userData?.role_id === 5 ? (
                                    <p
                                        className="ml-3 px-2 text-capitalize"
                                        style={
                                            props.status == "applied"
                                                ? props.theme.all_color
                                                : props.status == "screening"
                                                    ? props.theme.screening_color
                                                    : props.status == "interview"
                                                        ? props.theme.interview_color
                                                        : props.status == "offered"
                                                            ? props.theme.offer_color
                                                            : props.status == "withdrawn"
                                                                ? props.theme.closed_color
                                                                : props.status == "hired"
                                                                    ? props.theme.active_color
                                                                    : props.status == "declined"
                                                                        ? props.theme.closed_color
                                                                        : props.status == "on-hold"
                                                                            ? props.theme.paused_color
                                                                            : props.theme.all_color
                                        }>
                                        {jobStageHandler(props?.languageName, props?.status)}
                                    </p>
                                ) : (
                                    <p className="ml-3 ">
                                        <select aria-label="State"
                                            className="border-0 btn-sm py-0 text-capitalize"
                                            onChange={change}
                                            style={
                                                props.status == "applied"
                                                    ? props.theme.all_color
                                                    : props.status == "screening"
                                                        ? props.theme.screening_color
                                                        : props.status == "interview"
                                                            ? props.theme.interview_color
                                                            : props.status == "offered"
                                                                ? props.theme.offer_color
                                                                : props.status == "withdrawn"
                                                                    ? props.theme.closed_color
                                                                    : props.status == "hired"
                                                                        ? props.theme.active_color
                                                                        : props.status == "declined"
                                                                            ? props.theme.closed_color
                                                                            : props.status == "on-hold"
                                                                                ? props.theme.paused_color
                                                                                : props.theme.all_color
                                            }
                                            value={props.status}>
                                            {applicationStatus.map((filter, key) => (
                                                <option className="bg-white" key={filter.key} value={filter.key}>
                                                    {filter.value}
                                                </option>
                                            ))}
                                        </select>
                                    </p>
                                )}
                            </Fragment>
                        )}
                        {props.candidate && process.env.CLIENT_NAME === "cc" ?
                            <div ref={candidateDropdown} class="candidate dropdown bg-light" tabIndex="0">
                                <img src="/svgs/icons_new/more-vertical.svg" class="svg-xs pointer" alt="more" onClick={() => setMoreOptions(!moreOptions)} />
                                <div
                                    class={`dropdown-menu rounded-0" ${moreOptions ? "show" : ""}`} style={{ top: "-11px", left: "23px" }}>
                                    <Link class="dropdown-item p-2" onClick={() => setDeleteConfirmation(true)}>
                                        {props.archive ? t(props.language?.layout?.all_unarchive_nt) : t(props.language?.layout?.all_archive_nt)}
                                    </Link>
                                </div>
                            </div> : ""}
                    </div>
                ) : (
                    <div ref={insideClickRef} className="text-white">
                        <div className="d-md-flex position-relative user-inputs">
                            <div className="form-group animated align-items-center">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t(props.language?.layout?.profile_placeholder1_nt)}
                                    name="first_name"
                                    value={user.first_name}
                                    onChange={(e) => updateName(e)}
                                />
                            </div>
                            <div className="form-group animated align-items-center ml-md-3 mt-2 mt-md-0">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t(props.language?.layout?.profile_placeholder2_nt)}
                                    name="last_name"
                                    value={user.last_name}
                                    onChange={(e) => updateName(e)}
                                />
                            </div>
                            {user.first_name ? (
                                <div className="buttons text-right">
                                    <button
                                        type="button"
                                        className="btn icon-invert  btn btn-light rounded-0"
                                        onClick={() => {
                                            saveFullName(user.first_name, user.last_name == null ? "" : (user.last_name));
                                        }}>
                                        <img
                                            src="/svgs/icons_new/check-circle.svg"
                                            className="svg-sm mt-1"
                                            title={t(props.language?.layout?.ep_setting_cd_save)}
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        className="btn icon-invert btn btn-light rounded-0"
                                        onClick={() => closeDeleteHandler()}>
                                        <img src="/svgs/icons_new/x-circle.svg" className="svg-sm mt-1" title={t(props.language?.layout?.all_close_nt)} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="bg-warning icon-invert position-absolute py-1 px-2"
                                    style={{ top: ".25rem", left: "28rem" }}
                                    role="alert">
                                    <img src="/svgs/icons_new/alert-circle.svg" className="svg-sm mr-1" title={t(props.language?.layout?.all_close_nt)} />
                                    {t(props.language?.layout?.profile_mandatory_nt)}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div class="d-lg-flex align-items-center profile-input-height mt-lg-n2 my-md-4">
                    {edit_item !== "email" ? (
                        <div class="d-flex">
                            <p class="icon-invert mt-0 mb-0">
                                <img src="/svgs/icons_new/mail.svg" class="svg-sm mr-2 mb-0" alt="Email" />
                            </p>
                            {/* {user.is_active == false ?
                                "" : */}
                            <div class="pl-2 pr-2 pb-0 mb-0 h6">
                                {props.user.email !== "" && props.user.email !== null
                                    ? props.user.email
                                    : t(props.language?.layout?.profile_email_nt)}
                            </div>
                            {/* } */}
                        </div>
                    ) : (
                        " "
                    )}
                    {props.candidate && edit_item === "email" ? (
                        <div ref={insideClickRef} className="text-white mt-2">
                            <div className="d-flex align-items-center mb-3 icon-invert">
                                <p class="mt-0 mb-0 icon-invert">
                                    <img src="/svgs/icons_new/mail.svg" class="svg-sm mr-2 mb-0" />
                                </p>
                                <div className="form-group animated ">
                                    <input
                                        type="text"
                                        className="form-control ml-1"
                                        placeholder="Email"
                                        name="email"
                                        value={user.email != null ? user.email : ""}
                                        onChange={(e) => updateName(e)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn icon-invert btn btn-light rounded-0"
                                    onClick={(e) => savevalidateEmail(e)}>
                                    <img src="/svgs/icons_new/check-circle.svg" className="svg-sm mt-1" title={t(props.language?.layout?.ep_setting_cd_save)} />
                                </button>
                                <button
                                    type="button"
                                    className="btn icon-invert btn btn-light rounded-0"
                                    onClick={() => closeDeleteHandler()}>
                                    <img src="/svgs/icons_new/x-circle.svg" className="svg-sm" title={t(props.language?.layout?.all_close_nt)} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}

                    <div class="d-flex mx-auto py-2">
                        {edit_item !== "phone" ? (
                            <Fragment
                            >
                                <p class="icon-invert mt-0 mb-0">
                                    <img src="/svgs/icons_new/phone.svg" class="svg-sm mr-2 mb-0" alt="phone" />
                                </p>
                                {/* {user.is_active == false ?
                                    "" : */}
                                <div class="pl-2 pr-2 pb-0 mb-0 h6">
                                    {props.user.phone !== "" && props.user.phone !== null
                                        ? props.user.phone
                                        : t(props.language?.layout?.profile_nocontact_nt)}
                                </div>
                                {/* } */}
                                {props.candidate ? (
                                    <button
                                        type="button"
                                        className="btn icon-invert btn btn-light rounded-0 p-0"
                                        onClick={(e) => setEditItem("phone")}>
                                        <img src="/svgs/icons_new/edit-2.svg" className="svg-xs mb-1" title={t(props.language?.layout?.all_edit_nt)} />
                                    </button>
                                ) : (
                                    ""
                                )}
                            </Fragment>
                        ) : (
                            " "
                        )}

                        {props.candidate && edit_item === "phone" ? (
                            <div ref={insideClickRef} className="text-white mt-2">
                                <div className="d-flex align-items-center">
                                    <p className="icon-invert mt-2">
                                        <img src="/svgs/icons_new/phone.svg" className="svg-sm" alt="phone" />
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
                                            placeholder={t(props.language?.layout?.profile_phoneno_nt)}
                                            value={user.phone != null ? user.phone : ""}
                                            onChange={(e) => updateName(e)}
                                        />

                                    </div>
                                    <button
                                        type="button"
                                        className="btn icon-invert  btn btn-light rounded-0"
                                        onClick={() => savePhoneNumber()}>
                                        <img src="/svgs/icons_new/check-circle.svg" className="svg-sm" title={t(props.language?.layout?.ep_setting_cd_save)} />
                                    </button>
                                    <button
                                        type="button"
                                        className="btn  icon-invert btn btn-light rounded-0"
                                        onClick={() => closeDeleteHandler()}>
                                        <img src="/svgs/icons_new/x-circle.svg" className="svg-sm" title={t(props.language?.layout?.all_close_nt)} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>

                    {edit_item !== "location" ? (
                        <div class="d-flex">
                            <p class="icon-invert my-0">
                                <img src="/svgs/icons_new/map-pin.svg" class="svg-sm mr-2 mb-0" alt="location" />
                            </p>
                            <div class="pl-2 pr-2 pb-0 mb-0 h6">
                                {user.city !== "" && user.city !== null
                                    ? user.city + ", " + user.state
                                    : t(props.language?.layout?.sp_viewseeker_locationnot)}
                            </div>
                            {props.candidate ? (
                                <button
                                    type="button"
                                    className="btn  icon-invert btn btn-light rounded-0 p-0"
                                    onClick={(e) => setEditItem("location")}>
                                    <img src="/svgs/icons_new/edit-2.svg" className="svg-xs mb-1" title={t(props.language?.layout?.all_edit_nt)} />
                                </button>
                            ) : (
                                ""
                            )}
                        </div>
                    ) : (
                        " "
                    )}
                    {edit_item === "location" ? (
                        <div ref={insideClickRef} className="text-white mt-2">
                            <div className="d-flex align-items-center col-mb-3">
                                <p class="icon-invert my-0">
                                    <img src="/svgs/icons_new/map-pin.svg" class="svg-sm mr-2 mb-0" alt="location" />
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
                                    className="btn  icon-invert btn btn-light rounded-0"
                                    onClick={(e) => saveLocationDetails()}>
                                    <img src="/svgs/icons_new/check-circle.svg" className="svg-sm mt-1" title={t(props.language?.layout?.ep_setting_cd_save)} />
                                </button>
                                <button
                                    type="button"
                                    className="btn  icon-invert btn btn-light rounded-0"
                                    onClick={(e) => setEditItem(null)}>
                                    <img src="/svgs/icons_new/x-circle.svg" className="svg-sm mt-1" title={t(props.language?.layout?.all_close_nt)} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div >
            <div className="col-lg-2">
                <div className="p-0 text-md-right mt-md-4 mt-5 pt-2">
                    {props.candidate ? (
                        <div>
                            <button onClick={() => setInviteModal(true)} className="btn btn-primary brand-color p-lg-2">
                                {t(props.language?.layout?.sp_viewseeker_invitejs)}
                            </button>
                        </div>
                    ) : (
                        ""
                    )}

                    <Modal show={deleteConfirmation} onHide={() => setDeleteConfirmation(false)} size={"md"} centered>
                        <div className="modal-content">
                            <div className="modal-header border-0 px-4">
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title={t(props.language?.layout?.all_close_nt)}
                                    onClick={() => setDeleteConfirmation(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center px-4">
                                <h5>{t(props.language?.layout?.all_sure_nt)} {props.archive ? t(props.language?.layout?.all_unarchive_nt) : t(props.language?.layout?.all_archive_nt)}?</h5>
                                <div className="text-center my-3">
                                    <button className="btn btn-outline-primary mr-3" onClick={() => setDeleteConfirmation(false)}>{t(props.language?.layout?.no_nt)}</button>
                                    {props.archive ?
                                        <button className="btn btn-primary" onClick={() => { props.deleteJobSeeker(); setDeleteConfirmation(false) }}>&nbsp;{t(props.language?.layout?.all_yes_nt)}&nbsp;</button>
                                        :
                                        <button className="btn btn-primary" onClick={() => { props.unArchiveUser(); setDeleteConfirmation(false) }}>&nbsp;{t(props.language?.layout?.all_yes_nt)}&nbsp;</button>}
                                </div>
                            </div>
                        </div>
                    </Modal>

                    <InviteCandidate
                        showinviteModal={invitemodal}
                        closeinviteModal={() => setInviteModal(false)}
                        userId={props.user.id}
                    />
                </div>
            </div>
        </div >
    );
};

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userData: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(ProfileHeader);
