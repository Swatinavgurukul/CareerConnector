import React from "react";
import FooterUpdate from "../dashboard/_footer.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const Pricing = (props) => {
    const { t } = useTranslation();
    return (
        <>
            <div class="w-100">
                <div class="container-fluid px-0">
                    <div class="pricing-black-background pricing-white-section">
                        <div class="col-md-10 col-12 mx-auto text-center pt-4">
                            <h1 class="text-white font-weight-bold page-heading pt-5 mb-4">{t(props.language?.layout?.pricing_heading)}</h1>
                            <p class="text-white mb-4">{t(props.language?.layout?.pricing_subheading)}</p>
                        </div>
                        <div class="col-md-10 col-12 mx-auto">
                            <div class="col-12 bg-white shadow p-0">
                                <div class="d-md-flex">
                                    <div className="card-deck w-100 m-0">
                                        <div class="col-lg-3 col-md-6 p-3 border-right border-bottom">
                                            <h5 class="font-weight-bold text-center mt-3 mb-3">{t(props.language?.layout?.pricing_placementfee)}</h5>
                                            <p class="text-purple text-center font-weight-bold mb-0">{t(props.language?.layout?.pricing_placementfee_fulltime)}</p>
                                            <h2 class="text-purple pricing-content text-center">
                                                <span class="price-currency">
                                                    <sup>$</sup>
                                                </span>
                                                <span class="price-amount">{t(props.language?.layout?.pricing_placementfee_fulltime_amt)}</span>
                                            </h2>
                                            <p class="text-purple text-center mb-md-5 mb-2">{t(props.language?.layout?.pricing_placementfee_fulltime_description)}</p>
                                        </div>
                                        <div class="col-lg-3 col-md-6 p-3 border-right border-bottom">
                                            <h5 class="font-weight-bold text-center mt-3 mb-3">{t(props.language?.layout?.pricing_agencyrate)}</h5>
                                            <p class="text-pink text-center font-weight-bold mb-0">
                                                {t(props.language?.layout?.pricing_agencyrate_withpayroll)}
                                            </p>
                                            <h2 class="text-pink pricing-content text-center">
                                                <span class="price-currency"></span>
                                                <span class="price-amount">{t(props.language?.layout?.pricing_agencyrate_withpayroll_percent)}</span>
                                            </h2>
                                            <p class="text-pink text-center mb-md-5 mb-2">{t(props.language?.layout?.pricing_agencyrate_withpayroll_description)}</p>
                                        </div>
                                        <div class="col-lg-3 col-md-6 p-3 border-right border-bottom">
                                            <h5 class="font-weight-bold text-center mt-3 mb-3">{t(props.language?.layout?.pricing_agencyrate_1)}</h5>
                                            <p class="text-light-blue text-center font-weight-bold mb-0">
                                                {t(props.language?.layout?.pricing_placementfee_nonfulltime)}
                                            </p>
                                            <h2 class="text-blue pricing-content text-center">
                                                <span class="price-currency"></span>
                                                <span class="price-amount">{t(props.language?.layout?.pricing_agencyrate_withoutpayroll_percent)}</span>
                                            </h2>
                                            <p class="text-light-blue text-center mb-md-5 mb-2">{t(props.language?.layout?.pricing_agencyrate_withoutpayroll_description)}</p>
                                        </div>
                                        <div class="col-lg-3 col-md-6 p-3 border-right border-bottom">
                                            <h5 class="font-weight-bold text-center mt-3 mb-3">{t(props.language?.layout?.pricing_placementfee)}</h5>
                                            <p class="text-purple text-center font-weight-bold mb-0">
                                                {t(props.language?.layout?.pricing_placementfee_nonfulltime)}
                                            </p>
                                            <h2 class="text-purple pricing-content text-center">
                                                <span class="price-currency">
                                                    <sup>$</sup>
                                                </span>
                                                <span class="price-amount">{t(props.language?.layout?.pricing_placementfee_nonfulltime_amt)}</span>
                                            </h2>
                                            <p class="text-purple text-center mb-md-5 mb-2">{t(props.language?.layout?.pricing_placementfee_nonfulltime_description)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 text-center py-4">
                            {/* <h1 class="text-white font-weight-bold page-heading pt-5 mb-4">Pricing Model</h1> */}
                            <p class="text-purple m-0">
                                {t(props.language?.layout?.pricing_description)}
                            </p>
                        </div>
                    </div>
                    <div class="col-md-10 col-12 mx-auto mb-md-5 mb-2">
                        <div className="d-md-flex my-4">
                            <div className="col-md-12 col-sm-12 text-justify">
                                <div class="wrapper pricing">
                                    <div class="d-lg-flex">
                                        <div class="col home my-md-0 mt-3 p-0 text-center border border-primary">
                                            <img
                                                src="/uploads/user_v1llv353bppo/training.jpg"
                                                alt="training"
                                                
                                            />
                                        </div>
                                        <div class="col text-white bg-primary overflow-auto thin-scrollbar about-career" tabindex="0">
                                            <div className="p-4">
                                                <p className="text-left">
                                                    {t(props.language?.layout?.pricing_aboutmicrosoftprogram)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <FooterUpdate />
            </div>
        </>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}


export default connect(mapStateToProps)(Pricing);
