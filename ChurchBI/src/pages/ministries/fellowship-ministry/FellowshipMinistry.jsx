import { Box, Card, Typography, Grid, Avatar } from "@mui/material";
import BarChart from "../../../components/BarChart";
import DoughnutC from "../../../components/DoughnutC";
import serviceMinistries from "../../../data/serviceMinistries.json";
import ageData from "../../../data/ageServiceMinistry.json";
import workStatusData from "../../../data/workStatusService.json";

function FellowshipMinistry() {
  const barChartData = {
    labels: [
      "Ushering",
      "Counselling",
      "Teens",
      "Media/Sound",
      "Traffic"
    ],
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
        {/* Top Row Cards */}
        <Grid item xs={12} md={3} sx={{ marginRight: '8rem' }}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#2B3868",
              color: "#fff",
              height: "15.75rem",
              textAlign: "center",
              display:"flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src="assets/total members.png" alt="Total Members" />
            <Typography variant="h6">
            Total Number of Ministries
            </Typography>
            <Typography variant="h3">120</Typography>
          </Card>
       
        </Grid>

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
            <Typography variant="h6">Average growth </Typography>
            <Typography variant="h3">17%</Typography>
          </Card>
        </Grid>


</Grid>
        {/* Ministry Growth Chart */}
        <Grid marginTop={6} marginBottom={6}>
        <Card sx={{ height: 730}}>
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
          <Card sx={{ padding: "1rem", backgroundColor: "#FFF" }}>
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
