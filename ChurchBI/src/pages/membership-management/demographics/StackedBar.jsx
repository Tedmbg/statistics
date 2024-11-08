import { Bar } from "react-chartjs-2";
function StackedBar({data,title}) {
    const options = {
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
      };
  return (
    <Bar style={{
        padding:"2em 1em",
        background:"#fff",
        borderRadius:".5rem"
      }} data={data} options={options} />
  )
}

export default StackedBar
