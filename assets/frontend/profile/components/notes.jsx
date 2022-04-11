import React, { useState, Fragment } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { truncate, plainText } from "../../modules/helpers.jsx";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { jobstage } from "../../../translations/helper_translation.jsx";

const notes = (props) => {
    const { t } = useTranslation();
    const [noteText, setNoteText] = useState("");
    const applicationJourney = [];

    const addNotes = () => {
        if (noteText) {
            props.noteHandler(noteText);
            setNoteText("");
        }
        else {
            toast.error(t(props.language?.layout?.toast44_nt));

        }
    };
    const jobStageHandler = (language, key) =>{
        return(jobstage[language][key]);
    }

    if (props.application_journey) {
        for (var i in props.application_journey) {
            applicationJourney.push(
                <li className={parseInt(i) === 0 ? "done" : "pending"}>
                    <div className={props.application_journey.length <= 1 ? "" : "bullet"}></div>
                    <div className={props.application_journey.length <= 1 ? "" : "vertical-timeline-el-body w-100 mt-n5"}>
                        <p
                            className={parseInt(i) === 0 ? "font-weight-bold mb-1" : "text-muted mb-1"}
                            data-toggle="collapse">
                            {jobStageHandler(props?.languageName, props.application_journey[i].status)}
                        </p>
                        <p className="small mb-1">
                            {" "}
                            {format(new Date(props.application_journey[i].created_at), "MMM dd, yyyy")}
                        </p>
                    </div>
                </li>
            );
        }
    }
    return (
        <Fragment>
            <div className="border rounded p-3 d-print-none mb-4 shadow-sm">
                <h3>{t(props.language?.layout?.profile_notes_nt)}</h3>
                <div>
                    {props.job_details === undefined || !props.job_details.length ? (
                        <div className="text-center mt-n2">
                            <img
                                className="img-fluid"
                                src="/svgs/illustrations/no-notes-illustration.svg"
                                alt="No Notes"
                            />
                            <p class="text-muted mt-2">{t(props.language?.layout?.sp_viewseeker_nonotes)}</p>
                        </div>
                    ) : (
                        <div class="row mb-3 note-view thin-scrollbar">
                            {props.job_details.map((noteData, index) => (
                                <div class="col-12 p-md-0 p-lg-2">
                                    <div class="notes-user-image-col">
                                        <div
                                            className="rounded-circle mr-2 text-capitalize text-center d-flex mr-2 align-items-center justify-content-center mt-1"
                                            style={{ width: "40px", height: "40px", backgroundColor: "#80808029" }}>
                                            {noteData.commented_user_name === null
                                                ? ""
                                                : noteData.commented_user_name.charAt(0) }
                                        </div>
                                    </div>
                                    <div class="notes-decription-col">
                                        <p class="text-muted text-capitalize mb-0">
                                            {noteData.commented_user_name === null ? "" : noteData.commented_first_name +" "+ noteData.commented_last_name}
                                        </p>
                                        <p class="mb-1">
                                            {noteData.note_text === null
                                                ? ""
                                                : truncate(plainText(noteData.note_text), 250)}
                                        </p>
                                        <p class="small text-right">
                                            {noteData.created_at === null
                                                ? ""
                                                : format(new Date(noteData.created_at), "MMM dd, yyyy | HH:mm a")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <hr className="mx-n3" />
                    <div class="row mb-2">
                        <div class="col-12">
                            <form>
                                <div class="form-group animated mt-n2">
                                    <label class="form-label" for="textarea"></label>
                                    <textarea
                                        type="text"
                                        onChange={(e) => setNoteText(e.target.value)}
                                        class="form-control border-0"
                                        id="textarea"
                                        value={noteText}
                                        placeholder= {t(props.language?.layout?.ep_jobseeker_addcomment)}
                                        name="textarea"
                                        style={{ resize: "none" }}></textarea>
                                </div>

                                <div className="text-right">
                                    <button onClick={addNotes} type="button" class="btn btn-primary brand-color">
                                    {t(props.language?.layout?.profile_note_nt)}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {props.noApplicationStatus || props.application_journey === undefined ? null : (
                <div className="shadow-sm border rounded p-3 d-print-none mb-3 application-journey-block">
                    <h3>{t(props.language?.layout?.ep_jobseeker_applicationjourney)}</h3>
                        <div className="row note-view h-22rem thin-scrollbar pt-3">
                            <div className="col-12">
                                <div className="row pt-1">
                                    <div className="col-md-12">
                                        <ul className={applicationJourney.length <= 1 ? "" : "vertical-timeline"}>
                                            {applicationJourney}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            )}
        </Fragment>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}
export default connect(mapStateToProps)(notes);
