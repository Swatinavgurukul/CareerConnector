import React, { useEffect, useState } from "react";
import { parse, format, formatDistanceStrict } from "date-fns";
import { truncate } from "../../modules/helpers.jsx";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { employmentType, monthData } from "../../../translations/helper_translation.jsx";
import { es, fr, enUS as en } from 'date-fns/locale';

function WorkItem(props) {
    const { t } = useTranslation();
    const start_date = props.item.start_date !== null ? new Date(props.item.start_date) : new Date();
    const end_date = props.item.end_date === null ? new Date() : new Date(props.item.end_date);
    const [description, setDescription] = useState("");
    const [showMore, setShowMore] = useState(true);
    const [showMoreCheck, setShowMoreCheck] = useState(false);
    useEffect(() => {
        // console.log(props.isPreviewMode,"props.isPreviewMode",  props.isAdminMode)
        if (props.isPreviewMode && props.isAdminMode === undefined) {
            setDescription(props.item.description);
            setShowMoreCheck(true);
        } else {
            if (props.item.description && props.item.description !== null && props.item.description.length < 350) {
                setDescription(props.item.description);
                setShowMoreCheck(true);
            } else {
                setShowMoreCheck(false);
                setShowMore(true);
                setDescription(truncate(props.item.description, 350));
            }
        }
    }, [props.item.description, props.isPreviewMode]);

    const show = () => {
        if (props.item.description && props.item.description !== null && props.item.description.length > 350) {
            setShowMoreCheck(false);
            setShowMore(!showMore);
            showMore ? setDescription(props.item.description) : setDescription(truncate(props.item.description, 350));
        }
    };
    const employmentHandler = (language, key) => {
        return(employmentType[language][key]);
    }
    const monthDataHandler = (language, key) => {
        return(monthData[language][key]);
    }
    return (
        <div className="vertical-timeline-el-body w-100 mt-n3">
            <div className="mx-0 d-flex">
                <div className="d-flex mr-auto icon-invert">
                    <img className="float-left mr-2 svg-lg" src="/svgs/icons_new/smashicons_real_estate_building-icon-14-outline.svg" alt="Company Logo" />
                    <div>
                        {props.item.title !== "Null" && props.item.title !== null && (
                            <h5 className="text-dark text-capitalize">{props.item.title}</h5>
                        )}

                        <p className="mb-2 text-muted">
                            {start_date != "Invalid Date"
                                ? props.item.start_date === null
                                    ? ""
                                    : monthDataHandler(props?.languageName, format(start_date, "LLL")) + " " + format(start_date, "yyyy") + " - "
                                : ""}
                            {/* {end_date != "Invalid Date" && start_date != "Invalid Date" ? " - " : ""} */}
                            {props.item.is_current
                                ? t(props.language?.layout?.present_nt)
                                : props.item.end_date === null
                                    ? t(props.language?.layout?.present_nt)
                                    : end_date != "Invalid Date"
                                        ? monthDataHandler(props?.languageName, format(end_date, "LLL")) + " " + format(end_date, "yyyy")
                                        : ""}
                            {end_date != "Invalid Date" && start_date != "Invalid Date" ? ", " : ""}
                            {end_date != "Invalid Date" && start_date != "Invalid Date"
                                ? formatDistanceStrict(end_date, start_date, { addSuffix: false, locale: props.languageName === "en" ? en : props.languageName === "es"? es: fr })
                                : ""}
                            {end_date != "Invalid Date" && props.item.employment_type != "" ? ", " : ""}
                            {props.item.employment_type !== null ? employmentHandler(props?.languageName, props.item.employment_type) : ""}
                        </p>
                        <div className="text-muted h6 text-capitalize">
                            {props.item.organization}{" "}
                            {props.item.org_state !== "" && props.item.org_state !== undefined
                                ? props.item.org_state !== null
                                    ? "," + props.item.org_state
                                    : ""
                                : ""}
                                
                            {props.item.city && props.item.city !== undefined
                                ? ", " + props.item.city
                                : null}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    {props.isPreviewMode || props.isAdminMode ? null : (
                        <button
                            type="button"
                            className="btn icon-invert  buttonFocus bg-white d-print-none rounded-0"
                            onClick={(e) => props.editWork(props.index)}>
                            <img src="/svgs/icons_new/edit-2.svg" className="svg-xs svg-gray" title={t(props.language?.layout?.all_edit_nt)} />
                        </button>
                    )}
                </div>
            </div>
            {/* <li className="pending">
                    <div className="bullet"></div> */}
            <div className="d-flex">
                <p className="text-muted ml-5 pr-5 text-justify ">
                    {description}
                    {!showMoreCheck ? (
                        showMore ? (
                            <div className="text-right text-primary pointer mt-n3 d-print-none" onClick={() => show()}>
                                {props.item.description && props.item.description !== null ? props.item.description.length > 350 ?
                                    <a type="button" tabIndex="0" class="btn buttonFocus text-primary py-1 d-print-none">{t(props.language?.layout?.all_showmore_nt)}</a> : "" : ""}
                            </div>
                        ) : (
                            <div className="text-right text-primary pointer mt-n0 d-print-none" onClick={() => show()}>
                                <a type="button" tabIndex="0" class="btn buttonFocus text-primary py-1 d-print-none">{t(props.language?.layout?.all_showless_nt)}</a>
                            </div>
                        )
                    ) : null}
                </p>
            </div>

            {/* </li> */}
        </div>
    );
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}
export default connect(mapStateToProps)(WorkItem);
