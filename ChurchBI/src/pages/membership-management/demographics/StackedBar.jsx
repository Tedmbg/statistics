import Barchart from "../../../components/BarChart"
import { sampleData } from "./demodata"
function StackedBar() {
    const options ={
        indexAxis: 'y',
        datalabels: {
            anchor: 'end',
            align: 'right',
            color: 'white',
            font: {
              weight: 'bold',
              size: 14,
            },}
    }
  return (
    <div>
      <Barchart data={sampleData.ageDistribution} options={options}/>
    </div>
  )
}

export default StackedBar
