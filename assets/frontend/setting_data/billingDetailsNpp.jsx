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

const BillingDetailsNpp = (props) => {
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
        country: "",
        tenant: {
            name: "",
            logo_url: ""
        }
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
            .get("api/v1/setting/skillingpartner", {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                console.log("get details : ", response.data.data)
                setDetails(response.data.data);
                setIsLocation(true);
            })
            .catch((error) => {
                if (error.response.status == 404) {
                    setErrorMessage(true);
                }
            });
    };

    const onInputChange = (e) => {
        setDetails({ ...details, tenant: { [e.target.name]: e.target.value } });
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
        let data = {
            "city": details.city,
            "state": userLocation.state,
            "country": userLocation.country,
            "latitude": userLocation.latitude,
            "longitude": userLocation.longitude,
            "place_id": userLocation.place_id,
            "tenant": {
                "name": details.tenant.name
            }
        }
        if (
            !details.tenant.name
        ) {
            console.log(details);
            toast.error(t(props.language?.layout?.toast30_nt));
            return false;
        }
        if (!details.city || details.city === undefined) {
            toast.error(t(props.language?.layout?.toast93_nt));
            return;
        }
        axios
            .put(`api/v1/setting/skillingpartner`, data, {
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
        location.latitude = locationCity.lat;
        location.longitude = locationCity.lng;
        location.place_id = plcaeId;
        setUserLocation(location);
        setDetails({ ...details, city: city[0], state: city[1] });
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
    console.log("details.tenant: ", details.tenant && details.tenant.logo_url);
    // debugger
    return (
        <div>
            {errormessage && !details.length ? (
                <DataNotFound />
            ) : (
                <Fragment>
                    <div className="row mt-3">
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-lg-3 col-xs-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-grey z-index4" for="companyName">
                                            {t(props.language?.layout?.sp_viewseeker_companyname)}*
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-xs-12">
                                    <div className="form-group animated">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="companyName"
                                            name="name"
                                            value={details.tenant && details.tenant.name}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-lg-3 col-xs-12">
                                    <div className="form-group animated">
                                        <label className="form-label-active text-grey z-index4" for="phone">
                                            {t(props.language?.layout?.ep_setting_cd_city)} *
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-xs-12">
                                    <div className="form-group animated">
                                        <LocationSearchInput
                                            setLocationCity={setLocationCity}
                                            locationsJSON={locationsJSON}
                                            setLocation={setLocation}
                                            city_aligment={true}
                                            displayValue={true}
                                            value={details.state == undefined ? `${details.city !== null ? details.city : ""}` : `${details.city}${details.state !== "" ? "," + details.state : details.state}`}
                                            isLocation={isLocation}
                                            locationChange={locationChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <div className="d-flex justify-content-end mt-3 mb-4">
                                        <div>
                                            <button className="btn btn-outline-secondary btn-md px-4 px-md-5 mr-4">
                                                {t(props.language?.layout?.ep_setting_password_cancel)}
                                            </button>
                                            <button className="btn btn-primary btn-md px-5" onClick={saveDetails}>
                                                {t(props.language?.layout?.ep_setting_cd_save)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mt-2 px-2 pt-4 mx-auto text-center">
                            <div className="mx-auto mb-2 d-flex" >
                                {details.tenant && details.tenant.logo_url ? (
                                    <img src={details.tenant.logo_url}
                                        className="img-fluid w-100"
                                        alt="User image"
                                        width="150px"
                                        height="48px"
                                    />
                                ) :
                                    <img
                                        src="/uploads/user_v1llv353bppo/yourlogo.png"
                                        className="img-fluid w-100"
                                        accept="image/x-png,image/jpeg"
                                        type="file"
                                        alt="User image"
                                        width="150px"
                                        height="48px"
                                    />}
                            </div>
                            {details.tenant.logo_url ? (
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
                            ) : (loading ? (<div class="bouncingLoader btn btn-dark btn-disabled mt-4 px-5">
                                <div></div>
                            </div>) :
                                (<button type="button" className="btn btn-dark py-1 mt-4 pl-3" onClick={logohangler}>
                                    <img
                                        src="/svgs/icons_new/camera.svg"
                                        className="svg-xs invert-color mr-2 mt-n1"
                                        title="Upload profile image"
                                        alt="Upload profile image"
                                    />
                                    {t(props.language?.layout?.ep_setting_cd_uploadlogo)}
                                </button>)
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
                                userImage={details.tenant && details.tenant.logo_url}
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
export default connect(mapStateToProps, {})(BillingDetailsNpp);