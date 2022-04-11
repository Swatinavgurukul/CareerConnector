import React from "react";
import { useContext } from "react";

import { InputContext } from "../Context/InputContext.js";
import AnswerInputBox from "./AnswerInputBox.jsx";
import Calender from "./Calender.jsx";
import CheckEmail from "./CheckEmail.jsx";
import ConfirmApply from "./ConfirmApply.jsx";
import GeoLocation from "./GeoLocation.jsx";
import InputDefault from "./InputDefault.jsx";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";
import SelectAnswer from "./SelectAnswer.jsx";
import UserDetails from "./ShowDetails.jsx";
import Resume from "./Resume.jsx";
import Button_Options from "./Button_Options.jsx";
const Input = () => {
    let { inputType } = useContext(InputContext);
    return (
        <div className="row border border-top-0">
            {inputType === "text" ? (
                <InputDefault />
            ) : inputType === "details" ? (
                <UserDetails />
            ) : inputType === "email" ? (
                <CheckEmail />
            ) : inputType === "login" ? (
                <LoginForm />
            ) : inputType === "register" ? (
                <RegisterForm />
            ) : inputType === "select" ? (
                <SelectAnswer />
            ) : inputType === "date" ? (
                <Calender />
            ) : inputType === "input" ? (
                <AnswerInputBox />
            ) : inputType === "location" ? (
                <GeoLocation />
            ) : inputType === "apply" ? (
                <ConfirmApply />
            ) : inputType === "resume" ? (
                <Resume />
            ) : inputType === 'button_options'?
                <Button_Options/> :
            null}
        </div>
    );
};
export default Input;
