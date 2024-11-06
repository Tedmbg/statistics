// components/DoughnutC.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function DoughnutC(props) {
  const options = {
    responsive: true,
    cutout: "70%", // Setting the cutout here to make it a donut
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: "#333", // Adjust legend label color if needed
        },
      },
    },
    layout: {
      padding: 20, // Add padding to give some space around the chart
    },
  };

  return (
    <div
      style={{
        width: "31.25rem",
        height: "31.25rem",
        backgroundColor: "#FFFFFF", // White background for the container
        padding: "1rem",
        borderRadius: "8px", // Optional: rounded corners
      }}
    >
      <Doughnut data={props.data} options={options} />
    </div>
  );
}

export default DoughnutC;
