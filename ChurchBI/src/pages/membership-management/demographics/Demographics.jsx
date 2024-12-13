// Demographics.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DoughnutC from "../../../components/DoughnutC";
import LineChart from "../../../components/LineChart";
import StackedBar from "./StackedBar";
import {
  fetchDemographicData,
  fetchMembershipOverTime,
} from "./demographicData";

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

  // New state variables for LineChart
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState(null);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchDemographicData();
        setDemographicData(data);
      } catch (error) {
        console.error("Error fetching demographic data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  // Fetch LineChart data whenever selectedYear changes
  useEffect(() => {
    const getChartData = async () => {
      setIsChartLoading(true);
      setChartError(null);
      try {
        const data = await fetchMembershipOverTime(selectedYear);
        // Assuming the API returns data in the format: [{ month: 'January', count: 100 }, ...]
        const months = data.map((item) => item.month);
        const counts = data.map((item) => item.count);

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Members",
              data: counts,
              fill: true,
              backgroundColor: "rgba(58, 133, 254, 0.2)",
              borderColor: "#3A85FE",
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        setChartError("Failed to load chart data.");
      } finally {
        setIsChartLoading(false);
      }
    };

    getChartData();
  }, [selectedYear]);

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
            alignItems: "flex-start", // Aligns items to the top
            gap: "1rem",
            backgroundColor: "#FFF",
            height: "600px",
            padding: "1rem", // Adds spacing around the container
          }}
        >
          {/* Year Selector */}
          {/* <Box
            sx={{
              width: "100%", // Span across the top
              display: "flex",
              justifyContent: "flex-end", // Position selector on the left
              marginBottom: "1rem",
            }}
          >
            <FormControl size="small" >
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                label="Year"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box> */}

          {/* Charts */}
          <Box
            sx={{
              flex: 1,
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1 style={titleStyles}>Age</h1>
            <DoughnutC data={demographicData.ageDistribution} />
          </Box>
          <Box
            sx={{
              flex: 1,
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1 style={titleStyles}>Gender</h1>
            <DoughnutC data={demographicData.genderDistribution} />
          </Box>
          <Box
            sx={{
              flex: 1,
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1 style={titleStyles}>Marriage</h1>
            <DoughnutC data={demographicData.marriage} />
          </Box>
        </div>

        {/* Line Chart */}
        <Box style={boxStyle} sx={{ width: "100%", position: "relative" }}>
          {isChartLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : chartError ? (
            <Typography color="error" textAlign="center">
              {chartError}
            </Typography>
          ) : (
            <LineChart
              data={chartData}
              title="Members per Month"
              yearSelector={
                <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                  <FormControl size="small" sx={{ marginBottom: "1rem" }}>
                    <InputLabel id="year-select-label">Year</InputLabel>
                    <Select
                      labelId="year-select-label"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      label="Year"
                    >
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
              }
            />
          )}
        </Box>
        {/* Stacked Bar Charts */}
        {/* Residence */}
        <Box style={boxStyle} sx={{ width: "100%", height: "600px" }}>
          <StackedBar
            data={demographicData.locationDistribution}
            title="Residence"
          />
        </Box>
        {/* County of origin */}
        <Box style={boxStyle} sx={{ width: "100%", height: "600px" }}>
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
