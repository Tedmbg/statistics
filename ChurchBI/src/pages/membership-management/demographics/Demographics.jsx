import { Box,Typography } from "@mui/material"
import DemographicCard from "./DemographicCard"
import DoughnutC from "../../../components/DoughnutC"
import LineChart from "../../../components/LineChart"
import StackedBar from "./StackedBar"
import { useState, useEffect } from "react"


// datus
import { fetchDemographicData } from "./demographicData"

const styles={
  width:"18rem",
  widtd:"25rem",
 
}
const titleStyles={
  fontSize:"1.5rem",
  color:"black",
  padding:"0 0 1rem 1rem"
}

export default function Demographics() { 
  const [demographicData, setDemographicData] = useState(null)
  useEffect(() => {
    const getData = async () => {
      const data = await fetchDemographicData();
      setDemographicData(data);
    };
    getData();
  }, []);

  if (!demographicData) {
    return <div>Loading...</div>;
  }


 
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
              justifyContent:'space-between',
              gap:"1em",
            }}>

              <div className="shape-container">
                  <h1 style={titleStyles} >Age</h1>
                  <DoughnutC data={demographicData.ageDistribution}/>
              </div>
              <div className="shape-container">
                  <h1 style={titleStyles} >Gender</h1>
                  <DoughnutC data={demographicData.genderDistribution}/>
              </div>
              <div className="shape-container">
                  <h1 style={titleStyles} >Marriage</h1>
                  <DoughnutC data={demographicData.marriage}/>
              </div>
              </div>

          <Box>
            <LineChart data={demographicData.membershipOverTime}/>
          </Box>

          <Box >
            <StackedBar data={demographicData.locationDistribution} title="Residence"/>
          </Box>
          
          <Box>
            <StackedBar data={demographicData.countryOfOrigin} title="County of Origin"/>
          </Box>

        </div>
      </div>
    </div>
    
  )
}
