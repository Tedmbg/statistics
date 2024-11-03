import {
  Box,
  Card,
  Typography,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Title,
} from "chart.js";
import BarChart from "../../../components/BarChart"; // Import the BarChart component

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Title
);

// Dummy data for the charts
const ageData = [20, 30, 25, 25];
const workStatusData = [80, 20];
const retentionData = [
  { month: "Jan", male: 10, female: 20 },
  { month: "Feb", male: 15, female: 10 },
  { month: "Mar", male: 12, female: 18 },
  { month: "Apr", male: 8, female: 17 },
  { month: "May", male: 10, female: 10 },
  { month: "Jun", male: 12, female: 8 },
  { month: "Jul", male: 20, female: 15 },
  { month: "Aug", male: 15, female: 12 },
  { month: "Sep", male: 10, female: 10 },
];

const discipleshipClasses = [
  {
    className: "Class 1",
    leaderName: "John Kimani",
    label: "mb .12",
    avatar: "path/to/avatar1.jpg",
  },
  {
    className: "Class 5",
    leaderName: "Lady John",
    label: "mb .16",
    avatar: "path/to/avatar2.jpg",
  },
  {
    className: "Class 9",
    leaderName: "Zack Chesoni",
    label: "mb .19",
    avatar: "path/to/avatar3.jpg",
  },
  {
    className: "Class 2",
    leaderName: "Shem Mustafa",
    label: "mb .22",
    avatar: "path/to/avatar4.jpg",
  },
  {
    className: "Class 3",
    leaderName: "Jane Rotich",
    label: "mb .23",
    avatar: "path/to/avatar5.jpg",
  },
];

function RetentionRate() {
  // Prepare data and options for the charts

  const retentionBarData = {
    labels: retentionData.map((data) => data.month),
    datasets: [
      {
        label: "Male",
        data: retentionData.map((data) => data.male),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Female",
        data: retentionData.map((data) => data.female),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
      },
    ],
  };

  const retentionBarOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Retention Rate" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        title: { display: true, text: "%" },
      },
    },
  };

  const ageDoughnutData = {
    labels: ["18 - 25", "26 - 32", "33 - 45", "45+"],
    datasets: [
      {
        label: "Age Distribution",
        data: ageData,
        backgroundColor: ["#ffbb28", "#ff8042", "#0088fe", "#00c49f"],
      },
    ],
  };

  const ageDoughnutOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Age Distribution" },
      tooltip: { enabled: true },
    },
    cutout: "70%",
  };

  const workStatusDoughnutData = {
    labels: ["Employed", "Unemployed"],
    datasets: [
      {
        label: "Work Status",
        data: workStatusData,
        backgroundColor: ["#8884d8", "#82ca9d"],
      },
    ],
  };

  const workStatusDoughnutOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Work Status" },
      tooltip: { enabled: true },
    },
    cutout: "70%",
  };

  return (
    <Box sx={{ padding: "2rem" }}>
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
              height: "8.75rem",
              textAlign: "center",
            }}
          >
            <Typography variant="h6">
              Total Number of Members in Discipleship Class
            </Typography>
            <Typography variant="h3">120</Typography>
          </Card>
        </Grid>

        {/* Second Card */}
        <Grid item xs={12} md={3}>
          <Card sx={{ padding: "1.5rem", height: "8.75rem" }}>
            <Typography variant="h6">Gender Ratio</Typography>
            <Box display="flex" justifyContent="space-between">
              <Avatar sx={{ height: "3.75rem", width: "3.75rem" }}>👨</Avatar>
              <Typography
                sx={{ fontSize: "1.575rem", mt: 1, pl: 1, pr: 0.1 }}
              >
                40%
              </Typography>
              <Avatar sx={{ height: "3.75rem", width: "3.75rem" }}>👩</Avatar>
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
              height: "8.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Retention Rate</Typography>
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
              height: "8.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Just Visiting</Typography>
            <Typography variant="h3">107</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Additional spacing between the top cards and the rest */}
      <Box my={4} />

      {/* Rest of the content */}
      <Grid container spacing={2}>
        {/* Retention Rate Chart */}
        <Grid item xs={12} md={8}>
          <BarChart
            data={retentionBarData}
            options={retentionBarOptions}
            title="Retention Rate"
            height={695} // Adjust height if needed
          />
        </Grid>

        {/* Age Distribution Donut Chart and Work Status Donut Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <Typography variant="h6">Age Distribution</Typography>
            <Doughnut
              data={ageDoughnutData}
              options={ageDoughnutOptions}
            />
          </Card>

          <Card sx={{ padding: "1.5rem" }}>
            <Typography variant="h6">Work Status</Typography>
            <Doughnut
              data={workStatusDoughnutData}
              options={workStatusDoughnutOptions}
            />
          </Card>
        </Grid>

        {/* Discipleship Classes List */}
        <Grid item xs={12}>
          <Card sx={{ padding: "1.5rem" }}>
            <Typography variant="h6">Discipleship Classes</Typography>
            <List>
              {discipleshipClasses.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{ paddingLeft: 0, paddingRight: 0 }}
                >
                  <ListItemAvatar>
                    <Avatar src={item.avatar} alt={item.leaderName} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="bold">
                        {item.className}
                      </Typography>
                    }
                    secondary={
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="body2">
                          {item.leaderName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RetentionRate;
