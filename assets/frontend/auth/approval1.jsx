import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { getQueryParameters, isValidThemeLogo } from "../modules/helpers.jsx";
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { Mailto } from "../components/constants.jsx";
import { Fragment } from "react";

const Approval = (props) => {
    const history = useHistory();
    let [openModel, setOpenModel] = useState(false);
    let [data, setData] = useState([]);
    let [message, setMessage] = useState("");
    let [error, setError] = useState(false);
    let [errorLink, setErrorLink] = useState(false);
    const approvalHandle = () => {
        let queryParamsUrl = getQueryParameters(history.location.search);
        axios
            .get("api/v1/approval?uidb64=" + queryParamsUrl.uidb64 + "&token=" + queryParamsUrl.token)
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                setMessage(error.response.data.message);
            });
    };
    const rejectedHandler = () => {
        let queryParamsUrl = getQueryParameters(history.location.search);
        axios
            .get("api/v1/rejected?uidb64=" + queryParamsUrl.uidb64 + "&token=" + queryParamsUrl.token)
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                setMessage(error.response.data.message);
            });
    };

    const dataParams = () => {
        let queryParamsUrl = getQueryParameters(history.location.search);
        let encodedString = queryParamsUrl.datab64;
        let decodedata = ""

        if (encodedString != undefined) {
            try {
                let decodedString = atob(encodedString);
                decodedata = (JSON.parse(decodedString))
            } catch (error) {
                // console.log(error,"error")
                setErrorLink(true)
                return
            }
            setData(decodedata)
        }
        else {
            setError(true)
        }
    }
    useEffect(() => {
        dataParams();
    }, []);

    const closeConfirmHandler = () => {
        setOpenModel(false);
        setMessage("")
        history.push("/");
    };
    return (

            <div className="container">
                <div className="row">
                    <div className="offset-md-3 col-md-6">
                        {errorLink ?
                            <h4 className="mt-5 pb-4 text-center">Link Expired, Please Contact Administrator.</h4> :
                            <Fragment>
                                {!error ?
                                    <Fragment>
                                        <h4 className="mt-5 pb-4 text-center">New Partner Registered to Career Connector site.</h4>
                                        <table class="table">
                                            <thead class="thead-dark">
                                                <tr>
                                                    <th colSpan="2" className="pl-0 text-center">Partner Information</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="pl-5 text-primary">Company</td>
                                                    <td className="pl-5 text-capitalize">{data?.company != null ? data?.company : null}</td>

                                                </tr>
                                                <tr>
                                                    <td className="pl-5 text-primary">Partner Type</td>
                                                    <td className="pl-5 text-capitalize">{data?.partner != null ? data?.partner : null}</td>
                                                </tr>
                                                <tr>
                                                    <td className="pl-5 text-primary">Full Name</td>
                                                    <td className="pl-5 text-capitalize">{data?.user_name != null ? data?.user_name : null}</td>
                                                </tr>
                                                <tr>
                                                    <td className="pl-5 text-primary">Email</td>
                                                    <td className="pl-5">
                                                        <Mailto email={data?.email != null ? data?.email : null} subject="" body="">
                                                            <span style={{ wordBreak: "normal" }} title={data?.email != null ? data?.email : null}>{data?.email != null ? data?.email : null}</span>
                                                        </Mailto>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pl-5 text-primary">Area Code</td>
                                                    <td className="pl-5 text-capitalize">{data?.area_code != null ? data?.area_code : null}</td>
                                                </tr>
                                                <tr>
                                                    <td className="pl-5 text-primary">Phone</td>
                                                    <td className="pl-5">{data?.phone != null ? data?.phone : null}</td>
                                                </tr>
                                                <tr>
                                                    <td className="pl-5 text-primary">How did you hear about Career Connector</td>
                                                    <td className="pl-5 text-capitalize">{data?.custom_field2 != null ? data?.custom_field2 : null}</td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tbody>

                                        </table>
                                    </Fragment> :
                                    <div className="mt-5"></div>
                                }
                                <div className="text-center pt-4">
                                    <button type="button" class="btn btn-success mr-3 px-4" style={{backgroundColor:"#4fb43e"}} onClick={() => { setOpenModel(!openModel); approvalHandle(); }}>
                                        <img
                                            src="/svgs/icons_new/check.svg"
                                            className="svg-xs invert-color mr-2 mt-n1"
                                            title="Approve"
                                            alt="Approve"
                                        />
                                        Approve</button>
                                    <button type="button" class="btn border border-dark px-4" style={{color:"#c22929"}} onClick={() => { setOpenModel(!openModel); rejectedHandler(); }}>
                                        <img
                                            src="/svgs/icons_new/x-red.svg"
                                            className=" mr-2 mt-n1"
                                            title="Reject"
                                            alt="Reject"
                                        />
                                        Reject</button>
                                </div>
                            </Fragment>}
                    </div>

                </div>

                <Modal size={"xs"} show={openModel} onHide={closeConfirmHandler}>
                    <div className="mb-4">
                        <div className="modal-content p-3 border-0">
                            <div className="modal-header px-4 border-0">

                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title="Close"
                                    onClick={closeConfirmHandler}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <h4 className="text-success text-center pt-2">{message}</h4>

                            <div className="d-flex justify-content-end mt-4">
                                <div>
                                    <button className="btn btn-outline-primary btn-md px-4 px-md-5 mr-4" onClick={closeConfirmHandler}>
                                        Ok
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>

    );
};
function mapStateToProps(state) {
    return {
        user: state.authInfo.user,
        tenantTheme: state.authInfo.tenantTheme
    };
}

export default connect(mapStateToProps)(Approval);
