import React, { useEffect, useState } from "react";
import { parse, format, formatDistanceStrict } from "date-fns";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

function EducationItem(props) {
    const { t } = useTranslation();
    const unformated_start_date = props.item.start_date;
    const unformated_end_date = props.item.end_date;
    const start_date = !unformated_start_date === null ? new Date() : new Date(unformated_start_date);
    const end_date = !unformated_end_date === null ? new Date() : new Date(unformated_end_date);

    return (
        <div className="vertical-timeline-el-body w-100 mt-n3">
            <div className="mx-0 d-flex">
                <div className="d-flex mr-auto icon-invert">
                    <img src="/svgs/icons_new/smashicons_education_graduation-cap-icon-48-outline.svg" alt="education" className="float-left mr-2 svg-lg" />
                    <div className="mt-1">
                        <h4 className="text-capitalize">{props.item.degree === "Null" ? "" : props.item.degree}</h4>
                        <p className="text-muted mb-0 text-capitalize">{props.item.university_name == null ? "" : props.item.university_name}</p>
                        <p className="mb-1 text-muted">

                            {!unformated_start_date ? "" : format(start_date, "LLL yyyy")}
                            {props.item.is_current
                                ? " - Present"
                                : !unformated_end_date
                                    ? ""
                                    : !unformated_start_date
                                        ? format(end_date, "LLL yyyy")
                                        : " - " + format(end_date, "LLL yyyy")}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    {props.isPreviewMode ? null : (
                        <button
                            type="button"
                            className="btn btn-outline-light bg-white icon-invert no-outline rounded-0 d-print-none"
                            onClick={(e) => props.editEducation(props.index)}>
                            <img src="/svgs/icons_new/edit-2.svg" className="svg-xs svg-gray" title={t(props.language?.layout?.all_edit_nt)} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps, {})(EducationItem);
