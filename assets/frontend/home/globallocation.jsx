import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import FooterUpdate from "../dashboard/_footer.jsx";

const Globallocation = (props) => {
    const { t } = useTranslation();
    return (
        <div class="w-100">
            <div className="w-100">
                <img
                    src="/uploads/user_v1llv353bppo/global-locations.jpg"
                    class="position-relative"
                    width="100%"
                    height=""
                    alt="global"
                />
            </div>
            <div className="container py-4 px-3">
                <h1 class="font-weight-normal">
                    {t(props.language?.layout?.globallocations_heading)}
                </h1>
                <p className="py-2">
                    {t(props.language?.layout?.globallocations_description)}
                </p>
                <p className="py-2">
                    <b>{t(props.language?.layout?.globallocations_description2_1)}</b>{t(props.language?.layout?.globallocations_description2_2)}:
                </p>
                <div className="row">
                    <div className="col-md-3 col-12 mb-2">
                        <img
                            src="/uploads/user_v1llv353bppo/argentina.jpg"
                            width="100%"
                            className="pt-2"
                            height="auto"
                            alt="Argentina"
                        />
                        <p className="location_name">
                            {t(props.language?.layout?.globallocations_argentina)}
                        </p>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <img
                            src="/uploads/user_v1llv353bppo/australia.jpg"
                            width="100%"
                            className="pt-2"
                            height="auto"
                            alt="Australia"
                        />
                        <p className="location_name">
                            {t(props.language?.layout?.glogloballocations_australia)}
                        </p>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <img
                            src="/uploads/user_v1llv353bppo/brazil.jpg"
                            width="100%"
                            alt="Brazil"
                            className="pt-2"
                            height="auto" />
                        <p className="location_name">
                            {t(props.language?.layout?.globallocations_brazil)}
                        </p>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <img
                            src="/uploads/user_v1llv353bppo/canada.jpg"
                            width="100%"
                            className="pt-2"
                            height="auto"
                            alt="Canada"
                        />
                        <p className="location_name">
                            {t(props.language?.layout?.globallocations_canada)}
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-12 mb-2">
                        <img
                            src="/uploads/user_v1llv353bppo/india.jpg"
                            alt="india"
                            class="position-relative"
                            width="100%"
                            className="pt-2"
                            height="auto"
                        />
                        <p className="location_name">
                            {t(props.language?.layout?.globallocations_india)}
                        </p>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <img
                            src="/uploads/user_v1llv353bppo/ireland.jpg"
                            class="position-relative"
                            width="100%"
                            className="pt-2"
                            height="auto"
                            alt="Ireland"
                        />
                        <p className="location_name">
                            {t(props.language?.layout?.globallocations_ireland)}
                        </p>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <img
                            src="/uploads/user_v1llv353bppo/mexico.jpg"
                            class="position-relative"
                            width="100%"
                            className="pt-2"
                            height="auto"
                            alt="Mexico"
                        />
                        <p className="location_name">
                            {t(props.language?.layout?.globallocations_mexico)}
                        </p>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <img
                            src="/uploads/user_v1llv353bppo/singapore.jpg"
                            class="position-relative"
                            width="100%"
                            className="pt-2"
                            height="auto"
                            alt="Singapore"
                        />
                        <p className="location_name">
                            {t(props.language?.layout?.globallocations_singapore)}
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-12 mb-2">
                        <img
                            src="/uploads/user_v1llv353bppo/uk.jpg"
                            class="position-relative"
                            width="100%"
                            className="pt-2"
                            height="auto"
                            alt="UK"
                        />
                        <p className="location_name">
                            {t(props.language?.layout?.globallocations_uk)}
                        </p>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <img
                            src="/uploads/user_v1llv353bppo/usa.jpg"
                            class="position-relative"
                            width="100%"
                            className="pt-2"
                            height="auto"
                            alt="US"
                        />
                        <p className="location_name">
                            {t(props.language?.layout?.globallocations_us)}
                        </p>
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
export default connect(mapStateToProps)(Globallocation);
