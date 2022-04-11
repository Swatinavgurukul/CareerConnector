import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const HomepageData = (props) => {
    const { t } = useTranslation();
    const access = (unauthenticated, user, role_1, role_2) => {
        return !props.user.authenticated
            ? unauthenticated
            : props.user.is_user == 1
                ? user
                : props.user.role_id == 1
                    ? role_1
                    : role_2;
    };

    return (
        <div className="col-lg-10 mx-auto text-justify">
            <div className="row">
                <div className="col-md-4 mb-4">
                    <diV>
                        <img
                            alt="find_path3"
                            src="/uploads/user_v1llv353bppo/jobseeker.jpg"
                            class="img-fluid"
                            width="100%"
                        />
                        <h2 className="mt-3">{t(props.language?.layout?.homepage_jobseekers)}</h2>
                        <Link
                            to={access("/ca/signup", "/dashboard", "/ca/unauthorized", "/ca/unauthorized")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_jobseekers_register)}
                        </Link>
                        <Link
                            to={access("/ca/signup", "/profile", "/ca/unauthorized", "/ca/unauthorized")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_jobseekers_createprofile)}
                        </Link>
                        <Link to="/ca/search" className="d-block mb-1">
                            {t(props.language?.layout?.homepage_jobseekers_search_apply)}
                        </Link>
                        <Link
                            to={access("/ca/login", "/dashboard", "/ca/unauthorized", "/ca/unauthorized")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_jobseekers_dashboard)}
                        </Link>
                        <a href="https://opportunity.linkedin.com" className="d-block mb-1">
                            {t(props.language?.layout?.homepage_jobseekers_gainskills)}
                        </a>
                        <a
                            target="_blank"
                            href= {t(props.language?.layout?.userguide_js)}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_jobseekers_userguide)}
                        </a>
                        <Link to="/ca/faq" className="d-block mb-1">
                            {t(props.language?.layout?.homepage_jobseekers_faq)}
                        </Link>
                    </diV>
                </div>
                <div className="col-md-4 mb-4">
                    <diV>
                        <img
                            alt="find_path1"
                            src="/uploads/user_v1llv353bppo/employee.jpg"
                            class="img-fluid"
                            width="100%"
                        />
                        <h2 className="mt-3">{t(props.language?.layout?.homepage_employerpartner)}</h2>
                        <Link
                            to={access("/ca/signup/employer", "/ca/unauthorized", "/dashboard", "/ca/unauthorized")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_employerpartner_register)}
                        </Link>
                        <Link
                            to={access("/ca/signup/employer", "/ca/unauthorized", "/dashboard", "/ca/unauthorized")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_employerpartner_createprofile)}
                        </Link>
                        <Link
                            to={access("/ca/login", "/ca/unauthorized", "/jobs/create", "/ca/unauthorized")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_employerpartner_postjobs)}
                        </Link>
                        <Link
                            to={access("/ca/login", "/ca/unauthorized", "/dashboard", "/ca/unauthorized")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_employerpartner_dashboard)}
                        </Link>
                        <Link to="/ca/pricing" className="d-block mb-1">
                            {t(props.language?.layout?.homepage_employerPartner_pricingmodel)}
                        </Link>
                        <Link
                            to={access("/ca/login", "/ca/unauthorized", "/dashboard", "/ca/unauthorized")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_employerpartner_connectrecruiter)}
                        </Link>
                        <a
                            target="_blank"
                            href= {t(props.language?.layout?.userguide_ep)}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_employerpartner_userguide)}
                        </a>
                        {/* <Link to="/faq#employers" className="d-block mb-1">
                            FAQ
                        </Link> */}
                        <a
                            // target="_blank"
                            href="/ca/faq#employers"
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_employerpartner_faq)}
                        </a>
                    </diV>
                </div>
                <div className="col-md-4">
                    <diV>
                        <img
                            alt="find_path2"
                            src="/uploads/user_v1llv353bppo/nonprofit.jpg"
                            class="img-fluid"
                            width="100%"
                        />
                        <h2 className="mt-3">{t(props.language?.layout?.homepage_skillingpartner)}</h2>
                        <Link
                            to={access("/ca/signup/skilling", "/ca/unauthorized", "/ca/unauthorized", "/dashboard")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_skillingpartner_register)}
                        </Link>
                        <Link
                            to={access("/ca/signup/skilling", "/ca/unauthorized", "/ca/unauthorized", "/dashboard")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_skillingpartner_createprofile)}
                        </Link>
                        <Link
                            to={access("/ca/login", "/ca/unauthorized", "/ca/unauthorized", "/jobSeekers")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_skillingpartner_uploadprofie)}
                        </Link>
                        <Link
                            to={access("/ca/login", "/ca/unauthorized", "/ca/unauthorized", "/dashboard")}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_skillingpartner_dashboard)}
                        </Link>
                        <a
                            target="_blank"
                            href= {t(props.language?.layout?.userguide_sp)}
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_skillingpartner_userguide)}
                        </a>
                        {/* <Link to="/faq#skillingpartner" className="mb-1 d-block">
                            FAQ
                        </Link> */}
                        <a
                            // target="_blank"
                            href="/ca/faq#skillingpartner"
                            className="d-block mb-1">
                            {t(props.language?.layout?.homepage_skillingpartner_faq)}
                        </a>
                    </diV>
                </div>
            </div>
        </div>
    );
};
function mapStateToProps(state) {
    // console.log("state ", state);
    return {
        user: state.authInfo.user,
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, {})(HomepageData);
