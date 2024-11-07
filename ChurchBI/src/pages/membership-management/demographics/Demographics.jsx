import { Box,Typography } from "@mui/material"
import { sampleData } from "./demodata"
import DemographicCard from "./DemographicCard"
import DoughnutC from "../../../components/DoughnutC"
import LineChart from "../../../components/LineChart"
import StackedBar from "./StackedBar"

export default function Demographics() {
  return (
    <div className="demographic-main-container">
      <Typography
       variant="h4"
       sx={{
        padding:'1rem 0'
       }}
       >Overview</Typography>
      <div className="demographic-container">
        <div className="left-demo-content">
        
        <div style={{
          display:"flex",
          width:"20rem",
          height:"18rem",
          gap:"1em",
          border:"1px solid blue"
        }}>
          <div>
            <DemographicCard data={sampleData.locationDistribution} title="Data"/>
          </div>
          <div>
            <DemographicCard data={sampleData.locationDistribution} title="Data"/>
          </div>
          </div>

          <div style={{maxWidth:"42.5rem"}}>
            <LineChart data={sampleData.membershipOverTime}/>
          </div>
        </div>

        <div className="right-demo-content">
          <DemographicCard data={sampleData.ageDistribution} title="Data"/>
          
        </div>
      </div>
    </div>
    
  )
}
