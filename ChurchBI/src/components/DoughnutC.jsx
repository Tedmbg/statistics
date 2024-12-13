import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required Chart.js components and plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

function DoughnutC(props) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
        },
      },
      datalabels: {
        display: true, // Enable labels
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (sum, data) => sum + data,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1); // Calculate percentage
          return `${percentage}%`; // Display percentage
        },
        color: "#000", // Label color
        font: {
          size: 14,
          weight: "bold",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "32.25rem",
        height: "22.25rem",
        backgroundColor: "#FFFFFF",
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <Doughnut data={props.data} options={options} />
    </div>
  );
}

export default DoughnutC;
