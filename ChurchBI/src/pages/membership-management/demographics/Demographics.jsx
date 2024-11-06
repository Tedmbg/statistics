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

        <div className="demographic-left-content">
          <Box sx={{
            display:"flex",
            gap:"1rem",
            marginBottom:'1rem',

          }}>
              <DemographicCard 
              title={"age"}
              shape={<DoughnutC data={sampleData.ageDistribution}/>}
              />
              <DemographicCard 
              title={"Work status"}
              shape={<DoughnutC data={sampleData.workStatus}/>}
              />
          </Box>
            
          <Box>
          <DemographicCard 
              title={"membership"}
              shape={<LineChart data={sampleData.membershipOverTime}/>}
              />
          </Box>
          <Box sx={{
            display:"flex",
            gap:"1rem",
            marginBottom:'1rem',

          }}>
              <DemographicCard 
              title={"Resdence"}
              shape={<DoughnutC data={sampleData.ageDistribution}/>}
              />
              <DemographicCard 
              title={"Count of Origin"}
              shape={<DoughnutC data={sampleData.workStatus}/>}
              />
          </Box>
        </div>

        <div className="demographic-right-content">
            <DemographicCard 
                
                title={"Location"}
                shape={<DoughnutC data={sampleData.locationDistribution}/>}
                />
              <DemographicCard 
                title={"Gender"}
                shape={<DoughnutC data={sampleData.genderDistribution}/>}
                />
               <StackedBar/> 
        </div>
      </div>
    </div>
    
  )
}
