import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Spinner from "../partials/spinner.jsx";
import { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getQueryParameters, getQueryString } from "../modules/helpers.jsx";
import { useHistory } from "react-router-dom";
import LocationSearchInput from "../common/locations.jsx";
import { _advanceSearchData } from "../actions/actionsAuth.jsx";
import { toast } from "react-toastify";
import DatePicker, { setDefaultLocale } from "react-datepicker";
import "react-datepicker/src/stylesheets/datepicker.scss";
import Modal from "react-bootstrap/Modal";
import { Multiselect } from "multiselect-react-dropdown";
import format from "date-fns/format";

const AdvancedSearch = (props) => {
    const locationsJSON = {
        country: false,
        state: false,
        city: true,
    };
    const history = useHistory();
    const filter_default = {
        title: false,
        title_skill: false,
        summary: false,
        resume: true,
        any: null,
        must: null,
        exclude: null,
        exp_min: null,
        exp_max: null,
        salary_min: null,
        salary_max: null,
        currency: null,
        salary_type: null,
        current_loc: null,
        preferr_loc: null,
        employer: null,
        is_current: null,
        ex_employer: null,
        ex_current: null,
        designation: null,
        current_desg: null,
        ug_qual: null,
        ug_institute: null,
        ug_pass_from: null,
        ug_pass_to: null,
        pg_qual: null,
        pg_institute: null,
        pg_pass_from: null,
        pg_pass_to: null,
        verified_mobile: null,
        verified_email: null,
        linkedin: null,
        resume_file: null,
        available_now: null,
        available_from: null,
        job_type: null,
        active_in: null,
        industry: null
    };
    const [searchData, setSearchData] = useState(props.location.state ? JSON.parse(props.location.state) : "");
    const [params, setParams] = useState(searchData.params)
    const [basicDetails, setBasicDetails] = useState(true);
    const [employDetails, setEmployDetails] = useState(false);
    const [educDetails, setEducDetails] = useState(false);
    const [additDetails, setAdditDetails] = useState(false);
    const [displayDetails, setDisplayDetails] = useState(false);
    const [available, setAvailable] = useState(false);
    const [filter, setFilter] = useState(params ? params : filter_default);
    const [pgQalification, setPgQalification] = useState([]);
    const [ugQalification, setUgQalification] = useState([]);
    const [industrys, setIndustries] = useState([]);
    const [preferedIndustries, setPrefered] = useState([]);
    // const [confirmModel, setConfirmModel] = useState(false);
    // const [yesButton, setYesButton] = useState(false);
    const [values, setValues] = useState({
        name: "",
        visibility: "",
    });

    useEffect(() => {
        educationList();
        industriesList();
    }, []);

    const educationList = () => {
        axios
            .get("/api/v1/resume/education/dataset", { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } })
            .then((response) => {
                setPgQalification(response.data.data.pg_qualification);
                setUgQalification(response.data.data.ug_qualification)

            })
            .catch((error) => {

            });
    };

    const industriesList = () => {
        axios.get("/api/v1/profilesetting", {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                setIndustries(response.data.data.industries);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onSelect = (selectedList, selectedItem) => {
        let prefIds = [...preferedIndustries, selectedItem];
        setPrefered(prefIds);
        setFilter({ ...filter, industry: prefIds.map(t => t.name) })
    };
    const onRemove = (selectedList, selectedItem) => {
        let filteredArray = preferedIndustries.filter((item) => item.id !== selectedItem.id);
        setPrefered(filteredArray);
        setFilter({ ...filter, industry: filteredArray.map(t => t.name) })
    }


    const removeEmpty = (obj) => {
        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v != ""));
    };

    const loadInitial = () => {
        let url_params = getQueryParameters(history.location.search);
        let filter_params = Object.assign({}, filter, url_params);
        let final_filters = removeEmpty(filter_params);
        let query_string = getQueryString(final_filters);
        setFilter(final_filters);
        SearchHandler(query_string);
    };

    const SearchHandler = (query_string) => {
        // if (!query_string.length) {
        //     toast.error("Please enter atleast one feild");
        //     return;
        // }
        let endPoint;
        endPoint = props.user.role_id === null ?
            "api/v1/admin/alljobseeker?" : "/api/v1/recruiter/candidates?";
        axios
            .get(endPoint + query_string, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } })
            .then((response) => {
                let obj = {
                    advanceSearchResults: response.data.data,
                    searchName: values.name
                }
                props._advanceSearchData(obj);
                // console.log(props.advanceSearchResults);
                if (response.data.data == 0) {
                    toast.error("No search results found");
                    return;
                }
                window.location.href = "/jobSeekers"
            })
            .catch((error) => {
                if (error) {
                    toast.error("Something went wrong");
                }
            });
    };

    const saveSearch = () => {
        let formData = new FormData();
        formData.append("name", props.location.editSearch ? searchData.name : values.name);
        formData.append("params", JSON.stringify(removeEmpty(filter)));
        formData.append("visibility", props.location.editSearch ? searchData.visibility : values.visibility);
        // formData.append("save_new", key == "save_new" ? 1 : 0);
        axios
            .post(`/api/v1/jobseeker/search/param`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
            })
            .then((response) => {
                // key == "save_new" ? "" : loadInitial()
                loadInitial();
            })
            .catch((err) => {
                if (err) {
                    // setConfirmModel(true);
                }
            });
    };

    // const overrideSavedSearch = (key) => {
    //     let formData = new FormData();
    //     formData.append("name", props.location.editSearch ? searchData.name : values.name);
    //     formData.append("params", JSON.stringify(removeEmpty(filter)));
    //     formData.append("visibility", props.location.editSearch ? searchData.visibility : values.visibility);
    //     formData.append("save_new", key == "save_new" ? 1 : 0);
    //     axios
    //         .put(`/api/v1/jobseeker/search/param`, formData, {
    //             headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
    //         })
    //         .then((response) => {
    //             setConfirmModel(false);
    //         })
    //         .catch((err) => {
    //             if (err) {
    //                 toast.error("Something went wrong.")
    //             }
    //         });
    // };

    // const validateSaveSearch = (key) => {
    //     if (props.location.editSearch ? !searchData.name : !values.name) {
    //         toast.error("Please enter search name.");
    //         return;
    //     }
    //     saveSearch(key);
    // }

    // const setSearchLocation = (location, placeid) => {
    //     let locationValue = location.split(",");
    //     setFilter({ ...filter, location: locationValue[0], state: locationValue[1] });
    // };

    const ClearLocationHander = (value) => {
        if (value.length == 0 && (filter.location !== undefined || filter.location == "")) {
            setFilter({ ...filter, location: "" });
        }
    };

    const search = () => {
        if (filter.ug_pass_from > filter.ug_pass_to) {
            toast.error("Year of completion From should be less than To");
            return;
        }
        if (filter.pg_pass_from > filter.pg_pass_to) {
            toast.error("Year of completion From should be less than To");
            return;
        }
        if (props.location.editSearch ? !searchData.name : !values.name) {
            toast.error("Please enter search name.");
            return;
        }
        saveSearch();
    }

    const updateData = (e) => {
        props.location.editSearch ? setSearchData({ ...searchData, [e.target.name]: e.target.value })
            : setValues({ ...values, [e.target.name]: e.target.value })
    }

    const preferredLocationChange = (value) => {
        setFilter({ ...filter, preferr_loc: value });
    }

    const currentLocationChange = (value) => {
        setFilter({ ...filter, current_loc: value });
    }

    const setPreferredLoc = (data, city, locationCity, plcaeId) => {
        let location = {};
        location.city = city[0];
        location.state = city[1];
        location.country = city[2];
        setFilter({ ...filter, preferr_loc: city[0] });
    };
    const setCurrentLoc = (data, city, locationCity, plcaeId) => {
        let location = {};
        location.city = city[0];
        location.state = city[1];
        location.country = city[2];
        setFilter({ ...filter, current_loc: city[0] });
    };

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
    };

    const deleteSearchName = () => {
        axios
            .delete(`/api/v1/jobseeker/search/delete/${searchData.name}`, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } })
            .then((response) => {
                if (response.status == 200) {
                    toast.success("Search name deleted successfully.")
                    setTimeout(() => (window.location.href = "/jobSeekers"), 4000);
                }
            })
            .catch((error) => {
                if (error) {
                    toast.error("Something went wrong");
                }
            });
    };

    const availableFrom = (date) => {
        setFilter({ ...filter, available_from: format(date, "yyyy-MM-dd") })
    }
    
    const handleCalendar = (status) => {
      setAvailable(status)
      !status &&  setFilter({ ...filter, available_from: null })
    }

    return (
        <div className="col-md-10 px-0">
            <div className="d-flex">
                <div className="container-fluid">
                    <div className="d-md-flex pt-4 px-2 gray-100 h-7rem">
                        <div className="col-md-6 p-0">
                            <h4 className="mb-0">
                                <Link aria-labelledby='All Job Seekers' to="/jobSeekers" className="text-muted">
                                    All Job Seekers
                                </Link>
                                <img
                                    className="svg-sm mx-1"
                                    src="svgs/icons_new/chevron-right.svg"
                                    title="Arrow"
                                    alt="Arrow Icon"
                                />
                                <span className="text-capitalize">Advanced Search</span>
                            </h4>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-lg-10 px-3">
                            <h4 className="mb-3">Advanced Search</h4>

                            {/* Basic Details */}
                            {/* <div className="d-md-flex justify-content-between align-items-center bg-light p-2">
                                    <h6 className="font-weight-bold my-0">Basic Details</h6>
                                    <img
                                        src={
                                            basicDetails
                                                ? "svgs/icons_new/chevron-circle-up.svg"
                                                : "svgs/icons_new/chevron-circle-down.svg"
                                        }
                                        onClick={() => setBasicDetails(!basicDetails)}
                                        className="svg-xs"
                                    />
                                </div> */}
                            {basicDetails ?
                                <div className="basic-details">
                                    <div className="border rounded p-4 my-4">
                                        <h6 className="text-muted pb-2">Keyword Search</h6>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Any Keyword</label>
                                            <div className="col-md-5">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="any_keyword"
                                                    name="any_keyword"
                                                    value={filter.any}
                                                    onChange={(e) => setFilter({ ...filter, any: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">All of these (must have)</label>
                                            <div className="col-md-5">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="allofthese"
                                                    name="allofthese"
                                                    value={filter.must}
                                                    onChange={(e) => setFilter({ ...filter, must: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Exclude Keyword</label>
                                            <div className="col-md-5">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="exclude_keyword"
                                                    name="exclude_keyword"
                                                    value={filter.exclude}
                                                    onChange={(e) => setFilter({ ...filter, exclude: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        {/* <div className="row align-items-top form-group">
                                                <label className="col-md-3">Search On:</label>
                                                <div className="col-md-9">
                                                    <div class="form-check-inline">
                                                        <label class="form-check-label">
                                                            <input type="radio" class="form-check-input mr-1" name="title" checked={filter.title ? true : false} onChange={(e) => setFilter({ ...filter, title: e.target.checked, title_skill: false, summary: false, resume: false })} />Resume Title
                                                        </label>
                                                    </div>
                                                    <div class="form-check-inline">
                                                        <label class="form-check-label">
                                                            <input type="radio" class="form-check-input mr-1" name="skills" checked={filter.title_skill ? true : false} onChange={(e) => setFilter({ ...filter, title_skill: e.target.checked, summary: false, resume: false, title: false })} />Resume Title &amp; <br /> <span className="pl-3">Skills</span>
                                                        </label>
                                                    </div>
                                                    <div class="form-check-inline">
                                                        <label class="form-check-label">
                                                            <input type="radio" class="form-check-input mr-1" name="summary" checked={filter.summary ? true : false} onChange={(e) => setFilter({ ...filter, summary: e.target.checked, resume: false, title: false, title_skill: false  })} />Resume Summary
                                                        </label>
                                                    </div>
                                                    <div class="form-check-inline">
                                                        <label class="form-check-label">
                                                            <input type="radio" class="form-check-input mr-1" name="resume" checked={filter.resume ? true : false} onChange={(e) => setFilter({ ...filter, resume: e.target.checked, title: false, title_skill:false, summary:false })} />Entire Resume
                                                        </label>
                                                    </div>
                                                </div>
                                            </div> */}
                                    </div>
                                    <div className="px-4 pt-2">
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Total Experience</label>
                                            <div className="col-md-auto select-box-width">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="tot_exp"
                                                    name="tot_exp"
                                                    value={filter.exp_min}
                                                    onChange={(e) => setFilter({ ...filter, exp_min: e.target.value })}
                                                />
                                            </div>
                                            <div className="mx-2">to</div>
                                            <div className="col-md-auto select-box-width">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="tot_exp1"
                                                    name="tot_exp1"
                                                    value={filter.exp_max}
                                                    onChange={(e) => setFilter({ ...filter, exp_max: e.target.value })}
                                                />
                                            </div>
                                            <div>(in years)</div>
                                        </div>
                                        {/* <div className="row align-items-end form-group">
                                                <label className="col-md-3">Expected Salary</label>
                                                <div className="col-md-auto select-box-width">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="expect_salary"
                                                        name="expect_salary"
                                                        value={filter.salary_min}
                                                        onChange={(e) => setFilter({ ...filter, salary_min: e.target.value })}
                                                    />
                                                </div>
                                                <div className="mx-2">to</div>
                                                <div className="col-md-auto select-box-width">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="expect_salary1"
                                                        name="expect_salary1"
                                                        value={filter.salary_max}
                                                        onChange={(e) => setFilter({ ...filter, salary_max: e.target.value })}
                                                    />
                                                </div>
                                                <div>(in USD)</div>
                                            </div>
                                            <div className="row align-items-end form-group">
                                                <label className="col-md-3">Current Location</label>
                                                <div className="col-md-5">
                                                    <LocationSearchInput
                                                        setLocationCity={setCurrentLoc}
                                                        locationsJSON={locationsJSON}
                                                        clearLocationHander={ClearLocationHander}
                                                        setLocation={setLocation}
                                                        // initialLocation={filter.current_loc}
                                                        displayValue={true}
                                                        value={filter.current_loc}
                                                        isLocation={props.location.isLocation}
                                                        locationChange={currentLocationChange}
                                                    />
                                                </div>
                                            </div> */}
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Preferred Location</label>
                                            <div className="col-md-5">
                                                <LocationSearchInput
                                                    setLocationCity={setPreferredLoc}
                                                    locationsJSON={locationsJSON}
                                                    clearLocationHander={ClearLocationHander}
                                                    setLocation={setLocation}
                                                    // initialLocation={filter.preferr_loc}
                                                    displayValue={true}
                                                    value={filter.preferr_loc}
                                                    isLocation={props.location.isLocation}
                                                    locationChange={preferredLocationChange}
                                                />
                                                {/* <input
                                                type="text"
                                                className="form-control"
                                                id="preferred_location"
                                                name="preferred_location"
                                            /> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null}

                            {/* Employment Details */}
                            {/* <div className="d-md-flex justify-content-between align-items-center bg-light p-2 my-4">
                                    <h6 className="font-weight-bold my-0">Employment Details</h6>
                                    <img
                                        src={
                                            employDetails
                                                ? "svgs/icons_new/chevron-circle-up.svg"
                                                : "svgs/icons_new/chevron-circle-down.svg"
                                        }
                                        onClick={() => setEmployDetails(!employDetails)}
                                        className="svg-xs"
                                    />
                                </div>
                                {employDetails ?
                                    <div className="employ-details px-4">
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Job Role</label>
                                            <div className="col-md-5">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="job_role"
                                                    name="job_role"
                                                />
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Industry</label>
                                            <div className="col-md-5">
                                                <Multiselect
                                                    id="multiselectsetting"
                                                    options={industrys}
                                                    selectedValues={preferedIndustries}
                                                    selectionLimit="3"
                                                    displayValue={"name"}
                                                    onSelect={onSelect}
                                                    onRemove={onRemove}
                                                    avoidHighlightFirstOption={true}
                                                    showArrow={true}
                                                    placeholder={preferedIndustries.length < 3 ? "Select industry" : " "}
                                                />
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Employers</label>
                                            <div className="col-md-5">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="employers"
                                                    name="employers"
                                                    value={filter.employer}
                                                    onChange={(e) => setFilter({ ...filter, employer: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <select
                                                    value={filter.is_current}
                                                    onChange={(e) => setFilter({ ...filter, is_current: e.target.value })}
                                                    className="form-control px-1"
                                                    name="is_current">
                                                    <option value="">Current/Previous</option>
                                                    <option value="true">Current Employer</option>
                                                    <option value="false">Previous Employer</option>
                                                </select>
                                            </div>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-control"
                                                    name="all_words">
                                                    <option value="">All words</option>
                                                    <option value="">Any of the words</option>
                                                    <option value="">Exact phrase</option>
                                                    <option value="">Boolean</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Exclude Employers</label>
                                            <div className="col-md-5">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="exclude_employers"
                                                    name="exclude_employers"
                                                    value={filter.ex_employer}
                                                    onChange={(e) => setFilter({ ...filter, ex_employer: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <select
                                                    value={filter.ex_current}
                                                    onChange={(e) => setFilter({ ...filter, ex_current: e.target.value })}
                                                    className="form-control px-1"
                                                    name="ex_current">
                                                    <option value="">Current/Previous</option>
                                                    <option value="true">Current Employer</option>
                                                    <option value="false">Previous Employer</option>
                                                </select>
                                            </div>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-control"
                                                    name="all_words1">
                                                    <option value="">All words</option>
                                                    <option value="">Any of the words</option>
                                                    <option value="">Exact phrase</option>
                                                    <option value="">Boolean</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Designation</label>
                                            <div className="col-md-5">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="designation"
                                                    name="designation"
                                                    value={filter.designation}
                                                    onChange={(e) => setFilter({ ...filter, designation: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <select
                                                    value={filter.current_desg}
                                                    onChange={(e) => setFilter({ ...filter, current_desg: e.target.value })}
                                                    className="form-control px-1"
                                                    name="current_desg">
                                                    <option value="">Current/Previous</option>
                                                    <option value="true">Current Employer</option>
                                                    <option value="false">Previous Employer</option>
                                                </select>
                                            </div>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-control"
                                                    id="all_words2">
                                                    <option value="">All words</option>
                                                    <option value="">Any of the words</option>
                                                    <option value="">Exact phrase</option>
                                                    <option value="">Boolean</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    : null} */}

                            {/* Education Details */}
                            {/* <div className="d-md-flex justify-content-between align-items-center bg-light p-2 my-4">
                                    <h6 className="font-weight-bold my-0">Education Details</h6>
                                    <img
                                        src={
                                            educDetails
                                                ? "svgs/icons_new/chevron-circle-up.svg"
                                                : "svgs/icons_new/chevron-circle-down.svg"
                                        }
                                        onClick={() => setEducDetails(!educDetails)}
                                        className="svg-xs"
                                    />
                                </div> */}
                            {!educDetails ?
                                <div className="education-details px-4">
                                    <div className="row align-items-end form-group">
                                        <label className="col-md-3">Highest Qualification</label>
                                        <div className="col-md-5">
                                            <select
                                                value={filter.ug_qual}
                                                onChange={(e) => setFilter({ ...filter, ug_qual: e.target.value })}
                                                className="form-control"
                                                name="ug_qualification">
                                                <option value="" disabled selected className="d-none">Select Qualification</option>
                                                {ugQalification.map((item) => (
                                                    (item.degree != null || item.sov_degreemajor != null) &&
                                                    <option value={item.degree + " " + item.sov_degreemajor}>{item.degree == null ? item.sov_degreemajor : item.sov_degreemajor == null ? item.degree : item.degree + " - " + item.sov_degreemajor}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* <div className="row align-items-end form-group">
                                            <label className="col-md-3">Institute Name</label>
                                            <div className="col-md-5">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="institute_name"
                                                    name="institute_name"
                                                    value={filter.ug_institute}
                                                    onChange={(e) => setFilter({ ...filter, ug_institute: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-control"
                                                    name="all_words3">
                                                    <option value="">All words</option>
                                                    <option value="">Any of the words</option>
                                                    <option value="">Exact phrase</option>
                                                    <option value="">Boolean</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Education Type</label>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-control"
                                                    name="education">
                                                    <option>Full-time</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Year of Completion</label>
                                            <div className="pl-2">Between:</div>
                                            <div className="ml-2 select-box-width">
                                                <DatePicker
                                                    selected={filter.ug_pass_from}
                                                    locale='en'
                                                    className="form-control"
                                                    onChange={(date) => setFilter({ ...filter, ug_pass_from: date })}
                                                    dateFormat="yyyy"
                                                    showYearPicker
                                                    placeholderText="From"
                                                />
                                            </div>
                                            <div className="mx-2">and</div>
                                            <div className="ml-2 select-box-width">
                                                <DatePicker
                                                    selected={filter.ug_pass_to}
                                                    locale='en'
                                                    className="form-control"
                                                    onChange={(date) => setFilter({ ...filter, ug_pass_to: date })}
                                                    dateFormat="yyyy"
                                                    showYearPicker
                                                    placeholderText="To"
                                                />
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">PG Qualification</label>
                                            <div className="col-md-5">
                                                <select
                                                    value={filter.pg_qual}
                                                    onChange={(e) => setFilter({ ...filter, pg_qual: e.target.value })}
                                                    className="form-control"
                                                    name="pg_qualification">
                                                    <option value="" disabled selected className="d-none">PG Qualification - Specialization</option>
                                                    {pgQalification.map((item) => (
                                                        (item.degree != null || item.sov_degreemajor != null) &&
                                                        <option value={item.degree + " " + item.sov_degreemajor}>{item.degree == null ? item.sov_degreemajor : item.sov_degreemajor == null ? item.degree : item.degree + " - " + item.sov_degreemajor}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Institute Name</label>
                                            <div className="col-md-5">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="institute_name"
                                                    name="institute_name"
                                                    value={filter.pg_institute}
                                                    onChange={(e) => setFilter({ ...filter, pg_institute: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-control"
                                                    name="all_words4">
                                                    <option value="">All words</option>
                                                    <option value="">Any of the words</option>
                                                    <option value="">Exact phrase</option>
                                                    <option value="">Boolean</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Education Type</label>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-control"
                                                    name="education_type">
                                                    <option value="full time">Full-time</option>
                                                    <option value="part time">Part-time</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Year of Completion</label>
                                            <div className="pl-2">Between:</div>
                                            <div className="ml-2 select-box-width">
                                                <DatePicker
                                                    selected={filter.pg_pass_from}
                                                    locale='en'
                                                    className="form-control"
                                                    onChange={(date) => setFilter({ ...filter, pg_pass_from: date })}
                                                    dateFormat="yyyy"
                                                    showYearPicker
                                                    placeholderText="From"
                                                />
                                            </div>
                                            <div className="mx-2">and</div>
                                            <div className="ml-2 select-box-width">
                                                <DatePicker
                                                    selected={filter.pg_pass_to}
                                                    locale='en'
                                                    className="form-control"
                                                    onChange={(date) => setFilter({ ...filter, pg_pass_to: date })}
                                                    dateFormat="yyyy"
                                                    showYearPicker
                                                    placeholderText="To"
                                                />
                                            </div>
                                        </div>
                                        <a className="my-2 text-dark">+ ph.D / Doctorate Qualification</a> */}
                                </div>
                                : null}

                            {/* Additional Details */}
                            {/* <div className="d-md-flex justify-content-between align-items-center bg-light p-2 my-4">
                                    <h6 className="font-weight-bold my-0">Additional Details</h6>
                                    <img
                                        src={
                                            additDetails
                                                ? "svgs/icons_new/chevron-circle-up.svg"
                                                : "svgs/icons_new/chevron-circle-down.svg"
                                        }
                                        onClick={() => setAdditDetails(!additDetails)}
                                        className="svg-xs"
                                    />
                                </div>
                                {additDetails ?
                                    <div className="additional-details px-4">
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Work Permit For</label>
                                             <div className="col-md-2 mr-3">
                                                <select
                                                    className="form-control"
                                                    name="work">
                                                    <option>USA</option>
                                                </select>
                                            </div>
                                            <div className="col-md-2 ml-3">
                                                <select
                                                    className="form-control px-1"
                                                    name="other_countries">
                                                    <option>Other Countries</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    : null} */}

                            {/* Display Details */}
                            {/* <div className="d-md-flex justify-content-between align-items-center bg-light p-2 my-4">
                                    <h6 className="font-weight-bold my-0">Display Details</h6>
                                    <img
                                        src={
                                            displayDetails
                                                ? "svgs/icons_new/chevron-circle-up.svg"
                                                : "svgs/icons_new/chevron-circle-down.svg"
                                        }
                                        onClick={() => setDisplayDetails(!displayDetails)}
                                        className="svg-xs"
                                    />
                                </div> */}
                            {!displayDetails ?
                                <div className="display-details px-4">
                                    {/* <div className="row align-items-end form-group">
                                            <label className="col-md-3 mb-0">Show only candidates with:</label>
                                            <div className="col-md-2">
                                                <label class="form-check-label ml-3 pl-1">
                                                    <input type="checkbox" class="form-check-input" name="verified_phone" checked={filter.verified_mobile? true : false}
                                                        onChange={(e) => setFilter({ ...filter, verified_mobile: e.target.checked })} />Verified Phone
                                                </label>
                                            </div>
                                            <div className="col-md-2">
                                                <label class="form-check-label ml-3 pl-1">
                                                    <input type="checkbox" class="form-check-input" name="verified_email" checked={filter.verified_email? true : false}
                                                        onChange={(e) => setFilter({ ...filter, verified_email: e.target.checked })} />Verified Email
                                                </label>
                                            </div>
                                            <div className="col-md-2">
                                                <label class="form-check-label ml-3 pl-1">
                                                    <input type="checkbox" class="form-check-input" name="linkedURL" checked={filter.linkedin? true : false}
                                                        onChange={(e) => setFilter({ ...filter, linkedin: e.target.checked })} />Linkedin URL
                                                </label>
                                            </div>
                                            <div className="col-md-2">
                                                <label class="form-check-label ml-3 pl-1">
                                                    <input type="checkbox" class="form-check-input" name="attached_resume" checked={filter.resume_file? true : false}
                                                        onChange={(e) => setFilter({ ...filter, resume_file: e.target.checked })} />Attached resume
                                                </label>
                                            </div>
                                        </div> */}
                                    <div className="row align-items-end form-group">
                                        <label className="col-md-3 mb-0">Availability</label>
                                        <div className="col-md-2">
                                            <label class="form-check-label ml-3 pl-1">
                                                <input type="checkbox" class="form-check-input" name="ready_to_work" checked={filter.available_now ? true : false}
                                                    onChange={(e) => setFilter({ ...filter, available_now: e.target.checked })} />Ready to work now
                                            </label>
                                        </div>
                                        <div className="col-md-auto">
                                            <label class="form-check-label ml-3 pl-1">
                                                <input type="checkbox" class="form-check-input" name="available" checked={available ? true : false}
                                                    onChange={(e) => handleCalendar(e.target.checked)} />Available
                                            </label>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group animated">
                                                {available &&
                                                    <DatePicker
                                                        className="form-control"
                                                        selected={filter.available_from ? new Date(filter.available_from) : null}
                                                        onChange={(value) => availableFrom(value)}
                                                        placeholderText="MM/DD/YYYY"
                                                        minDate={new Date()} />}
                                                {/* <select
                                                value={filter.available_from}
                                                onChange={(e) => setFilter({ ...filter, available_from: e.target.value })}
                                                className="form-control"
                                                name="from">
                                                <option>From</option>
                                            </select> */}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="row align-items-end form-group">
                                            <label className="col-md-3">Show candidates seeking</label>
                                            <div className="col-md-2">
                                                <select
                                                    value={filter.job_type}
                                                    onChange={(e) => setFilter({ ...filter, job_type: e.target.value })}
                                                    className="form-control"
                                                    name="candidates_seeking">
                                                    <option selected disabled className="d-none">Job Type</option>
                                                    <option value="Full time">Full time</option>
                                                    <option value="Part time">Part time</option>
                                                    <option value="temporary">temporary</option>
                                                    <option value="contract">contract</option>
                                                    <option value="apprenticeship">apprenticeship</option>
                                                    <option value="internship">internship</option>
                                                    <option value="Contingent">Contingent</option>
                                                    <option value="other">other</option>
                                                </select>
                                            </div>
                                        </div> */}
                                    <div className="row align-items-end form-group">
                                        <label className="col-md-3">Active in</label>
                                        <div className="col-md-2">
                                            <select
                                                value={filter.active_in}
                                                onChange={(e) => setFilter({ ...filter, active_in: e.target.value })}
                                                className="form-control"
                                                name="ActiveIn">
                                                <option value="180">6 Months</option>
                                                <option value="1">1 day</option>
                                                <option value="7">7 days</option>
                                                <option value="15">15 days</option>
                                                <option value="30">1 month</option>
                                                <option value="60">2 months</option>
                                                <option value="90">3 months</option>
                                                <option value="365">12 Months</option>
                                                <option value="">All profiles</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* <div className="row align-items-end form-group">
                                            <label className="col-md-3">Profiles per Page</label>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-control"
                                                    name="Pages">
                                                    <option value="50">50</option>
                                                    <option value="10">10</option>
                                                    <option value="20">20</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row align-items-end form-group">
                                            <label className="col-md-3">Sort By</label>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-control"
                                                    name="sortby">
                                                    <option>Relevance</option>
                                                    <option>Profile Freshness</option>
                                                    <option>Last Active Date</option>
                                                </select>
                                            </div>
                                        </div> */}
                                </div>
                                : null}

                            {/* Search Name */}
                            <div className="search-name pl-3">
                                <h6 className="font-weight-bold px-2">Search Name</h6>
                                <div className="row align-items-end form-group px-2 py-3">
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={searchData.name ? searchData.name : values.name}
                                            onChange={(e) => updateData(e)}
                                        />
                                    </div>
                                    {/* <label className="col-md-auto">Visibility</label>
                                        <div className="col-md-5">
                                            <select
                                                value={searchData.visibility ? searchData.visibility : values.visibility}
                                                onChange={(e) => updateData(e)}
                                                className="form-control"
                                                name="visibility">
                                                <option value="private">Private (Only creater can see this filter)</option>
                                                <option value="public">Shared (All users in the company can see the filter)</option>
                                            </select>
                                        </div> */}
                                </div>
                            </div>

                            {/* Butttons */}
                            <div className="d-md-flex my-5">
                                <div className="col-md-3">
                                    {props.location.editSearch &&
                                        <button className="btn btn-outline-danger px-5" onClick={deleteSearchName}>
                                            Delete
                                        </button>}
                                </div>
                                <div className="col-md-9 text-right">
                                    <Link className="btn btn-outline-primary px-5" to="/jobSeekers"> Cancel</Link>
                                    {/* <button className="btn btn-outline-primary px-5 mx-3" onClick={() => {validateSaveSearch("save_new"); setYesButton(true);}}>
                                        Save as new
                                    </button> */}
                                    <button className="btn btn-outline-primary px-5 mx-3" onClick={() => search()}>
                                        Save &amp; Search
                                    </button>
                                    <button className="btn btn-primary px-5" onClick={() => loadInitial()}>
                                        Search
                                    </button>
                                </div>
                            </div>
                            {/* <Modal size="lg" show={confirmModel} onHide={() => setConfirmModel(false)} centered>
                                <div className="modal-content pt-1">
                                    <div className="modal-header border-0 px-4">
                                        <button
                                            type="button"
                                            className="close animate-closeicon"
                                            aria-label="Close"
                                            title="Close"
                                            onClick={() => setConfirmModel(false)}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body text-center px-4">
                                        <h5>Search name is already exist, do you want to replace search values?</h5>
                                        <div className="text-center my-3">
                                            <button className="btn btn-outline-primary mr-3" onClick={() => setConfirmModel(false)}>No</button>
                                            {yesButton ? <button className="btn btn-primary" onClick={() => {overrideSavedSearch("save_new"); setYesButton(false);}}>&nbsp;Yes&nbsp;</button>
                                            : <button className="btn btn-primary" onClick={() => { overrideSavedSearch("save_new"); loadInitial();}}>&nbsp;Yes&nbsp;</button>}
                                        </div>
                                    </div>
                                </div>
                            </Modal> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.them,
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        advanceSearchData: state.authInfo.advanceSearchData,
    };
}

export default connect(mapStateToProps, { _advanceSearchData })(AdvancedSearch);
