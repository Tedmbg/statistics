import {  Box,Paper, Typography } from "@mui/material"
import "./Demographics-card.css"
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function DemographicCard({title,data}) {
  const options = {
    responsive: true,
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
        }
      },
      title: {
        display: true,
        text:title,
        align:"start",
        position:"top",
        color:"#000000",
        font:{
          size:23,
          family:"Inter"
        }
    }
    }
  };

  return (
    <Doughnut 
      style={{
        padding:"2em 1em",
        background:"#fff",
        borderRadius:".5rem"
      }} options={options} data={data}/>
  )
}

export default DemographicCard