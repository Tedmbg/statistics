import { useState } from 'react';

const AttendanceTracker = () => {
  const styles = {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      padding: '24px',
      backgroundColor: '#f7f7f7',
      borderBottom: '1px solid #e5e7eb',
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    },
    content: {
      padding: '24px',
      flex: 1,
      overflowY: 'auto',
    },
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gap: '16px',
      padding: '12px 16px',
      fontWeight: '600',
      color: '#4a5568',
      marginBottom: '12px',
      backgroundColor: '#f7f7f7',
      position: 'sticky',
      top: 0,
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gap: '16px',
      padding: '12px 16px',
      alignItems: 'center',
      marginBottom: '8px',
      borderRadius: '6px',
      transition: 'background-color 0.2s',
    },
    name: {
      fontWeight: '500',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    button: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      fontSize: '16px',
      fontWeight: '600',
      width: '100px', // Fixed width for consistency
    },
    summary: {
      marginTop: '24px',
      padding: '16px',
      backgroundColor: '#f7f7f7',
      borderRadius: '6px',
      position: 'sticky',
      bottom: 0,
      boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.05)',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginTop: '8px',
    },
    mainContainer: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
    }
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
    { id: 21, name: "Wonf Dropse", status: null }
  ];

  const [students, setStudents] = useState(initialStudents);

  const markAttendance = (studentId, status) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        const newStatus = student.status === status ? null : status;
        return { ...student, status: newStatus };
      }
      return student;
    }));
  };

  const getRowStyle = (status) => {
    const baseStyle = { ...styles.row };
    switch (status) {
      case 'present':
        baseStyle.backgroundColor = '#f0fdf4';
        break;
      case 'absent':
        baseStyle.backgroundColor = '#fef2f2';
        break;
      default:
        baseStyle.backgroundColor = '#ffffff';
    }
    return baseStyle;
  };

  const getButtonStyle = (studentStatus, buttonType) => {
    const baseStyle = { ...styles.button };
    if (studentStatus === buttonType) {
      if (buttonType === 'present') {
        baseStyle.backgroundColor = '#dcfce7';
        baseStyle.color = '#16a34a';
      } else {
        baseStyle.backgroundColor = '#fee2e2';
        baseStyle.color = '#dc2626';
      }
    } else {
      baseStyle.backgroundColor = '#f7f7f7';
      baseStyle.color = '#9ca3af';
    }
    baseStyle.hover = {
      transform: 'scale(1.02)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };
    return baseStyle;
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Class 1 Attendance</h2>
        </div>
        
        <div style={styles.content}>
          <div style={styles.tableHeader}>
            <div>Name</div>
            <div style={{ textAlign: 'center' }}>Present</div>
            <div style={{ textAlign: 'center' }}>Absent</div>
          </div>

          {students.map((student) => (
            <div key={student.id} style={getRowStyle(student.status)}>
              <div style={styles.name}>{student.name}</div>
              <div style={styles.buttonContainer}>
                <button
                  onClick={() => markAttendance(student.id, 'present')}
                  style={getButtonStyle(student.status, 'present')}
                  onMouseEnter={e => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ✓
                </button>
              </div>
              <div style={styles.buttonContainer}>
                <button
                  onClick={() => markAttendance(student.id, 'absent')}
                  style={getButtonStyle(student.status, 'absent')}
                  onMouseEnter={e => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ✗
                </button>
              </div>
            </div>
          ))}

          <div style={styles.summary}>
            <div style={{ color: '#4a5568', fontSize: '14px' }}>
              Summary:
              <div style={styles.summaryGrid}>
                <div>Total Students: {students.length}</div>
                <div>Present: {students.filter(s => s.status === 'present').length}</div>
                <div>Absent: {students.filter(s => s.status === 'absent').length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;