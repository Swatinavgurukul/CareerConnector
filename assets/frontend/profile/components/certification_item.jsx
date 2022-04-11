import React, { useState } from "react";
import { parse, format, formatDistanceStrict } from "date-fns";

export default function CertificationItem(props) {
    const unformated_start_date = props.item.start_date;
    const unformated_end_date = props.item.end_date;
    const start_date = unformated_start_date === null ? new Date() : new Date(unformated_start_date);
    const end_date = unformated_end_date === null ? new Date() : new Date(unformated_end_date);
    return (
        <div className="vertical-timeline-el-body w-100 mt-n1">
            {props.item.certification_name === null ? null : (
                <div className="mx-0 d-flex">
                    <div className="d-flex mr-auto icon-invert">
                        <img src="/svgs/icons_new/certificates.svg" alt="certificate" className="float-left mr-2 svg-lg" />
                        <div>
                            <h5 className="text-capitalize">{props.item.certification_name === "Null" ? "" : props.item.certification_name}</h5>
                            <div  className="text-muted h6">
                                {" "}
                                {props.item.issuer_organization !== null ? props.item.issuer_organization : "-"}
                            </div>
                            <p className="mb-1 text-muted">
                                {unformated_start_date === null ? "" : format(start_date, "LLL yyyy")}
                                {unformated_start_date === null || unformated_end_date === null ? "" : " - "}
                                {unformated_end_date === null ? "" : format(end_date, "LLL yyyy")}
                            </p>
                        </div>
                    </div>

                    <div className="text-right ">
                        {props.isPreviewMode ? null : (
                            <button
                                type="button"
                                className="btn btn-outline-light bg-white no-outline icon-invert rounded-0 d-print-none"
                                onClick={(e) => props.editCertification(props.index)}>
                                <img src="/svgs/icons_new/edit-2.svg" className="svg-xs svg-gray" title="Edit" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
