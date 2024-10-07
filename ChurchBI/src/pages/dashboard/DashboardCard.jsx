import { Avatar, Box, Button, Paper, Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import AsideArticle from "../../components/AsideArticle";
import CardThreeRow from "../../components/CardThreeRow";
// Icons
import GroupsIcon from '@mui/icons-material/Groups';


export default function DashboardCard() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          maxWidth: 390,
          padding:"2em 2em",
          borderRadius:"2rem",
          cursor:"pointer",
          userSelect:"none",
          backgroundColor:"#FFFFFF",   
        },    
      }}
    >
      <Paper 
        sx={{
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          gap:'2em',
          margin: "auto",
        }}
        
      >
          <GroupsIcon 
          sx={{
            fontSize:"3rem",
     
          }}/>
          <Box>
            <Typography 
              variant="h3"
              color="black"
              >1245</Typography>
            <Typography
              variant="subtitle"
            >Total number Ministry</Typography>
          </Box>
      </Paper>
    </Box> 
  );
}
