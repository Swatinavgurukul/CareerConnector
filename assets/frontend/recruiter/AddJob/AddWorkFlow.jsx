import React, { useState, useEffect, useRef, Fragment } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { DebounceInput } from "react-debounce-input";
import ReactQuill from "./reactQuill.jsx";
import ReactTags from "react-tag-autocomplete";


const WorkFLow = (props) => {
    const reactTags = React.createRef();

    if (props.currentStep !== 3) {
        return null;
    }
    const [visible, setVisible] = useState(false);
    const [loader, setLoader] = useState(false);
    const [selectedItem, setSelectedItem] = useState(false);

    const [stageSelect, setStagesSelect] = useState([]);
    const [showStages, setShowStages] = useState(false);
    const [show, setShow] = useState(false);
    const [showAction, setShowAction] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [addStage, setAddStage] = useState(false);
    const [drag, setDrag] = useState();
    const [stage, setStage] = useState(false);
    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState("");
    let [openModel, setOpenModel] = useState(false);
    let [openFRModel, setOpenFRModel] = useState(false);
    const [card1, setCard1] = useState(true);
    const [card2, setCard2] = useState(false);
    const [card3, setCard3] = useState(false);
    const [manageModal, setManageModal] = useState(false);
    const [englishLang, setEnglishLang] = useState(true);
    const [items, setItems] = useState([
        "Applied",
        "Review",
        "Assessment",
        "Interview",
        "Offered",
        "Offer-accepted",
        "Hired",
    ]);
    const [stageDisable, setStageDisable] = useState();
    const { t } = useTranslation();
    const dropdownRef = useRef(null);
    const dropdownRefFR = useRef(null);
    const prev = usePrevious(list);
    useEffect(() => {
        document.addEventListener("mousedown", handleClick, false);
        return () => document.removeEventListener("mousedown", handleClick, false);
    }, []);
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
    const handleClick = (e) => {
        if (dropdownRef.current.contains(e.target)) {
            return;
        }
        setVisible(false);
        if (dropdownRefFR.current.contains(e.target)) {
            return;
        }
        setVisible(false);
    };
    const checkStage = (filterName, items) => {
        if (items) {
            var itemsVal = [];
            items.forEach((e) => {
                if (e != filterName) itemsVal.push(e);
                setStageDisable(filterName);
                setStage(true);
            });
        }
        setShowAction(true);
    };
    const onchange = (data, value) => {
        if (value === "description_esp") props.updateJobDetails("description_esp", data);
        else props.updateJobDetails("jobTemplateDescription", data);
        props.updateJobDetails("description_esp", data);
    };
    const onchangeFR = (data, value) => {
        if (value === "description_fr") props.updateJobDetails("description_fr", data);
        else props.updateJobDetails("jobTemplateDescription", data);
        props.updateJobDetails("description_fr", data);
    };
    let list = props.jobDetails.jobTemplate;

    const stagesSelected = (param) => {
        // const { listofdata } = stageSelect;
        const newList = [param];
        // console.log(newList, " === newList ===");
        const itemIndex = newList.findIndex((item) => item.name == param);

        if (itemIndex > -1) {
            stageSelect.splice(itemIndex, 1);
        } else {
            stageSelect.push(param);
        }

        setStagesSelect(stageSelect);
        // console.log(stageSelect, " === stageSelect ===");
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
    const onDragStart = (e, index) => {
        var draggedItem = items[index];
        setDrag(draggedItem);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.parentNode);
    };

    const onDragOver = (index) => {
        const draggedOverItem = items[index];
        if (drag === draggedOverItem) {
            return;
        }
        let item = items.filter((item) => item !== drag);
        item.splice(index, 0, drag);
        setItems([...item]);
    };

    const onDragEnd = (e) => {
        let draggedIdx = null;
    };
    const handleChange = (tags) => {
        setTags(tags);
    };
    const onChangeInput = (tag) => {
        const validTag = tag.replace(/([^\w-\s]+)|(^\s+)/g, "").replace(/\s+/g, "-");
        setTag(validTag);
    };
    const onDelete = (i) => {
        let deleteSkill = props.jobDetails?.skillsTags_esp.slice(0)
        deleteSkill.splice(i, 1);
        props.updateJobDetails("skillsTags_esp", deleteSkill);
    };
    const onDeleteFR = (i) => {
        let deleteSkill = props.jobDetails?.skillsTags_fr.slice(0)
        deleteSkill.splice(i, 1);
        props.updateJobDetails("skillsTags_fr", deleteSkill);
    };
    const onAddition = (tag) => {
        let tags = { ...tag, "lang_pref": "esp" }
        const addSkill = [].concat(props.jobDetails?.skillsTags_esp, tags)
        var names = props.jobDetails?.skillsTags_esp.map(({ name }) => name)
        if (!names.includes(tag.name)) {
            props.updateJobDetails("skillsTags_esp", addSkill);
        }
        if (props.jobDetails.skillsSuggestions.includes(tag)) {
            props.jobDetails.skillsSuggestions = props.jobDetails.skillsSuggestions.filter(
                (val) => !addSkill.includes(val)
            );
            props.updateJobDetails("skillsSuggestions", props.jobDetails.skillsSuggestions);
        }
    };
    const onAdditionFR = (tag) => {
        let tags = { ...tag, "lang_pref": "fr" }
        const addSkill = [].concat(props.jobDetails?.skillsTags_fr, tags)
        var names = props.jobDetails?.skillsTags_fr.map(({ name }) => name)
        if (!names.includes(tag.name)) {
            props.updateJobDetails("skillsTags_fr", addSkill);
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
    const onchangeJobTemplate = (title) => {
        props.updateJobDetails("title_esp", title);
        props.getJobTemplateData(title);
        setLoader(true);
        if (!visible) {
            setVisible(true);
        }
    };
    const onchangeJobTemplateFR = (title) => {
        props.updateJobDetails("title_fr", title);
        props.getJobTemplateData(title);
        setLoader(true);
        if (!visible) {
            setVisible(true);
        }
    };
    const selectItem = (item) => {
        props.updateJobDetails("title_esp", item.job_title);
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
    const selectItemFR = (item) => {
        props.updateJobDetails("title_fr", item.job_title);
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
    return (
        <div className="col-md-12 px-0">
            <div className="container-fluid pt-3 px-3">
                <div className="row ml-xl-5 ml-lg-2 ml-md-2">
                    <div className="col-md-7">
                        {/* {props.edit == "" && <>
                            <h6 className="">Choose Languages to publish job</h6>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="d-flex">
                                        <p className="mt-1 mr-2">Spanish</p>
                                        <div class="form-group animated form-primary-bg text-left">
                                            <div class="switch checkbox-switch switch-success mt-0">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        id="customspanish"
                                                        className=""
                                                        checked={props.spanishLang1}
                                                        onChange={(e) => { props.editlanguagehandler("spanishText", e.target.checked); props.editlanguagehandler("spanishT", e.target.checked) }}
                                                    />
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                        {props.spanishLang1 &&
                                            <div className="d-flex">
                                                <img
                                                    className="svg-xs pt-1"
                                                    src="/svgs/icons_new/edit-2.svg"
                                                    alt="Details Icon"
                                                    title="Details Icon"
                                                />
                                                <p className="ml-2 text-primary pointer" onClick={() => { setOpenModel(true); props.editlanguagehandler("spanishT", true) }}>Add details</p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="d-flex ">
                                        <p className="mt-1 mr-3">French</p>
                                        <div class="form-group animated form-primary-bg text-left">
                                            <div class="switch checkbox-switch switch-success mt-0">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        id="customspanish"
                                                        className=""
                                                        checked={props.frenchLang1}
                                                        // onChange={(e) => { setFrench(e.target.checked); setSpanish(false); }}
                                                        onChange={(e) => { props.editlanguagehandler("frenchText", e.target.checked); props.editlanguagehandler("frenchT", e.target.checked) }}
                                                    />
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                        {props.frenchLang1 &&
                                            <div className="d-flex" >
                                                <img
                                                    className="svg-xs pt-1"
                                                    src="/svgs/icons_new/edit-2.svg"
                                                    alt="Details Icon"
                                                    title="Details Icon"
                                                />
                                                <p className="ml-2 text-primary pointer" onClick={() => { setOpenFRModel(true); props.editlanguagehandler("frenchT", true) }}>Add details</p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </>} */}
                        <h6 className="mt-4" title="Refers to the steps involved in the recruitment process.">
                            {t(props.language?.layout?.ep_createjob_stages)}
                        </h6>
                        {/* <p className="text-black-50 mt-2">
                            Stages help you organiseorem ipsum dolor sit amet, consectetur{" "}
                        </p> */}
                        <div className="col-md-8 pl-0">
                            {/* <div className="form-group animated mt-n2">
                                <label for="exampleFormControlSelect1" className="form-label-active text-muted">
                                    Select workflow
                                </label>
                                <select className="form-control" onChange={() => setShowStages(!showStages)}>
                                    <option value="" selected>
                                        Default workflow
                                    </option>
                                </select>
                            </div> */}
                            <div>
                                {/* <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                        <p>Stages of your selected workflow</p>
                                    </div>
                                </div> */}
                                <Modal size={"xl"} show={show} onHide={() => setShow(false)}>
                                    <div className="modal-content p-3 pb-5 rounded-0">
                                        <div className="row mb-4 px-2">
                                            <div className="col-md-6 pr-5">
                                                <div class="form-group animated ">
                                                    <label class="form-label-active text-muted">Workflow Name</label>{" "}
                                                    {/* {no_translated} */}
                                                    <input
                                                        class="form-control"
                                                        name="firstname"
                                                        autocomplete="off"
                                                        value="Senior Management Workflow"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 pr-5">
                                                <div class="form-group animated">
                                                    <label class="form-label-active text-muted">Remarks</label>{" "}
                                                    {/* {no_translated} */}
                                                    <input class="form-control" name="lastname" autocomplete="off" />
                                                </div>
                                            </div>
                                        </div>
                                        <h6 className="font-weight-bold ml-5">
                                            {t(props.language?.layout?.ep_createjob_stages)}
                                        </h6>
                                        <p className="ml-5">Customize stages of your selected workflow</p>{" "}
                                        {/* {no_translated} */}
                                        <div className="row px-5">
                                            <div className="col-md-6 pr-5">
                                                <div className="mb-4">
                                                    {items.map((item, idx) => (
                                                        <div
                                                            className="mb-4  "
                                                            key={item}
                                                            onDragOver={() => onDragOver(idx)}>
                                                            <div
                                                                onDragStart={(e) => onDragStart(e, idx)}
                                                                onDragEnd={onDragEnd}
                                                                draggable="true">
                                                                <div className="d-flex">
                                                                    <div className="hoveredCard col-12 px-0">
                                                                        <input
                                                                            type="text"
                                                                            className={`form-control py-4 hoveredCard ${item != stageDisable && stage == true
                                                                                ? "disabled"
                                                                                : ""
                                                                                }`}
                                                                            value={item}
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        className="hideCard d-none py-2 rounded-right"
                                                                        draggable="true"
                                                                        style={{ backgroundColor: "#2275d761" }}>
                                                                        <img
                                                                            src="/svgs/temp/move.svg"
                                                                            alt="move"
                                                                            className="svg-sm mt-2"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="icon-invert d-flex justify-content-end align-items-center"
                                                                    style={{ marginTop: "-2.4rem" }}>
                                                                    <button
                                                                        className={`btn icon-invert btn-sm btn-light ${item != stageDisable && stage == true
                                                                            ? "invisible"
                                                                            : "visible"
                                                                            }`}
                                                                        style={{ zIndex: 1 }}
                                                                        onClick={() => checkStage(item, items)}>
                                                                        <img
                                                                            src="/svgs/temp/assign.svg"
                                                                            className="svg-sm mr-2"
                                                                            alt="assign-action"
                                                                            title="assign-action"
                                                                        />
                                                                        Assign action {/* {no_translated} */}
                                                                    </button>
                                                                    <img
                                                                        src="/svgs/icons_new/edit-2.svg"
                                                                        className={`svg-xs mx-2 pointer ${item != stageDisable && stage == true
                                                                            ? "invisible"
                                                                            : "visible"
                                                                            }`}
                                                                        style={{ zIndex: 1 }}
                                                                        alt="edit"
                                                                        title="edit"
                                                                        onClick={() => {
                                                                            setShowEdit(true);
                                                                            setShowAction(true);
                                                                            setAddStage(false);
                                                                            checkStage(item);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div
                                                    className="mb-2 py-2 text-center"
                                                    style={{ border: "2px dashed lightgrey" }}>
                                                    <button
                                                        className="btn btn-light btn-sm"
                                                        onClick={() => {
                                                            setAddStage(true);
                                                            setShowAction(true);
                                                            setShowEdit(false);
                                                        }}>
                                                        <img
                                                            src="/svgs/temp/addStage.svg"
                                                            alt="addStage"
                                                            className="svg-xs mr-1"
                                                        />
                                                        Add stage
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Assign Action */}
                                            <div
                                                className={`col-md-6 border border-dark rounded mb-2 pl-3 pr-4 ${showAction ? "d-block" : "d-none"
                                                    }`}>
                                                <h5
                                                    className={`font-weight-bold mt-3 ${showEdit || addStage ? "d-none" : "d-block"
                                                        }`}>
                                                    Assign action {/* {no_translated} */}
                                                </h5>
                                                <h5
                                                    className={`font-weight-bold mt-3 ${addStage ? "d-block" : "d-none"
                                                        }`}>
                                                    Add stage {/* {no_translated} */}
                                                </h5>
                                                <div className={`mt-3 ${showEdit ? "d-block" : "d-none"}`}>
                                                    <div className="d-flex justify-content-between">
                                                        <h5 className="font-weight-bold">Edit stage</h5>{" "}
                                                        {/* {no_translated} */}
                                                        <a href="" className="text-muted">
                                                            <img
                                                                src="/svgs/icons/delete.svg"
                                                                alt="delete"
                                                                className="svg-xs mr-1 mb-1"
                                                            />
                                                            Delete this stage {/* {no_translated} */}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="form-group animated">
                                                    <label class="form-label-active text-muted">Stage name</label>{" "}
                                                    {/* {no_translated} */}
                                                    <input
                                                        class="form-control"
                                                        name="firstname"
                                                        autocomplete="off"
                                                        value=""
                                                    />
                                                </div>
                                                <div class="form-group animated">
                                                    <label class="form-label-active text-muted">Stage Group</label>{" "}
                                                    {/* {no_translated} */}
                                                    <input
                                                        class="form-control"
                                                        name="firstname"
                                                        autocomplete="off"
                                                        value=""
                                                    />
                                                    <div className="mt-n4 ml-2 col-6">
                                                        <div className="bg-light">
                                                            Review <span>|</span> {/* {no_translated} */}
                                                            <span className="text-muted ml-3">
                                                                Assign stage group
                                                            </span>{" "}
                                                            {/* {no_translated} */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row" style={{ minHeight: "244px" }}>
                                                    <div class="form-group animated col-md-6">
                                                        <label class="form-label-active text-muted">
                                                            Assign action {/* {no_translated} */}
                                                        </label>
                                                        <input
                                                            class="form-control"
                                                            name="firstname"
                                                            autocomplete="off"
                                                            value=""
                                                        />
                                                        <div className="mt-n4 ml-2 col-11">
                                                            <div className="bg-light">
                                                                Send Email <span>|</span> {/* {no_translated} */}
                                                                <span className="text-muted ml-3">
                                                                    Assign action
                                                                </span>{" "}
                                                                {/* {no_translated} */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group animated col-md-6  disabled">
                                                        <label class="form-label-active text-muted">
                                                            Select template {/* {no_translated} */}
                                                        </label>
                                                        <input
                                                            class="form-control"
                                                            name="firstname"
                                                            autocomplete="off"
                                                            value=""
                                                        />
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-end mt-3">
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setShow(false)}>
                                                        {t(props.language?.layout?.ep_setting_cd_cancel)}
                                                    </button>
                                                    <button
                                                        className={`btn btn-primary ml-3 ${showEdit || addStage ? "d-none" : "d-block"
                                                            }`}>
                                                        Done {/* {no_translated} */}
                                                    </button>
                                                    <button
                                                        className={`btn btn-primary ml-3 ${showEdit ? "d-block" : "d-none"
                                                            }`}>
                                                        {t(props.language?.layout?.ep_setting_password_savechanges)}
                                                    </button>
                                                    <button
                                                        className={`btn btn-primary ml-3 ${addStage ? "d-block" : "d-none"
                                                            }`}>
                                                        Add Stage {/*{no_translated} */}
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Assign Action */}
                                        </div>
                                        <div className="d-flex justify-content-end pr-4">
                                            <button
                                                className={`btn btn-outline-secondary ${showEdit || addStage || showAction ? "d-none" : "d-block"
                                                    }`}
                                                onClick={() => setShow(false)}>
                                                {t(props.language?.layout?.ep_setting_cd_cancel)}
                                            </button>
                                            <button
                                                className={`btn btn-primary ml-3 ${showEdit || addStage || showAction ? "d-none" : "d-block"
                                                    }`}>
                                                Save now {/*{no_translated} */}
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                                <div className="input-boxes input-group-focus">
                                    <input
                                        type="text"
                                        className={"form-control " + (stageSelect ? "bg-white" : "")}
                                        name="Applied"
                                        placeholder={t(props.language?.layout?.js_application_applied)}
                                        onClick={() => stagesSelected("Applied")}
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        className={"form-control my-2 " + (stageSelect ? "bg-white" : "")}
                                        name="Screening"
                                        placeholder={t(props.language?.layout?.js_application_screening)}
                                        onClick={() => stagesSelected("Screening")}
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        className={"form-control " + (stageSelect ? "bg-white" : "")}
                                        name="Interviewed"
                                        placeholder={t(props.language?.layout?.all_interviewd_nt)}
                                        onClick={() => stagesSelected("Interviewed")}
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        className={"form-control my-2 " + (stageSelect ? "bg-white" : "")}
                                        name="offered"
                                        placeholder={t(props.language?.layout?.js_application_offered)}
                                        onClick={() => stagesSelected("Offered")}
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        className={"form-control " + (stageSelect ? "bg-white" : "")}
                                        name="hired"
                                        placeholder={t(props.language?.layout?.js_application_hired)}
                                        onClick={() => stagesSelected("Hired")}
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        className={"form-control my-2 " + (stageSelect ? "bg-white" : "")}
                                        name="reject"
                                        placeholder={t(props.language?.layout?.ep_jobtitle_reject)}
                                        onClick={() => stagesSelected("Reject")}
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        className={"form-control " + (stageSelect ? "bg-white" : "")}
                                        name="onhold"
                                        placeholder={t(props.language?.layout?.ep_jobtitle_onhold)}
                                        onClick={() => stagesSelected("Onhold")}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <h5 className="font-weight-bold mt-4 mb-0">Hiring Team</h5>
                        <div className="form-group animated mt-n2">
                            <label className="form-label-active text-muted" for="job_title">
                                Members
                            </label>
                            <TagsInput
                                value={tags}
                                onChange={handleChange}
                                inputValue={tag}
                                onlyUnique
                                onChangeInput={onChangeInput}
                                inputProps={{ placeholder: "+Add Mem" }}
                            />
                        </div> */}
                        <div className="d-flex justify-content-between align-items-center profile-input-height mt-5 mb-3">
                            <div>
                                <button className="btn btn-light">{t(props.language?.layout?.forgotpass_reset)}</button>
                            </div>
                            <div>
                                <Link
                                    onClick={() => props.prev()}
                                    className="btn btn-outline-primary btn-md px-lg-4 px-md-2 mx-4 mx-md-2">
                                    {t(props.language?.layout?.jobs_previous)}
                                </Link>
                                {props.edit !== "" ? (
                                    <Link
                                        title={t(props.language?.layout?.updatedata_nt)}
                                        onClick={() => {
                                            props.updateJobData("active");
                                        }}
                                        className={`btn btn-outline-primary btn-md px-lg-4 px-md-3 mr-3 ${props.buttonDisabled ? "disabled" : ""
                                            }`}>
                                        {t(props.language?.layout?.all_update_nt)}
                                    </Link>
                                ) : (
                                    <Fragment>
                                        <Link
                                            title={t(props.language?.layout?.savedraft_nt)}
                                            onClick={() => {
                                                props.postData("draft");
                                            }}
                                            className={`btn btn-outline-primary btn-md px-lg-4 px-md-3 mr-3 ${props.buttonDisabled ? "disabled" : ""
                                                }`}>
                                            {t(props.language?.layout?.ep_setting_cd_save)}
                                        </Link>
                                        <Link
                                            title={t(props.language?.layout?.postjob_nt)}
                                            onClick={() => {
                                                props.postData("active");
                                            }}
                                            className={`btn btn-primary btn-md px-lg-4 px-md-2 ${props.buttonDisabled ? "disabled" : ""
                                                }`}>
                                            {t(props.language?.layout?.all_publish_nt)}
                                        </Link>
                                    </Fragment>
                                )}
                            </div>
                        </div>
                        <Modal size={"lg"} show={openModel} onHide={() => setOpenModel(false)} >
                            <div className="mb-4">
                                <div className="modal-content p-3 border-0">
                                    <div className="modal-header border-0 mb-n4">
                                        <button
                                            type="button"
                                            className="close animate-closeicon"
                                            aria-label="Close"
                                            title="Close"
                                            onClick={() => setOpenModel(false)}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="col-md-12 px-3">
                                        <Tabs
                                            defaultActiveKey="spanish"
                                            id="uncontrolled-tab-example"
                                            className="nav-underline-primary">
                                            <Tab
                                                eventKey="spanish"
                                                title="SPANISH"
                                            >
                                                <div className="">
                                                    <div className="">
                                                        <div className="form-group animated mt-n3">
                                                            <label className="form-label-active text-grey" for="job_title">
                                                                {/* {t(props?.language?.layout?.ep_createjob_title)}* */}
                                                                TÃ­tulo del puestoÂ *
                                                            </label>
                                                            <DebounceInput
                                                                className="form-control"
                                                                minLength={2}
                                                                id="job_title"
                                                                debounceTimeout={500}
                                                                value={props.jobDetails.title_esp}
                                                                onChange={(event) => onchangeJobTemplate(event.target.value)}
                                                            />

                                                            {/* <div
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
                                                            </div> */}
                                                            {/* {loader ? (
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
                                                            )} */}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="form-label-active" for="job_title">
                                                            <h5 className="font-weight-bold mt-4">
                                                                {/* {t(props?.language?.layout?.ep_createjob_description)}* */}
                                                                DescripciÃ³n del empleo *
                                                            </h5>
                                                        </label>
                                                    </div>
                                                    <ReactQuill
                                                        value={
                                                            props.jobDetails.description_esp
                                                        }
                                                        onChange={onchange}
                                                        param={selectedItem ?
                                                            "jobTemplateDescription"
                                                            : "description_esp"}
                                                    />
                                                    <div className="">
                                                        <div className="form-group animated">
                                                            <label className="form-label-active text-grey z-index4" for="job_title">
                                                                {/* {t(props?.language?.layout?.js_profile_skills)} */}
                                                                Habilidades
                                                            </label>
                                                            <div role="link">
                                                                <ReactTags
                                                                    ref={reactTags}
                                                                    tags={props.jobDetails?.skillsTags_esp}
                                                                    suggestions={props.jobDetails.skillsSuggestions}
                                                                    onDelete={onDelete}
                                                                    onAddition={onAddition}
                                                                    onInput={onInput}
                                                                    allowNew
                                                                    placeholderText="Agregar habilidadesÂ "
                                                                    minQueryLength={0}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab>
                                        </Tabs>
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-primary mt-3" onClick={() => setOpenModel(false)}>{t(props.language?.layout?.savennext_nt)}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        <Modal size={"lg"} show={openFRModel} onHide={() => setOpenFRModel(false)} >
                            <div className="mb-4">
                                <div className="modal-content p-3 border-0">
                                    <div className="modal-header border-0 mb-n4">
                                        <button
                                            type="button"
                                            className="close animate-closeicon"
                                            aria-label="Close"
                                            title="Close"
                                            onClick={() => setOpenFRModel(false)}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="col-md-12 px-3">
                                        <Tabs
                                            defaultActiveKey="french"
                                            id="uncontrolled-tab-example"
                                            className="nav-underline-primary">
                                            <Tab
                                                eventKey="french"
                                                title="FRENCH"
                                            >
                                                <div className="">
                                                    <div className="">
                                                        <div className="form-group animated mt-n3">
                                                            <label className="form-label-active text-grey" for="job_title">
                                                                {/* {t(props?.language?.layout?.ep_createjob_title)}* */}
                                                                Titre du poste *
                                                            </label>

                                                            <DebounceInput
                                                                className="form-control"
                                                                minLength={2}
                                                                id="job_title"
                                                                debounceTimeout={500}
                                                                value={props.jobDetails.title_fr}
                                                                onChange={(event) => onchangeJobTemplateFR(event.target.value)}
                                                            />

                                                            {/* <div
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
                                                                                    onClick={() => selectItemFR(item)}
                                                                                    className="dropdown_item sidebar-heading">
                                                                                    <div className="item_text1">{item.job_title}</div>
                                                                                </li>
                                                                            ))}
                                                                    </ul>
                                                                )} */}
                                                            {/* </div>
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
                                                            )} */}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="form-label-active" for="job_title">
                                                            <h5 className="font-weight-bold mt-4">
                                                                {/* {t(props?.language?.layout?.ep_createjob_description)}* */}
                                                                Description de l'emploi *
                                                            </h5>
                                                        </label>
                                                    </div>
                                                    <ReactQuill
                                                        value={
                                                            selectedItem
                                                                ?
                                                                props.jobDetails.jobTemplateDescription
                                                                : props.jobDetails.description_fr
                                                        }
                                                        onChange={onchangeFR}
                                                        param={selectedItem ?
                                                            "jobTemplateDescription"
                                                            : "description_fr"}
                                                    />
                                                    <div className="">
                                                        <div className="form-group animated">
                                                            <label className="form-label-active text-grey z-index4" for="job_title">
                                                                {/* {t(props?.language?.layout?.js_profile_skills)} */}
                                                                compÃ©tences
                                                            </label>
                                                            <div role="link">
                                                                <ReactTags
                                                                    ref={reactTags}
                                                                    tags={props.jobDetails?.skillsTags_fr}
                                                                    suggestions={props.jobDetails.skillsSuggestions}
                                                                    onDelete={onDeleteFR}
                                                                    onAddition={onAdditionFR}
                                                                    onInput={onInput}
                                                                    allowNew
                                                                    placeholderText="Ajouter des compÃ©tences  "
                                                                    minQueryLength={0}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab>
                                        </Tabs>
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-primary mt-3" onClick={() => setOpenFRModel(false)}>{t(props.language?.layout?.savennext_nt)}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
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
        </div>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps, {})(WorkFLow);