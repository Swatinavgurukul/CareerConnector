import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ReactDOM from "react-dom";
import { useState } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const RoportIssue = (props) => {
    const { t } = useTranslation();
    const [type, setType] = useState();
    const [message, setMessage] = useState();

    const reset = () => {
        setType();
        setMessage();
    };

    const submitData = () => {
        let formData = new FormData();
        formData.append("feedback_type", `Microsoft Career Connector - ${type}`);
        formData.append("description", message);
        formData.append("page", window.location.href);
        Axios.post("api/v1/feedback", formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                toast.success(t(props.language?.layout?.toast29_nt));
            })
            .catch((error) => {
                toast.error(t(props.language?.layout?.toast28_nt));
            });
    };

    const validation = () => {
        if (!type || !message) {
            toast.error(t(props.language?.layout?.toast30_nt));
            return;
        } else {
            submitData();
            props.closeModal("close");
            reset();
        }
    };

    return (
        <>
            <Modal size="lg" show={props.show} onHide={() => props.closeModal("close")}>
                <div className="modal-content pt-1">
                    <div className="modal-header px-3">
                        <h5 className="modal-title font-weight-bold pb-2" id="staticBackdropLabel">
                        {t(props.language?.layout?.feedbackform_nt)}
                        </h5>
                        <button
                            type="button"
                            className="close animate-closeicon"
                            aria-label="Close"
                            title={t(props.language?.layout?.all_close_nt)}
                            onClick={() => {
                                props.closeModal("close");
                                reset();
                            }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body px-3 pt-0">
                        <div class="form-group animated">
                            <label for="exampleFormControlSelect1" className="form-label-active text-muted">
                            {t(props.language?.layout?.ep_jobs_type)} *
                            </label>
                            <select
                                className="form-control text-muted"
                                value={type}
                                onChange={(e) => setType(e.target.value)}>
                                <option selected="" className="d-none">
                                {t(props.language?.layout?.ep_setting_bd_select)} {t(props.language?.layout?.ep_jobs_type)}
                                </option>
                                <option value="Complaints">{t(props.language?.layout?.feedbackform_type_nt)}</option> 
                                <option value="Suggestions">{t(props.language?.layout?.feedbackform_type1_nt)}</option> 
                                <option value="Questions">{t(props.language?.layout?.feedbackform_type2_nt)}</option> 
                                <option value="Others">{t(props.language?.layout?.feedbackform_type3_nt)}</option> 
                            </select>
                        </div>
                        <div class="form-group animated mb-3">
                            <label class="form-label-active text-muted" for="textarea">
                            {t(props.language?.layout?.seeker_des)} *
                            </label>
                            <textarea
                                rows="3"
                                type="text"
                                class="form-control p-3"
                                id="textarea"
                                name="textarea"
                                placeholder= {t(props.language?.layout?.feedback_suggestiion_nt)}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}></textarea>
                        </div>
                        {/* <button className="btn btn-light mt-3" onClick={() => screenShot()}>Take Screenshot</button> */}
                    </div>
                    <div className="modal-footer py-2 px-3">
                        <button className="btn btn-primary" onClick={() => validation()}>
                        {t(props.language?.layout?.ep_importjob_submit)}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, {})(RoportIssue);
