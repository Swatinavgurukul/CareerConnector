import React, { useState } from "react";
import Axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { validate, res } from "react-email-validator";
import { connect } from "react-redux";
import { _setAuthData } from "../../frontend/actions/actionsAuth.jsx";
import { useTranslation } from "react-i18next"
import Modal from "react-bootstrap/Modal";
import SignUpPrivacyEp from "../../frontend/home/signUpPrivacyEp.jsx"

function CorporatePartner(props) {
    const { t } = useTranslation();
    const history = useHistory();
    let [openModel, setOpenModel] = useState(false);
    let [checked, setChecked] = useState(false);
    let [disable,setDisable]=useState(true);
    const [user, setUser] = useState({ first_name: "", last_name: "", organisationName: "", email: "", area_code: "", phone: "", title: "", partnerType: "", custom_field2: "", language: "en" });
    const [show_errors, setShow_errors] = useState({ disable: false, isValidOrgName: true, validEmail: true, isvalidAreaCode: true, isvalidPhoneNumber: true, isvalidLastName: true, isValidName: true, istitle: true });
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
    };
    const submit = () => {
        // if (!partnerType) {
        //     toast.error("Please select a partner type");
        //     return;
        // }

        if (!user.organisationName) {
            toast.error(t(props.language?.layout?.toast4_nt));
            setShow_errors({ ...show_errors, isValidOrgName: false });
            return;
        }
        // if (!user.title) {
        //     toast.error("Please select Title.");
        //     setShow_errors({ ...show_errors, istitle: false });
        //     // setValidTitle(false);
        //     return;
        // }
        if (!user.first_name) {
            toast.error(t(props.language?.layout?.toast5_nt));
            setShow_errors({ ...show_errors, isValidName: false });
            return;
        }
        if (!user.last_name) {
            toast.error(t(props.language?.layout?.toast6_nt));
            setShow_errors({ ...show_errors, isvalidLastName: false });
            return;
        }
        validate(user.email);
        if (!res) {
            toast.error(t(props.language?.layout?.toast7_nt));
            setShow_errors({ ...show_errors, validEmail: false });
            return;
        }
        if (!user.area_code) {
            toast.error(t(props.language?.layout?.toast8_nt));
            setShow_errors({ ...show_errors, isvalidAreaCode: false });
            return;
        }
        if (user.phone.length !== 10) {
            toast.error(t(props.language?.layout?.toast9_nt));
            setShow_errors({ ...show_errors, isvalidPhoneNumber: false });
            return;
        } else {
            singnUp();
        }
        setShow_errors({ ...show_errors, disable: true });
    };
    // console.log("user",user);
    const singnUp = () => {

        let formData = new FormData();
        formData.append("title", user.title);
        formData.append("tenant_name", user.organisationName);
        formData.append("first_name", user.first_name);
        formData.append("last_name", user.last_name);
        formData.append("email", user.email);
        formData.append("area_code", user.area_code);
        formData.append("phone", user.phone);
        formData.append("custom_field2", user.custom_field2);
        formData.append("language_preference", props.languageName);
        formData.append("is_ca", true);
        // formData.append("language_preference", localStorage.getItem("i18nextLng"));

        Axios({
            method: "post",
            url: "/api/v1/register/hiring",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                if (response.data.status === 201) {
                    history.push("/thankYou");
                }
                return;
            })
            .catch(function (error) {
                toast.error(t(props.language?.layout?.toast130_nt) || t(props.language?.layout?.toast53_nt));
                setShow_errors({ ...show_errors, disable: false });
                return;
            });
    };
    const opneModal = () => {
        setOpenModel(true);
    }
    const closeModal = () => {
        setOpenModel(false)
        setDisable(true)
    }
    const agreeTerm =()=>{
        setChecked(true)
        setOpenModel(false)
    }
    const declineTerm =()=>{
        setChecked(false)
        setOpenModel(false)
        setDisable(true)
    }

    const onScroll = (e,scrollRef) => {
        let box = document.querySelector('.scrollbarDown1');
        let content = document.querySelector('.scrolContainer1')
        const scrollY = content.offsetHeight
        const scrollTop = parseInt(scrollRef.current.scrollTop) + parseInt(box.clientHeight)+20
        if(scrollTop >= scrollY){
            setDisable(false)
        }
    }
    return (
        <>
            <div className="container-fluid h-100">
                <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-4 p-0 login_image d-flex flex-column">
                        <img className="img-fluid m-0 p-0" src="/images/login.jpg" alt="image" />
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-7 mx-auto px-3">
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
                                    <img alt="microsoft" src={props.theme.logo} className="logo img-fluid" />
                                </a>
                            ) : (
                                <a href="/" className="navbar-brand">
                                    <img alt="microsoft" src="/images/logo.png" className="logo img-fluid" />
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
                                                    className="form-check-input"
                                                    type="radio"
                                                    aria-label="corporatate"
                                                    value="corportate"
                                                    id="corporateCheck"
                                                    name="partnerType"
                                                    onChange={(e) => setPartnerType("corportate")}
                                                    checked
                                                />
                                                <label
                                                    className="form-check-label user-select-none"
                                                    for="corporateCheck">
                                                    {t(props.language?.layout?.employer_signup)}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group animated">
                                        <label
                                            className={
                                                show_errors.isValidOrgName
                                                    ? "form-label-active text-green"
                                                    : "form-label-active text-danger bg-white"
                                            }
                                            for="organisationName">
                                            {t(props.language?.layout?.skilling_signup_orgname)}
                                        </label>

                                        <input
                                            type="text"
                                            className={
                                                show_errors.isValidOrgName
                                                    ? "form-control"
                                                    : "form-control border-danger"
                                            }
                                            name="organisationName"
                                            aria-label="org_name"
                                            required
                                            maxlength="60"
                                            autofocus
                                            value={user.organisationName}
                                            onChange={(e) => {
                                                setUser({ ...user, organisationName: e.target.value });
                                                setShow_errors({ ...show_errors, isValidOrgName: true });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="form-group animated">
                                                <label
                                                    className={
                                                        show_errors.istitle
                                                            ? "form-label-active text-green"
                                                            : "form-label-active text-danger bg-white"
                                                    }
                                                    for="title">
                                                    {t(props.language?.layout?.employer_signup_title)}
                                                </label>
                                                <select
                                                    className={
                                                        show_errors.istitle
                                                            ? " form-control"
                                                            : " form-control border-danger"
                                                    }
                                                    aria-label="select"
                                                    id="sel1"
                                                    onChange={(e) => {
                                                        setUser({ ...user, title: e.target.value });
                                                        setShow_errors({ ...show_errors, istitle: true });
                                                    }}>
                                                    <option disabled selected>
                                                        {t(props.language?.layout?.employer_signup_select)}
                                                    </option>
                                                    <option value="mr">
                                                        {" "}
                                                        {t(props.language?.layout?.employer_signup_selectoption_mr)}
                                                    </option>
                                                    <option value="ms">
                                                        {" "}
                                                        {t(props.language?.layout?.employer_signup_selectoption_ms)}
                                                    </option>
                                                    <option value="mrs">
                                                        {t(props.language?.layout?.employer_signUp_selectoption_mrs)}
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
                                                    {t(props.language?.layout?.employer_signup_firstname)}
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
                                                        show_errors.isvalidLastName
                                                            ? "form-label-active text-green"
                                                            : "form-label-active text-danger bg-white"
                                                    }
                                                    for="first_name">
                                                    {t(props.language?.layout?.employer_signup_lastname)}
                                                </label>

                                                <input
                                                    type="text"
                                                    className={
                                                        show_errors.isvalidLastName
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
                                                        setShow_errors({ ...show_errors, isvalidLastName: true });
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
                                            {t(props.language?.layout?.employer_signup_email)}
                                        </label>
                                        <input
                                            type="email"
                                            className={
                                                show_errors.validEmail ? "form-control" : "form-control border-danger"
                                            }
                                            aria-label="email"
                                            name="email"
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
                                    <div className="form-group animated">
                                        <label
                                            className="form-label-active text-green"
                                            // show_errors.isCareerConnector ? "form-label-active text-green" : "form-label-active text-danger bg-white"

                                            for="careerConnector">
                                            {t(props.language?.layout?.hearcc_nt)}
                                        </label>
                                        <input
                                            type="text"
                                            aria-label="careerConnector"
                                            className="form-control"
                                            name="custom_field2"
                                            // autocomplete="off"
                                            // required
                                            id="careerConnector"
                                            value={user.custom_field2}
                                            onChange={(e) => {
                                                setUser({ ...user, custom_field2: e.target.value });
                                                // setShow_errors({ ...show_errors, isCareerConnector: true });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-xs-12 col-md-4">
                                            <div className="form-group animated">
                                                <label
                                                    className={
                                                        show_errors.isvalidAreaCode
                                                            ? "form-label-active text-green"
                                                            : "form-label-active text-danger bg-white "
                                                    }
                                                    for="area-code">
                                                    {t(props.language?.layout?.employer_signup_areacode)}
                                                </label>
                                                <select
                                                    className={
                                                        show_errors.isvalidAreaCode
                                                            ? "form-control"
                                                            : "form-control border-danger"
                                                    }
                                                    aria-label="select"
                                                    onChange={(e) => {
                                                        setUser({ ...user, area_code: e.target.value });
                                                        setShow_errors({ ...show_errors, isvalidAreaCode: true });
                                                    }}>
                                                    <option selected="" className="d-none">
                                                        {t(props.language?.layout?.employer_signup_select_1)}
                                                    </option>
                                                    <option value="USA +1">
                                                        {t(props.language?.layout?.employer_signup_selectoption_usa)}
                                                    </option>
                                                    <option value="Canada +1">
                                                        Canada +1
                                                    </option>
                                                    <option value="Australia +61" disabled>
                                                        {t(
                                                            props.language?.layout
                                                                ?.employer_signup_selectoption_australia
                                                        )}
                                                    </option>
                                                    <option value="Brazil +55" disabled>
                                                        {t(props.language?.layout?.employer_signup_selectoption_brazil)}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-8">
                                            <div className="form-group animated">
                                                <label
                                                    className={
                                                        show_errors.isvalidPhoneNumber
                                                            ? "form-label-active text-green z-index4"
                                                            : "form-label-active text-danger bg-white z-index4"
                                                    }
                                                    for="telephone">
                                                    {t(props.language?.layout?.employer_signup_phone)}
                                                </label>
                                                <input
                                                    type="number"
                                                    className={
                                                        show_errors.isvalidPhoneNumber
                                                            ? "form-control"
                                                            : "form-control border-danger"
                                                    }
                                                    minlength="10"
                                                    maxlength="10"
                                                    aria-label="phone"
                                                    required
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
                                                        setShow_errors({ ...show_errors, isvalidPhoneNumber: true });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-md-12 mb-3">
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
                                    <div className="mb-0">
                                        <div className="form-group form-check mt-3">
                                            <input
                                                onClick={opneModal}
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={checked}
                                                id="flexCheckDefault"
                                            />
                                            <label className="form-check-label" for="exampleCheck1">
                                                {t(props.language?.layout?.employer_signup_terms_and_conditions1)}
                                            </label>
                                            <Link to="/terms-of-service" target="_blank">
                                                {/* {t(props.language?.layout?.skilling_signup_terms_and_conditions2)} */}
                                                &nbsp;{t(props.language?.layout?.termsofservice)}
                                            </Link>,&nbsp;
                                            <Link to="/privacy-policy-ep" target="_blank">
                                            {t(props.language?.layout?.simplify_pp)}
                                            </Link>
                                            &nbsp;{t(props.language?.layout?.faq_geninfo_a9_7)}&nbsp;
                                        <a href="https://privacy.microsoft.com/en-gb/privacystatement" target="_blank">{t(props.language?.layout?.microsoft_pp)}</a>.
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        aria-label="sign_up"
                                        disabled={!checked}
                                        // disabled={show_errors.disable === true}
                                        className="btn btn-primary btn-lg btn-block rounded-0 my-3 apply-button-background"
                                        onClick={submit}>
                                        {t(props.language?.layout?.employer_signup_submit)}
                                    </button>
                                    <p className="text-center">
                                        {t(props.language?.layout?.employer_signup_login1)}{" "}
                                        <a href="/ca/login"> {t(props.language?.layout?.employer_signup_login2)}</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Modal size={"lg"}> */}
            <Modal
                size={"xl"}
                show={openModel}
                onHide={closeModal}
                // dialogClassName="modal-90w"
                // ria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t(props.language?.layout?.employer_signup_terms_and_conditions2)}</Modal.Title>
                </Modal.Header>
                <div className="mb-4">
                    <div className="modal-content modal_content p-3 border-0">
                        {/* term and privacy */}
                        <SignUpPrivacyEp onScroll={onScroll} />
                    </div>
                </div>
                <Modal.Footer>
                    <div className="d-flex justify-content-end">
                        <div>
                            <button className="border btn btn-default btn-md px-5" onClick={() => declineTerm()}>
                            {t(props.language?.layout?.policydecline_nt)}
                            </button>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div>
                            <button className="btn btn-primary btn-md px-5" disabled={disable} onClick={() => agreeTerm()}>
                            {t(props.language?.layout?.policyagree_nt)}
                            </button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
        tenantTheme: state.authInfo.tenantTheme
    };
}
export default connect(mapStateToProps, { _setAuthData })(CorporatePartner);
