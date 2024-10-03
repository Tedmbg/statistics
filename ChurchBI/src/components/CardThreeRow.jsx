import { Box, Paper, Typography } from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';

export default function CardThreeRow() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: 310,
          height: 150,
          padding:"1rem"
        },
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
          borderRadius:"1rem"
        }}
      >
        <FunctionsIcon sx={{fontSize:"4em"}} />
        <Typography fontSize="1.5rem">Total Number of Members
        </Typography>
        <Typography sx={{
            fontWeight:"bolder",
            fontSize:"1.4rem"
        }}>13</Typography>
      </Paper>
    </Box>
  );
}
