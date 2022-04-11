import React, { useState } from "react";
import { parse, format, formatDistanceStrict } from "date-fns";

export default function AccomplishmentItem(props) {
    const unformated_start_date = props.item.start_date;
    const unformated_end_date = props.item.end_date;
    const start_date = unformated_start_date === null ? new Date() : new Date(unformated_start_date);
    const end_date = unformated_end_date === null ? new Date() : new Date(unformated_end_date);

    return (
        <div className="vertical-timeline-el-body w-100 mt-n1">
            <div className="mx-0 d-flex">
                <div className="d-flex mr-auto">
                    <img
                        src="/svgs/icons_new/accomplishmentsBadge.svg"
                        className="float-left mr-2 svg-lg icon-invert"
                        alt="accomplishmentsBadge"
                    />
                    <div>
                        {console.log(props.item.achievement_name)}
                        {props.item.achievement_name !== null ? (
                            <h5>{props.item.achievement_name}</h5>
                        ) : null}
                        {props.item.issuer_organization !== null ? (
                            <div className="text-muted h6"> {props.item.issuer_organization}</div>
                        ) : null}
                        <p className="mb-1 text-muted">
                            {unformated_start_date === null ? "" : format(start_date, "LLL yyyy")}
                            {unformated_start_date === null || unformated_end_date === null ? "" : " - "}
                            {unformated_end_date === null ? "" : format(end_date, "LLL yyyy")}
                        </p>
                    </div>
                </div>

                <div className="icon-invert text-right">
                    {props.isPreviewMode ? null : (
                        <button
                            type="button"
                            className="btn btn-outline-light bg-white no-outline rounded-0 d-print-none"
                            onClick={(e) => props.editAcheviment(props.index)}>
                            <img src="/svgs/icons_new/edit-2.svg" className="svg-xs svg-gray" title="Edit" alt="edit"/>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
