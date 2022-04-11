import React, { useState, useEffect } from "react";
import Axios from "axios";
import { getQueryParameters } from "../modules/helpers.jsx";
import { useHistory } from "react-router-dom";

const SsoCall = () => {
    const history = useHistory();
    const [code, setCode] = useState("");
    const [data, setData] = useState({});
    useEffect(() => {
        let queryParamsUrl = getQueryParameters(history.location.search);
        // setCode(queryParamsUrl.code);
        console.log(queryParamsUrl.code, "codeee");
        authorize();
        getDetails();
    }, []);
    var qs = require('qs');
    const authorize = () => {
        let queryParamsUrl = getQueryParameters(history.location.search);
        const obj = qs.stringify({
            client_id: "oGowu4LOT6EJSi4Oqsir8ZiFr7ew69LamD6bbSfY",
            client_secret:
                "Qz7aojAxTHhpmRDJowroBV7diiULQY2M5OU2RtfQ3QM4tYRC2TWFbLRYi2vw8gG9MtOYzhDA9QFS1DyBXBPKi1o6oquS0A86exIsf7yLLvj2frDYICvVigR8zNyK9wMg",
            grant_type: "client_credentials"
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
    const getDetails = () => {
        Axios.get('/api/v1/apptoken/data')
            .then((response) => {
                console.log("response.data..........", response.data);
            })
            .catch((error) => {
                setCode(error.response.data.error)
            });
    }
    return (
        <div>
            <h2 className="mt-5">{data.access_token}</h2>
            <h2 className="mt-5">{code}</h2>
        </div>
    );
};
export default SsoCall;
