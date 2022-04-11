import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import { createFilter } from "react-search-input";
import EmptyState from "./empty_states.jsx";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Link, useHistory } from "react-router-dom";
// import { formatDistanceStrict, format } from "date-fns";
// import { truncate } from "../helpers";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";

class CardPagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtered_data: [],
            render_data: [],
            isLoading: true,
            activeIndex: 0,
            itemsPerPage: 9,
            query: "",
            sortBy: "updated_at",
            ascending: false,
            pageCount: 0,
            alertShowCard: false,
            bookmarkStatus: false,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    // truncate = (str) => {
    //     return str.length > 18 ? str.substring(0, 15) + "..." : str;
    // };

    componentDidUpdate(prevProps) {
        if (this.props.data.length !== 0 && this.props.data.length !== prevProps.data.length) {
            this.getData();
        }
    }

    handlePageChange = (data) => {
        this.setState({ activeIndex: data.selected }, () => {
            this.getData();
        });
    };

    handleSearch(e) {
        this.setState({ activeIndex: 0, query: e.target.value });
    }

    handleStateChange = (event) => {
        let { name, value } = event.target;
        this.setState({ [name]: value, activeIndex: 0 }, () => {
            this.getData();
        });
    };
    // Pagination Helpers
    sortBy = (key) => {
        key === this.state.sortBy
            ? this.setState({ ascending: !this.state.ascending, activeIndex: 0 }, () => {
                  this.getData();
              })
            : this.setState({ sortBy: key, activeIndex: 0 }, () => {
                  this.getData();
              });
    };

    getData() {
        let sortBy = this.state.sortBy;
        let order = this.state.ascending ? 1 : -1;
        let render_data = [];
        let search_filtered_data =
            this.state.query != ""
                ? this.props.data.filter(
                      createFilter(
                          this.state.query,
                          this.props.columns.map((item) => item.key)
                      )
                  )
                : this.props.data;

        let sorted_data = search_filtered_data.sort(function (a, b) {
            return a[sortBy] > b[sortBy] ? order : -order;
        });

        let pageCount = Math.ceil(sorted_data.length / this.state.itemsPerPage);
        let offset = this.state.activeIndex * this.state.itemsPerPage;
        for (var i = 0; i < sorted_data.length; i++) {
            if (i >= offset && i < offset + this.state.itemsPerPage) {
                render_data.push(sorted_data[i]);
            }
        }

        this.setState({ render_data, pageCount, filtered_data: sorted_data, isLoading: false });
        console.log(render_data);
    }

    // Render Elements
    renderSortArrow = (key) => {
        return this.state.sortBy == key ? (
            this.state.ascending ? (
                <span className="btn-svg-sm">
                    <img src="/svgs/new-icons/chevron-up.svg" className="svg" />
                </span>
            ) : (
                <span className="btn-svg-sm">
                    <img src="/svgs/new-icons/chevron-down.svg" className="svg" />
                </span>
            )
        ) : null;
    };

    render() {
        const { t } = this.props;
        let active_state = this.props.isLoading ? "loading" : this.props.data.length == 0 ? "no_data" : null;
        if (active_state != null) {
            return (
                <div className="jumbotron elevation-1 my-3">
                    <EmptyState active_state={active_state} no_data={this.props.no_data} />
                </div>
            );
        }
        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="offset-md-1 col-md-10 offset-0 p-0">
                            <div className="col-md-11 p-0">
                                <form method="GET" action="/search">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control text-muted w-25"
                                            id="job_title"
                                            placeholder="Job title"
                                            // name="q"
                                            aria-label=""
                                            aria-describedby="basic-addon1"
                                        />
                                        <input
                                            type="text"
                                            className="form-control text-muted"
                                            placeholder="Location"
                                            // name="loc"
                                            aria-label=""
                                            aria-describedby="basic-addon1"
                                        />
                                        <div className="input-group-append">
                                            <button class="btn btn-primary pl-3 rounded-0" type="submit">
                                                Search
                                            </button>
                                        </div>
                                        <span className="text_search ml-3 pt-3 mt-1">
                                            <a className="text-primary pointer" data-toggle="collapse">
                                                <u
                                                    className="mt-3"
                                                    onClick={() => {
                                                        this.setState({
                                                            alertShowCard: true,
                                                        });
                                                    }}>
                                                    Advanced Search
                                                </u>
                                            </a>
                                        </span>
                                    </div>
                                    <div className="form-group mt-3 ml-4 mb-0 d-md-flex d-xs-flex">
                                        <div className="form-control-md custom-checkbox pt-2">
                                            <input
                                                className="custom-control-input"
                                                id="easyapply"
                                                // name="easy_apply"
                                                // value="True"
                                                type="checkbox"
                                            />
                                            <label className="custom-control-label pl-2 text-muted" for="easyapply">
                                                Easy Apply only{" "}
                                            </label>
                                        </div>
                                        <div className="form-control-md custom-checkbox ml-4 pt-2 pl-5">
                                            <input
                                                className="custom-control-input"
                                                id="remotelocation"
                                                // name="remotely"
                                                // value="True"
                                                type="checkbox"
                                            />
                                            <label
                                                className="custom-control-label pl-2 text-muted"
                                                for="remotelocation">
                                                Remote Location
                                            </label>
                                        </div>

                                        <div className="form-group ml-4">
                                            <select
                                                className="form-control border-white text-muted"
                                                // name="freshness"
                                            >
                                                <option disabled="" selected="">
                                                    Jobs Posted
                                                </option>
                                                <option value="1">Last Day</option>
                                                <option value="7">Last Week</option>
                                                <option value="30">Last Month</option>
                                            </select>
                                        </div>

                                        <div className="form-group mx-4">
                                            <select
                                                className="form-control border-white text-muted"
                                                //  name="job_type"
                                            >
                                                <option disabled="" selected="">
                                                    Jobs Type
                                                </option>
                                                <option value="Full-time">Full Time</option>
                                                <option value="Part-time">Part Time</option>
                                                <option value="Freelance">Freelancer</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <select
                                                className="form-control border-white text-muted"
                                                //  name="salary_range"
                                            >
                                                <option disabled="" selected="">
                                                    Salary range
                                                </option>
                                                <option value="10000-20000">$10,000 - 20,000</option>
                                                <option value="20000-25000">$20,000 - 25,000</option>
                                                <option value="30000-35000">$30,000 - 35,000</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <hr className="mb-0 mr-4" />
                        </div>
                    </div>
                </div>

                {this.state.alertShowCard ? (
                    <div>
                        <div className="container-fluid">
                            <div className="row">
                                <div
                                    className="offset-md-1 col-md-10 offset-0  alert alert-dismissible fade-show mt-0 pt-0 p-0 pb-0 mb-0 pr-1"
                                    role="alert">
                                    <p className="instruction mb-0 d-flex font-weight-bold justify-content-start mt-3">
                                        Refine your search
                                    </p>

                                    <div className="form-inline">
                                        <select className="form-control-lg advanced-search-input mr-3 mt-1 mb-3 w-25 rounded-0 text-muted">
                                            <option>Experience</option>
                                        </select>
                                        <select className="form-control-lg advanced-search-input mr-3 mt-1 mb-3 w-25 rounded-0 text-muted">
                                            <option>Qualification</option>
                                        </select>
                                        <select className="form-control-lg advanced-search-input mr-3 mt-1 mb-3 w-25 rounded-0 text-muted">
                                            <option>Skills</option>
                                        </select>
                                        <select className="form-control-lg advanced-search-input mr-3 mt-1 mb-3 w-25 rounded-0 text-muted">
                                            <option>Location</option>
                                        </select>

                                        <select className="form-control-lg advanced-search-input mr-3 mt-1 mb-3 w-25 rounded-0 text-muted">
                                            <option>Job category</option>
                                        </select>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                this.setState({
                                                    alertShowCard: false,
                                                });
                                            }}
                                            className="close"
                                            data-dismiss="alert"
                                            aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>

                                    <div className="d-flex">
                                        <div className="mt-4 mr-auto">
                                            <u className="text-primary pointer">Reset</u>
                                        </div>

                                        <button
                                            className="btn btn-light btn-primary py-2 rounded-0 btn-outline-primary mb-5 d-flex justify-content-end rounded-0"
                                            type="button">
                                            Cancel
                                        </button>

                                        <button
                                            className="btn btn-primary py-2 mb-5 rounded-0 mb-4 ml-3 mr-5 d-flex justify-content-end"
                                            type="button">
                                            {" "}
                                            Search
                                        </button>
                                    </div>
                                    <hr className="mb-0 mr-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )}

                <div className="container-fluid">
                    <div className="row">
                        <div className="offset-md-1 col-md-10 offset-0 col-md-10 p-0">
                            <p className="small font-weight-bolder mt-3 mb-0 p-0">Jobs for you</p>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className=" offset-md-1 col-md-10 offset-0 d-flex flex-wrap align-content-start p-0">
                            {this.state.render_data.map((item, index) => (
                                <div className="col-xs-12 col-sm-6 col-md-4 col-xxl-3 mr-3 p-0 card-deck">
                                    <div className="card elevation-1 hover-elevation-2 mb-2 mt-3 bg-white rounded">
                                        <div className="d-flex card-left-border bg-light border-right-0 border-bottom-0 border-top-0">
                                            <div className="ml-auto pr-2 pt-1">
                                                <button
                                                    type="button"
                                                    className="close hide-close-button"
                                                    data-dismiss="alert"
                                                    aria-label="Close overlay"
                                                    data-toggle="tooltip"
                                                    data-placement="bottom"
                                                    title="Dismiss job">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-header bg-light d-inline-block card-left-border pb-0 pt-0 border-right-0 border-bottom-0 border-top-0">
                                            <h5
                                                className="card-title font-weight-bold"
                                                data-toggle="tooltip"
                                                title=""
                                                data-placement="right">
                                                {item.title}
                                            </h5>
                                            <div class="d-flex mt-3">
                                                <div>
                                                    <h5
                                                        className="card-subtitle text-truncate text-muted"
                                                        data-toggle="tooltip"
                                                        title=""
                                                        data-placement="right">
                                                        {/*     {this.truncate(item.company)}  */}
                                                        company name
                                                    </h5>
                                                </div>
                                                <div className="card-subtitle text-muted ml-auto">
                                                    {/*  <p>{moment(item.created_at).startOf("hour").fromNow()}</p> */}

                                                    <p>
                                                        {formatDistance(
                                                            subDays(new Date(item.created_at), 0),
                                                            new Date()
                                                        )}{" "}
                                                        {t(this.props.language?.layout?.all_ago_nt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body pb-0 pt-0">
                                            <div className="mt-2 text-muted">
                                                <img className="mr-2 svg-sm" src="/svgs/icons_new/location_dark.svg" />
                                                <span>{item.location}</span>
                                            </div>
                                            <div className="mt-1 text-muted">
                                                <img className="mr-2 svg-sm" src="/svgs/icons_new/clock.svg" />
                                                <span>
                                                    {item.experience} years, {item.job_type}
                                                </span>
                                            </div>
                                            <div className="mt-1 text-muted">
                                                <img
                                                    className="mr-2 svg-sm"
                                                    src="/svgs/icons_new/briefcase.svg"
                                                    alt="work"
                                                />
                                                <span>
                                                    ${item.salary_from}-${item.salary_to} annually
                                                </span>
                                            </div>
                                            <p className="small text-muted mb-0 mt-3">{item.description}</p>
                                        </div>
                                        <div className="card-footer bg-white text-dark mb-3 px-3 m-0 p-0 border-top-0">
                                            <div className="d-flex mb-0 mt-3">
                                                <div>
                                                    <img
                                                        className="svg-sm mt-1"
                                                        src="/svgs/icons_new/fire.svg"
                                                        alt="fire"
                                                    />
                                                </div>
                                                <div className="pt-1">
                                                    <h6
                                                        className="text-muted mt-1 m-0"
                                                        data-toggle="tooltip"
                                                        title=""
                                                        data-placement="right">
                                                        {t(this.props.language?.layout?.activehiring_nt)}
                                                    </h6>
                                                </div>

                                                <div className="ml-auto pt-1 mr-3">
                                                    {/*   { item.is_bookmarked  ?
                             <div >save</div>  :
                             <div>unsave</div>

                            }
                             */}
                                                    <div>
                                                        {item.is_bookmarked ? (
                                                            <img
                                                                className="ml-auto svg-sm"
                                                                src="/svgs/icons_new/bookmark.svg"
                                                                // onClick={()=>{this.setState({bookmarkStatus:true})}}
                                                                alt="bookmark icon"
                                                                data-toggle="tooltip"
                                                                data-placement="bottom"
                                                                title="Save the job"
                                                            />
                                                        ) : (
                                                            <img
                                                                className="ml-auto svg-sm"
                                                                src="/svgs/icons_new/bookmark.svg"
                                                                // onClick={()=>{this.setState({bookmarkStatus:true})}}
                                                                alt="bookmark icon"
                                                                data-toggle="tooltip"
                                                                data-placement="bottom"
                                                                title="Save the job"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    {item.easy_apply ? (
                                                        <Link
                                                            //  to={`/job/${item.slug}`}
                                                            to={{ pathname: `/jobs/${item.slug}`, data: item.slug }}>
                                                            <button className="btn btn-outline-dark rounded">
                                                                Easy Apply
                                                            </button>
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            //  to={`/job/${item.slug}`}
                                                            to={{ pathname: `/jobs/${item.slug}`, data: item.slug }}>
                                                            <button className="btn btn-outline-dark rounded">
                                                                Apply
                                                            </button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row mt-3">
                        <div className="col-md-4 col-12 d-flex">
                            <div className="form-group">
                                <select
                                    name="itemsPerPage"
                                    value={this.state.itemsPerPage}
                                    onChange={(e) => this.handleStateChange(e)}
                                    className="form-control custom-select text-muted">
                                    <option value={10}>10 / Page</option>
                                    <option value={20}>20 / Page</option>
                                    <option value={50}>50 / Page</option>
                                </select>
                            </div>
                            <p className="my-2 px-2">of {this.state.filtered_data.length} Items</p>
                        </div>
                        <div className="col-md-8 col-12 d-flex justify-content-end">
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                breakClassName={"break-me"}
                                pageCount={this.state.pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={4}
                                onPageChange={this.handlePageChange}
                                subContainerClassName={"pages pagination"}
                                activePage={this.state.activeIndex}
                                initialPage={this.state.activeIndex}
                                containerClassName={"pagination"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                activeClassName={"active"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(withTranslation()(CardPagination));