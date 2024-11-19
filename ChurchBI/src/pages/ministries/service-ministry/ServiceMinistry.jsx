import { Box, Grid, Card, Typography, Avatar } from "@mui/material";
import BarChart from "../../../components/BarChart";
import DoughnutC from "../../../components/DoughnutC";

// Import JSON data
import attendanceData from "../../../data/attendanceServiceMinistry.json";
import ageData from "../../../data/ageServiceMinistry.json";
import workStatusData from "../../../data/workStatusService.json";
import serviceMinistries from "../../../data/serviceMinistries.json";

export default function Dashboard() {
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
            {/* Replace with your actual image path */}
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
            <Typography variant="h6" style={{ textAlign: "center" }}>
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
            {/* Replace with your actual image path */}
            <img src="/assets/retationrate.png" alt="Retention Rate" />
            <Typography variant="h6">Average growth </Typography>
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
            {/* Replace with your actual image path */}
            <img src="public/assets/visitor.png" alt="Just Visiting" />
            <Typography variant="h6">Total number of ministries</Typography>
            <Typography variant="h3">107</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Bar Chart */}
      <Box mb={3} height={800} sx={{ display: "flex", gap: 3 ,backgroundColor:"#fff", marginTop:"1.5rem" }}>
        {/* Left Side: Attendance and Bar Chart */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" mb={1}>
            Attendance
          </Typography>
          <BarChart
            data={attendanceData}
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
            height={700}
          />
        </Box>

        {/* Right Side: Service Ministries Card */}
        <Card sx={{ flex: "0.4", padding: "1rem", backgroundColor: "#FFF" ,marginTop:"2.5rem" , height:"46.875rem"}}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Service Ministries
          </Typography>
          {serviceMinistries.map((ministry, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: "#e0e0e0", mr: 1 }}>
                {/* Add an icon or image if needed */}
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
      </Box>

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
      </Grid>
    </Box>
  );
}
