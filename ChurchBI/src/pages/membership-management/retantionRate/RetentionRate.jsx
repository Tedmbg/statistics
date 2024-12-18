// src/pages/RetentionRate.jsx
import { useEffect, useState } from "react";
import { Box, Card, Typography, Grid } from "@mui/material";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Title,
} from "chart.js";
import BarChart from "../../../components/BarChart";
import DoughnutC from "../../../components/DoughnutC";
import CircularProgress from "@mui/material/CircularProgress";

// Import your existing fetching functions
import {
  fetchRetentionData,
  fetchJustVisiting,
  fetchAverageRetentionRate,
  fetchGenderRatio,
  fetchWorkStatusData,
  fetchAgeDistributionData,
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
  const [retentionBarData, setRetentionBarData] = useState(null);
  const [justVisiting, setJustVisiting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRetentionRate, setAverageRetentionRate] = useState(null);
  const [malePercentage, setMalePercentage] = useState(null);
  const [femalePercentage, setFemalePercentage] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // States for donuts
  const [ageCompletedData, setAgeCompletedData] = useState(null);
  const [ageIncompleteData, setAgeIncompleteData] = useState(null);
  const [workStatusCompletedData, setWorkStatusCompletedData] = useState(null);
  const [workStatusIncompleteData, setWorkStatusIncompleteData] =
    useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const retentionData = await fetchRetentionData(selectedYear);
        setRetentionBarData(retentionData);

        const visitorData = await fetchJustVisiting(selectedYear); // Pass selectedYear
        setJustVisiting(visitorData);

        const avgRetention = await fetchAverageRetentionRate(selectedYear);
        setAverageRetentionRate(avgRetention);

        const genderRatio = await fetchGenderRatio(selectedYear);
        setMalePercentage(genderRatio.malePercentage);
        setFemalePercentage(genderRatio.femalePercentage);

        // Fetch age distribution data
        const ageData = await fetchAgeDistributionData(selectedYear);
        // Aggregate age data: completed vs incomplete by age_range
        const ageRanges = Array.from(new Set(ageData.map((d) => d.age_range)));

        const ageCompletedCounts = ageRanges.map((ar) => {
          const items = ageData.filter((d) => d.age_range === ar);
          const completed = items.reduce(
            (sum, i) =>
              sum +
              (i.male_completed_count || 0) +
              (i.female_completed_count || 0),
            0
          );
          return completed;
        });

        const ageIncompleteCounts = ageRanges.map((ar) => {
          const items = ageData.filter((d) => d.age_range === ar);
          const incomplete = items.reduce(
            (sum, i) =>
              sum +
              (i.male_not_completed_count || 0) +
              (i.female_not_completed_count || 0),
            0
          );
          return incomplete;
        });

        // Create donut data for Age (Completed and Incomplete)
        const ageCompletedDonutData = {
          labels: ageRanges,
          datasets: [
            {
              data: ageCompletedCounts,
              backgroundColor: ["#4CAF50", "#F44336", "#FF9800", "#2196F3"],
            },
          ],
        };

        const ageIncompleteDonutData = {
          labels: ageRanges,
          datasets: [
            {
              data: ageIncompleteCounts,
              backgroundColor: ["#4CAF50", "#F44336", "#FF9800", "#2196F3"],
            },
          ],
        };

        setAgeCompletedData(ageCompletedDonutData);
        setAgeIncompleteData(ageIncompleteDonutData);

        // Fetch Work Status Data
        const wsData = await fetchWorkStatusData(selectedYear);
        // wsData contains { labels: [...], datasets: [...] }
        // Aggregate completed vs incomplete for each occupation_status
        const occupationStatuses = wsData.labels;

        // Assuming datasets order:
        // 0: Male Completed, 1: Female Completed, 2: Male Not Completed, 3: Female Not Completed
        const maleCompletedArr = wsData.datasets[0].data;
        const femaleCompletedArr = wsData.datasets[1].data;
        const maleNotCompletedArr = wsData.datasets[2].data;
        const femaleNotCompletedArr = wsData.datasets[3].data;

        const wsCompletedCounts = occupationStatuses.map(
          (_, idx) =>
            (maleCompletedArr[idx] || 0) + (femaleCompletedArr[idx] || 0)
        );

        const wsIncompleteCounts = occupationStatuses.map(
          (_, idx) =>
            (maleNotCompletedArr[idx] || 0) + (femaleNotCompletedArr[idx] || 0)
        );

        // "Work Status Completed" donut
        const workStatusCompletedDonutData = {
          labels: occupationStatuses,
          datasets: [
            {
              data: wsCompletedCounts,
              backgroundColor: [
                "#4CAF50",
                "#F44336",
                "#FF9800",
                "#2196F3",
                "#9C27B0",
              ],
            },
          ],
        };

        // "Work Status Incomplete" donut
        const workStatusIncompleteDonutData = {
          labels: occupationStatuses,
          datasets: [
            {
              data: wsIncompleteCounts,
              backgroundColor: [
                "#4CAF50",
                "#F44336",
                "#FF9800",
                "#2196F3",
                "#9C27B0",
              ],
            },
          ],
        };

        setWorkStatusCompletedData(workStatusCompletedDonutData);
        setWorkStatusIncompleteData(workStatusIncompleteDonutData);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load retention data");
        setLoading(false);
      }
    };

    getData();
  }, [selectedYear]); // Re-fetch data when selectedYear changes

  const handleDateChange = (newYear) => {
    setSelectedYear(newYear);
  };

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
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
        title: { display: true, text: "Retention Rate (%)" },
      },
    },
  };

  const donutOptions = {
    responsive: true,
    plugins: {
      title: { display: false },
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
        {/* Total Members */}
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
            <img
              src="src/assets/total_members.png" // Updated path to use absolute path
              alt="Total Members"
              style={{ height: "2.5rem", width: "2.5rem" }}
            />
            <Typography variant="h6" align="center">
              Total Number of Members in Discipleship Class
            </Typography>
            <Typography variant="h3">120</Typography>{" "}
            {/* Replace with dynamic data if available */}
          </Card>
        </Grid>

        {/* Gender Ratio */}
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
                  src="/assets/male_avatar.png" // Updated path
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
                  src="/assets/female_avatar.png" // Updated path
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

        {/* Average Retention Rate */}
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
            <img src="src/assets/retention_rate.png" alt="Retention Rate" />{" "}
            {/* Corrected image path */}
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

        {/* Just Visiting */}
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
              src="/assets/visitor.png" // Corrected path to use absolute path
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

      <Box my={4} />

      <Grid container spacing={2}>
        {/* Retention Rate Chart */}
        <Grid item xs={12}>
          <Card
            sx={{
              padding: "1.5rem",
              backgroundColor: "#fff",
              boxShadow: "none",
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <BarChart
                data={retentionBarData}
                options={retentionBarOptions}
                title="Retention Rate"
                onDateChange={handleDateChange}
                selectedYear={selectedYear} // Pass selectedYear as a prop
                height={"41.9895rem"}
              />
            )}
          </Card>
        </Grid>

        {/* Donut Charts */}
        <Grid item xs={12} md={12}>
          <Grid container spacing={2}>
            {/* Age Incomplete */}
            <Grid item xs={6}>
              <Card
                sx={{
                  padding: "1rem",
                  textAlign: "center",
                  backgroundColor: "#FFF",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" mb={2}>
                  Age Incomplete
                </Typography>
                {loading || !ageIncompleteData ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <DoughnutC data={ageIncompleteData} options={donutOptions} />
                )}
              </Card>
            </Grid>

            {/* Work Status Incomplete */}
            <Grid item xs={6}>
              <Card
                sx={{
                  padding: "1rem",
                  textAlign: "center",
                  backgroundColor: "#FFF",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" mb={2}>
                  Work Status Incomplete
                </Typography>
                {loading || !workStatusIncompleteData ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <DoughnutC
                    data={workStatusIncompleteData}
                    options={donutOptions}
                  />
                )}
              </Card>
            </Grid>

            {/* Age Completed */}
            <Grid item xs={6}>
              <Card
                sx={{
                  padding: "1rem",
                  textAlign: "center",
                  backgroundColor: "#FFF",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" mb={2}>
                  Age Completed
                </Typography>
                {loading || !ageCompletedData ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <DoughnutC data={ageCompletedData} options={donutOptions} />
                )}
              </Card>
            </Grid>

            {/* Work Status Completed */}
            <Grid item xs={6}>
              <Card
                sx={{
                  padding: "1rem",
                  textAlign: "center",
                  backgroundColor: "#FFF",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" mb={2}>
                  Work Status Completed
                </Typography>
                {loading || !workStatusCompletedData ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <DoughnutC
                    data={workStatusCompletedData}
                    options={donutOptions}
                  />
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RetentionRate;
