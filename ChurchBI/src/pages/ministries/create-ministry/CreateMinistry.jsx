
import { Box, Grid, Card, Typography, TextField, Button, Avatar, InputAdornment, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Import JSON data
import ministryGroups from '../../../data/ministryGroups.json'
import worshipMinistry from '../../../data/worshipMinistry.json';

export default function Ministry() {
  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f4f4f4" }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>Ministry</Typography>

      <Grid container spacing={2}>
        {/* Left Section - Form and Table */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {/* Form Section */}
            <Grid item xs={6}>
              <TextField fullWidth label="Ministry Name" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ministry Leader"
                variant="outlined"
                select
                defaultValue="John Juma"
              >
                <MenuItem value="John Juma">John Juma</MenuItem>
                <MenuItem value="Jane Doe">Jane Doe</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#3A85FE",
                  color: "#FFF",
                  '&:hover': { backgroundColor: "#357AE8" },
                }}
                startIcon={<span>+</span>}
              >
                Add Ministry
              </Button>
            </Grid>
          </Grid>

          {/* Ministry Table */}
          <Box mt={3}>
            <Card sx={{ padding: "1rem", backgroundColor: "#FFF" }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Worship Ministry</Typography>
              <TableContainer component={Paper} sx={{ boxShadow: "none",  backgroundColor:"#FFF"}}>
                <Table aria-label="ministry list">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Date added</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {worshipMinistry.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ bgcolor: "#e0e0e0", width: 36, height: 36 }} />
                            <Typography variant="body2" fontWeight="500">
                              {row.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </Grid>

        {/* Right Section - Search and Ministry Groups */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ marginBottom: "1rem" }}
          />

          {/* Ministry Classes List */}
          <Card sx={{ padding: "1rem", backgroundColor: "#FFF" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Ministries</Typography>
            <Box>
              {ministryGroups.map((ministry, index) => (
                <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "#e0e0e0" }} />
                  <Box flexGrow={1} ml={1}>
                    <Typography variant="body1" fontWeight="bold">{ministry.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {ministry.leader} - {ministry.label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
