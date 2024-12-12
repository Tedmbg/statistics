// src/pages/LoginPage/LoginScreen.jsx
import { useContext, useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Urim_logo.png";
import video from "../../assets/urim logging.mp4";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const DEFAULT_EMAIL = "admin@benchInc.com";
  const DEFAULT_PASSWORD = "123";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Check credentials
    if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
      login(); // Sets isLoggedIn to true
      navigate("/dashboard"); // Redirect to dashboard
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Grid container sx={{ height: "100vh", backgroundColor: "black" }}>
      {/* Video Section (left) */}
      <Grid
        item
        xs={12}
        md={6}
        sm={0}
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

      {/* Form Section (right) */}
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
            style={{ maxWidth: "100%", height: "auto" }}
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
            <Typography variant="body2" color="error" sx={{ marginBottom: "1rem" }}>
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
              sx={{
                backgroundColor: "#896801",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#896801",
                },
              }}
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
