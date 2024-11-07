import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import DashboardCard from './DashboardCard';
import { useState,useEffect } from "react";

export default function Dashboard() {

  // State for the Year and Month dropdowns
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState("September");

  return (
    <Box
      sx={{
        display: 'flex',
        padding: '2rem',
        gap: '2rem',
      }}
    >
      {/* Main Dashboard Content */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Sun 15 Sep/2024
        </Typography>
        <DashboardCard />
      </Box>

      {/* Sidebar for Year and Month selectors */}
      <Box
        sx={{
          width: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          padding: '1rem',
          backgroundColor: '#fefeve',
          borderRadius: '8px',
        }}
      >
        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            label="Year"
          >
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2022}>2022</MenuItem>
            {/* Add more years as needed */}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Month</InputLabel>
          <Select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            label="Month"
          >
            <MenuItem value="January">January</MenuItem>
            <MenuItem value="February">February</MenuItem>
            <MenuItem value="March">March</MenuItem>
            <MenuItem value="April">April</MenuItem>
            <MenuItem value="May">May</MenuItem>
            <MenuItem value="June">June</MenuItem>
            <MenuItem value="July">July</MenuItem>
            <MenuItem value="August">August</MenuItem>
            <MenuItem value="September">September</MenuItem>
            <MenuItem value="October">October</MenuItem>
            <MenuItem value="November">November</MenuItem>
            <MenuItem value="December">December</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
