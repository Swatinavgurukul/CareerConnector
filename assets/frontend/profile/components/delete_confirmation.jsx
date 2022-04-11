import React from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

function DeleteConfirmation(props) {
    const { t } = useTranslation();
    return (
        <Modal size="sm" show={props.delete_confirm_modal} onHide={() => props.statusDeleteConfirmModal(false)}>
            <div className="modal-content p-3 border-0">
                <div className="modal-header border-0 p-0">
                    <button
                        type="button"
                        className="close animate-closeicon"
                        aria-label="Close"
                        title={t(props.language?.layout?.all_close_nt)}
                        onClick={() => props.statusDeleteConfirmModal(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body text-center">
                    <p> {t(props.language?.layout?.all_suredelete_nt)}</p>
                    <div className="row mt-4">
                        <div className="col-md-6">
                            <button
                                className="btn btn-outline-secondary btn-block"
                                onClick={() => props.statusDeleteConfirmModal(false)}>
                                {t(props.language?.layout?.no_nt)}
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-primary btn-block"
                            onClick={props.delete}>
                                {t(props.language?.layout?.all_yes_nt)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps)(DeleteConfirmation);
