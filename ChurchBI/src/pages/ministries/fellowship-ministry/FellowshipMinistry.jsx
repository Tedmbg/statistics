// FellowshipMinistry.jsx
import { useEffect, useState } from "react";
import { Box, Card, Typography, Grid, Avatar, CircularProgress } from "@mui/material";
import BarChart from "../../../components/BarChart";
import DoughnutC from "../../../components/DoughnutC";
import serviceMinistries from "../../../data/serviceMinistries.json";

// API fetching functions
import {
  fetchFellowshipTotalMembers,
  fetchFellowshipMinistries,
  fetchFellowshipAgeDistribution,
  fetchFellowshipWorkStatus,
} from "./fellowship";

function FellowshipMinistry() {
  const [barChartData, setBarChartData] = useState(null); // State for chart dat
  const [totalMembers, setTotalMembers] = useState(0); // Total members
  const [ageData, setAgeData] = useState(null); // Age Distribution data
  const [workStatusData, setWorkStatusData] = useState(null); // Work Status data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ministries = await fetchFellowshipMinistries();
        
        // Transform data for the bar chart
        const labels = ministries.map((item) => item.ministryName); // Ministry names
        const totalMembersData = ministries.map((item) => item.totalMembers); // Total members

        const chartData = {
          labels: labels,
          datasets: [
            {
              label: "Total Members",
              data: totalMembersData,
              backgroundColor: "#78BFF1", // Blue bars
            },
          ],
        };

        setBarChartData(chartData);
      } catch (err) {
        console.error("Error fetching ministries data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: false },
      y: {
        stacked: false,
        beginAtZero: true,
        title: { display: true, text: "Total Members" },
      },
    },
  };

  // Fetch total number of members in fellowship
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFellowshipTotalMembers();
        setTotalMembers(data.totalMembers);
      } catch (err) {
        console.error("Error fetching total members:", err);
        setError("Failed to load total members");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch Age Distribution and Work Status data
  useEffect(() => {
    const fetchDonutData = async () => {
      try {
        // Fetch data concurrently
        const [ageDistribution, workStatus] = await Promise.all([
          fetchFellowshipAgeDistribution(),
          fetchFellowshipWorkStatus(),
        ]);
  
        console.log("Age Distribution:", ageDistribution);
        console.log("Work Status:", workStatus);
  
        // Safeguard against undefined or null
        const ageDataArray = Array.isArray(ageDistribution)
          ? ageDistribution
          : [];
        const workStatusDataArray = Array.isArray(workStatus)
          ? workStatus
          : [];
  
        // Aggregate Age Distribution data
        const ageAggregation = ageDataArray.reduce((acc, item) => {
          acc[item.ageRange] = (acc[item.ageRange] || 0) + item.total;
          return acc;
        }, {});
  
        const ageChartData = {
          labels: Object.keys(ageAggregation), // Age ranges
          datasets: [
            {
              label: "Age Distribution",
              data: Object.values(ageAggregation), // Totals
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#C9CBCF",
              ],
            },
          ],
        };
  
        // Aggregate Work Status data
        const workStatusAggregation = workStatusDataArray.reduce((acc, item) => {
          acc[item.occupationStatus] =
            (acc[item.occupationStatus] || 0) + item.totalCount;
          return acc;
        }, {});
  
        // Combine 'Unemployed' and 'Student' into 'Non-employed'
        const filteredWorkStatus = {
          Employed: workStatusAggregation["Employed"] || 0,
          "Non-employed":
            (workStatusAggregation["Unemployed"] || 0) +
            (workStatusAggregation["Student"] || 0),
        };
  
        const workStatusChartData = {
          labels: Object.keys(filteredWorkStatus), // Employed and Non-employed
          datasets: [
            {
              label: "Work Status",
              data: Object.values(filteredWorkStatus), // Totals
              backgroundColor: ["#36A2EB", "#FF6384"],
            },
          ],
        };
  
        // Update state with transformed data
        setAgeData(ageChartData);
        setWorkStatusData(workStatusChartData);
      } catch (error) {
        console.error("Error fetching donut data:", error);
        setError("Failed to load donut data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDonutData();
  }, []);
  
  

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Overview
      </Typography>
  
      <Grid container spacing={2}>
        {/* Total Members */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#2B3868",
              color: "#fff",
              height: "15.75rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              fontSize: "20px", // Corrected from "20p" to "20px"
            }}
          >
            <img
              src="src/assets/total_members.png"
              alt="Total Members"
              style={{
                height: "2.5rem",
                width: "2.5rem",
                marginBottom: "1rem",
              }}
            />
            <Typography variant="h6" align="center">
              Total Number of Ministries
            </Typography>
            <Typography variant="h3">
              {error && !ageData && !workStatusData ? error : totalMembers}
            </Typography>
          </Card>
        </Grid>
  
        {/* Gender Ratio */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#FFF",
              color: "#000",
              height: "15.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{ textAlign: "center", marginBottom: "1rem" }}
            >
              Gender Ratio
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-around"
              width="100%"
            >
              {/* Male */}
              <Box textAlign="center">
                <img
                  src="/assets/male_avatar.png"
                  alt="Male Members"
                  style={{
                    height: "50px",
                    width: "50px",
                    marginBottom: "0.5rem",
                  }}
                />
                <Typography sx={{ fontSize: "1.575rem" }}>40%</Typography>
              </Box>
  
              {/* Female */}
              <Box textAlign="center">
                <img
                  src="/assets/female_avatar.png"
                  alt="Female Members"
                  style={{
                    height: "50px",
                    width: "50px",
                    marginBottom: "0.5rem",
                  }}
                />
                <Typography sx={{ fontSize: "1.575rem" }}>60%</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
  
        {/* Average Growth */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#2B3868",
              color: "#fff",
              height: "15.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <img
              src="src/assets/retention_rate.png"
              alt="Retention Rate"
              style={{
                height: "3.5rem",
                width: "3.5rem",
                marginBottom: "1rem",
              }}
            />
            <Typography variant="h6">Average Growth</Typography>
            <Typography variant="h3">17%</Typography>
          </Card>
        </Grid>
  
        {/* Total Number of Volunteers */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#2B3868",
              color: "#fff",
              height: "15.75rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <img
              src="src/assets/total_volunteers.png"
              alt="Total Volunteers"
              style={{
                height: "2.5rem",
                width: "2.5rem",
                marginBottom: "1rem",
              }}
            />
            <Typography variant="h6" align="center">
              Total Number of Volunteers
            </Typography>
            <Typography variant="h3">120</Typography>
          </Card>
        </Grid>
      </Grid>
  
      {/* Ministry Growth Chart */}
      <Grid marginTop={6} marginBottom={6}>
        <Card sx={{ height: 730 }}>
          <BarChart
            data={barChartData}
            options={barChartOptions}
            title="Number of Members"
          />
        </Card>
      </Grid>
  
      {/* Sidebar: Age and Work Status Pie Charts */}
      <Grid container spacing={2}>
        {/* Left Section - Donut Charts */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              padding: "2rem",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container spacing={2}>
              {/* Age Distribution Donut */}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    padding: "1rem",
                    height: "28.25rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow:"none"
                  }}
                >
                  <Typography variant="h6" textAlign="center" mb={2}>
                    Age Distribution
                  </Typography>
                  {ageData ? (
                    <DoughnutC data={ageData} />
                  ) : (
                    <Typography textAlign="center">No data available</Typography>
                  )}
                </Card>
              </Grid>
  
              {/* Work Status Donut */}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    padding: "1rem",
                    height: "28.25rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow:"none"  
                  }}
                >
                  <Typography variant="h6" textAlign="center" mb={2}>
                    Work Status
                  </Typography>
                  {workStatusData ? (
                    <DoughnutC data={workStatusData} />
                  ) : (
                    <Typography textAlign="center">No data available</Typography>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Grid>
  
        {/* Right Section - Service Ministries */}
        <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Card
            sx={{
              padding: "1rem",
              backgroundColor: "#FFF",
              height: "32.25rem",
              width: "28.75rem",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Fellowship Ministries
            </Typography>
            {serviceMinistries.map((ministry, index) => (
              <Box key={index} display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "#e0e0e0", mr: 1 }}>
                  {ministry.ministry_name
                    ? ministry.ministry_name.charAt(0).toUpperCase()
                    : "?"}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {ministry.ministry_name || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {ministry.leader || "N/A"} - {ministry.label || "N/A"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}  

export default FellowshipMinistry;
