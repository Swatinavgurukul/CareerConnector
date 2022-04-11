import React, { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { useHistory, withRouter } from 'react-router';
import { useParams } from 'react-router-dom'
import qS from 'query-string';

const DataRenderer = ({ settings, jobs, rowData, queryString, setQueryString, location }) => {

    const [filters, setFilters] = useState({})
    const history = useHistory()
    const { params } = useParams()


      useEffect(() => {

        if(filters !== undefined)
          createURLParams()
      }, [filters, history])


      //initializing filters with queryString so that if the user loads the URL with query strings, filter state is loaded
      useEffect(()=> {
       Object.keys(queryString).map((item)=> {
           setFilters({...filters, [item]:
                                   [item] === 'page'? parseInt(queryString[item]): queryString[item]})
       })
      }, [])



    const createURLParams = ()=> {
        const params = new URLSearchParams()
        Object.keys(filters).map(item=> {
           params.append(item, filters[item])
        })
        history.push({search: params.toString()})
    }

    const handleFilterChange = (name, value)=> {
        setFilters({...filters,[name]: value})
        setQueryString({...queryString, [name]: value})
    }


    return (
        <div className="">
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                        {settings.tableJSON.map(item => (
                            <th scope="col">{item.displayValue}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
            {jobs.data.map(job => {
                return (
                    rowData(job)
                )
            }
            )}

        </tbody>
            </table>
            <div className="row mt-3">
                <div className="col-md-4 col-12 d-flex">
                    <div className="form-group">
                        <select
                            aria-label="itemsPerPage"
                            name="itemsPerPage"
                            // value={this.state.itemsPerPage}
                            // onChange={(e) => this.handleStateChange(e)}
                            className="form-control custom-select text-muted">
                            <option value={10}>10 / Page</option>
                            <option value={20}>20 / Page</option>
                            <option value={50}>50 / Page</option>
                        </select>
                    </div>
                    <p className="my-2 px-2 text-muted">of
                    {/* {this.state.filtered_data.length}  */}
                    Items</p>
                </div>
                {jobs && <div className="col-md-8 col-12 d-flex justify-content-end">
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={jobs.total_pages}
                        marginPagesDisplayed={2}
                        forcePage={filters.page-1}
                        pageRangeDisplayed={4}
                        onPageChange={(dataPage)=> handleFilterChange('page', dataPage.selected+1)}
                        subContainerClassName={"pages pagination"}
                        activePage={filters.page-1}
                        // initialPage={filters.page-1}
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
                </div>}

            </div>
        </div>
    );
}

export default withRouter(DataRenderer)