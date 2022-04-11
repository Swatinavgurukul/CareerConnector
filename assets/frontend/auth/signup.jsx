import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSession } from "../components/SessionProvider.jsx";
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getQueryParameters } from "../modules/helpers.jsx";
import GoogleSocialAuth from "./googleLogin.jsx";
import { countryList } from "./countryList.jsx";
import { validate, res } from "react-email-validator";
import { isValidThemeLogo } from "../modules/helpers.jsx";
import { _setAuthData } from "../actions/actionsAuth.jsx";
import { connect } from "react-redux";

function Signup(props) {
    const history = useHistory();
    const [full_name, setFullName] = useState("");
    const [title, setTitle] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [phone, setphone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setPasswordFlag] = useState(false);
    const [disable, setDisable] = useState(false);
    const [resume_file, setResume] = useState("");
    const [area_code, setAreaCode] = useState("");
    const [browseValue, setBrowseValue] = useState("Choose File");
    const [validCode, setValidCode] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [validPhoneNumber, setValidPhoneNumber] = useState(true);
    const [validName, setValidName] = useState(true);
    const [validAreaCode, setValidAreaCode] = useState(true);
    const [validLastName, setValidLastName] = useState(true);
    const [isValidName, setIsValidName] = useState(true);
    const [isValidtitle, setValidTitle] = useState(true);
    const [cnfPassword, setCnfPassword] = useState("");
    const [validReCnfPass, setValidCnfPass] = useState(true);
    const [visible, setVisible] = useState(false);
    const regexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

    const styleObj = {
        opacity: 1,
        marginBottom: "-42px",
    };
    const id_area_code = {
        zIndex: "1",
    };
    useEffect(() => {
        const urlPath = history.location.pathname;
        console.log("urlPath", urlPath);
    }, []);
    const showHidePwd = (value) => {
        setPasswordFlag(value);
    };
    const uploadResume = (e) => {
        if (e.target.files.length > 0) {
            let files = e.target.files[0];
            setResume(files);
            setBrowseValue("x");
        } else {
            setResume({ name: "Upload Resume (Optional)" }); // file state to default (no file)
            setBrowseValue("Choose File");
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
        if (!first_name) {
            toast.error("Please enter first name");
            setIsValidName(false);
            return;
        }
        if (!last_name) {
            toast.error("Please enter last name");
            setValidLastName(false);
            return;
        }
        validate(email);
        if (!res) {
            toast.error("Please enter valid email");
            setValidEmail(false);
            return;
        }
        if (!code) {
            toast.error("Please enter your valid sign up code");
            setValidCode(false);
            return;
        }
        if (!area_code) {
            toast.error("Please enter area code");
            setValidAreaCode(false);
            return;
        }

        if (!code) {
            toast.error("Please enter your valid sign up code");
            setValidCode(false);
            return;
        }
        if (resume_file && !isValidFileType(resume_file.name)) {
            toast.error("Please choose pdf or doc file");
            return;
        }
        if (resume_file && resume_file.size > 1000000) {
            toast.error("File size should be less than 1MB");
            return;
        }
        // if (password.length < 8) {
        //     toast.error("Please enter valid password at least 8 containing numbers");
        //     setValidPassword(false);
        //     return;
        // } else {
        //     singnUp();
        // }
        if (password !== cnfPassword) {
            toast.error("The passwords you entered do not match");
            setValidCnfPass(false);
            return;
        }
        if (password.length < 8) {
            toast.error(
                "Your password must be at least 8 characters long, contain at least one number, at least one special character and have a mixture of uppercase and lowercase letters."
            );
            setValidPassword(false);
            return;
        }
        if (!regexp.test(password)) {
            toast.error(
                "Your password must be at least 8 characters long, contain at least one number, at least one special character and have a mixture of uppercase and lowercase letters."
            );
            setValidPassword(false);
            return;
        }
        if (phone.length !== 10) {
            toast.error("Please enter your valid phone number");
            setValidPhoneNumber(false);
            return;
        } else {
            singnUp();
        }
        setDisable(true);
    };
    const singnUp = () => {
        let formData = new FormData();
        // formData.append("full_name", full_name);
        // formData.append("title", title);
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("password", password);
        formData.append("area_code", area_code);
        formData.append("resume_file", resume_file);
        formData.append("set_password", "no");
        formData.append("key", code);
        Axios({
            method: "post",
            url: "/api/v1/register",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                if (response.data.status === 201) {
                    // console.log(response.data.data);
                    setTimeout(() => {
                        history.push("/login");
                    }, 5000);
                    toast.success(response.data.message);
                    // updateUserFromToken(response.data.data.access_token, response.data.data.refresh_token);
                }
                return;
            })
            .catch((error) => {
                // console.log("error.response.status === ", error.response.data.status);
                if (error.response.data.status == "400") {
                    toast.error(error.response.data.data.email[0]);
                    setDisable(false);
                    return;
                }
                if (error.response.data.status == "401") {
                    toast.error(error.response.data.data);
                    setDisable(false);
                    setValidCode(false);
                    return;
                }
            });
    };
    const default_user_object = {
        authenticated: false,
        name: "",
        chat_id: "",
        is_user: true,
        user_id: null,
        role_id: null,
    };
    const updateUserFromToken = (access_token, refresh_token) => {
        let decoded = jwt_decode(access_token);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("expires_at", decoded.exp - 600); // 600 = 10 mins leeway time
        let user_object = Object.assign({}, default_user_object, {
            authenticated: true,
            user_id: decoded.user_id,
            is_user: decoded.is_user,
            name: decoded.full_name,
            role_id: decoded.role_id,
        });
        history.push("/");
        props._setAuthData(user_object, access_token, refresh_token);
    };
    const selectOption = (e) => {
        // console.log(e.target.value);
        setAreaCode(e.target.value);
        // document.getElementById("area_code").style.opacity = "1";
        // document.getElementById("id_area_code").style.opacity = "0";
        // document.getElementById("dropicon").classList.remove("d-none");
    };
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 p-0 login_image d-flex flex-column">
                        <img className="img-fluid m-0 p-0" src="/images/login.jpg" alt="image" />
                    </div>
                    <div className="col-md-offset-4 col-md-4 m-auto px-3">
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
                                <div className="form-group animated">
                                    <label
                                        className={
                                            validCode ? "form-label-active text-green" : "form-label-active text-danger bg-white"
                                        }
                                        for="code">
                                        <abbr
                                            title="Please contact your respective Skilling Partner, to get your sign-up code."
                                            className="text-decoration-none">
                                            SignUp Code*
                                        </abbr>
                                    </label>
                                    <input
                                        type="text"
                                        className={validCode ? "form-control" : "form-control border-danger"}
                                        required
                                        minlength="8"
                                        maxlength="8"
                                        pattern="[A-Z][0-9]{10}"
                                        aria-label="code"
                                        required
                                        name="code"
                                        id="id_code"
                                        value={code}
                                        onChange={(e) => {
                                            setCode(e.target.value);
                                            setValidCode(true);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div class="form-group animated">
                                            <label
                                                className={
                                                    isValidtitle
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="title">
                                                Title
                                            </label>
                                            <select
                                                class="form-control"
                                                id="sel1"
                                                aria-label="title"
                                                onChange={(e) => {
                                                    setTitle(e.target.value);
                                                    setValidTitle(true);
                                                }}>
                                                <option disabled selected>
                                                    select
                                                </option>
                                                <option value="mr">Mr.</option>
                                                <option value="mrs">Ms.</option>
                                                <option value="mrs">Mrs.</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="form-group animated">
                                            <label
                                                className={
                                                    isValidName
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="first_name">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                className={isValidName ? "form-control" : "form-control border-danger"}
                                                name="first_name"
                                                aria-label="first_name"
                                                required
                                                id="id_first_name"
                                                value={first_name}
                                                onChange={(e) => {
                                                    setFirstName(e.target.value);
                                                    setIsValidName(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group animated">
                                            <label
                                                className={
                                                    validLastName
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="first_name">
                                                Last Name *
                                            </label>

                                            <input
                                                type="text"
                                                className={validLastName ? "form-control" : "form-control border-danger"}
                                                name="last_name"
                                                aria-label="last_name"
                                                required
                                                id="id_last_name"
                                                autofocus
                                                value={last_name}
                                                onChange={(e) => {
                                                    setLastName(e.target.value);
                                                    setValidLastName(true);
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
                                            validEmail ? "form-label-active text-green" : "form-label-active text-danger bg-white"
                                        }
                                        for="email">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        className={validEmail ? "form-control" : "form-control border-danger"}
                                        name="email"
                                        aria-label="email"
                                        autocomplete="off"
                                        required
                                        id="id_email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setValidEmail(true);
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
                                                    validPassword
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="password">
                                                Password *
                                            </label>
                                            <input
                                                type={!showPassword ? "password" : "text"}
                                                className={
                                                    validPassword ? "form-control mb-3" : "form-control mb-3 border-danger"
                                                }
                                                id="password1"
                                                aria-label="password"
                                                name="password1"
                                                role="button"
                                                required
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    setValidPassword(true);
                                                }}
                                            />
                                            <div className="d-flex justify-content-end mr-3">
                                                <a className="icon-invert mt-n5 mb-4">
                                                    {!showPassword && (
                                                        <img
                                                            src="/svgs/icons_new/eye.svg"
                                                            alt="eye-slash-icon"
                                                            className="svg-sm"
                                                            id="eyeIcon"
                                                            tabIndex="0"
                                                            onClick={() => showHidePwd(true)}
                                                        />
                                                    )}
                                                    {showPassword && (
                                                        <img
                                                            src="/svgs/icons_new/eye-off.svg"
                                                            alt="eye-slash-icon"
                                                            className="svg-sm "
                                                            id="eyeSlashIcon"
                                                            tabIndex="0"
                                                            onClick={() => showHidePwd(false)}
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
                                                    validReCnfPass
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="password">
                                                Confirm Password*
                                            </label>
                                            <input
                                                // type="text"
                                                type={visible ? "text" : "password"}
                                                className={
                                                    validReCnfPass ? "form-control mb-3" : "form-control mb-3 border-danger"
                                                }
                                                id="password2"
                                                aria-label="cnfpassword"
                                                role="button"
                                                name="password2"
                                                required
                                                value={cnfPassword}
                                                onChange={(e) => {
                                                    setCnfPassword(e.target.value);
                                                    setValidCnfPass(true);
                                                }}
                                            />
                                            <div className="d-flex justify-content-end mr-3">
                                                {/* <a className="mt-n5 mb-4" > */}
                                                <a className="icon-invert mt-n5 mb-4" onClick={(e) => setVisible(!visible)}>
                                                    {/* <img src="/svgs/icons_new/eye-off.svg" alt="eye-slash-icon" className="svg-sm " id="eyeSlashIcon" /> */}
                                                    <img
                                                        src={
                                                            visible
                                                                ? "/svgs/icons_new/eye-off.svg"
                                                                : "/svgs/icons_new/eye.svg"
                                                        }
                                                        alt="eye-slash-icon"
                                                        className="svg-sm"
                                                        id="eyeIcon1 "
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 mb-3">
                                <div className="row">
                                    <div className="col-xs-12 col-md-4">
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
                                                    validAreaCode
                                                        ? "form-label-active text-green "
                                                        : "form-label-active text-danger bg-white "
                                                }
                                                for="area-code">
                                                Area Code *
                                            </label>
                                            <select
                                                className="form-control"
                                                aria-label="country"
                                                onChange={(e) => {
                                                    selectOption(e);
                                                    setValidAreaCode(true);
                                                }}>
                                                <option selected="" className="d-none">
                                                    select
                                                </option>
                                                <option value="USA">USA +1</option>
                                                <option value="Australia +61" disabled>
                                                    Australia
                                                </option>
                                                <option value="Brazil +55" disabled>
                                                    Brazil
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-md-8">
                                        <div className="form-group animated">
                                            <label
                                                className={
                                                    validPhoneNumber
                                                        ? "form-label-active text-green"
                                                        : "form-label-active text-danger bg-white"
                                                }
                                                for="telephone">
                                                Phone *
                                            </label>
                                            <input
                                                type="number"
                                                className={validPhoneNumber ? "form-control" : "form-control border-danger"}
                                                minlength="10"
                                                maxlength="10"
                                                required
                                                aria-label="phone"
                                                pattern="[0-9]{10}"
                                                required
                                                name="phone"
                                                id="id_phone"
                                                value={phone}
                                                onChange={(e) => {
                                                    setphone(
                                                        Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 10)
                                                    );
                                                    setValidPhoneNumber(true);
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
                                            role="button"
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
                                            data-browse={browseValue}
                                        >
                                            {resume_file.name || "Upload Resume (Optional)"}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <p className="text-muted">Upload Resume in only pdf, docx or doc format.</p>
                                <p>
                                    By clicking Sign up I agree to the{" "}
                                    <Link to="/privacy-policy" target="_blank">
                                        Terms & Conditions
                                    </Link>
                                </p>
                                <button
                                    type="submit"
                                    disabled={disable === true}
                                    aria-label="signup"
                                    className="btn btn-primary btn-lg btn-block rounded-0 apply-button-background"
                                    onClick={submit}>
                                    Sign Up
                                </button>
                                {/* <Link to="/signup/nonProfitPartner" className="btn btn-light btn-lg btn-block rounded-0 mb-3 mt-3">
                                Sign Up as Partner
                            </Link> */}
                                {/* <button type="submit" className="btn btn-light btn-lg btn-block rounded-0 mb-3 mt-3">
                            <img src="/svgs/social/linkedin_solid.svg" alt="Linkedin" className="svg-sm mx-2 mb-1" />
                            Sign in with Linkedin
                        </button> */}
                                <p className="text-center m-3">
                                    Already Signed Up? <a href="/login"> Login</a>
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
        tenantTheme: state.authInfo.tenantTheme
    };
}

export default connect(mapStateToProps, { _setAuthData })(Signup);
