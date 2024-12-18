import { useState, useEffect } from "react";

import { fetchDiscipleshipClasses } from "../../../data/discipleship";
import { Box, Typography, TextField, MenuItem } from "@mui/material";

const AttendanceTracker = () => {
  const styles = {
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      padding: "24px",
      backgroundColor: "#f7f7f7",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
    },
    headerDate: {
      fontSize: "18px",
      color: "#555",
    },
    content: {
      padding: "24px",
      flex: 1,
      overflowY: "auto",
    },
    tableHeader: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: "16px",
      padding: "12px 16px",
      fontWeight: "600",
      color: "#4a5568",
      marginBottom: "12px",
      backgroundColor: "#f7f7f7",
      position: "sticky",
      top: 0,
    },
    row: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: "16px",
      padding: "12px 16px",
      alignItems: "center",
      marginBottom: "8px",
      borderRadius: "6px",
      transition: "background-color 0.2s",
    },
    name: {
      fontWeight: "500",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
    },
    button: {
      padding: "8px 16px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s",
      fontSize: "16px",
      fontWeight: "600",
      width: "100px", // Fixed width for consistency
    },
    summary: {
      marginTop: "24px",
      padding: "16px",
      backgroundColor: "#f7f7f7",
      borderRadius: "6px",
      position: "sticky",
      bottom: 0,
      boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.05)",
    },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
      marginTop: "8px",
    },
    mainContainer: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#ffffff",
    },
  };

  const initialStudents = [
    { id: 1, name: "John Muhiki", status: null },
    { id: 2, name: "Kim Lope", status: null },
    { id: 3, name: "Doiem Pemch", status: null },
    { id: 4, name: "Rachei Odnie", status: null },
    { id: 5, name: "Siend Frow", status: null },
    { id: 6, name: "Wonf Dropse", status: null },
    { id: 7, name: "Kim Lope", status: null },
    { id: 8, name: "Doiem Pemch", status: null },
    { id: 9, name: "Rachei Odnie", status: null },
    { id: 10, name: "Siend Frow", status: null },
    { id: 11, name: "Wonf Dropse", status: null },
    { id: 12, name: "Kim Lope", status: null },
    { id: 13, name: "Doiem Pemch", status: null },
    { id: 14, name: "Rachei Odnie", status: null },
    { id: 15, name: "Siend Frow", status: null },
    { id: 16, name: "Wonf Dropse", status: null },
    { id: 17, name: "Kim Lope", status: null },
    { id: 18, name: "Doiem Pemch", status: null },
    { id: 19, name: "Rachei Odnie", status: null },
    { id: 20, name: "Siend Frow", status: null },
    { id: 21, name: "Wonf Dropse", status: null },
    // ... more students
  ];

  const [students, setStudents] = useState(initialStudents);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const markAttendance = (studentId, status) => {
    setStudents(
      students.map((student) => {
        if (student.id === studentId) {
          const newStatus = student.status === status ? null : status;
          return { ...student, status: newStatus };
        }
        return student;
      })
    );
  };

  const getRowStyle = (status) => {
    const baseStyle = { ...styles.row };
    switch (status) {
      case "present":
        baseStyle.backgroundColor = "#f0fdf4";
        break;
      case "absent":
        baseStyle.backgroundColor = "#fef2f2";
        break;
      default:
        baseStyle.backgroundColor = "#ffffff";
    }
    return baseStyle;
  };

  const [classes, setClasses] = useState([]); // Store fetched class data
  const [selectedClass, setSelectedClass] = useState(null); // Store selected class_id
  const [classDetails, setClassDetails] = useState({});

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await fetchDiscipleshipClasses(); // Fetch class data
        setClasses(data); // Set class data
        if (data.length > 0) {
          setSelectedClass(data[0].class_id); // Set default selected class to class_id
          // Removed setClassDetails(data[0])
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const selected = classes.find((cls) => cls.class_id === selectedClass);
      setClassDetails(selected || {});
      // Mock student data (replace with API call if needed)
      setStudents([
        { id: 1, name: "Student 1", status: "present" },
        { id: 2, name: "Student 2", status: "absent" },
        { id: 3, name: "Student 3", status: "present" },
      ]);
    }
  }, [selectedClass, classes]);

  const getButtonStyle = (studentStatus, buttonType) => {
    const baseStyle = { ...styles.button };
    if (studentStatus === buttonType) {
      if (buttonType === "present") {
        baseStyle.backgroundColor = "#dcfce7";
        baseStyle.color = "#16a34a";
      } else {
        baseStyle.backgroundColor = "#fee2e2";
        baseStyle.color = "#dc2626";
      }
    } else {
      baseStyle.backgroundColor = "#f7f7f7";
      baseStyle.color = "#9ca3af";
    }
    baseStyle.hover = {
      transform: "scale(1.02)",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    };
    return baseStyle;
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.container}>
        <Box sx={styles.header}>
          <Box>
            <Typography variant="h6" sx={styles.headerTitle}>
              Attendance
            </Typography>
          </Box>

          {/* Material UI Dropdown */}
          <TextField
            select
            label="Select Class"
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(Number(e.target.value))}
            sx={{ width: "250px" }}
            variant="outlined"
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 200, // Height of 5 items (around 40px/item)
                    overflowY: "auto", // Enable scroll
                  },
                },
              },
            }}
          >
            {classes.map((cls) => (
              <MenuItem key={cls.class_id} value={cls.class_id}>
                {cls.class_name}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="body2" sx={styles.headerDate}>
            {currentDate}
          </Typography>
        </Box>

        <div style={styles.content}>
          <div style={styles.tableHeader}>
            <div>Name</div>
            <div style={{ textAlign: "center" }}>Present</div>
            <div style={{ textAlign: "center" }}>Absent</div>
          </div>

          {students.map((student) => (
            <div key={student.id} style={getRowStyle(student.status)}>
              <div style={styles.name}>{student.name}</div>
              <div style={styles.buttonContainer}>
                <button
                  onClick={() => markAttendance(student.id, "present")}
                  style={getButtonStyle(student.status, "present")}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  ✓
                </button>
              </div>
              <div style={styles.buttonContainer}>
                <button
                  onClick={() => markAttendance(student.id, "absent")}
                  style={getButtonStyle(student.status, "absent")}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  ✗
                </button>
              </div>
            </div>
          ))}

          {/* Class Details Section */}
          <div style={{ marginTop: "1rem", color: "#4a5568", fontSize: "14px" }}>
            <h3 style={{ marginBottom: "0.5rem" }}>Class Summary</h3>
            <div>
              <strong>Class Name:</strong> {classDetails.class_name || "N/A"}
            </div>
            <div>
              <strong>Instructor:</strong> {classDetails.instructor || "N/A"}
            </div>
            <div style={{ marginTop: "1rem" }}>
              <strong>Summary:</strong>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <div>Total Students: {students.length}</div>
                <div>
                  Present: {students.filter((s) => s.status === "present").length}
                </div>
                <div>
                  Absent: {students.filter((s) => s.status === "absent").length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
