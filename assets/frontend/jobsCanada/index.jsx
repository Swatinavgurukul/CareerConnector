import React, { useState, useEffect } from "react";
import axios from "axios";
import { getQueryParameters, removeEmpty, getQueryString } from "../modules/helpers.jsx";
import { useHistory } from "react-router-dom";
import JobCard from "./jobCard.jsx";
import Loader from "../partials/loading.jsx";
import Result404 from "../partials/result404.jsx";
import LocationSearchInput from "../common/locations.jsx";
import { connect } from "react-redux";
import { _setAuthData } from "../actions/actionsAuth.jsx";
import jwt_decode from "jwt-decode";
import { useTranslation } from "react-i18next";

const locationsJSON = {
    country: false,
    state: false,
    city: true,
};
const Jobs = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const filter_default = {
        query: null,
        easy_apply: null,
        remote: null,
        posted: null,
        type: null,
        range: null,
        page: 1,
        location: null,
        state: null,
        ca: true
    };
    const paginate_default = {
        currentPageNumber: 1,
        totalPages: 1,
    };
    const default_user_object = {
        authenticated: false,
        name: "",
        chat_id: "",
        is_user: true,
        user_id: null,
    };
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState(filter_default);
    const [paginate, setPaginate] = useState(paginate_default);
    const [isJobAvailable, setIsJobAvailable] = useState(true);
    const [totalCount, setTotalCount] = useState("")
    const [firstIndex, setFirstIndex] = useState(0);
    const [lastIndex, setLastIndex] = useState(0);


    const checkBoxes = {
        easy_apply: {
            name: "easy_apply",
            labelClass: "custom-control-label search-select-font",
            placeholder: "Easy Apply only",
        },
        remote: {
            name: "remote",
            labelClass: "custom-control-label text-muted pointer",
            placeholder: t(props.language?.layout?.jobs_remoteoption),
        },
    };
    const selectBoxes = {
        posted: {
            name: "posted",
            class: "form-control border-white text-muted pointer select-box-width",
            options: [
                { value: null, placeholder: t(props.language?.layout?.jobs_jobposted) },
                { value: "", placeholder: t(props.language?.layout?.jobs_jobposted_any) },
                { value: "1", placeholder: t(props.language?.layout?.jobs_jobposted_1day) },
                { value: "3", placeholder: t(props.language?.layout?.jobs_jobposted_3days) },
                { value: "7", placeholder: t(props.language?.layout?.jobs_jobposted_7days) },
                { value: "30", placeholder: t(props.language?.layout?.jobs_jobposted_30days) },
            ],
        },
        type: {
            name: "type",
            class: "form-control border-white text-muted pointer select-box-width jobType",
            options: [
                { value: null, placeholder: t(props.language?.layout?.jobs_jobtype) },
                { value: "", placeholder: t(props.language?.layout?.jobs_jobtype_all) },
                { value: "Full time", placeholder: t(props.language?.layout?.jobs_jobtype_fulltime) },
                { value: "Part time", placeholder: t(props.language?.layout?.jobs_jobtype_parttime) },
                { value: "temporary", placeholder: t(props.language?.layout?.jobs_jobtype_temporary) },
                { value: "contract", placeholder: t(props.language?.layout?.jobs_jobtype_contract) },
                { value: "apprenticeship", placeholder: t(props.language?.layout?.jobs_jobtype_appernticeship) },
                { value: "internship", placeholder: t(props.language?.layout?.jobs_jobtype_intership) },
                { value: "Contingent", placeholder: t(props.language?.layout?.jobs_jobtype_contingent) },
                { value: "other", placeholder: t(props.language?.layout?.jobs_jobtype_other) },
            ],
        },
        range: {
            name: "range",
            class: "form-control border-white text-muted pointer select-salary-width",
            options: [
                { value: null, placeholder: t(props.language?.layout?.jobs_salaryrange) },
                { value: "", placeholder: t(props.language?.layout?.jobs_salaryrange_any) },
                /* {no_translated} */
                /* {commas are in amount values commas not allowed} */
                { value: "10000", placeholder: "$10,000+" },
                { value: "20000", placeholder: "$20,000+" },
                { value: "40000", placeholder: "$40,000+" },
                { value: "60000", placeholder: "$60,000+" },
                { value: "80000", placeholder: "$80,000+" },
                { value: "100000", placeholder: "$100,000+" },
            ],
        },
    };
    const showingNumberOfJobs = (query_string, pageCount, totalCount, totalPages, pageNumber) => {
        // ---------------hooks-------------------------------------------
        setFirstIndex((pageNumber - 1) * 12 + 1); //13//25/37
        setLastIndex(pageNumber * 12 > totalCount ? totalCount : pageNumber * pageCount) //24//36//48
        // ***********************Js*************************************
        // if (query_string == "page=1" && pageCount == 12) {
        //     setFirstIndex(1);
        //     setLastIndex(12)
        // }
        // else if (query_string == "page=1" && pageCount <= 12) {
        //     setFirstIndex(1);
        //     setLastIndex(pageCount)
        // }
        // else if (query_string != "page=1" && pageCount == 12) {
        //     setFirstIndex((pageNumber - 1) * pageCount + 1); //13//25/37
        //     setLastIndex(pageNumber * pageCount) //24//36//48
        // }
        // else if (query_string != "page=1" && pageCount <= 12) {
        //     setFirstIndex((12 * (totalPages - 1)) + 1);
        //     setLastIndex(totalCount)
        // }
    }

    const SearchJobHandler = (query_string) => {
        history.replace(`search?${query_string}`, query_string);
        let options = {};
        if (localStorage.getItem("access_token")) {
            options = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            };
        }
        axios.get("/api/v1/jobs?" + query_string, options)
            .then((response) => {
                let result = response.data.data;
                let page_count = response.data.data.page_count
                let total_count = response.data.data.total_count
                let total_pages = response.data.data.total_pages
                let page_number = response.data.data.page_number
                setTotalCount(response.data.data.total_count);
                showingNumberOfJobs(query_string, page_count, total_count, total_pages, page_number);
                if (!result || result.data.length == 0) {
                    setIsJobAvailable(false);
                } else {
                    setIsJobAvailable(true);
                    setData(result.data);
                    setPaginate({
                        currentPageNumber: result.page_number,
                        totalPages: result.total_pages,
                    });
                }
                setLoading(false);
            })
            .catch((error) => {
                if (error) {
                    setIsJobAvailable(false);
                    setLoading(false);
                }
            });
    };
    const loadInitialJobs = () => {
        // Search Params Coming From Url
        let url_params = getQueryParameters(history.location.search);
        let filters = Object.assign({}, filter_default, url_params);
        let final_filters = removeEmpty(filters);
        let query_string = getQueryString(final_filters);
        setFilter(final_filters);
        SearchJobHandler(query_string);
    };
    const linkedinLoginFunction = () => {
        let urlPath = getQueryParameters(history.location.search);
        let url_data = urlPath.code;
        if (url_data) {
            axios
                .post(`/api/v1/linkedin_login?code=${url_data}`, {})
                .then((response) => {
                    if (response.status === 200) {
                        updateUserFromToken(response.data.access_token, response.data.refresh_token);
                        history.push("/ca/search");
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    history.push("/ca/search");
                })
                .finally(() => loadInitialJobs());
        } else {
            loadInitialJobs();
        }
    };

    useEffect(() => {
        linkedinLoginFunction();
    }, []);
    const updateUserFromToken = (access_token, refresh_token) => {
        let decoded = jwt_decode(access_token);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("expires_at", decoded.exp - 600);
        let user_object = Object.assign({}, default_user_object, {
            authenticated: true,
            user_id: decoded.user_id,
            is_user: decoded.is_user,
            name: decoded.full_name,
        });
        // console.log("user_object :", user_object)
        props._setAuthData(user_object, access_token, refresh_token, decoded.exp - 600);
    };
    const createQueryString = (data) => {
        let query = "";
        Object.entries(data).map(([k, v]) => {
            if (v) {
                query = query + `&${k}=${v}`;
            }
        });
        return query.replace("&", "");
    };
    const paginateBackward = () => {
        // setFirstIndex((totalCount > 1 ? firstIndex - 12 : firstIndex))
        if (parseInt(filter.page) != 1 && parseInt(filter.page) > 0) {
            UpdateUIAndSearch({ ...filter, page: parseInt(filter.page) - 1 });
        }
    };
    const paginateForward = () => {
        // setLastIndex((totalCount > 1 ? lastIndex + 12 : lastIndex))
        // setFirstPageCount((totalCount > 1 ? firstIndex + 12 : firstIndex))
        if (parseInt(filter.page) != paginate.totalPages) {
            UpdateUIAndSearch({ ...filter, page: parseInt(filter.page) + 1 });
        }
    };
    const UpdateUI = (data) => {
        setFilter({ ...filter, ...data });
    };
    const UpdateUIAndSearch = (data) => {

        // Every update in UI will re-render hence re-effecting
        setFilter(data);
        const query_string = createQueryString(data);
        SearchJobHandler(query_string);
    };
    const HandleKeyDown = (e) => {
        if (String(e.key).toLowerCase() == "enter") {
            UpdateUIAndSearch(filter);
        }
    };
    const setSearchLocation = (location, placeid) => {
        let locationValue = location.split(",");
        UpdateUIAndSearch({ ...filter, location: locationValue[0], state: locationValue[1], page: 1 });
    };
    const ClearLocationHander = (value) => {
        if (value.length == 0 && (filter.location !== undefined || filter.location == "")) {
            UpdateUIAndSearch({ ...filter, page: 1, location: "" });
        }
    };
    const CheckboxComponent = (data) => (
        <>
            <input
                className="custom-control-input"
                name={data.name}
                id={data.name}
                type="checkbox"
                aria-label="checkbox"
                checked={filter[data.name]}
                onChange={(e) => UpdateUIAndSearch({ ...filter, [data.name]: e.target.checked, page: 1 })}
                onKeyDown={(e) => e.key == "Enter" && UpdateUIAndSearch({ ...filter, [data.name]: !filter[data.name], page: 1 })}
            />
            <label className={data.labelClass} for={data.name}>
                {data.placeholder}
            </label>
        </>
    );
    const SelectComponent = (data) => (
        <select
            className={data.class}
            name={data.name}
            aria-label="select"
            selected={filter[data.name]}
            onChange={(e) => {
                if (e.target.value == "any") {
                    // UpdateUIAndSearch({ ...filter_default, page: 1 });
                    UpdateUIAndSearch({ ...filter, [data.name]: e.target.value, page: 1 });
                } else {
                    UpdateUIAndSearch({ ...filter, [data.name]: e.target.value, page: 1 });
                }
            }}>
            <option
                value={data.options[0].value}
                disabled={data.options[0].value == null}
                selected={filter[data.name] == data.options[0].value}
                style={{ display: "none" }}>
                {data.options[0].placeholder}
            </option>
            {data.options.slice(1).map((option) => (
                <option
                    value={option.value}
                    // disabled={option.value == null}
                    selected={filter[data.name] == option.value}>
                    {option.placeholder}
                </option>
            ))}
        </select>
    );
    return (
        <div className="col-lg-10 px-0">
            {loading ? (
                <div>
                    <Loader />
                </div>
            ) : (
                <div className="container-fluid px-3">
                    <div className="row mt-5">
                        <div className="col-lg-8">
                            <div class="input-group d-flex ">
                                <input
                                    type="text"
                                    role="form"
                                    aria-label="search jobs"
                                    class="form-control searchJob_input col-md-5 "
                                    name="query"
                                    placeholder={t(props.language?.layout?.jobs_placeholder1)}
                                    value={filter.query}
                                    onChange={(e) => UpdateUI({ ...filter, query: e.target.value })}
                                    onKeyDown={(e) => HandleKeyDown(e)}
                                />
                                <div className="col-md-5 p-0 my-md-0 my-2">
                                    <LocationSearchInput
                                        setLocationCity={setSearchLocation}
                                        locationsJSON={locationsJSON}
                                        clearLocationHander={ClearLocationHander}
                                        initialLocation={filter.location}
                                    />
                                </div>
                                <div class="input-group-append">
                                    <button
                                        class="btn btn-primary rounded-sm"
                                        aria-label="search"
                                        onClick={() => UpdateUIAndSearch({ ...filter, page: 1 })}>
                                        {t(props.language?.layout?.jobs_search)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="job_positions">
                                <p class="text-muted mt-3 ml-0 mb-0">
                                    {t(props.language?.layout?.js_showing)} {firstIndex} - {lastIndex} {t(props.language?.layout?.js_of)} {totalCount > 10 ? Math.ceil(Number(totalCount / 10)) * 10 + "+ " : totalCount} {t(props.language?.layout?.all_jobs_nt)} &nbsp;
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group mt-1 mb-0 d-md-flex d-xs-flex">
                                <div className="form-control-md custom-checkbox pt-2 ml-md-2 pl-md-3 ml-sm-4 pl-sm-3 ml-4 pl-3">
                                    {CheckboxComponent(checkBoxes.remote)}
                                </div>
                                <div className="form-group ml-md-4">{SelectComponent(selectBoxes.posted)}</div>
                                <div className="form-group ml-md-4">{SelectComponent(selectBoxes.type)}</div>
                                <div className="form-group ml-md-4">{SelectComponent(selectBoxes.range)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr className="my-0 border-dark" />
                        </div>
                    </div>
                    <div className="row">
                        {isJobAvailable ? (
                            <div className="col-md-12">
                                <div className="row mt-3">
                                    {data.map((e) => (
                                        <JobCard item={e} loading={loading} is_user={props.user.is_user} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="col-md-4 mx-auto py-5 text-center">
                                <img
                                    src="/svgs/illustrations/EmptyStateListIllustration.svg"
                                    alt="Hero Image"
                                    className="zero-state-image img-fluid"
                                />
                                <h2>{t(props.language?.layout?.all_empty_nt)}</h2>
                            </div>
                        )}
                    </div>
                    {isJobAvailable ? (
                        <div className="row">
                            <div className="col-md-12">
                                <div className="row mb-3 justify-content-end">
                                    <div class="btn-group" role="group" aria-label="Basic example">
                                        <button
                                            type="button"
                                            className={
                                                parseInt(filter.page) < 2
                                                    ? "btn btn-outline-secondary border"
                                                    : "btn btn-primary"
                                            }
                                            disabled={parseInt(filter.page) < 2}
                                            onClick={paginateBackward}>
                                            {t(props.language?.layout?.jobs_previous)}
                                        </button>
                                        {/* <button type="button" className="btn btn-light border" disabled={true}>
                                            {parseInt(filter.page)}
                                        </button> */}
                                        <button
                                            type="button"
                                            className={
                                                parseInt(filter.page) == paginate.totalPages
                                                    ? "btn btn-outline-secondary border"
                                                    : "btn btn-primary"
                                            }
                                            disabled={parseInt(filter.page) == paginate.totalPages}
                                            onClick={paginateForward}>
                                            {t(props.language?.layout?.jobs_next)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, { _setAuthData })(Jobs);
