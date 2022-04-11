import React, { useState, useEffect } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { validate, res } from "react-email-validator";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { _logout } from "../actions/actionsAuth.jsx";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { _languageName } from "../actions/actionsAuth.jsx";
const Accounts = (props) => {
    const { t } = useTranslation();
    const [disbles, setDisbles] = useState({
        isPrimarymailDisabled: false,
        isElementDisabled: false,
        isNewEmailShow: false,
    });
    // settingData preserved throught the component life
    // const [settingData, setSettingData] = useState({
    //     phone: "",
    //     email: "",
    //     id: "",
    //     secondary_email: "",
    // });
    // // const userId = settingData.id;
    // // accSetting updated with user input
    // const [accSetting, setAccSetting] = useState({
    //     primaryEmail: "",
    //     phone: "",
    //     secondary_email: "",
    // });

    const [newEmail, setNewEmail] = useState({ email: "" });
    const [deleteAccountModal, setDeleteAccountModal] = useState(false);
    const [confirmAccountModal, setConfirmAccountModal] = useState(false);
    const [otherReason, setOtherReason] = useState("");

    const [verificationStatus, setVerificationStatus] = useState({
        isVerified: false,
        isChangesSaved: false,
        isLoading: false,
    });
    const [deleteReason, setDeleteReason] = useState("");
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(true);
    const [visible, setVisible] = useState(false);
    const [actionStatus, setActionStatus] = useState("");

    const toastConfig = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };
    // const regex = new RegExp(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

    const toShowNewElements = () => {
        setDisbles({ isPrimarymailDisabled: true, isElementDisabled: true, isNewEmailShow: true });
    };
    const toHideNewElements = () => {
        setNewEmail({ email: "" });
        setDisbles({ isPrimarymailDisabled: false, isElementDisabled: false, isNewEmailShow: false });
    };

    const onInputChange = (e) => {
        if (e.target.name === "phone") {
            var num = Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 10);
            props.setAccSetting({ ...props.accSetting, [e.target.name]: num });
        } else if (e.target.name === "secondary_email") {
            props.setAccSetting({ ...props.accSetting, [e.target.name]: e.target.value });
        } else if (e.target.name === "locale") {
            props._languageName(e.target.value);
            props.setAccSetting({ ...props.accSetting, [e.target.name]: e.target.value });
        }
        else {
            props.setAccSetting({ ...props.accSetting, [e.target.name]: e.target.value });
        }
    };

    const onNewEmailChange = (value) => {
        setNewEmail({ email: value });
        // console.log(newEmail)
    };

    // const getData = () => {
    //     Axios.get("/api/v1/profilesetting", {
    //         headers: { Authorization: `Bearer ${props.userToken}` },
    //     })
    //         .then((response) => {
    //             const accountSettingData = response.data.data.account;
    //             // console.log(accountSettingData)
    //             setSettingData(accountSettingData);
    //             setAccSetting({
    //                 ...accSetting,
    //                 primaryEmail: response.data.data.account.email,
    //                 secondary_email: response.data.data.account.secondary_email,
    //                 phone: response.data.data.account.phone,
    //             });
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    useEffect(() => {
        // getData();
    }, []);
    const onSubmit = () => {
        // primaryEmail is disabled by default
        if (props.accSetting.secondary_email !== "") {
            // iff present
            if (props.accSetting.secondary_email === props.settingData.email) {
                toast.error(t(props.language?.layout?.toast77_nt), { ...toastConfig });
                return;
            }
        }
        if (props.accSetting.secondary_email == "") {
            var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (props.accSetting.secondary_email.match(mailformat)) {
                return true;
            }
        }
        if (!props.accSetting.phone) {
            toast.error(t(props.language?.layout?.toast78_nt), { ...toastConfig });
            return;
        }
        if (props.accSetting.phone.length !== 10) {
            toast.error(t(props.language?.layout?.toast79_nt), { ...toastConfig });
            return;
        }
        if (props.settingData.id !== "") {
            const endpoint = `/api/v1/profilesetting/${props.settingData.id}`;
            Axios.put(endpoint, JSON.stringify({ account: props.accSetting }), {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${props.userToken}`,
                },
            })
                .then((response) => {
                    // console.log(response);
                    setVerificationStatus({ isVerified: true, isChangesSaved: true, isLoading: false });
                    toast.success(t(props.language?.layout?.toast80_nt), { ...toastConfig });
                    return;
                })
                .catch((error) => {
                    toast.error(error.response.data.detail || t(props.language?.layout?.toast81_nt));
                });
        } else {
            console.log("id is missing");
        }
    };

    const handleVerifyEmail = (e) => {
        if (newEmail.email.length === 0) {
            toast.error(t(props.language?.layout?.toast82_nt), { ...toastConfig });
            return;
        }
        validate(newEmail.email);
        if (!res) {
            toast.error(t(props.language?.layout?.toast83_nt), { ...toastConfig });
            return;
        }
        setVerificationStatus({ isVerified: false, isChangesSaved: false, isLoading: true });
        const endpoint = "/api/v1/user/email/change";
        Axios.put(endpoint, JSON.stringify(newEmail), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.userToken}`,
            },
        })
            .then((response) => {
                // console.log(response.data);
                props.getData();
                setVerificationStatus({ isVerified: true, isChangesSaved: false, isLoading: false });
                setDisbles({ isPrimarymailDisabled: true, isElementDisabled: false, isNewEmailShow: true });
                toast.success(t(props.language?.layout?.toast84_nt), { ...toastConfig });
                return;
            })
            .catch((error) => {
                // console.log(error.response);
                setVerificationStatus({ isVerified: false, isChangesSaved: false, isLoading: false });
                if (error.response.data.email) {
                    toast.error(error.response.data.email[0], { ...toastConfig });
                    return;
                }
            });
    };
    const handleResendVerifyEmail = (e) => {
        setVerificationStatus({ isVerified: false, isChangesSaved: false, isLoading: true });
        const endpoint = "api/v1/user/verifyemail";
        Axios.put(endpoint, JSON.stringify(newEmail), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.userToken}`,
            },
        })
            .then((response) => {
                // console.log(response);
                props.getData();
                setVerificationStatus({ isVerified: true, isChangesSaved: false, isLoading: false });
                setDisbles({ isPrimarymailDisabled: true, isElementDisabled: false, isNewEmailShow: true });
            })
            .catch((error) => {
                console.log(error);
                setVerificationStatus({ isVerified: false, isChangesSaved: false, isLoading: false });
            });
    };

    const showHandler = () => {
        if (!deleteReason) {
            toast.error(t(props.language?.layout?.toast33_nt));
            return false;
        }
        if (deleteReason == "Others" && !otherReason) {
            toast.error(t(props.language?.layout?.toast34_nt));
            return false;
        }

        setDeleteAccountModal(false);
        setConfirmAccountModal(true);
    };
    const closeHandler = () => {
        setDeleteAccountModal(false);
        setActionStatus("");
        setDeleteReason("");
        setOtherReason("");
    };
    const closeConfirmHandler = () => {
        setConfirmAccountModal(false);
        setActionStatus("");
        setDeleteReason("");
        setOtherReason("");
    };
    const handlereasonChange = (event) => {
        // console.log("event", event.target.value);
        setDeleteReason(event.target.value);
    };

    const deleteHandler = () => {
        if (!password) {
            toast.error(t(props.language?.layout?.toast85_nt));
            setValidPassword(false);
            return;
        }
        Axios.delete("api/v1/user/account/delete", {
            data: { password: password, comment: deleteReason == "Others" ? otherReason : deleteReason },
            headers: { Authorization: `Bearer ${props.userToken}` },
        })

            .then((resp) => {
                if (resp.data.status == 200) {
                    toast.success(t(props.language?.layout?.toast86_nt))
                    setTimeout(() => {
                        props._logout();
                    }, 3000);
                }
            })
            .catch((error) => {
                if (error.response.data.status == 400) {
                    toast.error(t(props.language?.layout?.toast87_nt))
                }
                else {
                    toast.error(error.response.data.detail || t(props.language?.layout?.toast53_nt));
                }
            });
    };
    const deactivateHandler = () => {
        if (!password) {
            toast.error(t(props.language?.layout?.toast85_nt));
            setValidPassword(false);
            return;
        }
        let formData = new FormData();
        formData.append("password", password);
        formData.append("comment", deleteReason == "Others" ? otherReason : deleteReason);
        Axios.put("api/v1/user/account/deactivate",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${props.userToken}`,
                },
            })
            .then(resp => {
                toast.success(t(props.language?.layout?.toast88_nt))
                setTimeout(() => {
                    props._logout();
                }, 3000);
            })
            .catch((error) => {
                if (error.response.data.status == 400) {
                    toast.error(t(props.language?.layout?.toast87_nt))
                }
                else {
                    toast.error(error.response.data.detail || t(props.language?.layout?.toast53_nt));
                }
            });
    };

    return (
        <div className="tab-pane fade show active setting_input" id="Accounts" role="tabpanel">
            <div className="card border-0">
                <div className=" py-4 px-0">
                    <div className="form-group d-md-flex align-items-center mb-0">
                        <div className="col-md-3 p-0">
                            <p>
                                {disbles.isPrimarymailDisabled
                                    ? "Old Email"
                                    : t(props.language?.layout?.js_account_primaryemail)}{" "}
                                *
                            </p>
                        </div>
                        <div className="col-md-9 p-0">
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="primaryEmail"
                                    className="form-control rounded-0 border-dark px-4"
                                    placeholder={t(props.language?.layout?.setting_primary_nt)}
                                    defaultValue={props.settingData.email}
                                    disabled="true"
                                    onChange={(e) => onInputChange(e)}
                                />
                            </div>
                        </div>
                        {/* <div className="col-md-2">
                            <div className="form-group w-80">
                                <button
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#test"
                                    aria-expanded="false"
                                    aria-controls="test"
                                    id="btn"
                                    className="form-control btn btn-outline-primary rounded-pill"
                                    disabled={disbles.isPrimarymailDisabled}
                                    onClick={() => toShowNewElements()}>
                                    Change
                                </button>
                            </div>
                        </div> */}
                    </div>
                    <div className={disbles.isNewEmailShow ? "d-block" : "d-none"}>
                        <div className="form-group d-md-flex align-items-center mb-0">
                            <div className="col-md-3 p-0">
                                <p>New Email *</p>
                            </div>
                            <div className="col-md-9 p-0">
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={newEmail.email}
                                        className="form-control rounded-0 border-dark px-4"
                                        placeholder="Enter your new email address"
                                        onChange={(e) => onNewEmailChange(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="offset-md-6 col-md-4 text-right">
                                <div
                                    className={
                                        !verificationStatus.isVerified && !verificationStatus.isLoading
                                            ? "d-block pr-0"
                                            : "d-none pr-0"
                                    }>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm px-3"
                                        onClick={() => toHideNewElements()}>
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm px-4 ml-3"
                                        onClick={(e) => handleVerifyEmail(e)}>
                                        Save
                                    </button>
                                </div>
                                <div className={verificationStatus.isLoading ? "d-block ml-auto mr-5 py-1" : "d-none"}>
                                    <div className="spinner-border spinner-border-sm text-primary"></div>
                                </div>
                                <div className={verificationStatus.isVerified ? "d-block" : "d-none"}>
                                    <a
                                        className="btn-link text-primary pointer"
                                        onClick={(e) => handleResendVerifyEmail(e)}>
                                        Send again
                                    </a>
                                    <span className="text-secondary pl-3">Link sent for verification</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group d-md-flex align-items-center mb-0">
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.js_account_secondaryemail)}</p>
                        </div>
                        <div className="col-md-9 p-0">
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="secondary_email"
                                    className="form-control rounded-0 border-dark px-4"
                                    placeholder={t(props.language?.layout?.setting_placeholder1_nt)}
                                    disabled={disbles.isElementDisabled}
                                    defaultValue={props.settingData.secondary_email}
                                    onKeyUp={(e) => onInputChange(e)}
                                />{" "}
                                {/* {no_translated} */}
                            </div>
                        </div>
                        {/* <div className="col-md-2">
                            <div className="form-group w-80">
                                <select className="form-control rounded-0 border-dark" disabled={disbles.isElementDisabled}>
                                    <option selected="">Public</option>
                                    <option data-icon="user.svg" value="1">Group</option>
                                    <option value="2">Private</option>
                                </select>
                            </div>
                        </div> */}
                    </div>
                    <div className="form-group d-md-flex align-items-center mb-0">
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.js_account_contactnumber)}*</p>
                        </div>
                        <div className="col-md-9 p-0">
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="phone"
                                    className="form-control rounded-0 border-dark px-4"
                                    placeholder={t(props.language?.layout?.setting_placeholder2_nt)}
                                    disabled={disbles.isElementDisabled}
                                    value={props.accSetting.phone != null ? props.accSetting.phone : props.settingData.phone}
                                    onChange={(e) => onInputChange(e)}
                                />
                            </div>{" "}
                            {/* {no_translated} */}
                        </div>
                        {/* <div className="col-md-2">
                            <div className="form-group w-80">
                                <select className="form-control rounded-0 border-dark" disabled={disbles.isElementDisabled}>
                                    <option selected="">Public</option>
                                    <option value="1">Group</option>
                                    <option value="2">Private</option>
                                </select>
                            </div>
                        </div> */}
                    </div>
                    <div className="form-group d-md-flex align-items-center">
                        <div className="col-md-3 p-0">
                            <p>Preferred Language</p>
                        </div>
                        <div className="col-md-3 p-0">
                            <div className="form-group">
                                <select
                                    aria-label="language"
                                    name="locale"
                                    className="form-control text-muted rounded-0 border-dark px-4"
                                    value={props.accSetting.locale != undefined ? props.accSetting.locale : props.settingData.locale}
                                    onChange={(e) => onInputChange(e)}
                                >
                                    <option selected disabled>Select language</option>
                                    <option value="en" >English</option>
                                    <option value="esp" >Spanish</option>
                                    <option value="fr" >French</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="d-md-flex mt-4 justify-content-end">
                        {/* <div className="col-md-6 text-right">
                              {verificationStatus.isChangesSaved ?  <span className="text-success">Account Settings Updated</span> : null}
                            </div> */}
                        {/*  {process.env.CLIENT_NAME === "cc" && (
                            <div className=" col-md-3 p-0">
                                {props.user.is_user ? (
                                    <button
                                        className="btn btn-danger btn-md px-4"
                                        onClick={() => setDeleteAccountModal(!deleteAccountModal)}>
                                        Delete Account
                                    </button>
                                ) : null}
                            </div>
                        )}  */}
                        <div className="col-md-6 text-right p-0">
                            {/* <button type="button" className="btn btn-outline-secondary btn-md px-5 mx-4">
                                <Link to="/" disabled={disbles.isElementDisabled}>
                                    {t(props.language?.layout?.js_account_cancel)}
                                </Link>
                            </button> */}
                            <button
                                className="btn btn-primary btn-md px-4"
                                disabled={disbles.isElementDisabled}
                                onClick={onSubmit}>
                                {t(props.language?.layout?.js_passwordchange_savechanges)}
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    {props.user.is_user ? (
                        <Fragment>
                            <div class="d-md-flex mt-2">
                                <div class="col-md-3 p-0">
                                    <p>{t(props.language?.layout?.setting_deactivate_nt)}</p>
                                </div>
                                <div class="col-md-9 p-0">
                                    <div class="text-muted">
                                        <p className="mb-0">
                                            {t(props.language?.layout?.setting_deactivateinfo_nt)}
                                        </p>
                                        <button
                                            className="btn blue-chalk btn-md px-4 my-4"
                                            onClick={() => {
                                                setDeleteAccountModal(!deleteAccountModal);
                                                setActionStatus("deactive");
                                            }}>
                                            {t(props.language?.layout?.setting_deactivate_nt)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {process.env.CLIENT_NAME === "cc" && (
                                <div class=" d-md-flex">
                                    <div class="col-md-3 p-0">
                                        <p>{t(props.language?.layout?.deleteacc_nt)}</p>
                                    </div>
                                    <div class="col-md-9 p-0">
                                        <div class="text-muted">
                                            <p className="mb-0">
                                                {t(props.language?.layout?.deleteacc_info_nt)}
                                            </p>
                                            <button
                                                className="btn blue-chalk btn-md px-4 my-4"
                                                onClick={() => {
                                                    setDeleteAccountModal(!deleteAccountModal);
                                                    setActionStatus("delete");
                                                }}>
                                                {t(props.language?.layout?.deleteacc_nt)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/*
                            <div class=" d-md-flex">
                                <div class="col-md-3 p-0">
                                    <p>Cancel Account Deletion</p>
                                </div>
                                <div class="col-md-9 p-0">
                                    <div class="text-muted">
                                        <p className="mb-0">
                                            Your account will get deleted within 72 hours of account deletion request.
                                        </p>
                                        <p className="mb-0">
                                            You can cancel your request before the deletion is processed by clicking
                                            "Cancel Deletion"
                                        </p>
                                        <button
                                            className="btn btn-success btn-md px-4 mt-4"
                                            onClick={() => setDeleteAccountModal(!deleteAccountModal)}>
                                            Cancel Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                         */}
                        </Fragment>
                    ) : null}
                </div>
                <Modal show={deleteAccountModal} onHide={closeHandler} size={"lg"} centered>
                    <div className="modal-content">
                        <div className="modal-header px-4 border-0">
                            <button
                                type="button"
                                className="close animate-closeicon"
                                aria-label="Close"
                                title="Close"
                                onClick={closeHandler}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body p-5">
                            <h5>
                                <span className="text-capitalize">{props.user.name}</span>, {t(props.language?.layout?.ddsure_nt)}{" "}
                                {actionStatus == "delete" ? <span>{t(props.language?.layout?.all_delete_nt)}</span> : <span>{t(props.language?.layout?.dddeactivate_nt)}</span>} {t(props.language?.layout?.ddyouracc_nt)}?
                            </h5>

                            {actionStatus == "delete" ? (
                                <p>
                                    {" "}
                                    {t(props.language?.layout?.ddinfo_nt)}
                                </p>
                            ) : (
                                <p>
                                    {t(props.language?.layout?.ddinfo1_nt)}
                                </p>
                            )}

                            <p className="mt-3 mb-0">
                                {t(props.language?.layout?.ddreason_nt)}{" "}
                                {actionStatus == "delete" ? <span>{t(props.language?.layout?.all_delete_nt)}</span> : <span>{t(props.language?.layout?.dddeactivate_nt)}</span>} {t(props.language?.layout?.ddyouracc_nt)}.
                            </p>
                            <fieldset
                                className="reasons"
                                value={deleteReason}
                                onChange={(event) => handlereasonChange(event)}>
                                <div class="form-group animated">
                                    <div class="form-check custom-radio">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            name="deleteAccountReason"
                                            id="reason1"
                                            value="I recently found a job and/or I am no longer searching for a job."
                                        />
                                        <label class="form-check-label pl-1" for="reason1">
                                            {t(props.language?.layout?.ddreason1_nt)}
                                        </label>
                                    </div>
                                    <div class="form-check custom-radio">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            name="deleteAccountReason"
                                            id="reason2"
                                            value="I receive too many emails or job alerts."
                                        />
                                        <label class="form-check-label pl-1" for="reason2">
                                            {t(props.language?.layout?.ddreason2_nt)}
                                        </label>
                                    </div>
                                    <div class="form-check custom-radio">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            name="deleteAccountReason"
                                            id="reason3"
                                            value="I don’t want my resume to be posted publically."
                                        />
                                        <label class="form-check-label pl-1" for="reason3">
                                            {t(props.language?.layout?.ddreason3_nt)}
                                        </label>
                                    </div>
                                    <div class="form-check custom-radio">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            name="deleteAccountReason"
                                            id="reason4"
                                            value="I have multiple accounts and wants to consolidate them."
                                        />
                                        <label class="form-check-label pl-1" for="reason4">
                                            {t(props.language?.layout?.ddreason4_nt)}
                                        </label>
                                    </div>
                                    <div class="form-check custom-radio">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            name="deleteAccountReason"
                                            id="reason5"
                                            value="I see no value in having an account (e.g. not getting job offers, not
                                                hearing back about applications I have submitted)."
                                        />
                                        <label class="form-check-label ml-4 pl-2 mt-n5" for="reason5">
                                            {t(props.language?.layout?.ddreason5_nt)}
                                        </label>
                                    </div>
                                    <div class="form-check custom-radio">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            name="deleteAccountReason"
                                            id="reason6"
                                            value="Others"
                                        />
                                        <label class="form-check-label pl-1" for="reason6">
                                            {t(props.language?.layout?.jobs_jobtype_other)}.
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                            {deleteReason === "Others" && (
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    value={otherReason}
                                    onChange={(e) => setOtherReason(e.target.value)}></input>
                            )}
                        </div>
                        <div className="modal-footer border-0 p-5">
                            <button className="btn btn-outline-primary px-5" onClick={closeHandler}>
                                {t(props.language?.layout?.ep_setting_password_cancel)}
                            </button>
                            <button className="btn btn-danger ml-3" onClick={() => showHandler()}>
                                {actionStatus === "delete" ? (
                                    <p className="mb-0"> {t(props.language?.layout?.deleteacc_nt)} &amp; {t(props.language?.layout?.seeker_logout)}</p>
                                ) : (
                                    <p className="mb-0"> {t(props.language?.layout?.setting_deactivate_nt)} &amp; {t(props.language?.layout?.seeker_logout)}</p>
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
                <Modal show={confirmAccountModal} onHide={closeConfirmHandler} size={"lg"} centered>
                    <div className="modal-content">
                        <div className="modal-header px-4 border-0">
                            <button
                                type="button"
                                className="close animate-closeicon"
                                aria-label="Close"
                                title="Close"
                                onClick={closeConfirmHandler}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body p-5">
                            <h5>{t(props.language?.layout?.confirm_nt)}</h5>
                            <h6>
                                {t(props.language?.layout?.enterpass_nt)}{" "}
                                {actionStatus == "delete" ? <span>{t(props.language?.layout?.all_delete_nt)}</span> : <span>{t(props.language?.layout?.dddeactivate_nt)}</span>} {t(props.language?.layout?.ddacc_nt)}.
                            </h6>
                            {/* <div className="form-group">
                                <label    className={
                                    validPassword
                                        ? "form-label-active text-green"
                                        : "form-label-active text-danger bg-white"
                                } for="textarea">Enter your password to delete account</label>
                                <textarea rows="5" type="text" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} id="textarea" name="textarea"></textarea> */}
                            <div className="form-group animated">
                                <label
                                    className={
                                        validPassword
                                            ? "form-label-active text-green"
                                            : "form-label-active text-danger bg-white"
                                    }
                                    for="password">
                                    {t(props.language?.layout?.login_password)}
                                </label>
                                <input
                                    type={visible ? "text" : "password"}
                                    aria-label="password"
                                    className={
                                        validPassword ? " form-control mb-3" : " form-control mb-3 border-danger"
                                    }
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setValidPassword(true);
                                    }}
                                />
                                <div className="d-flex justify-content-end mr-3">
                                    <div className="icon-invert mt-n5 mb-4" onClick={(e) => setVisible(!visible)}>
                                        <img
                                            src={visible ? "/svgs/icons_new/eye-off.svg" : "/svgs/icons_new/eye.svg"}
                                            alt="eye-slash-icon"
                                            className="svg-sm"
                                            id="eyeIcon"
                                            tabIndex="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*  </div>*/}
                            <div className="mt-3">
                                <Link to="/forgotPassword" className="text-primary">
                                    {t(props.language?.layout?.login_forgotpassword)}
                                </Link>
                            </div>
                        </div>
                        <div className="modal-footer border-0 p-5">
                            <button className="btn btn-outline-primary px-5" onClick={closeConfirmHandler}>
                                {t(props.language?.layout?.js_account_cancel)}
                            </button>
                            {actionStatus == "delete" ? (
                                <button className="btn btn-danger mx-3 px-5" onClick={deleteHandler}>
                                    {t(props.language?.layout?.deleteacc_nt)}
                                </button>
                            ) : (
                                <button className="btn btn-light px-5" onClick={deactivateHandler}>
                                    {t(props.language?.layout?.deactivate_nt)}
                                </button>
                            )}
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        _logout: () => dispatch(_logout()),
        _languageName: (value) => dispatch(_languageName(value))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
