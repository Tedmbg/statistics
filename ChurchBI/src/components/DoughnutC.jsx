import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

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
    <div>
      <Doughnut data={props.data} options={options}/>
    </div>
  );
}

export default DoughnutC;
