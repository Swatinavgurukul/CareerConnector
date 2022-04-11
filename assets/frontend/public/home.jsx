import React from "react";

const Home = () => {
    return (
        <div>
            <div className="jumbotron jumbo-background-image">
                <div className="container">
                    <form method="GET" action="/search">
                        <div className="row justify-content-end mx-auto search-input-field position-relative">
                            <div className="col-md-4 col-sm-12 p-0">
                                <input
                                    type="search"
                                    className="form-control form-control-lg rounded-0"
                                    placeholder="Job Title"
                                    name="q"
                                    autofocus
                                />
                            </div>
                            <div className="col-md-3 col-sm-12 p-0">
                                <input
                                    type="search"
                                    className="form-control form-control-lg rounded-0"
                                    name="loc"
                                    placeholder="Location"
                                />
                                <div className="form-check custom-checkbox pt-4">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="remotely"
                                        value="True"
                                        id="defaultCheck01"
                                    />
                                    <label className="form-check-label" for="defaultCheck01"></label>{" "}
                                    <span className="custom-checkbox-text stretched-link font-weight-bold">Remote</span>
                                </div>
                            </div>
                            <div className="col-md-1 col-sm-12 p-0">
                                <button type="submit" className="btn btn-danger btn-lg rounded-0">
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-10 offset-md-1 col-sm-12">
                        <h1 className="text-primary">
                            <span className="text-danger">Explore</span> Jobs in your location
                        </h1>
                        <div className="row">
                            <div className="col-md-3">
                                <a href="#" className="text-decoration-none text-dark">
                                    <div className="card elevation-1">
                                        <div className="card-body text-center">
                                            <img src="/svgs/icons/new-york.svg" alt="new-york" className="w-50" />
                                            <h2 className="card-text pt-4">New York</h2>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-md-3">
                                <a href="#" className="text-decoration-none text-dark">
                                    <div className="card elevation-1">
                                        <div className="card-body text-center">
                                            <img src="/svgs/icons/london.svg" alt="london" className="w-50" />
                                            <h2 className="card-text pt-4">London</h2>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-md-3">
                                <a href="#" className="text-decoration-none text-dark">
                                    <div className="card elevation-1">
                                        <div className="card-body text-center">
                                            <img
                                                src="/svgs/icons/san-francisco.svg"
                                                alt="san francisco "
                                                className="w-50"
                                            />
                                            <h2 className="card-text pt-4">San Francisco</h2>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-md-3">
                                <a href="#" className="text-decoration-none text-dark">
                                    <div className="card elevation-1">
                                        <div className="card-body text-center">
                                            <img src="/svgs/icons/paris.svg" alt="paris" className="w-50" />
                                            <h2 className="card-text pt-4">Paris</h2>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="row pt-5">
                            <div className="col-md-6 d-flex">
                                <h2 className="display-4 text-muted align-self-end">FIND YOUR PERFECT JOB MATCH</h2>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-n4">
                                    <img src="/images/homepage_1.png" alt="healthcare" className="img-fluid" />
                                </div>
                                <a href="#" className="text-decoration-none text-white">
                                    <h5 className="pl-3 img-text position-relative">Healthcare</h5>
                                </a>
                            </div>
                            <div className="col-md-6 d-flex">
                                <h2 className="align-self-end">
                                    Search results tuned precisely to the criteria you set so we can better connect you
                                    with relevant and personalized tech positions.
                                </h2>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex mt-n1">
                                    <div>
                                        <div className="mb-n4">
                                            <img
                                                src="/images/homepage_3.png"
                                                alt="human resources"
                                                className="img-fluid"
                                            />
                                        </div>
                                        <a href="#" className="text-decoration-none text-white">
                                            <h5 className="position-relative img-text pl-3">Human Resources</h5>
                                        </a>
                                    </div>
                                    <div>
                                        <div className="mb-n4">
                                            <img src="/images/homepage_4.png" alt="IT services" className="img-fluid" />
                                        </div>
                                        <a href="#" className="text-decoration-none text-white">
                                            <h5 className="img-text position-relative pl-3">IT Services</h5>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row pt-4">
                            <div className="col-md-6">
                                <div>
                                    <img
                                        src="/uploads/user_v1llv353bppo/homepage_5.png"
                                        alt="job seeker"
                                        className="img-fluid"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 d-flex">
                                <div className="align-self-end">
                                    <h2 className="mb-4">
                                        JOB SEEKERS: <span className="text-secondary">FIND THE RIGHT</span> JOB
                                    </h2>
                                    <h2 className="text-muted mb-4">
                                        We get it – getting the right job can be tough. Our Hiring Solutions are here to
                                        help
                                        <span className="text-danger">simplify</span> the process, speed up
                                        time-to-get-hired and make life a lot less stressful.
                                    </h2>
                                    <a href="/search" className="text-decoration-none">
                                        <button type="button" className="btn btn-outline-primary btn-lg mb-1">
                                            Discover the perfect Job
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;
