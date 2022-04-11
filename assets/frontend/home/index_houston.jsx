import React, { Suspense, useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import Axios from "axios";
// import Footer from "../dashboard/footer.jsx";
import { Link } from "react-router-dom";
import FooterUpdate from "../dashboard/_footer.jsx";
// import HeaderUpdate from "../dashboard/_header.jsx";
import { getQueryParameters, getQueryString, removeEmpty } from "../modules/helpers.jsx";
import { event } from "@fullstory/browser";
import LocationSearchInput from "../common/locationsAutoComplete.jsx";
import HomePageData from "./homepage_data.jsx";

const Search = (props) => {
    // const { addToast } = useToasts()
    const history = useHistory();
    let [searchQuery, setSearchQuery] = useState({
        query: null,
        location: null,
    });
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
        // setLoading(true);
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
            setSearchQuery(query_params.query);
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
    const searchSubmit = () => {
        // let query_params = {};
        // if (query.length > 0) query_params.query = query;
        let updated_url = "?" + getQueryString(removeEmpty(searchQuery));
        history.push("/search" + updated_url);
    };
    /**
     * get search results when press Enter key in keyboard
     */
    const onKeyEnterHandler = (event) => {
        if (event.charCode === 13 && searchQuery) {
            setLoading(true);
            searchSubmit();
        } else {
            setIsQueryEmpty(true);
        }
    };

    const handleSearchQuery = (q) => {
        setSearchQuery(q);
        // !e.target.value ? setIsQueryEmpty(true) : setIsQueryEmpty(false);
    };
    const setSearchLocation = (location) => {
        setSearchQuery({ ...searchQuery, location: location || null });
    };

    return (
        <div>
            <div className="masthead-homepage">
                <div className="content-overlay w-100">
                    <img src="/uploads/user_v1llv353bppo/houston.jpg" alt="home cover" width="100%" />
                </div>
                <div>
                    <div className="container">
                        <div className="home_text--content text-white text-center">
                            <div className="mb-0 text-heading-lg-homepage">Welcome to Career Connector</div>
                            <h2>Powered by Simplify Workforce</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black text-white text-center pt-5 pb-5">
                <div class="container">
                    <div class="row text-center mb-3">
                        <div class="offset-1 col-10 ">
                            <h5 className="mb-4">Turning Skills into Opportunity</h5>
                            <p>
                                We’ve heard from community leaders, elected officials, and job seekers that – while
                                having access to economic data, skills, and industry-recognized credentials is valuable
                                – it needs to lead to employment. At the same time, we’ve heard from employers who need
                                skilled candidates with diverse backgrounds, skills, and experiences to fuel their
                                inclusive growth. Together, we can connect skilled job seekers and employers to increase
                                access to opportunity in a changing economy.
                            </p>
                            <p>
                                Microsoft’s Career Connector is an invitation-only service that connects job seekers and
                                our nonprofit and learning partners who support them to our employer partners who need
                                skilled talent, increasing economic opportunity for all.
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col-md-12">
                            <div class="row">
                                <div class="offset-3 col-6">
                                    <form role="form" className="search_form--input">
                                        <div class="form-group">
                                            <div class="input-group mt-0">
                                                <input
                                                    type="search"
                                                    className="form-control search_input form-control-lg rounded-0 shadow-none border"
                                                    placeholder="Search jobs by keywords"
                                                    value={searchQuery.query}
                                                    onKeyPress={onKeyEnterHandler}
                                                    onChange={(e) =>
                                                        handleSearchQuery({
                                                            ...searchQuery,
                                                            query: e.target.value || null,
                                                        })
                                                    }
                                                    autoFocus
                                                    name="query"
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

            <div className="container">
                <div className="row">
                    <div className="col-12"></div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row mt-5">
                    <HomePageData />
                </div>
                {/* Find your path */}

                <div className="row mt-5">
                    <div className="col-md-10 offset-md-1 col-sm-12">
                        <div class="wrapper">
                            <div class="flex-container">
                                <div class="flex-items flex-items-1">
                                    <img
                                        src="/uploads/user_v1llv353bppo/video.jpg"
                                        alt="training"
                                        className="img-fluid border border-right-0"
                                        width="100%"
                                    />
                                </div>
                                <div class="flex-items flex-items-2 text-white bg-primary thin-scrollbar" tabIndex="0">
                                    <div className="p-4">
                                        <h1>About Career Connector</h1>
                                        <p>
                                            Microsoft has an opportunity to connect our network of nonprofit and
                                            learning partners with our commercial partners, suppliers, and customers –
                                            expanding job seekers’ access to in-demand roles while increasing employers’
                                            access to the skilled talent they need to grow a more inclusive workforce.
                                            Our nonprofit and learning partners provide digital and professional skills
                                            programs to individuals who have limited access to economic opportunity in
                                            the digital economy – including women, certain racial and ethnic groups,
                                            individuals with disabilities, individuals in underserved rural or urban
                                            markets, and immigrants and refugees. Microsoft is launching Career
                                            Connector, a service that connects skilled job seekers and the partners who
                                            support them to relevant employment opportunities across Microsoft’s network
                                            of customers, partners, and providers. Our goal is to help 50,000 job
                                            seekers around the world translate skills to employment to opportunity by
                                            2024.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-5">
                    <div class="col-md-10 offset-md-1 col-sm-12">
                        <h2 className="pt-2 pb-2">Explore Jobs by City</h2>
                        <div className="row">
                            <div class="col">
                                <a href="/location/atlanta">
                                    <img
                                        src="/uploads/user_v1llv353bppo/city_atlanta.jpg"
                                        alt="atlanta"
                                        class="img-fluid"
                                        width="100%"
                                    />
                                    <div class="pt-2 h5">Atlanta</div>
                                </a>
                            </div>

                            <div class="col">
                                <img
                                    src="/uploads/user_v1llv353bppo/city_chicago.jpg"
                                    alt="chicago"
                                    class="disabled img-fluid"
                                    width="100%"
                                />
                                <div class="pt-2 h5">Chicago</div>
                            </div>
                            <div class="col">
                                <img
                                    src="/uploads/user_v1llv353bppo/city_detroit.jpg"
                                    alt="detroit"
                                    class="disabled img-fluid"
                                    width="100%"
                                />
                                <div class="pt-2 h5">Detroit</div>
                            </div>

                            <div class="col">
                                <img
                                    src="/uploads/user_v1llv353bppo/city_indianapolis.jpg"
                                    alt="city indianapolis"
                                    class="disabled img-fluid"
                                    width="100%"
                                />
                                <div class="pt-2 h5">Indianapolis</div>
                            </div>
                            <div class="col">
                                <img
                                    src="/uploads/user_v1llv353bppo/city_la.jpg"
                                    alt="la"
                                    class="disabled img-fluid"
                                    width="100%"
                                />
                                <div class="pt-2 h5">Los Angeles</div>
                            </div>
                            <div class="col">
                                <img
                                    src="/uploads/user_v1llv353bppo/city_nyc.jpg"
                                    alt="nyc"
                                    class="disabled img-fluid"
                                    width="100%"
                                />
                                <div class="pt-2 h5">New York</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-5 mb-5">
                    <div className="col-md-10 offset-md-1 col-sm-12 ">
                        <h2 class="text-center">Career Connector partners</h2>
                        <div className="row mt-4">
                            <div className="col-md-5">
                                <h3 className="text-center">Employer partners</h3>
                                <img
                                    src="/uploads/user_v1llv353bppo/ep.jpg"
                                    alt="training"
                                    className="img-fluid"
                                    width="100%"
                                />
                            </div>
                            <div className="col-md-5 offset-md-2">
                                <h3 className="text-center">Skilling partners</h3>
                                <img
                                    src="/uploads/user_v1llv353bppo/np.jpg"
                                    alt="Nonprofit"
                                    className="img-fluid"
                                    width="100%"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FooterUpdate />
        </div>
    );
};
export default Search;
