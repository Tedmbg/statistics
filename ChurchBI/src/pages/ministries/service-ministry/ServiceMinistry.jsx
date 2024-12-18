import { useEffect, useState } from "react";
import { Box, Grid, Card, Typography, Avatar } from "@mui/material";
import BarChart from "../../../components/BarChart";
import DoughnutC from "../../../components/DoughnutC";

// Import JSON data
import {
  fetchAgeDistribution,
  fetchServiceMinistries,
  fetchWorkStatus,
} from "./service";

export default function Dashboard() {
  const [serviceMinistries, setServiceMinistries] = useState([]); // State for storing ministries
  const [ageData, setAgeData] = useState(null);
  const [workStatusData, setWorkStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both Age Distribution and Work Status Data
        const [ageResponse, workResponse] = await Promise.all([
          fetchAgeDistribution(),
          fetchWorkStatus(),
        ]);

        // Age Distribution: Aggregate total per age range
        const ageLabels = [];
        const ageTotals = [];
        ageResponse.data.forEach((item) => {
          if (!ageLabels.includes(item.age_range)) {
            ageLabels.push(item.age_range);
            ageTotals.push(item.total);
          }
        });

        const formattedAgeData = {
          labels: ageLabels,
          datasets: [
            {
              label: "Age Distribution",
              data: ageTotals,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            },
          ],
        };

        // Work Status: Aggregate total per occupation_status
        const workLabels = [];
        const workTotals = [];
        const colorMap = {
          Student: "#36A2EB",
          Unemployed: "#FF6384",
          Employed: "#4BC0C0",
        };

        workResponse.data.forEach((item) => {
          const label = item.occupation_status;
          const total = item.male_count + item.female_count;
          if (!workLabels.includes(label)) {
            workLabels.push(label);
            workTotals.push(total);
          }
        });

        const formattedWorkData = {
          labels: workLabels,
          datasets: [
            {
              label: "Work Status",
              data: workTotals,
              backgroundColor: workLabels.map(
                (label) => colorMap[label] || "#9966FF"
              ),
            },
          ],
        };

        // Set State
        setAgeData(formattedAgeData);
        setWorkStatusData(formattedWorkData);
      } catch (err) {
        console.error("Error fetching graphs data:", err);
        setError("Failed to load graph data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadServiceMinistries = async () => {
      try {
        const response = await fetchServiceMinistries();
        console.log("Fetched Ministries Data:", response); // Log the data
        setServiceMinistries(response.data); // Set the ministries
      } catch (err) {
        console.error("Error loading service ministries:", err);
        setError("Failed to load service ministries.");
      } finally {
        setLoading(false);
      }
    };

    loadServiceMinistries();
  }, []);

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f4f4f4" }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Overview
      </Typography>

      {/* Top Row Cards */}
      <Grid container spacing={2}>
        {/* First Card */}
        <Grid item xs={12} md={3}>
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
            }}
          >
            <img src="assets/total members.png" alt="Total Members" />
            <Typography variant="h6">
              Total Number of Members Volunteers
            </Typography>
            <Typography variant="h3">120</Typography>
          </Card>
        </Grid>

        {/* Second Card */}
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              padding: "1.5rem",
              height: "15.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#FFF",
            }}
          >
            <Typography variant="h6" textAlign="center">
              Gender Ratio
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <img
                src="/assets/male_avatar.png"
                style={{ height: "50px", width: "50px" }}
              />
              <Typography sx={{ fontSize: "1.575rem", mt: 1, pl: 1, pr: 0.1 }}>
                40%
              </Typography>
              <img
                src="/assets/female_avatar.png"
                style={{ height: "50px", width: "50px" }}
              />
              <Typography sx={{ fontSize: "1.575rem", mt: 1, pl: 1 }}>
                60%
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Third Card */}
        <Grid item xs={12} md={3}>
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
            }}
          >
            <img src="/assets/retationrate.png" alt="Retention Rate" />
            <Typography variant="h6">Average growth</Typography>
            <Typography variant="h3">17%</Typography>
          </Card>
        </Grid>

        {/* Fourth Card */}
        <Grid item xs={12} md={3}>
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
            }}
          >
            <img src="public/assets/visitor.png" alt="Just Visiting" />
            <Typography variant="h6">Total number of ministries</Typography>
            <Typography variant="h3">107</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Bar Chart */}
      <Box
        mb={3}
        height={800}
        sx={{
          display: "flex",
          gap: 3,
          backgroundColor: "#fff",
          marginTop: "1.5rem",
        }}
      >
        {/* Left Side: Attendance and Bar Chart */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" mb={1}>
            Attendance
          </Typography>
          <BarChart
            // data={}
            options={{
              responsive: true,
              scales: {
                x: { stacked: true }, // Enable stacking on the x-axis
                y: {
                  stacked: true, // Enable stacking on the y-axis
                  beginAtZero: true,
                },
              },
            }}
            height={600}
          />
        </Box>
      </Box>

      {/* Donut Charts */}
      <Grid container spacing={2}>
        {/* Left Section - Age Distribution */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{ padding: "1rem", boxShadow: "none", backgroundColor: "#FFF" }}
          >
            <Typography variant="h6" textAlign="center" mb={2}>
              Age Distribution
            </Typography>
            {loading ? (
              <Typography textAlign="center">Loading...</Typography>
            ) : error ? (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            ) : (
              <DoughnutC data={ageData} />
            )}
          </Card>
        </Grid>

        {/* Right Section - Work Status */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{ padding: "1rem", boxShadow: "none", backgroundColor: "#FFF" }}
          >
            <Typography variant="h6" textAlign="center" mb={2}>
              Work Status
            </Typography>
            {loading ? (
              <Typography textAlign="center">Loading...</Typography>
            ) : error ? (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            ) : (
              <DoughnutC data={workStatusData} />
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Service Ministries */}
      <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
        <Grid item xs={12}>
          <Card
            sx={{
              flex: 1,
              padding: "1rem",
              backgroundColor: "#FFF",
              height: "26.37rem",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Service Ministries
            </Typography>
            {serviceMinistries.length > 0 ? (
              serviceMinistries.map((ministry, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{ width: 36, height: 36, bgcolor: "#e0e0e0", mr: 2 }}
                  >
                    {ministry.ministryName?.charAt(0)?.toUpperCase() || "?"}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {ministry.ministry_name || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Instructor: {ministry.instructor || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Members: {ministry.totalMembers || 0}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography textAlign="center">
                No ministries available
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
