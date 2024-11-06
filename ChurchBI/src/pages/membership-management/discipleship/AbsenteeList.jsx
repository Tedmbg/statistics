
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Typography, Box } from "@mui/material";

function createData(d_name, d_class, d_date) {
    return { d_name, d_class, d_date };
}

const rows = [
    createData("Krelo Pjend", "Class 6", "Thu 19 Sep, 2024"),
    createData("Krelo Pjend", "Class 5", "Fri 30 June, 2024"),
    createData("Krelo Pjend", "Class 7", "Sat 2 April, 2024"),
    createData("Krelo Pjend", "Class 2", "Tue 13 March, 2024"),
];

export default function AbsenteeList() {
    return (
        <TableContainer
            component={Paper}
            sx={{
                maxWidth: "100%", // Make it full-width to match the image
                borderRadius: "8px",
                boxShadow: "none",
                border: "1px solid #e0e0e0",
                backgroundColor: "#f9f9f9",
            }}
        >
            <Typography
                sx={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    padding: "1rem",
                    borderBottom: "1px solid #e0e0e0",
                    color: "#333",
                }}
            >
                Absentees List
            </Typography>
            <Table sx={{ width: "100%" }} aria-label="absentee list" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Class</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                borderBottom: "1px solid #e0e0e0",
                            }}
                        >
                            <TableCell component="th" scope="row">
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar sx={{ width: 36, height: 36, bgcolor: "#e0e0e0" }} />
                                    <Typography variant="body2" fontWeight="500">
                                        {row.d_name}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>{row.d_class}</TableCell>
                            <TableCell>{row.d_date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
