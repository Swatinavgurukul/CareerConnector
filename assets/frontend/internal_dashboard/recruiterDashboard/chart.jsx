import React, { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import { renderToLocaleDate } from '../../modules/helpers.jsx'
import Axios from "axios";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";


const LineChart = (props) => {
    const { t } = useTranslation();
    // Date.prototype.addDays = (currentDate, delta) => {
    //     const date = new Date(currentDate);
    //     date.setDate(date.getDate() + delta);
    //     return date;
    // }

    // const getDates = (startDate, stopDate, delta) => {
    //     const dateArray = new Array();
    //     let currentDate = startDate;
    //     while (currentDate <= stopDate) {
    //         dateArray.push(renderToLocaleDate(new Date(currentDate)));
    //         currentDate = currentDate.addDays(currentDate, delta);
    //     }
    //     return dateArray
    // }01/04/2021

    const [data, setData] = useState([]);
    useEffect(() => {
        Axios.get(`/api/v1/recruiter/dashboard/tracker`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
            .then((response) => {
                const res = response.data.data;
                let trackerData = [];
                for (let i = 0; i < 7; i++) {
                    trackerData.push({
                        day: renderToLocaleDate((new Date(new Date().setDate((new Date()).getDate() - i)))),
                        candidates: 0
                    })
                }
                const daysList = trackerData.map(m => m.day)
                for (let i = 0; i < res.length; i++) {
                    const index = daysList.indexOf(renderToLocaleDate(res[i].day))
                    if (index > -1) {
                        trackerData[index].candidates = res[i].no_of_candidate
                    }
                }
                trackerData.reverse()
                setData(trackerData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const LineOption = {
        responsive: true,
        aspectRatio: 1,
        title: {
            display: false,
            // text: 'Applications Submitted',
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: t(props.language?.layout?.sp_dashboard_days)
                },
                offset: true,
                gridLines: {
                    color: 'black',
                    drawOnChartArea: false,
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: t(props.language?.layout?.sp_dashboard_totalcandidate)
                },
                ticks: {
                    min: 0,
                    max: data.map(m => m.candidates).sort().reverse()[0],
                    stepSize: 1
                },
                gridLines: {
                    color: 'black',
                    drawOnChartArea: false,
                }
            }]
        },
        legend: {
            display: false,
            position: 'bottom',
            labels: {
                boxWidth: 10
            },
        }
    }
    const LineData = {
        labels: data.map(m => m.day),
        datasets: [
            // {
            //     borderColor: 'rgb(225, 168, 36)',
            //     backgroundColor: 'rgb(225, 168, 36)',
            //     data: [270, 170, 170, 50, 200, 250, 350],
            //     fill: false,
            //     lineTension: 0,
            //     label: 'No. of candidate'
            // },
            {
                data: data.map(m => m.candidates),
                type: 'bar',
                backgroundColor: 'rgb(143, 227, 157)',
                label: t(props.language?.layout?.dashboard_caandidate_nt),
                barPercentage: 1,
                categoryPercentage: 1,
                barThickness: 'flex',
                maxBarThickness: 30,
            }
        ],
    };

    return <Bar data={LineData} options={LineOption} />
}
function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps)(LineChart);