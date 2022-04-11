import React, { Component } from "react";
import Step1 from "./AddJobDetails.jsx";
import Step2 from "./AddScreeningQuestions.jsx";
import Step3 from "./AddWorkFlow.jsx";
import Axios from "axios";
import { toast } from "react-toastify";
import ProgressBar from "./AddJobHeader.jsx";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { _languageName } from "../../actions/actionsAuth.jsx";

class AddJobMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            finalstep: false,
            frenchLang: false,
            spanishLang: false,
            frenchLang1: false,
            spanishLang1: false,
            englishLang1: false,
            jobDetails: {
                title: "",
                title_esp: "",
                title_fr: "",
                description: "",
                description_esp: "",
                description_fr: "",
                department: "",
                industry: "",
                jobType: "",
                minExperience: 0,
                maxExperience: 3,
                education: "",
                jobFunction: "",
                skillsTags: [],
                skillsTags_esp: [],
                skillsTags_fr: [],
                skillsSuggestions: [],
                jobTemplate: [],
                jobDescription: "",
                jobTemplateDescription: "",
                jobTemplateDescription_esp: "",
                jobTemplateDescription_fr: "",
                externalJobLink: ""
            },
            screeningQuestions: {
                editMailsData: [],
                setMailId: [],
                salaryType: "",
                hiringmanagers: "",
                startDate: "",
                endDate: "",
                positions: "",
                minSalary: "",
                maxSalary: "",
                publishdays: 14,
                currency: "",
                linkedIn: false,
                remoteLocation: false,
                contactName: "",
                contactEmail: "",
                checked: true,
                locationChecked: false,
                locationCity: "",
                locationCityDetails: "",
                locationState: "",
                locationCountry: this.props?.user?.is_cananda ? "Canada" : "USA",
                locationValue: "",
                latitude: "",
                longitude: "",
                placeId: "",
                locationDisabled: true,
                locationEdit: false,
                jobBoardsLinkedIn: false,
                jobBoardsBroadbean: false,
                jobBoardZipRecruiter: false,
            },
            dropdownDepartment: [],
            dropdownIndustry: [],
            dropdownJobTypes: [],
            dropdownEducation: [],
            dropdownHiringManagers: [],
            buttonDisabled: false,
            jobSlug: "",
        };
    }
    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    };
    componentDidMount() {
        this.getdata();
        this.getSkillsData();
        if (this.props.slug) {
            this.getAllData(this.props.slug);
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.languageName !== this.props.languageName) {
            this.getdata();
        }
    }
    updateJobDetails = (key, value) => {
        let jobDetails = this.state.jobDetails;
        jobDetails[key] = value;
        this.setState({ jobDetails });
    };
    updateScreeningQuestions = (key, value) => {
        let screeningQuestions = this.state.screeningQuestions;
        screeningQuestions[key] = value;
        this.setState({ screeningQuestions });
    };

    frenchForQubecState = (value) => {
        this.setState({ frenchLang1: value });
    }

    editlanguagehandler = (val, key) => {
        if (val == "spanishText") {
            this.setState({ spanishLang1: !this.state.spanishLang1 })
        }
        if (val == "frenchText") {
            this.setState({ frenchLang1: !this.state.frenchLang1 })
            if (key == false) {
                this.props?._languageName("en")
                this.setState({ englishLang1: true })
            }
        } if (val == "englishText") {
            this.setState({ englishLang1: key })
            if (key == false) {
                this.props?._languageName("fr")
                this.setState({ frenchLang1: true })
            }
        }
        if (val == "spanishT") {
            this.setState({ spanishLang: true, frenchLang: false })
        }
        if (val == "frenchT") {
            this.setState({ frenchLang: true, spanishLang: false })
        }
        if (val == "englishT") {
            this.setState({ frenchLang: false, spanishLang: false })
        }
    };

    checkHandler = () => {
        if (this.state?.jobDetails?.title_esp == "") {
            this.setState({ spanishLang1: false })
        } else {
            this.setState({ spanishLang1: true })
        }
        if (this.state?.jobDetails?.title_fr == "") {
            this.setState({ frenchLang1: false })
        }
        else {
            this.setState({ frenchLang1: true })
        }
    }
    getdata = () => {
        Axios.get(`api/v1/recruiter/api_dataset?lang=${this.props?.languageName}`, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        }).then((response) => {
            this.setState({ dropdownDepartment: response.data.data.categories });
            this.setState({ dropdownJobTypes: response.data.data.job_types });
            this.setState({ dropdownEducation: response.data.data.education });
            this.setState({ dropdownIndustry: response.data.data.industries });
            this.setState({ dropdownHiringManagers: response.data.data.hiring_managers });
        });
    };
    getAllData = (slug) => {
        Axios.get(`api/v1/recruiter/job/create/${slug}`, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        }).then((response) => {
            // console.log(response.data.data[0].users, "res");
            // response.data.data[0].title_esp == null?null:this.setState({spanishLang:true}),
            // response.data.data[0].title_fr == null?"": this.setState({frenchLang:true}),
            this.setState({
                jobDetails: {
                    description: response.data.data[0].description == null ? "" : response.data.data[0].description,
                    description_esp: response.data.data[0].description_esp == null ? "" : response.data.data[0].description_esp,
                    description_fr: response.data.data[0].description_fr == null ? "" : response.data.data[0].description_fr,
                    title: response.data.data[0].title == null ? "" : response.data.data[0].title,
                    title_esp: response.data.data[0].title_esp == null ? "" : response.data.data[0].title_esp,
                    title_fr: response.data.data[0].title_fr == null ? "" : response.data.data[0].title_fr,

                    department: response.data.data[0].category == null ? "" : response.data.data[0].category,
                    industry: response.data.data[0].industry == null ? "" : response.data.data[0].industry,
                    jobType: response.data.data[0].job_type == null ? "" : response.data.data[0].job_type,
                    minExperience:
                        response.data.data[0].experience_min == null ? "" : response.data.data[0].experience_min,
                    maxExperience:
                        response.data.data[0].experience_max == null ? "" : response.data.data[0].experience_max,
                    education: response.data.data[0].qualification == null ? "" : response.data.data[0].qualification,

                    skillsTags: response.data.data[0].job_skill_en == null ? "" : response.data.data[0].job_skill_en,
                    skillsTags_esp: response.data.data[0].job_skill_esp == null ? "" : response.data.data[0].job_skill_esp,
                    skillsTags_fr: response.data.data[0].job_skill_fr == null ? "" : response.data.data[0].job_skill_fr,
                    externalJobLink:
                        response.data.data[0].custom_field1 == null ? "" : response.data.data[0].custom_field1,
                },
                screeningQuestions: {
                    editMailsData: response.data.data[0].users,
                    // setMailId:data.data[0].users
                    salaryType:
                        response.data.data[0].salary_frequency == null ? "" : response.data.data[0].salary_frequency,
                    hiringmanagers:
                        response.data.data[0].job_created_by == null ? "" : response.data.data[0].job_created_by,
                    startDate: response.data.data[0].job_start_date == null ? "" : response.data.data[0].job_start_date,
                    endDate: response.data.data[0].expires_in == null ? "" : response.data.data[0].expires_in,
                    positions: response.data.data[0].openings == null ? "" : response.data.data[0].openings,
                    minSalary: response.data.data[0].salary_min == null ? "" : response.data.data[0].salary_min,
                    maxSalary: response.data.data[0].salary_max == null ? "" : response.data.data[0].salary_max,
                    publishdays:
                        response.data.data[0].publish_job_in_days == null
                            ? ""
                            : response.data.data[0].publish_job_in_days,
                    currency: response.data.data[0].currency == null ? "" : response.data.data[0].currency,
                    linkedIn: response.data.data[0].linkedin,
                    checked:
                        response.data.data[0].linkedin == true
                            ? response.data.data[0].linkedin
                            : response.data.data[0].jobBoardZipRecruiter == true
                                ? response.data.data[0].jobBoardZipRecruiter
                                : response.data.data[0].broadbean,
                    jobBoardZipRecruiter: response.data.data[0].zip_recruiter,
                    jobBoardsBroadbean: response.data.data[0].broadbean,
                    jobBoardsLinkedIn: response.data.data[0].linkedin,
                    remoteLocation: response.data.data[0].remote_location,
                    locationChecked:
                        response.data.data[0].remote_location == null ? "" : response.data.data[0].remote_location,
                    locationCountry: response.data.data[0].country,
                    locationState: response.data.data[0].state == null ? "" : response.data.data[0].state,
                    locationCity: response.data.data[0].display_name == null ? "" : response.data.data[0].display_name,
                    locationDisabled: response.data.data[0].country == "" ? true : false,
                    locationEdit: true,

                },
                jobSlug: response.data.data[0].slug,
            });
            this.props?.editJobIs && this.checkHandler()
        });
    };
    getJobTemplateData = (query) => {
        Axios.get(`api/v1/recruiter/job/title?query=${query}`, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        }).then((response) => {
            // console.log(response.data.data, "titles");
            this.updateJobDetails("jobTemplate", response.data.data);
        });
    };
    getJobTemplateDescription = (id) => {
        Axios.get(`api/v1/recruiter/job/template/${id}`, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        }).then((response) => {
            this.updateJobDetails(this.state.spanishLang ? "jobTemplateDescription_esp" : (this.state.frenchLang ? "jobTemplateDescription_fr" : "jobTemplateDescription"), response.data.data.description);
        });
    };

    getSkillsData = (query) => {
        let apiEndpoint;
        if (query) {
            // this.props.languageName
            apiEndpoint = `api/v1/skill/dataset?query=${query}&&lang=${this.state.spanishLang ? "esp" : (this.state.frenchLang ? "fr" : "en")}`;
        } else {
            apiEndpoint = `api/v1/skill/dataset?lang=${this.state.spanishLang ? "esp" : (this.state.frenchLang ? "fr" : "en")}`;
        }
        Axios.get(apiEndpoint, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        }).then((response) => {
            // console.log(response.data.data);
            this.updateJobDetails("skillsSuggestions", response.data.data);
        });
    };

    postData = (status) => {
        // if (this.state.spanishLang1 && this.state.jobDetails.title_esp == "") {
        //     toast.error(this.props.t(this.props.language?.layout?.toast134_nt));
        //     return;
        // }
        // if (this.state.spanishLang1 && this.state.jobDetails.description_esp == "") {
        //     toast.error(this.props.t(this.props.language?.layout?.toast135_nt));
        //     return;
        // }
        // if (this.state.frenchLang1 && this.state.jobDetails.title_fr == "") {
        //     toast.error(this.props.t(this.props.language?.layout?.toast136_nt));
        //     return;
        // } if (this.state.frenchLang1 && this.state.jobDetails.description_fr == "") {
        //     toast.error(this.props.t(this.props.language?.layout?.toast137_nt));
        //     return;
        // }
        if (
            this.state.screeningQuestions.locationState == "QC" &&
            this.state.frenchLang1 == false
        ) {
            toast.error("Please select French language");
            return;
        }
        let interviewQuestions = [{ "id": "legally_authorized", "type": "select", "question": "Are you legally authorized to work in the country of job location?", "options": [{ "label": "Yes", "value": "Yes" }, { "label": "No", "value": "No" }] }, { "id": "visa_sponsorship", "type": "select", "question": "Will you now, or ever, require VISA sponsorship in order to work in the country of job location?", "options": [{ "label": "Yes", "value": "Yes" }, { "label": "No", "value": "No" }] }]
        this.setState({ finalstep: true, buttonDisabled: true });
        let obj = [...this.state.jobDetails.skillsTags, ...this.state.jobDetails.skillsTags_esp, ...this.state.jobDetails.skillsTags_fr]
        let formData = new FormData();
        formData.append(this.state.spanishLang ? "title_esp" : (this.state.frenchLang ? "title_fr" : "title"), this.state.spanishLang ? this.state.jobDetails.title_esp : (this.state.frenchLang ? this.state.jobDetails.title_fr : this.state.jobDetails.title));
        formData.append("status", status);
        formData.append("title_esp", this.state.jobDetails.title_esp);
        formData.append("title_fr", this.state.jobDetails.title_fr);
        formData.append("title", this.state.jobDetails.title);
        formData.append("description_esp", this.state.jobDetails.description_esp);
        formData.append("description_fr", this.state.jobDetails.description_fr);
        formData.append("description", this.state.jobDetails.description);
        formData.append("category", this.state.jobDetails.department);
        formData.append("industry", this.state.jobDetails.industry);
        formData.append(this.state.spanishLang ? "description_esp" : (this.state.frenchLang ? "description_fr" : "description"), this.state.spanishLang ? this.state.jobDetails.description_esp : (this.state.frenchLang ? this.state.jobDetails.description_fr : this.state.jobDetails.description));
        formData.append("job_type", this.state.jobDetails.jobType);
        formData.append("experience_min", this.state.jobDetails.minExperience);
        formData.append("custom_field1", this.state.jobDetails.externalJobLink);
        formData.append("skills", JSON.stringify(obj));
        // formData.append("skills", this.state.spanishLang ? JSON.stringify(this.state?.jobDetails?.skillsTags_esp) : (this.state.frenchLang ? JSON.stringify(this.state.jobDetails.skillsTags_fr) : JSON.stringify(this.state.jobDetails.skillsTags)));
        formData.append("lang", (this.state.spanishLang ? "esp" : (this.state.frenchLang ? "fr" : "en")));
        formData.append("experience_max", this.state.jobDetails.maxExperience);
        // formData.append("custom_field1", this.state.jobDetails.jobFunction);
        formData.append("user", this.state.screeningQuestions.hiringmanagers);
        formData.append("qualification", this.state.jobDetails.education);
        formData.append("display_name", this.state.screeningQuestions.locationCity);
        formData.append("state", this.state.screeningQuestions.locationState);
        formData.append("country", this.state.screeningQuestions.locationCountry);
        formData.append("latitude", this.state.screeningQuestions.latitude);
        formData.append("longitude", this.state.screeningQuestions.longitude);
        {
            this.state.screeningQuestions.checked
                ? formData.append("zip_recruiter", this.state.screeningQuestions.jobBoardZipRecruiter)
                : "";
        }
        {
            this.state.screeningQuestions.checked
                ? formData.append("broadbean", this.state.screeningQuestions.jobBoardsBroadbean)
                : "";
        }
        {
            this.state.screeningQuestions.checked
                ? formData.append("linkedin", this.state.screeningQuestions.jobBoardsLinkedIn)
                : "";
        }
        formData.append("place_id", this.state.screeningQuestions.placeId);
        {
            this.state.screeningQuestions.checked
                ? formData.append("publish_job_in_days", this.state.screeningQuestions.publishdays)
                : "";
        }
        formData.append("currency", this.state.screeningQuestions.currency);
        // formData.append("linkedin", this.state.screeningQuestions.linkedIn);
        formData.append("remote_location", this.state.screeningQuestions.remoteLocation);
        {
            status == "draft" ? "" : formData.append("job_start_date", this.state.screeningQuestions.startDate);
        }
        formData.append("expires_in", this.state.screeningQuestions.endDate);
        formData.append("contact_name", this.state.dropdownHiringManagers[0].username);
        formData.append("contact_email", this.state.dropdownHiringManagers[0].email);
        formData.append("salary_frequency", this.state.screeningQuestions.salaryType);
        formData.append("openings", this.state.screeningQuestions.positions);
        formData.append("salary_min", this.state.screeningQuestions.minSalary);
        formData.append("salary_max", this.state.screeningQuestions.maxSalary);
        formData.append("interview_questions", JSON.stringify(interviewQuestions));
        // formData.append("users", this.state.screeningQuestions.setMailId);
        formData.append("users", "");

        Axios.post("api/v1/recruiter/job/create", formData, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                toast.success(this.props.t(this.props.language?.layout?.toast125_nt));
                setTimeout(() => (window.location.href = "/jobs"), 5000);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                this.setState({ buttonDisabled: false });
            });
    };
    updateJobData = (status) => {
        if (
            this.state.screeningQuestions.locationState == "QC" &&
            this.state.frenchLang1 == false
        ) {
            toast.error("Please select French language");
            return;
        }
        let interviewQuestions = [{ "id": "legally_authorized", "type": "select", "question": "Are you legally authorized to work in the country of job location?", "options": [{ "label": "Yes", "value": "Yes" }, { "label": "No", "value": "No" }] }, { "id": "visa_sponsorship", "type": "select", "question": "Will you now, or ever, require VISA sponsorship in order to work in the country of job location?", "options": [{ "label": "Yes", "value": "Yes" }, { "label": "No", "value": "No" }] }]
        this.setState({ finalstep: true, buttonDisabled: true });
        let formData = new FormData();
        formData.append(this.state.spanishLang ? "title_esp" : (this.state.frenchLang ? "title_fr" : "title"), this.state.spanishLang ? this.state.jobDetails.title_esp : (this.state.frenchLang ? this.state.jobDetails.title_fr : this.state.jobDetails.title));
        formData.append("status", status);
        formData.append("category", this.state.jobDetails.department);
        formData.append("industry", this.state.jobDetails.industry);
        formData.append(this.state.spanishLang ? "description_esp" : (this.state.frenchLang ? "description_fr" : "description"), this.state.spanishLang ? this.state.jobDetails.description_esp : (this.state.frenchLang ? this.state.jobDetails.description_fr : this.state.jobDetails.description));
        formData.append("custom_field1", this.state.jobDetails.externalJobLink);
        formData.append("job_type", this.state.jobDetails.jobType);
        formData.append(
            "experience_min",
            this.state.jobDetails.minExperience == "" ? "0" : this.state.jobDetails.minExperience
        );
        formData.append("skills", this.state.spanishLang ? JSON.stringify(this.state.jobDetails.skillsTags_esp) : (this.state.frenchLang ? JSON.stringify(this.state.jobDetails.skillsTags_fr) : JSON.stringify(this.state.jobDetails.skillsTags)));
        formData.append("lang", (this.state.spanishLang ? "esp" : (this.state.frenchLang ? "fr" : "en")));

        formData.append(
            "experience_max",
            this.state.jobDetails.maxExperience == "" ? "0" : this.state.jobDetails.maxExperience
        );
        // formData.append("custom_field1", this.state.jobDetails.jobFunction);
        formData.append("user", this.state.screeningQuestions.hiringmanagers);
        formData.append("qualification", this.state.jobDetails.education);
        formData.append("display_name", this.state.screeningQuestions.locationCity);
        formData.append("state", this.state.screeningQuestions.locationState);
        formData.append(
            "country",
            this.state.screeningQuestions.locationCountry == null ? "" : this.state.screeningQuestions.locationCountry
        );
        formData.append(
            "latitude",
            this.state.screeningQuestions.latitude == undefined ? "" : this.state.screeningQuestions.latitude
        );
        formData.append(
            "longitude",
            this.state.screeningQuestions.longitude == undefined ? "" : this.state.screeningQuestions.longitude
        );
        formData.append(
            "place_id",
            this.state.screeningQuestions.placeId == undefined ? "" : this.state.screeningQuestions.placeId
        );
        {
            this.state.screeningQuestions.checked
                ? formData.append("publish_job_in_days", this.state.screeningQuestions.publishdays)
                : "";
        }
        {
            this.state.screeningQuestions.checked
                ? formData.append("zip_recruiter", this.state.screeningQuestions.jobBoardZipRecruiter)
                : "";
        }
        {
            this.state.screeningQuestions.checked
                ? formData.append("broadbean", this.state.screeningQuestions.jobBoardsBroadbean)
                : "";
        }
        {
            this.state.screeningQuestions.checked
                ? formData.append("linkedin", this.state.screeningQuestions.jobBoardsLinkedIn)
                : "";
        }
        formData.append("currency", this.state.screeningQuestions.currency);
        // formData.append("linkedin", this.state.screeningQuestions.linkedIn);
        formData.append("remote_location", this.state.screeningQuestions.remoteLocation);
        {
            status == "draft" ? "" : formData.append("job_start_date", this.state.screeningQuestions.startDate);
        }
        formData.append("expires_in", this.state.screeningQuestions.endDate);
        formData.append("contact_name", this.state.dropdownHiringManagers[0].username);
        formData.append("contact_email", this.state.dropdownHiringManagers[0].email);
        formData.append("salary_frequency", this.state.screeningQuestions.salaryType);
        formData.append("interview_questions", JSON.stringify(interviewQuestions));
        formData.append("openings", this.state.screeningQuestions.positions);
        formData.append(
            "salary_min",
            this.state.screeningQuestions.minSalary == "" ? "0" : this.state.screeningQuestions.minSalary
        );
        formData.append(
            "salary_max",
            this.state.screeningQuestions.maxSalary == "" ? "0" : this.state.screeningQuestions.maxSalary
        );
        // formData.append("users", this.state.screeningQuestions.setMailId);
        formData.append("users", "");

        Axios.put(`api/v1/recruiter/job/create/${this.state.jobSlug}`, formData, {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                toast.success(this.props.t(this.props.language?.layout?.toast133_nt));

                setTimeout(() => (window.location.href = "/jobs"), 5000);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                this.setState({ buttonDisabled: false });
            });
    };

    _next = () => {
        var validUrl = this.state.jobDetails.externalJobLink != undefined && this.state.jobDetails.externalJobLink?.match(
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
        );
        if (this.state.englishLang1 && this.state.jobDetails.title == "") {
            toast.error(this.props.t(this.props.language?.layout?.toast138_nt));
            return;
        }

        if (this.state.spanishLang == true && this.state.jobDetails.title_esp == "") {
            toast.error(this.props.t(this.props.language?.layout?.toast134_nt));
            return;
        }
        if (this.state.frenchLang1 == true && this.state.jobDetails.title_fr == "") {
            toast.error(this.props.t(this.props.language?.layout?.toast136_nt));
            return;
        }
        if (this.state.englishLang1 && this.state.jobDetails.description == "" || this.state.englishLang1 && this.state.jobDetails.description == "<p><br></p>") {
            toast.error(this.props.t(this.props.language?.layout?.toast138_nt));
            return;
        }
        if (this.state.spanishLang == true && this.state.jobDetails.description_esp == "" || this.state.spanishLang == true && this.state.jobDetails.description_esp == "<p><br></p>") {
            toast.error(this.props.t(this.props.language?.layout?.toast135_nt));
            return;
        }
        if (this.state.frenchLang == true && this.state.jobDetails.description_fr == "" || this.state.frenchLang == true && this.state.jobDetails.description_fr == "<p><br></p>") {
            toast.error(this.props.t(this.props.language?.layout?.toast137_nt));
            return;
        }
        // if (this.state.spanishLang == false && this.state.frenchLang == false && this.state.jobDetails.title === "") {
        //     toast.error(this.props.t(this.props.language?.layout?.toast62_nt));
        //     return;
        // }
        // if (this.state.spanishLang == true && this.state.jobDetails.title_esp === "") {
        //     toast.error(this.props.t(this.props.language?.layout?.toast62_nt));
        //     return;
        // }
        // if (this.state.frenchLang == true && this.state.jobDetails.title_fr === "") {
        //     toast.error(this.props.t(this.props.language?.layout?.toast62_nt));
        //     return;
        // }

        // if (this.state.spanishLang == false && this.state.frenchLang == false && this.state.jobDetails.description === "" || this.state.spanishLang == false && this.state.frenchLang == false && this.state.jobDetails.description == "<p><br></p>") {
        //     toast.error(this.props.t(this.props.language?.layout?.toast64_nt));
        //     return;
        // }
        // if (this.state.spanishLang == true && this.state.jobDetails.description_esp === "" || this.state.spanishLang == true && this.state.jobDetails.description_esp == "<p><br></p>") {
        //     toast.error(this.props.t(this.props.language?.layout?.toast64_nt));
        //     return;
        // }
        // if (this.state.frenchLang == true && this.state.jobDetails.description_fr === "" || this.state.frenchLang == true && this.state.jobDetails.description_fr == "<p><br></p>") {
        //     toast.error(this.props.t(this.props.language?.layout?.toast64_nt));
        //     return;
        // }
        if (this.state.jobDetails.department === "") {
            toast.error(this.props.t(this.props.language?.layout?.toast63_nt));
            return;
        }
        if (this.state.jobDetails.jobType === "") {
            toast.error(this.props.t(this.props.language?.layout?.toast65_nt));
            return;
        }
        if (Number(this.state.jobDetails.minExperience) > Number(this.state.jobDetails.maxExperience)) {
            toast.error(this.props.t(this.props.language?.layout?.toast66_nt));
            return;
        }
        if (Number(this.state.screeningQuestions.minSalary) > Number(this.state.screeningQuestions.maxSalary)) {
            toast.error(this.props.t(this.props.language?.layout?.toast67_nt));
            return;
        }

        if (this.state.currentStep == 2 && this.state.screeningQuestions.checked == true) {
            if (this.state.screeningQuestions.publishdays === "") {
                toast.error(this.props.t(this.props.language?.layout?.toast68_nt));
                return;
            }
        }
        if (this.state.jobDetails.externalJobLink !== "") {
            if (validUrl == null) {
                toast.error(this.props.t(this.props.language?.layout?.toast69_nt));
                return;
            }
        }
        if (
            this.state.currentStep == 2 &&
            this.state.screeningQuestions.locationCountry == "" &&
            this.state.screeningQuestions.remoteLocation == false
        ) {
            toast.error(this.props.t(this.props.language?.layout?.toast70_nt));
            return;
        }
        if (
            this.state.currentStep == 2 &&
            this.state.screeningQuestions.locationState == "" &&
            this.state.screeningQuestions.remoteLocation == false
        ) {
            toast.error(this.props.t(this.props.language?.layout?.toast71_nt));
            return;
        }
        if (
            this.state.currentStep == 2 &&
            this.state.screeningQuestions.locationCity == "" &&
            this.state.screeningQuestions.remoteLocation == false
        ) {
            toast.error(this.props.t(this.props.language?.layout?.toast72_nt));
            return;
        }
        if (
            this.state.screeningQuestions.locationState == "QC" &&
            this.state.frenchLang1 == false
        ) {
            toast.error("Please select French language");
            return;
        }
        // if (this.state.currentStep == 2 && this.state.screeningQuestions.salaryType == "") {
        //     toast.error("Please select salary type");
        //     return;
        // }
        // if (
        //     this.state.currentStep == 2 &&
        //     this.state.screeningQuestions.minSalary == "" &&
        //     this.state.screeningQuestions.maxSalary == ""
        // ) {
        //     toast.error("Please enter salary");
        //     return;
        // }
        let currentStep = this.state.currentStep;
        currentStep = currentStep >= 2 ? 3 : currentStep + 1;
        this.setState({
            currentStep: currentStep,
        });
    };
    _prev = () => {
        let currentStep = this.state.currentStep;
        currentStep = currentStep <= 1 ? 1 : currentStep - 1;
        this.setState({
            currentStep: currentStep,
        });
    };
    resetLang = () => {
        this.setState({
            jobDetails: {
                ...this.state.jobDetails,
                title: "",
                description: "",
                skillsTags: [],
                skillsSuggestions: [],
            },
        });

    };

    _resetJobDetails = () => {
        this.setState({
            jobDetails: {
                title: "",
                title_esp: "",
                title_fr: "",
                description: "",
                description_esp: "",
                description_fr: "",
                department: "",
                industry: "",
                jobType: "",
                minExperience: 0,
                maxExperience: 3,
                education: "",
                jobFunction: "",
                skillsTags: [],
                skillsTags_esp: [],
                skillsTags_fr: [],
                skillsSuggestions: [],
                jobTemplate: [],
                jobDescription: "",
                jobTemplateDescription: "",
                jobTemplateDescription_esp: "",
                jobTemplateDescription_fr: "",
                externalJobLink: "",
            },
        });
    };

    _resetScreeningQuestions = () => {
        this.setState({
            screeningQuestions: {
                salaryType: "",
                hiringmanagers: "",
                startDate: "",
                endDate: "",
                positions: "",
                minSalary: "",
                maxSalary: "",
                publishdays: "",
                currency: "",
                linkedIn: false,
                remoteLocation: false,
                contactName: "",
                contactEmail: "",
                checked: false,
                locationChecked: false,
                locationCity: "",
                locationState: "",
                locationCountry: "",
                locationValue: "",
                latitude: "",
                longitude: "",
                placeId: "",
                locationDisabled: true,
                locationEdit: false,
            },
        });
    };
    render() {
        const { t } = this.props;
        return (
            <div className="col-md-10 px-0">
                <ProgressBar
                    currentStep={this.state.currentStep}
                    finalstep={this.state.finalstep}
                    edit={this.props.slug}
                />
                <div>
                    <Step1
                        currentStep={this.state.currentStep}
                        language={this.props?.language}
                        languageName={this.props?.languageName}
                        handleChange={this.handleChange}
                        next={this._next}
                        edit={this.state.jobSlug}
                        updateJobDetails={this.updateJobDetails}
                        editlanguagehandler={this.editlanguagehandler}
                        closebox={this.closebox}
                        jobDetails={this.state.jobDetails}
                        dropdownDepartment={this.state.dropdownDepartment}
                        dropdownIndustry={this.state.dropdownIndustry}
                        dropdownJobTypes={this.state.dropdownJobTypes}
                        dropdownEducation={this.state.dropdownEducation}
                        reset={this._resetJobDetails}
                        getSkillsData={this.getSkillsData}
                        getJobTemplateData={this.getJobTemplateData}
                        getJobTemplateDescription={this.getJobTemplateDescription}
                        editJobIs={this.props?.editJobIs}
                        spanishLang={this.state.spanishLang}
                        frenchLang={this.state.frenchLang}
                        resetLang={this.resetLang}
                        editHandler={this.editHandler}
                        spanishLang1={this.state.spanishLang1}
                        frenchLang1={this.state.frenchLang1}
                        englishLang1={this.state.englishLang1}
                        _languageName={this.props._languageName}
                        frenchForQubecState={this.frenchForQubecState}
                    />
                    <Step2
                        currentStep={this.state.currentStep}
                        language={this.props.language}
                        handleChange={this.handleChange}
                        languageName={this.props.languageName}
                        next={this._next}
                        prev={this._prev}
                        updateScreeningQuestions={this.updateScreeningQuestions}
                        screeningQuestions={this.state.screeningQuestions}
                        dropdownHiringManagers={this.state.dropdownHiringManagers}
                        reset={this._resetScreeningQuestions}
                        postLocations={this.postLocations}
                        userToken={this.props.userToken}
                        editJobIs={this.props?.editJobIs}
                        spanishLang={this.state.spanishLang}
                        frenchLang={this.state.frenchLang}
                        spanishLang1={this.state.spanishLang1}
                        englishLang1={this.state.englishLang1}
                        frenchLang1={this.state.frenchLang1}
                        _languageName={this.props._languageName}
                        editlanguagehandler={this.editlanguagehandler}
                        frenchForQubecState={this.frenchForQubecState}
                    />
                    <Step3
                        currentStep={this.state.currentStep}
                        handleChange={this.handleChange}
                        prev={this._prev}
                        postData={this.postData}
                        languageName={this.props.languageName}
                        buttonDisabled={this.state.buttonDisabled}
                        edit={this.state.jobSlug}
                        updateJobData={this.updateJobData}
                        updateHiringMember={this.updateHiringMember}
                        updateJobDetails={this.updateJobDetails}
                        editlanguagehandler={this.editlanguagehandler}
                        jobDetails={JSON.parse(JSON.stringify(this.state.jobDetails))}
                        reset={this._resetJobDetails}
                        getSkillsData={this.getSkillsData}
                        spanishLang1={this.state.spanishLang1}
                        englishLang1={this.state.englishLang1}
                        frenchLang1={this.state.frenchLang1}
                        spanishLang={this.state.spanishLang}
                        frenchLang={this.state.frenchLang}
                        getJobTemplateData={this.getJobTemplateData}
                        getJobTemplateDescription={this.getJobTemplateDescription}
                        _languageName={this.props._languageName}
                        frenchForQubecState={this.frenchForQubecState}
                    />
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, { _languageName })(withTranslation()(AddJobMain));
