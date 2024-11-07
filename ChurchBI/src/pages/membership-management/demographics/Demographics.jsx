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
          flexWrap:"wrap",
          gap:"1em",
          border:"1px solid blue"
        }}>
          <Box sx={{width:"15rem"}}>
            <DemographicCard data={sampleData.locationDistribution} title="Data"/>
          </Box>
          
          <Box sx={{width:"15rem"}}>
            <DemographicCard data={sampleData.locationDistribution} title="Data"/>
          </Box>

          </div>

          <Box style={{maxWidth:"31rem"}}>
            <LineChart data={sampleData.membershipOverTime}/>
          </Box>

          <div style={{
          display:"flex",
          flexWrap:"wrap",
          gap:"1em",
          border:"1px solid blue"
        }}>
          <Box sx={{width:"15rem"}}>
            <DemographicCard data={sampleData.locationDistribution} title="Data"/>
          </Box>
          
          <Box sx={{width:"15rem"}}>
            <DemographicCard data={sampleData.locationDistribution} title="Data"/>
          </Box>

          </div>

          
        </div>

        <div className="right-demo-content">
         <Box>
         <DemographicCard data={sampleData.ageDistribution} title="Data"/>
         </Box>
         <Box>
         <DemographicCard data={sampleData.ageDistribution} title="Data"/>
         </Box>
          
        </div>
      </div>
    </div>
    
  )
}
