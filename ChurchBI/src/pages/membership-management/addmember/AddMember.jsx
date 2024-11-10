import { Box, Card, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import {  Trash2 } from 'lucide-react';
import { useState } from 'react'
import PropTypes from 'prop-types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function AddMemberForm({ initialData }) {
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [members, setMembers] = useState()
  const [selectedMinistry, setSelectedMinistry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const ministryData = {
  "Fellowship Ministry": {
    categories: {
      "Age-Based Fellowships": ["Youth Group Leader", "Senior Group Leader", "Member"],
      "Small Groups": ["Bible Study Leader", "Prayer Group Leader", "Member"],
      "New Member Integration": ["Hospitality Coordinator", "Follow-Up Coordinator", "Member"],
    },
  },
  "Service Ministry": {
    categories: {
      "Ushering and Hospitality": ["Usher", "Greeter", "Member"],
      "Music and Worship": ["Choir Member", "Worship Leader", "Member"],
      "Media and Technology": ["Audio Technician", "Livestream Operator", "Member"],
    },
  },
};

const handleMinistryChange = (event) => {
  setSelectedMinistry(event.target.value);
  setSelectedCategory(""); // Reset category when ministry changes
  setSelectedRole(""); // Reset role when ministry changes
};

const handleCategoryChange = (event) => {
  setSelectedCategory(event.target.value);
  setSelectedRole(""); // Reset role when category changes
};


  const handleDeleteMember = (member) => {
    setMemberToDelete(member)
  }

  const confirmDeleteMember = () => {
    if (memberToDelete) {
      setMembers(members.filter(m => m.id !== memberToDelete.id))
      setMemberToDelete(null)
    }
  }
  return (
    <Box>
            {initialData && (
                <Grid container justifyContent="flex-end" alignItems="center" sx={{ marginBottom: '1rem' }}>
                <Grid item>
                  <Button
                    variant="ghost"
                    onClick={handleDeleteMember}
                    sx={{ marginBottom: '1rem', marginLeft: { xs: 'auto', sm: 'auto', md: '96rem' } }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </Grid>
              </Grid>
            )}
      <Typography variant="h5" gutterBottom align="center">
                {initialData ? 'Edit Member Details' : 'Add People to ICC BI System'}
            </Typography>
            <Grid container spacing={2}>
                {/* Personal Information Section */}
                <Grid item xs={12} md={12}>
                    <Card sx={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'transparent', boxShadow: 'none' }}>
                        <Typography variant="h6">Personal Information</Typography>
                        <Box sx={{ marginTop: '1rem' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="First Name" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} defaultValue={initialData?.firstName || ''} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Middle Name" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} defaultValue={initialData?.middleName || ''} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Last Name" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} defaultValue={initialData?.lastName || ''} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="DOB" type="date" InputLabelProps={{ shrink: true }} variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} defaultValue={initialData?.dob || ''} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Contact Info (+254)" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} defaultValue={initialData?.contactInfo || ''} />
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
  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
    <InputLabel>Residence</InputLabel>
    <Select label="Residence">
      <MenuItem value="Zimmerman">Zimmerman</MenuItem>
      <MenuItem value="Kasarani">Kasarani</MenuItem>
      <MenuItem value="Garden Estate">Garden Estate</MenuItem>
      <MenuItem value="Roysambu">Roysambu</MenuItem>
      <MenuItem value="Githurai 44">Githurai 44</MenuItem>
      <MenuItem value="Clay City">Clay City</MenuItem>
      <MenuItem value="Thome">Thome</MenuItem>
      <MenuItem value="Ngumba">Ngumba</MenuItem>
      <MenuItem value="Kahawa">Kahawa</MenuItem>
      <MenuItem value="Kahawa Sukari">Kahawa Sukari</MenuItem>
      <MenuItem value="Mirema">Mirema</MenuItem>
      <MenuItem value="Ruaraka">Ruaraka</MenuItem>
    </Select>
  </FormControl>
</Grid>

                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="County of Origin" variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }} />
                </Grid>
                <Grid item xs={12} md={4}>
  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
    <InputLabel>Occupation</InputLabel>
    <Select label="Occupation">
      {/* General Status 
      Under each of the general types of occupation below are examples which can help guide the selection based on the occupation.*/}
     
     

      {/* Engineering and Technical Fields */}
      <MenuItem value="Engineering and Technical">Engineering and Technical</MenuItem>

      {/* Examples */}
      {/* <MenuItem value="Engineer">Engineer</MenuItem>
      <MenuItem value="Technician">Technician</MenuItem> */}

      {/* Medical and Healthcare */}
      <MenuItem value="Medical and Healthcare">Medical and Healthcare</MenuItem>

      {/* Examples */}
      {/* <MenuItem value="Doctor">Doctor</MenuItem>
      <MenuItem value="Nurse">Nurse</MenuItem>
      <MenuItem value="Pharmacist">Pharmacist</MenuItem>
      <MenuItem value="Healthcare Worker">Healthcare Worker</MenuItem> */}

      {/* Education */}
      <MenuItem value="Education">Education</MenuItem>

      {/* Examples
      <MenuItem value="Teacher">Teacher</MenuItem>
      <MenuItem value="Professor">Professor</MenuItem>
      <MenuItem value="Education Consultant">Education Consultant</MenuItem>
       */}
      

      {/* Business and Management */}
      <MenuItem value="Business and Management">Business and Management</MenuItem>

      {/* Examples
      <MenuItem value="Business Owner">Business Owner</MenuItem>
      <MenuItem value="Manager">Manager</MenuItem>
      <MenuItem value="Salesperson">Salesperson</MenuItem>
      <MenuItem value="Accountant">Accountant</MenuItem>
       */}

      {/* Information Technology */}
      <MenuItem value="Information Technology">Information Technology</MenuItem>

      {/* Examples 
      <MenuItem value="Software Developer">Software Developer</MenuItem>
      <MenuItem value="IT Specialist">IT Specialist</MenuItem>
      <MenuItem value="Data Analyst">Data Analyst</MenuItem>
      <MenuItem value="Cybersecurity Analyst">Cybersecurity Analyst</MenuItem>
      */}

      {/* Creative Arts */}
      <MenuItem value="Creative Arts">Creative Arts</MenuItem>

      {/* Examples 
      <MenuItem value="Designer">Designer</MenuItem>
      <MenuItem value="Photographer">Photographer</MenuItem>
      <MenuItem value="Writer">Writer</MenuItem>
      <MenuItem value="Musician">Musician</MenuItem>
      */}

      {/* Trades and Crafts */}
      <MenuItem value="Trades and Crafts">Trades and Crafts</MenuItem>

      {/* Examples 
      <MenuItem value="Electrician">Electrician</MenuItem>
      <MenuItem value="Plumber">Plumber</MenuItem>
      <MenuItem value="Mechanic">Mechanic</MenuItem>
      <MenuItem value="Carpenter">Carpenter</MenuItem>
      */}

      {/* Government and Law */}
      <MenuItem value="Government and Law">Government and Law</MenuItem>

      {/* Examples 
      <MenuItem value="Lawyer">Lawyer</MenuItem>
      <MenuItem value="Civil Servant">Civil Servant</MenuItem>
      <MenuItem value="Police Officer">Police Officer</MenuItem>
      <MenuItem value="Military Personnel">Military Personnel</MenuItem>
      */}

      {/* Others */}
      <MenuItem value="Student">Student</MenuItem>
      <MenuItem value="Retired">Retired</MenuItem>
      <MenuItem value="Unemployed">Unemployed</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </Select>
  </FormControl>
</Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
                    <InputLabel>Marriage Status</InputLabel>
                    <Select label="Marriage Status">
                      <MenuItem value="Married">Married</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="Divorced">Divorced</MenuItem>
                      <MenuItem value="Widowed">Widowed</MenuItem>
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
            <InputLabel>Class</InputLabel>
            <Select label="Discipleship Class">
            <MenuItem value="Group 345A">None</MenuItem>
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
    <Typography variant="h6" marginBottom={2.5}>Volunteering</Typography>
    <Grid container spacing={2}>
      
  {/* Ministry Dropdown */}
  <Grid item xs={12} md={4}>
    <FormControl fullWidth variant="outlined" sx={{ borderRadius: "8px", backgroundColor: "#ffffff" }}>
      <InputLabel>Ministry</InputLabel>
      <Select value={selectedMinistry} onChange={handleMinistryChange} label="Ministry">
        <MenuItem value="Fellowship Ministry">Fellowship Ministry</MenuItem>
        <MenuItem value="Service Ministry">Service Ministry</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  {/* Category Dropdown */}
  <Grid item xs={12} md={4}>
    <FormControl
      fullWidth
      variant="outlined"
      sx={{ borderRadius: "8px", backgroundColor: "#ffffff" }}
      disabled={!selectedMinistry}
    >
      <InputLabel>Category</InputLabel>
      <Select value={selectedCategory} onChange={handleCategoryChange} label="Category">
        {selectedMinistry &&
          Object.keys(ministryData[selectedMinistry].categories).map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  </Grid>

  {/* Role Dropdown */}
  <Grid item xs={12} md={4}>
    <FormControl
      fullWidth
      variant="outlined"
      sx={{ borderRadius: "8px", backgroundColor: "#ffffff" }}
      disabled={!selectedCategory}
    >
      <InputLabel>Role</InputLabel>
      <Select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        label="Role"
      >
        {selectedCategory &&
          ministryData[selectedMinistry].categories[selectedCategory].map((role, index) => (
            <MenuItem key={index} value={role}>
              {role}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  </Grid>
</Grid>

    </Box>
  </Card>
</Grid>


        
    
      </Grid>
      <Box sx={{ textAlign: 'right', marginTop: '2rem', marginRight: '1.9rem' }}>
        <Button variant="contained"  sx={{ padding: '0.5rem 2rem', backgroundColor:"#3a85fe" }}>
          Submit
        </Button>
      </Box>
   

      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the member
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMember}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>

  );
}

AddMemberForm.propTypes = {
  initialData: PropTypes.shape({
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    dob: PropTypes.string,
    contactInfo: PropTypes.string,
  }),
  onBack: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default AddMemberForm;
