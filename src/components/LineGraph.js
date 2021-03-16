import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from 'numeral';
import './LineGraph.css'

function LineGraph({casesType}) {
  let color;
  let bc;
  if (casesType === "cases"){
    color="#fe073a"
    bc = "rgb(255, 197, 208)"
  }else if(casesType === "recovered"){
    color="#28a645"
    bc = "rgb(228, 244, 232"
  }else if (casesType ==="deaths"){
    color="#6c757d"
    bc="rgb(246, 246, 247)"
  }

  const [data, setData] = useState([]);
  const createData = (data, casesType='cases')=>{
    const chartData = [];
    let lastDataPoint;
    for( let key in data[casesType]){
      
      if(lastDataPoint){
        const newDataPoint = {
          x: key,
          y: data[casesType][key] - lastDataPoint
        }
        chartData.push(newDataPoint)
      }
      lastDataPoint = data[casesType][key]
    }      
    return chartData
    }

  useEffect(() => {
    const fetchData = async () => {
    await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
        .then((Response) => Response.json())
        .then((data) => {
          const graphData = createData(data,casesType);
          setData(graphData);
        }).catch((err) => alert(err.message));
    }

    fetchData()
    }, [casesType]);

      return (
    <div className="linegraph">
      {
      data?.length>0 && (
      <Line data={{
        datasets: [
          {
          lineTension:0.1,
          borderJoinStyle: "miter",
          pointHoverRadius: 7,
          backgroundColor: bc,
          borderColor: color,
          data: data
        }]}} 
      options={{
        legend: {
          display: false,
        },
        elements: {
          points: {
            radius: 0
          },
        },
        maintainAspectRatio: false,
        scales:{
          xAxes: [{
            type: 'time',
            time: {
              format: 'MM/DD/YY',
              tooltipFormat: "ll"
            },
            gridLines:{
              display: false
            }
          }],
          yAxes: [{
            gridLines:{
              display: false
            },
            ticks: {
              callback: function(value, index, values) {
                return numeral(value).format('0a')
              }
              }
          }]
        },
        tooltips: {
          enabled: true
        } }}
      />
    )}
    </div>
)}

export default LineGraph;
