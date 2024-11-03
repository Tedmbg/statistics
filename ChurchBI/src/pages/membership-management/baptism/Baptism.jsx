import { Box } from "@mui/material";
import DoughnutC from "../../../components/DoughnutC";
const data ={
  datasets: [{
      data: [20,30],
      backgroundColor:[
          '#3a85fe',
          '#8d78eb'
      ]
    }],
  labels:[
      "Employed",
      "Unemployed",
  ]
}

function Baptism() {
  return (
      <DoughnutC data={data}/>
  )
}

export default Baptism
