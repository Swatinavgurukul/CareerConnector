import React, { useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import SavedJobs from "./savedJobs.jsx";
import AppliedJobs from "./appliedJobs.jsx";
import axios from "axios";
import { connect } from "react-redux";
import Fuse from "fuse.js";
import { useTranslation } from "react-i18next";


const Applications = (props) => {
    const { t } = useTranslation();
    const [savJobsData, savedJobsData] = useState([]);
    const [appJobsData, appliedJobsData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [errorDisplay, setErrorDisplay] = useState(false);
    const [searchHandle, setSearchHandle] = useState(false);
    const [query, setQuery] = useState("");
    const [data, setData] = useState([]);
    let [loading, setLoading] = useState(true);
    const [flag, setFlag] = useState(false);

    const getSavedData = () => {
        axios
            .get("/api/v1/jobs/user/bookmarks", { headers: { Authorization: `Bearer ${props.userToken}` } })
            .then((response) => {
                savedJobsData(response.data.data.data);
                setTotalPages(response.data.data.total_pages);
            })
            .catch((error) => {
                if (error) {
                    setErrorDisplay(true);
                }
            });
    };
    const getAppliedData = () => {
        axios
            .get("api/v1/user/jobs/applied", { headers: { Authorization: `Bearer ${props.userToken}` } })
            .then((response) => {
                appliedJobsData(response.data.data.data);
                setTotalPages(response.data.data.total_pages);
                setLoading(false);
            })

            .catch((error) => {
                if (error) {
                    setErrorDisplay(true);
                }
                setLoading(false);
            });
    };

    const handleSelect = (key) => {
        if (key === "savedJobs") {
            getSavedData();
        }
    };
    useEffect(() => {
        getSavedData();
        getAppliedData();
    }, [flag]);
    const onSearch = (query) => {
        if (query === "") {
            setQuery(query);
            getAppliedData();
            getSavedData();
        } else {
            setQuery(query);
            const fuse = new Fuse(searchHandle ? savJobsData : appJobsData, {
                keys: ["company", "title"],
            });
            let results = fuse.search(query);
            let searchResults = results.map((result) => result.item);
            searchHandle ? savedJobsData(searchResults) : appliedJobsData(searchResults);
        }
    };

    return (
        <div className="jobs-page w-100 h-100">
            <div class="container-fluid p-0">
                <div className="gray-100">
                    <div className="d-md-flex py-4 col-lg-10 mx-auto">
                        <div className="col-md-6">
                            <h4 className="mb-3">{t(props.language?.layout?.js_application_allapplication)}</h4>
                            <div className="d-flex align-items-center">
                                <img
                                    className="svg-lg-x2 mr-3 mb-2"
                                    src="svgs/rich_icons/applications.svg"
                                    alt="Application Icon"
                                    title="Application Icon"
                                />
                                <div className="d-flex align-items-center">
                                    <p>
                                        <span>{t(props.language?.layout?.js_application_info)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div>
                                <div className="d-md-flex justify-content-end">
                                    <div class="form-group-md animated">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="Search"
                                            name="Search"
                                            placeholder={t(props.language?.layout?.js_jobs_search)}
                                            value={query}
                                            onChange={(e) => onSearch(e.target.value)}
                                        />
                                        <div className="icon-invert d-flex justify-content-end">
                                            <img
                                                src="/svgs/icons_new/search.svg"
                                                alt="search"
                                                className="svg-xs svg-gray mt-n4 mr-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-10 mx-auto">
                    <div class="row pt-5">
                        <div class="col-md-12 px-3">
                            <Tabs
                                defaultActiveKey="appliedJobs"
                                onSelect={handleSelect}
                                id="uncontrolled-tab-example"
                                className="nav-underline-primary">
                                <Tab
                                    eventKey="appliedJobs"
                                    title={t(props.language?.layout?.js_application_appliedjobs)}
                                    onChange={() => setFlag(false)}
                                    onEnter={() => setSearchHandle(false)}>
                                    <AppliedJobs appJobsData={appJobsData} getAppliedData={getAppliedData} loading={loading} />
                                </Tab>
                                <Tab
                                    eventKey="savedJobs"
                                    title={t(props.language?.layout?.js_application_savedjobs)}
                                    onChange={() => setFlag(true)}
                                    onEnter={() => setSearchHandle(true)}>
                                    <SavedJobs
                                        savJobsData={savJobsData}
                                        getSavedData={getSavedData}
                                        errorDisplay={errorDisplay}
                                        totalPages={totalPages}
                                    />
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(Applications);
