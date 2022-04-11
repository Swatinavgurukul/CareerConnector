import React from "react";
import { Link } from "react-router-dom";
import i18n from '../dashboard/i18n';
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { _languageName } from "../actions/actionsAuth.jsx";

const FooterUpdate = (props) => {
    const { t } = useTranslation();
    return (
        <div aria-label="Footer" role="contentinfo">
            <div className="footer_top--sec pt-3 pb-3">
                <div className="col-lg-10 mx-auto">
                    <div className="d-md-flex">
                        <div className="col-md-10 col-12 p-0">
                            <div class="d-md-flex text-left">
                                <div className="py-1 p-md-0">
                                    <Link to={props.canadaPath == null ? "/faq" : `/${props.canadaPath}/faq`} className="text-dark list-inline-item">
                                        {t(props.language?.layout?.footer_faq)}
                                    </Link>
                                    <span className="d-xxl-inline-block d-none">|</span>
                                </div>
                                <div className="py-1 p-md-0">
                                    <a
                                        href={props?.languageName === "esp" ? "https://privacy.microsoft.com/es-es/PrivacyStatement" : "https://privacy.microsoft.com/en-gb/privacystatement"}
                                        className="ml-md-2 text-dark list-inline-item">
                                        {t(props.language?.layout?.footer_privacy)}
                                    </a>
                                    <span className="d-xxl-inline-block d-none">|</span>
                                </div>
                                <div className="py-1 p-md-0">
                                    <a
                                        href="https://www.microsoft.com/en-us/corporate-responsibility"
                                        className="ml-md-2 text-dark list-inline-item">
                                        {t(props.language?.layout?.footer_socialresponsibility)}
                                    </a>
                                    <span className="d-xxl-inline-block d-none">|</span>
                                </div>
                                <div className="py-1 p-md-0">
                                    <a href="https://linkedin.com" className="ml-md-2 text-dark list-inline-item">
                                        {t(props.language?.layout?.footer_linkedin)}
                                    </a>
                                    <span className="d-xxl-inline-block d-none">|</span>
                                </div>
                                <div className="py-1 p-md-0">
                                    <a href="mailto:jobsnow@microsoft.com" className="ml-md-2 text-dark list-inline-item">
                                        {t(props.language?.layout?.footer_contact)}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2 col-12 p-0">
                            <div class="d-md-flex text-left justify-content-end">
                                <div className="py-2 p-md-0 d-flex">
                                    <Link to="/languages" className="icon-invert">
                                        <img
                                            className="svg-sm mt-n1 mr-2"
                                            src="/svgs/icons_new/globe.svg"
                                            alt="Languages"
                                            title="Languages"
                                        />
                                    </Link>
                                    <div
                                        className="text-dark pointer"
                                        onClick={() => props._languageName("en")}>
                                        EN
                                    </div> |
                                    <div
                                        onClick={() => props._languageName("esp")}
                                        className="text-dark pointer">ESP</div> |
                                    {/* <a className="text-dark pointer" onClick={() => props._languageName('esp')}>ESP</a> */}
                                    <div
                                        onClick={() => props._languageName("fr")}
                                        className="text-dark pointer">FR</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer_bottom py-3">
                <div className="col-md-10 col-12 mx-auto p-0">
                    <div className="d-md-flex text-left px-2">
                        <div className="py-1 p-md-0 mr-2">
                            <Link to={props.canadaPath == null ? "/about" : `/${props.canadaPath}/about`} className="text-dark">
                                {t(props.language?.layout?.footer_about)}
                            </Link>
                        </div>
                        <div className="py-1 p-md-0 mx-md-2">
                            <Link to={props.canadaPath == null ? "/contact-us" : `/${props.canadaPath}/contact-us`} className="text-dark">
                                {t(props.language?.layout?.footer_contact)}
                            </Link>
                        </div>
                        <div className="py-1 p-md-0 mx-md-2">
                            <Link to={props.canadaPath == null ? "/privacy-policy" : `/${props.canadaPath}/privacy-policy`} className="text-dark">
                                {t(props.language?.layout?.footer_privatepolicy)}
                            </Link>
                        </div>
                        <div className="py-1 p-md-0 mx-md-2">
                            <Link to={props.canadaPath == null ? "/terms-of-service" : `/${props.canadaPath}/terms-of-service`} className="text-dark">
                            {t(props.language?.layout?.workforceterms)}
                            </Link>
                        </div>
                        <div className="py-1 p-md-0 mx-md-2">
                            <Link to={props.canadaPath == null ? "/globallocations" : `/${props.canadaPath}/globallocations`} class="text-dark">
                                {t(props.language?.layout?.footer_globallocations)}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
        canadaPath: state.authInfo.canadaPath
    };
}
export default connect(mapStateToProps, { _languageName })(FooterUpdate);