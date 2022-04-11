import React, { useState, useEffect } from "react";
import Axios from "axios";
import { getQueryParameters } from "../modules/helpers.jsx";
import { useHistory } from "react-router-dom";

const SsoCallback = () => {
    const history = useHistory();
    const [code, setCode] = useState("");
    const [data, setData] = useState({});
    useEffect(() => {
        let queryParamsUrl = getQueryParameters(history.location.search);
        // setCode(queryParamsUrl.code);
        console.log(queryParamsUrl.code, "codeee");
        authorize();
    }, []);
    var qs = require('qs');
    const authorize = () => {
        let queryParamsUrl = getQueryParameters(history.location.search);
        const obj = qs.stringify({
            client_id: "JQ5XZgUqy8lA0fYYJo2FW7Y2RnonJZvMijWi6B58",
            client_secret:
                "y0Lu18eTIZp4sguvVWTFEnVx3QN7WJsCddMFzBkPhS89PKZcscpk150Du4Np7E6gbpCFnlMAjjmKANf2hsflwwsUA9zSngHUXUUxEelXrypzYKTZ3Xr4GBaM6LgWCh9H",
            code: queryParamsUrl.code,
            redirect_uri: "https://accelerate.cynaptx.com/auth/public/bypass",
            grant_type: "authorization_code"
        });
        Axios({
            url: "/api/v1/o/token/",
            method: "post",
            data: obj,
        })
            .then((response) => {
                setData(response.data)
            })
            .catch((error) => {
                setCode(error.response.data.error)
            });
    };
    return (
        <div>
                <h2 className="mt-5">{data.access_token}</h2>
                <h2 className="mt-5">{code}</h2>
        </div>
    );
};
export default SsoCallback;
