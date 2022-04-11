import React, { useEffect, useState, useRef } from "react";

import { getUserDetails, checkUserEmail, jobApply, resumeUpload, checkApply } from "./API/api.js";
import ChatHistory from "./Components/ChatHistory.jsx";
import Input from "./Components/Input.jsx";
import { renderToLocaleDate } from "../modules/helpers.jsx";
import { InputProvider } from "./Context/InputContext";
import { validate, res } from "react-email-validator";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";
import { _setAuthData } from "../actions/actionsAuth.jsx";
import jwt_decode from "jwt-decode";
import { useTranslation } from "react-i18next";
//Then inside your component

// {
//     created_at: 12,
//     message: 'Hi'
// }
const empty_user_object = { email: null, name: null, resume: null, phone: null };
const Chatbot = (props) => {
    const { t } = useTranslation();
    const [user, setUser] = useState(empty_user_object);
    const [queue, setQueue] = useState([]);
    const [chats, setChats] = useState([]);
    const [inputType, setInputType] = useState("text");

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [requiredKeys, setRequiredKeys] = useState([]);
    const [formValues, setFormValues] = useState("");
    const [typing, setTyping] = useState(false);
    const [error, setError] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const [update, setUpdate] = useState(false);

    const [ques, setQues] = useState([]);
    const [quesIndex, setQuesIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [r, setR] = useState("");
    const scrollDiv = useRef();

    let history = useHistory();
    let questions = props.jobQuestions
    let languageName = props?.languageName;
    useEffect(() => {
        if (props.user.authenticated) {
            setIsAuthenticated(true);
            getUserDetails().then((res) => {
                let user = {
                    email: res.data.email,
                    name:
                        res.data.first_name === null
                            ? t(props.language?.layout?.user_nt)
                            : res.data.last_name
                                ? res.data.first_name + " " + res.data.last_name
                                : res.data.first_name,
                    resume: res.data.resume_file,
                    phone: res.data.phone,
                    updatedAt: renderToLocaleDate(res.data.updated_at),
                };
                setUser(user);
            });
        }
    }, [update]);

    useEffect(() => {
        checkIntent(props.intent);
    }, []);

    useEffect(() => {
        checkQueue();
    }, [queue]);

    useEffect(() => {
        let data = JSON.parse(props.jobQuestions)
        if (props.jobQuestions !== null || props.jobQuestions !== undefined) {
            setQues(data);
        }
    }, []);

    useEffect(() => {
        if (quesIndex) {
            getNextQuestion();
        }
    }, [quesIndex]);

    useEffect(() => {
        scrollDiv.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }, [chats, typing]);

    const checkIntent = (intent) => {
        switch (intent) {
            case "job.apply":
                applyJob();
                break;

            default:
                break;
        }
    };

    const checkQueue = () => {
        if (queue[0] === undefined) {
            setInputType("text");
            return false;
        }
        switch (queue[0]) {
            case "user.welcome":
                welcomeUser();
                break;
            case "user.email":
                getEmail();
                break;
            case "user.login":
                loginUser();
                break;
            case "user.checkJobApply":
                checkJobApply();
                break;
            case "user.register":
                registerUser();
                break;
            case "user.details":
                getDetails();
                break;
            case "job.answer":
                jobAnswer();
                break;
            case "submit":
                submit();
                break;
            default:
                break;
        }
    };
    const static_value = false;
    const applyJob = () => {
        setRequiredKeys(["email", "name", "phone", "resume"]);
        if (props.user.authenticated) {
            // console.log("in if.....")
            setQueue(["user.welcome", "user.email", "user.details", "job.answer", "submit"]);
        }
        else {
            // console.log("in else.....")
            setQueue(["user.register"]);
        }
    };

    const welcomeUser = () => {
        if (props.user.is_user) {
            sendMessage("bot", `${t(props.language?.layout?.js_application_welcome)} ${props.title} ${t(props.language?.layout?.seeker_profile)}. `);
            // props?.jobQuestions !== null && getQuesAndUserMessage();

        } else
            sendMessage(
                "bot",
                `${t(props.language?.layout?.js_application_welcome)} ${props.title} ${t(props.language?.layout?.seeker_profile)}. ${t(props.language?.layout?.toproceed_nt)}`
            );
        progressQueue(1);
    };

    const submit = () => {
        let formData = new FormData();
        formData.append("answer", JSON.stringify(answers));
        setTyping(true);
        setDisableBtn(true);
        jobApply(formData, props.slug)
            .then((res) => {
                setTyping(false);
                setDisableBtn(false);
                if (res.status === 201) {
                    var str = "https://dev.simplifyhire.net/applications";
                    var result = str.link("https://dev.simplifyhire.net/applications");
                    // var link = `${<a href='https://dev.simplifyhire.net/applications'>https://dev.simplifyhire.net/applications</a>}`;

                    sendMessage("bot", `${t(props.language?.layout?.js_application_greeting)}`);
                    sendMessage("bot", `${t(props.language?.layout?.js_application_askinguser)}`);
                    setInputType("button_options");
                    props.setCheckApplied(true);
                }
            })
            .catch((err) => console.log(err));
    };

    const getEmail = () => {
        if (isAuthenticated) {
            progressQueue(1);
        } else {
            setInputType("email");
        }
    };

    const captureEmail = (e) => {
        e.preventDefault();
        if (!formValues.email) {
            setError(t(props.language?.layout?.emaireq_nt));
            return;
        }
        if (validateEmail()) {
            return;
        }
        sendMessage("user", formValues.email);
        let formData = new FormData();
        formData.append("email", formValues.email);
        setTyping(true);
        setError(false);
        checkUserEmail(formData)
            .then((res) => {
                setTyping(false);
                if (res.status === 200 && res.data.account) {
                    let q = [...queue];
                    let spliced = q.splice(1);
                    spliced.unshift("user.login");
                    setQueue(spliced);
                } else if (res.status === 200 && !res.data.account) {
                    let q = [...queue];
                    let spliced = q.splice(1);
                    spliced.unshift("user.register");
                    setQueue(spliced);
                }
            })
            .catch((err) => {
                setTyping(false);
                console.log(err);
            });
    };

    const loginUser = () => {
        setInputType("login");
        sendMessage("bot", `${t(props.language?.layout?.pastin_nt)}`);
    };

    const getResumeUpdatedDate = () => {
        let todayDate = new Date();
        let updatedDate = new Date(user.updatedAt);
        let Difference_In_Time = todayDate.getTime() - updatedDate.getTime();
        let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (Difference_In_Days < 30) {
            // console.log(Math.ceil(Difference_In_Days));
            return Math.ceil(Difference_In_Days);
        }
        return Math.ceil(Difference_In_Days / 30);
    };
    const getDetails = () => {
        // if (props?.jobQuestions !== null) {
        setInputType("details");
        // } else {
        //     setInputType("apply");
        // }
        // sendMessage('bot', `As per our records, you've updated your resume few time before. Do you want to update it?`)
    };

    const confirmDetails = () => {
        // setInputType("text");
        sendMessage(t(props.language?.layout?.user_nt), { ...user }, "details");
        // sendMessage("bot", "Thanks For confirming your details");
        progressQueue(2);
    };

    const buttonOptionOnClick = (flag) => {
        if (flag === "jobs") {
            sendMessage("bot", `${t(props.language?.layout?.redjp_nt)}`);
            setTimeout(() => {
                history.push("/search");
            }, 1000);
        } else if (flag === "profile") {
            sendMessage("bot", `${t(props.language?.layout?.redpp_nt)}`);
            setTimeout(() => {
                history.push("/profile");
            }, 1000);
        } else if (flag === "close") {
            closeChatBotHandle();
        }
    };

    const showResume = () => {
        setInputType("resume");
    };

    const uploadResume = (e) => {
        e.preventDefault();
        if (!formValues.file) {
            setError(t(props.language?.layout?.choosefile_nt));
            return;
        }
        if (!isValidFileType(formValues.fileName)) {
            setError(t(props.language?.layout?.toast43_nt));
            return;
        }
        if (formValues.file.size > 1000000) {
            setError(t(props.language?.layout?.toast61_nt));
            return;
        }

        sendMessage(t(props.language?.layout?.user_nt), { resume: formValues.fileName }, "details");

        let formdata = new FormData();
        formdata.append("resume_file", formValues.file);

        setError(false);
        setTyping(true);
        setDisableBtn(true);

        resumeUpload(formdata)
            .then((res) => {
                setTyping(false);
                setDisableBtn(false);
                if (res.status === 200) {
                    sendMessage("bot", `${t(props.language?.layout?.resumeadded_nt)}`);
                    setUser({ ...user, resume: formValues.fileName });
                    props?.jobQuestions !== null && getQuesAndUserMessage();
                    props?.jobQuestions !== null ? setInputType("select") : setInputType("apply");
                }
            })
            .catch((err) => {
                setTyping(false);
                setDisableBtn(false);
                if (err.response.data.status === 400) {
                    sendMessage("bot", `${t(props.language?.layout?.toast58_nt)}\n${t(props.language?.layout?.uploadcf_nt)}`);
                }
            });
    };

    const cancelUpdate = (e) => {
        e.preventDefault();
        props?.jobQuestions !== null ? setInputType("select") : setInputType("apply")
        props?.jobQuestions !== null ? getQuesAndUserMessage() : sendMessage(t(props.language?.layout?.user_nt), { ...user }, "details");
    };
    const progressQueue = (i = 0) => {
        let q = [...queue];
        i ? setQueue(q.splice(i)) : setQueue(q.splice());
    };

    const jobAnswer = () => {
        if (ques.length === 0) {
            progressQueue(1);
            return;
        }
        getNextQuestion();
    };

    const getNextQuestion = () => {
        if (quesIndex < ques.length) {
            getQuesAndUserMessage();
        } else {
            sendMessage("bot", `${t(props.language?.layout?.confirmapp_nt)}`);
            setInputType("apply");
        }
    };

    const confirmApplication = (value) => {
        sendMessage(t(props.language?.layout?.user_nt), value);
        setInputType("text");
        progressQueue(1);
    };

    const getQuesAndUserMessage = () => {
        sendMessage("bot", questionsLanguageHandler(ques[quesIndex].id, props.languageName));
        setInputType(ques[quesIndex].type);
    };
    const questionsLanguageHandler = (status, language) => {
        let result;
        switch (status) {
            case 'legally_authorized':
                if (status == "legally_authorized" && language == "en") {
                    result = "Are you legally authorized to work in the country of job location?";
                    break;
                } else if (status == "legally_authorized" && language == "esp") {
                    result = "¿Está legalmente autorizado para trabajar en el país de ubicación del trabajo?";
                    break;
                }
                else {
                    result = "Êtes-vous légalement autorisé à travailler dans le pays du lieu de travail ?";
                    break;
                }
            case 'visa_sponsorship':
                if (status == "visa_sponsorship" && language == "en") {
                    result = "Will you now, or ever, require VISA sponsorship in order to work in the country of job location?";
                    break;
                } else if (status == "visa_sponsorship" && language == "esp") {
                    result = "¿Necesitará ahora o alguna vez el patrocinio de VISA para poder trabajar en el país de ubicación del trabajo?";
                    break;
                } else {
                    result = "Aurez-vous maintenant ou jamais besoin d'un parrainage VISA pour travailler dans le pays de votre lieu de travail ?";
                    break;
                }

            default: result = ""; break;
        }
        return result;
    }
    const answerLanguageHandler = (status, language) => {
        let result;
        switch (status) {
            case 'Yes':
                if (status == "Yes" && language == "en") {
                    result = "Yes";
                    break;
                } else if (status == "Yes" && language == "esp") {
                    result = "Sí";
                    break;
                }
                else {
                    result = "Oui";
                    break;
                }
            case 'No':
                if (status == "No" && language == "en") {
                    result = "No";
                    break;
                } else if (status == "No" && language == "esp") {
                    result = "No";
                    break;
                } else {
                    result = "Non";
                    break;
                }

            default: result = ""; break;
        }
        return result;
    }
    const answerSelected = (value, e) => {
        e.preventDefault();
        if (!value) {
            setError(t(props.language?.layout?.toast76_nt));
            return;
        }
        setError(false);
        sendMessage("user", answerLanguageHandler(value, props.languageName));
        let obj = {
            id: ques[quesIndex].id,
            answer: value,
        };
        setAnswers((prevState) => [...prevState, obj]);
        setQuesIndex((prevState) => {
            if (prevState < ques.length) {
                return prevState + 1;
            } else {
                return prevState;
            }
        });
    };

    const formOnChangeHandler = (name) => (e) => {
        // console.log("e.target.files",e.target.value);
        e.target.files
            ? setFormValues({ ...formValues, file: e.target.files[0], fileName: e.target.files[0].name })
            : setFormValues({ ...formValues, [name]: e.target.value });
    };

    const registerUser = () => {
        setInputType("register");
        setUser({ ...user, email: formValues.email, password: generatePassword() });

        sendMessage(
            "bot",
            `${t(props.language?.layout?.firsttime1_nt)} <a href="/signup">${t(props.language?.layout?.employer_signup_submit)}</a>${t(props.language?.layout?.firsttime2_nt)}`
        );
    };

    const generatePassword = () => {
        var length = 10,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    };

    const validateEmail = () => {
        validate(formValues.email);
        if (!res) {
            setError(t(props.language?.layout?.toast7_nt));
            return false;
        }
    };

    const isValidFileType = (fName) => {
        let extensionLists = ["pdf", "doc", "docx"];
        return extensionLists.indexOf(fName.split(".").pop()) > -1;
    };
    const captureRegisterDetails = (e) => {
        e.preventDefault();
        // console.log("formValues.........",formValues)
        if (!formValues.name) {
            setError(t(props.language?.layout?.toast76_nt));
            return;
        }
        if (formValues.file && !isValidFileType(formValues.fileName)) {
            setError(t(props.language?.layout?.toast43_nt));
            return;
        }
        if (formValues.file && formValues.file.size > 1000000) {
            setError(t(props.language?.layout?.toast61_nt));
            return;
        }
        if (!formValues.file) {
            setError(t(props.language?.layout?.uploadcv_nt));
            return;
        }
        let values = {
            name: formValues.name,
            email: formValues.email,
            phone: formValues.phone ? formValues.phone : "-",
            resume: formValues.fileName ? formValues.fileName : "-",
        };
        sendMessage(t(props.language?.layout?.user_nt), values, "details");
        let formData = new FormData();
        formData.append("email", formValues.email);
        formData.append("password", user.password);
        formData.append("full_name", formValues.name);
        formData.append("set_password", "yes");
        formValues.phone ? formData.append("phone", formValues.phone) : null;
        formValues.file ? formData.append("resume_file", formValues.file) : null;
        setError(false);
        setDisableBtn(true);
        setTyping(true);
        //signup
        Axios({
            method: "post",
            url: "/api/v1/registercc",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                setTyping(false);
                setDisableBtn(false);
                if (response.data.status === 201) {
                    // --------- for guest user register and apply job
                    updateUserFromToken(response.data.data.access_token, response.data.data.refresh_token);
                    setQueue(["user.welcome", "user.email", "user.details", "job.answer", "submit"]);
                    // --------- for guest user register and apply job
                    setUpdate(true);
                    progressQueue(2);
                    // sendMessage("bot", "Bravo! Congratulations on completing your first step towards building your profile.You've been successfully registered.", "text");
                    setError(false);
                    return;
                }
                setError(response);
                return;
            })
            .catch((err) => {
                setDisableBtn(false);
                setTyping(false);
                console.log(err);
            });
    };

    const captureLogin = (e) => {
        e.preventDefault();
        if (!formValues.password) {
            setError(t(props.language?.layout?.passreq_nt));
            return;
        }
        setTyping(true);
        setError(false);
        setDisableBtn(true);
        console.log(formValues.email, "formValues.email", formValues.password);
        let email = formValues.email;
        let password = formValues.password;
        //signIn
        Axios.post("/api/v1/token", { username: email, password: password })
            .then((res) => {
                setTyping(false);
                setDisableBtn(false);
                if (res.status === 200) {
                    updateUserFromToken(res.data.access, res.data.refresh);
                    // sendMessage("bot", "You are successfully logged in");
                    let q = [...queue];
                    let spliced = q.splice(1);
                    spliced.unshift("user.checkJobApply");
                    setQueue(spliced);

                    setIsAuthenticated(true);
                    setError(false);
                    return;
                }
                setError(res);
            })
            .catch((err) => {
                console.log(err);
                setTyping(false);
                setDisableBtn(false);
            })
            .catch((err) => {
                console.log(err);
                setTyping(false);
            });
    };
    const default_user_object = {
        authenticated: false,
        name: "",
        chat_id: "",
        is_user: true,
        user_id: null,
        role_id: null,
    };
    const updateUserFromToken = (access_token, refresh_token) => {
        console.log("Came in funcc");
        setIsAuthenticated(true)
        let decoded = jwt_decode(access_token);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        localStorage.setItem("expires_at", decoded.exp - 600); // 600 = 10 mins leeway time
        let user_object = Object.assign({}, default_user_object, {
            authenticated: true,
            user_id: decoded.user_id,
            is_user: decoded.is_user,
            name: decoded.full_name,
            role_id: decoded.role_id,
        });
        props._setAuthData(user_object, access_token, refresh_token);
    };
    const checkJobApply = () => {
        setTyping(true);
        checkApply(props.slug)
            .then((res) => {
                setTyping(false);
                console.log(res);
                if (res.data.applied) {
                    sendMessage("bot", t(props.language?.layout?.alreadyapp_nt));
                    setQueue([]);
                    //   setInputType('text')
                } else progressQueue(1);
            })
            .catch((err) => {
                setTyping(false);
                console.log(err);
            });
    };

    const sendMessage = (sender, value, chatType = "text") => {
        let chat = {
            type: sender,
            data: {
                type: chatType,
                value: value,
            },
        };
        setChats((prevState) => [...prevState, chat]);
    };

    const closeChatBotHandle = () => {
        sendMessage("bot", t(props.language?.layout?.closegreeting_nt));
        setTimeout(() => {
            props.closeChatBotHandle();
        }, 1000);
    };

    const onDropHandle = (file) => {
        setError(false);
        console.log(file);
        setFormValues({ ...formValues, file: file[0], fileName: file[0].name });
        if (!isValidFileType(file[0].name)) {
            setError(t(props.language?.layout?.toast43_nt));
            return;
        }
        if (file[0].size > 1000000) {
            setError(t(props.language?.layout?.toast61_nt));
            return;
        }
    };
    const showTyping = () => {
        return (
            typing === true && (
                <div className="listCustom col-12 d-flex justify-content-start align-items-center mb-4">
                    {/* <p style={{ marginBlockEnd: 0 }}>Typing</p> */}
                    <div class="dotsContainer d-flex align-items-center justify-content-center pt-2">
                        <span className="dot1 rounded-circle bg-secondary m-1"></span>
                        <span className="dot2 rounded-circle bg-secondary m-1"></span>
                        <span className="dot3 rounded-circle bg-secondary m-1"></span>
                    </div>
                </div>
            )
        );
    };
    const titleCase = (string) => {
        return String(string || "")
            .toLowerCase()
            .split(" ")
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    };

    const inputProviderValues = {
        inputType,
        requiredKeys,
        user,
        questions,
        confirmDetails,
        showResume,
        uploadResume,
        cancelUpdate,
        answerSelected,
        formOnChangeHandler,
        formValues,
        confirmApplication,
        captureEmail,
        captureLogin,
        captureRegisterDetails,
        error,
        sendMessage,
        disableBtn,
        buttonOptionOnClick,
        closeChatBotHandle,
        isValidFileType,
        onDropHandle,
        languageName,
    };
    return (
        <React.Fragment>
            <div className="container chat mt-3">
                <div className="row border d-flex chat-header bg-primary text-white justify-content-between">
                    <div className="py-2 pl-3">
                        <p className="mb-0">SimplifyBot</p>
                        <p className="mb-0">
                            {props.user.is_user ? `${t(props.language?.layout?.loggedin_nt)} ${titleCase(props.user.name)}` : t(props.language?.layout?.guestuser_nt)}
                        </p>
                    </div>
                    <button
                        type="button"
                        class="close animate-closeicon text-white px-3 py-2"
                        aria-label="Close"
                        title={t(props.language?.layout?.all_close_nt)}
                        onClick={props.closeChatBotHandle}>
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <ChatHistory chats={chats} fl showTyping={showTyping} scrollDiv={scrollDiv} username={user.name} />
                <InputProvider value={inputProviderValues}>
                    <Input />
                </InputProvider>
            </div>
        </React.Fragment>
    );
};
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, { _setAuthData })(Chatbot);
