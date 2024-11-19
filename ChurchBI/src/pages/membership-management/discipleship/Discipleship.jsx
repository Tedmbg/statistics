import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  Avatar,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AbsenteeList from "./AbsenteeList";
import BarChart from "../../../components/BarChart";
import DoughnutC from "../../../components/DoughnutC";


// automate name calling
function generateClassName(){
  let className = "ICC" ;
  let number = Math.round(Math.random() * 100) + 100
  let fullName = `${className}${number}`
  return fullName
}

export default function Discipleship() {
  const barChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Male",
        data: [10, 20, 15, 25, 20, 30, 20, 25, 15, 18, 22, 19],
        backgroundColor: "#4e79a7",
      },
      {
        label: "Female",
        data: [15, 10, 18, 17, 10, 8, 15, 12, 10, 14, 16, 13],
        backgroundColor: "#a0cbe8",
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

  const doughnutData = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ["#4e79a7", "#f28e2b"],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to fill its container
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f4f4f4" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Discipleship
      </Typography>

      <Grid container spacing={7}>
        {/* Left Section - Form */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={10}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ClassName"
                variant="outlined"
                defaultValue={generateClassName()}
                sx={{
                  backgroundColor: "#FFFF",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Facilitator"
                variant="outlined"
                defaultValue="Name"
                sx={{
                  backgroundColor: "#FFFF",
                }}
              >
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Creation Date"
                variant="outlined"
                type="date"
                sx={{
                  backgroundColor: "#FFFF",
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                variant="outlined"
                type="date"
                sx={{
                  backgroundColor: "#FFFF",
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Type"
                variant="outlined"
                select
                defaultValue="Virtual"
                sx={{
                  backgroundColor: "#FFFF",
                }}
              >
                <MenuItem value="Virtual">Virtual</MenuItem>
                <MenuItem value="In-person">In-person</MenuItem>
              </TextField>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Button
                variant="contained"
                startIcon={<span>+</span>}
                sx={{
                  backgroundColor: "#3A85FE",
                  "&:hover": {
                    backgroundColor: "#357AE8",
                  },
                }}
              >
                Add Class
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Section - Search & Discipleship Classes */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ marginBottom: "1rem" ,  backgroundColor:"#fff"}}
          />

          {/* Discipleship Classes List */}
          <Card sx={{ padding: "1rem" ,backgroundColor:"#FFF"}}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Discipleship Classes
            </Typography>
            <Box>
              {["Class 1", "Class 5", "Class 9", "Class 2", "Class 3"].map(
                (className, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ width: 36, height: 36 }}>👤</Avatar>
                    <Box ml={1}>
                      <Typography variant="body1" fontWeight="bold">
                        {className}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        John Kimani - mb.12
                      </Typography>
                    </Box>
                  </Box>
                )
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={2} mt={2}>
        {/* Completed Discipleship - Bar Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 630 ,backgroundColor:"#FFF" }}>
            <BarChart
              data={barChartData}
              options={barChartOptions}
              title="Completed Discipleship"
            />
          </Card>
        </Grid>

        {/* Disciples Classes - Donut Chart */}
        <Grid item xs={12} md={3.5}>
          <Box
          backgroundColor="#FFF"
          pt={1}
          pl={3}
          >
          <Typography variant="h6">Total completed Discipleship</Typography>
          <Card
            sx={{
              height: 600,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:"#FFF",
              boxShadow:"none"
            }}
          >
            <DoughnutC data={doughnutData} options={doughnutOptions} />
          </Card>
          </Box>
        </Grid>
      </Grid>

         {/* Absentees List */}
         <Box mt={4}>
        <AbsenteeList />
      </Box>
    </Box>
  );
}
