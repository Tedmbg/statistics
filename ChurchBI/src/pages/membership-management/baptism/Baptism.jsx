import { Box, Typography, useTheme } from "@mui/material";
import Button from '@mui/material/Button';

import BarChart from "../../../components/BarChart";
import AddCircleIcon from '@mui/icons-material/AddCircle';

import CardThreeRow from "../../../components/CardThreeRow";
import { useEffect, useState } from "react";

// member data 

// /api/baptisms/count
const baptisData = [
  { month: "Jan", male: 10, female: 20 },
  { month: "Feb", male: 15, female: 10 },
  { month: "Mar", male: 12, female: 18 },
  { month: "Apr", male: 8, female: 17 },
  { month: "May", male: 10, female: 10 },
  { month: "Jun", male: 12, female: 8 },
  { month: "Jul", male: 20, female: 15 },
  { month: "Aug", male: 15, female: 12 },
  { month: "Sep", male: 10, female: 10 },
];
const barOptions = {
  responsive: true,
  plugins: {
    tooltip: { enabled: true },
    legend:{
      position: 'bottom',
    }
  },
  scales: {
    x: { stacked: true },
    y: {
      stacked: true,
      beginAtZero: true,
      title: { display: true, text: "%" },
    },
  },
};

function Baptism() {
  const [baptismCount,setBaptismCount]=useState(null)
  useEffect(()=>{
    fetch("https://statistics-production-032c.up.railway.app/api/baptisms/count")
      .then(res=>res.json())
      .then(data=>setBaptismCount(data.total_baptisms))
  },[])

  const theme = useTheme(); // Note the parentheses here to call the hook

  const baptismBarData = {
    labels: baptisData.map((data) => data.month),
    datasets: [
      {
        label: "Male",
        data: baptisData.map((data) => data.male),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Female",
        data: baptisData.map((data) => data.female),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
      },
    ],
  };

  return (
    <div style={{ padding: "0 1rem" }}>
      {/* top header */}
      <Box
        sx={{
          position: "sticky",
          top: "0",
          left: "0",
          padding: "1rem 0",
          backgroundColor: "#D9D9D9",
        }}
      >
        <Typography variant="h4">Baptism</Typography>
      </Box>

      {/* main content */}
      <Box
        sx={{
          
          [theme.breakpoints.up('md')]: {
            display: "grid",
            marginTop: "2rem",
            gap: "2rem",
            gridTemplateColumns: "2fr 1fr",
            padding: "0.5rem 0",
          },
        }}
      >
        <Box sx={{ maxWidth: "60rem",marginBottom:"1rem", }}>
          <BarChart data={baptismBarData} options={barOptions} height={400}/>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "4em",
            // marginTop:"1em",
          }}
        >
          <CardThreeRow text="Total Members" number={baptismCount||0} />

          <div>
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon sx={{ color: "white" }} />}
              sx={{
                backgroundColor: "#3a85fe",
                padding: "1rem 1.5rem",
                marginBottom: "2rem",
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              Add Member
            </Button>
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default Baptism;
