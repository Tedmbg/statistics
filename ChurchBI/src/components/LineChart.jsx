import { Line } from 'react-chartjs-2'
import { Chart as ChartJS,} from "chart.js/auto"


function LineChart({data,title}) {
    const lineChartOptions={
      responsive:true, // enable resizing
      maintainAspectRatio:false, //prevent locking aspect ratio
                plugins: {
                  legend: {
                      display: false, // Hide legend
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
        scales:{
            y:{
                grid:{
                    display:false
                }
            }
        }
    }

  return (
      <Line
      style={{
        padding:"2em 1em",
        background:"#fff",
        width:"100%",
        borderRadius:".5rem"
      }}
       data={data} options={lineChartOptions}/>
  )
}

export default LineChart
