import { Box } from "@mui/material"
import { sampleData } from "./demodata"
import DemographicCard from "./DemographicCard"
import DoughnutC from "../../../components/DoughnutC"
import LineChart from "../../../components/LineChart"

export default function Demographics() {
  console.log(sampleData.workStatus)
  return (
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
      </div>
    </div>
  )
}
