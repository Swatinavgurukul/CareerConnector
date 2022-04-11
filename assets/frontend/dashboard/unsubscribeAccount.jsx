import React, { useState, useEffect } from "react";
import { getQueryParameters, removeEmpty, getQueryString } from "../modules/helpers.jsx";
import { useHistory } from "react-router-dom";


const unsubscribeAccount =() => {
    const history = useHistory();
    const [data, setData] = useState("");
    useEffect(() => {
        let url_path = history.location.search ;
        if(url_path.indexOf("link=") > -1){
            setData(url_path.split("link=")[1]);
        }
    }, []);
    return (
        <div className="mt-5">
            <h4>Are you sure that you'd like to Unsubscribe</h4>
            <div className="d-flex mt-3 justify-content-center">
            <a href="#" className="btn btn-outline-primary">Cancel</a>
            <a href={data} className="btn btn-primary ml-3">Unsubscribe</a>
            </div>
        </div>
    )
}

export default unsubscribeAccount;
