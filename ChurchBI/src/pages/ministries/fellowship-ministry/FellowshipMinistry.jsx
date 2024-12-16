import { Box, Card, Typography, Grid, Avatar } from "@mui/material";
import BarChart from "../../../components/BarChart";
import DoughnutC from "../../../components/DoughnutC";
import serviceMinistries from "../../../data/serviceMinistries.json";
import ageData from "../../../data/ageServiceMinistry.json";
import workStatusData from "../../../data/workStatusService.json";

function FellowshipMinistry() {
  const barChartData = {
    labels: ["Ushering", "Counselling", "Teens", "Media/Sound", "Traffic"],
    datasets: [
      {
        label: "Male",
        data: [10, 20, 15, 25, 20, 30, 20, 25, 15, 18, 22, 19],
        backgroundColor: "#78BFF1",
      },
      {
        label: "Female",
        data: [15, 10, 18, 17, 10, 8, 15, 12, 10, 14, 16, 13],
        backgroundColor: "#B898FF",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to fill its container
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        title: { display: true, text: "No of Members" },
      },
    },
  };
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
              width: "100%", // Full width within Grid item
            }}
          >
            <img
              src="src/assets/total_members.png" // Ensure correct path
              alt="Total Members"
              style={{ height: "2.5rem", width: "2.5rem", marginBottom: "1rem" }}
            />
            <Typography variant="h6" align="center">
              Total Number of Ministries
            </Typography>
            <Typography variant="h3">120</Typography>
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
              width: "100%", // Full width within Grid item
            }}
          >
            <Typography variant="h6" sx={{ textAlign: "center", marginBottom: "1rem" }}>
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
                  src="/assets/male_avatar.png" // Ensure correct path
                  alt="Male Members"
                  style={{ height: "50px", width: "50px", marginBottom: "0.5rem" }}
                />
                <Typography sx={{ fontSize: "1.575rem" }}>40%</Typography>
              </Box>

              {/* Female */}
              <Box textAlign="center">
                <img
                  src="/assets/female_avatar.png" // Ensure correct path
                  alt="Female Members"
                  style={{ height: "50px", width: "50px", marginBottom: "0.5rem" }}
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
              width: "100%", // Removed fixed width
            }}
          >
            <img
              src="src/assets/retention_rate.png" // Ensure correct path
              alt="Retention Rate"
              style={{ height: "3.5rem", width: "3.5rem", marginBottom: "1rem" }}
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
              width: "100%", // Full width within Grid item
            }}
          >
            <img
              src="src/assets/total_members.png" // Ensure correct path
              alt="Total Volunteers"
              style={{ height: "2.5rem", width: "2.5rem", marginBottom: "1rem" }}
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
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ padding: "1rem", backgroundColor: "#FFF" }}>
                <Typography variant="h6" textAlign="center">
                  Age
                </Typography>
                <DoughnutC data={ageData} />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ padding: "1rem", backgroundColor: "#FFF" }}>
                <Typography variant="h6" textAlign="center">
                  Work Status
                </Typography>
                <DoughnutC data={workStatusData} />
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Section - Service Ministries */}
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: "1rem", backgroundColor: "#FFF",height:"26.25rem" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Fellowship Ministries
            </Typography>
            {serviceMinistries.map((ministry, index) => (
              <Box key={index} display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{ width: 36, height: 36, bgcolor: "#e0e0e0", mr: 1 }}
                >
                  {/* Replace with an image source if available */}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {ministry.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {ministry.leader} - {ministry.label}
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
