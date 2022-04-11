import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import FooterUpdate from "../dashboard/_footer.jsx";

const ContactUs = (props) => {
    const { t } = useTranslation();
    return (
        <div className="w-100">
            <div className="w-100">
                <img src="/uploads/user_v1llv353bppo/contact.jpg" alt="contact" width="100%" />
            </div>
            <div className="value_pupose">
                <div className="col-md-10 mx-auto">
                    <h1 className="pt-5">{t(props.language?.layout?.contact_heading)}</h1>
                    <div className="d-md-flex pb-5">
                        <div className="card-deck w-100">
                            <div className="col-md-6 col-lg-3">
                                <div className="py-3">
                                    <div className="font-weight-bold h3">
                                        <span className="icon-invert">
                                            <img src="/svgs/icons_new/phone.svg" alt="phone" className="svg-md mr-3" />
                                        </span>
                                        {t(props.language?.layout?.contact_jobseekers)}
                                    </div>
                                    <a href="tel://+44 (0) 203 8084252" className="p-4">
                                        +1 888-323-7470
                                    </a>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="py-3">
                                    <div className=" icon-invert font-weight-bold h3">
                                        <span>
                                            <img src="/svgs/icons_new/phone.svg" alt="phone" className="svg-md mr-3" />
                                        </span>
                                        {t(props.language?.layout?.contact_employerpartner)}
                                    </div>
                                    <a href="tel://+44 (0) 203 8084252" className="p-4">
                                        +1 888-323-7470
                                    </a>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="py-3">
                                    <div className="icon-invert font-weight-bold h3">
                                        <span>
                                            <img src="/svgs/icons_new/phone.svg" alt="phone" className="svg-md mr-3" />
                                        </span>
                                        {t(props.language?.layout?.contact_skillingpartner)}
                                    </div>
                                    <a href="tel://+44 (0) 203 8084252" className="p-4">
                                        +1 888-323-7470
                                    </a>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="py-3">
                                    <div className="icon-invert font-weight-bold h3">
                                        <span>
                                            <img src="/svgs/icons_new/mail.svg" alt="email" className="svg-md mr-3" />
                                        </span>
                                        {t(props.language?.layout?.contact_email)}
                                    </div>
                                    <a href="mailto:support@simplifyhire.com" className="p-4">
                                        support@simplifyhire.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterUpdate />
        </div>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps)(ContactUs);
