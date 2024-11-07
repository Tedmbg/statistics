import { Box, Paper, Typography } from "@mui/material";
import dashboardData from './dashboard.json'; // Import the JSON data
import { useState,useEffect } from "react";

function DashboardCard() {
  const [members, setMembers] = useState();
  useEffect(() => {
    fetch('api/members/count')
      .then((res) => res.json())

      .then((data) => setMembers(data))
      .catch((error) => console.error("Error fetching members count:", error));
  }, []);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection:'row',
        gap:9,
        mt:6,
        ml:6,
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          maxWidth: 390,
          padding: "2em 2em",
          borderRadius: "2rem",
          cursor: "pointer",
          userSelect: "none",
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      {dashboardData.map((item) => (
        <Paper
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2em',
            margin: "auto",
            width:'20em',
          }}
        >
          <img
            src={item.icon} // Use icon path from JSON data
            style={{ width: 70, height: 70 ,objectFit:"contain"}}
          />
          <Box>
            <Typography
              variant="h3"
              color="black"
            >
              {item.value}
            </Typography>
            <Typography
              variant="subtitle"
            >
              {item.title}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default DashboardCard;
