import React, { Suspense, useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import Axios from "axios";
// import Footer from "../dashboard/footer.jsx";
import { Link } from "react-router-dom";
import FooterUpdate from "../dashboard/_footer.jsx";
import { connect } from "react-redux";
// import HeaderUpdate from "../dashboard/_header.jsx";
import { getQueryParameters, getQueryString, removeEmpty } from "../modules/helpers.jsx";
import { event } from "@fullstory/browser";
import LocationSearchInput from "../common/locationsAutoComplete.jsx";
import { locationsData } from "../components/constants.jsx";
import HomePageData from "./homepage_data.jsx";
import { useTranslation } from "react-i18next";
import { _canadaPath, _changeCountry } from "../actions/actionsAuth.jsx"
const Search = (props) => {
    const { t } = useTranslation();
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
        // if (location.pathname === "/") {
        //     getLocation();
        // }
    }, []);

    function calcCrow(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = toRad(lat2 - lat1);
        var dLon = toRad(lon2 - lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);

        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) {
        return (Value * Math.PI) / 180;
    }
    // function getLocation() {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(showPosition);
    //     } else {
    //         x.innerHTML = "Geolocation is not supported by this browser.";
    //     }
    // }

    // function showPosition(position) {
    //     Object.values(locationsData).map((x) => {
    //         // console.log(x.lat);
    //         // console.log(calcCrow(position.coords.latitude, position.coords.longitude, x.lat, x.long));
    //         if (x.radius > calcCrow(position.coords.latitude, position.coords.longitude, x.lat, x.long)) {
    //             history.push("/location/" + x.slug);
    //         }
    //     });
    // }

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
        history.push("/ca/search" + updated_url);
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
                    <img src="/uploads/user_v1llv353bppo/homepage.jpg" alt="home cover" width="100%" />
                </div>
                <div>
                    <div className="container">
                        <div className="home_text--content text-white text-center">
                            <div className="mb-0 text-heading-lg-homepage">{t(props.language?.layout?.homepage_heading)}</div>
                            <div className="h2">{t(props.language?.layout?.homepage_subheading)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-black text-white text-center py-md-5 py-4">
                <div class="container p-0">
                    <div class="text-center mb-3">
                        <div class="col-10 mx-auto">
                            <h5 className="mb-4">{t(props.language?.layout?.homepage_description_title)}</h5>
                            <p>
                                {t(props.language?.layout?.homepage_description)}
                            </p>
                            <p>
                                {t(props.language?.layout?.homepage_2description)}
                            </p>
                        </div>
                    </div>
                    <div className="d-md-flex">
                        <div class="col-md-12">
                            <div class="d-md-flex">
                                <div class="col-md-6 col-10 mx-auto">
                                    <form role="form" className="search_form--input">
                                        <div class="form-group">
                                            <div class="input-group mt-0">
                                                <input
                                                    type="search"
                                                    className="form-control search_input form-control-lg rounded-0 shadow-none border"
                                                    placeholder={t(props.language?.layout?.jobs_placeholder1)}
                                                    value={searchQuery.query}
                                                    onKeyPress={onKeyEnterHandler}
                                                    onChange={(e) =>
                                                        handleSearchQuery({
                                                            ...searchQuery,
                                                            query: e.target.value || null,
                                                        })
                                                    }
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
                                                            {t(props.language?.layout?.homepage_search)}
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
                <div className="d-md-flex mt-md-5 mt-4">
                    {/* <div className="col-md-10 col-sm-12 mx-auto text-justify"> */}
                    <HomePageData />
                    {/* </div> */}
                </div>
                {/* Find your path */}

                <div className="d-md-flex mt-md-3">
                    <div className="col-lg-10 mx-auto">
                        <div class="d-lg-flex">
                            <div class="col home my-md-0 mt-3 p-0 border border-primary">
                                {/* border-right  */}
                                <div className="d-flex align-items-center justify-content-center" tabIndex="0">
                                    <iframe
                                        src="https://player.vimeo.com/video/569844507?byline=false&portrait=false&texttrack=en"
                                        width="620"
                                        height="351"
                                        title="About Career Connector"
                                        className=""
                                        frameborder="0"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowfullscreen></iframe>
                                </div>
                            </div>
                            <div class="col text-white bg-primary overflow-auto thin-scrollbar about-career" tabIndex="0">
                                <div className="p-2 mt-4">
                                    <h1>{t(props.language?.layout?.homepage_about)}</h1>
                                    <p className="text-left">
                                        {t(props.language?.layout?.homepage_about_description)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-md-flex">
                    <div className="col-lg-10 mx-auto p-0">
                        <div className="d-md-flex mb-4">
                            <div className="col-md-4">
                                <div class="tab-card">
                                    <div class="tab-card-content">
                                        <Link to="/ca" target="_blank">
                                            <img
                                                onClick={() => { props._canadaPath("ca"); props._changeCountry("ca") }}
                                                className="img-fluid"
                                                src="/uploads/user_v1llv353bppo/canada.jpg"
                                                alt="Australia"
                                                className="img-fluid"
                                                width="100%"
                                            />
                                        </Link>
                                    </div>
                                    {/* <div class="tab-card-footer text-center">
                                        <div className="d-block mt-2">{t(props.language?.layout?.homepage_comingsoon)}</div>
                                    </div> */}
                                </div>
                                <div class="text-center mt-2 h3">{t(props.language?.layout?.homepage_australia)}</div>
                            </div>
                            <div className="col-md-4">
                                <div class="tab-card">
                                    <div class="tab-card-content">
                                        <Link to="/" target="_blank">
                                            <img
                                                onClick={() => { props._canadaPath(null); props._changeCountry("us") }}
                                                className="img-fluid"
                                                src="/uploads/user_v1llv353bppo/usa.jpg"
                                                alt="USA"
                                                className="img-fluid"
                                                width="100%"
                                            />
                                        </Link>

                                    </div>
                                    {/* <div class="tab-card-footer text-center"> */}
                                    {/* <div className="d-block mt-2">Coming Soon</div> */}
                                    {/* <div className="d-block mt-2">Atlanta | Houston</div> */}
                                    {/* </div> */}
                                </div>
                                <div class="text-center mt-2 h3">{t(props.language?.layout?.homepage_usa)}</div>
                            </div>
                            <div className="col-md-4">
                                <div class="tab-card">
                                    <div class="tab-card-content">
                                        <Link to="/ca" >
                                            <img
                                                className="img-fluid"
                                                src="/uploads/user_v1llv353bppo/brazil.jpg"
                                                alt="Brazil"
                                                className="img-fluid"
                                                width="100%"
                                            />
                                        </Link>
                                    </div>
                                    <div class="tab-card-footer text-center">
                                        <div className="d-block mt-2">{t(props.language?.layout?.homepage_comingsoon)}</div>
                                    </div>
                                </div>
                                <div class="text-center mt-2 h3">{t(props.language?.layout?.homepage_brazil)}</div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="d-md-flex my-md-5 my-4">
                    <div className="col-lg-10 mx-auto text-center">
                        <h1>{t(props.language?.layout?.homepage_careerconnectorpartners)}</h1>
                        <div className="d-md-flex mt-4">
                            <div className="col-md-6 col-12">
                                <h2>{t(props.language?.layout?.homepage_employerpartner_1)}</h2>
                                <img
                                    src="/uploads/user_v1llv353bppo/ep-Canada-logos.png"
                                    alt="training"
                                    className="img-fluid"
                                    width="100%"
                                />
                            </div>
                            <div className="col-md-6 col-12">
                                <h2>{t(props.language?.layout?.homepage_skillingpartner_1)}</h2>
                                <img
                                    src="/uploads/user_v1llv353bppo/sp-Canada-logos.png"
                                    alt="training"
                                    className="img-fluid"
                                    width="100%"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterUpdate />
        </div >
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, { _canadaPath, _changeCountry })(Search);
