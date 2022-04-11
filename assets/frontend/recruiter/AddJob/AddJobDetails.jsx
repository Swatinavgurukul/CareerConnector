import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactQuill from "./reactQuill.jsx";
import ReactTags from "react-tag-autocomplete";
import { capitalizeFirstLetter } from "../../modules/helpers.jsx";
import { DebounceInput } from "react-debounce-input";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { job_type, education_language } from "../../../translations/helper_translation.jsx";
import Modal from "react-bootstrap/Modal";


const AddNewJob = (props) => {
    const reactTags = React.createRef();
    const quilHeight = {
        height: "100% !important",
    };
    if (props.currentStep !== 1) {
        return null;
    }
    //restrict - and + in input box
    const [symbolsArr] = useState(["e", "E", "-", "+", "."]);
    //
    const prev = usePrevious(list);
    const [visible, setVisible] = useState(false);
    const [loader, setLoader] = useState(false);
    const [selectedItem, setSelectedItem] = useState(false);
    const [manageModal, setManageModal] = useState(false);
    const [englishLang, setEnglishLang] = useState(true);
    const [card1, setCard1] = useState(true);
    const [card2, setCard2] = useState(false);
    const [card3, setCard3] = useState(false);
    const dropdownRef = useRef(null);
    let list = props.jobDetails.jobTemplate;
    if (props.currentStep !== 1) {
        return null;
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClick, false);
        return () => document.removeEventListener("mousedown", handleClick, false);
    }, []);
    const handleClick = (e) => {
        if (dropdownRef.current?.contains(e?.target)) {
            return;
        }
        setVisible(false);
    };
    const { t } = useTranslation();

    const [value, setValue] = useState("");
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
        ],
    };
    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
    ];
    useEffect(() => {
        if (props.languageName == "en" || props.languageName == "esp") {
            props.editlanguagehandler("englishT", true);
            props.editlanguagehandler("englishText", true);
        }
        if (props.languageName == "fr" && props.edit == "") {
            props.editlanguagehandler("frenchT", true);
            props.editlanguagehandler("frenchText", true);
        }
        if (props.languageName == "fr" && props.jobDetails.title_fr !== "") {
            props.editlanguagehandler("frenchT", true);
            props.editlanguagehandler("frenchText", true);
        }
        if (props.languageName == "fr" && props.jobDetails.title !== "" && props.jobDetails.title_fr == "") {
            props.editlanguagehandler("englishT", true);
            props.editlanguagehandler("englishText", true);
        }
        if (props.languageName == "fr" && props.jobDetails.title !== "" && props.jobDetails.title_fr !== "") {
            props.editlanguagehandler("englishText", true);
        }
    }, [props.jobDetails]);
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
    const onchange = (data, value) => {
        if (value === "description") props.updateJobDetails(props.spanishLang ? "description_esp" : (props.frenchLang ? "description_fr" : "description"), data);
        else props.updateJobDetails(props.spanishLang ? "jobTemplateDescription_esp" : (props.frenchLang ? "jobTemplateDescription_fr" : "jobTemplateDescription"), data);
        props.updateJobDetails(props.spanishLang ? "description_esp" : (props.frenchLang ? "description_fr" : "description"), data);
    };
    const onchangeJobTemplate = (title) => {
        props.updateJobDetails(props.spanishLang ? "title_esp" : (props.frenchLang ? "title_fr" : "title"), title);
        props.getJobTemplateData(title);
        setLoader(true);
        if (!visible) {
            setVisible(true);
        }
    };
    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    useEffect(() => {
        if (prev !== list) {
            setLoader(false);
        }
    }, [list]);
    const selectItem = (item) => {
        props.updateJobDetails(props.spanishLang ? "title_esp" : (props.frenchLang ? "title_fr" : "title"), item.job_title);
        props.getJobTemplateDescription(item.id);
        setVisible(false);
        if (props.jobDetails.description !== "") {
            if (
                window.confirm(
                    "Job description entered will be overwritten with the selected Job Description. Do you want to proceed?"
                )
            )
                setSelectedItem(true);
            else setSelectedItem(false);
            return;
        }
        setSelectedItem(true);
    };
    const onDelete = (i) => {
        let deleteSkill = props.spanishLang ? props.jobDetails?.skillsTags_esp.slice(0) : (props.frenchLang ? props.jobDetails?.skillsTags_fr.slice(0) : props.jobDetails?.skillsTags.slice(0))
        deleteSkill.splice(i, 1);
        props.updateJobDetails(props.spanishLang ? "skillsTags_esp" : (props.frenchLang ? "skillsTags_fr" : "skillsTags"), deleteSkill);
    };
    const onAddition = (tag) => {
        let tags = { ...tag, "lang_pref": props.languageName }
        const addSkill = [].concat(props.spanishLang ? props.jobDetails?.skillsTags_esp : (props.frenchLang ? props.jobDetails?.skillsTags_fr : props.jobDetails?.skillsTags), tags)
        var names = props.spanishLang ? props.jobDetails?.skillsTags_esp.map(({ name }) => name) : (props.frenchLang ? props.jobDetails?.skillsTags_fr.map(({ name }) => name) : props.jobDetails?.skillsTags.map(({ name }) => name))
        if (!names.includes(tag.name)) {
            props.updateJobDetails(props.spanishLang ? "skillsTags_esp" : (props.frenchLang ? "skillsTags_fr" : "skillsTags"), addSkill);
        }
        if (props.jobDetails.skillsSuggestions.includes(tag)) {
            props.jobDetails.skillsSuggestions = props.jobDetails.skillsSuggestions.filter(
                (val) => !addSkill.includes(val)
            );
            props.updateJobDetails("skillsSuggestions", props.jobDetails.skillsSuggestions);
        }
    };
    const onInput = (query) => {
        if (query.length >= 2) props.getSkillsData(query);
        return;
    };
    const jobTypeHandler = (language, key) => {
        return (job_type[language][key]);
    }

    const educationHandler = (language, key) => {
        return (education_language[language][key]);
    }
    return (
        <div className="col-md-12 px-0">
            <div className="container-fluid p-3 px-3">
                <div className="row ml-xl-5 ml-lg-2 ml-md-2 form-focus">
                    <div className="col-lg-7 col-md-8 col-xs-12">
                        <div className="">
                            <div className="">
                                <div className="form-group animated mt-n3">
                                    <label className="form-label-active text-grey" for="job_title">
                                        {t(props?.language?.layout?.ep_createjob_title)}*
                                    </label>

                                    <DebounceInput
                                        className="form-control"
                                        minLength={2}
                                        id="job_title"
                                        debounceTimeout={500}
                                        value={props.spanishLang ? props.jobDetails.title_esp : (props.frenchLang ? props.jobDetails.title_fr : props.jobDetails.title)}
                                        onChange={(event) => onchangeJobTemplate(event.target.value)}
                                    />
                                    {!props.frenchLang &&
                                        <>
                                            <div
                                                ref={dropdownRef}
                                                className={`Jobtemplate thin-scrollbar ${visible ? "visible-template" : ""}`}>
                                                {visible && (
                                                    <ul className="p-0 mb-1">
                                                        {list == "" && (
                                                            <li key="" className="dropdown_item text-center ">
                                                                {t(props?.language?.layout?.notemplate_nt)}
                                                            </li>
                                                        )}
                                                        {list &&
                                                            list.map((item) => (
                                                                <li
                                                                    key={item.id}
                                                                    onClick={() => selectItem(item)}
                                                                    className="dropdown_item sidebar-heading">
                                                                    <div className="item_text1">{item.job_title}</div>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            </div>
                                            {loader ? (
                                                <div class="d-flex justify-content-end mr-3 mt-2">
                                                    <div class="mt-n5 mb-4">
                                                        <img
                                                            src="/images/loading.gif"
                                                            alt="loader"
                                                            class="svg-lg"
                                                            id="loader"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </>}
                                </div>
                            </div>
                            <div>
                                <label className="form-label-active" for="job_title">
                                    <h5 className="font-weight-bold mt-4">{t(props?.language?.layout?.ep_createjob_description)}*</h5>
                                </label>
                            </div>
                            <ReactQuill
                                value={
                                    selectedItem
                                        ?
                                        props.spanishLang ? props.jobDetails.jobTemplateDescription_esp : (props.frenchLang ? props.jobDetails.jobTemplateDescription_fr : props.jobDetails.jobTemplateDescription)
                                        // props.jobDetails.jobTemplateDescription
                                        : props.spanishLang ? props.jobDetails.description_esp : (props.frenchLang ? props.jobDetails.description_fr : props.jobDetails.description)
                                }
                                onChange={onchange}
                                param={selectedItem ?
                                    "jobTemplateDescription"
                                    : "description"}
                            />
                            <div className="">
                                <div className="form-group animated">
                                    <label className="form-label-active text-grey z-index4" for="job_title">
                                        {t(props?.language?.layout?.js_profile_skills)}
                                    </label>
                                    <div role="link">
                                        <ReactTags
                                            ref={reactTags}
                                            tags={props.spanishLang ? props.jobDetails?.skillsTags_esp : (props.frenchLang ? props.jobDetails?.skillsTags_fr : props.jobDetails?.skillsTags)}
                                            suggestions={props.jobDetails.skillsSuggestions}
                                            onDelete={onDelete}
                                            onAddition={onAddition}
                                            onInput={onInput}
                                            allowNew
                                            placeholderText={t(props?.language?.layout?.ep_createjob_addskills)}
                                            minQueryLength={0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group animated">
                                    <label className="form-label-active text-grey" for="job_function">
                                        {t(props?.language?.layout?.ep_createjob_function)} *
                                    </label>
                                    <select
                                        className="form-control"
                                        // className={"form-control " + ((props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? " click-readonly" : null)}
                                        id="job_function"
                                        // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                        value={props.jobDetails.department}
                                        onChange={(e) => props.updateJobDetails("department", e.target.value)}>
                                        <option value="" disabled selected className="d-none">
                                            {t(props?.language?.layout?.ep_setting_bd_select)}
                                        </option>
                                        {props.dropdownDepartment.map((item) => (
                                            <option value={item.id}>{item.text}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group animated">
                                    <label className="form-label-active text-grey" for="industry">
                                        {t(props.language?.layout?.all_industry)}
                                    </label>
                                    <select
                                        className="form-control"
                                        // className={"form-control " + ((props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? " click-readonly" : null)}
                                        id="industry"
                                        // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                        value={props.jobDetails.industry}
                                        onChange={(e) => props.updateJobDetails("industry", e.target.value)}>
                                        <option value="" disabled selected className="d-none">
                                            {t(props?.language?.layout?.ep_setting_bd_select)}
                                        </option>
                                        {props.dropdownIndustry.map((item) => (
                                            <option value={item.id}>{item.text}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group animated">
                                    <label for="job_link" className="form-label-active text-grey">
                                        {t(props?.language?.layout?.ep_createjob_link)}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="job_link"
                                        name="job_link"
                                        // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                        value={props.jobDetails.externalJobLink}
                                        onChange={(e) => props.updateJobDetails("externalJobLink", e.target.value)}
                                    />
                                    <p className="text-grey">
                                        {t(props?.language?.layout?.ep_createjob_linkdescription)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-xl-3">
                                <div className="form-group animated">
                                    <label className="form-label-active text-grey" for="job_type">
                                        {t(props?.language?.layout?.ep_jobs_jobtype)} *
                                    </label>
                                    <select
                                        className="form-control"
                                        // className={"form-control " + ((props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? " click-readonly" : null)}
                                        id="job_type"
                                        // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                        value={props.jobDetails.jobType}
                                        onChange={(e) => props.updateJobDetails("jobType", e.target.value)}>
                                        <option value="" disabled selected className="d-none">
                                            {t(props?.language?.layout?.ep_setting_bd_select)}
                                        </option>
                                        {props.dropdownJobTypes.map((item) => (
                                            <option value={item.id}>{jobTypeHandler(props?.languageName, item.name)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-xl-6 d-flex align-items-end">
                                <div class="form-group animated input-group-focus">
                                    <label class="form-label-active text-grey" for="experience_min">
                                        {t(props?.language?.layout?.ep_jobtitle_experience)}
                                    </label>
                                    <div class="d-flex">
                                        <div className="mr-3">
                                            <input
                                                class="form-control rounded "
                                                id="experience_min"
                                                style={{ padding: "1.25rem 0.5rem" }}
                                                type="number"
                                                // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                                value={props.jobDetails.minExperience}
                                                min="0"
                                                onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                                onChange={(e) =>
                                                    props.updateJobDetails("minExperience", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="input-group-append mr-3">
                                            <span className="input-group-text rounded"> {t(props?.language?.layout?.jobcreate_to_nt)}</span>
                                        </div>
                                        <div className="form-group animated" style={{ marginTop: "-32px" }}>
                                            <label class="form-label-active text-grey" for="experience_max"> {t(props?.language?.layout?.ep_jobtitle_experience)}
                                            </label>
                                            <input
                                                class="form-control"
                                                id="experience_max"
                                                // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                                value={props.jobDetails.maxExperience}
                                                min="0"
                                                onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                                onChange={(e) =>
                                                    props.updateJobDetails("maxExperience", e.target.value)
                                                }
                                                type="number"
                                            />
                                        </div>
                                        <div className="input-group-append ml-3">
                                            <span className="input-group-text rounded">{t(props?.language?.layout?.all_years_nt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-xl-3">
                                <div className="form-group animated">
                                    <label for="education" className="form-label-active text-grey">
                                        {t(props?.language?.layout?.all_education_nt)}
                                    </label>
                                    <select
                                        id="education"
                                        className="form-control"
                                        // readonly={(props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? "readonly" : null}
                                        // className={"form-control " + ((props?.editJobIs == true && props.frenchLang || props?.editJobIs == true && props.spanishLang) ? " click-readonly" : null)}
                                        value={props.jobDetails.education}
                                        onChange={(e) => props.updateJobDetails("education", e.target.value)}>
                                        <option value="" disabled selected className="d-none">
                                            {t(props?.language?.layout?.ep_setting_bd_select)}
                                        </option>
                                        {props.dropdownEducation.map((item) => (
                                            <option value={item.id}>{educationHandler(props?.languageName, item.education)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center profile-input-height mt-5 mb-3">
                            <div>
                                <button className="btn btn-light" onClick={() => props.reset()}>
                                    {t(props.language?.layout?.forgotpass_reset)}
                                </button>
                            </div>
                            <div>
                                <Link to="/jobs" className="btn btn-outline-primary btn-md px-3 mx-2" aria-describedby="Previous">
                                    {t(props.language?.layout?.jobs_previous)}
                                </Link>
                                <Link className="btn btn-primary btn-md px-4" onClick={() => props.next()}>
                                    {t(props.language?.layout?.jobs_next)}
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-xs-12 mx-auto">
                        {/* {props?.editJobIs ? */}
                        <div className="bg-light py-2 px-2 mt-3">
                            <div class="card">
                                <div class="card-body p-0">
                                    <h6 class="card-title mb-0 p-3 ml-1 font-weight-bold">{t(props.language?.layout?.aj_languages)}</h6>
                                    {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                                    {/* <p class={"card-text border-right-0 border-bottom-0 border-top-0 pointer bg-light p-2 pl-3 font-weight-bold " + (props.languageName == "en" || props.languageName == "esp" ? " card-left-border" : null)}
                                        onClick={() => {
                                            props.editlanguagehandler("englishT", true); setCard1(true); setCard2(false); setCard3(false);
                                            props._languageName("en")
                                        }}><span className="font-weight-bold">English</span>

                                    </p> */}
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
                        {/* : null} */}
                        <div className="bg-light py-4 px-3 mt-3">
                            <h5 className=" mb-3">{t(props?.language?.layout?.job_template_nt)}</h5>
                            <p className="my-1">{t(props?.language?.layout?.ep_createjob_template_description)}</p>
                            <p className="my-1">{t(props?.language?.layout?.ep_createjob_template_description2)}</p>
                        </div>
                        <div className="bg-light py-4 px-3 mt-5">
                            <h5 className=" mb-3">{t(props?.language?.layout?.job_description_nt)}</h5>
                            <p className="my-1">{t(props?.language?.layout?.ep_createjob_jobdescription_para1)}</p>
                            <p className="my-1">
                                {t(props?.language?.layout?.ep_createjob_jobdescription_para2)}
                            </p>
                            <p className="my-1">{t(props?.language?.layout?.ep_createjob_jobdescription_para3)}</p>
                            <p className="my-1">{t(props?.language?.layout?.ep_createjob_jobdescription_para4)}</p>
                        </div>
                    </div>
                </div>
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
                                {/* {t(props?.language?.layout?.aj_selectprimarylang)} */}
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

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName
    };
}
export default AddNewJob;
