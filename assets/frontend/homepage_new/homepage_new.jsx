import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useOuterClick } from "../modules/helpers.jsx";
import { connect } from "react-redux";
import { _languageName } from "../actions/actionsAuth.jsx";
import { getQueryParameters, getQueryString, removeEmpty } from "../modules/helpers.jsx";
import LocationSearchInput from "../common/locations.jsx";
const locationsJSON = {
    country: false,
    state: false,
    city: true,
};
const new_homepage = (props) => {
    const history = useHistory();
    let [searchQuery, setSearchQuery] = useState({
        query: null,
        location: null,
    });
    const homepageSearch = (event) => {
        event.preventDefault();
        searchSubmit();
    };
    const searchSubmit = () => {
        let updated_url = "?" + getQueryString(removeEmpty(searchQuery));
        history.push("/search" + updated_url);
    };
    const handleSearchQuery = (q) => {
        setSearchQuery(q);
    };
    const setSearchLocation = (location) => {
        let locationValue = location.split(",");
        setSearchQuery({ ...searchQuery, location: locationValue[0], state: locationValue[1] || null });
    };
    return (
        <div>
            <div className="home-header">
                <div className="content-overlay w-100">
                    <img src="/uploads/user_v1llv353bppo/homepage_new.jpg" alt="home cover" width="100%" />
                </div>
                <div className="container">
                    <div className="home-content text-white px-3 px-md-0">
                        <div className="header-title">Find the perfect role for you</div>
                        <div className="row py-3">
                            <div className="col-md-5 pr-md-0 search">
                                <div className="form-group animated">
                                    <input
                                        type="text"
                                        className="form-control border-right-radius-style"
                                        placeholder="Job title, keywords"
                                        onChange={(e) =>
                                            handleSearchQuery({
                                                ...searchQuery,
                                                query: e.target.value || null,
                                            })
                                        }
                                    />
                                    <img
                                        src="/svgs/icons_new/briefcase.svg"
                                        alt="Job title, keywords"
                                        className="svg-xs svg-gray"
                                    />
                                </div>
                            </div>
                            <div className="col-md-5 px-md-0 search">
                                <div className="form-group animated homenew-location">
                                    {/* <input
                                        type="text"
                                        className="form-control border-radius-style"
                                        placeholder="City, state or pin code"
                                        onChange={(e) =>
                                            setSearchLocation({
                                                ...searchQuery,
                                                location: e.target.value || null,
                                            })
                                        }
                                    /> */}
                                    <LocationSearchInput
                                        setLocationCity={setSearchLocation}
                                        locationsJSON={locationsJSON}
                                    />
                                    <img
                                        src="/svgs/icons_new/map-pin.svg"
                                        alt="City, state or pin code"
                                        className="svg-xs svg-gray"
                                    />
                                </div>
                            </div>
                            <div className="col-md-2 pl-md-0">
                                <div className="d-none d-md-block">
                                    <button
                                        onClick={(event) => homepageSearch(event)}
                                        className="btn btn-light border-left-radius-style"
                                        type="button"
                                        name="Search"
                                        style={{ minHeight: "2.625rem" }}>
                                        <img
                                            src="/svgs/icons_new/search.svg"
                                            alt="Search"
                                            className="svg-sm svg-gray"
                                        />
                                    </button>
                                </div>
                                <div className="d-block d-md-none">
                                    <button className="btn btn-primary px-5" type="button">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="d-md-flex py-3">
                    <div className="col-md-6">
                        <img
                            src="/uploads/user_v1llv353bppo/covid-illustration.svg"
                            alt="Stay at home prevent COVID-19"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-md-5 mx-auto d-flex align-items-center">
                        <div className="mt-4 mt-md-0 pl-md-5">
                            <h1 className="font-weight-bold">Our COVID-19 Response</h1>
                            <p>
                                We prioritize the health and safety of our candidates, employees and their families in
                                response to the Coronavirus Disease (COVID-19). All of our interviews are currently
                                conducted virtually, learn more on how to prepare for your virtual interview.
                            </p>
                            <button className="btn btn-primary">
                                Learn more
                                <img
                                    src="/svgs/icons_new/chevron-right.svg"
                                    alt="Get started"
                                    className="svg-sm invert-color ml-2"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid bg-light py-md-5 py-4 p-0">
                <div className="container">
                    <div className="d-md-flex mb-md-5 mb-4 bg-white jobs-content">
                        <div className="col-md-6 mx-auto d-flex align-items-center py-3 py-md-0">
                            <div className="mx-auto">
                                <h2 className="font-weight-bold">Let’s grow together.</h2>
                                <p class="pr-md-5">
                                    We're building a culture where amazing people (like you) can do their best work. If
                                    you're ready to grow your career and help millions of organizations grow better,
                                    you've come to the right place.
                                </p>
                                <Link to="/search" className="btn btn-primary">
                                    Explore all jobs
                                    <img
                                        src="/svgs/icons_new/chevron-right.svg"
                                        alt="Explore all jobs"
                                        className="svg-sm invert-color ml-2"
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-5 p-0">
                            <img
                                src="/uploads/user_v1llv353bppo/perfect-job-image.jpg"
                                alt="Find the perfect job for you"
                                className="img-fluid rounded-right"
                            />
                        </div>
                    </div>
                    <div className="d-md-flex bg-white jobs-content">
                        <div className="col-md-5 p-0">
                            <img
                                src="/uploads/user_v1llv353bppo/find-people-image.jpg"
                                alt="Come and find your people here"
                                className="img-fluid rounded-left"
                            />
                        </div>
                        <div className="col-md-6 mx-auto d-flex align-items-center py-3 py-md-0">
                            <div className="mx-auto">
                                <h2 className="font-weight-bold">Come build the future with us</h2>
                                <p class="pr-md-5">
                                    We're uniting the best entrepreneurs, and professionals across jall job functions to
                                    create seamless experiences for our customers.
                                </p>

                                <Link
                                    to={{
                                        pathname: "/jobs/create",
                                        state: {
                                            pathname: "/jobs/create",
                                        },
                                    }}
                                    className="btn btn-primary">
                                    Join us
                                    <img
                                        src="/svgs/icons_new/chevron-right.svg"
                                        alt="Post a job"
                                        className="svg-sm invert-color ml-2"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="d-md-flex my-md-5 my-3">
                    <div className="col-md-5 d-flex align-items-center p-0">
                        <div className="px-2 px-md-0">
                            <div className="home-title pb-3 font-weight-bold">Explore your fit</div>
                            <p>
                                Want to make a difference? So do we. Step in to explore the wealth of career
                                opportunities and take your career to the next level.
                            </p>
                            <p>
                                We trust amazing people to do amazing things. Here, you have ownership over work that
                                directly impacts the business. You can move fast, and learn even faster. We're committed
                                to building a diverse and inclusive environment where you feel you belong.
                            </p>
                        </div>
                    </div>
                    <div className="offset-md-1  col-md-6 p-0">
                        <div className="d-md-flex text-white trending-jobs">
                            <div className="d-flex flex-column">
                                <div className="p-md-2 py-2 px-0 mx-auto">
                                    <div className="position-relative">
                                        <img src="/uploads/user_v1llv353bppo/trends-image.jpg" alt="Trends" className="img-fluid" />
                                        <div className="content">
                                            <h3 className="font-weight-bold mb-0">Benefits</h3>
                                            <p>
                                                <a href="#" className="text-white text-decoration-none">
                                                    Learn more
                                                    <img
                                                        src="/svgs/icons_new/arrow-corner-circle.svg"
                                                        className="svg-xxs ml-2"
                                                        alt="Learn more"
                                                    />
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-md-2 py-2 px-0 mx-auto">
                                    <div className="position-relative">
                                        <img
                                            src="/uploads/user_v1llv353bppo/future-trends.jpg"
                                            alt="Future trends"
                                            className="img-fluid"
                                        />
                                        <div className="content">
                                            <h3 className="font-weight-bold mb-0">Find Your Team</h3>
                                            <p>
                                                <a href="#" className="text-white text-decoration-none">
                                                    Learn more
                                                    <img
                                                        src="/svgs/icons_new/arrow-corner-circle.svg"
                                                        className="svg-xxs ml-2"
                                                        alt="Learn more"
                                                    />
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column">
                                <div className="p-md-2 py-2 px-0 mx-auto">
                                    <div className="position-relative">
                                        <img src="/uploads/user_v1llv353bppo/location.jpg" alt="Location" className="img-fluid" />
                                        <div className="content">
                                            <h3 className="font-weight-bold mb-0">Location</h3>
                                            <p>
                                                <a href="#" className="text-white text-decoration-none">
                                                    Learn more
                                                    <img
                                                        src="/svgs/icons_new/arrow-corner-circle.svg"
                                                        className="svg-xxs ml-2"
                                                        alt="Learn more"
                                                    />
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-md-2 py-2 px-0 mx-auto">
                                    <div className="position-relative">
                                        <img src="/uploads/user_v1llv353bppo/it-service.jpg" alt="IT services" className="img-fluid" />
                                        <div className="content">
                                            <h3 className="font-weight-bold mb-0">Career Journey</h3>
                                            <p>
                                                <a href="#" className="text-white text-decoration-none">
                                                    Learn more
                                                    <img
                                                        src="/svgs/icons_new/arrow-corner-circle.svg"
                                                        className="svg-xxs ml-2"
                                                        alt="Learn more"
                                                    />
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-top border-bottom py-md-5 py-3">
                <div className="container">
                    <div className="home-title text-center font-weight-bold mb-2">Employee stories</div>
                    <h5 className="text-center">Meet the people and know their story who power Simplify</h5>
                    <div className="d-md-flex mt-md-5 mt-3">
                        <div class="card-deck">
                            <div class="card border-0 mr-md-2 mr-lg-4 ml-0">
                                <img src="/uploads/user_v1llv353bppo/employee-1.jpg" alt="Employee stories" className="img-fluid" />
                                <div class="card-body p-2 mt-2">
                                    <h5 class="card-title font-weight-bold">
                                        “High expectations are the key to absolutely everything.”
                                    </h5>
                                    <p class="card-text mb-0">
                                        The Power of Mentoring and Networking for Women in STEM—A Female Talents Network
                                        Story.The Female Talents Network is a net...
                                    </p>
                                </div>
                                <div class="card-footer bg-transparent border-0 pt-0 p-2">
                                    <p class="card-text">
                                        <span>
                                            <a href="#" className="text-decoration-none">
                                                Read full story &nbsp;&#129122;
                                            </a>
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div class="card border-0 mx-md-2 mx-lg-4">
                                <img src="/uploads/user_v1llv353bppo/employee-2.jpg" alt="Employee stories" className="img-fluid" />
                                <div class="card-body p-2 mt-2">
                                    <h5 class="card-title font-weight-bold">
                                        “Celebrating a team member … virtually.”
                                    </h5>
                                    <p class="card-text mb-0">
                                        In lieu of cake in the break room, we all got creative when celebrating major
                                        coworker milestones this year. We hosted virtual...
                                    </p>
                                </div>
                                <div class="card-footer bg-transparent border-0 pt-0 p-2">
                                    <p class="card-text">
                                        <span>
                                            <a href="#" className="text-decoration-none">
                                                Read full story &nbsp;&#129122;
                                            </a>
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div class="card border-0 mx-md-2 mx-lg-4">
                                <img src="/uploads/user_v1llv353bppo/employee-3.jpg" alt="Employee stories" className="img-fluid" />
                                <div class="card-body p-2 mt-2">
                                    <h5 class="card-title font-weight-bold">
                                        “Meet employees behind our new health and wellness program.”
                                    </h5>
                                    <p class="card-text mb-0">
                                        We work closely with health and safety experts and scientists. We conduct
                                        thousands of safety inspections each day in our buildings...
                                    </p>
                                </div>
                                <div class="card-footer bg-transparent border-0 pt-0 p-2">
                                    <p class="card-text">
                                        <span>
                                            <a href="#" className="text-decoration-none">
                                                Read full story &nbsp;&#129122;
                                            </a>
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div class="card border-0 ml-md-2 ml-lg-4 mr-0">
                                <img src="/uploads/user_v1llv353bppo/employee-4.jpg" alt="Employee stories" className="img-fluid" />
                                <div class="card-body p-2 mt-2">
                                    <h5 class="card-title font-weight-bold">“Cross-Cultural Diversity.”</h5>
                                    <p class="card-text mb-0">
                                        By respecting individual cultures and unique backgrounds, we transcend
                                        geographies, drive innovation and better support our clients...
                                    </p>
                                </div>
                                <div class="card-footer bg-transparent border-0 pt-0 p-2">
                                    <p class="card-text">
                                        <span>
                                            <a href="#" className="text-decoration-none">
                                                Read full story &nbsp;&#129122;
                                            </a>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container my-md-5 my-5">
                <div className="home-title text-center font-weight-bold mb-2">Who we are</div>
                <h5 className="text-center">Explore the stories behind our diverse workforce.</h5>
                <div className="d-md-flex mt-md-5 mt-3">
                    <div class="card-deck">
                        <div class="card border-0 mr-md-2 mr-lg-5 mb-md-0 mb-4 jobs-content">
                            <img src="/uploads/user_v1llv353bppo/news.jpg" alt="Featured in news" className="img-fluid" />
                            <div class="card-body">
                                <h4 class="card-title font-weight-bold border-bottom pb-2">Featured in news</h4>
                                <h5 class="card-text">
                                    Simplify named leader in Gartner Magic Quadrant for Applicant Tracking Systems
                                </h5>
                                <p class="mb-0">
                                    Applicant tracking systems (ATSs) automate the requisition-to-hire process. The
                                    Internet has provided vendors with the opportunity to expand solution...
                                </p>
                            </div>
                            <div class="card-footer bg-transparent border-0 pt-0">
                                <div class="card-text d-flex pb-2">
                                    <div className="p-0">
                                        <a href="#" className="text-decoration-none">
                                            Continue Reading &nbsp;&#129122;
                                        </a>
                                    </div>
                                    <div className="ml-auto">
                                        <a href="#">
                                            <img src="/svgs/icons_new/share.svg" alt="Sharing" className="svg-xs" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card border-0 mx-md-2 mx-lg-5 mb-md-0 mb-4 jobs-content">
                            <img src="/uploads/user_v1llv353bppo/network.jpg" alt="Our network" className="img-fluid" />
                            <div class="card-body">
                                <h4 class="card-title card-title font-weight-bold border-bottom pb-2">Our network</h4>
                                <h5 class="card-text">Simplify Direct Sourcing Now Available on SAP® App Center</h5>
                                <p class="mb-0">
                                    WillHire is the first to market direct sourcing and talent pool platform with
                                    seamless integration with SAP Fieldglass for customers to directly source...
                                </p>
                            </div>
                            <div class="card-footer bg-transparent border-0 pt-0">
                                <div class="card-text d-flex pb-2">
                                    <div className="p-0">
                                        <a href="#" className="text-decoration-none">
                                            Continue Reading &nbsp;&#129122;
                                        </a>
                                    </div>
                                    <div className="ml-auto">
                                        <a href="#">
                                            <img src="/svgs/icons_new/share.svg" alt="Sharing" className="svg-xs" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card border-0 ml-md-2 ml-lg-5 mb-md-0 mb-4 jobs-content">
                            <img src="/uploads/user_v1llv353bppo/awards.jpg" alt="Awards &amp; accolades" className="img-fluid" />
                            <div class="card-body">
                                <h4 class="card-title card-title font-weight-bold border-bottom pb-2">
                                    Awards &amp; accolades
                                </h4>
                                <h5 class="card-text">Best Workplaces for Parents in 2020 by Great Place to Work®</h5>
                                <p class="mb-0">
                                    Great Place to Work is the global authority on workplace culture, employee
                                    experience and the leadership behaviors proven to deliver...
                                </p>
                            </div>
                            <div class="card-footer bg-transparent border-0 pt-0">
                                <div class="card-text d-flex pb-2">
                                    <div className="p-0">
                                        <a href="#" className="text-decoration-none">
                                            Continue Reading &nbsp;&#129122;
                                        </a>
                                    </div>
                                    <div className="ml-auto">
                                        <a href="#">
                                            <img src="/svgs/icons_new/share.svg" alt="Sharing" className="svg-xs" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-light-blue py-4 my-md-5 my-4 font-weight-bold">
                <div className="container">
                    <div class="card-deck">
                        <div class="card border-0 mx-md-5 mb-md-0 mb-4 text-center bg-transparent">
                            <h2 className="text-primary font-weight-bold">28</h2>
                            <h5 className="font-weight-medium">Global Locations</h5>
                        </div>
                        <div class="card border-0 mx-md-5 mb-md-0 mb-4 text-center bg-transparent">
                            <h2 className="text-primary font-weight-bold">3250+</h2>
                            <h5>Employees</h5>
                        </div>
                        <div class="card border-0 mx-md-5 mb-md-0 mb-4 text-center bg-transparent">
                            <h2 className="text-primary font-weight-bold">20%+</h2>
                            <h5>Employees for more than 5 years</h5>
                        </div>
                        <div class="card border-0 mx-5 mb-md-0 mb-4 text-center bg-transparent">
                            <h2 className="text-primary font-weight-bold">450+</h2>
                            <h5>Clients</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container px-3 px-md-0">
                {/* <h2 className="text-center">
                    <span className="text-primary">1000+</span>
                    &nbsp; integrations and counting to bring you a seamless, robust talent experience
                </h2> */}
                <div className="client">
                    <div className="d-md-flex">
                        <div className="col-md-4">
                            <div className="client-img">
                                <img src="/uploads/user_v1llv353bppo/client.jpg" alt="Feedback" className="img-fluid" />
                            </div>
                        </div>
                        <div className="col-md-7 mx-auto d-flex align-items-center text-white">
                            <div className="mt-md-n5 mt-3">
                                <h5>
                                    "I am impressed with the technology, product offerings, the leadership team, people
                                    honesty and the smooth interview process. Working with colleagues who are smart,
                                    friendly and fun to work with, I see myself making lifetime friends here!”
                                </h5>
                                <div className="mt-4">
                                    <h3 className="mb-0">MAGGIE MUCCIO</h3>
                                    <p>Sales Team </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-md-5 mt-4 px-3 px-md-0">
                <h2 className="font-weight-bold mt-4">Simplify VMS ratings on Glassdoor</h2>
                <p>Learn more on glassdoor.com</p>
            </div>
            <div className="bg-light-blue py-md-4 py-3">
                <div className="container">
                    <div className="d-md-flex py-4 px-2 px-md-0">
                        <div className="col-md-3 p-0 text-center text-md-left">
                            <div className="overall-rating d-md-flex py-2">
                                <img src="/uploads/user_v1llv353bppo/filled-star.png" className="svg-sm" alt="FilledStar" />
                                <img src="/uploads/user_v1llv353bppo/filled-star.png" className="svg-sm mx-2" alt="FilledStar" />
                                <img src="/uploads/user_v1llv353bppo/filled-star.png" className="svg-sm" alt="FilledStar" />
                                <img src="/uploads/user_v1llv353bppo/filled-star.png" className="svg-sm mx-2" alt="FilledStar" />
                                <img src="/uploads/user_v1llv353bppo/empty-star.png" className="svg-sm" alt="EmptyStar" />
                                <h4 className="mx-md-2 my-2 my-md-0 font-weight-bold">4</h4>
                            </div>
                            <h4 className="py-2">Overall rating</h4>
                            <p>This rating is based on unaltered and unedited reviews of employees</p>
                        </div>
                        <div className="col-md-3 p-0 py-3">
                            <svg viewBox="0 0 36 36" class="circular-chart svg-lg mx-auto mb-2">
                                <path
                                    class="circle-bg"
                                    d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    class="circle"
                                    stroke-dasharray={80}
                                    d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                    style={{ stroke: "#00ADEF" }}
                                />
                                <text
                                    x="18"
                                    y="23.35"
                                    class="percentage font-weight-bold"
                                    style={{ fill: "#000", fontSize: ".72rem" }}>
                                    80%
                                </text>
                            </svg>
                            <div className="pl-md-5 text-center text-md-left">
                                <h4 className="py-2">Recommend to a Friend</h4>
                                <p>
                                    Majority of simplifiers say they would recommend the company to someone they know.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-3 p-0 py-3">
                            <svg viewBox="0 0 36 36" class="circular-chart svg-lg mx-auto mb-2">
                                <path
                                    class="circle-bg"
                                    d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    class="circle"
                                    stroke-dasharray={80}
                                    d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                    style={{ stroke: "#00ADEF" }}
                                />
                                <text
                                    x="18"
                                    y="23.35"
                                    class="percentage font-weight-bold"
                                    style={{ fill: "#000", fontSize: ".72rem" }}>
                                    3.8/5
                                </text>
                            </svg>
                            <div className="pl-md-5 text-center text-md-left">
                                <h4 className="py-2">Culture and values</h4>
                                <p>
                                    Simplifiers are satisfied with the company culture that is defined by a strong set
                                    of values.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-3 p-0 py-3">
                            <svg viewBox="0 0 36 36" class="circular-chart svg-lg mx-auto mb-2">
                                <path
                                    class="circle-bg"
                                    d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    class="circle"
                                    stroke-dasharray={90}
                                    d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                    style={{ stroke: "#00ADEF" }}
                                />
                                <text
                                    x="18"
                                    y="23.35"
                                    class="percentage font-weight-bold"
                                    style={{ fill: "#000", fontSize: ".72rem" }}>
                                    4.2/5
                                </text>
                            </svg>
                            <div className="pl-md-5 text-center text-md-left">
                                <h4 className="py-2">Work life balance</h4>
                                <p>Whether in or out of the workplace, our employees are living their best life.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer bg-dark w-100 py-5 text-white">
                <div className="container">
                    <div className="d-md-flex justify-content-center py-md-4">
                        <div className="col-md-5 pr-md-5">
                            <a href="/" className="navbar-brand px-0 py-3" role="link">
                                <img alt="logo" src="/uploads/user_v1llv353bppo/logo-footer.png" class="logo" />
                            </a>
                            <p className="pr-md-5">
                                The Simplify VMS Talent Experience Management platform helps a billion people find the
                                right jobs billion people find the right jobs.
                            </p>
                        </div>
                        {/* <div className="col-md-2">
                            <h5 className="py-3">Our Platform</h5>
                            <a>Simplify VMS</a>
                            <a>Candidate Experience</a>
                            <a>Employee Experience</a>
                            <a>Recruiter Experience</a>
                            <a>Management Experience</a>
                        </div> */}
                        <div className="col-md-3 pl-md-5">
                            <h5 className="py-3">Learn More</h5>
                            <ul className="p-0 list-unstyled">
                                <li><a className="text-white text-decoration-none">Locations</a></li>
                                <li><a className="text-white text-decoration-none">Product &amp; Services</a></li>
                                <li><a className="text-white text-decoration-none" href="https://www.simplifyvms.com/ABOUT">About Us</a></li>
                                <li><a className="text-white text-decoration-none" href="https://simplifyvms.com/PRIVACY-POLICY/">Privacy Policy</a></li>
                                <li><a className="text-white text-decoration-none" href="https://simplifyvms.com/locations-usa">Global Locations</a></li>
                            </ul>
                            <p className="mb-0"></p>
                            <p></p>
                        </div>
                        <div className="col-md-2">
                            <h5 className="py-3">Connect</h5>
                            <ul className="p-0 list-unstyled">
                                <li><a className="text-white text-decoration-none" href="https://simplifyvms.com/take-a-tour/">Contact Us</a></li>
                                <li><a className="text-white text-decoration-none">888.985.7755</a></li>
                                <li><a className="text-white text-decoration-none">+1.267.282.0098</a></li>
                            </ul>
                        </div>
                        <div className="col-md-2">
                            <h5 className="py-3">Follow us on</h5>
                            <a href="https://www.facebook.com/simplify-workforce-102367784707989/">
                                <img src="/uploads/user_v1llv353bppo/facebook.svg" className="svg-sm" alt="Facebook" />
                            </a>
                            <a href="https://twitter.com/simplifychatter" className="mx-2">
                                <img src="/uploads/user_v1llv353bppo/twitter.svg" className="svg-sm" alt="Twitter" />
                            </a>
                            <a href="https://linkedin.com">
                                <img src="/uploads/user_v1llv353bppo/linkedin.svg" className="svg-sm" alt="Linkedin" />
                            </a>
                            <br></br>
                            <div className="mt-3 p-md-0">
                                <Link to="/languages" className="invert-color">
                                    <img
                                        className="svg-sm mt-n1 mr-2"
                                        src="/svgs/icons_new/globe.svg"
                                        alt="Languages"
                                        title="Languages"
                                    />
                                </Link>
                                <a className="text-white pointer" onClick={() => props._languageName('en')}>
                                    EN
                                </a> |
                                <a className="text-white pointer" onClick={() => props._languageName('esp')}>ESP</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps, { _languageName })(new_homepage);