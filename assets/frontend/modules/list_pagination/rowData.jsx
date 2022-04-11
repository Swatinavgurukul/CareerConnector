// Protected File. SPoC - Santosh Medarametla

import React, { useEffect } from "react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { renderToLocaleDate } from "../helpers.jsx";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { jobstage } from "../../../translations/helper_translation.jsx";

const RowData = (props) => {
    const { t } = useTranslation();

    // console.log("props...................", props)
    const { item, index, tableJSON, actionsJSON, actionsToPerform, theme } = props;
    const [openModal, setOpenModal] = useState(false);
    const [withdraw, setWithdraw] = useState(false);
    const [otherReason, setOtherReason] = useState("");
    const [reasons, setReasons] = useState("");

    const handlereasonChange = (event) => {
        // console.log("event", event.target.value);
        setReasons(event.target.value)
    }
    // useEffect(() => {
    // applicationWithdrawal()
    // }, []);
    const closeHandler = () => {
        setOpenModal(false)
        setOtherReason("")
        setReasons("")
    }
    const jobStageHandler = (language, key) =>{
        return(jobstage[language][key]);
    }

    const applicationWithdrawal = () => {
        if (!reasons) {
            toast.error(t(props.language?.layout?.toast33_nt));
            return false;
        }
        if (reasons == "Others" && !otherReason) {
            toast.error(t(props.language?.layout?.toast34_nt));
            return false;
        }
        let options = {};
        if (props.user.authenticated) {
            options = {
                headers: {
                    Authorization: `Bearer ${props.userToken}`,
                },
            };
        }
        const data = {
            current_status: "withdrawn",
            comments: reasons == "Others" ? otherReason : reasons
        }
        axios.put(`/api/v1/job/application/withdraw/${item.slug}`, data, options)
            .then((resp) => {
                if (resp.status == 200) {
                    setWithdraw(true);
                    props.getAppliedData()
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    toast.error(`${t(props.language?.layout?.toast35_nt)} ${error.response.data.data.current_status} ${t(props.language?.layout?.toast36_nt)}`);
                    setWithdraw(false);

                }
                else {
                    toast.error(error.response.data.detail || t(props.language?.layout?.toast53_nt));
                    setWithdraw(false);
                }
            });
    };
    const renderRow = (arrayItem) => {
        let dataToDisplay;
        if (arrayItem.actions) {
            return (
                <td className="icon-invert align-middle p-0 text-center">
                    {actionsJSON.edit && (
                        <img
                            src="/svgs/icons_new/edit-2.svg"
                            alt="edit"
                            class="svg-xs svg-gray "
                            title="Edit"
                            onClick={() => actionsToPerform("edit")}
                        />
                    )}
                    {actionsJSON.copy && (
                        <img src="/svgs/icons_new/copy.svg" alt="copy" class="svg-xs ml-2 svg-gray " title="Copy" />
                    )}
                    {actionsJSON.delete && (
                        <img
                            src="/svgs/icons_new/slash.svg"
                            alt="delete"
                            class="svg-xs ml-2 svg-gray"
                            title="Delete"
                            onClick={() => actionsToPerform("delete")}
                        />
                    )}
                </td>
            );
        }
        if (arrayItem.score) {
            return (
                <td className="align-middle">
                    <div class="single-chart ml-4">
                        <svg viewBox="0 0 36 36" class="circular-chart" style={{ width: "26%" }}>
                            <path
                                class="circle-bg"
                                d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                class="circle"
                                stroke-dasharray="80, 100"
                                d="M18 2.0845
                               a 15.9155 15.9155 0 0 1 0 31.831
                               a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="23.35" class="percentage text-success">
                                80
                            </text>
                        </svg>
                    </div>
                </td>
            );
        }
        if (arrayItem.jobs_Status) {
            return (
                <td className="align-middle">
                    <select className="border-0 btn-sm py-0" style={theme.active_color}>
                        <option selected="" className="bg-white text-dark">
                            Active
                        </option>
                        <option value="Closed" className="bg-white text-dark">
                            Closed
                        </option>
                        <option value="Draft" className="bg-white text-dark">
                            Draft
                        </option>
                        <option value="Paused" className="bg-white text-dark">
                            Paused
                        </option>
                    </select>
                </td>
            );
        }
        if (arrayItem.candidate_Status) {
            return (
                <td className="align-middle">
                    <select className="border-0 btn-sm py-0" style={theme.active_color}>
                        <option selected="" className="bg-white text-dark">
                            Applied
                        </option>
                        <option value="Screening" className="bg-white text-dark">
                            Screening
                        </option>
                        <option value="Interview" className="bg-white text-dark">
                            Interview
                        </option>
                        <option value="Offered" className="bg-white text-dark">
                            Offered
                        </option>
                        <option value="Hired" className="bg-white text-dark">
                            Hired
                        </option>
                        <option value="Declined" className="bg-white text-dark">
                            Declined
                        </option>
                        <option value="Onhold" className="bg-white text-dark">
                            On hold
                        </option>
                    </select>
                </td>
            );
        } else {
            if (arrayItem.format) {
                dataToDisplay = renderToLocaleDate(new Date(item[arrayItem.key]));
            } else {
                if (arrayItem.recruiterSlugLink) {
                    dataToDisplay = (
                        <div>
                            {" "}
                            <Link to={`/jobs/${item.slug}/applications`}>{item[arrayItem.key]}</Link>{" "}
                            <button
                                type="button"
                                class="icon-invert close d-flex justify-content-end"
                                aria-label="Open"
                                title= {t(props.language?.layout?.open_nt)}
                                onClick={(e) => props.showJobCard(e.target)}>
                                <img src="/svgs/icons_new/chevron-down.svg" alt="chevron" className="svg-sm mt-1" />
                            </button>
                            <div
                                className="position-absolute elevation-2 card invisible"
                                style={{ width: "78rem", left: "0rem", zIndex: "1" }}>
                                <button
                                    type="button"
                                    class="close d-flex justify-content-end mb-n2"
                                    aria-label="Close"
                                    title="Close">
                                    <img
                                        src="/svgs/icons/angle-up.svg"
                                        alt="chevron"
                                        className="svg-sm mr-2 mt-1"
                                        onClick={(e) => props.hideJobCard(e.target)}
                                    />
                                </button>
                                <div className="card-body small d-flex pt-0 pb-2">
                                    <div className="d-flex col-md-4">
                                        <img
                                            src="/images/dummy.jpg"
                                            alt="search"
                                            className="svg-lg-x1 mr-4 rounded-circle"
                                        />
                                        <div>
                                            <div>
                                                <div className="d-flex mb-1">
                                                    <h5>Product manager</h5>
                                                    <div className="ml-3">
                                                        <select className="btn-sm py-0" style={theme.active_color}>
                                                            <option selected="" className="bg-white text-dark">
                                                                Active
                                                            </option>
                                                            <option value="Closed" className="bg-white text-dark">
                                                                Closed
                                                            </option>
                                                            <option value="Draft" className="bg-white text-dark">
                                                                Draft
                                                            </option>
                                                            <option value="Paused" className="bg-white text-dark">
                                                                Paused
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="mb-1">
                                                Experience level &nbsp;:&nbsp;{" "}
                                                <span className="text-muted">2 -3 Years</span>
                                            </p>
                                            <p>
                                                Salary range&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :&nbsp;{" "}
                                                <span className="text-muted">$2000 -$3000</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column col-md-2">
                                        <strong>Industry</strong>
                                        <span className="text-muted">Software - Infrastructure</span>
                                        <strong>Department</strong>
                                        <span className="text-muted">Product Management</span>
                                    </div>
                                    <div className="d-flex flex-column col-md-2">
                                        <strong>Hiring manager</strong>
                                        <span className="text-muted">M.S.Subhalaxmi</span>
                                    </div>
                                    <div className="d-flex flex-column col-md-2">
                                        <strong>Date opened</strong>
                                        <span className="text-muted">08-20-2021</span>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="icon-invert pb-3">
                                            <img
                                                src="/svgs/icons_new/external-link.svg"
                                                alt="search"
                                                className="svg-xs mr-2"
                                            />
                                            <span>View applicants</span>
                                        </div>
                                        <div className="icon-invert pb-3">
                                            <img src="/svgs/icons_new/globe.svg" alt="search" className="svg-xs mr-2" />
                                            <span>Go to career site</span>
                                        </div>
                                        <div>
                                            <img
                                                src="/svgs/icons_new/trending-up.svg"
                                                alt="search"
                                                className="svg-xs mr-2"
                                            />
                                            <span>View applied boards</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                } else if (arrayItem.candidatesLink) {
                    dataToDisplay = (
                        <Link
                            to={{
                                pathname: "/jobSeekers/" + item.user_id,
                            }}>
                            {item[arrayItem.key]}
                        </Link>
                    );
                } else if (arrayItem.applicantLink) {
                    dataToDisplay = (
                        <Link
                            params={{ job_id: item.job_id, user: item.user_id }}
                            to={{
                                pathname: "/applications/" + item.job_id,
                                state: item.user_id,
                            }}>
                            {item[arrayItem.key]}
                        </Link>
                    );
                }
                else if (arrayItem.statusTranslate) {
                    dataToDisplay =
                    jobStageHandler(props?.languageName, item[arrayItem.key])
                } else if (arrayItem.jobDetails) {
                    return (
                        <td>
                            {item.current_status == "withdrawn" || item.current_status == "hired" ?
                                <p tabIndex="-1" className="text-muted mb-0 pointer" disabled>Withdraw Application</p>
                                :
                                <a tabIndex="-1" className="text-primary pointer" onClick={() => setOpenModal(true)}>Withdraw Application</a>
                            }
                            <Modal show={openModal} onHide={closeHandler} size={"lg"} centered>
                                <div className="modal-content">
                                    <div className="modal-header border-0 px-4">
                                        <button
                                            type="button"
                                            className="close animate-closeicon"
                                            aria-label="Close"
                                            title="Close"
                                            onClick={closeHandler}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body px-5 py-0">
                                        {withdraw ? <h4 className="my-4 text-center">Application Withdrawn Successfully</h4> :
                                            <>
                                                <h5 className="font-weight-bold">{props.user.name}, are you sure you want to withdraw your application</h5>
                                                <p className="my-4">Please tell us why you want to withdraw your application</p>
                                                <fieldset className="reasons" value={reasons} onChange={(event) => handlereasonChange(event)}>
                                                    <div className="form-check custom-radio">
                                                        <input class="form-check-input" type="radio" aria-label="corporatate" id="corporateCheck" name="reasons-option"
                                                            value="I am not looking for change now" />
                                                        <label class="form-check-label user-select-none" for="corporateCheck">I am not looking for change now</label></div>
                                                    <div className="form-check custom-radio">
                                                        <input class="form-check-input" type="radio" aria-label="corporatate" id="corporateCheckoffer" name="reasons-option"
                                                            value="I got an offer" />
                                                        <label class="form-check-label user-select-none" for="corporateCheckoffer">I got an offer</label></div>
                                                    <div className="form-check custom-radio">
                                                        <input class="form-check-input" type="radio" aria-label="corporatate" id="corporateCheckorg" name="reasons-option"
                                                            value="I joined another organization" />
                                                        <label class="form-check-label user-select-none" for="corporateCheckorg">I joined another organization</label></div>
                                                    <div className="form-check custom-radio">
                                                        <input class="form-check-input" type="radio" aria-label="corporatate" id="corporateCheckresume" name="reasons-option"
                                                            value="I want to re-apply with another resume" />
                                                        <label class="form-check-label user-select-none" for="corporateCheckresume">I want to re-apply with another resume</label></div>
                                                    <div className="form-check custom-radio">
                                                        <input class="form-check-input" type="radio" aria-label="corporatate" id="corporateCheckrole" name="reasons-option"
                                                            value="I am not intrested in this role" />
                                                        <label class="form-check-label user-select-none" for="corporateCheckrole">I am not intrested in this role</label></div>
                                                    <div className="form-check custom-radio">
                                                        <input class="form-check-input" type="radio" aria-label="corporatate" id="corporateCheckother" name="reasons-option"
                                                            value="Others" />
                                                        <label class="form-check-label user-select-none" for="corporateCheckother">Others</label></div>
                                                </fieldset>

                                                {reasons === "Others" && <input type="text" className="form-control" value={otherReason} onChange={(e) => setOtherReason(e.target.value)}></input>}
                                            </>}
                                        <div className="modal-footer border-0 my-3">
                                            {!withdraw && <button className="btn btn-outline-primary" onClick={closeHandler}>Cancel</button>}
                                            {withdraw ? <button className="btn btn-outline-primary" onClick={closeHandler}>Close</button> : <button className="btn btn-danger ml-4" onClick={() => applicationWithdrawal()}>Withdraw</button>}
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        </td>
                    )
                }
                else if (arrayItem.Details) {
                    return (
                        dataToDisplay = (
                            <td>
                                <Link to={{ pathname: `/jobs/${item.slug}`, data: item.slug }}>
                                    {t(props.language?.layout?.js_application_viewdetail)}
                                </Link>
                            </td>
                        )
                    )
                }
                else if (arrayItem.Title) {
                    return (
                        dataToDisplay = (
                            <td>
                                <Link to={{ pathname: `/jobs/${item.slug}`, data: item.slug }}>
                                    {/* {item.title} */}
                                    {props.languageName == "en" ? item.title : ""}
                                    {props.languageName == "esp"
                                        ? item.title_esp === null || item.title_esp === ""
                                            ? item.title
                                            : item.title_esp
                                        : ""}
                                    {   props.languageName == "fr"
                                        ? item.title_fr === null || item.title_fr === ""
                                            ? item.title
                                            : item.title_fr
                                        : ""}
                                    {/* {console.log("ptorp",props.languageName)} */}
                                </Link>
                            </td>
                        )
                    )
                }
                else {
                    dataToDisplay = item[arrayItem.key];
                }
            }

            return (
                <td scope="col" className="pl-3 align-middle text-muted text-capitalize">
                    {dataToDisplay}
                </td>
            );
        }
    };
    // console.log("withdron...................", withdraw);
    return (
        <tr>
            {tableJSON.map((arrayItem) => {
                return renderRow(arrayItem);
            })}
        </tr>
    );
};

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        user: state.authInfo.user,
        userToken: state.authInfo.userToken,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(RowData);
