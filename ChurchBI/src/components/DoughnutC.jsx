import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS } from "chart.js/auto";

function DoughnutC(props) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
        }
      }
    }
  };

  return (
    <div
      style={{
        width: "20.25rem",
        height: "20.25rem",
        // width:"100%",
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
