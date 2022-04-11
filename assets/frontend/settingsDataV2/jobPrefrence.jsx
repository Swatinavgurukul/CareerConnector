import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import Axios from "axios";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Locations from "../settingsDataV2/preferredLocalions.jsx";
import { getQueryParameters, getQueryString, removeEmpty } from "../modules/helpers.jsx";
import { useOuterClick } from "../modules/helpers.jsx";
import { countryList } from "../components/constants.jsx";
import { job_industry } from "../../translations/helper_translation.jsx"

function JobPrefrence(props) {
    const history = useHistory();
    const { t } = useTranslation();
    const validCurrency = [{ key: "$USD", value: t(props.language?.layout?.jobseeker_currency_usd) },
    { key: "₹INR", value: t(props.language?.layout?.jobseeker_currency_inr) },
    { key: "€Euro", value: t(props.language?.layout?.jobseeker_currency_euro) }];
    const validSalaryType = [{ key: "Hourly", value: t(props.language?.layout?.jobseeker_salarytype_hourly) },
    { key: "Daily", value: t(props.language?.layout?.jobseeker_salarytype_daily) },
    { key: "Weekly", value: t(props.language?.layout?.jobseeker_salarytype_weekly) },
    { key: "Monthly", value: t(props.language?.layout?.jobseeker_salarytype_monthly) },
    { key: "Yearly", value: t(props.language?.layout?.jobseeker_salarytype_yearly) }];
    const [disbles, setDisbles] = useState({
        isAvailableNow: false,
        isLookingFor: false,
        isNotLooking: false,
    });
    const toastConfig = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };
    const filter_default = {
        q: null
    };
    const [industryOptions, setIndustryOptions] = useState([]);
    const [allCompaniesLists, setAllCompaniesLists] = useState([]);
    const [salaryData, setSalaryData] = useState([]);
    const [minSalary, setMinSalary] = useState();
    const [maxSalary, setMaxSalary] = useState();
    const [currency, setCurrency] = useState();
    const [salaryType, setSalaryType] = useState();
    const [dateavalablity, setdateavalablity] = useState();
    const [selectedIndustries, setselectedIndustries] = useState([]);
    const [toggleCalendar, settoggleCalendar] = useState(false);
    const [date, setDate] = useState(null);
    const [callFunIndustry_prefer, setCallIndustry] = useState("");
    const [avalablity, setAvalablity] = useState(false);
    const [looking_for_offers, setlooking_for_offers] = useState(false);
    const [notSure, setNotsure] = useState(false);
    var tempIndustryPerference = [];
    const [tempBlockedCompany, setTempBlockedCompany] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);
    const [isLocation, setIsLocation] = useState(false);
    const [filter, setFilter] = useState(filter_default);
    const [isToggled, setToggled] = useState(false);
    const [jobType, setJobType] = useState([]);
    const [type, setType] = useState([]);
    const [remoteWork, setRemoteWork] = useState([]);
    const [citizen, setCitizen] = useState({
        type: "",
        validity: ""
    });
    const [workAuth, setWorkAuth] = useState();
    const [role, setRole] = useState([]);
    const [otherCountries, setOtherCountries] = useState([]);
    const [prefLocation, setPrefLocation] = useState({
        city: "",
        state: "",
        country: ""
    });
    const [multiLocation, setMultiLocation] = useState([]);
    const [dateFormate, setDateFormate] = useState(null);

    const CustomInput = ({ value, onClick }) => (
        <div class="form-check custom-radio">
            <input
                tabIndex="-1"
                class="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios3"
                onKeyDown={onClick}
                onClick={onClick}
                checked={dateavalablity}
                onChange={() => changeAvailableFrom()}
                // onKeyDown={e => e.key === "Enter" && changeAvailableFrom()}
                value="option2"
                style={{ minHeight: "1.4rem" }}
            />
            <label
                tabIndex="0"
                class="form-check-label" for="exampleRadios3"
                onKeyDown={e => e.key === "Enter" && changeAvailableFrom()}
            >
                <h6 onKeyDown={e => e.key === "Enter" && changeAvailableFrom()}>
                    {t(props.language?.layout?.js_jobpreference_availablefrom)}
                </h6>
            </label>
            <img
                src="/svgs/icons_new/calendar.svg"
                className="svg-sm svg-gray ml-2"
                title="Schedule Interview"
                onClick={onClick}
                // onClick={() => changeAvailableFrom()}
                alt="Schedule Interview"
            />
        </div>
    );
    //restrict - and + in input box
    const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
    //

    useEffect(() => {
        getData();
        getCompaniesList();
        getJobTypedata();
        getIndustriesList();
        getIndustryPreferances();
    }, []);

    const getData = () => {
        Axios.get("/api/v1/profilesetting", {
            headers: { Authorization: `Bearer ${props.userToken}` },
        })
            .then((response) => {
                // setselectedIndustries(response.data.data.job_preferences.industries);
                setTempBlockedCompany(response.data.data.job_preferences.blocked_companies)
                setRole(response.data.data.job_preferences.job_roles_preference)
                setJobType(response.data.data.job_preferences.job_types)
                setRemoteWork(response.data.data.job_preferences.remote_work_policy)
                setMultiLocation(response.data.data.job_preferences.location_preference);
                response.data.data.job_preferences.location_preference !== null &&
                response.data.data.job_preferences.location_preference.map((d) => {
                    setPrefLocation({...prefLocation, country: d.country})
                })
                var res = [];
                response.data.data.job_preferences.authorized_countries !== null &&
                response.data.data.job_preferences.authorized_countries.map((d) => {
                    Object.fromEntries(Object.entries(d).map(([key, value]) =>
                        [key == "USA" ? setWorkAuth("Yes") : res.push(key), value.type && setCitizen({ ...citizen, type: value.type })]
                    ))
                })
                setOtherCountries(res);
                // if (response.data.data.industry_preferences.length > 0) {
                //     setCallIndustry("put");
                // } else {
                //     setCallIndustry("post");
                // }
                
                setSalaryData(response.data.data.job_preferences);
                setAvalablity(response.data.data.job_preferences.availability_now);
                setlooking_for_offers(response.data.data.job_preferences.looking_for_offers);
                setMaxSalary(response.data.data.job_preferences.expected_max_salary);
                setMinSalary(response.data.data.job_preferences.expected_min_salary);
                setCurrency(response.data.data.job_preferences.expected_currency);
                setSalaryType(response.data.data.job_preferences.salary_per);
                if (response.data.data.job_preferences.availability_date !== null) {
                    setdateavalablity(true);
                }
                if (
                    response.data.data.job_preferences.availability_now === false &&
                    response.data.data.job_preferences.availability_date === null
                ) {
                    setNotsure(true);
                }

            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getIndustriesList = () => {
        Axios.get("/api/v1/industries", {
            headers: { Authorization: `Bearer ${props.userToken}` },
        })
            .then((response) => {
                setIndustryOptions(response.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getCompaniesList = () => {
        Axios.get("/api/v1/profilesetting/employee", {
            headers: { Authorization: `Bearer ${props.userToken}` },
        })
            .then((response) => {
                setAllCompaniesLists(response.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getJobTypedata = () => {
        Axios.get(`api/v1/recruiter/api_dataset?lang=${props?.languageName}`, {
            headers: { Authorization: `Bearer ${props.userToken}` },
        }).then((response) => {
            setType(response.data.data.job_types);
        });
    };

    const jobTypeLanguageHandler = (status, language) => {
        let result;
        switch (status) {
            case 'Full time':
                if (status == "Full time" && language == "en") {
                    result = "Full Time";
                    break;
                } else {
                    result = "De tiempo completo";
                    break;
                }
            case 'Part time':
                if (status == "Part time" && language == "en") {
                    result = "Part Time";
                    break;
                } else {
                    result = "De tiempo parcial";
                    break;
                }
            case 'contract':
                if (status == "contract" && language == "en") {
                    result = "Contract";
                    break;
                } else {
                    result = "Por contrato";
                    break;
                }
            case 'temporary':
                if (status == "temporary" && language == "en") {
                    result = "Temporary";
                    break;
                } else {
                    result = "Temporal";
                    break;
                }
            case 'Internship':
                if (status == "Internship" && language == "en") {
                    result = "Internship";
                    break;
                } else {
                    result = "Pasantía";
                    break;
                }
            case 'Contingent':
                if (status == "Contingent" && language == "en") {
                    result = "Contingent";
                    break;
                } else {
                    result = "Contingente";
                    break;
                }
            case 'Apprentice':
                if (status == "Apprentice" && language == "en") {
                    result = "Apprentice";
                    break;
                } else {
                    result = "Aprendiz";
                    break;
                }
            case 'Other':
                if (status == "Other" && language == "en") {
                    result = "Other";
                    break;
                } else {
                    result = "Otro";
                    break;
                }
            default: result = ""; break;
        }
        return result;
    }

    const onSelect = (item) => {
        var selectedItem = JSON.parse(item);
        if (selectedIndustries && selectedIndustries.some(list => parseInt(list.industry_slug__id) === selectedItem.id)) {
            return false;
        }
        tempIndustryPerference = selectedItem.id
        updatePreferances();
        selectedIndustries ? setselectedIndustries([...selectedIndustries, selectedItem]) : setselectedIndustries([selectedItem])
    };

    const onSelectBlocked = (selectedItem) => {
        if (tempBlockedCompany && tempBlockedCompany.some(list => parseInt(list.id) === JSON.parse(selectedItem).id)) {
            return
        }
        tempBlockedCompany && tempBlockedCompany.length ? setTempBlockedCompany([...tempBlockedCompany, JSON.parse(selectedItem)]) : setTempBlockedCompany([JSON.parse(selectedItem)]);
    };

    const onRemoveBlocked = (selectedItem) => {
        let filteredArray = tempBlockedCompany.filter((item) => item.id !== selectedItem.id);
        setTempBlockedCompany(filteredArray);
    };

    const selectCurrency = (e) => {
        setCurrency(e.target.options[e.target.selectedIndex].innerText);
    };

    const selectSalaryType = (e) => {
        setSalaryType(e.target.options[e.target.selectedIndex].innerText);
    };

    const updateSalary = () => {
        makeJsonData();
        if (!!minSalary || !!maxSalary) {
            // if either one of them is present
            if (!minSalary) {
                toast.error(t(props.language?.layout?.toast102_nt), { ...toastConfig });
                return;
            }
            if (!maxSalary) {
                toast.error(t(props.language?.layout?.toast103_nt), { ...toastConfig });
                return;
            }
            if (Number(minSalary) >= Number(maxSalary)) {
                toast.error(t(props.language?.layout?.toast104_nt));
                return;
            }
            if (!currency || currency?.length < 0) {
                toast.error(t(props.language?.layout?.toast105_nt), { ...toastConfig });
                return;
            }
            if (!salaryType || salaryType?.length < 0) {
                toast.error(t(props.language?.layout?.toast106_nt), { ...toastConfig });
                return;
            }
        }
        if (workAuth == "Yes" && !citizen.type) {
            toast.error(t(props.language?.layout?.toast126_nt));
            return false;
        }
        let temp = {};
        temp.availability_date = dateFormate || null;
        temp.expected_currency = currency || null;
        temp.expected_max_salary = maxSalary || null;
        temp.expected_min_salary = minSalary || null;
        temp.looking_for_offers = looking_for_offers || false;
        temp.salary_per = salaryType || null;
        temp.availability_now = avalablity || false;
        temp.blocked_companies = tempBlockedCompany || null;
        temp.job_roles_preference = role || null;
        temp.job_types = jobType || null;
        temp.remote_work_policy = remoteWork || null;
        temp.location_preference = multiLocation || null;
        temp.authorized_countries = authCountriesData || null;
        // temp.industries = selectedIndustries || []

        if (currency?.length >= 0 && !minSalary && !maxSalary) {
            // if currency present and salary not present
            temp.expected_currency = null;
            // console.log('clear currency')
        }
        if (salaryType?.length >= 0 && !minSalary && !maxSalary) {
            // if salary type present and salary not present
            temp.salary_per = null;
            // console.log('clear salary type')
        }
        let endpoint = `/api/v1/profilesetting/${props.user.user_id}`;
        Axios.put(endpoint, JSON.stringify({ job_preference: temp }), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.userToken}`,
            },
        })
            .then((response) => {
                getData();
                toast.success(t(props.language?.layout?.toast107_nt), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            })
            .catch((error) => {
                toast.error(error.response.data.detail || t(props.language?.layout?.toast53_nt));
                if (error.response.data.expected_max_salary !== undefined) {
                    toast.error(t(props.language?.layout?.toast108_nt));
                }
            });
    };

    const getIndustryPreferances = () => {
        Axios.get(`/api/v1/industry/preference`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.userToken}`,
            },
        })
            .then((response) => {
                setselectedIndustries(response.data.data);
            })
            .catch((error) => {
                toast.error(error.response.data.detail || t(props.language?.layout?.toast53_nt));
            });
    }; 

    const updatePreferances = () => {
        let endpoint = `/api/v1/industry/preference`;
        Axios.post(endpoint, JSON.stringify({industry_slug: tempIndustryPerference}), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.userToken}`,
            },
        })
            .then((response) => {
                // setselectedIndustries([...selectedIndustries, response.data.data]);
                getIndustryPreferances();
            })
            .catch((error) => {
                toast.error(error.response.data.detail || t(props.language?.layout?.toast53_nt));
            });
    };

    const deleteData = (id) => {
        let endpoint = `api/v1/industry/preference/delete/${id}`;
        Axios.delete(endpoint, {
            headers: { Authorization: `Bearer ${props.userToken}` },
            data: { preferences: {} },
        })
            .then((response) => {
                getIndustryPreferances();
            })
            .catch((error) => {
                toast.error(error.response.data.detail || t(props.language?.layout?.toast53_nt));
            });
    };

    const changeAvailableFrom = (date) => {
        if (date !== undefined) {
            setDate(format(date, "d MMM yy"));
            setDateFormate(format(date, "yyyy-MM-dd"));
        }
        setAvalablity(false);
        setdateavalablity(true);
        setNotsure(false);
        settoggleCalendar(!toggleCalendar);
        setDisbles({ isAvailableNow: false, isLookingFor: false, isNotLooking: false });
    };
    const changeAvailableNow = (e) => {
        setdateavalablity(false);
        setNotsure(false);
        setAvalablity(true);
        setDate(null);
        setDisbles({ isAvailableNow: true, isLookingFor: false, isNotLooking: false });
        settoggleCalendar(false);
    };

    const imNotSure = (e) => {
        setAvalablity(false);
        setNotsure(true);
        setDate(null);
        setdateavalablity(false);
        setDisbles({ isAvailableNow: false, isLookingFor: false, isNotLooking: true });
        settoggleCalendar(false);
    };

    const lookingforOffer = () => {
        setlooking_for_offers(!looking_for_offers);
        setAvalablity(false);
        setdateavalablity(false);
        setDate(null);
        setDisbles({ isAvailableNow: false, isLookingFor: true, isNotLooking: false });
    };

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {"Hide your Profile from Selected Companies"}
        </Tooltip>
    );

    useEffect(() => {
        (filter.q && filter.q.length >= 3) && loadInitial();
        (filter.q && filter.q.length >= 3) && setToggled(true);
    }, [filter.q && filter.q.length]);

    const loadInitial = () => {
        let url_params = getQueryParameters(history.location.search);
        let filter_params = Object.assign({}, filter, url_params);
        let final_filters = removeEmpty(filter_params);
        let query_string = getQueryString(final_filters);
        setFilter(final_filters);
        SearchHandler(query_string);
    };

    const SearchHandler = (query_string) => {
        Axios
            .get("api/v1/jobs-roles?" + query_string, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } })
            .then((response) => {
                setJobRoles(response.data.data);
            })
            .catch((error) => {
                if (error) {
                    toast.error(t(props.language?.layout?.toast58_nt));
                }
            });
    };

    const setLocationCity = (data, city, locationCity, plcaeId) => {
        let location = {};
        location.city = city[0];
        location.state = city[1];
        location.country = city[2];
        // setPrefLocation({ ...prefLocation, city: city[0], state: city[1], country: city[2] });
        var locationInput = document.querySelector("#multilocation");
        if (multiLocation && multiLocation.some(list => list.state === city[1])) {
            locationInput.value = ""
            return false;
        }
        multiLocation && multiLocation.length ? setMultiLocation([...multiLocation, location]) : setMultiLocation([location]);
        locationInput.value = ""
    };

    const locationsJSON = {
        country: true,
        state: false,
        city: true,
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
    
    const setLocationCountry = (country) => {
        setPrefLocation({ ...prefLocation, country: country });
    };

    const dropdownData = (d) => {
        if (role && role.some(list => list.id === d.id)) {
            return false;
        }
        role && role.length ?
        setRole([...new Set([...role, d])]) : setRole([d])
    }

    const jobRolesDropdown = useOuterClick((ev) => {
        if (isToggled == true) {
            setToggled(false);
        }
    });

    const locationPlaceholder = useOuterClick((ev) => {
        var locationInput = document.querySelector("#multilocation");
        locationInput.value = ""
    });

    const deleteSelectedData = (id, key) => {
        var data = key == "jobType" ? jobType : key == "multiLocation" ? multiLocation : key == "role" ? role : otherCountries
        var item = data.filter((data) => {
            return data != id;
        });
        key == "jobType" ? setJobType(item) : key == "multiLocation" ? setMultiLocation(item) : key == "role" ? setRole(item) : setOtherCountries(item)
    }

    const jobTypeHandler = (value) => {
        var i = JSON.parse(value);
        if ((jobType && jobType.length) && jobType.some(list => parseInt(list.id) === i.id)) {
            return
        }
        (jobType && jobType.length) ? setJobType([...jobType, i]) : setJobType([i]);
    }

    var authCountriesData = [];
    const makeJsonData = () => {
        if (workAuth == "Yes") {
            let item = {}
            item["USA"] = citizen;
            authCountriesData.push(item);
        }
        if (otherCountries.length) {
            otherCountries.map((a) => {
                let item = {}
                item[a] = { type: "", validity: "" };
                authCountriesData.push(item);
            });
        }
    }

    const jobIndustryHandler = (language, key) => {
        return(job_industry[language][key]);
    }

    return (
        <div>
            <div className="card border-0">
                <div className="d-flex align-items-center">
                    <img
                        src="/svgs/icons_new/briefcase.svg"
                        className="svg-sm mr-2 mt-n1 svg-gray"
                        alt="mail"
                    />
                    {t(props.language?.layout?.js_jobpreference_preferences)}
                </div>
                <p className="pt-4"> {t(props.language?.layout?.manageas_nt)}</p>
                <form className="px-2">
                    <div className={"row" + (jobRoles && jobRoles.length ? "" : " align-items-center")}>
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.prefferedjobroles_nt)}</p>
                        </div>
                        {role && role.length ?
                            <div className="col-md-9">
                                {role.map(item => (
                                    <div className="d-inline-block mb-2">
                                    <span className="rounded p-1 mr-2 text-capitalize" style={{ background: "#E5EEFF", fontSize: "12px" }}>
                                        {item.name}
                                        <img
                                            src="/svgs/icons_new/x-circle.svg"
                                            className="ml-2 pointer"
                                            alt="mail"
                                            style={{ width: ".8rem", height: ".8rem" }}
                                            onClick={(e) => deleteSelectedData(item, "role")}
                                        />
                                    </span>
                                    </div>
                                ))}
                            </div>
                            : ""}
                        <div className={`col-md-3 ${role && role.length ? "offset-3" : ""}`}>
                            <div className="form-group">
                                <input
                                    aria-label="Job Roles"
                                    type="text"
                                    className="form-control"
                                    placeholder= {t(props.language?.layout?.jobroles_nt)}
                                    value={filter.q}
                                    onChange={(e) => setFilter({ ...filter, q: e.target.value })}
                                />
                                {isToggled &&
                                    jobRoles.length ?
                                    <div ref={jobRolesDropdown} className={`card elevation-2 border-0 candidate d-block ${jobRoles.length >= 5 ? "thin-scrollbar" : ""}`} style={{ height: "120px", position: "absolute", zIndex: 1, width: "225px" }}>
                                        {jobRoles.map((d) => (
                                            <div className="pointer p-1 dropdown-item" onClick={(e) => dropdownData(d)} contentEditable={false}>
                                                {d.name}
                                            </div>
                                        ))}
                                    </div> : ""}
                            </div>
                        </div>
                    </div>
                    <div className={"row" + (multiLocation && multiLocation.length ? "" : " align-items-center")}>
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.prefferedwl_nt)}</p>
                        </div>
                        {/* <div className="col-md-3">
                            <div className="form-group">
                                <select
                                    aria-label="Country"
                                    className="form-control"
                                >
                                    <option selected disabled>Select Country</option>
                                    <option selected value="USA">USA</option>
                                </select>
                            </div>
                        </div> */}
                        <div className="col-md-9">
                            {multiLocation && multiLocation.length ?
                                <div className="col-md-9 offset-3 pl-1 pb-2">
                                    {multiLocation.map(item => (
                                        <div className="d-inline-block mb-2">
                                        <span className="rounded p-1 mr-2 text-capitalize" style={{ background: "#E5EEFF", fontSize: "12px" }}>
                                            {item.city}, {item.state}
                                            <img
                                                src="/svgs/icons_new/x-circle.svg"
                                                className="ml-2 pointer"
                                                alt="mail"
                                                style={{ width: ".8rem", height: ".8rem" }}
                                                onClick={(e) => deleteSelectedData(item, "multiLocation")}
                                            />
                                        </span>
                                        </div>
                                    ))}
                                </div>
                                : ""}
                            <div className="col-md-6 pl-0">
                                <div ref={locationPlaceholder} className="form-group mb-0">
                                    <Locations
                                        setLocationCountry={setLocationCountry}
                                        setLocationCity={setLocationCity}
                                        locationsJSON={locationsJSON}
                                        setLocation={setLocation}
                                        isLocation={isLocation}
                                        country={prefLocation.country}
                                        // country={multiLocation.map((d) => d.country)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center setting_input" >
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.js_jobpreference_expectedsalary)}</p>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <input
                                    className="form-control rounded-0 border-dark"
                                    value={minSalary}
                                    type="number"
                                    min="1"
                                    placeholder={t(props.language?.layout?.js_jobpreference_minimum)}
                                    onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => setMinSalary(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <input
                                    className="form-control rounded-0 border-dark"
                                    type="number"
                                    value={maxSalary}
                                    id="ram"
                                    min={minSalary}
                                    placeholder={t(props.language?.layout?.js_jobpreference_maximum)}
                                    onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => setMaxSalary(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <select
                                    aria-label="Currency"
                                    className="form-control text-muted rounded-0 border-dark"
                                    value={currency}
                                    onChange={(e) => selectCurrency(e)}>
                                    <option selected disabled>{t(props.language?.layout?.js_jobpreference_selectcurrency)}</option>
                                    {validCurrency.map((currency) => (
                                        <option key={currency.key} value={currency.key}>
                                            {currency.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <select
                                    aria-label="salary"
                                    className="form-control text-muted rounded-0 border-dark"
                                    value={salaryType}
                                    onChange={(e) => selectSalaryType(e)}>
                                    <option selected disabled>{t(props.language?.layout?.js_jobpreference_selectsalarytype)}</option>
                                    {validSalaryType.map((salType) => (
                                        <option key={salType.key} value={salType.key}>
                                            {salType.value}
                                        </option>
                                    ))}
                                    {/* <option value="Monthly">Monthly</option> */}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 p-0">
                            <p className="mb-0">{t(props.language?.layout?.js_jobpreference_availability)}</p>
                        </div>
                        <div className="col-md-9">
                            <div className="d-flex">
                                <div className="mr-3">
                                    <p>{t(props.language?.layout?.js_jobpreference_lookingforoffers)}</p>
                                </div>
                                <div class="form-group animated form-primary-bg">
                                    <div class="switch checkbox-switch switch-success mt-n1">
                                        <label tabIndex={0} onKeyDown={e => e.key === "Enter" && lookingforOffer()}>
                                            <input
                                                type="checkbox"
                                                id="customSwitch1"
                                                className=""
                                                checked={looking_for_offers}
                                                onChange={(e) => lookingforOffer()}
                                            />
                                            <span></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div class="col-md-3">
                                    {looking_for_offers && (
                                        <div class=" custom-radio">
                                            <input
                                                tabIndex="-1"
                                                class="form-check-input"
                                                type="radio"
                                                name="exampleRadios"
                                                id="exampleRadios2"
                                                checked={avalablity}
                                                onChange={(e) => changeAvailableNow(e)}
                                                onKeyDown={e => e.key === "Enter" && changeAvailableNow(e)}
                                            />
                                            <label
                                                tabIndex="0"
                                                class="form-check-label" for="exampleRadios2" onKeyDown={e => e.key === "Enter" && changeAvailableNow(e)}>
                                                <h6>{t(props.language?.layout?.js_jobpreference_availablenow)}</h6>
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div class="col-md-4">
                                    {looking_for_offers && (
                                        <DatePicker
                                            minDate={new Date()}
                                            dateFormat="d MMM yy"
                                            onChange={(date) => changeAvailableFrom(date)}
                                            customInput={<CustomInput />}
                                        />
                                    )}
                                </div>
                                <div class="col-md-4">
                                    {looking_for_offers && (
                                        <div class="form-check custom-radio" >
                                            <input
                                                tabIndex="-1"
                                                class="form-check-input"
                                                type="radio"
                                                name="exampleRadios"
                                                checked={notSure}
                                                id="exampleRadios4"
                                                value="option2"
                                                onChange={(e) => imNotSure(e)}
                                                onKeyDown={e => e.key === "Enter" && imNotSure(e)}
                                            />
                                            <label
                                                tabIndex="0"
                                                class="form-check-label" for="exampleRadios4" onKeyDown={e => e.key === "Enter" && imNotSure(e)}>
                                                <h6>{t(props.language?.layout?.js_jobpreference_notsure)}</h6>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {dateavalablity && (
                                <div className="row">
                                    <div className="offset-md-3 col-md-4 mb-2">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={date !== null ? date : salaryData.availability_date !== null && format(new Date(salaryData.availability_date), "d MMM yy")}
                                            placeholder="Date"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={"row" + (jobType && jobType.length ? "" : " align-items-center")}>
                        <div className="col-md-3 p-0">
                            <p>{t(props?.language?.layout?.ep_jobs_jobtype)}</p>
                        </div>
                        {jobType && jobType.length ?
                            <div className="col-md-9">
                                {jobType.map(item => (
                                    <div className="d-inline-block mb-2">
                                    <span className="rounded p-1 mr-2 text-capitalize" style={{ background: "#E5EEFF", fontSize: "12px" }}>
                                        {jobTypeLanguageHandler(item.name, props?.languageName)}
                                        <img
                                            src="/svgs/icons_new/x-circle.svg"
                                            className="ml-2 pointer"
                                            alt="mail"
                                            style={{ width: ".8rem", height: ".8rem" }}
                                            onClick={(e) => deleteSelectedData(item, "jobType")}
                                        />
                                    </span>
                                    </div>
                                ))}
                            </div>
                            : ""}
                        <div className={`col-md-3 ${jobType && jobType.length ? "offset-3" : ""}`}>
                            <div className="form-group">
                                <select
                                    aria-label="Job Type"
                                    className="form-control"
                                    value={jobType}
                                    onChange={(e) => jobTypeHandler(e.target.value)}
                                >
                                    <option selected>{t(props.language?.layout?.js_jobs_jobtype)}</option>
                                    {type.map((item) => (
                                        <option value={JSON.stringify(item)}>{jobTypeLanguageHandler(item.name, props?.languageName)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={"row" + (selectedIndustries && selectedIndustries.length ? "" : " align-items-center")}>
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.js_jobpreference_industry)}</p>
                        </div>
                        {selectedIndustries && selectedIndustries.length ?
                            <div className="col-md-9">
                                {(selectedIndustries).map(item => (
                                    <div className="d-inline-block mb-2">
                                    <span className="rounded p-1 mr-2 position-relative" style={{ background: "#E5EEFF", fontSize: "12px", marginBottom: "20px" }}>
                                        {jobIndustryHandler(props?.languageName, item.name ? item.name : item.industry_slug__name)}
                                        <img
                                            src="/svgs/icons_new/x-circle.svg"
                                            className="ml-2 pointer"
                                            alt="mail"
                                            style={{ width: ".8rem", height: ".8rem" }}
                                            onClick={(e) => deleteData(item.industry_slug__id)}
                                        />
                                    </span>
                                    </div>
                                ))}
                            </div>
                            : ""}
                        <div className={`col-md-3 ${selectedIndustries && selectedIndustries.length ? "offset-3" : ""}`}>
                            <div className="form-group">
                                <select
                                    aria-label="Industries"
                                    className="form-control"
                                    onChange={(e) => onSelect(e.target.value)}
                                    value={selectedIndustries}
                                >
                                    <option selected >{t(props.language?.layout?.js_jobpreference_selectindustry)}</option>
                                    {industryOptions.map((d) => (
                                        <option value={JSON.stringify(d)}>{jobIndustryHandler(props?.languageName, d.name)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* <div className="row align-items-center">
                        <div className="col-md-3 p-0">
                            <p>Size of Company</p>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <select
                                    aria-label="Industries"
                                    className="form-control"
                                >
                                    <option selected disabled>Select Size of Company</option>
                                </select>
                            </div>
                        </div>
                    </div> */}
                    <div className="row">
                        <p className="py-3">{t(props.language?.layout?.managesetting_nt)}</p>
                    </div>
                    <div className="row">
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.workauthorization_nt)}</p>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <p className="">{t(props.language?.layout?.authorizeusa_nt)}</p>
                            </div>
                            <fieldset className="reasons d-flex" value={workAuth} onChange={(event) => setWorkAuth(event.target.value)}>
                                <div className="form-check custom-radio mr-3">
                                    <input class="form-check-input" type="radio" aria-label="corporatate" id="corporateCheck" name="reasons-option"
                                        value="Yes" checked={workAuth == "Yes" ? true : false} />
                                    <label class="form-check-label user-select-none" for="corporateCheck">{t(props.language?.layout?.all_yes_nt)}</label></div>
                                <div className="form-check custom-radio">
                                    <input class="form-check-input" type="radio" aria-label="corporatate" id="corporateCheckoffer" name="reasons-option"
                                        value="No" checked={workAuth == "Yes" ? false : true} onChange={() => setCitizen({ ...citizen, type: "" })} />
                                    <label class="form-check-label user-select-none" for="corporateCheckoffer">{t(props.language?.layout?.no_nt)}</label></div>
                            </fieldset>
                        </div>
                        <div className="col-md-2">
                            <p>{t(props.language?.layout?.othercountry_nt)}</p>
                        </div>
                        <div className="col-md-4">
                            {otherCountries && otherCountries.length ?
                                <div className="col-md-9" style={{ maxWidth: "100%" }}>
                                    {otherCountries.map(item => (
                                        <div className="d-inline-block mb-2">
                                        <span className="rounded p-1 mr-2 text-capitalize" style={{ background: "#E5EEFF", fontSize: "12px" }}>
                                            {item}
                                            <img
                                                src="/svgs/icons_new/x-circle.svg"
                                                className="ml-2 pointer"
                                                alt="mail"
                                                style={{ width: ".8rem", height: ".8rem" }}
                                                onClick={(e) => deleteSelectedData(item, "otherCountries")}
                                            />
                                        </span>
                                        </div>
                                    ))}
                                </div>
                                : ""}
                            <div className="col-md-3" style={{ maxWidth: "100%" }}>
                                <div className="form-group">
                                    <select
                                        aria-label="Other Countries"
                                        className="form-control"
                                        value={otherCountries}
                                        onChange={(e) => setOtherCountries([...new Set([...otherCountries, e.target.value])])}
                                    >
                                        <option selected>{t(props.language?.layout?.selectcountries_nt)}</option>
                                        {countryList.map((filter) => (
                                        <option className="bg-white" key={filter.Code}>
                                            {filter.Name}
                                        </option>
                                    ))}
                                        {/* <option value="canada">Canada</option>
                                        <option value="brazil">Brazil</option>
                                        <option value="uk">UK</option> */}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    {workAuth == "Yes" &&
                        <div className="row align-items-center">
                            <div className="offset-md-3 col-md-3">
                                <div className="form-group">
                                    <select
                                        aria-label="Select For USA"
                                        className="form-control"
                                        value={citizen.type}
                                        onChange={(e) => setCitizen({ ...citizen, type: e.target.value })}
                                    >
                                        <option selected>{t(props.language?.layout?.selectforusa_nt)}</option>
                                        <option value="US citizen">{t(props.language?.layout?.selectforusa_option1_nt)}</option>
                                        <option value="Canadian citizen">{t(props.language?.layout?.selectforusa_option2_nt)}</option>
                                        <option value="Green Card Holder">{t(props.language?.layout?.selectforusa_option3_nt)}</option>
                                        <option value="Need H1 visa">{t(props.language?.layout?.selectforusa_option4_nt)}</option>
                                        <option value="Others">{t(props.language?.layout?.others_nt)}</option>
                                    </select>
                                </div>
                            </div>
                        </div>}
                    <div className="row">
                        <p className="py-3">{t(props.language?.layout?.managejp_nt)}</p>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.rworkpolicy_nt)}</p>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <select
                                    aria-label="Partially Remote"
                                    className="form-control"
                                    onChange={(e) => setRemoteWork(e.target.value)}
                                    value={remoteWork}
                                >
                                    <option selected>{t(props.language?.layout?.selcetpref_nt)}</option>
                                    <option value="Partially Remote">{t(props.language?.layout?.selcetpref_option1_nt)}</option>
                                    <option value="Fully Remote">{t(props.language?.layout?.selcetpref_option2_nt)}</option>
                                    <option value="Work in an Office">{t(props.language?.layout?.selcetpref_option3_nt)}</option>
                                    <option value="No Preference">{t(props.language?.layout?.selcetpref_option4_nt)}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <p className="py-3">{t(props.language?.layout?.manageprivacy_nt)}</p>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.js_jobpreference_blockcompanies)}<abbr className="svg-xs-1 align-top mt-n2"> <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip}>
                                <img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" />
                            </OverlayTrigger></abbr>
                            </p>
                        </div>
                        {tempBlockedCompany && tempBlockedCompany.length ?
                            <div className="col-md-9">
                                {tempBlockedCompany.map(item => (
                                    <div className="d-inline-block mb-2">
                                    <span className="rounded p-1 mr-2 text-capitalize" style={{ background: "#E5EEFF", fontSize: "12px" }}>
                                        {item.name}
                                        <img
                                            src="/svgs/icons_new/x-circle.svg"
                                            className="ml-2 pointer"
                                            alt="mail"
                                            style={{ width: ".8rem", height: ".8rem" }}
                                            onClick={(e) => onRemoveBlocked(item)}
                                        />
                                    </span>
                                    </div>
                                ))}
                            </div>
                            : ""}
                        <div className={`col-md-3 ${tempBlockedCompany && tempBlockedCompany.length ? "offset-3" : ""}`}>
                            <div className="form-group">
                                <select
                                    aria-label="Company Names"
                                    className="form-control"
                                    onChange={(e) => onSelectBlocked(e.target.value)}
                                    value={tempBlockedCompany}
                                >
                                    <option selected>{t(props.language?.layout?.selectcompany_nt)}</option>
                                    {allCompaniesLists.map((d) => (
                                        <option value={JSON.stringify(d)}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="d-md-flex p-0">
                    <div className="col-12 text-right p-0 mt-3">
                        {/* <button
                            className="btn btn-outline-secondary btn-md px-4 px-md-5 mx-4"
                            onClick={() => { history.push("/") }}>
                            {t(props.language?.layout?.js_notifications_cancel)}
                        </button> */}
                        <button
                            className="btn btn-primary btn-md px-4"
                            onClick={(e) => updateSalary(e)}
                        >
                            {t(props.language?.layout?.js_notifications_savechanges)}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName
    };
}

export default connect(mapStateToProps, {})(JobPrefrence);
