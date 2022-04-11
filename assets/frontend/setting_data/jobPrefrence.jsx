import React, { useEffect, useState } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import DatePicker from "react-datepicker";
// import "react-datepicker/src/stylesheets/datepicker.scss";
import Axios from "axios";
import { parse, format, formatDistanceStrict, set } from "date-fns";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    const [selectLocation, setSelectLocation] = useState({
        options: [{ name: "New York" }, { name: "London" }, { name: "San Francisco" }, { name: "Paris" }],
    });
    const [industryOptions, setIndustryOptions] = useState([]);
    const [preferedIndustries, setPrefered] = useState([]);
    const [allCompaniesLists, setAllCompaniesLists] = useState([]);
    const [blockedCompanies, setBlockedCompanies] = useState([]);
    const [salaryData, setSalaryData] = useState([]);
    // const [preferedLocation, setLocation] = useState([]);
    const [minSalary, setMinSalary] = useState();
    const [maxSalary, setMaxSalary] = useState();
    const [currency, setCurrency] = useState();
    const [salaryType, setSalaryType] = useState();
    const [dateavalablity, setdateavalablity] = useState();
    const [selectedIndustries, setselectedIndustries] = useState([]);
    const [blockedIndustries, setblockedIndustries] = useState([]);
    const [toggleCalendar, settoggleCalendar] = useState(false);
    const [date, setDate] = useState(null);
    const [callFunBlocked, setCallBlocked] = useState("");
    const [callFunIndustry_prefer, setCallIndustry] = useState("");
    const [avalablity, setAvalablity] = useState(false);
    const [looking_for_offers, setlooking_for_offers] = useState(false);
    const [notSure, setNotsure] = useState(false);
    var tempIndustryPerference = [];
    const [tempBlockedCompany, setTempBlockedCompany] = useState([]);

    const CustomInput = ({ value, onClick }) => (
        console.log("onClick..........", onClick),
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
                onKeyDown={e => e.key === "Enter" && changeAvailableFrom()}
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
                onClick={() => changeAvailableFrom()}
                alt="Schedule Interview"
            />
        </div>
    );
    //restrict - and + in input box
    const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
    //

    useEffect(() => {
        getData();
        getSalaryData();
        getCompaniesList();
    }, []);

    const getData = () => {
        Axios.get("/api/v1/profilesetting", {
            headers: { Authorization: `Bearer ${props.userToken}` },
        })
            .then((response) => {
                const industryOptionsData = response.data.data.industries;
                // setId(response.data.data.app_notifications.id);
                setselectedIndustries(response.data.data.industry_preferences);
                // setblockedIndustries(response.data.data.blocked);
                addKeyTotheSelectedLists("prefer_industries", response.data.data.industry_preferences);
                // addKeyTotheSelectedLists("blocked_industries", response.data.data.blocked);

                // if (response.data.data.blocked.length > 0) {
                //     setCallBlocked("put");
                // } else {
                //     setCallBlocked("post");
                // }
                if (response.data.data.industry_preferences.length > 0) {
                    setCallIndustry("put");
                } else {
                    setCallIndustry("post");
                }
                setIndustryOptions(response.data.data.industries);
                // setAllCompaniesLists(response.data.data.companies_list);
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

    const getSalaryData = () => {
        Axios.get("/api/v1/salarypreferences", {
            headers: { Authorization: `Bearer ${props.userToken}` },
        })
            .then((response) => {
                setSalaryData(response.data.data.salary);
                setAvalablity(response.data.data.salary.availability_now);
                setlooking_for_offers(response.data.data.salary.looking_for_offers);
                setMaxSalary(response.data.data.salary.expected_max_salary);
                setMinSalary(response.data.data.salary.expected_min_salary);
                setCurrency(response.data.data.salary.expected_currency);
                setSalaryType(response.data.data.salary.salary_per);
                addKeyTotheSelectedLists("blocked_industries", response.data.data.salary.blocked_companies);
                setTempBlockedCompany(response.data.data.salary.blocked_companies);
                // setblockedIndustries(response.data.data.salary.blocked_companies);

                //   if (response.data.data.blocked_companies.length > 0) {
                //         setCallBlocked("put");
                //     }
                //  else {
                //     setCallBlocked("post");
                // }
                if (response.data.data.salary.availability_date !== null) {
                    setdateavalablity(true);
                }
                if (
                    response.data.data.salary.availability_now === false &&
                    response.data.data.salary.availability_date === null
                ) {
                    setNotsure(true);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const addKeyTotheSelectedLists = (listName, lists) => {
        let addedKeyLists = [];
        if (listName === "prefer_industries") {
            lists.forEach((itemItem) => {
                addedKeyLists.push({ ...itemItem, name: itemItem.industry_slug__name });
            });
            setPrefered(addedKeyLists);
        } else {
            lists.forEach((itemItem) => {
                addedKeyLists.push({ ...itemItem, name: itemItem.name });
            });
            setBlockedCompanies(addedKeyLists);
        }
        // else {
        //     lists.forEach((itemItem) => {

        //         addedKeyLists.push({ ...itemItem, name: itemItem.company__name.name });
        //     });
        //     setBlockedCompanies(addedKeyLists);
        // }
    };

    const onSelect = (selectedList, selectedItem) => {
        selectedItem.industry_slug__id === undefined
            ? (tempIndustryPerference = selectedItem.id)
            : (tempIndustryPerference = selectedItem.industry_slug__id);
        updatePreferances();
    };
    const onSelectBlocked = (selectedList, selectedItem) => {
        let prefIds = [...tempBlockedCompany, selectedItem];
        setTempBlockedCompany(prefIds);
    };
    const onRemoveBlocked = (selectedList, selectedItem) => {
        let filteredArray = tempBlockedCompany.filter((item) => item.id !== selectedItem.id);
        setTempBlockedCompany(filteredArray);

        // if (selectedItem.industry_slug__id) {
        //     deleteDataBlocked(selectedItem.industry_slug__id);
        // } else if (selectedItem.id) {
        //     deleteDataBlocked(selectedItem.company__id);
        // }
        // setPrefered(selectedList);
    };

    const selectCurrency = (e) => {
        setCurrency(e.target.options[e.target.selectedIndex].innerText);
    };

    const selectSalaryType = (e) => {
        // console.log("came salary",e.target.options[e.target.selectedIndex].innerText)
        // console.log(e.target.selectedIndex, e.target.options[e.target.selectedIndex].innerText)
        setSalaryType(e.target.options[e.target.selectedIndex].innerText);
    };
    const updateSalary = () => {
        let id = salaryData.user;
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

        let temp = {};
        temp.availability_date = date || null;
        temp.expected_currency = currency || null;
        temp.expected_max_salary = maxSalary || null;
        temp.expected_min_salary = minSalary || null;
        temp.looking_for_offers = looking_for_offers || false;
        temp.salary_per = salaryType || null;
        temp.availability_now = avalablity || false;
        temp.blocked_companies = tempBlockedCompany || null;
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
        let endpoint = `/api/v1/profilesetting/${id}`;
        Axios.put(endpoint, JSON.stringify({ salary: temp }), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.userToken}`,
            },
        })
            .then((response) => {
                getSalaryData();
                // console.log(response);
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

    const updatePreferances = () => {
        let endpoint = `/api/v1/profilesetting`;
        Axios.post(endpoint, JSON.stringify({ preferences: { industry_slug: tempIndustryPerference } }), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.userToken}`,
            },
        })
            .then((response) => {
                getData();
                // console.log(response);
            })
            .catch((error) => {
                toast.error(error.response.data.detail || t(props.language?.layout?.toast53_nt));
            });
    };

    const deleteData = (id) => {
        let endpoint = `/api/v1/profilesetting/${id}`;
        Axios.delete(endpoint, {
            headers: { Authorization: `Bearer ${props.userToken}` },
            data: { preferences: {} },
        })
            .then((response) => {
                getData();
            })
            .catch((error) => {
                toast.error(error.response.data.detail || t(props.language?.layout?.toast53_nt));
            });
    };

    const onRemoveIndustry = (selectedList, selectedItem) => {
        if (selectedItem.industry_slug__id) {
            deleteData(selectedItem.industry_slug__id);
        } else if (selectedItem.id) {
            deleteData(selectedItem.id);
        }
        setPrefered(selectedList);
    };

    const changeAvailableFrom = (date) => {
        if (date !== undefined) {
            setDate(format(date, "yyyy-MM-dd"));
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

    return (
        <div>
            <div className="card border-0">
                <form className="py-4 px-0">
                    <div className="form-group d-md-flex align-items-center mb-1">
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.js_jobpreference_industry)}</p>
                        </div>
                        <div className="col-md-9 p-0">
                            <div className="form-group">
                                <Multiselect
                                    id="multiselectsetting"
                                    options={industryOptions}
                                    selectedValues={preferedIndustries}
                                    selectionLimit="3"
                                    displayValue={"name"}
                                    onSelect={onSelect}
                                    onRemove={onRemoveIndustry}
                                    avoidHighlightFirstOption={true}
                                    showArrow={true}
                                    placeholder={tempIndustryPerference.length < 3 ? t(props.language?.layout?.js_jobpreference_selectindustry) : " "}
                                />

                                {/* <Multiselect
                                    options={industryOptions}

                                    displayValue={industryOptions.name}
                                    selectionLimit="3"
                                    closeMenuOnSelect={true}
                                /> */}
                            </div>
                        </div>
                    </div>
                    {/* <div className="row form-group align-items-center mb-0">
                        <div className="col-md-2 px-0 mr-4 ml-3">
                            <p>Location Preference</p>
                        </div>
                        <div className="col-md-9 px-0 pr-3">
                            <div className="form-group">
                                <Multiselect
                                    options={selectLocation.options}
                                    selectedValues={selectLocation.selectedValue}
                                    displayValue="name"
                                    selectionLimit="3"
                                    placeholder="Select Locations"

                                />
                            </div>
                        </div>
                    </div> */}
                    <div className="d-md-flex form-group align-items-center mb-0 setting_input" >
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.js_jobpreference_expectedsalary)}</p>
                        </div>
                        <div className="col-md-7 d-flex p-0">
                            <div className="col-md-4 pl-0">
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
                            <div className="col-md-4 pl-0">
                                <input
                                    className="form-control rounded-0 border-dark"
                                    type="number"
                                    value={maxSalary}
                                    min={minSalary}
                                    placeholder={t(props.language?.layout?.js_jobpreference_maximum)}
                                    onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => setMaxSalary(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4 pl-0">
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
                        </div>
                        <div className="col-md-2 p-0">
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
                    <div className="form-group d-md-flex">
                        <div className="col-md-3 p-0">
                            <p className="mb-0">{t(props.language?.layout?.js_jobpreference_availability)}</p>
                        </div>
                        <div className="col-md-9 p-0">
                            <div className="d-flex">
                                <div className="mr-3">
                                    <p>{t(props.language?.layout?.js_jobpreference_lookingforoffers)}</p>
                                </div>
                                {/* <div className="custom-control custom-switch float-right">
                                <input
                                            type="checkbox"
                                            className="custom-control-input float-right"
                                            id="customSwitch1"
                                            checked={looking_for_offers}
                                            onChange={(e) => lookingforOffer()}
                                        />
                                        <label className="custom-control-label" htmlFor="customSwitch1"></label>
                                </div> */}
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
                                    <div className="offset-md-3 col-md-4">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={date !== null ? date : salaryData.availability_date}
                                            placeholder="Date"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="my-2">
                        <span className="font-weight-bold text-dark">{t(props.language?.layout?.js_jobpreference_privacy)}</span>
                    </div>
                    <div className="form-group d-md-flex">
                        <div className="col-md-3 p-0">
                            <p>{t(props.language?.layout?.js_jobpreference_blockcompanies)}</p>
                        </div>
                        <div className="col-md-9 p-0">
                            <div className="form-group">
                                <Multiselect
                                    options={allCompaniesLists}
                                    selectedValues={blockedCompanies}
                                    displayValue="name"
                                    // selectionLimit="3"
                                    onRemove={onRemoveBlocked}
                                    avoidHighlightFirstOption={true}
                                    showArrow={true}
                                    // placeholder={blockedCompanies.length < 3 ? "Mention Company Name " : null}
                                    placeholder={t(props.language?.layout?.js_jobpreference_mentioncompanyname)}
                                    onSelect={onSelectBlocked}
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="d-md-flex p-0">
                    <div className="col-12 text-right p-0 mt-3">
                        <button
                            className="btn btn-outline-secondary btn-md px-4 px-md-5 mx-4"
                            onClick={() => { history.push("/") }}>
                            {t(props.language?.layout?.js_notifications_cancel)}
                        </button>
                        <button
                            className="btn btn-primary btn-md px-4"
                            onClick={(e) => updateSalary(e)}>
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
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(JobPrefrence);
