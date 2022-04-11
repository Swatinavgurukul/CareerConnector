import React, { useContext } from "react";
import { InputContext } from "../Context/InputContext.js";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const Resume = (props) => {
    const { t } = useTranslation();
    let {
        formOnChangeHandler,
        uploadResume,
        isValidFileType,
        error,
        cancelUpdate,
        disableBtn,
        onDropHandle,
        formValues,
    } = useContext(InputContext);

    return (
        <div id="resumeForm" className="col-md-10 offset-1">
            <form className="my-3">
                <div class="form-group">
                    {error ? <p className="text-danger">{error}</p> : null}

                    <Dropzone onDrop={onDropHandle}>
                        {({ getRootProps, getInputProps }) => (
                            <section className="border">
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} accept=".pdf,.docx,.doc" />
                                    {formValues.fileName ? (
                                        <p>{formValues.fileName}</p>
                                    ) : (
                                        <p className="p-2 mb-0">{t(props.language?.layout?.dragresume_nt)}</p>
                                    )}
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    {/* <input
                            type="file"
                            class="form-control-file mt-3"
                            id="exampleFormControlFile1"
                            accept=".pdf,.doc"
                            onChange={formOnChangeHandler("file")}></input>
                        <span
                            className="mt-3"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Supported file docx and pdf.">
                            <img class="mb-1 ml-1 svg-xs" alt="info" src="/svgs/icons/info-circle.svg" />
                        </span> */}

                    <div className="col-md-12 d-flex justify-content-between">
                        <button
                            className="btn btn-light bg-danger text-white mt-3"
                            onClick={cancelUpdate}
                            disabled={disableBtn}>
                            {t(props.language?.layout?.js_account_cancel)}
                        </button>
                        <button className="btn btn-primary mt-3" onClick={uploadResume} disabled={disableBtn}>
                        {t(props.language?.layout?.js_profile_upload)}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps, {})(Resume);
