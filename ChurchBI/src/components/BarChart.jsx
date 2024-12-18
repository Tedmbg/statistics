// src/components/BarChart.js
import {
  Card,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Bar } from "react-chartjs-2";

const BarChart = ({
  data,
  options,
  title,
  height = 545,
  onDateChange,
  selectedYear, // Renamed from selectedDate to selectedYear
}) => {
  // Default to current year if not provided
  const currentYear = new Date().getFullYear();
  const displayYear = typeof selectedYear === "number" ? selectedYear : currentYear;

  const handleDateChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    if (onDateChange) {
      onDateChange(newYear); // Pass the correctly defined variable
    }
  };

  return (
    <Card sx={{ padding: "1.5rem", backgroundColor: "#fff", boxShadow: "none" }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}

      {/* Year Selector */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <FormControl sx={{ width: "120px", marginBottom: "1rem" }}>
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={displayYear} // Use displayYear for the Select's value
            onChange={handleDateChange}
            label="Year"
            size="small"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const year = currentYear - i;
              return (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>

      <div style={{ height }}>
        {/* Ensure data and options are defined to prevent errors */}
        {data && options ? (
          <Bar data={data} options={options} />
        ) : (
          <Typography align="center" mt={4}>
            No data available.
          </Typography>
        )}
      </div>
    </Card>
  );
};

export default BarChart;
