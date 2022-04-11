import React, { Component, lazy } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { truncate } from "../../modules/helpers.jsx";
import { Fragment } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
class ResumeScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resume_data: {},
            selectCheck: false,
        };
    }

    render() {
        const { t } = this.props;
        var temp = 0;
        var resume_result = 0;
        Object.values(this.props.resume_data).map((x) => {
            resume_result = temp + x;
            temp = resume_result;
        });
        if (this.props.resume_data.about_me === 0 && this.props.resume_data.personal_info !== 0) {
            resume_result = resume_result - this.props.resume_data.personal_info;
        }
        const togglePreviewProfile = (e) => {
            if (e.key == "Enter") {
                e.target.children[0].checked = !e.target.children[0].checked;
                this.state.previewMode;
                this.props.seePreview();
            }
        };
        const toggleShowRecruiter = (e) => {
            if (e.key == "Enter") {
                e.target.children[0].checked = !e.target.children[0].checked;
                this.props.saveProfileDetails(
                    { availability: { show_profile: e.target.children[0].checked } },
                    this.props.availability_id
                );
            }
        };
        return (
            <div>
                <div className="border rounded p-1 d-print-none">
                    <div className="mt-4 px-2">
                        <div className="text-muted d-flex justify-content-between">
                            <h4>{t(this.props.language?.layout?.js_profile_profilescore)}</h4>
                            <h4>{resume_result}&#x25;</h4>
                        </div>

                        <div className="progress mt-2 w-100" style={{ height: "6px" }}>
                            <div
                                className="progress-bar bg-success"
                                values={resume_result}
                                aria-valuemax="100"
                                style={{ width: `${resume_result}%` }}>
                                <div className="value">
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className="ml-2 mt-3">
                        <div className="custom-control custom-checkbox mb-2 d-flex justify-content-star">
                            <label
                                for="customCheck5"
                                className={
                                    this.props.resume_data.about_me !== 0
                                        ? "form-check-label rounded-circle bg-success p-2"
                                        : "form-check-label rounded-circle p-2"
                                }></label>
                            {this.props.resume_data.about_me !== 0 ? (
                                <h5 className="text-dark h5" htmlFor="customCheck5">{t(this.props.language?.layout?.js_profile_personalinfo)}</h5>
                            ) : (
                                <div className="d-flex justify-content-between flex-fill">
                                    <h5 className="text-muted mr-2" htmlFor="customCheck5">{t(this.props.language?.layout?.js_profile_personalinfo)}</h5>
                                    <span className="text-brown mb-0 mt-1">+25%</span>
                                </div>
                            )}
                        </div>
                        <div className="custom-control custom-checkbox mb-2 d-flex justify-content-star">
                            <label
                                for="customCheck"
                                className={
                                    this.props.resume_data.uploads !== 0
                                        ? "form-check-label rounded-circle bg-success"
                                        : "form-check-label rounded-circle"
                                }></label>
                            {this.props.resume_data.uploads !== 0 ? (
                                <h5 className="text-dark" htmlFor="customCheck">
                                    {t(this.props.language?.layout?.js_profile_uploads)}
                                </h5>
                            ) : (
                                <div className="d-flex justify-content-between flex-fill">
                                    <h5 className="text-muted" htmlFor="customCheck">
                                        {t(this.props.language?.layout?.js_profile_uploads)}
                                    </h5>
                                    <span className="text-brown mb-0 mt-1">+20%</span>
                                </div>
                            )}
                        </div>
                        <div className="custom-control custom-checkbox mb-2 d-flex justify-content-start">
                            <label
                                for="customCheck1"
                                className={
                                    this.props.resume_data.work_experience !== 0
                                        ? "form-check-label rounded-circle bg-success"
                                        : "form-check-label rounded-circle"
                                }></label>
                            {this.props.resume_data.work_experience !== 0 ? (
                                <h5 className="text-dark" htmlFor="customCheck1">
                                    {t(this.props.language?.layout?.js_profile_workexperience)}
                                </h5>
                            ) : (
                                <div className="d-flex justify-content-between flex-fill">
                                    <h5 className="text-muted" htmlFor="customCheck1">
                                        {t(this.props.language?.layout?.js_profile_workexperience)}
                                    </h5>
                                    <span className="text-brown">+15%</span>
                                </div>
                            )}
                        </div>
                        <div className="custom-control custom-checkbox mb-2 d-flex justify-content-start">
                            <label
                                for="customCheck2"
                                className={
                                    this.props.resume_data.education_details !== 0
                                        ? "form-check-label rounded-circle bg-success"
                                        : "form-check-label rounded-circle"
                                }></label>
                            {this.props.resume_data.education_details !== 0 ? (
                                <h5 className="text-dark " htmlFor="customCheck2">
                                    {t(this.props.language?.layout?.js_profile_academicdetail)}
                                </h5>
                            ) : (
                                <div className="d-flex justify-content-between flex-fill">
                                    <h5 className="text-muted " htmlFor="customCheck2">
                                        {t(this.props.language?.layout?.js_profile_academicdetail)}
                                    </h5>
                                    <span className="text-brown">+15%</span>
                                </div>
                            )}
                        </div>
                        <div className="custom-control custom-checkbox mb-2 d-flex justify-content-start">
                            <label
                                for="customCheck3"
                                className={
                                    this.props.resume_data.trainings_certification !== 0
                                        ? "form-check-label rounded-circle bg-success"
                                        : "form-check-label rounded-circle"
                                }></label>
                            {this.props.resume_data.trainings_certification !== 0 ? (
                                <h5 className="text-dark" htmlFor="customCheck3">
                                    {t(this.props.language?.layout?.js_profile_certificates)}
                                </h5>
                            ) : (
                                <div className="d-flex justify-content-between flex-fill">
                                    <h5 className="text-muted" htmlFor="customCheck3">
                                        {t(this.props.language?.layout?.js_profile_certificates)}
                                    </h5>
                                    <span className="text-brown">+10%</span>
                                </div>
                            )}
                        </div>
                        <div className="custom-control custom-checkbox mb-2 d-flex justify-content-start">
                            <label
                                for="customCheck4"
                                className={
                                    this.props.resume_data.skills !== 0
                                        ? "form-check-label rounded-circle bg-success"
                                        : "form-check-label rounded-circle"
                                }></label>
                            {this.props.resume_data.skills !== 0 ? (
                                <h5 className="text-dark " htmlFor="customCheck4">
                                    {t(this.props.language?.layout?.js_profile_skill)}
                                </h5>
                            ) : (
                                <div className="d-flex justify-content-between flex-fill">
                                    <h5 className="text-muted" htmlFor="customCheck4">
                                        {t(this.props.language?.layout?.js_profile_skill)}
                                    </h5>
                                    <span className="text-brown">+15%</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {this.props.isadmin ? null : (this.props.isPreviewMode === true &&
                    this.props.resume_parsed === false) ||
                    this.props.candidateProfile === true ? null : (
                    <div class="border mt-3 rounded p-2 rounded">
                        {!this.props.resumebulkFile?.length ? null : (
                            <div className="resume-height-view thin-scrollbar">

                                {process.env.CLIENT_NAME === "cc" &&
                                    <Fragment>
                                        {this.props.resumebulkFile.map((data, i) => (
                                            <div className="row align-items-start mb-3">
                                                <div className="icon-invert p-0 col-md-1">
                                                    <img
                                                        src="/svgs/icons_new/file.svg"
                                                        className="svg-sm mt-1 ml-2"
                                                        alt="file"
                                                    />
                                                </div>
                                                <div className="col-md-11 overflow-wrap">
                                                    <div className="d-flex">
                                                        <div title={data.file}>{truncate(data.file, 20)}</div>
                                                        {this.props.isPreviewMode === false ? (
                                                            <div class="form-check custom-radio ml-auto mb-0">
                                                                <input
                                                                    class="form-check-input pointer"
                                                                    type="radio"
                                                                    name="exampleradio"
                                                                    id="exampleradio"
                                                                    checked={data.default}
                                                                    onChange={() => this.props.checkHandler(data.file)}
                                                                />
                                                                <label class="form-check-label" for="exampleradio"></label>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                        <div>
                                                            <a
                                                                href={"/media/resume/" + data.file}
                                                                download
                                                                className="icon-invert mx-1 p-1 btn-svg-sm rounded btn-light">
                                                                <img
                                                                    src="/svgs/icons_new/download.svg"
                                                                    class="candidate-download-icon "
                                                                    title={t(this.props.language?.layout?.ep_jobtitle_downloadresume)}
                                                                    alt="download"
                                                                />
                                                            </a>
                                                        </div>
                                                        {this.props.isPreviewMode === false ? (
                                                            <div>
                                                                <a className="icon-invert p-1 btn-svg-sm rounded btn-light">
                                                                    <img
                                                                        src="/svgs/icons_new/trash.svg"
                                                                        class="candidate-download-icon pointer"
                                                                        title="Delete Resume"
                                                                        alt="delete"
                                                                        onClick={() =>
                                                                            this.props.resumeDeleteHandler(data.file)
                                                                        }
                                                                    />
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                    <small className="d-block mt-1">
                                                        {t(this.props.language?.layout?.js_profile_lastupdated)}{" "}
                                                        <span className="text-brown ml-1">
                                                            {format(new Date(data.updated_at), "dd MMM, yyyy")}
                                                        </span>
                                                    </small>
                                                </div>
                                            </div>
                                        ))}
                                    </Fragment>
                                }
                            </div>


                        )}
                        <Fragment>
                            {!this.props.resumeFile ? null :

                                <div className="row align-items-center">
                                    <div className="icon-invert col-md-2">
                                        <img src="/svgs/icons_new/file.svg" className="svg-sm  ml-2" alt="file" />
                                    </div>
                                    <div className="col-md-10 overflow-wrap" title={this.props.resumeFile}>
                                        {truncate(this.props.resumeFile, 24)}
                                        <a href={"/media/resume/" + this.props.resumeFile} download className="icon-invert ml-2 p-1 btn-svg-sm rounded btn-light">
                                            <img
                                                src="/svgs/icons_new/download.svg"
                                                class="candidate-download-icon "
                                                title={t(this.props.language?.layout?.ep_jobtitle_downloadresume)}
                                                alt="download"
                                            />
                                        </a>
                                        <small className="d-block mt-1">
                                            {t(this.props.language?.layout?.js_profile_lastupdated)} <span className="text-brown ml-1">{this.props.updated == "Today" ? t(this.props.language?.layout?.js_profile_today) : this.props.updated}</span>
                                        </small>
                                    </div>
                                </div>
                            }

                        </Fragment>



                        {this.props.isPreviewMode === false ? (
                            this.props.loading === true ? (
                                <div class="bouncingLoader btn btn-primary  w-100 mt-3 ">
                                    <div></div>
                                </div>
                            ) : (
                                <div className="text-center mt-2" tabIndex="0">
                                    <label className="bicon-invert btn btn-outline-primary btn-block d-flex  justify-content-center py-2 px-2">
                                        <img
                                            src="/svgs/icons_new/upload.svg"
                                            className="svg-xs mr-2 mt-1 ml-0"
                                            alt="upload"
                                        />
                                        {process.env.CLIENT_NAME === "cc" ?
                                            <span>
                                                {!this.props.resumebulkFile?.length ? t(this.props.language?.layout?.js_upload_nt) : t(this.props.language?.layout?.js_profile_updateresume)}</span> :

                                            <span>{this.props.resume_parsed === false ? t(this.props.language?.layout?.js_upload_nt) : t(this.props.language?.layout?.js_profile_updateresume)}</span>
                                        }
                                        <input
                                            type="file"
                                            name="file"
                                            accept=".doc, .docx,.pdf"
                                            hidden
                                            onClick={e => (e.target.value = null)}
                                            onChange={this.props.resumeupload}
                                        />
                                    </label>
                                </div>
                            )
                        ) : null}
                    </div>
                )
                }
                {
                    this.props.isadmin || this.props.candidateProfile === true ? null : (
                        <div>
                            <form className="d-print-none">
                                <hr />
                                <div className="d-flex justify-content-between border border-white">
                                    <p>{t(this.props.language?.layout?.js_profile_preview)}</p>
                                    <div class="form-group animated form-primary-bg">
                                        <div class="switch checkbox-switch switch-success mt-n1">
                                            <label tabIndex={0} onKeyDown={(e) => togglePreviewProfile(e)}>
                                                <input
                                                    type="checkbox"
                                                    id="customSwitch1"
                                                    className=""
                                                    checked={this.state.previewMode}
                                                    onChange={(e) => this.props.seePreview()}
                                                />
                                                <span></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border border-white">
                                    <p>{t(this.props.language?.layout?.js_profile_showmyprofile)}</p>
                                    <div class="form-group animated form-primary-bg">
                                        <div class="switch checkbox-switch switch-success mt-0">
                                            <label tabIndex={0} onKeyDown={(e) => toggleShowRecruiter(e)}>
                                                <input
                                                    type="checkbox"
                                                    id="customSwitch2"
                                                    checked={this.props.show_profile}
                                                    onChange={(e) =>
                                                        this.props.saveProfileDetails(
                                                            { availability: { show_profile: e.target.checked } },
                                                            this.props.availability_id
                                                        )
                                                    }
                                                />
                                                <span></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-center mt-2 mb-3 ${this.props.isPreviewMode ? "d-none" : ""}`}>
                                    <Link to="/settingsv2" className="btn btn-primary  w-100 ">
                                        {t(this.props.language?.layout?.js_profile_settings)}
                                    </Link>
                                    {/* <button type="button" class="btn btn-primary  w-75">Settings</button> */}
                                </div>
                                <div
                                    className={`text-center mt-2 mb-3 ${this.props.isPreviewMode ? "d-block" : "d-none"}`}
                                    onClick={() => {
                                        window.print();
                                    }}>
                                    <label className="icon-invert btn btn-outline-primary btn-block d-flex align-items-center justify-content-center px-2" tabIndex="0">
                                        <img src="/svgs/icons_new/download.svg" className="svg-xs mr-2 ml-0" alt="download" />
                                        {t(this.props.language?.layout?.all_download)} {t(this.props.language?.layout?.seeker_profile)}
                                    </label>
                                </div>
                            </form>
                        </div>
                    )
                }
            </div >
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(withTranslation()(ResumeScore));
