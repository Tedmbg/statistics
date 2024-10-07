import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Typography } from '@mui/material';


function createData(d_name,d_class,d_date){
    return {d_name,d_class,d_date}
}

const rows = [
    createData('Lrelo Pjend','class 6','Thur 19 Sep 2024'),
    createData('Joseph Pjend','class 5','Thur 19 Sep 2024'),
    createData('Juma John','class 9','Thur 19 Nov 2024'),
    createData('Krelo Pjend','class 6','Thur 19 Sep 2024'),
  ];

export default function AbsenteeList(){
    return (
        <TableContainer component={Paper}sx={{maxWidth:400}}>
            <Typography
                sx={{
                    fontSize:"1.2rem",
                    fontWeight:"500",
                    padding:".8rem 1rem"
                }}
            >Absentees List</Typography>
            <Table sx={{width:"100%"}}
                arial-label="absentee list"
                size="small"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Class</TableCell>
                        <TableCell align="right">Date</TableCell>
                    </TableRow>
                 </TableHead>
                 <TableBody>
                    {rows.map((row)=>(
                        <TableRow
                            // Key to be changed here 
                            key={row.d_name}
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
                                 {row.d_name}</TableCell>
                            <TableCell align="right">{row.d_class}</TableCell>
                            <TableCell align="right">{row.d_date}</TableCell>

                        </TableRow>
                    ))}
                 </TableBody>

            </Table>
        </TableContainer>
    )
}