import { Box, Card, Typography, Grid, Avatar } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Dummy data for the charts (placeholders)
const ageData = [
  { name: "18 - 25", value: 20 },
  { name: "33 - 45", value: 20 },
  { name: "33 - 45", value: 20 },
  { name: "33 - 45", value: 20 },
];
const workStatusData = [
  { name: "Employed", value: 80 },
  { name: "Unemployed", value: 20 },
];
const retentionData = [
  { month: "Jan", rate: 10 },
  { month: "Feb", rate: 20 },
  { month: "Mar", rate: 15 },
  { month: "Apr", rate: 25 },
  { month: "May", rate: 20 },
  { month: "Jun", rate: 30 },
  { month: "Jul", rate: 20 },
  { month: "Aug", rate: 25 },
  { month: "Sep", rate: 15 },
];

function RetentionRate() {
  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Overview
      </Typography>

      <Grid container spacing={2}>
        {/* Top Row Cards */}
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#2B3868",
              color: "#fff",
              height: "8.75rem",
              textAlign:"center"
            }}
          >
            <Typography variant="h6">
              Total Number of Members in Discipleship Class
            </Typography>
            <Typography variant="h3">120</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ padding: "1.5rem", height: "8.75rem" }}>
            <Typography variant="h6">Gender Ratio</Typography>
            <Box display="flex" justifyContent="space-between">
              <Avatar sx={{ height: "3.75rem", width: "3.75rem" }}>👨</Avatar>
              <Typography sx={{ fontSize: "1.575rem", mt: 1, pl: 1, pr: 0.1 }}>
                40%
              </Typography>
              <Avatar sx={{ height: "3.75rem", width: "3.75rem" }}>👩</Avatar>
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
              height: "8.75rem",
              display: "flex",
              flexDirection:"column",
              justifyContent:"center",
              alignItems:"center"
            }}
          >
            <Typography variant="h6">Retention Rate</Typography>
            <Typography variant="h3">17%</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#2B3868",
              color: "#fff",
              height: "8.75rem",
              display: "flex",
              flexDirection:"column",
              justifyContent:"center",
              alignItems:"center"
            }}
          >
            <Typography variant="h6">Just Visiting</Typography>
            <Typography variant="h3">107</Typography>
          </Card>
        </Grid>

        {/* Retention Rate Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ padding: "1.5rem" }}>
            <Typography variant="h6">Retention Rate</Typography>
            <ResponsiveContainer width="100%" height={508}>
              <BarChart data={retentionData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rate" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Sidebar: Age and Work Status Pie Charts */}
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <Typography variant="h6">Age</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={ageData}
                  dataKey="value"
                  outerRadius={80}
                  fill="#82ca9d"
                >
                  {ageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#ffbb28", "#ff8042", "#0088fe", "#00c49f"][index % 4]
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card sx={{ padding: "1.5rem" }}>
            <Typography variant="h6">Work Status</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={workStatusData}
                  dataKey="value"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {workStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#8884d8", "#82ca9d"][index % 2]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Discipleship Classes List */}
        <Grid item xs={12}>
          <Card sx={{ padding: "1.5rem" }}>
            <Typography variant="h6">Discipleship Classes</Typography>
            <Box sx={{ marginTop: "1rem" }}>
              {["Class 1", "Class 5", "Class 9", "Class 2", "Class 3"].map(
                (className, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    marginBottom="1rem"
                  >
                    <Avatar
                      sx={{ marginRight: "1rem" }}
                      src="path/to/avatar.jpg"
                    />
                    <Box>
                      <Typography>{className}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Member info
                      </Typography>
                    </Box>
                  </Box>
                )
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RetentionRate;
