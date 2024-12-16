// Discipleship.jsx
import { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
  fetchInstructors,
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
    class_name: "", // Initialize with an empty string or default value
    instructor: "",
    creation_date: "",
    end_date: "",
    type: "Virtual",
    start_time: "", // Add a field for start time
    end_time: "", // Add a field for end time
    class_day: "",
  });

  const [instructors, setInstructors] = useState([]); // State to hold instructors
  const [loadingInstructors, setLoadingInstructors] = useState(true); // Loading state for instructors

  // Fetch instructors when the component mounts
  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const instructorData = await fetchInstructors();
        setInstructors(instructorData); // Set the fetched instructors
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoadingInstructors(false); // Stop loading
      }
    };

    loadInstructors();
  }, []);

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
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [loadingStats, setLoadingStats] = useState(true); // Loader state for stats
  const [errorStats, setErrorStats] = useState(null); // Error state for stats

  // State for confirmation dialog
  const [openConfirm, setOpenConfirm] = useState(false);

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
        const data = await fetchMonthlyCompletedStats(selectedYear);

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
        const maleData = Array(12).fill(0);
        const femaleData = Array(12).fill(0);

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
        console.error("Failed to load monthly completed stats:", err);
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

  // Handle form submission (opens confirmation dialog)
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null); // Reset any previous errors

    // Basic Validation (optional but recommended)
    if (
      !formData.creation_date ||
      !formData.end_date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.type ||
      !formData.instructor
    ) {
      setSubmitError("Please fill in all required fields.");
      setSnackbarMessage("Please fill in all required fields.");
      console.log(formData);
      
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Open the confirmation dialog
    setOpenConfirm(true);
  };

  // Handle confirmation of submission
  const handleConfirm = async () => {
    setOpenConfirm(false);
    setLoadingSubmit(true);
    setSubmitError(null); // Reset previous errors

    try {
      console.log("Submitting Form Data:", formData); // Debugging

      if (formData.start_time >= formData.end_time) {
        setSnackbarMessage("Start time must be earlier than end time.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoadingSubmit(false);
        return;
      }

      // Combine start_time and end_time into class_time
      const combinedClassTime = `${formData.start_time} - ${formData.end_time}`;

      // Prepare the data to send
      const dataToSend = {
        ...formData,
        class_time: combinedClassTime, // Add the combined class_time
      };

      delete dataToSend.start_time; // Remove the original start_time field
      delete dataToSend.end_time; // Remove the original end_time field

      const result = await createClass(dataToSend); // Send the modified data
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
        type: "Virtual",
        start_time: "",
        end_time: "",
        class_day: 0,
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

  // Handle cancellation of submission
  const handleCancel = () => {
    setOpenConfirm(false);
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
              {loadingInstructors ? (
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
                  label="Facilitator"
                  variant="outlined"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  select // Turn TextField into a dropdown
                  sx={{ backgroundColor: "#FFFFFF" }}
                >
                  {/* Map instructors to menu items */}
                  {instructors.map((instructor) => (
                    <MenuItem key={instructor.user_id} value={instructor.username}>
                      {instructor.username}
                    </MenuItem>
                  ))}
                </TextField>
              )}
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

            {/* Start Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                variant="outlined"
                type="time" // Use "time" input type for time selection
                name="start_time" // Unique name for this field
                value={formData.start_time} // Bind to formData.start_time
                onChange={handleChange} // Use the same handler to update state
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#FFFFFF" }}
              />
            </Grid>

            {/* End Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time"
                variant="outlined"
                type="time" // Use "time" input type for time selection
                name="end_time" // Unique name for this field
                value={formData.end_time} // Bind to formData.end_time
                onChange={handleChange} // Use the same handler to update state
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
                <MenuItem value="Physical">Physical</MenuItem>
              </TextField>
            </Grid>

            {/* Number of Sessions */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="class_days"
                variant="outlined"
                name="class_day" // Ensure this matches the formData key
                value={formData.sessions} // Bind to formData.sessions
                onChange={handleChange} // Use the same handler to update state
                select // Enable dropdown functionality
                sx={{ backgroundColor: "#FFFFFF" }}
              >
                {/* Options for 1 to 7 */}
                {Array.from({ length: 7 }, (_, index) => index + 1).map(
                  (value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  )
                )}
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
                  <Box display="flex" alignItems="center">
                    <CircularProgress size={20} color="inherit" />
                    <Typography sx={{ marginLeft: "0.5rem" }}>Adding...</Typography>
                  </Box>
                ) : (
                  "Add Class"
                )}
              </Button>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog
              open={openConfirm}
              onClose={handleCancel}
              aria-labelledby="confirm-dialog-title"
              aria-describedby="confirm-dialog-description"
            >
              <DialogTitle id="confirm-dialog-title">Confirm Submission</DialogTitle>
              <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                  Are you sure you want to submit the following data?
                </DialogContentText>
                <Box mt={2}>
                  <Typography variant="subtitle1"><strong>Class Name:</strong> {formData.class_name}</Typography>
                  <Typography variant="subtitle1"><strong>Facilitator:</strong> {formData.instructor}</Typography>
                  <Typography variant="subtitle1"><strong>Creation Date:</strong> {formData.creation_date}</Typography>
                  <Typography variant="subtitle1"><strong>End Date:</strong> {formData.end_date}</Typography>
                  <Typography variant="subtitle1"><strong>Start Time:</strong> {formData.start_time}</Typography>
                  <Typography variant="subtitle1"><strong>End Time:</strong> {formData.end_time}</Typography>
                  <Typography variant="subtitle1"><strong>Type:</strong> {formData.type}</Typography>
                  <Typography variant="subtitle1"><strong>Number of Sessions:</strong> {formData.sessions}</Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary" autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
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
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
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
                        {classData.instructor} - {classData.total_members}{" "}
                        members
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
            ) : barChartData.labels.length > 0 &&
              barChartData.datasets.length > 0 ? (
              <BarChart
                data={barChartData}
                options={barChartOptions}
                title="Completed Discipleship"
                onDateChange={handleDateChange}
              />
            ) : (
              <Typography align="center" mt={4}>
                No data available.
              </Typography>
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
