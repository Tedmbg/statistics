// components/BarChart.js
import { Card, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data, options, title, height = 400 }) => {
  return (
    <Card sx={{ padding: "1.5rem" }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <div style={{ height }}>
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
};

export default BarChart;
