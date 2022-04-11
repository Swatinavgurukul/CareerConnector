import React, { useState, useEffect } from "react";
import axios from "axios";
import { getQueryParameters } from "../modules/helpers.jsx";
import { Link, useHistory } from "react-router-dom";

const redir = () => {
    window.location.reload()
}
const SsoLogin = () => {
    const redirect = "api/v1/o/authorize/?response_type=code&client_id=JQ5XZgUqy8lA0fYYJo2FW7Y2RnonJZvMijWi6B58&redirect_uri=https://careerconnector.simplifyhire.com/ssocallback";
    const history = useHistory();
    const [code, setCode] = useState("")
    useEffect(() => {
        let queryParamsUrl = getQueryParameters(history.location.search);
        setCode(queryParamsUrl.code)
        console.log(queryParamsUrl.code, "codeee")
    }, []);
    // const authorize = () => {
    //     axios
    //         .get("/api/v1/o/authorize/?response_type=code&client_id=Lj12HIuUXR4kGtGFUE7GFfS2WiDIwPmcjK064ETl&redirect_uri=http://127.0.0.1:8080/ssocallback", {
    //         })
    //         .then((response) => {
    //             console.log(response, "resp")
    //             // setCode("VuZCwccC6bXgY3rTqV1yhh2nCYm60e")
    //             // ssoSubmit()
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             // setCode("VuZCwccC6bXgY3rTqV1yhh2nCYm60e")
    //             // ssoSubmit()
    //         });
    // }
    return (
        <div><a href={redirect} >Authorize </a></div>
    )
}
export default SsoLogin;