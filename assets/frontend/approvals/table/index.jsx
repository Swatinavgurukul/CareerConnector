// Protected File. SPoC - Santosh Medarametla

import React, { Component } from "react";
import EmptyState from "../../modules/empty_states.jsx";
import { parse, format, formatDistanceStrict } from "date-fns";
import ReactPaginate from "react-paginate";
import RowData from "./rowData.jsx";
import { connect } from "react-redux";
import { Fragment } from "react";
import { withTranslation } from 'react-i18next';

// import Fuse from "fuse.js";

class ListPagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtered_data: [],
            render_data: [],
            isLoading: true,
            activeIndex: 0,
            itemsPerPage: 10,
            query: "",
            sortBy: "updated_at",
            ascending: false,
            pageCount: 0,
            firstIndex: 0,
            lastIndex: 0,
            results: [],
            searchResults: [],
            selectAll: false,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    componentDidMount() {
        this.getData();
    }
    componentDidUpdate(prevProps) {
        if (
            this.props.data &&
            this.props.data.length !== 0 &&
            (this.props.data.length !== prevProps.data.length ||
                JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data))
        ) {
            this.setState({ activeIndex: 0, pageCount: 0, firstIndex: 0, lastIndex: 0, itemsPerPage: 10 }, () =>
                this.getData()
            );
        }
    }
    handlePageChange = (datapage) => {
        this.setState({ activeIndex: datapage.selected }, () => {
            this.getData();
        });
    };
    handleStateChange = (event) => {
        let { name, value } = event.target;
        this.setState({ [name]: parseInt(value), activeIndex: 0 }, () => {
            this.getData(true);
        });
    };
    getData() {
        let sortBy = this.state.sortBy;
        let order = this.state.ascending ? 1 : -1;
        let render_data = [];
        let sorted_data = this.props.data.sort(function (a, b) {
            return a[sortBy] > b[sortBy] ? order : -order;
        });

        let pageCount = Math.ceil(sorted_data.length / this.state.itemsPerPage);
        let offset = this.state.activeIndex * this.state.itemsPerPage;
        for (var i = 0; i < sorted_data.length; i++) {
            if (i >= offset && i < offset + this.state.itemsPerPage) {
                render_data.push(sorted_data[i]);
            }
        }
        let firstIndexNumber = this.state.itemsPerPage * this.state.activeIndex + 1;
        let secondIndexNumber = this.state.itemsPerPage * (this.state.activeIndex + 1);
        if (secondIndexNumber > sorted_data.length && pageCount === this.state.activeIndex + 1) {
            secondIndexNumber = sorted_data.length;
        }
        this.setState({
            render_data,
            pageCount,
            filtered_data: sorted_data,
            isLoading: false,
            firstIndex: firstIndexNumber,
            lastIndex: secondIndexNumber,
        });
        // console.log("renderdata", render_data);
    }
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
    // Render Elements
    renderSortArrow = (key) => {
        return this.state.sortBy == key ? (
            this.state.ascending ? (
                <span className="btn-svg-sm">
                    <img src="/svgs/icons_new/chevron-up.svg" className="svg-xs invert-color" />
                </span>
            ) : (
                <span className="btn-svg-sm icon-invert">
                    <img src="/svgs/icons_new/chevron-down.svg" className="svg-xs invert-color" />
                </span>
            )
        ) : (
            ""
        );
    };
    // for search results
    onSearch = ({ currentTarget }) => {
        this.props.onSearch(currentTarget.value);
    };

    performAction = (action, key) => {
        switch (action) {
            case "sort":
                return this.sortBy(key);
        }
    };
    renderCheckbox() {
        return (
            <input
                onChange={(e) => this.setState({ selectAll: e.target.checked })}
                className=""
                type="checkbox"></input>
        );
    }
    titleHandler = (item) => {
        return <div title="date of registration" >
            {item}
        </div>
    }
    render() {
        const { t } = this.props;
        let active_state = this.state.isLoading
            ? "loading"
            : this.state.data && this.state.data.length == 0
            ? "no_data"
            : null;
        if (active_state != null) {
            return (
                <div className="jumbotron elevation-1 my-3">
                    <EmptyState active_state={active_state} no_data={this.props.no_data} />
                </div>
            );
        }

        return (
            <div className="">
                <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted d-flex align-items-end">
                    {t(this.props.language?.layout?.js_showing)} {this.state.firstIndex}-{this.state.lastIndex} {t(this.props.language?.layout?.js_of)} {this.state.filtered_data.length}{" "}
                        {t(this.props.language?.layout?.js_records)}
                    </small>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive table-min-height">
                        <table className="table border-bottom candidateTable mb-0">
                            <thead className="text-white" style={this.props.theme.tableHeader_background}>
                                <tr>
                                    {this.props.tableJSON.map((item) => {
                                        return (
                                            <th
                                                scope="col"
                                                className={`pl-3 align-middle font-weight-normal ${
                                                    item.displayValue === "Actions" ? "text-center" : ""
                                                }`}
                                                style={
                                                    item.displayValue === "Name"
                                                        ? { width: "28%" }
                                                        : item.displayValue === "Email"
                                                        ? { width: "19%" }
                                                        : item.type === "checkbox"
                                                        ? { width: "1%" }
                                                        : { width: "12%" }
                                                }
                                                onClick={
                                                    item.type === "checkbox"
                                                        ? ""
                                                        : item.displayValue === "Actions"
                                                        ? ""
                                                        : () => this.performAction("sort", item.key)
                                                }>
                                                {item.type === "checkbox" ? this.renderCheckbox() : ""}
                                                {item.title ? this.titleHandler(item.displayValue) : item.displayValue}
                                                {/* {item.displayValue} */}
                                                {item.displayValue === "Actions" ? " " : this.renderSortArrow(item.key)}
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {this.isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">
                                            <em className="text-muted">Loading...</em>
                                        </td>
                                    </tr>
                                ) : (
                                    this.state.render_data.map((user, index) => (
                                        <RowData
                                            key={index}
                                            user={user}
                                            selectAll={this.state.selectAll}
                                            actionsToPerform={this.props.actionsToPerform}
                                            onChangeStatus={this.props.onChangeStatus}
                                            onerdStatus={this.props.onerdStatus}
                                            // assignJobHandler={this.props.assignJobHandler}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-4 col-12 d-flex">
                        <div className="form-group">
                            <select
                                aria-label="itemsPerPage"
                                name="itemsPerPage"
                                value={this.state.itemsPerPage}
                                onChange={(e) => this.handleStateChange(e)}
                                className="form-control custom-select text-muted">
                                <option value={10}>10 / {t(this.props.language?.layout?.all_page)}</option>
                                <option value={20}>20 / {t(this.props.language?.layout?.all_page)}</option>
                                <option value={50}>50 / {t(this.props.language?.layout?.all_page)}</option>
                            </select>
                        </div>
                        <p className="my-2 px-2 text-muted"> {t(this.props.language?.layout?.js_of)} {this.state.filtered_data.length} {t(this.props.language?.layout?.all_items_nt)}</p>
                    </div>
                    <div className="col-md-8 col-12 d-flex justify-content-end">
                        <ReactPaginate
                            previousLabel={t(this.props.language?.layout?.jobs_previous)}
                            nextLabel={t(this.props.language?.layout?.jobs_next)}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            forcePage={this.state.activeIndex}
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
        );
    }
}
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(withTranslation()(ListPagination));
