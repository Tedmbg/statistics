import { Box, Paper, Typography } from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';

export default function CardThreeRow({text,number}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        
       
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          gap:"1rem",
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center',
          borderRadius:"1rem",
          padding:"1rem 4rem",
          width:"20rem",
          
        }}
      >
        <FunctionsIcon sx={{fontSize:"4em"}} />
        <Typography fontSize="1.5rem">{text}
        </Typography>
        <Typography sx={{
            fontWeight:"bolder",
            fontSize:"1.4rem"
        }}>{number}</Typography>
      </Paper>
    </Box>
  );
}
