import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import FooterUpdate from "../dashboard/_footer.jsx";

const About = (props) => {
    const { t } = useTranslation();
    return (
        <div class="w-100">
            <div className="w-100">
                <img src="/uploads/user_v1llv353bppo/about-us.jpg" alt="About Us" width="100%" />
            </div>
            <div className="col-md-10 col-12 mx-auto py-5 px-3">
                <h1 class="font-weight-normal">{t(props.language?.layout?.about_us_about)}</h1>
                <p className="text-justify pt-2 pb-2">
                    {t(props.language?.layout?.about_description)}
                </p>
                <Link to="/contact-us" className="btn btn-primary btn-lg rounded-0">
                    {t(props.language?.layout?.about_contact)}
                </Link>
            </div>
            <div className="value_pupose">
                <div className="col-md-10 col-12 mx-auto py-5">
                    <div className="d-md-flex">
                        <div className="col-md-6">
                            <h3>
                                {t(props.language?.layout?.about_values)}
                            </h3>
                            <p className="text-justify">
                                {t(props.language?.layout?.about_values_description)}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <h3>
                                {t(props.language?.layout?.about_purpose)}
                            </h3>
                            <p className="text-justify">
                                {t(props.language?.layout?.about_purpose_description)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="gold_sponsors">
                <div className="col-md-10 col-12 mx-auto py-5">
                    <div className="d-md-flex">
                        <div className="col-md-6">
                            <img src="/uploads/user_v1llv353bppo/about-us2.jpg" alt="about" width="100%" className="img-fluid" />
                        </div>
                        <div className="col-md-6">
                            <div className="mt-md-5 p-md-5 py-5">
                                <h3>
                                    {t(props.language?.layout?.about_goldsponsors)}
                                </h3>
                                <p className="text-justify">
                                    {t(props.language?.layout?.about_goldsponsors_description)}
                                </p>
                                <a href="#">
                                    {t(props.language?.layout?.about_goldsponsors_link)}
                                </a>
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
export default connect(mapStateToProps)(About);
