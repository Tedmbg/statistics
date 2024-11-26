import  { useState } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import AbsenteeList from "./AbsenteeList";
import BarChart from "../../../components/BarChart";
import DoughnutC from "../../../components/DoughnutC";
import { createClass } from "../../../data/createClass";

// Function to generate a random class name
const generateClassName = () => {
  const className = "ICC";
  const number = Math.floor(Math.random() * 100) + 100; // Use floor for integer
  return `${className}${number}`;
};

export default function Discipleship() {
  // State for form data
  const [formData, setFormData] = useState({
    class_name: generateClassName(),
    instructor: "",
    creation_date: "",
    end_date: "",
    description: "",
    type: "Virtual",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const result = await createClass(formData);
      console.log("Class created successfully:", result);
      // Reset form or show success message
      setFormData({
        class_name: generateClassName(),
        instructor: "",
        creation_date: "",
        end_date: "",
        description: "",
        type: "Virtual",
      });
    } catch (error) {
      console.error("Error creating class:", error);
      // Show error message
    }
  };

  // Sample chart data and options
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
    maintainAspectRatio: false,
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  // Placeholder function for date change handling
  const handleDateChange = (newDate) => {
    // Implement data fetching based on the newDate
    // For example:
    // const updatedData = fetchDataForYear(newDate);
    // setBarChartData(updatedData);
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
            {/* Class Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Class Name"
                variant="outlined"
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#FFFFFF",
                }}
              />
            </Grid>

            {/* Facilitator */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Facilitator"
                variant="outlined"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#FFFFFF",
                }}
              />
            </Grid>

            {/* Creation Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Creation Date"
                variant="outlined"
                type="date"
                name="creation_date"
                value={formData.creation_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                variant="outlined"
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Type"
                variant="outlined"
                name="type"
                value={formData.type}
                onChange={handleChange}
                select
                sx={{
                  backgroundColor: "#FFFFFF",
                }}
              >
                <MenuItem value="Virtual">Virtual</MenuItem>
                <MenuItem value="In-person">In-person</MenuItem>
              </TextField>
            </Grid>

            {/* Submit Button */}
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
                onClick={handleSubmit}
                startIcon={<AddIcon />}
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
          {/* Search Field */}
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
            sx={{ marginBottom: "1rem", backgroundColor: "#FFFFFF" }}
          />

          {/* Discipleship Classes List */}
          <Card sx={{ padding: "1rem", backgroundColor: "#FFFFFF" }}>
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
        <Grid item xs={12} md={12}>
          <Card sx={{ height: 730, backgroundColor: "#FFFFFF" }}>
            <BarChart
              data={barChartData}
              options={barChartOptions}
              title="Completed Discipleship"
              onDateChange={handleDateChange}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Absentees List */}
      <Box mt={4}>
        <AbsenteeList />
      </Box>
    </Box>
  );
}
