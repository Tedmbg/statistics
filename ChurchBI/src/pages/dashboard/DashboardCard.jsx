import { Box, Paper, Typography } from "@mui/material";
import {useDashboardData} from './dashboardData';




function DashboardCard() {
  const { members, conversions, ministries, baptisms, discipleshipClasses, staff } = useDashboardData();
  const datas=[
    {
      "id": 1,
      "icon": "/assets/congregation.png",
      "title": "Total Number Of Members",
      "value":members?.total_members ||0
    },
    {
      "id": 2,
      "icon": "/assets/conversions.png",
      "title": "Total Number Of Conversions",
      "value": conversions?.total_conversions ||0
    },
    {
      "id": 3,
      "icon": "/assets/ministry.png",
      "title": "Total Number Of Ministries",
      "value": ministries?.total_ministries ||0
    },
    {
      "id": 4,
      "icon": "/assets/baptism.png",
      "title": "Total Number of Baptisms",
      "value": baptisms?.total_baptisms ||0
    },
    {
      "id": 5,
      "icon": "/assets/dicsipleship.png",
      "title": "Discipleship Classes Completed",
      "value": discipleshipClasses?.completed_classes ||0
    },
    {
      "id": 6,
      "icon": "/assets/staff.png",
      "title": "Church Staff",
      "value": staff?.total_staff||0
    }
  ]
  return (
    <Box
      sx={{
        display:'flex',
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
    >{datas.map((item) => (
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
