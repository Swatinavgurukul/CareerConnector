import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { validate, res } from "react-email-validator";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next"

function Signup(props) {
    const { t } = useTranslation();
    const history = useHistory();
    const [user, setUser] = useState({ title: "", first_name: "", last_name: "", email: "", code: "", phone: "", password: "", resume_file: "", area_code: "", language: "en", cnfPassword: "", browseValue: t(props.language?.layout?.seeker_resume_browsefile_text) });
    const [show_errors, setShow_errors] = useState({
        showPassword: false,
        showCnfPass: false,
        disable: false, validCode: true, validEmail: true,
        validPassword: true, validPhoneNumber: true, validAreaCode: true,
        validLastName: true, isValidName: true, isValidtitle: true, validReCnfPass: true, visible: false
    })
    const regexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regexExp = /^[a-zA-Z0-9+.]+$/;
    const styleObj = {
        opacity: 1,
        marginBottom: "-42px",
    };
    const id_area_code = {
        zIndex: "1",
    };
    useEffect(() => {
        const urlPath = history.location.pathname;
    }, []);
    const showHidePwd = (value) => {
        setShow_errors({ ...show_errors, showPassword: value });
    };
    const showHideCnfPass = (value) => {
        setShow_errors({ ...show_errors, showCnfPass: value });
    };
    const uploadResume = (e) => {
        if (e.target.files.length > 0) {
            let files = e.target.files[0];
            setUser({ ...user, resume_file: files, browseValue: "X" })
        } else {
            setUser({ ...user, resume_file: "Upload Resume (Optional)" });
            setUser({ ...user, browseValue: "Choose File" });
        }
    };
    const isValidFileType = (fName) => {
        let extensionLists = ["pdf", "doc", "docx"];
        return extensionLists.indexOf(fName.split(".").pop()) > -1;
    };
    const handleKeyPress = (target) => {
        if (target.charCode == 13) {
            submit();
        }
    }
    const submit = () => {
        // if (!full_name) {
        //     toast.error("Please enter full name");
        //     setValidName(false);
        //     return;
        // }
        // if (!isValidtitle) {
        //     toast.error("Please select Title");
        //     setValidTitle(false);
        //     return;
        // }
        if (process.env.CLIENT_NAME !== "cc") {
            if (!user.code) {
                toast.error(t(props.language?.layout?.toast115_nt));
                setShow_errors({ ...show_errors, validCode: false });
                return;
            }
        }
        // if (!user.title) {
        //     toast.error("Please select Title.");
        //     setShow_errors({ ...show_errors, isValidtitle: false });
        //     setValidTitle(false);
        //     return;
        // }
        if (!user.first_name) {
            toast.error(t(props.language?.layout?.toast5_nt));
            setShow_errors({ ...show_errors, isValidName: false });
            return;
        }
        if (!user.last_name) {
            toast.error(t(props.language?.layout?.toast6_nt));
            setShow_errors({ ...show_errors, validLastName: false });
            return;
        }
        if(!regexExp.test(user.email.split("@")[0])){
            toast.error(t(props.language?.layout?.toast7_nt));
            setShow_errors({ ...show_errors, validEmail: false });
            return;
        }
        if (!regex.test(user.email)){
            toast.error(t(props.language?.layout?.toast7_nt));
            setShow_errors({ ...show_errors, validEmail: false });
            return;
        }
        // validate(user.email);
        // if (!res) {
        //     toast.error(t(props.language?.layout?.toast7_nt));
        //     setShow_errors({ ...show_errors, validEmail: false });
        //     return;
        // }
        if (user.resume_file && !isValidFileType(user.resume_file.name)) {
            toast.error(t(props.language?.layout?.toast43_nt));
            return;
        }
        if (user.resume_file && user.resume_file.size > 1000000) {
            toast.error(t(props.language?.layout?.toast61_nt));
            return;
        }
        // if (password.length < 8) {
        //     toast.error("Please enter valid password at least 8 containing numbers");
        //     setValidPassword(false);
        //     return;
        // } else {
        //     singnUp();
        // }
        if (user.password !== user.cnfPassword) {
            toast.error(t(props.language?.layout?.msg_68));
            setShow_errors({ ...show_errors, validReCnfPass: false });
            return;
        }
        if (user.password.length < 8) {
            toast.error(t(props.language?.layout?.toast96_nt));
            setShow_errors({ ...show_errors, validPassword: false });
            return;
        }
        if (!regexp.test(user.password)) {
            toast.error(
                t(props.language?.layout?.toast96_nt)
            );
            setShow_errors({ ...show_errors, validPassword: false });
            return;
        }
        if (!user.area_code) {
            toast.error(t(props.language?.layout?.toast8_nt));
            setShow_errors({ ...show_errors, validAreaCode: false });
            return;
        }
        if (user.phone.length !== 10) {
            toast.error(t(props.language?.layout?.toast9_nt));
            setShow_errors({ ...show_errors, validPhoneNumber: false });
            return;
        } else {
            singnUp();
        }
        setShow_errors({ ...show_errors, disable: true });

    };
    const singnUp = () => {
        let formData = new FormData();
        // formData.append("full_name", full_name);
        formData.append("title", user.title);
        formData.append("first_name", user.first_name);
        formData.append("last_name", user.last_name);
        formData.append("email", user.email);
        formData.append("phone", user.phone);
        formData.append("password", user.password);
        formData.append("area_code", user.area_code);
        formData.append("resume_file", user.resume_file);
        // formData.append("language_preference", user.language);
        formData.append("language_preference", props.languageName);
        formData.append("set_password", "no");
        formData.append("key", user.code);
        Axios({
            method: "post",
            url: "/api/v1/register",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                if (response.data.status === 201) {
                    setTimeout(() => {
                        history.push(process.env.CLIENT_NAME === "microsoft" ? "/login" : "/new_signin");
                    }, 5000);
                    toast.success(t(props.language?.layout?.toast128_nt));
                }
                return;
            })
            .catch((error) => {
                toast.error(t(props.language?.layout?.toast130_nt) || t(props.language?.layout?.toast53_nt));
                setShow_errors({ ...show_errors, disable: false });
                setShow_errors({ ...show_errors, validCode: false });
                return;
            });
    };
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-4 p-0 login_image d-flex flex-column">
                        <img className="img-fluid m-0 p-0" src="/images/login.jpg" alt="image" />
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-7 mx-auto px-3">
                        <div className="auth-trans-bg rounded pt-1">
                            <div className="mt-4 text-center">
                                <a href="/" className="navbar-brand">
                                    <img
                                        alt="microsoft"
                                        // src="/uploads/user_v1llv353bppo/career_connector.jpg"
                                        src={props?.tenantTheme.banner}
                                        style={{ height: "3rem" }}
                                    />
                                </a>
                                {/* {props.isloading === false ? (
                            isValidThemeLogo(props.theme.logo) ? (
                                <a href="/" className="navbar-brand">
                                    <img alt="microsoft" src={props.theme.logo} class="logo img-fluid" />
                                </a>
                            ) : (
                                <a href="/" className="navbar-brand">
                                    <img alt="microsoft" src="/images/logo.png" class="logo img-fluid" />
                                </a>
                            )
                        ) : (
                            <div></div>
                        )} */}
                            </div>
                            {/* <div className="col-md-12">
                            <div>
                                <a
                                    className="text-decoration-none"
                                    href="https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78kvfdrrf0n50i&redirect_uri=https://dev.simplifyhire.net/search&state=123456&scope=r_liteprofile%20r_emailaddress%20w_member_social">
                                    <span className="text-decoration-none" style={{ cursor: "pointer" }}>
                                        <button type="submit" className="btn btn-light btn-lg btn-block rounded-0 mt-3">
                                            <img
                                                src="/svgs/social/linkedin_solid.svg"
                                                alt="Linkedin"
                                                className="svg-sm mx-2 mb-1"
                                            />
                                            Sign in with Linkedin
                                        </button>
                                    </span>
                                </a>
                            </div>
                        </div> */}
                            <div className="col-md-12" onKeyPress={handleKeyPress}>
                                {process.env.CLIENT_NAME === "cc" ? (
                                    ""
                                ) : (
                                    <div className="form-group animated">
                                        <label
                                            className={
                                                show_errors.validCode
                                                    ? "form-label-active text-green"
                                                    : "form-label-active text-danger bg-white"
                                            }
                                            for="code">
                                            <abbr
                                                title="Please contact your respective Skilling Partner, to get your sign-up code."
                                                className="text-decoration-none">
                                                {t(props.language?.layout?.seeker_signupcode)}
                                            </abbr>
                                        </label>
                                        <input
                                            type="text"
                                            className={
                                                show_errors.validCode ? "form-control" : "form-control border-danger"
                                            }
                                            required
                                            minlength="8"
                                            maxlength="8"
                                            pattern="[A-Z][0-9]{10}"
                                            aria-label="code"
                                            required
                                            name="code"
                                            id="id_code"
                                            value={user.code}
                                            onChange={(e) => {
                                                setUser({ ...user, code: e.target.value });
                                                setShow_errors({ ...show_errors, validCode: true });
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div class="form-group animated">
                                            <label
                                                className={
                                                    show_errors.isValidtitle
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="title">
                                                {t(props.language?.layout?.seeker_title)}
                                            </label>
                                            <select
                                                className={
                                                    show_errors.isValidtitle
                                                        ? "form-control"
                                                        : "form-control border-danger"
                                                }
                                                id="sel1"
                                                aria-label="title"
                                                onChange={(e) => {
                                                    setUser({ ...user, title: e.target.value });
                                                    setShow_errors({ ...show_errors, isValidtitle: true });
                                                }}>
                                                <option disabled selected>
                                                    {t(props.language?.layout?.seeker_select)}
                                                </option>
                                                <option value="mr">
                                                    {t(props.language?.layout?.seeker_selectoption_mr)}
                                                </option>
                                                <option value="mrs">
                                                    {t(props.language?.layout?.seeker_selectoption_ms)}
                                                </option>
                                                <option value="mrs">
                                                    {t(props.language?.layout?.seeker_selectoption_mrs)}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="form-group animated">
                                            <label
                                                className={
                                                    show_errors.isValidName
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="first_name">
                                                {t(props.language?.layout?.seeker_firstname)}
                                            </label>
                                            <input
                                                type="text"
                                                className={
                                                    show_errors.isValidName
                                                        ? "form-control"
                                                        : "form-control border-danger"
                                                }
                                                name="first_name"
                                                aria-label="first_name"
                                                required
                                                id="id_first_name"
                                                value={user.first_name}
                                                onChange={(e) => {
                                                    setUser({ ...user, first_name: e.target.value });
                                                    setShow_errors({ ...show_errors, isValidName: true });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group animated">
                                            <label
                                                className={
                                                    show_errors.validLastName
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="first_name">
                                                {t(props.language?.layout?.seeker_lastname)}
                                            </label>

                                            <input
                                                type="text"
                                                className={
                                                    show_errors.validLastName
                                                        ? "form-control"
                                                        : "form-control border-danger"
                                                }
                                                name="last_name"
                                                aria-label="last_name"
                                                required
                                                id="id_last_name"
                                                autofocus
                                                value={user.last_name}
                                                onChange={(e) => {
                                                    setUser({ ...user, last_name: e.target.value });
                                                    setShow_errors({ ...show_errors, validLastName: true });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="form-group animated">
                                    <label
                                        className={
                                            show_errors.validEmail
                                                ? "form-label-active text-green"
                                                : "form-label-active text-danger bg-white"
                                        }
                                        for="email">
                                        {t(props.language?.layout?.seeker_email)}
                                    </label>
                                    <input
                                        type="email"
                                        className={
                                            show_errors.validEmail ? "form-control" : "form-control border-danger"
                                        }
                                        name="email"
                                        aria-label="email"
                                        autocomplete="off"
                                        required
                                        id="id_email"
                                        value={user.email}
                                        onChange={(e) => {
                                            setUser({ ...user, email: e.target.value });
                                            setShow_errors({ ...show_errors, validEmail: true });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group animated">
                                            <label
                                                className={
                                                    show_errors.validPassword
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="password">
                                                {t(props.language?.layout?.seeker_password)}
                                            </label>
                                            <input
                                                type={!show_errors.showPassword ? "password" : "text"}
                                                className={
                                                    show_errors.validPassword
                                                        ? "form-control mb-3"
                                                        : "form-control mb-3 border-danger"
                                                }
                                                id="password1"
                                                aria-label="password"
                                                name="password1"
                                                // role="button"
                                                required
                                                value={user.password}
                                                onChange={(e) => {
                                                    setUser({ ...user, password: e.target.value });
                                                    setShow_errors({ ...show_errors, validPassword: true });
                                                }}
                                            />
                                            <div className="d-flex justify-content-end mr-3">
                                                <a className="icon-invert mt-n5 mb-4">
                                                    {!show_errors.showPassword && (
                                                        <img
                                                            src="/svgs/icons_new/eye.svg"
                                                            alt="eye-slash-icon"
                                                            className="svg-sm"
                                                            id="eyeIcon"
                                                            tabIndex="0"
                                                            onClick={() => showHidePwd(true)}
                                                            onKeyPress={() => showHidePwd(true)}
                                                        />
                                                    )}
                                                    {show_errors.showPassword && (
                                                        <img
                                                            src="/svgs/icons_new/eye-off.svg"
                                                            alt="eye-slash-icon"
                                                            className="svg-sm "
                                                            id="eyeSlashIcon"
                                                            tabIndex="0"
                                                            onClick={() => showHidePwd(false)}
                                                            onKeyPress={() => showHidePwd(false)}
                                                        />
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group animated">
                                            <label
                                                className={
                                                    show_errors.validReCnfPass
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="password">
                                                {t(props.language?.layout?.seeker_confirmpasswod)}
                                            </label>
                                            <input
                                                // type="text"
                                                type={show_errors.showCnfPass ? "text" : "password"}
                                                className={
                                                    show_errors.validReCnfPass
                                                        ? "form-control mb-3"
                                                        : "form-control mb-3 border-danger"
                                                }
                                                id="password2"
                                                aria-label="cnfpassword"
                                                // role="button"
                                                name="password2"
                                                required
                                                value={user.cnfPassword}
                                                onChange={(e) => {
                                                    setUser({ ...user, cnfPassword: e.target.value });
                                                    setShow_errors({ ...show_errors, validReCnfPass: true });
                                                }}
                                            />
                                            <div className="d-flex justify-content-end mr-3">
                                                {/* <a className="mt-n5 mb-4" > */}
                                                <a className="icon-invert mt-n5 mb-4">
                                                    {!show_errors.showCnfPass && (
                                                        <img
                                                            src="/svgs/icons_new/eye.svg"
                                                            alt="eye-slash-icon"
                                                            className="svg-sm"
                                                            id="eyeIcon"
                                                            tabIndex="0"
                                                            onClick={() => showHideCnfPass(true)}
                                                            onKeyPress={() => showHideCnfPass(true)}
                                                        />
                                                    )}
                                                    {show_errors.showCnfPass && (
                                                        <img
                                                            src="/svgs/icons_new/eye-off.svg"
                                                            alt="eye-slash-icon"
                                                            className="svg-sm "
                                                            id="eyeSlashIcon"
                                                            tabIndex="0"
                                                            onClick={() => showHideCnfPass(false)}
                                                            onKeyPress={() => showHideCnfPass(false)}
                                                        />
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 mb-3 mt-n3">
                                <div className="row">
                                    <div className="col-xs-12 col-md-5">
                                        <div className="form-group animated">
                                            {/* <label
                                            className={
                                                validAreaCode
                                                    ? "form-label-active "
                                                    : "form-label-active text-danger bg-white "
                                            }
                                            for="area-code">
                                            Country *
                                        </label> */}
                                            {/* <div className="d-flex justify-content-end mr-3 position-relative signupwrap">
                                            <a className="mt-n5 mb-4">
                                                <img
                                                    src="/svgs/icons_new/chevron-down.svg"
                                                    alt="dropdown"
                                                    className="svg-sm d-none"
                                                    id="dropicon"
                                                />
                                            </a>
                                        </div>
                                        <input
                                            id="area_code"
                                            type="text"
                                            name="isdCodeInput"
                                            className="form-control input w-100"
                                            defaultValue={area_code}
                                            value={area_code}
                                            style={styleObj}
                                        />
                                        <select
                                            className={
                                                validAreaCode
                                                    ? "form-control w-100"
                                                    : "form-control w-100 border-danger"
                                            }
                                            name="area_code"
                                            required
                                            id="id_area_code"
                                            style={id_area_code}
                                            onChange={(e) => {
                                                selectOption(e);
                                                setValidAreaCode(true);
                                            }}>
                                            <option disabled selected>
                                                Area Code
                                            </option>
                                            {countryList.slice(0, 2).map((option) => (
                                                <option data-countryCode={option.countryCode} value={option.value}>
                                                    {option.content}
                                                </option>
                                            ))}
                                            <option disabled="disabled">Other Countries</option>
                                            {countryList.slice(2).map((option) => (
                                                <option data-countryCode={option.countryCode} value={option.value}>
                                                    {option.content}
                                                </option>
                                            ))}
                                        </select> */}
                                            <label
                                                className={
                                                    show_errors.validAreaCode
                                                        ? "form-label-active text-green "
                                                        : "form-label-active text-danger bg-white "
                                                }
                                                for="area-code">
                                                {t(props.language?.layout?.seeker_areacode)}
                                            </label>
                                            <select
                                                className="form-control"
                                                aria-label="country"
                                                onChange={(e) => {
                                                    setUser({ ...user, area_code: e.target.value });
                                                    setShow_errors({ ...show_errors, validAreaCode: true });
                                                }}>
                                                <option selected="" className="d-none">
                                                    {t(props.language?.layout?.seeker_select_1)}
                                                </option>
                                                <option value="USA +1">
                                                    {" "}
                                                    {t(props.language?.layout?.seeker_selectoption_usa)}
                                                </option>
                                                <option value="Canada +1">
                                                    Canada +1
                                                </option>
                                                <option value="Australia +61" disabled>
                                                    {t(props.language?.layout?.seeker_selectoption_austalia)}
                                                </option>
                                                <option value="Brazil +55" disabled>
                                                    {t(props.language?.layout?.seeker_selectoption_brazil)}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-md-7">
                                        <div className="form-group animated">
                                            <label
                                                className={
                                                    show_errors.validPhoneNumber
                                                        ? "form-label-active text-green z-index4"
                                                        : "form-label-active text-danger bg-white z-index4"
                                                }
                                                for="telephone">
                                                {t(props.language?.layout?.seeker_phone)}
                                            </label>
                                            <input
                                                type="number"
                                                className={
                                                    show_errors.validPhoneNumber
                                                        ? "form-control"
                                                        : "form-control border-danger"
                                                }
                                                minlength="10"
                                                maxlength="10"
                                                required
                                                aria-label="phone"
                                                pattern="[0-9]{10}"
                                                required
                                                name="phone"
                                                id="id_phone"
                                                value={user.phone}
                                                onChange={(e) => {
                                                    setUser({
                                                        ...user,
                                                        phone: Math.max(0, parseInt(e.target.value, 10))
                                                            .toString()
                                                            .slice(0, 10),
                                                    });
                                                    setShow_errors({ ...show_errors, validPhoneNumber: true });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group animated">
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            name="resume_file"
                                            accept="application/pdf,.doc,.docx"
                                            class="custom-file-input"
                                            id="customFile"
                                            // role="button"
                                            title="Resume Upload"
                                            onChange={(e) => uploadResume(e)}
                                        />
                                        {/* <input
                                        tabIndex="0"
                                        onChange={(e) => uploadResume(e)}
                                        type="file"
                                        name="resume_file"
                                        className="custom-file-input d-none"
                                        id="select-file"
                                        accept="application/pdf,.doc,.docx"
                                    /> */}
                                        <label
                                            // tabIndex="0"
                                            className="custom-file-label mt-2"
                                            for="select-file"
                                            id="file-uploaded"
                                            data-browse={user.browseValue}>
                                            {user.resume_file.name ||
                                                t(props.language?.layout?.seeker_resume_placeholder_text)}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-md-12 mb-3 mt-n4">
                                <div className="form-group animated">
                                    <label
                                        className="form-label-active text-green"
                                        for="languagepreference">
                                        Preferred Language
                                    </label>
                                    <select
                                        aria-label="language"
                                        name="locale"
                                        className="form-control"
                                        onChange={(e) => setUser({ ...user, language: e.target.value })}
                                    >
                                        <option selected disabled>Select language</option>
                                        <option value="en">English</option>
                                        <option value="esp">Spanish</option>
                                    </select>
                                </div>
                            </div> */}
                            <div className="col-md-12">
                                <p className="text-muted">
                                    {" "}
                                    {t(props.language?.layout?.seeker_resume_uploadinginstruction)}
                                </p>
                                <p>
                                    {t(props.language?.layout?.seeker_signup_terms_and_conditions1)}
                                    <Link to="/terms-of-service" target="_blank">
                                        &nbsp;{t(props.language?.layout?.termsofservice)}
                                    </Link>,&nbsp;
                                    <Link to="/privacy-policy" target="_blank" style={{lineBreak: "anywhere"}}>
                                        {/* {t(props.language?.layout?.seeker_signup_terms_and_conditions2)} */}
                                        {/* {t(props.language?.layout?.privacypolicy)} */}
                                        {t(props.language?.layout?.simplify_pp)}
                                    </Link>
                                    {t(props.language?.layout?.faq_geninfo_a9_7)}&nbsp;
                                    <a href="https://privacy.microsoft.com/en-gb/privacystatement" target="_blank">{t(props.language?.layout?.microsoft_pp)}</a>.
                                </p>
                                <button
                                    type="submit"
                                    disabled={show_errors.disable === true}
                                    aria-label="signup"
                                    className="btn btn-primary btn-lg btn-block rounded-0 apply-button-background"
                                    onClick={submit}>
                                    {t(props.language?.layout?.seeker_submit)}
                                </button>
                                {/* <Link to="/signup/nonProfitPartner" className="btn btn-light btn-lg btn-block rounded-0 mb-3 mt-3">
                                Sign Up as Partner
                            </Link> */}
                                {/* <button type="submit" className="btn btn-light btn-lg btn-block rounded-0 mb-3 mt-3">
                            <img src="/svgs/social/linkedin_solid.svg" alt="Linkedin" className="svg-sm mx-2 mb-1" />
                            Sign in with Linkedin
                        </button> */}
                                <p className="text-center m-3">
                                    {t(props.language?.layout?.seeker_signup_login1)}{" "}
                                    <a href={process.env.CLIENT_NAME === "microsoft" ? "/login" : "/new_signin"}>
                                        {" "}
                                        {t(props.language?.layout?.seeker_signup_login2)}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
function mapStateToProps(state) {
    // console.log("state ", state);
    return {
        userToken: state.authInfo.userToken,
        refreshToken: state.authInfo.refreshToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
        tenantTheme: state.authInfo.tenantTheme
    };
}

export default connect(mapStateToProps)(Signup);
