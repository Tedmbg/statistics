import { Box, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import BarChart from "../../../components/BarChart";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CardThreeRow from "../../../components/CardThreeRow";
import { useEffect, useState } from "react";

const barOptions = {
  responsive: true,
  plugins: {
    tooltip: { enabled: true },
    legend: {
      position: 'bottom',
    }
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
  const [baptismCount, setBaptismCount] = useState(null);
  const [baptismData, setBaptismData] = useState([]);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const theme = useTheme();

  // Combined loading state
  const isLoading = isLoadingCount || isLoadingData;

  useEffect(() => {
    setIsLoadingCount(true);
    fetch("https://statistics-production-032c.up.railway.app/api/baptisms/count")
      .then((res) => res.json())
      .then((data) => {
        setBaptismCount(data.total_baptisms);
        setIsLoadingCount(false);
      })
      .catch(() => setIsLoadingCount(false)); // stop loading on error
  }, []);

  useEffect(() => {
    setIsLoadingData(true);
    fetch("https://statistics-production-032c.up.railway.app/api/baptisms/monthly")
      .then((res) => res.json())
      .then((data) => {
        setBaptismData(data);
        setIsLoadingData(false);
      })
      .catch(() => setIsLoadingData(false)); // stop loading on error
  }, []);

  const baptismBarData = {
    labels: baptismData.map((label) => label.month),
    datasets: [
      {
        label: "Male",
        data: baptismData.map((data) => data.male_count),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Female",
        data: baptismData.map((data) => data.female_count),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
      },
    ],
  };

  return (
    <div style={{ padding: "0 1rem" }}>
      {/* top header */}
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

      {/* main content */}
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
          <CircularProgress style={{margin:"0 auto"}} />
        ) : (
          <>
            <Box sx={{ maxWidth: "60rem", marginBottom: "1rem" }}>
              <BarChart data={baptismBarData} options={barOptions} height={400} />
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
                  startIcon={<AddCircleIcon sx={{ color: "white" }} />}
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
