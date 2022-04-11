import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataRenderer from './modules/paginator/index.jsx';
import qS from 'query-string';
import { withRouter } from 'react-router';


const settings = {
    renderType: 'table',
    tableJSON: [
        { displayValue: "Job Title", key: "full_name" },
        { displayValue: "Company Name", key: "email" },
        { displayValue: "Salary", key: "skilling_partners" },
        { displayValue: "Type", key: "user_type" },
        { displayValue: "Designation", key: "company" },
    ]
}
const AllJobs = ({location}) => {

    const [queryString, setQueryString] = useState({
        page: 1
    })
    const [isQueryStringChange, setIsQueryStringChange] = useState(false)
    const [jobs, setJobs] = useState()


    //calling api only if query strings changes
    useEffect(() => {
        console.log('useEffect called')
       if(isQueryStringChange){
        getJobsData(); 
       }
    }, [queryString])


    //Initial-- 1)checking if URLparams is present--if yes->setQueryStrings accordingly and call api
                                            //    --if No-> call api  
    useEffect(()=> {
        let params = qS.parse(location.search)
        if(Object.keys(params).length !== 0){
            Object.keys(params).map(item=> {
            setQueryString({...queryString, [item]: params[item]})
            setIsQueryStringChange(true)
        })
        } 
        else{
            getJobsData()
        }
    },[])


    const getQueryString = () => {
        let str = '';
        let arr = Object.keys(queryString)
        arr.map((item, index) => {
            str = str + item + '=' + queryString[item]
            if (index !== arr.length - 1) {
                console.log(index, arr.length)
                str = str + '&'
            }
        })
        return str;
    }
    const getJobsData = () => {
        console.log('getjobsdatacalled')
        console.log(getQueryString())
        axios.get("/api/v1/jobs?" + getQueryString())
            .then(res => {
                setJobs(res.data.data)
            })
    }

    const item = (data) => {
        return (
            <td>{data}</td>
        )
    }

    const rowData = (job) => {
        return (
            <tr>
                {item(job.title)}
                {item(job.company_name)}
                {item(`${job.salary_min}-${job.salary_max}`)}
                {item(job.job_type)}
                {item(job.designation)}
            </tr>
        )
    }

    return (
        <>
            {jobs && <DataRenderer
                settings={settings}
                jobs={jobs}
                rowData={rowData}
                queryString={queryString}
                setQueryString={setQueryString}
            />}
        </>
    )
}

export default withRouter(AllJobs)