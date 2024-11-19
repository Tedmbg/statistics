import { Bar } from "react-chartjs-2";
function StackedBar({data,title,axis,stacked=false}) {
    const options = {
        indexAxis: axis === "y" ? "y" : "x",
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text:title,
            align:"start",
            position:"top",
            color:"#000000",
            padding:20,
            font:{
              size:23,
              family:"Inter"
            }
        }
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
        barPercentage: stacked ? 1.0 : 0.9,
        categoryPercentage: stacked ? 1.0 : 0.8,
        // barThickness: 20,
      };
  return (
    <Bar style={{
        padding:"2em 1em",
        background:"#fff",
        borderRadius:".5rem",
        width:"100%"
      }} data={data} options={options} />
  )
}

export default StackedBar
