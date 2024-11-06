import { Box, Card, Typography, Grid, Avatar } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import DoughnutC from "../../../components/DoughnutC";
// import sampleData from '../../membership-management/demographics/demodata';



const   ageDistribution = {
  labels: ["18 - 25", "26 - 35", "36 - 45", "46+"],
  datasets: [
    {
      data: [25, 30, 20, 25],
      backgroundColor: ["#f8766d", "#7bbf5e", "#f0a500", "#b4b7c6"]
    }
  ]
}
const   workStatus = {
  labels: ["Employed", "Unemployed"],
  datasets: [
    {
      data: [80, 20],
      backgroundColor: ["#6c8ef2", "#8d78eb"]
    }
  ]
}
const workStatusData = [
  { name: "Employed", value: 80 },
  { name: "Unemployed", value: 20 },
];
const ministryGrowthData = [
  { ministry: "Yth wrsh", members: 10 },
  { ministry: "Yth pry", members: 0 },
  { ministry: "Trf Hc", members: 20 },
  { ministry: "ush", members: 30 },
  { ministry: "Tns", members: 25 },
  { ministry: "Hsp", members: 15 },
];

function FellowshipMinistry() {
  // console.log(sampleData);
  return (

    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Fellowship Activity Overview
      </Typography>

      <Grid container spacing={2}>
        {/* Top Row Cards */}
        <Grid item xs={12} md={3} sx={{ marginRight: '8rem' }}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#2B3868",
              color: "#fff",
              height: "8.75rem",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Total Number of Ministries</Typography>
            <Typography variant="h3">13</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3} sx={{ marginRight: '8rem' }}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#27733a",
              color: "#fff",
              height: "8.75rem",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Total Number of Meetings</Typography>
            <Typography variant="h3">21</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#2B3868",
              color: "#fff",
              height: "8.75rem",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Average Growth</Typography>
            <Typography variant="h3">17%</Typography>
          </Card>
        </Grid>



        {/* Ministry Growth Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ padding: "1.5rem" }}>
            <Typography variant="h6">Ministry Growth</Typography>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={ministryGrowthData}>
                <XAxis dataKey="ministry" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="members" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Sidebar: Age and Work Status Pie Charts */}
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <Typography variant="h6">Age</Typography>
            <DoughnutC data = {ageDistribution} />                
          </Card>

          <Card sx={{ padding: "1.5rem" }}>
            <Typography variant="h6">Work Status</Typography>
            <DoughnutC data = {workStatus} /> 
          </Card>
        </Grid>
          
        {/* Fellowship Ministries List */}
        <Grid item xs={12}>
          <Card sx={{ padding: "1.5rem" }}>
            <Typography variant="h6">Fellowship Ministries</Typography>
            <Box sx={{ marginTop: "1rem" }}>
              {[
                { name: "Ushering", leader: "John Kimani" },
                { name: "Counselling", leader: "Lady John" },
                { name: "Teens", leader: "Zack Chesoni" },
                { name: "Media/Sound", leader: "Shem Mustafa" },
                { name: "Traffic", leader: "Jane Rotich" },
              ].map((ministry, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  marginBottom="1rem"
                >
                  <Avatar sx={{ marginRight: "1rem" }} src="path/to/avatar.jpg" />
                  <Box>
                    <Typography>{ministry.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Leader: {ministry.leader}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FellowshipMinistry;
