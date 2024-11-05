import { Line } from 'react-chartjs-2'
import { Chart as ChartJS,} from "chart.js/auto"


function LineChart({data}) {
    const lineChartOptions={
        scales:{
            y:{
                grid:{
                    display:false
                }
            }
        }
    }

  return (
    <div>
      <Line data={data} options={lineChartOptions}/>
    </div>
  )
}

export default LineChart
