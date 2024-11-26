// components/BarChart.js
import {
  Card,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data, options, title, height = 545, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState("2024");

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(newDate); // Inform parent of the change
    }
  };

  return (
    <Card
      sx={{ padding: "1.5rem", backgroundColor: "#fff", boxShadow: "none" }}
    >
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}

      {/* Date Selector */}
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <FormControl sx={{ width: "120px", marginBottom: "1rem" }}>
          <InputLabel id="date-select-label">Year</InputLabel>
          <Select
            labelId="date-select-label"
            value={selectedDate}
            onChange={handleDateChange}
            label="Year"
            size="small"
          >
            {/* Add desired year options */}
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2016">2016</MenuItem>
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
