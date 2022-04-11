import React from 'react';
import { Line } from "react-chartjs-2";
import { renderToLocaleDate } from '../../modules/helpers.jsx'
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const LineChart = (props) => {
    const { t } = useTranslation();
    Date.prototype.addDays = (currentDate, delta) => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + delta);
        return date;
    }

    const getDates = (startDate, stopDate, delta) => {
        const dateArray = new Array();
        let currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push(renderToLocaleDate(new Date(currentDate)));
            currentDate = currentDate.addDays(currentDate, delta);
        }
        return dateArray
    }

    const options = {
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
                    labelString: 'Days'
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
                    labelString:  t(props.language?.layout?.dashboard_application_nt)
                },
                ticks: {
                    min: 0,
                    max: 500,
                    stepSize: 50
                },
                gridLines: {
                    color: 'black',
                    drawOnChartArea: false,
                }
            }]
        },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                boxWidth: 10
            },
        }
    }
    const data = {
        labels: ['Mar 2', 'Mar 3', 'Mar 4', 'Mar 5', 'Mar 6', 'Mar 7', 'Mar 8'],
        datasets: [{
            borderColor: 'rgb(225, 168, 36)',
            backgroundColor: 'rgb(225, 168, 36)',
            data: [270, 170, 170, 50, 200, 250, 350],
            fill: false,
            lineTension: 0,
            label: 'Application processed'
        }, {
            data: [450, 300, 200, 400, 300, 350, 450],
            type: 'bar',
            backgroundColor: 'rgb(143, 227, 157)',
            label: 'Application received',
            barPercentage: 1,
            categoryPercentage: 1,
            barThickness: 'flex',
            maxBarThickness: 30,
        }
        ],
    };

    return <Line data={data} options={options} />
}
function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(LineChart);