import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(d_name,d_class,d_date){
    return {d_name,d_class,d_date}
}

const rows = [
    createData('krelo Pjend','class 6','Thur 19 Sep 2024'),
    createData('Joseph Pjend','class 5','Thur 19 Sep 2024'),
    createData('Juma John','class 9','Thur 19 Nov 2024'),
    createData('krelo Pjend','class 6','Thur 19 Sep 2024'),
  ];

export default function AbsenteeList(){
    return (
        <TableContainer component={Paper}>

        </TableContainer>
    )
}