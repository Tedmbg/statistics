import { Line } from 'react-chartjs-2'
// import { Chart as ChartJS,} from "chart.js/auto"


function LineChart({data}) {
    const lineChartOptions={
                plugins: {
                  legend: {
                      display: false, // Hide legend
                  },
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
        borderRadius:".5rem"
      }}
       data={data} options={lineChartOptions}/>
  )
}

export default LineChart
