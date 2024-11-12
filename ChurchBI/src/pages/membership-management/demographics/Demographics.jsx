import { Box, Typography, CircularProgress } from "@mui/material";
import DemographicCard from "./DemographicCard";
import DoughnutC from "../../../components/DoughnutC";
import LineChart from "../../../components/LineChart";
import StackedBar from "./StackedBar";
import { useState, useEffect } from "react";

// datus
import { fetchDemographicData } from "./demographicData";

const boxStyle = {
  padding: "2em 1em",
  background: "#fff",
  borderRadius: ".5rem",
  width: "100%"
};

const titleStyles = {
  fontSize: "1.4rem",
  color: "black",
  fontWeight: "bold",
  padding: "0 0 1rem 1rem"
};

export default function Demographics() {
  const [demographicData, setDemographicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchDemographicData();
        setDemographicData(data);
      } finally {
        setIsLoading(false); 
      }
    };
    getData();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }



  return (
    <div className="demographic-main-container">
      <Typography variant="h4" sx={{ padding: '1rem 0' }}>Overview</Typography>
      <div className="demographic-container">
        <div className="left-demo-content">
          <div style={{
            display: "flex",
            justifyContent: 'space-between',
            gap: "1em",
          }}>
            <div className="shape-container">
              <h1 style={titleStyles}>Age</h1>
              <DoughnutC data={demographicData.ageDistribution} />
            </div>
            <div className="shape-container">
              <h1 style={titleStyles}>Gender</h1>
              <DoughnutC data={demographicData.genderDistribution} />
            </div>
            <div className="shape-container">
              <h1 style={titleStyles}>Marriage</h1>
              <DoughnutC data={demographicData.marriage} />
            </div>
          </div>

          <Box style={boxStyle}>
            <LineChart data={demographicData.membershipOverTime} title="Members per Month" />
          </Box>

          <Box style={boxStyle}>
            <StackedBar data={demographicData.locationDistribution} title="Residence" />
          </Box>

          <Box style={boxStyle}>
            <StackedBar data={demographicData.countryOfOrigin} title="Country of Origin" />
          </Box>

          <Box style={boxStyle} sx={{ height: "400px" }}>
            <StackedBar data={demographicData.workStatus} title="Work Status" axis="y" stacked={true} />
          </Box>
        </div>
      </div>
    </div>
  );
}
