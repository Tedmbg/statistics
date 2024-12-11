import  { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { fetchAbsenteesList } from "../../../data/discipleship";

export default function AbsenteeList() {
  const [rows, setRows] = useState([]); // State to hold absentee data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const loadAbsentees = async () => {
      try {
        const data = await fetchAbsenteesList(); // Fetch data from API
        setRows(data); // Update rows with fetched data
      } catch (err) {
        setError("Failed to fetch absentee data."); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    loadAbsentees();
  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: "100%",
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
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={2}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center" p={2}>
          {error}
        </Typography>
      ) : (
        <Table sx={{ width: "100%" }} aria-label="absentee list" size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Month</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Total Absentees</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Male</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>Female</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <TableCell>{row.month}</TableCell>
                <TableCell>{row.total_absentees}</TableCell>
                <TableCell>{row.male_absentees}</TableCell>
                <TableCell>{row.female_absentees}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
