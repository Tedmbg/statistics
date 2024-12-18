// LineChart.jsx
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function LineChart({ data, title, yearSelector }) {
  const lineChartOptions = {
    responsive: true, // Enable resizing
    maintainAspectRatio: false, // Prevent locking aspect ratio
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      title: {
        display: true,
        text: title,
        align: "start",
        position: "top",
        color: "#000000",
        padding: 20,
        font: {
          size: 23,
          family: "Inter",
        },
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Number of Members",
        },
      },
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Year Selector positioned at the top-right */}
      {yearSelector && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
          }}
        >
          {yearSelector}
        </div>
      )}
      {/* Chart */}
      <Line
        style={{
          padding: "2em 1em",
          background: "#fff",
          width: "100%",
          borderRadius: ".5rem",
        }}
        data={data}
        options={lineChartOptions}
      />
    </div>
  );
}

export default LineChart;
