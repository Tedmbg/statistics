import {Doughnut} from "react-chartjs-2"
import { Chart as ChartJS, plugins } from "chart.js/auto"


function DoughnutC(props) {
  const options={
    responsive:true,
    plugins:{
      legend:{
        position:'bottom',
      }
    }
  }
  return (
    <div>
      <Doughnut data={props.data} options={options}/>
    </div>
  )
}

export default DoughnutC

