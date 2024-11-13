// RetentionRate.jsx
import { useEffect, useState } from "react";
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
import DoughnutC from "../../../components/DoughnutC"; // Import your custom DoughnutC component

// Import JSON data
import ageData from "../../../data/ageDataRetention.json";
import workStatusData from "../../../data/workStatusDataRetention.json";
import discipleshipClasses from "../../../data/discipleshipClasses.json";
import {
  fetchRetentionData,
  fetchJustVisiting,
  fetchAverageRetentionRate,
  fetchGenderRatio,
} from "../../../data/retentionDataGraph";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Title
);

function RetentionRate() {
  // Prepare data and options for the charts

  //barchart
  const [retentionBarData, setRetentionBarData] = useState(null);
  const [justVisiting, setJustVisiting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRetentionRate, setAverageRetentionRate] = useState(null);
  const [malePercentage, setMalePercentage] = useState(null);
  const [femalePercentage, setFemalePercentage] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const retentionData = await fetchRetentionData(); // Fetch dynamic data
        setRetentionBarData(retentionData);

        const visitorData = await fetchJustVisiting(); // fetch just visiting data
        setJustVisiting(visitorData);

        const avgRetention = await fetchAverageRetentionRate();
        setAverageRetentionRate(avgRetention);

        //fetch gender ratio
        const genderRatio = await fetchGenderRatio();
        setMalePercentage(genderRatio.malePercentage);
        setFemalePercentage(genderRatio.femalePercentage);

        setLoading(false);
      } catch (err) {
        setError("Failed to load retention data");
        setLoading(false);
      }
    };

    getData();
  }, []);

  // test if data is going to be sent.
  console.log("Retention Bar Data:", retentionBarData);

  const retentionBarOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Retention Rate by Gender" },
      tooltip: { enabled: true },
      legend: { position: "bottom" },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100, // Maximum value for percentage
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
        title: { display: true, text: "Retention Rate (%)" },
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
      legend: {
        position: "bottom",
      },
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
      legend: {
        position: "bottom",
      },
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
              height: "15.75rem",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Replace with your actual image path */}
            <img
              src="assets/total members.png"
              alt="Total Members"
              style={{ height: "2.5rem", width: "2.5rem" }}
            />
            <Typography variant="h6" align="center">
              Total Number of Members in Discipleship Class
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
            <Box
              display="flex"
              justifyContent="space-around"
              alignItems="center"
            >
              <Box textAlign="center">
                <img
                  src="/assets/male_avatar.png"
                  alt="Male Members"
                  style={{ height: "50px", width: "50px" }}
                />
                {loading ? (
                  <Typography sx={{ fontSize: "1.575rem", mt: 1 }}>
                    ...
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: "1.575rem", mt: 1 }}>
                    {malePercentage}%
                  </Typography>
                )}
              </Box>
              <Box textAlign="center">
                <img
                  src="/assets/female_avatar.png"
                  alt="Female Members"
                  style={{ height: "50px", width: "50px" }}
                />
                {loading ? (
                  <Typography sx={{ fontSize: "1.575rem", mt: 1 }}>
                    ...
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: "1.575rem", mt: 1 }}>
                    {femalePercentage}%
                  </Typography>
                )}
              </Box>
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
            <Typography variant="h6">Average Retention Rate</Typography>
            {loading ? (
              <Typography variant="h6">Loading...</Typography>
            ) : error ? (
              <Typography variant="h6" color="error">
                Error
              </Typography>
            ) : (
              <Typography variant="h3">{averageRetentionRate}%</Typography>
            )}
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
            <img
              src="public/assets/visitor.png"
              alt="Just Visiting"
              style={{ height: "2.5rem", width: "2.5rem" }}
            />
            <Typography variant="h6">Just Visiting</Typography>
            {loading ? (
              <Typography variant="h6">Loading...</Typography>
            ) : error ? (
              <Typography variant="h3" color="error">
                Error
              </Typography>
            ) : (
              <Typography variant="h3">{justVisiting}</Typography>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Additional spacing between the top cards and the rest */}
      <Box my={4} />

      <Grid container spacing={2}>
        {/* Retention Rate Chart */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#fff",
              boxShadow: "none",
            }}
          >
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <BarChart
                data={retentionBarData}
                options={retentionBarOptions}
                title="Retention Rate"
                height={"41.9895rem"} // Adjust height if needed
              />
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Discipleship classes */}
          <Card sx={{ padding: "1.5rem", backgroundColor: "#fff" }}>
            <Typography variant="h6">Discipleship Classes</Typography>
            <List>
              {discipleshipClasses.map((item, index) => (
                <ListItem key={index} sx={{ paddingLeft: 0, paddingRight: 0 }}>
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
                        <Typography variant="body2" color="textSecondary">
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

        {/* Age Distribution Donut Chart and Work Status Donut Chart */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card
                sx={{
                  padding: "1rem",
                  textAlign: "center",
                  backgroundColor: "#FFF",
                  display: "flex", // Enable flex layout
                  flexDirection: "column", // Stack children vertically
                  justifyContent: "center", // Center children vertically
                  alignItems: "center", // Center children horizontally
                }}
              >
                <Typography variant="h6" mb={2}>
                  Age Distribution
                </Typography>
                <DoughnutC
                  data={ageDoughnutData}
                  options={ageDoughnutOptions}
                />
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card
                sx={{
                  padding: "1rem",
                  textAlign: "center",
                  backgroundColor: "#FFF",
                  display: "flex", // Enable flex layout
                  flexDirection: "column", // Stack children vertically
                  justifyContent: "center", // Center children vertically
                  alignItems: "center", // Center children horizontally
                }}
              >
                <Typography variant="h6" mb={2}>
                  Work Status
                </Typography>
                <DoughnutC
                  data={workStatusDoughnutData}
                  options={workStatusDoughnutOptions}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RetentionRate;
