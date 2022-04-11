import React from "react";
import Carousel from "react-multi-carousel";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { truncate, renderRange, renderCurrencyRange, resetToCapitalCasing } from "../../modules/helpers.jsx";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { job_type } from "../../../translations/helper_translation.jsx";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 2,
        paritialVisibilityGutter: 40
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
        paritialVisibilityGutter: 40
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        paritialVisibilityGutter: 40
    }
};

const RecommendedJobs = (props, deviceType) => {
    const { t } = useTranslation();

    const jobTypeHandler = (language, key) => {
        return(job_type[language][key]);
    }
    return (
        <Carousel
            //   partialVisbile
            arrows={false}
            deviceType={deviceType}
            itemClass="image-item"
            responsive={responsive}
            // removeArrowOnDeviceType={["tablet", "mobile"]}
            showDots={false}
            autoPlay={false}
            arrows={true}
            aria-hidden={true}
            tabindex="-1"
        >
            {props.data.length > 0 && props.data.slice(0, 9).map((data) => {
                return (
                    <div className="col-auto pb-4">
                        <div className="bg-white rounded elevation-1 hover-elevation-2 p-3">
                            <div className="d-flex justify-content-end">
                                <a className="icon-invert" onClick={() => props.markAsBookmark(data.slug)} tabIndex="0" onKeyPress={props.markAsBookmark}>
                                    {data.is_bookmarked ? (
                                        <img
                                            className="svg-sm mt-1 mr-2 pointer"
                                            src="/svgs/icons_new/bookmark-filled.svg"
                                            alt="bookmark saved"
                                        />
                                    ) : (
                                        <img
                                            className="svg-sm mt-1 mr-2 pointer bookmark-gray"
                                            src="/svgs/icons_new/bookmark.svg"
                                            alt="bookmark unsaved"
                                        />
                                    )}
                                </a>
                                <img class="svg-sm mt-1 pointer" tabIndex="0" src="/svgs/icons_new/x.svg" alt="cancel" onClick={() => props.removeJobCard(data.slug)} />
                            </div>
                            <div className="card-img mt-n3">
                                <img
                                    src={data.company_logo ? data.company_logo : "/svgs/icons_new/industry-icon.svg"}
                                    className="rounded svg-lg"
                                    alt="Company Logo"
                                    style={{ width: "3rem", height: "3rem" }}
                                />
                            </div>
                            {/* <h5 className="font-weight-bold mt-3 h5-small" style={{ whiteSpace: "nowrap" }}> */}
                            <h5 className="font-weight-bold mt-3 h5-small">
                                <Link
                                    to={{
                                        pathname: `/jobs/${data.slug}`,
                                        state: data.slug,
                                    }}
                                    className="text-dark text-decoration-none">
                                    {truncate(data.title, 20)} - {truncate(data.category, 15)}
                                </Link>
                            </h5>
                            <p className="mb-1">{data.company_name} {data.country || data.state ? "- " + data.state + "," + data.country : ""}</p>
                            <div className="row my-2">
                                <div class="col-auto">
                                    <img class="svg-xs" src="/svgs/icons_new/clock.svg" alt="time" />
                                    {data.experience_max != null || data.experience_min != null || data.job_type != null ? (
                                        <small class="ml-2 text-capitalize">{renderRange(
                                            data.experience_min || 0,
                                            data.experience_max || 0,
                                            data.job_type ? t(props.language?.layout?.years_nt) : t(props.language?.layout?.all_years_nt))}
                                            {data.job_type ? jobTypeHandler(props?.languageName, data.job_type) : ""}</small>
                                    ) : (<small className="ml-2 text-grey">NA</small>)}
                                </div>
                                <div class="col-auto">
                                    <img class="svg-xs" src="/svgs/icons_new/briefcase.svg" alt="time" />
                                    {data.salary_min != null && data.salary_max != null && (data.salary_min != 0 && data.salary_max != 0) ? (
                                        <small class="ml-2 text-capitalize"> {renderCurrencyRange(data.salary_min, data.salary_max, "$")}</small>
                                    ) : (<small className="ml-2 text-grey">{t(props.language?.layout?.jsdb_disclosed_nt)}</small>)}
                                </div>
                                <div class="col-12">
                                    <img class="svg-xs" src="/svgs/icons_new/mdi_account-search-outline.svg" alt="time" />
                                    <small class="ml-2 text-capitalize">{t(props.language?.layout?.jsdb_position_nt)} : {data.openings ? data.openings : 0}</small>
                                </div>
                            </div>
                            <div className="d-flex">
                                <small className={"text-success" + (data.process_status ? " ml-1" : "")}>{data.process_status ? data.process_status + " | " : ''}</small>
                                <small className="text-muted ml-1">{formatDistance(subDays(new Date(data.created_at), 0), new Date()).replace("about", "")} {t(props.language?.layout?.all_ago_nt)}</small>
                                <small className="text-primary font-italic ml-1">{" | " + data.total_applications} {t(props.language?.layout?.sp_application_applicants)}</small>
                            </div>
                        </div>
                    </div>
                );
            })}
        </Carousel>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}
export default connect(mapStateToProps)(RecommendedJobs);
