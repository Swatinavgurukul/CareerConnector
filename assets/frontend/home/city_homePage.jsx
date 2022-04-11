import React, { Suspense, useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import Axios from "axios";
import Footer from "../dashboard/footer.jsx";
import { getQueryParameters, getQueryString } from "../modules/helpers.jsx";

const Cityhomepage = () => {
    const history = useHistory();
    let [query, setQuery] = useState("");
    let [loading, setLoading] = useState(false);
    let [isQueryEmpty, setIsQueryEmpty] = useState(false);
    let [isloading, setisLoading] = useState(true);
    const [theme, setTheme] = useState({
        logo: "",
        primaryFooter: "",
        secondaryFooter: "",
    });
    const visible = ["/login", "/forgotPassword", "/signup", "/demo2", "/demo3", "/demo4"];
    const homepageSearch = (event) => {
        event.preventDefault();
        setLoading(true);
        searchSubmit();
        // if (query) {
        //     setLoading(true);
        //     searchSubmit();
        // } else {
        //     setIsQueryEmpty(true);
        // }
    };

    useEffect(() => {
        let query_params = getQueryParameters(history.location.search);
        if (query_params.query !== undefined && query_params.query.length > 0) {
            setQuery(query_params.query);
        }
    }, []);

    /**
     * updating
     */
    const initialRender = useRef(true);
    useEffect(() => {
        getThemeData();
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            searchSubmit();
        }
    }, []);

    const getThemeData = () => {
        Axios.get("/api/v1/tenant/theme")
            .then((response) => {
                setTheme(response.data.data);
                setisLoading(false);
            })
            .catch((error) => {
                setisLoading(false);
                console.log(error.response);
            });
    };
    /**
     * submitting search
     */
    const searchSubmit = (e) => {
        let query_params = {};
        if (query.length > 0) query_params.query = query;
        let updated_url = "?" + getQueryString(query_params);
        history.push("/jobs" + updated_url);
    };
    /**
     * get search results when press Enter key in keyboard
     */
    const onKeyEnterHandler = (event) => {
        if (event.charCode === 13 && query) {
            setLoading(true);
            searchSubmit();
        } else {
            setIsQueryEmpty(true);
        }
    };

    const handleJobTitle = (e) => {
        setQuery(e.target.value);
        !e.target.value ? setIsQueryEmpty(true) : setIsQueryEmpty(false);
    };
    return (
        <div>
            <div className="masthead-homepage city_homepage-newYork">
                <div className="content-overlay">
                    <img src="/uploads/user_v1llv353bppo/new_york.jpg" alt="home cover" height="500px" width="100%" />
                </div>
                <div>
                    <div className="container">
                        <div className="home_text--content text-center">
                            <h1>Welcome to Microsoft Career Connector</h1>
                            <p>Powered by Simplify Workforce</p>
                            <div className="row">
                                <div className="col-md-12">
                                    <form role="form" className="search_form--input">
                                        <div class="form-group">
                                            <div class="input-group mt-0">
                                                <input
                                                    type="search"
                                                    className="form-control search_input form-control-lg rounded-0"
                                                    value={query}
                                                    onKeyPress={onKeyEnterHandler}
                                                    onChange={(e) => handleJobTitle(e)}
                                                    autoFocus
                                                    name="job_title"
                                                />
                                                <span class="input-group-btn">
                                                    {loading ? (
                                                        <div class="btn btn-danger btn-lg rounded-0 bouncingLoader">
                                                            <div></div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={(event) => homepageSearch(event)}
                                                            type="submit"
                                                            className="btn btn-primary btn-lg rounded-0 p-2 search_btn">
                                                            Search
                                                        </button>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row mt-5">
                    <div className="col-md-10 offset-md-1 col-sm-12 text-justify">
                        <div class="wrapper">
                            <div class="flex-container">
                                <div class="flex-items flex-items-1">
                                    <img
                                        src="/uploads/user_v1llv353bppo/training.jpg"
                                        alt="training"
                                        className="img-fluid"
                                    />
                                </div>
                                <div class="flex-items flex-items-2">
                                    <div className="flex-items--content">
                                        <h1>
                                            No-cost training and career <br /> resources <br /> Starting with you
                                        </h1>
                                        <p className="">
                                            Answer 4 short questions to find your customized learning path
                                        </p>
                                        <button type="submit" className="btn btn-primary btn-lg rounded-0 mt-3">
                                            Get Start
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-10 offset-md-1 col-sm-12 text-justify">
                        <div className="row mt-3">
                            <div className="col-md-6 col-xs-12 d-flex">
                                <div className="align-self-center text-left pr-3">
                                    <h1>Different perspectives help us all to achieve more</h1>
                                    <p className="mt-3">
                                        Our mission is deeply inclusive: empower every person and every organization on
                                        the planet to achieve more. We expect each of us—no matter what our level, role
                                        or function is—to play an active role in creating environments where people of a
                                        diverse range of backgrounds are excited to bring all of who they are and do
                                        their best work.
                                    </p>
                                    <a href="javascript:void(0)"> read more</a>
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <img
                                    src="/uploads/user_v1llv353bppo/iconImage.png"
                                    alt="job seeker"
                                    className="img-fluid"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-10 offset-md-1 col-sm-12">
                        <div className="row pt-md-4">
                            <div className="col-md-6">
                                <div className="pb-md-0 pb-3">
                                    <img
                                        src="/uploads/user_v1llv353bppo/training.jpg"
                                        alt="job seeker"
                                        className="img-fluid"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 d-flex">
                                <div className="align-self-center text-left">
                                    <h1 className="mb-4">Job seekers: find the right job</h1>
                                    <p className="mb-4">
                                        We get it – getting the right job can be tough. Our Hiring Solutions are here to
                                        help
                                        <span className="text-danger pl-1">simplify</span> the process, speed up
                                        time-to-get-hired and make life a lot less stressful.
                                    </p>
                                    <div className="text-md-left text-center ">
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
                    {/* find path */}
                    <div className="col-md-10 offset-md-1 col-sm-12">
                        <div className="find_path text-center mt-5 mb-4">
                            <h1>Find your path</h1>
                            <p className="mt-3">
                                Get the tools to meet your goals, no matter where you are in your career
                            </p>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <figure class="figure">
                                    <img src="/uploads/user_v1llv353bppo/student.jpg" class="img-fluid" alt="student" />
                                    <h3>Students</h3>
                                    <p>Develop practical skills with fun, interactive modules and paths.</p>
                                    <a href="javascript:void(0)">
                                        Explore student modules{" "}
                                        <span>
                                            <img
                                                className="svg-sm "
                                                src="/svgs/icons_new/chevron-right.svg"
                                                alt="Right Arrow"
                                                title="Arrow"
                                            />
                                        </span>{" "}
                                    </a>
                                </figure>
                            </div>
                            <div className="col-md-3">
                                <figure class="figure">
                                    <img
                                        src="/uploads/user_v1llv353bppo/educator.jpg"
                                        class="img-fluid"
                                        alt="educator"
                                    />
                                    <h3>Educators</h3>
                                    <p>
                                        Integrate Microsoft technology into your curriculum, and find tools and support
                                        for your hybrid learning classroom.
                                    </p>
                                    <a href="javascript:void(0)">
                                        Get start{" "}
                                        <span>
                                            <img
                                                className="svg-sm "
                                                src="/svgs/icons_new/chevron-right.svg"
                                                alt="Right Arrow"
                                                title="Arrow"
                                            />
                                        </span>{" "}
                                    </a>
                                </figure>
                            </div>
                            <div className="col-md-3">
                                <figure class="figure">
                                    <img src="/uploads/user_v1llv353bppo/child.jpg" class="img-fluid" alt="child" />
                                    <h3>Veterans and military families</h3>
                                    <p>
                                        Find meaningful opportunities in a digital economy with Microsoft training and
                                        support, and build the critical career skills required for today’s growing tech
                                        industry.
                                    </p>
                                    <a href="javascript:void(0)">
                                        Explore What's Next modules{" "}
                                        <span>
                                            <img
                                                className="svg-sm "
                                                src="/svgs/icons_new/chevron-right.svg"
                                                alt="Right Arrow"
                                                title="Arrow"
                                            />
                                        </span>{" "}
                                    </a>
                                </figure>
                            </div>
                            <div className="col-md-3">
                                <figure class="figure">
                                    <img
                                        src="/uploads/user_v1llv353bppo/bussness.jpg"
                                        class="img-fluid"
                                        alt="bussness"
                                    />
                                    <h3>Business owners</h3>
                                    <p>
                                        Get the skills you need to grow your business with exclusive resources,
                                        programs, tools, and connections.
                                    </p>
                                    <a href="javascript:void(0)">
                                        Find resources{" "}
                                        <span>
                                            <img
                                                className="svg-sm "
                                                src="/svgs/icons_new/chevron-right.svg"
                                                alt="Right Arrow"
                                                title="Arrow"
                                            />
                                        </span>{" "}
                                    </a>
                                </figure>
                            </div>
                        </div>
                        {/* --------our--------------- */}
                        <div className="find_path text-center mt-5 mb-2">
                            <h1>Our New York partners</h1>
                            <p className="mt-3 mb-3">
                                Our thanks to the partners who help make Accelerate Atlanta possible
                            </p>
                        </div>
                        <div className="row pt-md-4 pb-3">
                            <div className="col-md-3">
                                <img src="/uploads/user_v1llv353bppo/cocoacola.jpg" alt="image" className="img-fluid" />
                            </div>
                            <div className="col-md-3">
                                <img src="/uploads/user_v1llv353bppo/homepoint.jpg" alt="image" className="img-fluid" />
                            </div>
                            <div className="col-md-3">
                                <img src="/uploads/user_v1llv353bppo/accenture.jpg" alt="image" className="img-fluid" />
                            </div>
                            <div className="col-md-3">
                                <img src="/uploads/user_v1llv353bppo/resu.jpg" alt="image" className="img-fluid" />
                            </div>
                        </div>
                        <div className="row pt-md-4 pb-3">
                            <div className="col-md-3">
                                <img src="/uploads/user_v1llv353bppo/spring.jpg" alt="image" className="img-fluid" />
                            </div>
                            <div className="col-md-3">
                                <img src="/uploads/user_v1llv353bppo/ga.jpg" alt="image" className="img-fluid" />
                            </div>
                            <div className="col-md-3">
                                <img src="/uploads/user_v1llv353bppo/tech.jpg" alt="image" className="img-fluid" />
                            </div>
                            <div className="col-md-3">
                                <img src="/uploads/user_v1llv353bppo/yearUp.jpg" alt="image" className="img-fluid" />
                            </div>
                        </div>
                        <div className="row pt-md-4 pb-3">
                            <div className="col-md-3">
                                <img src="/uploads/user_v1llv353bppo/women.jpg" alt="image" className="img-fluid" />
                            </div>
                            <div className="col-md-3">
                                <img src="/uploads/user_v1llv353bppo/safe.jpg" alt="image" className="img-fluid" />
                            </div>
                        </div>
                        {/* close */}
                    </div>
                </div>
            </div>
            <Footer theme={theme} isloading={isloading} visible={visible} />
        </div>
    );
};
export default Cityhomepage;
