import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Typography } from '@mui/material';


function createData(m_name,added_date){
    return {m_name,added_date}
}

const rows = [
    createData('Lrelo Pjend','Thur 19 Sep 2024'),
    createData('Joseph Pjend','Thur 19 Sep 2024'),
    createData('Juma John','Thur 19 Nov 2024'),
    createData('Krelo Pjend','Thur 19 Sep 2024'),
  ];

export default function MinistryTable(){
    return (
        <TableContainer component={Paper}sx={{maxWidth:400}}>
            <Typography
                sx={{
                    fontSize:"1.2rem",
                    fontWeight:"500",
                    padding:".8rem 1rem"
                }}
            >Worship Ministry</Typography>
            <Table sx={{width:"100%"}}
                arial-label="absentee list"
                size="small"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Date</TableCell>
                    </TableRow>
                 </TableHead>
                 <TableBody>
                    {rows.map((row)=>(
                        <TableRow
                            key={row.m_name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell
                                 component="th" 
                                 scope="row"
                                 sx={{
                                    display:"flex",
                                    alignItems:"center",
                                    gap:".5em"
                                 }}
                                 >
                                <Avatar

                                     sx={{ width: 26, height: 26 }}
                                ></Avatar>
                                 {row.m_name}</TableCell>
                            <TableCell align="right">{row.added_date}</TableCell>

                        </TableRow>
                    ))}
                 </TableBody>

            </Table>
        </TableContainer>
    )
}