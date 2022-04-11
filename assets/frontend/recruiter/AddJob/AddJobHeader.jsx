import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const AddJobHeader = (props) => {
    const { t } = useTranslation();
    return (
        <div>
            <div className="container-fluid">
                <div className="row bg-light pt-3 pb-2 px-3">
                    <div className="col-md-12 d-flex align-items-center my-2 px-0">
                        <h4 className="mb-0 icon-invert">
                            <Link to={`/jobs/`} className="text-muted" aria-describedby="All Jobs">
                            {t(props.language?.layout?.ep_jobs_alljobs)}
                            </Link>
                            <img
                                className="svg-sm mx-1"
                                src="svgs/icons_new/chevron-right.svg"
                                title="Arrow"
                                alt="Arrow Icon"
                            />
                            {props.edit ? <span>{t(props.language?.layout?.job_edit_nt)}</span> : <span>{t(props.language?.layout?.job_add_nt)}</span>} 
                        </h4>
                    </div>
                    <div className="col-md-12 d-flex align-items-center py-2 px-0">
                        <img className="svg-lg-x2" src="svgs/rich_icons/jobs.svg" title="Arrow" alt="Arrow Icon" />
                    </div>
                </div>
                <div className="row ml-xl-5 ml-lg-2 ml-md-2 my-3 mt-4">
                    <div className="col-lg-9">
                        <div class="card-group">
                            <div class="card border-0">
                                <div
                                    class={`card-body d-flex px-0 ${
                                        props.currentStep === 1 ? "timeline-item-progress" : "timeline-item-finish"
                                    }`}>
                                    <div class="timeline-item-icon">
                                        <span class="timeline-icon">
                                            {props.currentStep === 1 ? (
                                                1
                                            ) : (
                                                <img src="/svgs/icons_new/check.svg" class="svg-xs invert-color"  alt="Job Detail"/>
                                            )}
                                        </span>
                                    </div>
                                    <div class="d-inline-block timeline-item-title p-0 mt-3">                                    
                                        <span className="font-weight-bold">{t(props.language?.layout?.ep_createjob_detail)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="card border-0">
                                <div
                                    class={`card-body d-flex px-0 ${
                                        props.currentStep === 2
                                            ? "timeline-item-progress"
                                            : props.currentStep === 3
                                            ? "timeline-item-finish"
                                            : props.finalstep
                                            ? "timeline-item-finish"
                                            : ""
                                    }`}>
                                    <div class="timeline-item-icon mx-2">
                                        <span class="timeline-icon">
                                            {props.currentStep === 2 ? (
                                                2
                                            ) : props.currentStep === 1 ? (
                                                2
                                            ) : (
                                                <img src="/svgs/icons_new/check.svg" class="svg-xs invert-color" alt="Job Configuration" />
                                            )}
                                        </span>
                                    </div>
                                    <div class="d-inline-block timeline-item-title p-0 mt-3">
                                        <span className="font-weight-bold">{t(props.language?.layout?.ep_createjob_configuration)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="card border-0">
                                <div
                                    class={`card-body d-flex px-0 ${
                                        props.currentStep === 1
                                            ? ""
                                            : props.currentStep === 3
                                            ? "timeline-item-progress"
                                            : props.currentStep === 2
                                            ? ""
                                            : props.finalstep && "timeline-item-finish"
                                    }`}>
                                    <div class="timeline-item-icon ml-2">
                                        <span class="timeline-icon">
                                            {" "}
                                            {props.currentStep === 1
                                                ? 3
                                                : props.currentStep === 2
                                                ? 3
                                                : props.currentStep === 3
                                                ? 3
                                                : props.finalstep && (
                                                      <img
                                                          src="/svgs/icons/check_new.svg"
                                                          class="svg-xs invert-color"
                                                          alt="Workflow"
                                                      />
                                                  )}
                                        </span>
                                    </div>
                                    <div class="workflow-step">
                                        <span className="font-weight-bold">{t(props.language?.layout?.job_workflow_nt)}</span> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(AddJobHeader);

