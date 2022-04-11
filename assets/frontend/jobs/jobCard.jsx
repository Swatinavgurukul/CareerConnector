import React, { useState, useEffect } from "react";
import Axios from "axios";
import { plainText, truncate, renderRange, renderCurrencyRange, resetToCapitalCasing } from "../modules/helpers.jsx";
import { toast } from "react-toastify";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { formatDistance, subDays } from "date-fns";
import { Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { es, fr, enUS as en } from 'date-fns/locale';
import { job_type } from "../../translations/helper_translation.jsx";
const JobCard = (props) => {
    const { t } = useTranslation();
    const [isBookmark, setBookmark] = useState(props.item.is_bookmarked);
    const [userAuthorized, setUserauthorized] = useState(false);

    const created_at =
        props.item.created_at === null || props.item.created_at === undefined
            ? new Date()
            : new Date(props.item.created_at);

    useEffect(() => {
        if (props.userToken) {
            setUserauthorized(true);
        }
    }, []);

    const markAsBookmark = (id) => {
        Axios.put(
            `/api/v1/jobs/${props.item.slug}/bookmark`,
            {},
            {
                // headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                headers: { Authorization: `Bearer ${props.userToken}` },
            }
        ).then((res) => {
            // console.log("res.message",res.data.message)
            if (res.status == 201) {
                toast.success(t(props.language?.layout?.toast31_nt));
                setBookmark(!isBookmark);
            }
            if (res.status == 200) {
                toast.error(t(props.language?.layout?.toast32_nt));
                setBookmark(!isBookmark);
            }
        });
    };
    const titleCase = (string, saperator, connector) => {
        return String(string || "")
            .toLowerCase()
            .split(saperator)
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(connector);
    };
    const truncateOnSpaces = (text, limit) => {
        if (text == null || text == undefined) {
            return ""
        }
        if (text.length <= limit) {
            return text
        }
        let max = limit
        while (max > 0 && text[max] !== " ") {
            max = max - 1
        }
        return text.slice(0, max) + "..."
    }
    const toggleBookmark = (e, id) => {
        if (e.code === "Enter") {
            markAsBookmark(id);
        }
    }

    const jobTypeHandler = (language, key) => {
        return(job_type[language][key]);
    }
    return (
        <div className="col-xs-12 col-sm-6 col-md-4 col-xxl-3 card-deck mx-0">
            <div className="card elevation-1 hover-elevation-2 mb-3 mx-0 bg-white rounded">
                <div className="card-header bg-light d-inline-block card-left-border pb-0 pt-0 border-right-0 border-bottom-0 border-top-0 pt-3">
                    <h5 className="card-title font-weight-bold text-capitalize" title={props.item.title}>
                        {/* {truncate(props.item.title, 60)} */}

                        {   props.languageName == "en" ?
                            props.item.title == null || props.item.title == "" ? truncate(props.item.title_fr, 60) : props.item.title : ""}
                        {   props.languageName == "esp" ?
                                (props.item.title_esp === null || props.item.title_esp === "")  ? truncate(props.item.title, 60) ? truncate(props.item.title, 60) : truncate(props.item.title_fr, 60) : truncate(props.item.title_esp, 60) : ""}
                        {   props.languageName == "fr" ?
                                (props.item.title_fr === null || props.item.title_fr === "" )  ? truncate(props.item.title, 60) : truncate(props.item.title_fr, 60) : ""}

                    </h5>
                    <div className="card-subtitle ml-auto d-flex justify-content-between mb-2 mt-1">
                        <p className="text-capitalize mb-0">{props.item.company_name}</p>
                        {/* <i>{formatDistanceToNowStrict(created_at, { addSuffix: true })}</i> */}
                    </div>
                    <div className="card-subtitle ml-auto d-flex justify-content-between mb-2 mt-1">
                        {props.item.openings ? (
                            <p className="mb-0 opening_job">
                                {t(props.language?.layout?.view_opening_nt)} : <span className="font-weight-bold">{props.item.openings}</span>
                            </p>
                        ) : <p className="mb-0 opening_job"> {t(props.language?.layout?.view_opening_nt)} : <span className="font-weight-bold">1</span></p>
                        }
                        <i className="opening_job">
                            {`${formatDistance(
                                subDays(new Date(created_at), 0),
                                new Date(), { locale: props.languageName === "en" ? en : props.languageName === "es"? es: fr }
                            ).replace("about", "")} ${t(props.language?.layout?.all_ago_nt)}`}</i>
                    </div>
                </div>
                <div className="card-body">
                    {props.item.remote_location == true ? (
                        <div className=" icon-invert my-2">
                            <img className="svg-sm" src="/svgs/icons_new/location_dark.svg" alt="location" />
                            <span className="ml-2 text-capitalize">{t(props.language?.layout?.remotelocation_nt)}</span>
                        </div>
                    ) : (
                        <>
                            <div className="icon-invert my-2">
                                <img className="svg-sm" src="/svgs/icons_new/location_dark.svg" alt="location" />
                                {props.item.display_name !== "" && props.item.display_name !== null ? (
                                    <span className="ml-2 text-capitalize">
                                        {props.item.display_name}
                                        , {props.item.state} ,{
                                            props.item.country
                                        }
                                    </span>
                                ) : (<span className="ml-2 text-grey">NA</span>)}
                            </div>
                        </>
                    )}
                    {/* {props.item.experience_max != null || props.item.experience_min != null ? ( */}
                    <div className="icon-invert text-muted my-2">
                        <img className="svg-sm" src="/svgs/icons_new/clock.svg" alt="time" />
                        {props.item.experience_max != null || props.item.experience_min != null || props.item.job_type != null ? (
                            <span className="ml-2 text-capitalize">
                                {renderRange(
                                    props.item.experience_min || 0,
                                    props.item.experience_max || 0,
                                    props.item.job_type ? t(props.language?.layout?.years_nt) : t(props.language?.layout?.years_nt)
                                )}
                                {props.item.job_type ? jobTypeHandler(props?.languageName, props.item.job_type) : ""}
                            </span>
                        ) : (<span className="ml-2 text-grey">NA</span>)}
                    </div>
                    <div className="icon-invert text-muted my-2">
                        <img className="svg-sm rounded-0" src="/svgs/icons_new/briefcase.svg" alt="job" />
                        {props.item.salary_min != null && props.item.salary_max != null && (props.item.salary_min != 0 && props.item.salary_max != 0) ? (
                            <span className="ml-2 text-capitalize">
                                {renderCurrencyRange(props.item.salary_min, props.item.salary_max, "$")}
                            </span>
                        ) : (<span className="ml-2 text-grey">{t(props.language?.layout?.notdisclosed_nt)}</span>)}
                    </div>
                    <div class={props.loading ? "skeleton-glow" : "text-justify small text-muted mb-0 mt-3"}>
                        {/* <div>{ReactHtmlParser(truncate(plainText(props.item.description), 200))}</div> */}
                        <div>
                                {/* {ReactHtmlParser(truncateOnSpaces(plainText(props.item.description), 200))} */}
                                {   props.languageName == "en" ?
                                    props.item.description == null || props.item.description == "" ?  ReactHtmlParser(truncateOnSpaces(plainText(props.item.description_fr), 200)) : ReactHtmlParser(truncateOnSpaces(plainText(props.item.description), 200)) : ""}
                                {   props.languageName == "esp" ?
                                        props.item.description_esp === null || props.item.description_esp === "" ?
                                        props.item.description ? ReactHtmlParser(truncateOnSpaces(plainText(props.item.description), 200)) : ReactHtmlParser(truncateOnSpaces(plainText(props.item.description_fr), 200)) : ReactHtmlParser(truncateOnSpaces(plainText(props.item.description_esp), 200)) : ""}
                                {   props.languageName == "fr" ?
                                        props.item.description_fr == null || props.item.description_fr == "" ?  ReactHtmlParser(truncateOnSpaces(plainText(props.item.description), 200)) : ReactHtmlParser(truncateOnSpaces(plainText(props.item.description_fr), 200)) : ""}
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-white text-dark mb-3 mt-3 px-3 m-0 p-0 border-top-0">
                    <div className="d-flex mb-0 justify-content-between">
                        {/* <div className="d-flex mr-5 pr-4">
                            <div>
                                {props.item.process_status == "New Job" ? (
                                    <img className="svg-sm mt-1" src="/svgs/icons/info-star.svg" alt="fire" />
                                ) : props.item.process_status === "Actively Hiring" ? (
                                    <img className="svg-sm mt-1" src="/svgs/icons/fire_icon.svg" alt="info-star" />
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="pt-1">
                                <h6 className="text-muted mt-1 m-0" title="">
                                    {props.item.process_status}
                                </h6>
                            </div>
                        </div> */}
                        <div className="pt-1">
                            {userAuthorized ? (
                                <a className="icon-invert" onClick={(e) => markAsBookmark(props.item.id)} tabIndex="0" onKeyPress={(e) => toggleBookmark(e, props.item.id)}>
                                    {/* {console.log("isBookmark == : ",isBookmark)} */}
                                    {isBookmark ? (
                                        <img
                                            className="svg-sm mt-1"
                                            src="/svgs/icons_new/bookmark-filled.svg"
                                            alt="bookmark saved"
                                        />
                                    ) : (
                                        <img
                                            className="svg-sm mt-1 bookmark-gray "
                                            src="/svgs/icons_new/bookmark.svg"
                                            alt="bookmark unsaved"
                                        />
                                    )}
                                </a>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="text-right">
                            <Link
                                to={{
                                    pathname: `/jobs/${props.item.slug}`,
                                    state: props.item.slug,
                                }}
                                tabIndex="0"
                                className="buttonFocus btn btn-outline-dark rounded">
                                {/* {props.is_user == 1 ? "Apply" : "View"} */}
                                {t(props.language?.layout?.jobs_view)}
                                {/* {props.item.easy_apply ? "Easy Apply" : "Apply"} */}
                            </Link>
                            {/* <button className="btn btn-outline-dark stretched-link rounded">
                                {props.item.easy_apply ? "Easy Apply" : "Apply"}
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
        userToken: state.authInfo.userToken,
    };
}


export default connect(mapStateToProps)(JobCard);
