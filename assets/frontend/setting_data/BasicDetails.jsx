import React, { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import DataNotFound from "../partials/data404.jsx";
import { Link, useHistory } from "react-router-dom";
import ReactCropper from "../components/image_cropper.jsx";
import DeleteConfirmation from "../profile/components/delete_confirmation.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { job_category } from '../../translations/helper_translation.jsx';
import { _languageName } from "../actions/actionsAuth.jsx";
const BasicDetails = (props) => {
    const { t } = useTranslation();
    const [modalOpen, setmodalOpen] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState("");
    const [loading, setLoading] = useState(0);
    const [img_delete_confirm_modal, setImg_delete_confirm_modal] = useState(false);
    const [basic, setBasic] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role_id: "",
        id: "",
        user_image: "",
        area_code: "",
        role_name: {},
        title: "",
        locale: "",
        jobs_summary_notification: ""
    });
    let history = useHistory();
    const [link, setLink] = useState({
        facebook_link: "",
        linkedin_link: "",
        twitter_link: "",
    });
    const [org, setOrg] = useState({
        name: "",
    });

    const [dep, setDep] = useState({
        department: "",
        job_title: "",
    });

    const [departmentlist, setDepartmentList] = useState([]);
    const [errormessage, setErrorMessage] = useState(false);

    const onInputChange = (e) => {
        if (e.target.name === "phone") {
            var phonenum = Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 10);
            setBasic({ ...basic, [e.target.name]: phonenum });
        } else if (e.target.name === "locale") {
            props._languageName(e.target.value);
            setBasic({ ...basic, [e.target.name]: e.target.value });
        }
        else {
            setBasic({ ...basic, [e.target.name]: e.target.value });
            setLink({ ...link, [e.target.name]: e.target.value });
            setOrg({ ...org, [e.target.name]: e.target.value });
            setDep({ ...dep, [e.target.name]: e.target.value });
        }
    };

    const jobCategoryHandler = (language, key) => {
        return (job_category[language][key]);
    }
    useEffect(() => {
        getData();
    }, []);
    const getData = () => {
        axios
            .get("api/v1/setting/partner", {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                props.notificationsData(response.data.data);
                setBasic(response.data.data.account);
                setLink(response.data.data.social_profile_links);
                setOrg(response.data.data.organization);
                setDep(response.data.data.designation_details);
                setDepartmentList(response.data.data.departments_list);
            })
            .catch((error) => {
                if (error.response.status == 404) {
                    setErrorMessage(true);
                }
            });
    };

    const deleteImage = () => {
        axios
            .delete(`/api/v1/deleteimage/${basic.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((response) => {
                getData();
                statusDeleteConfirmModal(false);
                toast.success(t(props.language?.layout?.toast60_nt));
            })
            .catch((error) => { });
    };

    const statusDeleteConfirmModal = (status) => {
        setImg_delete_confirm_modal(status);
    };

    const basicHandler = () => {
        if (!basic.first_name || !basic.last_name || !basic.phone || !basic.area_code) {
            toast.error(t(props.language?.layout?.toast30_nt));
            return false;
        }
        if (basic.phone.length !== 10) {
            toast.error(t(props.language?.layout?.toast79_nt));
            return;
        }
        if (!basic.locale) {
            toast.error("Select any preferred language");
            return;
        }
        if (
            !/^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i.test(link.facebook_link) &&
            link.facebook_link !== null &&
            link.facebook_link !== ""
        ) {
            toast.error(t(props.language?.layout?.toast46_nt));
            return;
        }
        if (
            !/^(https?:\/\/)?((w{3}\.)?)linkedin.com\/.*/i.test(link.linkedin_link) &&
            link.linkedin_link !== null &&
            link.linkedin_link !== ""
        ) {
            toast.error(t(props.language?.layout?.toast47_nt));
            return;
        }
        if (
            !/^(https?:\/\/)?((w{3}\.)?)twitter.com\/.*/i.test(link.twitter_link) &&
            link.twitter_link !== null &&
            link.twitter_link !== ""
        ) {
            toast.error(t(props.language?.layout?.toast48_nt));
            return;
        }

        axios
            .put(
                "api/v1/setting/partner",
                {
                    first_name: basic.first_name,
                    last_name: basic.last_name,
                    phone: basic.phone,
                    area_code: basic.area_code,
                    title: basic.title,
                    locale: basic.locale,
                    organization: {
                        name: org.name,
                    },
                    social_profile: {
                        facebook_link: link.facebook_link,
                        twitter_link: link.twitter_link,
                        linkedin_link: link.linkedin_link,
                    },
                    designation: {
                        department: dep.department,
                        job_title: dep.job_title,
                    },
                },
                {
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                }
            )
            .then((resp) => {
                getData();
                if (resp.status === 200) {
                    toast.success(t(props.language?.layout?.toast90_nt));
                }
            })
            .catch((error) => {
                if (error) {
                    toast.error(t(props.language?.layout?.toast91_nt));
                }
            });
    };
    const pichandler = () => {
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
    // console.log("basic.language_preference......",basic.locale)
    return (
        <div>
            {errormessage && !basic.length ? (
                <DataNotFound />
            ) : (
                <Fragment>
                    <div className="row mt-3">
                        <div className="col-lg-8 col-md-9">
                            <div className="row">
                                <div className="col-md-2">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="jobtitle">
                                            {t(props.language?.layout?.employer_signup_title)}
                                        </label>

                                        <select
                                            className="form-control"
                                            aria-label="title"
                                            name="title"
                                            value={basic.title}
                                            onChange={(e) => onInputChange(e)}>
                                            <option selected="" className="d-none">
                                                {t(props.language?.layout?.sp_setting_bd_select)}
                                            </option>
                                            <option value="mr">
                                                {t(props.language?.layout?.skilling_signup_selectoption_mr)}
                                            </option>
                                            <option value="ms">
                                                {t(props.language?.layout?.skilling_signup_selectoption_ms)}
                                            </option>
                                            <option value="mrs">
                                                {t(props.language?.layout?.skilling_signup_selectoption_mrs)}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="first_name">
                                            {t(props.language?.layout?.sp_setting_bd_firstname)}*
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="first_name"
                                            name="first_name"
                                            value={basic.first_name}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="last_name">
                                            {t(props.language?.layout?.sp_setting_bd_lastname)}*
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="last_name"
                                            name="last_name"
                                            value={basic.last_name}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-6 col-lg-12 col-md-12">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="basic_email">
                                            {t(props.language?.layout?.sp_setting_bd_email)}
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="basic_email"
                                            readOnly
                                            name="email"
                                            value={basic.email}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-6 col-md-6">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="area-code">
                                            {t(props.language?.layout?.sp_setting_bd_areacode)}*
                                        </label>
                                        <select
                                            className="form-control"
                                            aria-label="country"
                                            name="area_code"
                                            value={basic.area_code}
                                            onChange={(e) => onInputChange(e)}>
                                            <option selected="" className="d-none">
                                                {t(props.language?.layout?.sp_setting_bd_select)}
                                            </option>
                                            <option value="USA +1">USA +1</option>
                                            <option value="Canada +1">
                                                Canada +1
                                            </option>
                                            <option value="Australia" disabled>
                                                {t(props.language?.layout?.employer_signup_selectoption_australia)}
                                            </option>
                                            <option value="Brazil" disabled>
                                                {t(props.language?.layout?.employer_signup_selectoption_brazil)}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-6 col-md-6">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="phone">
                                            {t(props.language?.layout?.sp_setting_bd_phone)}*
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control"
                                            minlength="10"
                                            maxlength="10"
                                            required
                                            pattern="[0-9]{10}"
                                            name="phone"
                                            id="phone"
                                            value={basic.phone}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="role">
                                            {t(props.language?.layout?.sp_setting_bd_role)}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            readOnly
                                            id="role"
                                            name="role_id"
                                            value={basic.role_name?.display_name}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group animated mt-n2">
                                        <label for="exampleFormControlSelect1" className="form-label-active text-muted">
                                            {t(props.language?.layout?.sp_setting_bd_dept)}{" "}
                                        </label>

                                        <select
                                            aria-label="department"
                                            className="form-control"
                                            name="department"
                                            onChange={(e) => onInputChange(e)}
                                            value={dep.department}>
                                            {departmentlist !== null &&
                                                departmentlist.map((option) => (
                                                    <option value={option.id}>
                                                        {jobCategoryHandler(props?.languageName, option.name)}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="jobtitle">
                                            {t(props.language?.layout?.sp_setting_bd_jobtitle)}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="jobtitle"
                                            name="job_title"
                                            value={
                                                dep.job_title == null || dep.job_title == undefined ? "" : dep.job_title
                                            }
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="languagepreference">
                                            {t(props.language?.layout?.preflang_nt)}*
                                        </label>
                                        <select
                                            aria-label="language"
                                            name="locale"
                                            className="form-control"
                                            value={basic.locale}
                                            onChange={(e) => onInputChange(e)}>
                                            <option selected disabled>
                                                Select language
                                            </option>
                                            <option value="en">English</option>
                                            <option value="esp">Spanish</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <h5 className="text-muted pt-4">{t(props.language?.layout?.sp_setting_bd_profile)}</h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="facebook">
                                            {t(props.language?.layout?.sp_setting_bd_facebook)}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="facebook"
                                            name="facebook_link"
                                            value={link.facebook_link}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="linkedin">
                                            {t(props.language?.layout?.sp_setting_bd_linkedin)}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="linkedin"
                                            name="linkedin_link"
                                            value={link.linkedin_link}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group animated mt-n2">
                                        <label className="form-label-active text-muted" for="twitter">
                                            {t(props.language?.layout?.sp_setting_bd_twitter)}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="twitter"
                                            name="twitter_link"
                                            value={link.twitter_link}
                                            onChange={(e) => onInputChange(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-5 mb-4">
                                <div>
                                    {/* <button className="btn btn-outline-secondary btn-md px-4 px-md-5 mr-4" onClick={() => { history.push("/settingsv2") }}> */}
                                    <button className="btn btn-outline-secondary btn-md px-4 px-md-5 mr-4">
                                        {t(props.language?.layout?.ep_setting_cd_cancel)}
                                    </button>
                                    <button className="btn btn-primary btn-md px-5" onClick={basicHandler}>
                                        {t(props.language?.layout?.ep_setting_cd_save)}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 mt-4 p-lg-4 p-md-2 mx-auto text-center">
                            {/* {basic.user_image === "" || !basic.user_image || basic.user_image === null ? (
                                <img
                                    src="/images/profile_dummy.png"
                                    class="rounded-circle img-fluid"
                                    alt="User image"
                                    style={{ width: "150px" }}
                                />
                            ) : (
                                <div className="candidate-profileWrap">
                                    <img src={basic.user_image} className="candidate-profile-image" alt="User image" />
                                </div>
                            )} */}

                            <div className="mx-auto mb-2" style={{ width: "150px", height: "150px" }}>
                                {basic.user_image === "" || !basic.user_image || basic.user_image === null ? (
                                    <img
                                        src="/images/profile_dummy.png"
                                        className="rounded-circle img-fluid"
                                        accept="image/x-png,image/jpeg"
                                        type="file"
                                        alt={t(props.language?.layout?.userimage_nt)}
                                        width="150px"
                                        height="150px"
                                    // style={{ width: "150px", height: "150px",
                                    // }}
                                    />
                                ) : (
                                    <img
                                        src={basic.user_image}
                                        class="rounded-circle img-fluid"
                                        accept="image/x-png,image/jpeg"
                                        type="file"
                                        alt={t(props.language?.layout?.userimage_nt)}
                                        width="150px"
                                        height="150px"
                                    // style={{ width: "150px", height: "150px",}}
                                    />
                                )}
                            </div>

                            {basic.user_image ? (
                                <div className="d-lg-flex justify-content-center">
                                    <button
                                        type="button"
                                        className="btn btn-dark py-1 mb-md-2 mx-2"
                                        onClick={() => statusDeleteConfirmModal(true)}>
                                        <img
                                            src="/svgs/icons_new/trash.svg"
                                            className="svg-xs invert-color mr-1 mt-n1 "
                                            title="Delete"
                                            alt="delete"
                                        />
                                        {t(props.language?.layout?.all_delete_nt)} &nbsp;
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-dark py-1 mb-md-2 mx-2"
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
                                <div class="bouncingLoader btn btn-dark btn-disabled px-5">
                                    <div></div>
                                </div>
                            ) : (
                                <button type="button" className="btn btn-dark py-1" onClick={pichandler}>
                                    <img
                                        src="/svgs/icons_new/camera.svg"
                                        className="svg-xs invert-color mr-2 mt-n1"
                                        title="Upload profile image"
                                        alt="Upload profile image"
                                    />
                                    {t(props.language?.layout?.ep_setting_bd_upload)}
                                </button>
                            )}
                            <DeleteConfirmation
                                delete_confirm_modal={img_delete_confirm_modal}
                                statusDeleteConfirmModal={statusDeleteConfirmModal}
                                delete={deleteImage}
                            />
                            <ReactCropper
                                openM={modalOpen}
                                closeModal={closeModal}
                                getData={getData}
                                userImage={basic.user_image}
                                changeImageUploadingStatus={changeImageUploadingStatus}
                                availability_id={basic.id}
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
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
        user: state.authInfo.user,
    };
}
export default connect(mapStateToProps, { _languageName })(BasicDetails);
