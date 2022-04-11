import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { getQueryParameters } from "../modules/helpers.jsx";
import { toast } from "react-toastify";
import GoogleSocialAuth from "./googleLogin.jsx";
import { countryList } from "./countryList.jsx";
import { validate, res } from "react-email-validator";
import { connect } from "react-redux";
import { _setAuthData } from "../actions/actionsAuth.jsx";
import jwt_decode from "jwt-decode";
import { useTranslation } from "react-i18next";

function CorporatePartner(props) {
    const { t } = useTranslation();
    const history = useHistory();
    const [partnerType, setPartnerType] = useState("");
    const [organisationName, setOrganisationName] = useState("");
    const [title, setTitle] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [area_code, setAreaCode] = useState("");
    const [phone, setphone] = useState("");
    const [disable, setDisable] = useState(false);
    const [isValidOrgName, setIsValidOrgName] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [validAreaCode, setValidAreaCode] = useState(true);
    const [validPhoneNumber, setValidPhoneNumber] = useState(true);
    const [validLastName, setValidLastName] = useState(true);
    const [isValidName, setIsValidName] = useState(true);
    const [istitle, setValidTitle] = useState(true);

    const default_user_object = {
        authenticated: false,
        name: "",
        chat_id: "",
        is_user: true,
        user_id: null,
        role_id: null,
    };
    // useEffect(() => {
    //     const urlPath = history.location.search;
    //     console.log("urlPath", urlPath)
    // }, []);
    const styleObj = {
        opacity: 1,
        marginBottom: "-42px",
    };
    const id_area_code = {
        zIndex: "1",
    };
    const handleKeyPress = (target) => {
        if (target.charCode == 13) {
            submit();
        }
    }
    const submit = () => {
        // if (!partnerType) {
        //     toast.error("Please select a partner type");
        //     return;
        // }
        if (!organisationName) {
            toast.error("Please enter Organization name");
            setIsValidOrgName(false);
            return;
        }
        // if (!istitle) {
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
        if (!area_code) {
            toast.error("Please enter area code");
            setValidAreaCode(false);
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
    // console.log("non-profit partner", partnerType);
    const singnUp = () => {
        let formData = new FormData();
        // formData.append("title", title);
        formData.append("tenant_name", organisationName);
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("email", email);
        formData.append("area_code", area_code);
        formData.append("phone", phone);
        Axios({
            method: "post",
            url: "/api/v1/register/hiring",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                if (response.data.status === 201) {
                    setTimeout(() => {
                        history.push("/login");
                    }, 5000);
                    //   toast.success(response.data.message);
                    toast.success("You Have Successfully Registered");
                    //   updateUserFromToken(response.data.data.access_token, response.data.data.refresh_token);
                    //   history.push("/dashboard");
                }
                return;
            })
            .catch(function (error) {
                if (error.response.data.status == "400") {
                    toast.error(error.response.data.data.email[0]);
                    setDisable(false);
                    return;
                }
                if (error.response.data.status == "401") {
                    toast.error(error.response.data.data);
                    setDisable(false);
                    return;
                }
            });
    };
    const updateUserFromToken = (access_token, refresh_token) => {
        // console.log("here", access_token, refresh_token);
        let decoded = jwt_decode(access_token);
        localStorage.setItem("access_token", access_token);
        let user_object = Object.assign({}, default_user_object, {
            authenticated: true,
            user_id: decoded.user_id,
            is_user: decoded.is_user,
            name: decoded.first_name,
            role_id: decoded.role_id,
        });

        props._setAuthData(user_object, access_token, refresh_token, decoded.exp - 600);
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
            <div className="container-fluid h-100">
                <div className="row">
                    <div className="col-md-4 p-0 login_image d-flex flex-column">
                        <img className="img-fluid m-0 p-0" src="/images/login.jpg" alt="image" />
                    </div>
                    <div className="col-md-offset-4 col-md-4 m-auto px-3">
                        <div className="auth-trans-bg rounded pt-1">
                            <div className="mt-5 text-center">
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
                            <div onKeyPress={handleKeyPress}>
                                <div className="col-md-12">
                                    <div className="form-group animated mt-4">
                                        <div className="d-flex justify-content-around">
                                            <div className="form-check custom-radio">
                                                <input
                                                    class="form-check-input"
                                                    type="radio"
                                                    aria-label="corporatate"
                                                    value="corportate"
                                                    id="corporateCheck"
                                                    name="partnerType"
                                                    onChange={(e) => setPartnerType("corportate")}
                                                    checked
                                                />
                                                <label class="form-check-label user-select-none" for="corporateCheck">
                                                    Signup as Employer Partner
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group animated">
                                        <label
                                            className={
                                                isValidOrgName ? "form-label-active" : "form-label-active text-danger bg-white"
                                            }
                                            for="organisationName">
                                            Organization Name *
                                        </label>

                                        <input
                                            type="text"
                                            className={isValidOrgName ? "form-control" : "form-control border-danger"}
                                            name="organisationName"
                                            aria-label="org_name"
                                            required
                                            maxlength="60"
                                            autofocus
                                            value={organisationName}
                                            onChange={(e) => {
                                                setOrganisationName(e.target.value);
                                                setIsValidOrgName(true);
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
                                                        istitle ? "form-label-active" : "form-label-active text-danger bg-white"
                                                    }
                                                    for="title">
                                                    Title
                                                </label>
                                                <select
                                                    class="form-control"
                                                    aria-label="select"
                                                    id="sel1"
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
                                                            ? "form-label-active"
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
                                                            ? "form-label-active"
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
                                                validEmail ? "form-label-active" : "form-label-active text-danger bg-white"
                                            }
                                            for="email">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            className={validEmail ? "form-control" : "form-control border-danger"}
                                            aria-label="email"
                                            name="email"
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
                                <div className="col-md-12 mb-3">
                                    <div className="row">
                                        <div className="col-xs-12 col-md-4">
                                            <div className="form-group animated">
                                                {/* <label
                                            className={
                                                validAreaCode
                                                    ? "form-label-active"
                                                    : "form-label-active text-danger bg-white"
                                            }
                                            for="area-code">
                                            Country *
                                        </label>
                                        <div className="d-flex justify-content-end mr-3 position-relative signupwrap">
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
                                                            ? "form-label-active "
                                                            : "form-label-active text-danger bg-white "
                                                    }
                                                    for="area-code">
                                                    Area Code *
                                                </label>
                                                <select
                                                    className="form-control"
                                                    aria-label="select"
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
                                                            ? "form-label-active"
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
                                                    aria-label="phone"
                                                    required
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
                                    <p className="mb-0">
                                        By clicking Sign up I agree to the{" "}
                                        <Link to="/privacy-policy" target="_blank">
                                            Terms & Conditions
                                        </Link>
                                    </p>
                                    <button
                                        type="submit"
                                        aria-label="sign_up"
                                        disabled={disable === true}
                                        className="btn btn-primary btn-lg btn-block rounded-0 my-4 apply-button-background"
                                        onClick={submit}>
                                        Sign Up
                                    </button>
                                    <p className="text-center">
                                        Already Signed Up? <a href="/login"> Login</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        tenantTheme: state.authInfo.tenantTheme
    };
}
export default connect(mapStateToProps, { _setAuthData })(CorporatePartner);
