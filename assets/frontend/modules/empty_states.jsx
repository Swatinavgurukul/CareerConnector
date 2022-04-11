import React from "react";

export default function EmptyStates(props) {
    let default_values = {
        logged_out: {
            image: "/svgs/temp/undraw_security.svg",
            headline: "Logged out !!!",
            message: "Your session has expired due to inactivity. Please login again.",
            actions: [
                {
                    url: "/login",
                    class: "btn-outline-dark",
                    text: "Login Again",
                },
            ],
        },
        no_data: {
            image: "/svgs/empty-states/no-data.svg",
            headline: "No data !!!",
            message: "There is no data to show.",
        },
        loading: {
            image: "/images/loading.gif",
            headline: "Please wait...",
            message: "Please wait untill we fetch your data.",
        },
    };

    let state_data =
        props.no_data === undefined ? default_values : Object.assign(default_values, { no_data: props.no_data });
    let data = state_data[props.active_state];

    return data !== undefined ? (
        <div className="text-center d-md-flex my-3">
            <div className="col-md-6 col-12">
                <img src={data.image} className="img-fluid" alt="Image" />
            </div>
            <div className="col-md-6 col-12 align-self-md-center">
                <h1 className="text-muted">{data.headline}</h1>
                <p className="text-muted pt-1">{data.message}</p>
                {data.actions !== undefined
                    ? data.actions.map((item) => (
                          <a href={item.url} className={"btn btn-lg " + item.class}>
                              {item.text}
                          </a>
                      ))
                    : null}
            </div>
        </div>
    ) : null;
}
