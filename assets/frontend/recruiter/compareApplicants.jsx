import React, { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import { connect } from "react-redux";
import { applicationStatus } from "../components/constants.jsx";
import { toast } from "react-toastify";
import { renderCurrencyRange } from "../modules/helpers.jsx";
import { calculateScore } from "../components/constants.jsx";
import { truncate } from "../modules/helpers.jsx";
import { _compareApplicants } from "../actions/actionsAuth.jsx";
import { Fragment } from 'react';
import Modal from "react-bootstrap/Modal";
import { renderToLocaleDate } from "../modules/helpers.jsx";

const compareApplicants = (props) => {

    const [applicantData, setApplicantData] = useState([]);
    const [expandScores, setExpandScores] = useState(false);
    const [addApplicant, setAddApplicant] = useState(false);
    const [compare, setCompare] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        compareApplications();
    }, [props.compareApplicants]);

    const compareApplications = () => {
        if (!props.compareApplicants.length) {
            setApplicantData([]);
            return;
        }
        Axios.get(`api/v1/hiring/compare/${props.location.state.jobSlug}?user_id=${props.compareApplicants.map((list) => list)}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((resp) => {
                let updatedData = [];
                resp.data.data.forEach((item) => {
                    let totalScore = calculateScore(item.sov_score);
                    item.totalScore = totalScore;
                    updatedData.push(item);
                });
                setApplicantData(updatedData);
            })
            .catch((error) => {
                // console.log(error.response.data.message);
            });
    };

    const updateApplicationStatus = (value, id) => {
        if (!value) return;
        let obj = {
            current_status: value,
        };
        Axios.put(`api/v1/recruiter/application/${id}`, obj, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }).then((response) => {
            compareApplications();
            toast.success(`Applicant status moved to ${obj.current_status}.`, {});
        });
    };

    const removeApplicant = (id) => {
        var ids = props.compareApplicants.filter((compare) => {
            return compare != id;
        });
        props._compareApplicants(ids);
    }

    const handlerCompare = (event, id) => {
        let check = event;
        if (check) {
            compare.push(id);
            // setCompare([...new Set([...compare, ...props.compareApplicants])]);
        } else {
            var ids = compare.filter((data) => {
                return data != id;
            });
            setCompare([...ids]);
            // props._compareApplicants(ids);
        }
        // setCompare([]);
        if (compare.length <= 5) {
            setError(false);
            return;
        }
    };

    const addApplication = () => {
        if (!compare.length) {
            toast.error("Select applicants to compare.")
            return;
        }
        if (compare.length > 4) {
            setError(true);
            return;
        } else {
            props._compareApplicants([...new Set([...compare, ...props.compareApplicants])]);
            props._compareApplicants(compare);
            setCompare([]);

            setAddApplicant(false);
            setError(false);
        }
    }

    return (
        <div className="col-md-10 px-0">
            <div className="container-fluid">
                <div className="row pt-4 px-3 gray-100">
                    <div className="col-md-8 px-md-0">
                        <div className="d-flex align-items-center mb-3 icon-invert">
                            <h4 className="mb-0">
                                <Link to={`/jobs/`} className="text-muted">
                                    Jobs
                                    </Link>
                                <img
                                    className="svg-sm mx-1 disabled"
                                    src="svgs/icons_new/chevron-right.svg"
                                    title="Arrow"
                                    alt="Arrow Icon"
                                />
                                <span className="text-muted">
                                    <Link to={`/jobs/${props.location.state.jobSlug}/applications`} className="text-muted">
                                        {props.location.state.jobTitle}
                                    </Link>
                                </span>
                                <img
                                    className="svg-sm mx-1"
                                    src="svgs/icons_new/chevron-right.svg"
                                    title="Arrow"
                                    alt="Arrow Icon"
                                />{" "}
                                    Compare Applicants
                                </h4>
                        </div>
                        <div className="d-flex align-items-center">
                            <img
                                className="svg-lg-x2 mr-3 mb-2"
                                src="svgs/icons_new/settings.svg"
                                alt="Application Icon"
                                title="Application Icon"
                            />
                            <div>
                                <p className="mb-1">
                                    Compare Applicants
                                    </p>
                                <p>
                                    Select and compare applications submitted for a job
                                    </p>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-md-4 px-md-0">
                        <div className="d-flex align-items-end justify-content-end">
                            <div class="form-group-md animated mr-md-3 mb-3 mb-md-0">
                                <input
                                    type="text"
                                    class="form-control border-right-0 border-left-0 border-top-0 bg-light rounded-0 border-dark pl-4 pb-1"
                                    id="Search"
                                    name="Search"
                                    placeholder="Search roles"
                                />
                                <div class="d-flex justify-content-start">
                                    <img
                                        src="/svgs/icons_new/search.svg"
                                        alt="search"
                                        class="svg-xs mt-n4 mr-3"
                                    />
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary px-4">
                                + Add Role
                            </button>
                        </div>
                    </div> */}
                </div>
                <div className="row">
                    <div className="col-md-12 px-3">
                        <h4 className="mt-4">Applicants</h4>
                        <div className="row px-2">
                            <div className="table-responsive col px-md-0">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="font-weight-bold align-middle border-bottom-0 bg-light h-10rem">Category</td>
                                        </tr>
                                        <tr>
                                            <td className="font-weight-bold align-middle h-5rem border-top-0 border-bottom-0">Application Status</td>
                                        </tr>
                                        <tr>
                                            <td className="px-0 border-top-0 border-bottom-0">
                                                <table className="table table-borderless">
                                                    <tbody>
                                                        <tr>
                                                            <td className="font-weight-bold align-middle h-5rem">Total score/ Job match score</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-0 h-4rem" onClick={() => setExpandScores(!expandScores)}>
                                                                <div className="d-flex justify-content-between btn-light py-2 px-3">
                                                                    <div>Score breakdown:</div>
                                                                    <div><img src={"/svgs/icons_new/" + (expandScores ? "chevron-up" : "chevron-down") + ".svg"}
                                                                        alt="chevron" className="svg-xs ml-auto" /></div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {!expandScores ? "" :
                                                            <Fragment>
                                                                <tr>
                                                                    <td className="pl-5">Skills</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="pl-5">Certification</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="pl-5">Industry</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="pl-5">Education</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="pl-5">Management Level</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="pl-5">Job Title</td>
                                                                </tr>
                                                            </Fragment>
                                                        }
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-weight-bold align-middle h-5rem border-top-0 border-bottom-0">Experience (In years)</td>
                                        </tr>
                                        <tr>
                                            <td className="font-weight-bold align-middle h-5rem border-top-0 border-bottom-0">Expected salary range (Per annum)</td>
                                        </tr>
                                        <tr>
                                            <td className="font-weight-bold align-middle h-5rem border-top-0 border-bottom-0">Education qualification (Degree)</td>
                                        </tr>
                                        <tr>
                                            <td className="font-weight-bold align-middle h-14rem border-top-0 border-bottom-0">Skills</td>
                                        </tr>
                                        <tr>
                                            <td className="font-weight-bold align-middle h-14rem border-top-0">Certifications</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {applicantData && applicantData.length !== 0 ? (
                                <div className={`d-flex px-md-0 ${props.compareApplicants.length >= 4 ? "col-md-9" : "col-md-8"}`}>
                                    { applicantData.map((data) => (
                                        <table class="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <td className="align-middle h-9rem border-bottom-0 bg-light h-10rem">
                                                        <button
                                                            type="button"
                                                            className="close"
                                                            aria-label="Close"
                                                            title="Close"
                                                            onClick={() => removeApplicant(data.user_id)}>
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="rounded-circle mr-2 text-center d-flex align-items-center justify-content-center text-uppercase mt-1"
                                                                style={{
                                                                    width: "2.5rem",
                                                                    height: "2.5rem",
                                                                    backgroundColor: "#80808029",
                                                                    fontSize: "0.75rem"
                                                                }}>
                                                                {data.user_image == "" || data.user_image == null ? (
                                                                    (data.first_name == null || data.first_name == "") &&
                                                                        (data.last_name == null || data.last_name == "") ? (
                                                                        data.username.charAt(0)
                                                                    ) : (
                                                                        <span>
                                                                            {data.first_name != null &&
                                                                                data.first_name != "" &&
                                                                                data.first_name.charAt(0)}
                                                                            {data.last_name != null &&
                                                                                data.last_name != "" &&
                                                                                data.last_name.charAt(0)}
                                                                        </span>
                                                                    )
                                                                ) : (
                                                                    <img
                                                                        src={data.user_image}
                                                                        className="svg-lg"
                                                                        alt="candidate profile image"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h6 className="font-weight-bold pt-2 text-capitalize">{(data.first_name == null || data.first_name == "") &&
                                                                    (data.last_name == null || data.last_name == "") ? (
                                                                    data.username
                                                                ) : (
                                                                    <span>
                                                                        {truncate(data.first_name == null ? "" : data.first_name + " " + (data.last_name === null ? "" : data.last_name), 24)}
                                                                    </span>
                                                                )}
                                                                </h6>
                                                                <div class="text-capitalize">
                                                                    {truncate(data.designation, 22)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="d-flex align-items-center ml-3">
                                                            <p class="mb-0">
                                                                <img src="/svgs/icons_new/map-pin.svg" class="svg-sm mr-2 mb-0" alt="Email" />
                                                            </p>
                                                            <div class="h6 pl-2 pt-2">
                                                                {!data.user_location ? "Location not available" :
                                                                    truncate(data.user_location, 22)
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <button className="btn btn-sm btn-primary mr-3" disabled={data.current_status === "hired"} onClick={() => updateApplicationStatus(data.current_status == "applied" ? "screening" : data.current_status == "screening" ? "interview" : data.current_status == "interview" ? "offered" : data.current_status == "offered" ? "hired" : data.current_status == "declined" ? null : data.current_status == "on-hold" ? "screening" : data.current_status == "rejected" ? "screening" : null, data.id)}>Move Forward</button>
                                                            <button className="btn btn-sm btn-outline-primary" onClick={() => updateApplicationStatus("rejected", data.id)}>&nbsp;&nbsp;Reject&nbsp;&nbsp;</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle h-5rem border-top-0 border-bottom-0">
                                                        <span className="px-2 rounded text-capitalize"
                                                            style={
                                                                data.current_status == "applied"
                                                                    ? props.theme.all_color
                                                                    : data.current_status == "screening"
                                                                        ? props.theme.screening_color
                                                                        : data.current_status == "interview"
                                                                            ? props.theme.interview_color
                                                                            : data.current_status == "offered"
                                                                                ? props.theme.offer_color
                                                                                : data.current_status == "hired"
                                                                                    ? props.theme.active_color
                                                                                    : data.current_status == "declined"
                                                                                        ? props.theme.closed_color
                                                                                        : data.current_status == "on-hold"
                                                                                            ? props.theme.paused_color
                                                                                            : data.current_status == "rejected"
                                                                                                ? props.theme.all_color
                                                                                                : data.current_status == "withdrawn"
                                                                                                ? props.theme.closed_color
                                                                                                : props.theme.all_color
                                                            }
                                                            aria-label="status">
                                                            {data.current_status}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-0 border-top-0 border-bottom-0">
                                                        <table className="table table-borderless">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="align-middle h-5rem">
                                                                        <div className="d-flex align-items-center">
                                                                            <div
                                                                                class="progress"
                                                                                style={{ height: "6px", width: "100%", marginRight: "1rem" }}>
                                                                                <div
                                                                                    class="progress-bar bg-success"
                                                                                    role="progressbar"
                                                                                    aria-valuenow="87"
                                                                                    aria-label="skills"
                                                                                    aria-valuemin="0"
                                                                                    aria-valuemax="100"
                                                                                    style={{
                                                                                        width: ` ${data.totalScore && data.totalScore !== null
                                                                                            ? data.totalScore
                                                                                            : 0
                                                                                            }% `,
                                                                                    }}></div>
                                                                            </div>
                                                                            <div class="mt-1 h4 ml-auto">
                                                                                {data.totalScore && data.totalScore !== null
                                                                                    ? data.totalScore
                                                                                    : 0}
                                                                            </div></div>
                                                                        <div className={`text-right small ${(data.score_match ? data.score_match : 0) < 0 ? "text-danger" : (data.score_match ? data.score_match : 0) == 0 ? "text-warning" : "text-success"}`}>[&nbsp;{(data.score_match ? data.score_match : 0) == 0 ? "" : Math.abs(data.score_match)} {(data.score_match ? data.score_match : 0) < 0 ? "points less than avg" : (data.score_match ? data.score_match : 0) == 0 ? "matches avg" : "points more than avg"}&nbsp;]</div>
                                                                    </td>
                                                                </tr>
                                                                <tr><td className="px-0 h-4rem"></td></tr>
                                                                {!expandScores ? "" :
                                                                    <Fragment>
                                                                        <tr>
                                                                            <td className={`text-right ${data.sov_score == null ? "" : (Math.max.apply(null, Object.values(data.sov_score)) == 0 ? "font-weight-normal" : Math.max.apply(null, Object.values(data.sov_score)) == data.sov_score.skills && "font-weight-bold")}`}>{data.sov_score && data.sov_score.skills !== null
                                                                                ? data.sov_score.skills
                                                                                : 0}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={`text-right ${data.sov_score == null ? "" : (Math.max.apply(null, Object.values(data.sov_score)) == 0 ? "font-weight-normal" : Math.max.apply(null, Object.values(data.sov_score)) == data.sov_score.certification && "font-weight-bold")}`}>{data.sov_score && data.sov_score.certification !== null
                                                                                ? data.sov_score.certification
                                                                                : 0}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={`text-right ${data.sov_score == null ? "" : (Math.max.apply(null, Object.values(data.sov_score)) == 0 ? "font-weight-normal" : Math.max.apply(null, Object.values(data.sov_score)) == data.sov_score.industry && "font-weight-bold")}`}>{data.sov_score && data.sov_score.industry !== null
                                                                                ? data.sov_score.industry
                                                                                : 0}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={`text-right ${data.sov_score == null ? "" : (Math.max.apply(null, Object.values(data.sov_score)) == 0 ? "font-weight-normal" : Math.max.apply(null, Object.values(data.sov_score)) == data.sov_score.education && "font-weight-bold")}`}>{data.sov_score && data.sov_score.education !== null
                                                                                ? data.sov_score.education
                                                                                : 0}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={`text-right ${data.sov_score == null ? "" : (Math.max.apply(null, Object.values(data.sov_score)) == 0 ? "font-weight-normal" : Math.max.apply(null, Object.values(data.sov_score)) == data.sov_score.management_level && "font-weight-bold")}`}>{data.sov_score && data.sov_score.management_level !== null
                                                                                ? data.sov_score.management_level
                                                                                : 0}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={`text-right ${data.sov_score == null ? "" : (Math.max.apply(null, Object.values(data.sov_score)) == 0 ? "font-weight-normal" : Math.max.apply(null, Object.values(data.sov_score)) == data.sov_score.job_title && "font-weight-bold")}`}>{data.sov_score && data.sov_score.job_title !== null
                                                                                ? data.sov_score.job_title
                                                                                : 0}</td>
                                                                        </tr>
                                                                    </Fragment>
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle h-5rem border-top-0 border-bottom-0">
                                                        {data.experience ? data.experience + `${data.experience > 1 ? "Yrs" : "Yr"}` : 0}
                                                        <span className={`text-right ml-2 small ${(data.experience_match ? data.experience_match : 0) < 0 ? "text-danger" : (data.experience_match ? data.experience_match : 0) == 0 ? "text-warning" : "text-success"}`}>
                                                            [&nbsp;{(data.experience_match ? data.experience_match : 0) == 0 ? "" : Math.abs(data.experience_match)} {(data.experience_match ? data.experience_match : 0) < 0 ? `${data.experience_match >= 1 ? "Yrs" : "Yr"} less than avg` : (data.experience_match ? data.experience_match : 0) == 0 ? "matches avg" : `${data.experience_match >= 1 ? "Yrs" : "Yr"} more than avg`}&nbsp;]</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle h-5rem border-top-0 border-bottom-0">
                                                        {data.expected_min_salary != null && data.expected_max_salary != null && (data.expected_min_salary != 0 && data.expected_max_salary != 0) ? renderCurrencyRange(data.expected_min_salary, data.expected_max_salary, "$") : "---"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle h-5rem border-top-0 border-bottom-0">{data.education_qualification ? data.education_qualification : "---"}</td>
                                                </tr>
                                                <tr>
                                                    {/* <td className="align-middle h-10rem border-0">{data.skills ? data.skills.map(skill => <span className="bg-light mr-2 px-1 text-capitalize" style={{ wordBreak: 'break-all' }}>{skill.skills}</span>) : ""}</td> */}
                                                    <td className="align-middle border-0 h-14rem"><div className="thin-scrollbar skills-height row align-items-center px-2" style={{ wordBreak: 'break-all' }}>{data.skills ? data.skills.map(skill => <Fragment>{skill.skills} &nbsp;&nbsp;</Fragment> ):""}</div></td>
                                                </tr>
                                                <tr>
                                                    <td className="align-middle border-top-0 h-14rem"><div className="thin-scrollbar skills-height row align-items-center px-2" style={{ wordBreak: 'break-all' }}>{data.certifications ? data.certifications.map(certificate => <Fragment>{certificate.certification_name} &nbsp;&nbsp;</Fragment> ) :""}</div></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted text-center col-md-7 p-5">
                                    <img
                                        src="/svgs/illustrations/seo.svg"
                                        alt="Hero Image"
                                        className="svg-gray"
                                        style={{ height: "12rem" }}
                                    />
                                    <h3 className="pt-2">Data Not Found...</h3>
                                </div>
                            )}
                            {props.compareApplicants.length >= 4 ? "" :
                                <div class="w-10 px-md-0 bg-light">
                                    <table class="table table-bordered text-center" style={{ height: "calc(100% - 1rem)" }}>
                                        <tbody>
                                            <tr>
                                                <td className="pt-5">
                                                    <div>
                                                        <img
                                                            src="/svgs/icons_new/plus-circle.svg"
                                                            alt="search"
                                                            class="svg-sm pointer"
                                                            onClick={() => {
                                                                setAddApplicant(true);
                                                                setCompare([...new Set([...compare, ...props.compareApplicants])]);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="mt-2"><span className="text-dark pointer" onClick={() => {
                                                        setAddApplicant(true);
                                                        setCompare([...new Set([...compare, ...props.compareApplicants])]);
                                                    }}>Add applicant</span></div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            }
                            <Modal size="xl" show={addApplicant} onHide={() => setAddApplicant(false)} centered>
                                {props.location.state.recruiterData && props.location.state.recruiterData.length !== 0 ? (
                                    <div className="modal-content border-0">
                                        <div style={{ minHeight: "25rem" }}>
                                            <table className="table border-bottom candidateTable mb-0">
                                                <thead className="text-white" style={props.theme.tableHeader_background}>
                                                    <tr>
                                                        <th></th>
                                                        <th>Name</th>
                                                        <th>Job Score</th>
                                                        <th>Status</th>
                                                        <th>Title</th>
                                                        <th>Experience</th>
                                                        <th>Location</th>
                                                        <th>Source</th>
                                                        <th>Applied On</th>
                                                    </tr>
                                                </thead>
                                                {props.location.state.recruiterData.map((user) => (
                                                    <tbody>
                                                        <td className="pl-3 align-middle"><input
                                                            onChange={(e) => handlerCompare(e.target.checked, user.user_id)}
                                                            className="check1"
                                                            type="checkbox"
                                                            id="check1"
                                                            defaultChecked={applicantData.find((id) => id.user_id == user.user_id)}
                                                        /></td>
                                                        <td className="align-middle text-capitalize">{user.username}</td>
                                                        <td className="align-middle"> <div
                                                            class="single-chart ml-4"
                                                            title="The overall job score represents a fit between the candidate profile and job requirement.">
                                                            <svg viewBox="0 0 36 36" class="circular-chart circular-progressbar">
                                                                <path
                                                                    class="circle-bg"
                                                                    d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                                                                />
                                                                <path
                                                                    class="circle"
                                                                    stroke-dasharray={`${user.totalScore && user.totalScore != null ? user.totalScore : 0},100`}
                                                                    d="M18 2.0845
                               a 15.9155 15.9155 0 0 1 0 31.831
                               a 15.9155 15.9155 0 0 1 0 -31.831"
                                                                />
                                                                <text x="18" y="23.35" class="percentage text-green">
                                                                    {user.totalScore != null ? user.totalScore : 0}
                                                                </text>
                                                            </svg>
                                                        </div></td>
                                                        <td className="align-middle text-capitalize"><span
                                                            className="px-2 rounded"
                                                            style={
                                                                user.current_status == "applied"
                                                                    ? props.theme.all_color
                                                                    : user.current_status == "screening"
                                                                        ? props.theme.screening_color
                                                                        : user.current_status == "interview"
                                                                            ? props.theme.interview_color
                                                                            : user.current_status == "offered"
                                                                                ? props.theme.offer_color
                                                                                : user.current_status == "hired"
                                                                                    ? props.theme.active_color
                                                                                    : user.current_status == "declined"
                                                                                        ? props.theme.closed_color
                                                                                        : user.current_status == "on-hold"
                                                                                            ? props.theme.paused_color
                                                                                            : user.current_status == "rejected"
                                                                                                ? props.theme.all_color
                                                                                                : user.current_status == "withdrawn"
                                                                                                ? props.theme.closed_color
                                                                                                : props.theme.all_color
                                                            }
                                                            aria-label="status">
                                                            {user.current_status}
                                                        </span></td>
                                                        <td className="align-middle text-capitalize">{user.job_title}</td>
                                                        <td className="align-middle">{user.experience} {!user.experience ? "" : user.experience > 1 ? "Yrs" : "Yr"}</td>
                                                        <td className="align-middle text-capitalize">{user.user_location}</td>
                                                        <td className="align-middle text-capitalize">{user.source}</td>
                                                        <td className="align-middle">{renderToLocaleDate(user.created_at)}</td>
                                                    </tbody>
                                                ))}
                                            </table>
                                            {error ? <p className="text-danger p-3">Maximum candidates selected!</p> : null}
                                        </div>
                                        <div className="p-3">
                                            <button className="btn btn-primary" onClick={addApplication}>Add applicant</button>
                                        </div>
                                    </div>) : (
                                    <div className="col-md-3 mx-auto">
                                        <div className="text-muted text-center my-5">
                                            <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid" />
                                            <h3 className="pt-2">The List is Empty</h3>
                                        </div>
                                    </div>
                                )}
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        user: state.authInfo.user,
        userRole: state.authInfo.user,
        compareApplicants: state.authInfo.compareApplicants,
    };
}

export default connect(mapStateToProps, { _compareApplicants })(compareApplicants);




