import { Box, Card, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";

function AddMemberForm() {
  return (
    <Box sx={{ padding: '2rem', backgroundColor: '#e0e0e0' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Add People to ICC BI System
      </Typography>
      <Grid container spacing={2}>
        {/* Personal Information Section */}
        <Grid item xs={12} md={12}>
          <Card sx={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Typography variant="h6">Personal Information</Typography>
            <Box sx={{ marginTop: '1rem' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="First Name" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Middle Name" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Last Name" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="DOB" type="date" InputLabelProps={{ shrink: true }} variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Contact Info (+254)" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Demographics Section */}
        <Grid item xs={12} md={12}>
          <Card sx={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Typography variant="h6">Demographics</Typography>
            <Box sx={{ marginTop: '1rem' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
                    <InputLabel>Gender</InputLabel>
                    <Select label="Gender">
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Residence" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="County of Origin" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
                    <InputLabel>Occupation Status</InputLabel>
                    <Select label="Occupation Status">
                      <MenuItem value="Employed">Employed</MenuItem>
                      <MenuItem value="Unemployed">Unemployed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
                    <InputLabel>Marriage Status</InputLabel>
                    <Select label="Marriage Status">
                      <MenuItem value="Married">Married</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
                    <InputLabel>Visitors</InputLabel>
                    <Select label="Occupation Status">
                      <MenuItem value="Employed">Just Visiting</MenuItem>
                      <MenuItem value="Unemployed">Aspiring member</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Next of Kin Section */}
        <Grid item xs={12} md={12}>
          <Card sx={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Typography variant="h6">Next of Kin</Typography>
            <Box sx={{ marginTop: '1rem' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="First Name" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Last Name" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Contact Info (+254)" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* General Info Section */}
        <Grid item xs={12} md={12}>
          <Card sx={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Typography variant="h6">General Info</Typography>
            <Box sx={{ marginTop: '1rem' }}>
              <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ borderRadius: '8px', backgroundColor: '#ffffff', height: '55px'}}
                    >
                      <Typography variant="body1" sx={{ fontSize: '1.2rem' }}> {/* Increase text size */}
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                          <input 
                            type="checkbox" 
                            style={{ width: '20px', height: '20px', transform: 'scale(1.5)', marginRight: '8px', marginTop: '15px',marginLeft:'16px', textAlign:'justify'}} // Increase checkbox size
                          /> 
                          In Fellowship Ministry?
                        </label>
                      </Typography>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ borderRadius: '8px', backgroundColor: '#ffffff', height: '55px'}}
                    >
                      <Typography variant="body1" sx={{ fontSize: '1.2rem' }}> {/* Increase text size */}
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                          <input 
                            type="checkbox" 
                            style={{ width: '20px', height: '20px', transform: 'scale(1.5)', marginRight: '8px', marginTop: '15px',marginLeft:'16px', textAlign:'justify'}} // Increase checkbox size
                          /> 
                          In Service Ministry?
                        </label>
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ borderRadius: '8px', backgroundColor: '#ffffff', height: '55px'}}
                    >
                      <Typography variant="body1" sx={{ fontSize: '1.2rem' }}> {/* Increase text size */}
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                          <input 
                            type="checkbox" 
                            style={{ width: '20px', height: '20px', transform: 'scale(1.5)', marginRight: '8px', marginTop: '15px',marginLeft:'16px', textAlign:'justify'}} // Increase checkbox size
                          /> 
                         Is a Full Member?
                        </label>
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ borderRadius: '8px', backgroundColor: '#ffffff', height: '55px'}}
                    >
                      <Typography variant="body1" sx={{ fontSize: '1.2rem' }}> {/* Increase text size */}
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                          <input 
                            type="checkbox" 
                            style={{ width: '20px', height: '20px', transform: 'scale(1.5)', marginRight: '8px', marginTop: '15px',marginLeft:'16px', textAlign:'justify'}} // Increase checkbox size
                          /> 
                         Baptised?
                        </label>
                      </Typography>
                    </FormControl>
                  </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
  <Card sx={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'transparent', boxShadow: 'none' }}>
    <Box sx={{ marginTop: '1rem' }}>
      <Grid container spacing={2}>
        {/* Discipleship Class */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Discipleship Class</Typography>
          <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff', marginTop: '1rem' }}>
            <InputLabel>None</InputLabel>
            <Select label="Discipleship Class">
              <MenuItem value="Group 345B">Group 345B</MenuItem>
              <MenuItem value="Group 456Y">Group 456Y</MenuItem>
              <MenuItem value="Group 789Z">Group 789Z</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Completed Class */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Completed Class</Typography>
          <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff', marginTop: '1rem' }}>
            <InputLabel>Completed</InputLabel>
            <Select label="Completed Class">
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  </Card>
</Grid>
<Grid item xs={12} md={12}>
  <Card sx={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'transparent', boxShadow: 'none' }}>
    <Box sx={{ marginTop: '1rem' }}>
    <Grid item xs={12} md={6}>
          <Typography variant="h6">Volunteering</Typography>
          <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff', marginTop: '1rem' }}>
            <InputLabel>Ministry</InputLabel>
            <Select label="Discipleship Class">
              <MenuItem value="Group 345B">Teens</MenuItem>
              <MenuItem value="Group 456Y">Sound</MenuItem>
              <MenuItem value="Group 789Z">Ushering</MenuItem>
            </Select>
          </FormControl>
        </Grid>
    </Box>
  </Card>
</Grid>


        
    
      </Grid>
      <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
        <Button variant="contained"  sx={{ padding: '0.5rem 2rem', backgroundColor:"#3a85fe" }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default AddMemberForm;
