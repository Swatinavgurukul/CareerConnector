import React, { Fragment, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { validate, res } from "react-email-validator";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import LocationSearchInput from "../common/locations.jsx";
import { _billingAuth } from "../actions/actionsAuth.jsx";
import { connect } from "react-redux";
import ReactCropper from "../components/image_cropper.jsx";
import DeleteConfirmation from "../profile/components/delete_confirmation.jsx";
import { useTranslation } from "react-i18next";

const EmployeePartnerOnboarding = (props) => {
    const { t } = useTranslation();
    //restrict - , ., e values in input
    const [symbolsArr] = useState(["e", "E", "-", "."]);
    const uploadRef = useRef(null);
    const history = useHistory();
    const [image, setImage] = useState("");
    const [browseValue, setBrowseValue] = useState("Choose File");
    const [userLocation, setUserLocation] = useState({});
    const [modalOpen, setmodalOpen] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState("");
    const [file, setFile] = useState(null);
    const [img_delete_confirm_modal, setImg_delete_confirm_modal] = useState(false);
    const [email, setEmail] = useState("");
    const [crop, setCrop] = useState({
        unit: "%",
        x: 10,
        y: 10,
        width: 40,
        height: 30,
        aspect: 0,
    })
    const [details, setDetails] = useState({
        name: "",
        email: email,
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
                // console.log(response.data.data[0].email);
                setDetails(response.data && response.data.data[0]);
                setEmail(response.data.data[0].email);
            })
            .catch((error) => {
                console.log(error);
            });
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
            })
            .catch((error) => { });
    };

    const onInputChange = (e) => {
        if (e.target.name === "phone" || e.target.name === "b_phone") {
            var phonenum = e.target.value.toString().slice(0, 10);
            setDetails({ ...details, [e.target.name]: phonenum });
        } else if (e.target.name === "alt_phone" || e.target.name === "b_phone_sec") {
            var altphonenum = e.target.value.toString().slice(0, 10);
            setDetails({ ...details, [e.target.name]: altphonenum === "NaN" ? "" : altphonenum });
        } else {
            setDetails({ ...details, [e.target.name]: e.target.value });
        }
    };

    const saveDetails = () => {
        let formData = new FormData();
        formData.append("email", details.email || email);
        formData.append("city", userLocation.city);
        formData.append("state", userLocation.state);
        formData.append("country", userLocation.country);
        formData.append("phone", details.phone);
        formData.append("image", file);
        formData.append("name", details.name);
        formData.append("b_title", details.b_title);
        formData.append("b_first_name", details.b_first_name);
        formData.append("b_last_name", details.b_last_name);
        formData.append("b_phone", details.b_phone);
        formData.append("b_phone_sec", details.b_phone_sec ? details.b_phone_sec : "None");
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
            // !details.b_title ||
            !details.b_first_name ||
            !details.b_last_name ||
            !details.b_email ||
            !details.b_phone
        ) {
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
        if (!userLocation.city && userLocation.city === undefined) {
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
        if (file && !isValidFileType(file.name)) {
            toast.error(t(props.language?.layout?.toast129_nt));
            return;
        }

        axios
            .put(`/api/v1/onboarding`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((response) => {
                if (response.data.status === 200) {
                    toast.success(t(props.language?.layout?.toast131_nt));
                    props._billingAuth(true);
                    history.push("/homepage");
                }
            })
            .catch((error) => {
                if (error) {
                    toast.error(t(props.language?.layout?.toast132_nt));
                }
            });
    };
    // console.log(userLocation.city, "JSON.stringify(userLocation)");
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
    const handleOnChange = e => {
        setFile(e.target.files[0]);
    };
    const uploadImage = (e) => {
        if (e.target.files.length > 0) {
            let files = e.target.files[0];
            setImage(files);
            setBrowseValue("x");
        }
    };
    const showFileSelector = () => {
        uploadRef.current.click();
    }
    const changeFile = () => {
        uploadRef.current.value = null;
    }
    const isValidFileType = (fName) => {
        let extensionLists = ["jpeg", "jpg", "png", "JPG", "JPEG", "PNG"];
        return extensionLists.indexOf(fName.split(".").pop()) > -1;
    };

    const onCrop = (value) => {
        setCrop(value);
    }
    const resetDetails = () => {
        setDetails({
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
        })
    }
    console.log("details", details);
    return (
        <Fragment>
            <div className="col-md-10 col-lg-8 px-3 p-md-0">
                <h4 className="mt-5">{t(props.language?.layout?.ep_setting_bd)}</h4>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="firstname">
                                {t(props.language?.layout?.ep_setting_cd_companyname)} *
                            </label>
                            <input
                                aria-label="companyName"
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
                            <label className="form-label-active text-grey" for="lastname">
                                {t(props.language?.layout?.ep_setting_cd_address)} *
                            </label>
                            <input
                                aria-label="address"
                                type="text"
                                className="form-control"
                                id="address"
                                name="b_address"
                                value={details.b_address}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey z-index4" for="phone">
                                {t(props.language?.layout?.ep_setting_cd_city)} *
                            </label>
                            {/* <input
                                type="text"
                                className="form-control"
                                value={details.city}
                                name="city"
                                onChange={(e) => onInputChange(e)}
                            />  */}
                            <LocationSearchInput
                                setLocationCity={setLocationCity}
                                locationsJSON={locationsJSON}
                                setLocation={setLocation}
                                city_aligment={true}
                                displayValue={true}
                            />
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="area-code">
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
                    <div className="col-md-4">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="phone">
                                {t(props.language?.layout?.ep_setting_bd_phone)} *
                            </label>

                            <input
                                aria-label="phone"
                                type="number"
                                className="form-control"
                                min="0"
                                minlength="10"
                                maxlength="10"
                                required
                                pattern="[0-9]{10}"
                                name="phone"
                                id="phone"
                                onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                value={details.phone}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="phone">
                                {t(props.language?.layout?.ep_setting_cd_altphone)}
                            </label>
                            <input
                                aria-label="Alt Phone"
                                type="number"
                                className="form-control"
                                min="0"
                                minlength="10"
                                maxlength="10"
                                required
                                pattern="[0-9]{10}"
                                name="alt_phone"
                                id="alt_phone"
                                onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                value={details.alt_phone}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="com_email">
                                {t(props.language?.layout?.ep_setting_cd_email)}
                            </label>
                            <input
                                aria-label="email"
                                type="email"
                                className="form-control"
                                id="com_email"
                                name="email"
                                readOnly
                                value={details.email || email}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {details.logo_url ? (
                            ""
                        ) : (
                            <p className="mt-4">
                                {/* <button type="button" className="btn btn-secondary py-1" onClick={logohangler}>
                                        <img
                                            src="/svgs/icons_new/camera.svg"
                                            className="svg-xs invert-color mr-2 mt-n1"
                                            title="Upload profile image"
                                            alt="Upload profile image"
                                        />
                                    Upload Logo
                                </button> */}
                            </p>
                        )}
                        <div className="mx-auto mt-3">
                            {/* {details.logo_url ? (
                                <img src={details.logo_url} className="img-fluid ml-5" alt="User image" style={{ width: "150px", height: "48px" }} />
                            ) : null} */}
                            {/* {details.logo_url ? (
                                <div className="d-flex justify-content-around mt-2">
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
                                    Delete
                                </button>
                                    <button type="button" className="btn btn-dark py-1" onClick={() => setmodalOpen(true)}>
                                        <img
                                            src="/svgs/icons_new/camera.svg"
                                            className="svg-xs invert-color mr-2 mt-n1"
                                            title="Upload profile image"
                                            alt="Upload profile image"
                                        />
                                    Update
                                </button>
                                </div>
                            ) : (
                                ""
                            )} */}
                            <DeleteConfirmation
                                delete_confirm_modal={img_delete_confirm_modal}
                                statusDeleteConfirmModal={statusDeleteConfirmModal}
                                delete={deleteImage}
                            />
                            <div className="d-flex">
                                <input
                                    type="file"
                                    accept=".jpeg,.jpg,.png"
                                    onChange={handleOnChange}
                                    onClick={changeFile}
                                    ref={uploadRef}
                                    hidden
                                />
                                <div className="" onClick={showFileSelector}>
                                    <button className="btn btn-primary">
                                        {t(props.language?.layout?.profile_upload_nt)}
                                    </button>
                                </div>
                                <div className="mt-1 ml-1">{file ? <span>{file.name}</span> : t(props.language?.layout?.nochosen_nt)}</div>
                            </div>
                            {/* <ReactCropper
                                logoCropper={true}
                                openM={modalOpen}
                                closeModal={closeModal}
                                getData={getData}
                                userImage={details.logo_url}
                                changeImageUploadingStatus={changeImageUploadingStatus}
                                noAvatars={true}
                                crop={crop}
                                onCrop={onCrop}
                            /> */}
                        </div>
                    </div>
                </div>
                <h4 className="mt-4">{t(props.language?.layout?.billingcontact_nt)}</h4>
                <div className="row">
                    <div className="col-md-2">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="jobtitle">
                                {t(props.language?.layout?.employer_signup_title)}
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
                                <option value="mr">{t(props.language?.layout?.employer_signup_selectoption_mr)}</option>
                                <option value="ms">{t(props.language?.layout?.employer_signup_selectoption_ms)}</option>
                                <option value="mrs">{t(props.language?.layout?.employer_signUp_selectoption_mrs)}</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="firstname">
                                {t(props.language?.layout?.ep_setting_cd_firstname)} *
                            </label>
                            <input
                                aria-label="firstname"
                                type="text"
                                className="form-control"
                                id="firstname"
                                name="b_first_name"
                                value={details.b_first_name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="lastname">
                                {t(props.language?.layout?.ep_setting_cd_lastname)} *
                            </label>
                            <input
                                aria-label="lastname"
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
                    <div className="col-md-2">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="area-code">
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
                    <div className="col-md-4">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="phone">
                                {t(props.language?.layout?.ep_setting_bd_phone)} *
                            </label>

                            <input
                                aria-label="b_phone"
                                type="number"
                                className="form-control"
                                min="0"
                                minlength="10"
                                maxlength="10"
                                required
                                pattern="[0-9]{10}"
                                name="b_phone"
                                id="b_phone"
                                onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                value={details.b_phone}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="phone">
                                {t(props.language?.layout?.ep_setting_cd_altphone)}
                            </label>

                            <input
                                aria-label="b_phone_sec"
                                type="number"
                                className="form-control"
                                min="0"
                                minlength="10"
                                maxlength="10"
                                required
                                pattern="[0-9]{10}"
                                name="b_phone_sec"
                                id="b_phone_sec"
                                onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                value={details.b_phone_sec}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group animated">
                            <label className="form-label-active text-grey" for="b_email">
                                {t(props.language?.layout?.ep_setting_cd_email)} *
                            </label>
                            <input
                                aria-label="b_email"
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
                <h4 className="mt-4">{t(props.language?.layout?.obterm_nt)}</h4>
                <div className="row mt-4">
                    <div className="col-md-2">{t(props.language?.layout?.obnetterm_nt)}</div>
                    <div className="col-md-10">{t(props.language?.layout?.oballpay_nt)}</div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-2">{t(props.language?.layout?.obfees_nt)}</div>
                    <div className="col-md-10">
                        {t(props.language?.layout?.oballfees_nt)}{" "}
                        <a href="https://careerconnector.simplifyhire.com/pricing" target="_blank">
                            {t(props.language?.layout?.obhere_nt)}
                        </a>
                    </div>
                </div>
                <div className="d-flex justify-content-end mt-5 mb-4">
                    <div>
                        <button className="btn btn-outline-secondary btn-md px-4 px-md-5 mr-4" onClick={resetDetails}>
                            {t(props.language?.layout?.forgotpass_reset)}
                        </button>
                        <button className="btn btn-primary btn-md px-5" onClick={saveDetails}>
                            {t(props.language?.layout?.ep_setting_cd_save)}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        billing: state.authInfo.billing,
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, { _billingAuth })(EmployeePartnerOnboarding);
