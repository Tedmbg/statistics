import { Box, Typography, CircularProgress } from "@mui/material";
import DoughnutC from "../../../components/DoughnutC";
import LineChart from "../../../components/LineChart";
import StackedBar from "./StackedBar";
import { useState, useEffect } from "react";
import { fetchDemographicData } from "./demographicData";

const boxStyle = {
  padding: "2em 1em",
  background: "#fff",
  borderRadius: ".5rem",
  width: "100%",
};

const titleStyles = {
  fontSize: "1.4rem",
  color: "black",
  fontWeight: "bold",
  padding: "0 0 1rem",
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="demographic-main-container" style={{ padding: "1rem" }}>
      <Typography variant="h4" sx={{ padding: "1rem 0" }}>
        Overview
      </Typography>
      <div
        className="demographic-container"
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {/* Doughnut Charts */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <Box sx={{ flex: 1, minWidth: "300px" }}>
            <h1 style={titleStyles}>Age</h1>
            <DoughnutC data={demographicData.ageDistribution} />
          </Box>
          <Box sx={{ flex: 1, minWidth: "300px" }}>
            <h1 style={titleStyles}>Gender</h1>
            <DoughnutC data={demographicData.genderDistribution} />
          </Box>
          <Box sx={{ flex: 1, minWidth: "300px" }}>
            <h1 style={titleStyles}>Marriage</h1>
            <DoughnutC data={demographicData.marriage} />
          </Box>
        </div>

        {/* Line Chart */}
        <Box style={boxStyle} sx={{ width: "100%" }}>
          <LineChart
            data={demographicData.membershipOverTime}
            title="Members per Month"
          />
        </Box>

        {/* Stacked Bar Charts */}
        <Box style={boxStyle} sx={{ width: "100%" }}>
          <StackedBar
            data={demographicData.locationDistribution}
            title="Residence"
          />
        </Box>

        <Box style={boxStyle} sx={{ width: "100%" }}>
          <StackedBar
            data={demographicData.countryOfOrigin}
            title="Country of Origin"
          />
        </Box>

        <Box style={boxStyle} sx={{ width: "100%", height: "600px" }}>
          <StackedBar
            data={demographicData.workStatus}
            title="Work Status"
            axis="y"
            stacked={true}
          />
        </Box>
      </div>
    </div>
  );
}
