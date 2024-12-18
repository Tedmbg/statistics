// src/components/LoginScreen.jsx
import { useContext, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Urim_logo.png";
import video from "../../assets/urim_logging.mp4";
import axios from "axios";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log("Login started");

    try {
      const response = await axios.post(
        "https://statistics-production-032c.up.railway.app/api/users/login",
        { email, password }
      );

      const { token, role, user_id } = response.data.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", user_id);

      login();
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
      console.log("Login ended");
    }
  };

  return (
    <Grid container sx={{ height: "100vh", backgroundColor: "black" }}>
      {/* Video Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "20px",
          display: { xs: "none", md: "block" },
        }}
      >
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src={video} type="video/mp4" />
        </video>
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            color: "#fff",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
          }}
        />
      </Grid>

      {/* Login Form Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "black",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "100%", height: "auto", marginBottom: "1rem" }}
          />
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Login
          </Typography>

          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{ marginBottom: "1rem" }}
            >
              {error}
            </Typography>
          )}

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                },
                "& .MuiInputLabel-root": {
                  color: "#aaa",
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                backgroundColor: "#333",
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                },
                "& .MuiInputLabel-root": {
                  color: "#aaa",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              aria-busy={loading}
              aria-disabled={loading}
              sx={{
                backgroundColor: loading ? "#1977D2" : "#896801",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                height: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  backgroundColor: loading ? "#1977D2" : "#9D7C02",
                },
              }}
            >
              {loading ? (
                <Box display="flex" alignItems="center"  justifyContent="center">
                  <CircularProgress
                    size={40}
                    sx={{
                      color: "#FFD700", // Custom Gold color
                    }}
                  />

                  <Typography sx={{ marginLeft: "0.5rem" }}>
                    Signing in...
                  </Typography>
                </Box>
              ) : (
                "Sign in"
              )}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
