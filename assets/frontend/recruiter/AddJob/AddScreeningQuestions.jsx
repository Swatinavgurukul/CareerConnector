import React, { useState, useEffect, Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import Locations from "../../common/createJobLocation.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Multiselect } from "multiselect-react-dropdown";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

const locationsJSON = {
    country: true,
    state: true,
    city: true,
};

const ScreeningQuestions = (props) => {
    const editMailsData = props.screeningQuestions.editMailsData;
    let editMailsDataCopy = [...editMailsData]

    if (props.currentStep !== 2) {
        return null;
    }
    const [show, setShow] = useState({
        isShowCard: false,
        isShowRadio: false,
    });
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [membersOptions, setMembersOptions] = useState([]);
    const [membersId, setMembersId] = useState([]);
    const [manageModal, setManageModal] = useState(false);
    const [englishLang, setEnglishLang] = useState(true);
    const [card1, setCard1] = useState(true);
    const [card2, setCard2] = useState(false);
    const [card3, setCard3] = useState(false);
    //restrict - and + in input box
    const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
    //
    const getTodaysDate = () => {
        let todaysDate = new Date();
        let year = todaysDate.getFullYear();
        let month = ("0" + (todaysDate.getMonth() + 1)).slice(-2);
        let day = ("0" + todaysDate.getDate()).slice(-2);
        let minDate = year + "-" + month + "-" + day;
        return minDate;
    };
    useEffect(() => {
        if (props.languageName == "en") {
            props.editlanguagehandler("englishT", true);
        }
        if (props.languageName == "esp") {
            props.editlanguagehandler("englishT", true);
        }
        if (props.languageName == "fr") {
            props.editlanguagehandler("frenchT", true);
        }
    }, [props.languageName]);
    const maxLengthCheck = (e) => {
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength);
        }
    };
    const setLocationCity = (city) => {
        if (city[0] == "Quebec City") {
            props.frenchForQubecState(true);
        }
        props.updateScreeningQuestions("locationCity", city[0]);
        if (city && city.length >= 2) {
            props.updateScreeningQuestions("locationState", city[1]);
        }
    };

    const setLocationState = (state) => {
        if (state == "QC") {
            props.frenchForQubecState(true);
        } else {
            props.frenchForQubecState(false);
        }
        props.updateScreeningQuestions("locationState", state);
    };
    const setLocationCountry = (country) => {
        props.updateScreeningQuestions("locationCountry", country);
    };
    const { t } = useTranslation();

    const setLocation = (location) => {
        let totalAddress = [];
        let adr = location && location["address"];
        for (let i = 0; i < adr.length; i++) {
            if (
                adr[i].types[0] === "locality" ||
                adr[i].types[0] === "administrative_area_level_1" ||
                adr[i].types[0] === "country"
            ) {
                totalAddress.push(adr[i].long_name);
            }
        }
        props.updateScreeningQuestions("latitude", location && location["latlng"].lat);
        props.updateScreeningQuestions("longitude", location && location["latlng"].lng);
        props.updateScreeningQuestions("placeId", location && location["placeId"]);
    };
    const remoteLocationCheckedHandler = () => {
        props.updateScreeningQuestions("remoteLocation", !props.screeningQuestions.locationChecked);
        props.updateScreeningQuestions("locationChecked", !props.screeningQuestions.locationChecked);
        props.updateScreeningQuestions("locationCity", "");
        props.updateScreeningQuestions("locationCityDetails", "");
        props.updateScreeningQuestions("locationState", "");
        props.updateScreeningQuestions("locationCountry", "");
        props.updateScreeningQuestions("latitude", "");
        props.updateScreeningQuestions("longitude", "");
        props.updateScreeningQuestions("placeId", "");
    };

    const toggle = () => {
        setShow({ isShowCard: !show.isShowCard });
    };
    const style = {
        width: 200,
        padding: 17,
        zIndex: 8,
    };

    const style1 = {
        width: 70,
    };
    const handleSelectAll = (e) => {
        setIsCheckAll(!isCheckAll);
        props.updateScreeningQuestions("jobBoardsLinkedIn", e.target.checked);
        props.updateScreeningQuestions("jobBoardsBroadbean", e.target.checked);
        props.updateScreeningQuestions("jobBoardZipRecruiter", e.target.checked);
    };
    const NotificationDropdown = useRef(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClick, false);
        return () => document.removeEventListener("mousedown", handleClick, false);
    }, []);
    const handleClick = (e) => {
        if (NotificationDropdown.current.contains(e.target)) {
            return;
        }
        setShow({ isShowCard: false });
    };
    useEffect(() => {
        // let editMailIds = [];
        // editMailsDataCopy.map((mailId) => editMailIds.push(mailId.id));
        // setMembersId(editMailIds);
        getMembersOptionsData();
    }, []);
    const getMembersOptionsData = () => {
        axios
            .get("api/v1/adminusers/list?role_ids=[1,5]", { headers: { Authorization: `Bearer ${props.userToken}` } })
            .then((response) => {
                setMembersOptions(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // const onSelect = (selectedList, selectedItem) => {
    //     let prefIds =[...membersId, selectedItem.id];
    //     setMembersId(prefIds);
    //     props.updateScreeningQuestions("setMailId", prefIds);
    // };

    // const onRemove = (selectedList, selectedItem) => {
    //     let filteredArray = membersId.filter((item) => item !== selectedItem.id);
    //     setMembersId(filteredArray);
    //     props.updateScreeningQuestions("setMailId", filteredArray);

    // };
    return (
        <div className="col-md-12 px-0">
            <div className="container-fluid">
                <div className="row ml-xl-5 ml-lg-2 ml-md-2 form-focus">
                    <div className="col-md-7">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group animated">
                                    <label for="hiring_manager" className="form-label-active text-grey">
                                        {t(props.language?.layout?.ep_createjob_hiringmanager)}
                                    </label>
                                    <select
                                        className="form-control"
                                        id="hiring_manager"
                                        value={props.screeningQuestions.hiringmanagers}
                                        onChange={(e) =>
                                            props.updateScreeningQuestions("hiringmanagers", e.target.value)
                                        }
                                        disabled>
                                        {props.dropdownHiringManagers.map((item) => (
                                            <option value={item.id}>{item.email}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* <div className="form-group d-md-flex align-items-center mb-1">
                            <div className="col-md-3 p-0">
                                <p>{t(props.language?.layout?.ep_createjob_hiringmanager)}</p>
                            </div>
                            <div className="col-md-9 p-0">
                                <div className="form-group">
                                    <Multiselect
                                        id="multiselectsetting"
                                        options={membersOptions}
                                        selectedValues={editMailsDataCopy}
                                        displayValue={"email"}
                                        onSelect={onSelect}
                                        onRemove={onRemove}
                                        avoidHighlightFirstOption={true}
                                        showArrow={true}
                                        placeholder="Select Members"
                                    />

                                </div>
                            </div>
                        </div> */}
                        <div className="row">
                            <div className="col-lg-4">
                                <div class="form-group animated">
                                    <label class="form-label-active text-grey" for="date_opened">
                                        {t(props.language?.layout?.ep_createjob_dateopened)}
                                    </label>
                                    <input
                                        value={props.screeningQuestions.startDate}
                                        type="date"
                                        id="date_opened"
                                        className="form-control"
                                        name="date_opened"
                                        // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                        min={getTodaysDate()}
                                        onChange={(e) => props.updateScreeningQuestions("startDate", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div
                                    class="form-group animated input-group-focus"
                                    title="Shows the number of days after which the job posting will be not shown on various job boards.">
                                    <label class="form-label-active text-grey" for="expires">
                                        {t(props.language?.layout?.jobcreate_expire_nt)}
                                    </label>
                                    <div className="d-flex form-group animated">
                                        <input
                                            type="number"
                                            id="expires"
                                            class="form-control"
                                            style={{ padding: "1.25rem 0.5rem" }}
                                            value={props.screeningQuestions.endDate}
                                            maxlength="2"
                                            onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                            onInput={maxLengthCheck}
                                            // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                            onChange={(e) => props.updateScreeningQuestions("endDate", e.target.value)}
                                            min="0"
                                        />
                                        <div class="input-group-append ml-1">
                                            <span className="input-group-text">
                                                {t(props.language?.layout?.js_jobs_days)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div
                                    class="form-group animated"
                                    title="Displays the count of open positions for a job opening.">
                                    <label class="form-label-active text-grey" for="positions">
                                        {t(props.language?.layout?.jobcreate_position_nt)}
                                    </label>
                                    <input
                                        value={props.screeningQuestions.positions}
                                        type="number"
                                        id="positions"
                                        className="form-control"
                                        placeholder={t(props.language?.layout?.ep_createjob_openings)}
                                        maxlength="3"
                                        onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                        min="0"
                                        // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                        onInput={maxLengthCheck}
                                        onChange={(e) => props.updateScreeningQuestions("positions", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-end">
                            <div className="col-lg-8 d-flex align-items-center">
                                <div
                                    className="form-check custom-checkbox mb-0 mt-5"
                                    title="The job boards section is used to manage jobs posted to third party job boards.">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="defaultCheckworkboard"
                                        value="true"
                                        checked={props.screeningQuestions.checked}
                                        onChange={() => {
                                            props.updateScreeningQuestions(
                                                "linkedIn",
                                                !props.screeningQuestions.checked
                                            );
                                            props.updateScreeningQuestions(
                                                "checked",
                                                !props.screeningQuestions.checked
                                            );
                                        }}
                                    />
                                    <label className="form-check-label" for="defaultCheckworkboard"></label>
                                    <span className="custom-checkbox-text">
                                        {t(props.language?.layout?.ep_createjob_jobboards)}
                                    </span>
                                </div>
                            </div>
                            {props.screeningQuestions.checked && (
                                <Fragment>
                                    <div className="col-lg-4">
                                        <div class="form-group animated input-group-focus">
                                            <label class="form-label-active text-grey z-index4" for="publish_after">
                                                {t(props.language?.layout?.ep_createjob_publish)} *
                                            </label>
                                            <div class="input-group mt-0 d-flex ">
                                                <input
                                                    type="number"
                                                    id="publish_after"
                                                    class="form-control"
                                                    min="0"
                                                    // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                                    onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                                    style={{ padding: "1.25rem 0.5rem" }}
                                                    value={props.screeningQuestions.publishdays}
                                                    onChange={(e) =>
                                                        props.updateScreeningQuestions("publishdays", e.target.value)
                                                    }
                                                />
                                                <div class="input-group-append">
                                                    <span className="input-group-text">
                                                        {t(props.language?.layout?.js_jobs_days)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {process.env.CLIENT_NAME === "cc" && (
                                        <div className="col-md-12">
                                            <div className="form-group animated">
                                                <label class="form-label-active text-grey pl-1" for="salary">
                                                    Job Boards
                                                </label>
                                                <div className="form-control rounded  h-4rem p-3">
                                                    {/* {fieldsArray} */}
                                                    <div className="d-inline-block">
                                                        <div class="nav nav-pills mr-1 mt-0 hoveredElement">
                                                            {props?.screeningQuestions?.jobBoardsBroadbean == true && (
                                                                <div class="mb-1 d-flex border bg-light rounded mr-1">
                                                                    <div className="d-flex">
                                                                        <a class="text-decoration-none px-2 py-1">
                                                                            Broadbean
                                                                        </a>
                                                                        <div className="">
                                                                            <button
                                                                                type="button"
                                                                                class="close pr-1 mt-1"
                                                                                aria-label="Close"
                                                                                onClick={(e) => {
                                                                                    props.updateScreeningQuestions(
                                                                                        "jobBoardsBroadbean",
                                                                                        false
                                                                                    );
                                                                                    setIsCheckAll(false);
                                                                                }}
                                                                                title="Delete">
                                                                                <span aria-hidden="true">×</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {props?.screeningQuestions?.jobBoardZipRecruiter ==
                                                                true && (
                                                                    <div class="mb-1 d-flex border bg-light rounded mr-1">
                                                                        <div className="d-flex">
                                                                            <a class="text-decoration-none px-2 py-1">
                                                                                ZipRecruiter
                                                                            </a>
                                                                            <div className="">
                                                                                <button
                                                                                    type="button"
                                                                                    class="close pr-1 mt-1"
                                                                                    aria-label="Close"
                                                                                    onClick={(e) => {
                                                                                        props.updateScreeningQuestions(
                                                                                            "jobBoardZipRecruiter",
                                                                                            false
                                                                                        );
                                                                                        setIsCheckAll(false);
                                                                                    }}
                                                                                    title="Delete">
                                                                                    <span aria-hidden="true">×</span>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            {props?.screeningQuestions?.jobBoardsLinkedIn == true && (
                                                                <div class="mb-1 d-flex border bg-light rounded mr-1">
                                                                    <div className="d-flex">
                                                                        <a class="text-decoration-none px-2 py-1">
                                                                            LinkedIn
                                                                        </a>
                                                                        <div className="">
                                                                            <button
                                                                                type="button"
                                                                                class="close pr-1 mt-1"
                                                                                aria-label="Close"
                                                                                onClick={(e) => {
                                                                                    props.updateScreeningQuestions(
                                                                                        "jobBoardsLinkedIn",
                                                                                        false
                                                                                    );
                                                                                    setIsCheckAll(false);
                                                                                }}
                                                                                title="Delete">
                                                                                <span aria-hidden="true">×</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {/* <div className="d-none hideElement"> */}
                                                        </div>
                                                    </div>
                                                    <span
                                                        onClick={(e) => toggle(e)}
                                                        className="float-right text-primary pt-1 pointer">
                                                        {" "}
                                                        + Select Job Boards{" "}
                                                    </span>
                                                    <div class="container">
                                                        <div class="select-box">
                                                            <div
                                                                class="options-container position-absolute"
                                                                style={{ top: "62px", right: 0 }}>
                                                                <div class="d-flex">
                                                                    <div
                                                                        style={style1}
                                                                        class="selected mb-3 pointer text-truncate"></div>
                                                                </div>
                                                                <div
                                                                    ref={NotificationDropdown}
                                                                    style={style}
                                                                    className={`card elevation-3 border-0  ${show.isShowCard ? "d-block" : "d-none"
                                                                        }`}>
                                                                    <div className="mb-2">
                                                                        <button
                                                                            type="button"
                                                                            class="close pr-1"
                                                                            aria-label="Close"
                                                                            onClick={(e) => toggle(e)}
                                                                            title="Close">
                                                                            <span aria-hidden="true">×</span>
                                                                        </button>
                                                                    </div>
                                                                    <div class="option1">
                                                                        <input
                                                                            type="checkbox"
                                                                            value="All"
                                                                            class="checkbox mr-2 pointer"
                                                                            id="All"
                                                                            name="category"
                                                                            onChange={handleSelectAll}
                                                                            checked={isCheckAll}
                                                                        />
                                                                        <label for="Full-time">All</label>
                                                                    </div>
                                                                    <div class="option">
                                                                        <input
                                                                            type="checkbox"
                                                                            value="Indeed"
                                                                            class="checkbox mr-2 pointer"
                                                                            id="Indeed"
                                                                            name="category"
                                                                            onChange={(e) => {
                                                                                props.updateScreeningQuestions(
                                                                                    "jobBoardsBroadbean",
                                                                                    e.target.checked
                                                                                );
                                                                                setIsCheckAll(false);
                                                                            }}
                                                                            checked={
                                                                                props.screeningQuestions
                                                                                    .jobBoardsBroadbean
                                                                            }
                                                                        />
                                                                        <label for="Part-Time">Broadbean</label>
                                                                    </div>
                                                                    <div class="option">
                                                                        <input
                                                                            type="checkbox"
                                                                            value="ZipRecruiter"
                                                                            class="checkbox mr-2 pointer"
                                                                            id="ZipRecruiter"
                                                                            name="category"
                                                                            onChange={(e) => {
                                                                                props.updateScreeningQuestions(
                                                                                    "jobBoardZipRecruiter",
                                                                                    e.target.checked
                                                                                );
                                                                                setIsCheckAll(false);
                                                                            }}
                                                                            checked={
                                                                                props.screeningQuestions
                                                                                    .jobBoardZipRecruiter
                                                                            }
                                                                        />
                                                                        <label for="Contract">ZipRecruiter</label>
                                                                    </div>
                                                                    <div class="option">
                                                                        <input
                                                                            type="checkbox"
                                                                            value="LinkedIn"
                                                                            class="checkbox mr-2 pointer"
                                                                            id="LinkedIn"
                                                                            name="category"
                                                                            onChange={(e) => {
                                                                                props.updateScreeningQuestions(
                                                                                    "jobBoardsLinkedIn",
                                                                                    e.target.checked
                                                                                );
                                                                                setIsCheckAll(false);
                                                                            }}
                                                                            checked={
                                                                                props.screeningQuestions
                                                                                    .jobBoardsLinkedIn
                                                                            }
                                                                        />
                                                                        <label for="FreeLancer">LinkedIn</label>
                                                                    </div>
                                                                    {/* {catalog} */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Fragment>
                            )}
                        </div>
                        <h5
                            className="font-weight-bold mt-4 m-0"
                            title="Compensation refers to the remuneration awarded to an employee in exchange for their services or individual contributions to your business. ">
                            {t(props.language?.layout?.jobs_compensation_nt)}
                        </h5>
                        <div className="row">
                            <div className="col-lg-4 col-12">
                                <div
                                    className="form-group animated"
                                    title="The amount of money paid out per unit time.">
                                    <label for="salary_type" className="form-label-active text-grey">
                                        {t(props.language?.layout?.ep_createjob_salary)}
                                    </label>
                                    <select
                                        className="form-control"
                                        // className={"form-control " + ((props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? " click-readonly" : null)}
                                        id="salary_type"
                                        // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                        value={props.screeningQuestions.salaryType}
                                        onChange={(e) => props.updateScreeningQuestions("salaryType", e.target.value)}>
                                        <option selected="" className="d-none">
                                            {t(props.language?.layout?.ep_setting_bd_select)}
                                        </option>
                                        <option value="Per Year">{t(props.language?.layout?.jobs_peryear_nt)}</option>
                                        <option value="Per Hour">{t(props.language?.layout?.jobs_perhour_nt)}</option>
                                        <option value="Per Week">{t(props.language?.layout?.jobs_perweek_nt)}</option>
                                        <option value="Per Month">{t(props.language?.layout?.jobs_permonth_nt)}</option>
                                        <option value="Biweekly">{t(props.language?.layout?.jobs_biweekly_nt)}</option>
                                        <option value="Per Day">{t(props.language?.layout?.jobs_perday_nt)}</option>
                                    </select>
                                </div>
                            </div>
                            {/* <div className="col-md-3">
                                <div className="form-group animated">
                                    <label for="exampleFormControlSelect1" className="form-label-active text-muted">
                                        Currency
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue="USD"
                                        onChange={(e) => props.updateScreeningQuestions("currency", e.target.value)}
                                        disabled
                                    />
                                </div>
                            </div> */}
                            <div className="col-lg-8 col-12 d-flex flex-column justify-content-end">
                                <div
                                    class="form-group animated input-group-focus"
                                    title="Salary is the amount of compensation paid for a specific position.">
                                    <label class="form-label-active text-grey" for="salary">
                                        {t(props.language?.layout?.jobcreate_minsalary_nt)}
                                    </label>
                                    <div class="d-flex">
                                        <div className="form-group animated">
                                            <input
                                                class="form-control rounded"
                                                id="salary"
                                                style={{ padding: "1.25rem 0.5rem" }}
                                                value={props.screeningQuestions.minSalary}
                                                type="number"
                                                // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                                onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                                minlength="0"
                                                maxlength="9"
                                                onChange={(e) =>
                                                    props.updateScreeningQuestions("minSalary", e.target.value && Math.max(0, parseInt(e.target.value, 10))
                                                        .toString()
                                                        .slice(0, 9))
                                                }
                                            />
                                        </div>
                                        <div className="input-group-append">
                                            <span className="input-group-text rounded mx-1">
                                                {t(props.language?.layout?.jobcreate_to_nt)}
                                            </span>
                                        </div>
                                        <div className="form-group animated" style={{ marginTop: "-32px" }}>
                                            <label class="form-label-active text-grey p-0" for="salary">
                                                {" "}
                                                {t(props.language?.layout?.jobcreate_maxsalary_nt)}
                                            </label>
                                            <input
                                                class="form-control"
                                                id="salary"
                                                value={props.screeningQuestions.maxSalary}
                                                type="number"
                                                minlength="0"
                                                maxlength="9"
                                                // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                                onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                                onChange={(e) =>
                                                    props.updateScreeningQuestions("maxSalary", e.target.value && Math.max(0, parseInt(e.target.value, 10))
                                                        .toString()
                                                        .slice(0, 9))
                                                }
                                            />
                                        </div>
                                        <div className="input-group-append">
                                            <span className="input-group-text rounded px-3 ml-1">$</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <div className="form-check custom-checkbox ml-5 mt-4 m-0">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="defaultCheck2"
                                    value="true"
                                    checked={props.screeningQuestions.locationChecked}
                                    onChange={() => remoteLocationCheckedHandler()}
                                />
                                <label className="form-check-label" for="defaultCheck2"></label>
                                <span className="custom-checkbox-text">
                                    {t(props.language?.layout?.ep_createjob_virtual)}
                                </span>
                            </div>
                        </div>
                        {props.screeningQuestions.locationChecked == false ? (
                            <div>
                                <h5
                                    className="font-weight-bold mt-4 pt-1 m-0"
                                    title="Location is a specific place or places of employment, or the territory or territories regularly visited by the person in pursuance of the person's occupation, or both.">
                                    {t(props.language?.layout?.ep_jobtitle_location)}
                                </h5>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group animated">
                                            <Locations
                                                setLocationCountry={setLocationCountry}
                                                setLocationState={setLocationState}
                                                setLocationCity={setLocationCity}
                                                locationsJSON={locationsJSON}
                                                setLocation={setLocation}
                                                updateScreeningQuestions={props.updateScreeningQuestions}
                                                screeningQuestions={props.screeningQuestions}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="d-flex justify-content-between align-items-center profile-input-height mt-5 mb-4">
                            <div>
                                <button className="btn btn-light" onClick={() => props.reset()}>
                                    {t(props.language?.layout?.forgotpass_reset)}
                                </button>
                            </div>
                            <div>
                                <Link onClick={() => props.prev()} className="btn btn-outline-primary btn-md px-4 mx-4">
                                    {t(props.language?.layout?.jobs_previous)}
                                </Link>
                                <Link onClick={() => props.next()} className="btn btn-primary btn-md px-4">
                                    {t(props.language?.layout?.jobs_next)}
                                </Link>
                            </div>
                        </div>
                        {/* <h5 className="font-weight-bold mt-4 m-0">Screening questions</h5>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="w-100 mr-2">
                                <hr className="border-secondary" />
                            </div>
                            <div>
                                <img
                                    //COPYICONSFOLDER
                                    src={
                                        hideContent
                                            ? "svgs/icons_new/chevron-circle-up.svg"
                                            : "svgs/icons_new/chevron-circle-down.svg"
                                    }
                                    onClick={() => setHideContent(!hideContent)}
                                    className="svg-sm"
                                />
                            </div>
                        </div> */}
                    </div>
                    <div className="col-md-3 offset-md-1 mt-4 pt-1">
                        <div className="bg-light py-2 px-2 mt-3">
                            <div class="card">
                                <div class="card-body p-0">
                                    <h6 class="card-title mb-0 p-3 ml-1 font-weight-bold">{t(props.language?.layout?.aj_languages)}</h6>
                                    {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                                    <div className="d-flex bg-light">

                                        <button class={"card-text border-0 pointer bg-light p-2 pl-3 font-weight-bold " + (props.languageName == "en" || props.languageName == "esp" ? "card-left-border" : null) + (props.englishLang1 ? "" : "click-readonly")}
                                            onClick={() => {
                                                props.editlanguagehandler("englishT", true); setCard1(false); setCard2(false); setCard3(true);
                                                props._languageName("en")
                                            }} disabled={!props.englishLang1}>English</button>
                                        <div class="switch checkbox-switch switch-success mt-0 bg-light ml-auto">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    id="customfrench"
                                                    className=""
                                                    checked={props.englishLang1}
                                                    // onChange={(e) => { setFrench(e.target.checked); setSpanish(false); }}
                                                    onChange={(e) => { props.editlanguagehandler("englishText", e.target.checked); }}
                                                />
                                                <span></span>
                                            </label>
                                        </div>
                                    </div>
                                    {/* {props.spanishLang1 ?
                                        <p class={"card-text border-right-0 border-bottom-0 border-top-0 pointer bg-light p-2 pl-3 font-weight-bold " + (card2 ? "card-left-border" : null)} onClick={() => { props.editlanguagehandler("spanishT", true); setCard1(false); setCard2(true); setCard3(false); props._languageName("esp") }}>Spanish</p> : null} */}
                                    <div className="d-flex bg-light">

                                        <button class={"card-text border-0 pointer bg-light p-2 pl-3 font-weight-bold " + (props.languageName == "fr" ? "card-left-border" : null) + (props.frenchLang1 ? "" : "click-readonly")}
                                            onClick={() => {
                                                props.editlanguagehandler("frenchT", true); setCard1(false); setCard2(false); setCard3(true);
                                                props._languageName("fr")
                                            }} disabled={!props.frenchLang1}>French</button>
                                        <div class="switch checkbox-switch switch-success mt-0 bg-light ml-auto">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    id="customfrench"
                                                    className=""
                                                    checked={props.frenchLang1}
                                                    // onChange={(e) => { setFrench(e.target.checked); setSpanish(false); }}
                                                    onChange={(e) => { props.editlanguagehandler("frenchText", e.target.checked); }}
                                                />
                                                <span></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* <div className="col-md-8">
                                    <div className="d-flex mt-4 pl-4">
                                        <div class="form-group animated form-primary-bg text-left">
                                            <div class="switch checkbox-switch switch-success mt-0">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        id="customspanish"
                                                        className=""
                                                        checked={props.spanishLang1}
                                                        // onChange={(e) => { setSpanish(e.target.checked); setFrench(false); }}
                                                        onChange={(e) => { props.editlanguagehandler("spanishText", e.target.checked); }}
                                                    />
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                        <p className="mt-1 font-weight-bold">Spanish</p>
                                    </div>
                                </div> */}
                                        {/* <div className="col-md-4 pt-1">
                                    <button className="btn btn-outline-secondary mt-3">
                                        Make primary
                                    </button>
                                </div> */}
                                    </div>
                                    {/* <hr />
                                    <p><span> <img
                                        src="/svgs/icons_new/settings.svg" alt="setting"
                                        className="svg-xs ml-4" /></span>
                                        <span className="ml-2 font-weight-bold pointer"
                                        // onClick={() => setManageModal(true)}
                                        ><u>{t(props.language?.layout?.aj_languages_manage)}</u></span>
                                    </p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="row ml-5">
                    <div className="col-md-7">
                        <div>
                            {hideContent ? (
                                <div className="screening-questions my-2">
                                    <ul className="list-group">
                                        <li className="list-group-item p-2">
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex form-group animated align-items-center border rounded px-4">
                                                    <img
                                                        //COPYICONSFOLDER
                                                        src="/svgs/icons_new/align-left.svg"
                                                        className="svg-xs"
                                                        alt="settings"
                                                    />
                                                    <select className="form-control border-0 px-5">
                                                        <option selected="">Multiple choice</option>
                                                        <option value="1">....</option>
                                                    </select>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <img src="/svgs/icons_new/copy.svg" className="svg-sm" alt="copy" />
                                                    <img
                                                        src="svgs/icons_new/trash.svg"
                                                        className="svg-sm mx-3"
                                                        alt="delete"
                                                    />
                                                    <div className="h-100 border-right border-dark"></div>
                                                    <h5 className="mx-3 text-secondary font-weight-normal pt-1">
                                                        Required
                                                    </h5>
                                                    <div className="custom-control custom-switch">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="switch"
                                                            name="example"
                                                        />
                                                        <label className="custom-control-label" for="switch"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="list-group-item px-3 py-2">
                                            <input
                                                type="text"
                                                className="form-control bg-light border-top-0 border-left-0 border-right-0 col-md-8 mb-3 border-muted"
                                                id="job_title"
                                                name="job_title"
                                                placeholder=""
                                            />
                                            <div className="form-check custom-radio">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name="exampleRadios"
                                                    id="example"
                                                    value="option1"
                                                />
                                                <label className="form-check-label" for="example">
                                                    Option 1
                                                </label>
                                            </div>
                                            <div className="form-check custom-radio">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name="exampleRadios"
                                                    id="example1"
                                                    value="Add option"
                                                />
                                                <label className="form-check-label" for="example1">
                                                    Add option
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                    <div
                                        className="rounded text-center p-5 mt-3"
                                        style={{ border: "2px dashed lightgrey" }}>
                                        Add New Question
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center profile-input-height mt-5 mb-4">
                            <div>
                                <button className="btn btn-light">Reset</button>
                            </div>
                            <div>
                                <Link onClick={() => props.prev()} className="btn btn-outline-primary btn-md px-5 mx-4">
                                    Cancel
                                </Link>
                                <Link onClick={() => props.next()} className="btn btn-primary btn-md px-5">
                                    Save &amp; continue
                                </Link>
                            </div>
                        </div>
                    </div>
                    {hideContent ? (
                        <div className="col-md-4 ml-4 mb-4">
                            <h5 className="text-secondary font-weight-normal py-2">Suggested screening questions</h5>
                            <div className="mt-3 border" style={{ height: "92%" }}>
                                <div className="row mx-0 p-2">
                                    <div className="col-md-2">Active</div>
                                    <div className="col-md-2 pl-0">Required</div>
                                    <div className="col-md-8">Question</div>
                                </div>
                                <div className="row mx-0 px-2 pt-2 pb-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch1"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch1"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox1" name="checkbox1" />
                                    </div>
                                    <div className="col-md-8">Attach resume</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch2"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch2"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox2" name="checkbox2" />
                                    </div>
                                    <div className="col-md-8">Attach cover letter</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch3"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch3"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox3" name="checkbox3" />
                                    </div>
                                    <div className="col-md-8">Willing to relocate?</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">Phone</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">Address</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">Highest level of education achived</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">Employment eligibility</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">
                                        Willing to undergo a background check in accordance with local laws and
                                        regulations
                                    </div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">Desired salary</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">Willing to relocate ?</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">College/University</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">GPA</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">Website</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">Linkedin</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">Twitter</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">Language Spoken</div>
                                </div>
                                <div className="row mx-0 px-2 py-1">
                                    <div className="col-md-2">
                                        <div className="custom-control custom-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="switch4"
                                                name="example"
                                            />
                                            <label className="custom-control-label" for="switch4"></label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <input type="checkbox" id="checkbox4" name="checkbox4" />
                                    </div>
                                    <div className="col-md-8">Driver's license ?</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </div> */}
                <Modal
                    size="md"
                    id="modal-jobDetails"
                    show={manageModal}
                    // onHide={() => { setManageModal(false); props.closebox(); }}>
                    onHide={() => { setManageModal(false); }}>
                    <div className="modal-content modal_Border">
                        <div className="modal-header border-0 p-0">
                            {/* <button
                                type="button"
                                className="close animate-closeicon"
                                aria-label="Close"
                                title="Close"
                                onClick={() => setManageModal(false)} >
                                <span aria-hidden="true">&times;</span>
                            </button> */}
                        </div>
                        <div className="modal-body text-center px-2 pb-0">
                            <h2 className="text-left font-weight-bold pl-4">
                                {t(props?.language?.layout?.aj_languages_jl)}
                            </h2>
                            <p className="text-left pl-4">
                                {t(props?.language?.layout?.aj_selectprimarylang)}
                                {/* <span className="text-primary">{t(props?.language?.layout?.aj_learnmore)}</span> */}
                            </p>
                            <hr className="mx-n3 mb-0" />
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="d-flex mt-4 pl-4">
                                        <div class="form-group animated form-primary-bg text-left">
                                            <div class="switch checkbox-switch switch-success mt-0">
                                                <label>
                                                    <input
                                                        disabled
                                                        type="checkbox"
                                                        id="customeng"
                                                        className=""
                                                        checked={englishLang}
                                                        onChange={(e) => setEnglishLang(e.target.checked)}
                                                    />
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                        <p className="mt-1"><span className="font-weight-bold">English</span>
                                            {/* {t(props?.language?.layout?.aj_primary)} */}
                                        </p>
                                    </div>

                                </div>
                            </div>
                            <div className="row">
                                {/* <div className="col-md-8">
                                    <div className="d-flex mt-4 pl-4">
                                        <div class="form-group animated form-primary-bg text-left">
                                            <div class="switch checkbox-switch switch-success mt-0">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        id="customspanish"
                                                        className=""
                                                        checked={props.spanishLang1}
                                                        // onChange={(e) => { setSpanish(e.target.checked); setFrench(false); }}
                                                        onChange={(e) => { props.editlanguagehandler("spanishText", e.target.checked); }}
                                                    />
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                        <p className="mt-1 font-weight-bold">Spanish</p>
                                    </div>
                                </div> */}
                                {/* <div className="col-md-4 pt-1">
                                    <button className="btn btn-outline-secondary mt-3">
                                        Make primary
                                    </button>
                                </div> */}
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="d-flex mt-4 pl-4">
                                        <div class="form-group animated form-primary-bg text-left">
                                            <div class="switch checkbox-switch switch-success mt-0">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        id="customfrench"
                                                        className=""
                                                        checked={props.frenchLang1}
                                                        // onChange={(e) => { setFrench(e.target.checked); setSpanish(false); }}
                                                        onChange={(e) => { props.editlanguagehandler("frenchText", e.target.checked); }}

                                                    />
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                        <p className="mt-1 font-weight-bold">French</p>
                                    </div>
                                </div>
                                {/* <div className="col-md-4 pt-1">
                                    <button className="btn btn-outline-secondary mt-3">
                                        Make primary
                                    </button>
                                </div> */}
                            </div>
                            <div className="row bg-silver-light mt-4">
                                <div className="col-md-6">
                                    {/* <p className="mb-0 m-4 text-left"><span><img
                                        src="/svgs/icons_new/plus-circle.svg" alt="plus"
                                        className="svg-sm" /></span>
                                        <span className="ml-2 font-weight-bold">Add Language</span>
                                    </p> */}
                                </div>
                                <div className="col-md-6 py-3 pr-4 text-right">
                                    <button
                                        className="btn btn-primary btn-md px-3"
                                        style={{ backgroundColor: "#0099df" }}
                                        // onClick={() => { setManageModal(false); props.resetLang();}}
                                        onClick={() => { setManageModal(false); }}
                                    >{t(props?.language?.layout?.aj_done)}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

// function mapStateToProps(state) {
//     return {
//         language: state.authInfo.language,
//         userToken: state.authInfo.userToken,

//     };
// }
// export default connect(mapStateToProps, { })(ScreeningQuestions);
export default ScreeningQuestions;