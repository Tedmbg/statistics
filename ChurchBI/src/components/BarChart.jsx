// components/BarChart.js
import { Card, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data, options, title, height = 545, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().getFullYear().toString()); // Default to current year

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(newDate); // Communicate date change to parent
    }
  };

  return (
    <Card sx={{ padding: "1.5rem", backgroundColor: "#fff", boxShadow: "none" }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}

      {/* Date Selector */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <FormControl sx={{ width: "120px", marginBottom: "1rem" }}>
          <InputLabel id="date-select-label">Year</InputLabel>
          <Select
            labelId="date-select-label"
            value={selectedDate}
            onChange={handleDateChange}
            label="Year"
            size="small"
          >
            {/* Generate year options dynamically */}
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>

      <div style={{ height }}>
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
};

export default BarChart;
