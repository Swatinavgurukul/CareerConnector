import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import Axios from "axios";

const Header = (props) => {
    return (
        <div class="row pt-4 pb-2 px-3 gray-100">
            <div class="col-md-6 px-md-0">
                <h4 class="mb-3">All Jobs</h4>
                <div class="icon-invert d-flex align-items-center">
                    <img class="svg-lg-x2 mr-3 mb-2" src="svgs/rich_icons/jobs.svg" alt="Jobs Icon" title="Jobs Icon" />
                    <div>
                        <div class="d-flex">
                            <p class=" d-flex text-capitalize mb-1">
                                {props.stats.active_count}
                                &nbsp;Active jobs |
                            </p>
                            <p class="d-flex text-capitalize mb-1">
                                <span>
                                    <span>&nbsp;| 3</span>
                                </span>
                                <span>&nbsp;Paused jobs</span>
                            </p>
                            <p class="d-flex text-capitalize mb-1">
                                <span>
                                    <span>&nbsp;| 1</span>
                                </span>
                                &nbsp;Closed job
                            </p>
                            <p class="d-flex text-capitalize mb-1">
                                <span>
                                    <span>&nbsp;| 6</span>
                                </span>
                                <span>&nbsp;Draft jobs</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 d-md-flex d-lg-flex justify-content-end px-md-0">
                <div>
                    <div class="d-md-flex align-items-end">
                        <div class="form-group-md animated mr-3">
                            <input
                                type="text"
                                class="form-control border-right-0 border-left-0 border-top-0 bg-light rounded-0 border-dark pl-4 pb-1"
                                id="Search"
                                name="Search"
                                placeholder="Search"
                                value=""
                            />
                            <div class="icon-invert d-flex justify-content-start">
                                <img src="/svgs/icons_new/search.svg" alt="search" class="svg-xs mt-n4 mr-3" />
                            </div>
                        </div>
                        <a type="button" class="btn btn-primary border-0" href="/jobs/create">
                            + Add Job
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        // theme: state.themeInfo.them,
        // userToken: state.authInfo.userToken,
        // user: state.authInfo.user,
        // enrollmentCode: state.authInfo.enrollmentCode,
    };
}

export default connect(mapStateToProps, {})(Header);
