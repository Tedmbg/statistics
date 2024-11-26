// Discipleship.jsx
import  { useState, useEffect } from "react";
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
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AbsenteeList from "./AbsenteeList";
import BarChart from "../../../components/BarChart";

// Adjust the import path based on your project structure
import { createClass } from "../../../data/createClass";

// Get data from discipleship classes
import {
  fetchDiscipleshipClasses,
  fetchMonthlyCompletedStats,
} from "../../../data/discipleship";

import axios from "axios";

// Function to fetch the class name from the server
const generateClassName = async () => {
  try {
    const response = await axios.get(
      "https://statistics-production-032c.up.railway.app/api/generate-class-name"
    );
    return response.data.className; // Return the generated class name
  } catch (error) {
    console.error("Error generating class name:", error);
    throw error; // Handle error appropriately
  }
};

export default function Discipleship() {
  // State for form data
  const [formData, setFormData] = useState({
    class_name: "", // Initialize as empty string
    instructor: "",
    creation_date: "",
    end_date: "",
    description: "", // Ensure this is handled if required
    type: "Virtual",
  });

  const [loadingClassName, setLoadingClassName] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitError, setSubmitError] = useState(null); // For error messages

  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'

  // State for fetched classes
  const [classes, setClasses] = useState([]); // Original list of classes
  const [filteredClasses, setFilteredClasses] = useState([]); // Filtered list based on search
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [loading, setLoading] = useState(true); // Loading state for classes
  const [error, setError] = useState(null); // Error state for classes

  // State for bar chart data
  const [barChartData, setBarChartData] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [loadingStats, setLoadingStats] = useState(true); // Loader state for stats
  const [errorStats, setErrorStats] = useState(null); // Error state for stats

  // Fetch generated class name on component mount
  useEffect(() => {
    const fetchClassName = async () => {
      try {
        const generatedName = await generateClassName();
        setFormData((prevData) => ({ ...prevData, class_name: generatedName }));
      } catch (error) {
        console.error("Failed to generate class name");
        // Optionally, set an error state here to inform the user
      } finally {
        setLoadingClassName(false);
      }
    };

    fetchClassName();
  }, []);

  // Fetch discipleship classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await fetchDiscipleshipClasses(); // Fetch data from API
        setClasses(data); // Set the fetched classes
        setFilteredClasses(data); // Initialize filteredClasses with all classes
      } catch (err) {
        setError("Failed to load classes."); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchClasses();
  }, []);

  // Fetch monthly stats whenever selectedYear changes
  useEffect(() => {
    const loadMonthlyStats = async () => {
      setLoadingStats(true);
      try {
        const data = await fetchMonthlyCompletedStats(selectedYear); // Fetch stats based on selectedYear

        // Transform the data for the bar chart
        const months = [
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
        ];
        const maleData = new Array(12).fill(0);
        const femaleData = new Array(12).fill(0);

        data.forEach((item) => {
          const monthIndex = new Date(`${item.month}-01`).getMonth();
          maleData[monthIndex] = item.male_completed_count || 0;
          femaleData[monthIndex] = item.female_completed_count || 0;
        });

        setBarChartData({
          labels: months,
          datasets: [
            {
              label: "Male",
              data: maleData,
              backgroundColor: "#4e79a7",
            },
            {
              label: "Female",
              data: femaleData,
              backgroundColor: "#a0cbe8",
            },
          ],
        });
      } catch (err) {
        setErrorStats("Failed to load monthly completed stats.");
      } finally {
        setLoadingStats(false);
      }
    };

    loadMonthlyStats();
  }, [selectedYear]);

  // Update filteredClasses when searchQuery changes
  useEffect(() => {
    const filtered = classes.filter((cls) =>
      cls.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClasses(filtered);
  }, [searchQuery, classes]);

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
    setLoadingSubmit(true);
    setSubmitError(null); // Reset previous errors
    try {
      console.log("Submitting Form Data:", formData); // Log formData for debugging

      const result = await createClass(formData);
      console.log("Class created successfully:", result);

      // Show success message
      setSnackbarMessage("Class created successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Reset form with a new class name
      const newClassName = await generateClassName();
      setFormData({
        class_name: newClassName,
        instructor: "",
        creation_date: "",
        end_date: "",
        description: "",
        type: "Virtual",
      });

      // Reset search query to show all classes after adding a new class
      setSearchQuery("");
    } catch (error) {
      console.error("Error creating class:", error);

      // Extract error message from response if available
      let errorMsg = "Failed to create class. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      }

      setSubmitError(errorMsg);

      // Show error snackbar
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Handle Snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Placeholder function for date change handling
  const handleDateChange = (newDate) => {
    // Implement data fetching based on the newDate
    // For example:
    // const updatedData = fetchDataForYear(newDate);
    // setBarChartData(updatedData);
    setSelectedYear(newDate);
  };

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Retention Rate by Gender (${selectedYear})`,
      },
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

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f4f4f4" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Discipleship
      </Typography>

      {/* Main Grid Container */}
      <Grid container spacing={7}>
        {/* Left Section - Form */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={10}>
            {/* Class Name */}
            <Grid item xs={12} sm={6}>
              {loadingClassName ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height={56}
                >
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <TextField
                  fullWidth
                  label="Class Name"
                  variant="outlined"
                  name="class_name"
                  value={formData.class_name}
                  disabled
                  sx={{ backgroundColor: "#FFFFFF" }}
                />
              )}
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
                sx={{ backgroundColor: "#FFFFFF" }}
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
                sx={{ backgroundColor: "#FFFFFF" }}
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
                sx={{ backgroundColor: "#FFFFFF" }}
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
                sx={{ backgroundColor: "#FFFFFF" }}
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
                startIcon={!loadingSubmit && <AddIcon />}
                disabled={loadingSubmit}
                sx={{
                  backgroundColor: "#3A85FE",
                  "&:hover": { backgroundColor: "#357AE8" },
                }}
              >
                {loadingSubmit ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Add Class"
                )}
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
            placeholder="Search by instructor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input
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
          <Card
            sx={{
              padding: "1rem",
              backgroundColor: "#FFFFFF",
              height: "30rem", // Total height of the Card
              overflowY: "auto", // Enable vertical scrolling if content overflows
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Discipleship Classes
            </Typography>
            <Box>
              {/* Show loading state */}
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress size={24} />
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : filteredClasses.length > 0 ? (
                filteredClasses.map((classData) => (
                  <Box
                    key={classData.class_id}
                    display="flex"
                    alignItems="center"
                    mb={2}
                  >
                    <Avatar sx={{ width: 36, height: 36 }}>👤</Avatar>
                    <Box ml={1}>
                      <Typography variant="body1" fontWeight="bold">
                        {classData.class_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {classData.instructor} - {classData.total_members} members
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography>No classes found.</Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={2} mt={2}>
        {/* Completed Discipleship - Bar Chart */}
        <Grid item xs={12}>
          <Card sx={{ height: 730, backgroundColor: "#FFFFFF" }}>
            {loadingStats ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <CircularProgress size={40} />
              </Box>
            ) : errorStats ? (
              <Typography color="error" align="center" mt={4}>
                {errorStats}
              </Typography>
            ) : (
              <BarChart
                data={barChartData}
                options={barChartOptions}
                title="Completed Discipleship"
                onDateChange={handleDateChange}
              />
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Absentees List */}
      <Box mt={4}>
        <AbsenteeList />
      </Box>

      {/* Snackbar for User Feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
