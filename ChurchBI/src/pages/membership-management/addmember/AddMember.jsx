// AddMemberForm.js

import { useReducer, useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Trash2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { fetchDiscipleshipClasses } from '../../../data/discipleship';

// Define the initial state
const initialState = {
  firstName: "",
  middleName: "",
  lastName: "",
  dob: "",
  contactInfo: "",
  gender: "",
  location: "",
  countyOfOrigin: "",
  occupationStatus: "",
  marriedStatus: "",
  isVisiting: false,
  isFullMember: false,
  baptized: false,
  discipleshipClassId: null,
  completedClass: false,
  fellowshipMinistryName: "", 
  fellowshipRole: "",
  serviceMinistryName: "",
  serviceRole: "",
  conversionDate: '',
  nextOfKin: {
    firstName: "",
    lastName: "",
    contactInfo: "",
  },
  volunteeringRole: '',
};

// Define the reducer function
function formReducer(state, action) {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      return {
        ...state,
        ...action.payload,
      };

    case 'UPDATE_IS_VISITING':
      return {
        ...state,
        isVisiting: action.value,
      };

    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };

    case 'UPDATE_NESTED_FIELD':
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          [action.nestedField]: action.value,
        },
      };

    default:
      return state;
  }
}

function AddMemberForm({ initialData, onBack, onSuccess }) {
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false); // State for Dialog

  const [formData, dispatch] = useReducer(formReducer, initialState);

  const [fellowshipMinistries, setFellowshipMinistries] = useState([]);
  const [serviceMinistries, setServiceMinistries] = useState([]);
  const [discipleshipClasses, setDiscipleshipClasses] = useState([]);

  useEffect(() => {
    // Fetch Fellowship Ministries
    fetch('https://statistics-production-032c.up.railway.app/api/ministries?type=Fellowship')
      .then(response => response.json())
      .then(data => setFellowshipMinistries(data))
      .catch(err => console.error('Error fetching fellowship ministries:', err));

    // Fetch Service Ministries
    fetch('https://statistics-production-032c.up.railway.app/api/ministries?type=Service')
      .then(response => response.json())
      .then(data => setServiceMinistries(data))
      .catch(err => console.error('Error fetching service ministries:', err));
  }, []);

  useEffect(() => {
    const loadDiscipleshipClasses = async () => {
      try {
        const classes = await fetchDiscipleshipClasses();
        setDiscipleshipClasses(classes); // Save the fetched classes
      } catch (error) {
        console.error("Failed to load discipleship classes:", error);
      }
    };

    loadDiscipleshipClasses();
  }, []);

  useEffect(() => {
    if (initialData) {
      const mappedData = {
        firstName: initialData.firstName || "",
        middleName: initialData.middleName || "",
        lastName: initialData.lastName || "",
        dob: initialData.dob || "",
        contactInfo: initialData.contactInfo || "",
        gender: initialData.gender || "",
        location: initialData.location || "",
        countyOfOrigin: initialData.countyOfOrigin || "",
        occupationStatus: initialData.occupationStatus || "",
        marriedStatus: initialData.marriedStatus || "",
        isVisiting: initialData.isVisiting || false,
        isFullMember: initialData.isFullMember || false,
        baptized: initialData.baptized || false,
        discipleshipClassId: initialData.discipleshipClassId || null,
        completedClass: initialData.completedClass || false,
        fellowshipMinistryName: initialData.fellowshipMinistryName || "",
        fellowshipRole: initialData.fellowshipRole || "",
        serviceMinistryName: initialData.serviceMinistryName || "",
        serviceRole: initialData.serviceRole || "",
        conversionDate: initialData.conversionDate || '',
        nextOfKin: {
          firstName: initialData.nextOfKinFirstName || '',
          lastName: initialData.nextOfKinLastName || '',
          contactInfo: initialData.nextOfKinContactInfo || '',
        },
      };
      dispatch({ type: 'SET_INITIAL_DATA', payload: mappedData });
    } else {
      // If adding a new member, reset to initialState
      dispatch({ type: 'SET_INITIAL_DATA', payload: initialState });
    }
  }, [initialData]);

  // Consolidated handleInputChange
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    let newValue;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (name === 'discipleshipClassId') {
      newValue = value ? parseInt(value, 10) : null;
    } else if (name === 'isVisiting') {
      newValue = value === 'true' || value === true;
    } else {
      newValue = value;
    }

    dispatch({
      type: name === 'isVisiting' ? 'UPDATE_IS_VISITING' : 'UPDATE_FIELD',
      field: name,
      value: newValue,
    });
  };

  // Disable 'Is a Full Member' checkbox when isVisiting is true
  const isFullMemberDisabled = formData.isVisiting;

  const handleSubmit = async () => {
    try {
      // Construct the volunteering array
      const volunteering = [];

      if (formData.fellowshipMinistryName && formData.fellowshipRole) {
        volunteering.push({
          ministry_type: 'Fellowship',
          ministry_name: formData.fellowshipMinistryName,
          role: formData.fellowshipRole,
        });
      }

      if (formData.serviceMinistryName && formData.serviceRole) {
        volunteering.push({
          ministry_type: 'Service',
          ministry_name: formData.serviceMinistryName,
          role: formData.serviceRole,
        });
      }

      // Construct the payload with correct field names
      const payload = {
        sir_name: formData.firstName, // Changed from 'first_name' to 'sir_name'
        middle_name: formData.middleName,
        last_name: formData.lastName,
        date_of_birth: formData.dob,
        contact_info: formData.contactInfo,
        gender: formData.gender,
        location: formData.location,
        county_of_origin: formData.countyOfOrigin,
        occupation_status: formData.occupationStatus,
        married_status: formData.marriedStatus,
        is_visiting: formData.isVisiting,
        is_full_member: formData.isFullMember,
        baptized: formData.baptized,
        conversion_date: formData.conversionDate || null,
        discipleship_class_id: formData.discipleshipClassId,
        completed_class: formData.completedClass,
        next_of_kin: {
          first_name: formData.nextOfKin.firstName || '',
          last_name: formData.nextOfKin.lastName || '',
          contact_info: formData.nextOfKin.contactInfo || '',
        },
        volunteering, // Now an array of volunteering entries
      };

      let response;
      if (initialData) {
        // Editing an existing member
        response = await axios.put(`https://statistics-production-032c.up.railway.app/api/members/${initialData.id}`, payload);
        console.log(`Member updated successfully with ID: ${response.data.memberId}`);
      } else {
        // Adding a new member
        response = await axios.post('https://statistics-production-032c.up.railway.app/api/members/add', payload);
        console.log(`Member added successfully with ID: ${response.data.memberId}`);
      }

      // Show confirmation dialog
      setConfirmationOpen(true);
      // Notify parent to refresh the member list
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      if (error.response) {
        console.error("Error submitting form:", error.response.data);
      } else {
        console.error("Error submitting form:", error.message);
      }
      alert("Failed to submit the form. Please try again.");
    }
  };

  const handleDeleteMember = () => {
    setMemberToDelete(initialData);
  };

  const confirmDeleteMember = async () => {
    if (memberToDelete) {
      try {
        await axios.delete(`https://statistics-production-032c.up.railway.app/api/members/${memberToDelete.id}`);
        setConfirmationOpen(false);
        setMemberToDelete(null);
        // Notify parent to refresh the member list
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error("Error deleting member:", error.response?.data || error.message);
        alert("Failed to delete member. Please try again.");
      }
    }
  };

  const handleDone = () => {
    setConfirmationOpen(false);
    // Navigate back or perform any additional actions
    if (onBack) onBack();
  };

  return (
    <Box>
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">
          {initialData ? 'Member Updated Successfully' : 'Member Added Successfully'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            The member has been successfully {initialData ? 'updated' : 'added'} to the ICC Church.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDone} color="primary" variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {initialData && (
        <Grid container justifyContent="flex-end" alignItems="center" sx={{ marginBottom: '1rem' }}>
          <Grid item>
            <Button
              variant="ghost"
              onClick={() => handleDeleteMember()}
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
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Middle Name"
                    variant="outlined"
                    sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="DOB"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Contact Info (+254)"
                    variant="outlined"
                    sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                  />
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
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      label="Gender"
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      {/* Add more options if needed */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
                    <InputLabel>Residence</InputLabel>
                    <Select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      label="Residence"
                    >
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
                  <TextField
                    fullWidth
                    label="County of Origin"
                    variant="outlined"
                    sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}
                    name="countyOfOrigin"
                    value={formData.countyOfOrigin}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
                    <InputLabel>Occupation</InputLabel>
                    <Select
                      name="occupationStatus"
                      value={formData.occupationStatus}
                      onChange={handleInputChange}
                      label="Occupation"
                    >
                      {/* Engineering and Technical Fields */}
                      <MenuItem value="Engineering and Technical">Engineering and Technical</MenuItem>

                      {/* Medical and Healthcare */}
                      <MenuItem value="Medical and Healthcare">Medical and Healthcare</MenuItem>

                      {/* Education */}
                      <MenuItem value="Education">Education</MenuItem>

                      {/* Business and Management */}
                      <MenuItem value="Business and Management">Business and Management</MenuItem>

                      {/* Information Technology */}
                      <MenuItem value="Information Technology">Information Technology</MenuItem>

                      {/* Creative Arts */}
                      <MenuItem value="Creative Arts">Creative Arts</MenuItem>

                      {/* Trades and Crafts */}
                      <MenuItem value="Trades and Crafts">Trades and Crafts</MenuItem>

                      {/* Government and Law */}
                      <MenuItem value="Government and Law">Government and Law</MenuItem>

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
                    <Select
                      name="marriedStatus"
                      value={formData.marriedStatus}
                      onChange={handleInputChange}
                      label="Marriage Status"
                    >
                      <MenuItem value="Married">Married</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="Divorced">Divorced</MenuItem>
                      <MenuItem value="Widowed">Widowed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  {/* Visitor Status Control */}
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
                    <InputLabel id="is-visiting-label">Visitor Status</InputLabel>
                    <Select
                      labelId="is-visiting-label"
                      name="isVisiting"
                      value={formData.isVisiting}
                      onChange={handleInputChange}
                      label="Visitor Status"
                    >
                      <MenuItem value={true}>Visiting</MenuItem>
                      <MenuItem value={false}>None</MenuItem>
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
                  <TextField
                    fullWidth
                    label="Next of Kin First Name"
                    variant="outlined"
                    sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}
                    name="firstName"
                    value={formData.nextOfKin.firstName}
                    onChange={(e) => handleInputChange(e)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Next of Kin Last Name"
                    variant="outlined"
                    sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}
                    name="lastName"
                    value={formData.nextOfKin.lastName}
                    onChange={(e) => handleInputChange(e)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Next of Kin Contact Info"
                    variant="outlined"
                    sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}
                    name="contactInfo"
                    value={formData.nextOfKin.contactInfo}
                    onChange={(e) => handleInputChange(e)}
                  />
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
                {/* Is a Full Member */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff', height: '55px' }}>
                    <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          style={{
                            width: '20px',
                            height: '20px',
                            transform: 'scale(1.5)',
                            marginRight: '8px',
                            marginTop: '15px',
                            marginLeft: '16px',
                          }}
                          name="isFullMember"
                          checked={formData.isFullMember}
                          onChange={handleInputChange}
                          disabled={isFullMemberDisabled}
                        />
                        Is a Full Member?
                      </label>
                    </Typography>
                  </FormControl>
                </Grid>
                {/* Baptized */}
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff', height: '55px' }}>
                    <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          style={{
                            width: '20px',
                            height: '20px',
                            transform: 'scale(1.5)',
                            marginRight: '8px',
                            marginTop: '15px',
                            marginLeft: '16px',
                          }}
                          name="baptized"
                          checked={formData.baptized}
                          onChange={handleInputChange}
                        />
                        Baptized?
                      </label>
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Discipleship Class and Completed Class */}
        <Grid item xs={12} md={12}>
          <Card sx={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Box sx={{ marginTop: '1rem' }}>
              <Grid container spacing={2}>
                {/* Discipleship Class */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Discipleship Class</Typography>
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: "8px", backgroundColor: "#ffffff", marginTop: "1rem" }}>
                    <InputLabel>Discipleship Class</InputLabel>
                    <Select
                      name="discipleshipClassId"
                      label="Discipleship Class"
                      value={formData.discipleshipClassId || ""}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="">None</MenuItem>
                      {discipleshipClasses.map((cls) => (
                        <MenuItem key={cls.class_id} value={cls.class_id}>
                          {cls.class_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Completed Class */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Completed Class</Typography>
                  <FormControl fullWidth variant="outlined" sx={{ borderRadius: '8px', backgroundColor: '#ffffff', marginTop: '1rem' }}>
                    <InputLabel>Completed</InputLabel>
                    <Select
                      name="completedClass"
                      label="Completed Class"
                      value={formData.completedClass ? "Yes" : "No"}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_FIELD',
                          field: "completedClass",
                          value: e.target.value === "Yes",
                        })
                      }
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Volunteering Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Typography variant="h6" gutterBottom align="center">
              Volunteering
            </Typography>
            <Grid container spacing={4}>

              {/* Fellowship Ministry Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
                  Fellowship Ministry
                </Typography>
                <FormControl fullWidth variant="outlined" sx={{ borderRadius: "8px", backgroundColor: "#ffffff", marginBottom: "1rem"  }}>
                  <InputLabel>Ministry</InputLabel>
                  <Select
                    name="fellowshipMinistryName"
                    value={formData.fellowshipMinistryName}
                    onChange={handleInputChange}
                    label="Ministry"
                  >
                    {fellowshipMinistries.map((ministry) => (
                      <MenuItem key={ministry} value={ministry}>
                        {ministry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  name="fellowshipRole"
                  label="Role"
                  variant="outlined"
                  fullWidth
                  value={formData.fellowshipRole}
                  onChange={handleInputChange}
                  sx={{ backgroundColor: "#ffffff", marginBottom: "1rem" }}
                />
              </Grid>

              {/* Service Ministry Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
                  Service Ministry
                </Typography>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ borderRadius: "8px", backgroundColor: "#ffffff", marginBottom: "1rem" }}
                >
                  <InputLabel>Ministry</InputLabel>
                  <Select
                    name="serviceMinistryName"
                    value={formData.serviceMinistryName}
                    onChange={handleInputChange}
                    label="Ministry"
                  >
                    {serviceMinistries.map((ministry) => (
                      <MenuItem key={ministry} value={ministry}>
                        {ministry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Role as a TextField */}
                <TextField
                  name="serviceRole"
                  label="Role"
                  variant="outlined"
                  fullWidth
                  value={formData.serviceRole}
                  onChange={handleInputChange}
                  sx={{ backgroundColor: "#ffffff" }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Submit Button */}
      <Box sx={{ textAlign: 'right', marginTop: '2rem', marginRight: '1.9rem' }}>
        <Button
          variant="contained"
          sx={{ padding: '0.5rem 2rem', backgroundColor: "#3a85fe" }}
          onClick={handleSubmit}
        >
          {initialData ? 'Update Member' : 'Submit'}
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the member from the database.
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
    id: PropTypes.number, 
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    dob: PropTypes.string,
    contactInfo: PropTypes.string,
    gender: PropTypes.string,
    location: PropTypes.string,
    countyOfOrigin: PropTypes.string,
    occupationStatus: PropTypes.string,
    marriedStatus: PropTypes.string,
    isVisiting: PropTypes.bool,
    isFullMember: PropTypes.bool,
    baptized: PropTypes.bool,
    discipleshipClassId: PropTypes.number,
    completedClass: PropTypes.bool,
    fellowshipMinistryName: PropTypes.string,
    fellowshipRole: PropTypes.string,
    serviceMinistryName: PropTypes.string,
    serviceRole: PropTypes.string,
    conversionDate: PropTypes.string,
    nextOfKinFirstName: PropTypes.string,
    nextOfKinLastName: PropTypes.string,
    nextOfKinContactInfo: PropTypes.string,
    volunteeringRole: PropTypes.string,
  }),
  onBack: PropTypes.func.isRequired,
  onSuccess: PropTypes.func, // New prop
};

export default AddMemberForm;
