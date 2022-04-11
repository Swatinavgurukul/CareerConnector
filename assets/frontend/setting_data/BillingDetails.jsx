import React, { useState, useEffect, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { validate, res } from "react-email-validator";
import axios from "axios";
import DataNotFound from "../partials/data404.jsx";
import LocationSearchInput from "../common/locations.jsx";
import DeleteConfirmation from "../profile/components/delete_confirmation.jsx";
import ReactCropper from "../components/image_cropper.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";


const BillingDetails = (props) => {
    const { t } = useTranslation();
    const [browseValue, setBrowseValue] = useState("Choose File");
    const [errormessage, setErrorMessage] = useState(false);
    const [userLocation, setUserLocation] = useState({});
    const [modalOpen, setmodalOpen] = useState(false);
    const [isLocation, setIsLocation] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [loading, setLoading] = useState(0);
    const [img_delete_confirm_modal, setImg_delete_confirm_modal] = useState(false);
    const [crop, setCrop] = useState({
        unit: "%",
        x: 10,
        y: 10,
        width: 40,
        height: 30,
        aspect: 0,
    })
    let history = useHistory();
    const [details, setDetails] = useState({
        name: "",
        b_address: "",
        area_code: "",
        b_area_code: "",
        phone: "",
        alt_phone: "",
        b_title: "",
        b_first_name: "",
        b_last_name: "",
        b_email: "",
        b_phone: "",
        b_phone_sec: "",
        city: "",
        state: "",
        country: ""
    });

    const logohangler = () => {
        setmodalOpen(true);
    };

    const changeImageUploadingStatus = (status) => {
        setIsImageUploading(status);
    };
    const closeModal = () => {
        setmodalOpen(false);
    };

    const loadingSet = (num) => {
        setLoading(num);
        changeImageUploadingStatus();
    };

    const statusDeleteConfirmModal = (status) => {
        setImg_delete_confirm_modal(status);
    };

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios
            .get("api/v1/onboardingdetails", {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                setDetails(response.data && response.data.data[0]);
                setIsLocation(true);
            })
            .catch((error) => {
                if (error.response.status == 404) {
                    setErrorMessage(true);
                }
            });
    };

    const onInputChange = (e) => {
        if (e.target.name === "phone" || e.target.name === "b_phone") {
            var phonenum = Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 10);
            setDetails({ ...details, [e.target.name]: phonenum });
        } else if (e.target.name === "alt_phone" || e.target.name === "b_phone_sec") {
            var altphonenum = Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 10);
            setDetails({ ...details, [e.target.name]: altphonenum === "NaN" ? "" : altphonenum });
        } else {
            setDetails({ ...details, [e.target.name]: e.target.value });
        }
    };

    const deleteImage = () => {
        axios
            .delete(`api/v1/onboard/companylogo`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((response) => {
                getData();
                statusDeleteConfirmModal(false);
                setLoading(0);
                toast.success(t(props.language?.layout?.toast92_nt));
            })
            .catch((error) => { });
    };

    const saveDetails = () => {
        let formData = new FormData();
        formData.append("email", details.email);
        formData.append("city", details.city);
        formData.append("state", details.state);
        formData.append("country", details.country);
        formData.append("phone", details.phone);
        formData.append("name", details.name);
        formData.append("b_title", details.b_title);
        formData.append("b_first_name", details.b_first_name);
        formData.append("b_last_name", details.b_last_name);
        formData.append("b_phone", details.b_phone);
        formData.append("b_phone_sec", details.b_phone_sec);
        formData.append("b_email", details.b_email);
        formData.append("b_address", details.b_address);
        formData.append("area_code", details.area_code);
        formData.append("b_area_code", details.b_area_code);

        if (
            !details.name ||
            !details.b_address ||
            !details.area_code ||
            !details.b_area_code ||
            !details.phone ||
            !details.b_first_name ||
            !details.b_last_name ||
            !details.b_email ||
            !details.b_phone
        ) {
            console.log(details);
            toast.error(t(props.language?.layout?.toast30_nt));
            return false;
        }
        if ((details.phone && details.phone.length !== 10) || (details.b_phone && details.b_phone.length !== 10)) {
            toast.error(t(props.language?.layout?.toast79_nt));
            return;
        }
        // if (
        //     (details.alt_phone && details.alt_phone.length !== 10) ||
        //     (details.b_phone_sec && details.b_phone_sec.length !== 10)
        // ) {
        //     toast.error("Please enter valid alternate phone number");
        //     return;
        // }
        if (!details.city || details.city === undefined) {
            toast.error(t(props.language?.layout?.toast93_nt));
            return;
        }
        if (!details.b_email) {
            toast.error(t(props.language?.layout?.toast94_nt));
            return;
        }
        validate(details.b_email);
        if (!res) {
            toast.error(t(props.language?.layout?.toast83_nt));
            return;
        }
        // if (image && !isValidFileType(image.name)) {
        //     toast.error("Please choose .png, .jpg, .jpeg image");
        //     return;
        // }

        axios
            .put(`/api/v1/onboarding`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((response) => {
                if (response.data.status === 200) {
                    toast.success(t(props.language?.layout?.toast95_nt));
                }
                getData();
            })
            .catch((error) => {
                if (error) {
                    toast.error(t(props.language?.layout?.toast91_nt));
                }
            });
    };

    const setLocationCity = (data, city, locationCity, plcaeId) => {
        let location = {};
        location.city = city[0];
        location.state = city[1];
        location.country = city[2];
        setDetails({ ...details, city: city[0], state: city[1], country: city[2] });
    };
    const locationsJSON = {
        country: false,
        state: false,
        city: true,
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

    const locationChange = (value) => {
        setDetails({ ...details, city: value, state: "" });
    }

    const onCrop = (value) => {
        setCrop(value);
    }

    return (
        <div>
            {errormessage && !details.length ? (
                <DataNotFound />
            ) : (
                <Fragment>
                    <div className="row mt-3">
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="companyName">
                                            {t(props.language?.layout?.ep_setting_cd_companyname)} *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="companyName"
                                            name="name"
                                            value={details.name}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="b_address">
                                            {t(props.language?.layout?.ep_setting_cd_address)} *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="b_address"
                                            name="b_address"
                                            value={details.b_address}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3 col-md-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted z-index4" for="phone">
                                            {t(props.language?.layout?.ep_setting_cd_city)} *
                                        </label>
                                        <LocationSearchInput
                                            setLocationCity={setLocationCity}
                                            locationsJSON={locationsJSON}
                                            setLocation={setLocation}
                                            city_aligment={true}
                                            displayValue={true}
                                            value={
                                                details.state == undefined
                                                    ? `${details.city}`
                                                    : `${details.city}${details.state !== "" ? "," + details.state : details.state
                                                    }`
                                            }
                                            isLocation={isLocation}
                                            locationChange={locationChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="area-code">
                                            {t(props.language?.layout?.ep_setting_cd_areacode)} *
                                        </label>
                                        <select
                                            className="form-control"
                                            aria-label="country"
                                            value={details.area_code}
                                            name="area_code"
                                            onChange={(e) => onInputChange(e)}>
                                            <option selected="" className="d-none">
                                                {t(props.language?.layout?.employer_signup_select)}
                                            </option>
                                            <option value="USA +1">
                                                {t(props.language?.layout?.employer_signup_selectoption_usa)}
                                            </option>
                                            <option value="Canada +1">
                                                Canada +1
                                            </option>
                                            <option value="Australia +61" disabled>
                                                {t(props.language?.layout?.employer_signup_selectoption_australia)}
                                            </option>
                                            <option value="Brazil +55" disabled>
                                                {t(props.language?.layout?.employer_signup_selectoption_brazil)}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="phone">
                                            {t(props.language?.layout?.ep_setting_cd_phone)} *
                                        </label>
                                        <input
                                            aria-label="Phone"
                                            type="number"
                                            className="form-control"
                                            minlength="10"
                                            maxlength="10"
                                            required
                                            pattern="[0-9]{10}"
                                            name="phone"
                                            id="phone1"
                                            value={details.phone}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="phone">
                                            {t(props.language?.layout?.ep_setting_cd_altphone)}
                                        </label>
                                        <input
                                            aria-label="AltPhone"
                                            type="number"
                                            className="form-control"
                                            minlength="10"
                                            maxlength="10"
                                            required
                                            pattern="[0-9]{10}"
                                            name="alt_phone"
                                            id="alt_phone1"
                                            value={details.alt_phone}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="com_email">
                                            {t(props.language?.layout?.ep_setting_cd_email)}
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="com_email"
                                            name="email"
                                            readOnly
                                            value={details.email}
                                        />
                                    </div>
                                </div>
                            </div>
                            <h4 className="mt-4"> {t(props.language?.layout?.ep_setting_cd_billingdetails)}</h4>
                            <div className="row">
                                <div className="col-lg-2 col-md-3">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="jobtitle">
                                            {t(props.language?.layout?.ep_setting_cd_title)}
                                        </label>

                                        <select
                                            className="form-control"
                                            aria-label="country"
                                            name="b_title"
                                            value={details.b_title}
                                            onChange={(e) => onInputChange(e)}>
                                            <option selected="" className="d-none">
                                                {t(props.language?.layout?.employer_signup_select)}
                                            </option>
                                            <option value="mr">
                                                {t(props.language?.layout?.employer_signup_selectoption_mr)}
                                            </option>
                                            <option value="mrs">
                                                {t(props.language?.layout?.employer_signup_selectoption_ms)}
                                            </option>
                                            <option value="mrs">
                                                {t(props.language?.layout?.employer_signup_selectoption_mrs)}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="firstname">
                                            {t(props.language?.layout?.ep_setting_cd_firstname)} *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstname"
                                            name="b_first_name"
                                            value={details.b_first_name}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-5">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="lastname">
                                            {t(props.language?.layout?.ep_setting_cd_lastname)} *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastname"
                                            name="b_last_name"
                                            value={details.b_last_name}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3 col-md-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="area-code">
                                            {t(props.language?.layout?.ep_setting_cd_areacode)} *
                                        </label>
                                        <select
                                            className="form-control"
                                            aria-label="country"
                                            name="b_area_code"
                                            onChange={(e) => onInputChange(e)}
                                            value={details.b_area_code}>
                                            <option selected="" className="d-none">
                                                {t(props.language?.layout?.employer_signup_select)}
                                            </option>
                                            <option value="USA +1">
                                                {t(props.language?.layout?.employer_signup_selectoption_usa)}
                                            </option>
                                            <option value="Canada +1">
                                                Canada +1
                                            </option>
                                            <option value="Australia +61" disabled>
                                                {t(props.language?.layout?.employer_signup_selectoption_australia)}
                                            </option>
                                            <option value="Brazil +55" disabled>
                                                {t(props.language?.layout?.employer_signup_selectoption_brazil)}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="phone">
                                            {t(props.language?.layout?.ep_setting_cd_phone)} *
                                        </label>

                                        <input
                                            aria-label="Phone1"
                                            type="number"
                                            className="form-control"
                                            minlength="10"
                                            maxlength="10"
                                            required
                                            pattern="[0-9]{10}"
                                            name="b_phone"
                                            id="b_phone1"
                                            value={details.b_phone}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="phone">
                                            {t(props.language?.layout?.ep_setting_cd_altphone)}
                                        </label>

                                        <input
                                            aria-label="AltPhone1"
                                            type="number"
                                            className="form-control"
                                            minlength="10"
                                            maxlength="10"
                                            required
                                            pattern="[0-9]{10}"
                                            name="b_phone_sec"
                                            id="b_phone_sec1"
                                            value={details.b_phone_sec}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-md-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-muted" for="b_email">
                                            {t(props.language?.layout?.ep_setting_cd_email)}*
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="b_email"
                                            name="b_email"
                                            value={details.b_email}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-5 mb-4">
                                <div>
                                    {/* onClick={() => { history.push("/") }} */}
                                    <button className="btn btn-outline-secondary btn-md px-4 px-md-5 mr-4">
                                        {t(props.language?.layout?.ep_setting_cd_cancel)}
                                    </button>
                                    <button className="btn btn-primary btn-md px-5" onClick={saveDetails}>
                                        {t(props.language?.layout?.ep_setting_cd_save)}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mt-2 px-2 pt-4 mx-auto text-center">
                            <div className="mx-auto mb-2 d-flex">
                                {details.logo_url ? (
                                    <img src={details.logo_url} className="img-fluid w-100" alt="User image" />
                                ) : (
                                    <img
                                        src="/uploads/user_v1llv353bppo/yourlogo.png"
                                        className="img-fluid w-100"
                                        accept="image/png,image/jpeg"
                                        type="file"
                                        alt="User image"
                                        style={{ width: "150px", height: "48px" }}
                                    />
                                )}
                            </div>
                            {details.logo_url ? (
                                <div className="d-flex justify-content-around mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-dark py-1"
                                        onClick={() => statusDeleteConfirmModal(true)}>
                                        <img
                                            src="/svgs/icons_new/trash.svg"
                                            className="svg-xs invert-color mr-1 mt-n1"
                                            title="Delete"
                                            alt="delete"
                                        />
                                        {t(props.language?.layout?.all_delete_nt)} &nbsp;
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
                            ) : loading ? (
                                <div class="bouncingLoader btn btn-dark btn-disabled mt-4 px-5">
                                    <div></div>
                                </div>
                            ) : (
                                <button type="button" className="btn btn-dark py-1 mt-4 pl-3" onClick={logohangler}>
                                    <img
                                        src="/svgs/icons_new/camera.svg"
                                        className="svg-xs invert-color mr-2 mt-n1"
                                        title="Upload profile image"
                                        alt="Upload profile image"
                                    />
                                    {t(props.language?.layout?.ep_setting_cd_uploadlogo)}
                                </button>
                            )}
                            <DeleteConfirmation
                                delete_confirm_modal={img_delete_confirm_modal}
                                statusDeleteConfirmModal={statusDeleteConfirmModal}
                                delete={deleteImage}
                            />
                            <ReactCropper
                                logoCropper={true}
                                openM={modalOpen}
                                closeModal={closeModal}
                                getData={getData}
                                userImage={details.logo_url}
                                changeImageUploadingStatus={changeImageUploadingStatus}
                                crop={crop}
                                onCrop={onCrop}
                                loadingSet={loadingSet}
                            />
                        </div>
                    </div>
                </Fragment>
            )}
        </div>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps)(BillingDetails);
