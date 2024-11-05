import { Box, Paper, Typography } from "@mui/material"
import DoughnutC from "../../../components/DoughnutC"
import "./Demographics-card.css"

function DemographicCard({title,shape}) {
  return (
    <div className="demographic-card">
    <Paper elevation={3} sx={{
        background:"#fff",
        display:"flex",
        flexDirection:"column",
        padding:"1rem",
        width:'100%'
        
    }}>
        <Typography 
        sx={
            {
            color:'black',
            fontSize:"1.5rem",
            fontWeight:"bold",
            marginBottom:"1rem"
        }
        }
        >{title}</Typography>
        <div>
            {shape}
        </div>
    </Paper>
      
    </div>
  )
}

export default DemographicCard
