import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../partials/spinner.jsx";
import { Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import Fuse from "fuse.js";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/scss/main.scss";
import TableData from "./index.jsx";
import { add } from "date-fns";
import { validate, res } from "react-email-validator";
import { renderToLocaleDate } from "../modules/helpers.jsx";
import { useTranslation } from "react-i18next";

const HiringTeam = (props) => {
    const { t } = useTranslation();
    var tableJSON = [];
    props.userRole.role_id == null
        ? (tableJSON = [
            { displayValue: t(props.language?.layout?.team_fullname_nt), key: "first_name" },
            { displayValue: t(props.language?.layout?.team_email_nt), key: "email" },
            { displayValue: t(props.language?.layout?.sp_setting_bd_role), key: "role_type" },
            { displayValue: t(props.language?.layout?.all_organisation_nt), key: "organization" },
            { displayValue: t(props.language?.layout?.portal_nt), key: "is_ca" },
            { displayValue: t(props.language?.layout?.sp_setting_bd_jobtitle), key: "job_title" },
            { displayValue: t(props.language?.layout?.team_createdon_nt), key: "" },
            { displayValue: t(props.language?.layout?.team_updatedon_nt), key: "" },
            { displayValue: t(props.language?.layout?.team_userstatus_nt), key: "" },
            { displayValue: t(props.language?.layout?.sp_jobtitle_actions) },
        ]) :

        (tableJSON = [
            { displayValue: t(props.language?.layout?.team_fullname_nt), key: "first_name" },
            { displayValue: t(props.language?.layout?.team_email_nt), key: "email" },
            { displayValue: t(props.language?.layout?.sp_setting_bd_role), key: "role_type" },
            { displayValue: t(props.language?.layout?.sp_setting_bd_jobtitle), key: "job_title" },
            { displayValue: t(props.language?.layout?.team_createdon_nt), key: "" },
            { displayValue: t(props.language?.layout?.team_updatedon_nt), key: "" },
            { displayValue: t(props.language?.layout?.team_userstatus_nt), key: "" },
            { displayValue: t(props.language?.layout?.sp_jobtitle_actions) },
        ]);

    const { theme } = props;
    const [data, setData] = useState([]);
    let [loading, setLoading] = useState(true);
    const [detailModal, setDetailModal] = useState(false);
    const [query, setQuery] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [edit, setEdit] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [count, setCount] = useState(0);
    const [recentCount, setRecentCount] = useState();
    const [totalCount, setTotalCount] = useState();
    const [deleteModal, setDeleteModal] = useState(false);
    const [skillingPartner, setSkillingPartner] = useState([]);
    const [skillingPartnerAdmin, setSkillingPartnerAdmin] = useState([]);
    const [hiringPartner, setHiringPartner] = useState([]);
    const [hiringPartnerAdmin, sethiringPartnerAdmin] = useState([]);
    const [hiringPartnerAdminId, setHiringPartnerAdminId] = useState("");
    const [hiringPartnerId, setHiringPartnerId] = useState("");
    const [skillingPartnerId, setSkillingPartnerId] = useState("");
    const [skillingPartnerKey, setSkillingPartnerKey] = useState("");
    const [skillingPartnerAdminId, setSkillingPartnerAdminId] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [addMember, setAddMember] = useState({
        title: "",
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        area_code: "",
        job_title: "",
        team_type: "",
        is_active: true
    });
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regexExp = /^[a-zA-Z0-9+.]+$/;

    useEffect(() => {
        getHiringTeamMembers();
        if (props.userRole.role_id == null) {
            skillingPartnerHandler();
            hiringPartnerHandler();
        }
    }, []);

    useEffect(() => {
        if (skillingPartnerId !== "") {
            skillingPartnerAdminHandler()
        }

    }, [skillingPartnerId])

    useEffect(() => {
        if (hiringPartnerId !== "") {
            hiringPartnerAdminHandler()
        }
    }, [hiringPartnerId])

    const addHiringMember = () => {

        let formData = new FormData();
        formData.append("title", addMember.title);
        formData.append("first_name", addMember.first_name);
        formData.append("last_name", addMember.last_name);
        formData.append("email", addMember.email);
        formData.append("phone", addMember.phone);
        formData.append("is_active", addMember.is_active ? 1 : 0);
        formData.append("team_type", props.match.path === "/hiringTeam" ? "hiring" : "recruiter");
        formData.append("area_code", addMember.area_code);
        formData.append("job_title", addMember.job_title);
        formData.append("language_preference", props.languageName);
        {
            props.userRole.role_id == null && (props.match.path === "/team" ?
                (formData.append("tenant", skillingPartnerId),
                    formData.append("admin_partner", skillingPartnerAdminId)) :
                (formData.append("tenant", hiringPartnerId),
                    formData.append("admin_partner", hiringPartnerAdminId)))
        };
        { props.userRole.role_id == null && (props.match.path === "/team" ? formData.append("created_by", skillingPartnerAdminId) : formData.append("created_by", hiringPartnerAdminId)) }
        axios
            .post(`/api/v1/hiring/members`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((response) => {
                if (response.data.status === 201) {
                    toast.success(t(props.language?.layout?.toast117_nt));
                    setDetailModal(false);
                    getHiringTeamMembers();
                }
            })
            .catch((error) => {
                if (error.response.data.status == 400) {
                    toast.error(t(props.language?.layout?.toast118_nt));
                    return;
                } else {
                    toast.error(t(props.language?.layout?.toast58_nt));
                }
            });
    }

    const closeHandler = () => {
        setSpinner(false);
        setDetailModal(false);
        setAddMember({ is_active: true });
        // setAddMember({});
        setEdit({});
        setIsEdit(false);
        setSkillingPartnerAdminId("");
        setSkillingPartnerId("");
        setHiringPartnerAdminId("");
        setHiringPartnerId("");
        setSkillingPartnerAdmin([]);
        sethiringPartnerAdmin([]);
    };

    const AvoidSpace = (event, name) => {
        if (event.key === " " && name.length === 0) {
            event.preventDefault();
        }
    }

    const validateData = (values, id) => {
        if (props.userRole.role_id == null) {
            if (props.match.path === "/team") {
                if (skillingPartner == "" && skillingPartnerAdmin == "") {
                    toast.error(t(props.language?.layout?.toast30_nt));
                    return;
                }
            } else {
                if (hiringPartner == "" && hiringPartnerAdmin == "") {
                    toast.error(t(props.language?.layout?.toast30_nt));
                    return;
                }
            }
        }
        if (!values.first_name || !values.last_name || !values.area_code) {
            toast.error(t(props.language?.layout?.toast30_nt));
            return;
        }
        if(!regexExp.test(values.email.split("@")[0])){
            toast.error(t(props.language?.layout?.toast83_nt));
            return;
        }
        if (!regex.test(values.email)){
            toast.error(t(props.language?.layout?.toast83_nt));
            return;
        }
        // validate(values.email);
        // if (!res) {
        //     toast.error(t(props.language?.layout?.toast83_nt));
        //     return;
        // }
        if (!values.phone || values.phone.length !== 10) {
            toast.error(t(props.language?.layout?.toast79_nt));
            return;
        }
        if (values === addMember) {
            addHiringMember();
            setIsEdit(false);
        } else {
            updateHiringMember(id);
            setDetailModal(false);
            setIsEdit(false);
            setEdit([]);
            setSkillingPartnerAdminId("");
            setSkillingPartnerId("");
            setHiringPartnerAdminId("");
            setHiringPartnerId("");
            setSkillingPartnerAdmin([]);
            sethiringPartnerAdmin([]);
        }
    }

    const updateHiringMember = (id, values, check) => {
        let formData = new FormData();
        formData.append("title", edit.title ? edit.title : (values === undefined ? "" : values.title));
        formData.append("first_name", edit.first_name ? edit.first_name : values.first_name);
        formData.append("last_name", edit.last_name ? edit.last_name : values.last_name);
        formData.append("email", edit.email ? edit.email : values.email);
        formData.append("phone", edit.phone ? edit.phone : values.phone);
        formData.append("is_active", edit.is_active ? edit.is_active : check ? 1 : 0);
        //formData.append("role_type", "member");
        formData.append("area_code", edit.area_code ? edit.area_code : values.area_code);
        formData.append("job_title", edit.job_title ? edit.job_title : (values === undefined ? "" : values.job_title));
        {
            props.userRole.role_id == null && (props.match.path === "/team" ?
                (formData.append("tenant", skillingPartnerId ? skillingPartnerId : values.tenant),
                    formData.append("admin_partner", skillingPartnerAdminId ? skillingPartnerAdminId : values.created_by)) :
                (formData.append("tenant", hiringPartnerId ? hiringPartnerId : values.tenant),
                    formData.append("admin_partner", hiringPartnerAdminId ? hiringPartnerAdminId : values.created_by)))
        };
        { props.userRole.role_id == null && (props.match.path === "/team" ? formData.append("created_by", skillingPartnerAdminId) : formData.append("created_by", hiringPartnerAdminId)) }
        axios
            .put(`/api/v1/hiring/members/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((response) => {
                if (response.data.status === 200) {
                    toast.success(t(props.language?.layout?.toast119_nt));
                    setDetailModal(false);
                    getHiringTeamMembers();
                    setAddMember({ is_active: true });
                }
            })
            .catch((error) => {
                if (error.response.data.status == 400) {
                    toast.error(t(props.language?.layout?.toast118_nt));
                    return;
                } else {
                    toast.error(t(props.language?.layout?.toast58_nt));
                }
            });
    }

    const newMembersCount = (lists) => {
        var num = 0;
        lists.map(list => {
            if (renderToLocaleDate(list.created_at) === renderToLocaleDate(new Date())) {
                num++;
            }
            setCount(num);
        })
    }

    const getHiringTeamMembers = () => {
        let endPoint;
        endPoint = props.match.path === "/hiringTeam" ?
            "api/v1/hiring/members?team_type=hiring" : "api/v1/hiring/members?team_type=recruiter";
        axios
            .get(endPoint, { headers: { Authorization: `Bearer ${props.userToken}` } })
            .then((response) => {
                if (Array.isArray(response.data.data.data)) {
                    setData(response.data.data.data);
                    setSearchData(response.data.data.data);
                    newMembersCount(response.data.data.data);
                    setRecentCount(response.data.data.recent_count);
                    setTotalCount(response.data.data.total_count);
                }
                else {
                    setData([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                if (error) {
                    ServerStatusHandler();
                }
                setLoading(false);
            });
    };

    const updateAddMember = (e, check) => {
        const value = check ? e.target.checked : e.target.name == "phone" ? Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 10) : e.target.value
        isEdit ? setEdit({ ...edit, [e.target.name]: value }) :
            setAddMember({ ...addMember, [e.target.name]: value });
    }

    const SearchInString = (str, query) => {
        return (String(str).trim().toLowerCase()).indexOf(String(query).toLowerCase().trim()) > -1;
    }

    const onSearch = (query) => {
        // if (query === "") {
        //     setQuery(query);
        //     getHiringTeamMembers();
        // } else {
        //     setQuery(query);
        //     const fuse = new Fuse(data, {
        //         keys: ["first_name", "email"],
        //     });
        //     let results = fuse.search(query);
        //     let searchResults = results.map((result) => result.item);
        //     setData(searchResults);
        // }
        setQuery(query);
        if (query === "") {
            setData(searchData);
        }
        else {
            const searchResults = [];
            searchData.forEach(item => {
                if (SearchInString(item.username, query) || SearchInString(item.first_name, query) ||
                SearchInString(item.last_name, query) || SearchInString(item.email, query)) {
                    searchResults.push(item)
                }
            })
            setData(searchResults);
        }
    };

    const actionsToDo = (actionItem, user) => {
        if (actionItem === "remove") {
            setDeleteModal(true);
        }
        if (actionItem === "edit") {
            setEdit(user);
            setIsEdit(true);
            setDetailModal(true);
            setAddMember({ is_active: false });
            props.userRole.role_id == null && (props.match.path === "/team" ?
                (setSkillingPartnerId(user.tenant),
                    setSkillingPartnerAdminId(user.created_by)) :
                (setHiringPartnerId(user.tenant),
                    setHiringPartnerAdminId(user.created_by)))

        }
    };

    const ServerStatusHandler = () => {
        return (
            <div className="col-md-3 mx-auto">
                <div className="text-muted text-center mt-5 pt-5">
                    <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid" />
                    <h3 className="pt-2"> {t(props.language?.layout?.all_empty_nt)}</h3>
                </div>
            </div>
        );
    };
    const hiringPartnerHandler = () => {
        axios
            .get(`api/v1/admin/employee`, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                setHiringPartner(response.data.data)

            });
    };
    const hiringPartnerAdminHandler = () => {
        axios
            .get(`api/v1/admin/employeepartner/${hiringPartnerId}`, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {

                sethiringPartnerAdmin(response.data.data)
            });
    };

    const skillingPartnerHandler = () => {
        axios
            .get(`api/v1/admin/partner`, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                // console.log("respppp", response.data.data)
                setSkillingPartner(response.data.data)

            });
    };
    const skillingPartnerAdminHandler = () => {
        axios
            .get(`api/v1/admin/skillingpartner/${skillingPartnerId}`, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {

                setSkillingPartnerAdmin(response.data.data)
            });
    };

    const changeSkillingPartner = (event) => {
        let skill = skillingPartner.map((item) => {
            if (item.id == event.target.value) {
                setSkillingPartnerId(item.id)
            }
        });
    };

    const changehiringPartner1 = (event) => {
        let hire = hiringPartner.map((item) => {
            if (item.id == event.target.value) {
                setHiringPartnerId(item.id)
            }
        });
    };

    return (
        <div className="col-md-10 px-0">
            <div className="d-flex">
                <div className="container-fluid">
                    <div className="row pt-4 pb-2 px-3 gray-100">
                        <div className="col-md-6 px-md-0">
                            <h4 className="mb-3">
                                {props.match.path === "/team"
                                    ? t(props.language?.layout?.sidebar_team_nt)
                                    : t(props.language?.layout?.sidebar_hiringteam_nt)}
                            </h4>
                            <div className="d-flex align-items-center">
                                <img
                                    className="svg-lg-x2 mr-3 mb-2"
                                    src="svgs/rich_icons/hiring_team.svg"
                                    alt="Hiring Icon"
                                    title="Hiring Icon"
                                />
                                <div>
                                    <p className="mb-1">
                                        {totalCount} {t(props.language?.layout?.all_members_nt)}
                                    </p>
                                    <p>
                                        {count == 0
                                            ? `${recentCount == 0 || recentCount == undefined ? "" : recentCount} ${
                                                  recentCount == 0 || recentCount == undefined
                                                      ? ""
                                                      : recentCount > 1
                                                      ? t(props.language?.layout?.all_memyes_nt)
                                                      : t(props.language?.layout?.all_memsyes_nt)
                                              }`
                                            : `${count} ${
                                                  count > 1 ? "Members added recently" : "Member added recently"
                                              }`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 px-md-0 d-md-flex justify-content-end">
                            <div>
                                <div className="d-md-flex align-items-end my-md-0 my-3">
                                    <div class="form-group-md animated mr-3">
                                        <input
                                            type="text"
                                            class="form-control border-right-0 border-left-0 border-top-0 bg-light rounded-0 border-dark pl-4 pb-1"
                                            id="Search"
                                            name="Search"
                                            placeholder={t(props.language?.layout?.team_search_nt)}
                                            value={query}
                                            onChange={(e) => onSearch(e.target.value)}
                                        />
                                        <div class="d-flex justify-content-start">
                                            <img
                                                src="/svgs/icons_new/search.svg"
                                                alt="search"
                                                class="svg-xs mt-n4 mr-3"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        // type="submit"
                                        className="btn btn-primary ml-md-3 "
                                        onClick={() => setDetailModal(!detailModal)}>
                                        + {t(props.language?.layout?.team_member_nt)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal show={detailModal} onHide={closeHandler} size={"lg"}>
                        <div className="modal-content">
                            <div className="modal-header px-4">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                    {isEdit
                                        ? t(props.language?.layout?.team_update_nt)
                                        : t(props.language?.layout?.team_addnew_nt)}
                                </h5>
                                <button
                                    type="button"
                                    className="close animate-closeicon"
                                    aria-label="Close"
                                    title={t(props.language?.layout?.all_close_nt)}
                                    onClick={closeHandler}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body px-4 pt-0">
                                <div className="d-flex justify-content-between mt-4">
                                    <h6>{t(props.language?.layout?.team_basic_nt)}</h6>
                                    <div className="d-flex">
                                        <p className="mr-3">{t(props.language?.layout?.ep_jobs_active)}</p>
                                        <div class="form-group animated form-primary-bg">
                                            <div class="switch checkbox-switch switch-success mt-n1">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        id="customSwitch1"
                                                        className=""
                                                        name="is_active"
                                                        checked={edit.is_active ? edit.is_active : addMember.is_active}
                                                        onChange={(e) => updateAddMember(e, "check")}
                                                    />
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {props.userRole.role_id == null &&
                                    (props.match.path === "/team" ? (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group animated">
                                                    <label className="form-label-active text-muted" for="title">
                                                        {t(props.language?.layout?.contact_skillingpartner)} *
                                                    </label>

                                                    <select
                                                        className="form-control"
                                                        aria-label="country"
                                                        name="title"
                                                        value={skillingPartnerId}
                                                        onChange={changeSkillingPartner}>
                                                        <option selected="" className="d-none">
                                                            {t(props.language?.layout?.employer_signup_select)}
                                                        </option>
                                                        {skillingPartner.map((item) => (
                                                            <option value={item.id}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group animated">
                                                    <label className="form-label-active text-muted" for="title">
                                                        Skilling Partner Admin *
                                                    </label>

                                                    <select
                                                        className="form-control"
                                                        aria-label="country"
                                                        name="title"
                                                        value={skillingPartnerAdminId}
                                                        onChange={(e) => setSkillingPartnerAdminId(e.target.value)}>
                                                        <option selected="" className="d-none">
                                                            {t(props.language?.layout?.employer_signup_select)}
                                                        </option>
                                                        {skillingPartnerAdmin.map((item) => (
                                                            <option value={item.id}>{item.email}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group animated">
                                                    <label className="form-label-active text-muted" for="title">
                                                        Employer Partner *
                                                    </label>

                                                    <select
                                                        className="form-control"
                                                        aria-label="country"
                                                        name="title"
                                                        value={hiringPartnerId}
                                                        onChange={changehiringPartner1}>
                                                        <option selected="" className="d-none">
                                                            {t(props.language?.layout?.employer_signup_select)}
                                                        </option>
                                                        {hiringPartner.map((item) => (
                                                            <option value={item.id}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group animated">
                                                    <label className="form-label-active text-muted" for="title">
                                                        Employer Partner Admin *
                                                    </label>

                                                    <select
                                                        className="form-control"
                                                        aria-label="country"
                                                        name="title"
                                                        value={hiringPartnerAdminId}
                                                        onChange={(e) => setHiringPartnerAdminId(e.target.value)}>
                                                        <option selected="" className="d-none">
                                                            {t(props.language?.layout?.employer_signup_select)}
                                                        </option>
                                                        {hiringPartnerAdmin.map((item) => (
                                                            <option value={item.id}>{item.email}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                <div className="row">
                                    <div className="col-md-2">
                                        <div className="form-group animated">
                                            <label className="form-label-active text-muted" for="title">
                                                {t(props.language?.layout?.ep_jobs_title)}
                                            </label>

                                            <select
                                                className="form-control"
                                                aria-label="country"
                                                name="title"
                                                value={edit.title ? edit.title : addMember.title}
                                                onChange={(e) => updateAddMember(e)}>
                                                <option selected="" className="d-none">
                                                    {t(props.language?.layout?.employer_signup_select)}
                                                </option>
                                                <option value="mr">
                                                    {t(props.language?.layout?.employer_signup_selectoption_mr)}
                                                </option>
                                                <option value="ms">
                                                    {t(props.language?.layout?.employer_signup_selectoption_ms)}
                                                </option>
                                                <option value="mrs">
                                                    {t(props.language?.layout?.employer_signUp_selectoption_mrs)}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div class="form-group animated">
                                            <label class="form-label-active text-muted">
                                                {t(props.language?.layout?.seeker_firstname)}{" "}
                                            </label>
                                            <input
                                                aria-label="firstname"
                                                class="form-control"
                                                name="first_name"
                                                value={edit.first_name ? edit.first_name : addMember.first_name}
                                                onChange={(e) => updateAddMember(e)}
                                                autocomplete="off"
                                                onKeyDown={(event) => AvoidSpace(event, addMember.first_name)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div class="form-group animated">
                                            <label class="form-label-active text-muted">
                                                {t(props.language?.layout?.seeker_lastname)}{" "}
                                            </label>
                                            <input
                                                class="form-control"
                                                aria-label="lastname"
                                                name="last_name"
                                                value={edit.last_name ? edit.last_name : addMember.last_name}
                                                onChange={(e) => updateAddMember(e)}
                                                autocomplete="off"
                                                onKeyDown={(event) => AvoidSpace(event, addMember.last_name)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 col-12">
                                        <div class="form-group animated">
                                            <label class="form-label-active text-muted">
                                                {t(props.language?.layout?.team_email_nt)}*
                                            </label>
                                            <input
                                                aria-label="emailId"
                                                type="email"
                                                class="form-control"
                                                name="email"
                                                value={edit.email ? edit.email : addMember.email}
                                                onChange={(e) => updateAddMember(e)}
                                                autocomplete="off"
                                                readOnly={isEdit ? true : false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <div className="form-group animated">
                                            <label className="form-label-active text-muted" for="jobtitle">
                                                {t(props.language?.layout?.ep_dashboard_jobtitle)}
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="jobtitle"
                                                name="job_title"
                                                value={
                                                    edit.job_title == "null" || edit.job_title == "undefined"
                                                        ? ""
                                                        : edit.job_title
                                                        ? edit.job_title
                                                        : addMember.job_title
                                                }
                                                onChange={(e) => updateAddMember(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 col-12">
                                        <div className="form-group animated">
                                            <label className="form-label-active text-muted" for="area-code">
                                                {t(props.language?.layout?.ep_setting_bd_areacode)}*
                                            </label>
                                            <select
                                                className="form-control"
                                                aria-label="country"
                                                name="area_code"
                                                value={edit.area_code ? edit.area_code : addMember.area_code}
                                                onChange={(e) => updateAddMember(e)}>
                                                <option selected="" className="d-none">
                                                    {t(props.language?.layout?.employer_signup_select)}
                                                </option>
                                                <option value="USA +1">
                                                    {t(props.language?.layout?.seeker_selectoption_usa)}
                                                </option>
                                                <option value="Canada +1">
                                                    Canada +1
                                                </option>
                                                <option value="Australia +61" disabled>
                                                    {t(props.language?.layout?.seeker_selectoption_austalia)}
                                                </option>
                                                <option value="Brazil +55" disabled>
                                                    {t(props.language?.layout?.seeker_selectoption_brazil)}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <div class="form-group animated">
                                            <label class="form-label-active text-muted">
                                                {t(props.language?.layout?.profile_phoneno_nt)}*
                                            </label>
                                            <input
                                                aria-label="phonenumber"
                                                type="number"
                                                value={edit.phone ? edit.phone : addMember.phone}
                                                onChange={(e) => updateAddMember(e)}
                                                name="phone"
                                                minlength="10"
                                                maxlength="10"
                                                pattern="[0-9]{10}"
                                                required
                                                class="form-control"
                                                autocomplete="off"
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <div className="form-group animated mt-n2">
                                            <label className="form-label-active text-muted" for="role">
                                                Role Type *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="role"
                                                name="job_title"
                                                value="Member"
                                                // onChange={(e) => updateAddMember(e)}
                                                readOnly
                                            /> */}
                                    {/* <select
                                                className="form-control"
                                                aria-label="role_type"
                                                name="role_type"
                                                value={edit.role_type ? edit.role_type : addMember.role_type}
                                                onChange={(e) => updateAddMember(e)}>
                                                <option selected="" className="d-none">Select role</option>
                                                <option value="member">Member</option>
                                                <option value="admin">Administrator</option>
                                            </select> */}
                                    {/* </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="modal-footer py-3 px-4">
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-outline-secondary mr-3 px-5" onClick={closeHandler}>
                                        {t(props.language?.layout?.ep_setting_cd_cancel)}
                                    </button>
                                    {isEdit ? (
                                        <button
                                            className="btn btn-primary brand-color px-5"
                                            onClick={() => validateData(edit, edit.id)}>
                                            {t(props.language?.layout?.all_update_nt)}
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary brand-color px-5"
                                            onClick={() => validateData(addMember)}>
                                            {t(props.language?.layout?.ep_setting_cd_save)}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <div className="row">
                        <div className="col-md-12 px-3">
                            {/* <div className="card border-0">
                                <TableData
                                    data={data}
                                    tableJSON={tableJSON}
                                    actionsToPerform={actionsToDo}
                                />
                            </div> */}
                            <div className="card border-0">
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <Fragment>
                                        {data && data.length !== 0 ? (
                                            <TableData
                                                data={data}
                                                tableJSON={tableJSON}
                                                actionsToPerform={actionsToDo}
                                                updateHiringMember={updateHiringMember}
                                            />
                                        ) : (
                                            ServerStatusHandler()
                                        )}
                                    </Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userToken: state.authInfo.userToken,
        userRole: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(HiringTeam);
