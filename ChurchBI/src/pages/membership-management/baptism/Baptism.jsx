import { 
  Box, 
  Typography, 
  useTheme, 
  CircularProgress, 
  Button 
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import BarChart from "../../../components/BarChart";
import CardThreeRow from "../../../components/CardThreeRow";

const barOptions = {
  responsive: true,
  plugins: {
    tooltip: { enabled: true },
    legend: {
      position: "bottom",
    },
  },
  scales: {
    x: { stacked: true },
    y: {
      stacked: true,
      beginAtZero: true,
      title: { display: true, text: "%" },
    },
  },
};

function Baptism() {
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize the navigate hook
  const [baptismCount, setBaptismCount] = useState(null);
  const [baptismData, setBaptismData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch total baptisms
        const countResponse = await fetch(
          "https://statistics-production-032c.up.railway.app/api/baptisms/count"
        );
        const countData = await countResponse.json();
        setBaptismCount(countData.total_baptisms);

        // Fetch baptism data for the selected year
        const dataResponse = await fetch(
          `https://statistics-production-032c.up.railway.app/api/baptisms/monthly?year=${selectedYear}`
        );
        const data = await dataResponse.json();
        setBaptismData(data);
      } catch (error) {
        console.error("Error fetching baptism data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]); // Refetch when selectedYear changes

  const baptismBarData = {
    labels: baptismData.map((item) => item.month),
    datasets: [
      {
        label: "Male",
        data: baptismData.map((item) => item.male_count),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Female",
        data: baptismData.map((item) => item.female_count),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
      },
    ],
  };

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear); // Update the selected year
  };

  const handleAddMember = () => {
    navigate("/addMember"); // Navigate to AddMemberForm
  };

  return (
    <div style={{ padding: "0 1rem" }}>
      {/* Top Header */}
      <Box
        sx={{
          position: "sticky",
          top: "0",
          left: "0",
          padding: "1rem 0",
          backgroundColor: "#D9D9D9",
        }}
      >
        <Typography variant="h4">Baptism</Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          [theme.breakpoints.up("md")]: {
            display: "grid",
            marginTop: "2rem",
            gap: "2rem",
            gridTemplateColumns: "2fr 1fr",
            padding: "0.5rem 0",
          },
        }}
      >
        {isLoading ? (
          <CircularProgress style={{ margin: "0 auto" }} />
        ) : (
          <>
            <Box sx={{ maxWidth: "60rem", marginBottom: "1rem" }}>
              {/* Pass data and options to the BarChart */}
              <BarChart
                data={baptismBarData}
                options={barOptions}
                title="Monthly Baptism Data"
                onDateChange={handleYearChange}
                selectedDate={selectedYear}
                height={400}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4em",
              }}
            >
              <CardThreeRow text="Total Members" number={baptismCount || 0} />

              <div>
                <Button
                  variant="outlined"
                  onClick={handleAddMember} // Call the navigation function
                  sx={{
                    backgroundColor: "#3a85fe",
                    padding: "1rem 1.5rem",
                    marginBottom: "2rem",
                    color: "#fff",
                    textTransform: "capitalize",
                  }}
                >
                  Add Member
                </Button>
              </div>
            </Box>
          </>
        )}
      </Box>
    </div>
  );
}

export default Baptism;
