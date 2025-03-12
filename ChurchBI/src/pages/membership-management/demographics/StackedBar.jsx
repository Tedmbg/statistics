import { Bar } from "react-chartjs-2";

function StackedBar({ data, title, axis, stacked = false }) {
  const options = {
    indexAxis: axis === "y" ? "y" : "x",
    responsive: true,
    maintainAspectRatio: false, // Ensures the chart adjusts to container size
    plugins: {
      legend: {
        display: false,
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
      x: {
        stacked: stacked,
        beginAtZero: true,
      },
      y: {
        stacked: stacked,
        beginAtZero: true,
      },
    },
    barPercentage: stacked ? 1.0 : 0.9,
    categoryPercentage: stacked ? 1.0 : 0.8,
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default StackedBar;
