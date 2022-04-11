import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const Contact = (props) => {
    const { t } = useTranslation();
    return (
        <Modal size="lg" show={props.show} onHide={() => props.closeModal("close")}>
            <div className="modal-content pt-1">
                <div className="modal-header px-3 d-flex align-items-center icon-invert">
                    <h4 className="modal-title font-weight-bold" id="staticBackdropLabel">
                    {t(props.language?.layout?.all_contact_nt)}
                    </h4>
                    <button
                        type="button"
                        className="close animate-closeicon py-0"
                        aria-label="Close"
                        title={t(props.language?.layout?.all_close_nt)}
                        onClick={() => props.closeModal("close")}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-3 d-flex align-items-center icon-invert">
                    <div className="col h-100 d-flex justify-content-center">
                        <ul
                            className="list-unstyled mb-0 h-100 d-flex flex-column justify-content-around"
                            style={{ width: "fit-content" }}>
                            <li className="d-flex align-items-center icon-invert my-4">
                                <img src="/svgs/icons_new/phone.svg" alt="phone" className="svg-lg mr-3" />
                                <a href="tel://+1 888-323-7470" className="display-5 text-danger h1">
                                    +1 888-323-7470
                                </a>
                            </li>
                            <li className="d-flex align-items-center icon-invert mb-4">
                                <img src="/svgs/icons_new/mail.svg" alt="email" className="svg-lg mr-3" />
                                <a href="mailto:support@simplifyhire.com" className="h2">
                                    support@simplifyhire.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* <div className="modal-footer py-2 px-3">
                    </div> */}
            </div>
        </Modal>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps)(Contact);
