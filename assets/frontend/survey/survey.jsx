import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { getQueryParameters, removeEmpty, getQueryString, capitalizeFirstLetter } from "../modules/helpers.jsx";
import { useHistory } from "react-router-dom";
import { Fragment } from "react";
import { _languageName } from "../actions/actionsAuth.jsx";
import { answerLanguage, surveyData } from "../../translations/helper_translation.jsx";


const Survey = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    let [data, setData] = useState([])
    const [name, setName] = useState("")
    let [isSubmitted, setIsSubmitted] = useState(false)
    let [submitButton, setSubmitButton] = useState(false);
    let [showFeedback1, setShowFeedback1] = useState("");
    let [showFeedback3, setShowFeedback3] = useState();

    useEffect(() => {
        getUrl();
        let queryParamsUrl = getQueryParameters(history.location.search);
        if (queryParamsUrl.lang == undefined || queryParamsUrl.lang == null || queryParamsUrl.lang == "" || queryParamsUrl.lang == "en") {
            props._languageName("en")
        }
        if (queryParamsUrl.lang == "esp") {
            props._languageName("esp")
        }
        if (queryParamsUrl.lang == "fr") {
            props._languageName("fr")
        }
    }, [])

    const getUrl = () => {
        let urlPath = getQueryParameters(window.location.href);
        let url_data = urlPath.id;
        if (url_data) {
            Axios.get(`api/v1/job/survey_feedback?uuid=${url_data}`)
                .then((response) => {
                    if (response.data.data.is_submitted == true) {
                        history.push({
                            pathname: "/thankYouFeedback",
                            state: {
                                userName: response.data.data.user_name,
                                jobTitle: response.data.data.job_title,
                                surveyTitle: response.data.data.survey_title
                            },
                        });
                    }
                    setData(response.data.data.questions)
                    const ques = []
                    response.data.data.questions.map(q => {
                        const arr = []
                        if (q.is_sub_question == true) {
                            q.sub_question.map((d) => {
                                arr.push({
                                    ...d, answer: {
                                        sub_question_id: null,
                                        text: "",
                                    }
                                })
                            })
                        }
                        ques.push({
                            ...q, answer: {
                                question_id: null,
                                is_sub_question: null,
                                answer_id: null,
                                answer: "",
                                text: "",
                                sub_question: arr.map(d => d.answer)
                            }
                        })
                    })
                    setData(ques);
                    setName(response.data.data)
                    setSubmitButton(true);
                })
                .catch((error) => {
                    if (error) {
                        toast.error(t(props.language?.layout?.toast58_nt));
                    }
                })
        }
    };

    const postSurvey = () => {
        var filledAnswers = data.filter((d) => {
            return d.answer.question_id !== null
        })

        if(filledAnswers.length !== 5){
            toast.error(t(props.language?.layout?.toast144_nt));
            return false;
        }

        let urlPath = getQueryParameters(window.location.href);
        let url_data = urlPath.id;
        if (url_data) {
            Axios.put(`api/v1/job/survey_feedback?uuid=${url_data}`, { answers: filledAnswers.map(d => d.answer) })
                .then((response) => {
                    if (response.data.data.is_submitted == true) {
                        history.push({
                            pathname: "/thankYouFeedback",
                            state: {
                                userName: response.data.data.user_name,
                                jobTitle: response.data.data.job_title,
                                surveyTitle: response.data.data.survey_title
                            },
                        });
                    }
                })
                .catch((error) => {
                    if (error) {
                        toast.error(t(props.language?.layout?.toast58_nt));
                    }
                })
        }
    };

    const radioButtonHandler = (value, key, answers, id, is_sub_question, index, i) => {

        const newAnswerArray = data.slice(0)
        if (is_sub_question === true) {
            newAnswerArray[index].answer.sub_question[i].sub_question_id = key
            newAnswerArray[index].answer.sub_question[i].text = answers.id
            newAnswerArray[index].answer.question_id = id
            newAnswerArray[index].answer.is_sub_question = is_sub_question
        } else {
            newAnswerArray[index].answer.question_id = id
            newAnswerArray[index].answer.is_sub_question = is_sub_question
            newAnswerArray[index].answer.answer_id = key
            newAnswerArray[index].answer.answer = answers
            answers === "Yes" || answers !== "e. Other" ? newAnswerArray[index].answer.text = "" : ""
        }

        setData(newAnswerArray)
        setShowFeedback1(index);
        setShowFeedback3(answers)
    }

    const mapObj = {
        "{Enter Name}": capitalizeFirstLetter(name.user_name),
        "{Enter Open Position Name}": capitalizeFirstLetter(name.job_title),
    };

    const handleInputChange = (e, index, id, is_sub_question, type) => {
        const newAnswerArray = data.slice(0)
        if (type == "text") {
            newAnswerArray[index].answer.text = e.target.value
            newAnswerArray[index].answer.question_id = id
            newAnswerArray[index].answer.is_sub_question = is_sub_question
        } else {
            newAnswerArray[index].answer.text = e.target.value
        }
        setData(newAnswerArray)
    };
    const answerLanguageHandler = (language,key) => {
        return(answerLanguage[language][key]);
    }

    const surveyDataHandler = (language,key) => {
        return(surveyData[language][key]);
    }
    return (
        <Fragment>
            {!isSubmitted ?
                <div className="container-fluid h-100 px-0">
                    <div className="bg-silver pt-4 pb-2">
                        <div className="col-lg-10 mx-auto">
                            <h4 className="text-capitalize">{name && surveyDataHandler(props?.languageName, name.survey_title).replace(/{Enter Name}|{Enter Open Position Name}/g, function (matched) { return mapObj[matched] })}</h4>
                        </div>
                    </div>
                    <div className="col-md-10 mx-auto">
                        <div className="row mt-5rem pt-md-5 align-items-center">
                            <div className="col-md-6 pt-5 text-center">
                                <img
                                    alt="microsoft"
                                    src="/uploads/user_v1llv353bppo/career_connector.jpg"
                                    style={{ height: "4rem" }}
                                />
                            </div>
                            <div className="col-md-6 pt-5">
                                <h4>{t(props.language?.layout?.hi_nt)}</h4>
                                <h4 className="my-2">{t(props.language?.layout?.survey_info1)}
                                    &amp; {t(props.language?.layout?.survey_info2)}
                                </h4>
                                <div className="mt-4">
                                    <button className="btn btn-primary px-4" type="button" onClick={() => { getUrl(); setIsSubmitted(true); }}>
                                    {t(props.language?.layout?.start_nt)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> :
                (<div className="container-fluid h-100 px-0">
                    <div className="bg-silver pt-4 pb-2">
                        <div className="col-lg-10 mx-auto">
                            <h4 className="text-capitalize">{name && surveyDataHandler(props?.languageName, name.survey_title).replace(/{Enter Name}|{Enter Open Position Name}/g, function (matched) { return mapObj[matched] })}</h4>
                        </div>
                    </div>
                    <div className="col-lg-10 mx-auto">
                        <div className="mt-4">
                            {name.survey_description !== null && name.survey_description}
                        </div>
                        {data && data?.map((question, index) => {
                            return (
                                <div className="my-4">
                                    <p>{index + 1} .
                                        {question.display_title && surveyDataHandler(props?.languageName, question.display_title).replace(/{Enter Name}|{Enter Open Position Name}/g, function (matched) { return mapObj[matched]})} *
                                    </p>
                                    <div className="form-group animated form-check ml-3">
                                        {question.options &&
                                            question.type === "single-choice" ?
                                            Object.entries(question.options).map(([key, value]) => (
                                                <div className="d-flex mb-2">
                                                    <div className="form-check custom-radio mr-5 m-0 bg-white customRadio">
                                                        <input
                                                            className="form-check-input m-0"
                                                            type="radio"
                                                            name={`exampleRadios${index}`}
                                                            id={`exampleRadios${index}${key}`}
                                                            onChange={(e) => radioButtonHandler(e.target.checked, key, value, question.id, question.is_sub_question, index, "")}
                                                        />
                                                        <label className="form-check-label m-0 px-5">{answerLanguageHandler(props?.languageName, value)}</label>
                                                    </div>

                                                </div>

                                            )) : null}
                                        {
                                           data[index].answer && (data[index].answer.answer === "No" || data[index].answer.answer === "e. Other") &&
                                            (question.display_textbox_options == "no" || question.display_textbox_options == "other") &&
                                            <div className="form-group ml-4 pl-3">
                                                <label>{question.textbox_label !== null && surveyDataHandler(props?.languageName, question.textbox_label)}</label>
                                                <input
                                                    type="text"
                                                    className="form-control col-md-4"
                                                    aria-label="name"
                                                    name={`survey${index}`}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                />
                                            </div>
                                        }
                                        {question.display_textbox_options == "all" &&
                                            <>
                                                {index == showFeedback1 && showFeedback3 === "Yes" && (
                                                    <div className="form-group ml-4 pl-3">
                                                        <label>{question.textbox_label.split("|")[0]}</label>
                                                        <input
                                                            type="text"
                                                            className="form-control col-md-4"
                                                            aria-label="name"
                                                            name={`survey${index}`}
                                                            onChange={(e) => handleInputChange(e, index)}
                                                        />
                                                    </div>)}
                                                {index == showFeedback1 && showFeedback3 === "No" &&
                                                    <div className="form-group ml-4 pl-3">
                                                        <label>{question.textbox_label.split("|")[1]}</label>
                                                        <input
                                                            type="text"
                                                            className="form-control col-md-4"
                                                            aria-label="name"
                                                            name={`survey${index}`}
                                                            onChange={(e) => handleInputChange(e, index)}
                                                        />
                                                    </div>}</>}
                                        {question.type === "text" ? (
                                            <div className="form-group col-md-5 px-0">
                                                <textarea className="form-control" name="question5" rows="5"
                                                    onChange={(e) => handleInputChange(e, index, question.id, question.is_sub_question, question.type)}></textarea>
                                            </div>
                                        ) : null}
                                        {question.is_sub_question === true ? (
                                            <div className="table-responsive">
                                                <table className="table table-borderless text-center">
                                                    {question.sub_question.map((item, i) => (
                                                        <tbody>
                                                            {i === 0 &&
                                                                <tr>
                                                                    <td></td>
                                                                    {Object.entries(item.options).map(([key, value]) => (
                                                                        <>
                                                                            <td>{value}</td>
                                                                        </>
                                                                    ))}
                                                                </tr>}
                                                            <tr>
                                                                <td className="text-left">{i + 1} {item.title}</td>

                                                                {Object.entries(item.options).map(([key, value]) => (
                                                                    <>
                                                                        <td>
                                                                            <div className="form-check custom-radio m-0 bg-white customRadio">
                                                                                <input
                                                                                    className="form-check-input m-0"
                                                                                    type="radio"
                                                                                    name={item.title}
                                                                                    id={value}
                                                                                    onChange={(e) => radioButtonHandler(e.target.checked, item.id, e.target, question.id, question.is_sub_question, index, i)}
                                                                                />
                                                                                <label className="form-check-label m-0"></label>
                                                                            </div>

                                                                        </td>
                                                                    </>
                                                                ))}
                                                            </tr>
                                                        </tbody>))}
                                                </table>
                                            </div>) : null}
                                    </div>
                                </div>
                            )
                        })}
                        {/* end */}
                        {submitButton ?
                            <div className="my-4">
                                <button className="btn btn-primary px-5" type="button" onClick={postSurvey}>
                                {t(props.language?.layout?.ep_importjob_submit)}
                                </button>
                            </div> : ""}
                    </div>
                </div>)
            }
        </Fragment>
    );
};

function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language,
        tenantTheme: state.authInfo.tenantTheme,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {_languageName})(Survey);
