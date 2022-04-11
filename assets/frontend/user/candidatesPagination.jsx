import React from "react";
import axios from "axios";
import { Component } from "react";
import ListPaginate from "../modules/list_pagination/index.jsx";

export default class CandidatesPagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            // config:
            columns: [
                { display_name: "UserName", key: "username", type: "text", selected: true },
                { display_name: "Email", key: "email", type: "text", selected: true },
                { display_name: "Location", key: "user_city", type: "text", selected: true },
            ],
        };
    }

    componentDidMount() {
        let apiEndPoint = `api/v1/recruiter/candidates/list?status=applied`;
        axios
            .get(apiEndPoint, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } })
            .then((response) => {
                this.setState({ data: response.data.data.data });
                console.log("response", response.data.data.data);
            });
    }

    render() {
        return (
            <div class="container">
                <ListPaginate columns={this.state.columns} data={this.state.data} />
            </div>
        );
    }
}
