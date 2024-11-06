import { Box, TextField, Typography } from "@mui/material";
import Button from '@mui/material/Button';

import BarChart from "../../../components/BarChart";
import AddCircleIcon from '@mui/icons-material/AddCircle';

import CardThreeRow from "../../../components/CardThreeRow";

// member data 
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

function Baptism() {
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
    <div style={{
      padding:"0 1rem"
    }}>
    {/* top header */}
    <Box sx={{
      position: "sticky",
      display: "flex",
      top: "0",
      left: "0",
      padding: "1rem 0",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%", 
      maxWidth:"60rem",
    }}>
      <Typography 
      variant="h4"
       >
        Baptism
      </Typography>
      <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: "1em",
          width:"20rem",
      }}>
        <Typography variant="h5">123 members</Typography>
        <Box
          component="form"
          sx={{ '& > :not(style)': { width: '20ch' } }}
          noValidate
          autoComplete="off"
        >
          <TextField id="search-member" placeholder="Search"/>
        </Box>
      </Box>
    </Box>

    {/* main content */}

    <Box sx={{
      display:"grid",
      gridTemplateColumns:"2fr 1fr",
      marginTop:"2rem",
      gap:"2rem",
    }}>
      

      <Box sx={{
        maxWidth:"60rem"
      }}>
          <BarChart data={baptismBarData}/>
      </Box>
        <Box sx={{
          display:"flex",
          flexDirection:"column",
          gap:"4em"
        }}>
          <CardThreeRow text="Total Members" number={12}/>
  
          <div>
            <Button
            variant="outlined" 
            startIcon={<AddCircleIcon sx={{
              color:"white"
            }}/>}
            sx={{
              backgroundColor:"#3a85fe",
              padding:"1rem 1.5rem",
              marginBottom:"2rem",
              color:"#fff",
              textTransform:"capitalize"
              
            }}
            >
              Add Member
            </Button>
          </div>
        </Box>
    </Box>
    </div>
  )
}

export default Baptism;
 