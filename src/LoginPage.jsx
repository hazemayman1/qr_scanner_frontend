import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    setLoading(true);
    setError("");

    // Make API request to authenticate
    fetch("https://nxt-qr-scanner.onrender.com/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access) {
          // Store JWT token in localStorage or Context API
          localStorage.setItem("token", data.access);
          navigate(`/scan?user_id=${userId}`); // Redirect to dashboard or main page
        } else {
          setError("Invalid credentials. Please try again.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("An error occurred. Please try again later.");
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        width: 300,
        margin: "auto",
        padding: 2,
        backgroundColor: "#f9f9f9",
        borderRadius: 1,
        boxShadow: 2,
      }}
    >
      <Box sx={{ mb: 4 }}>
        <img
          src="src/assets/kmt.png" // Replace with your logo path
          alt="Logo"
          style={{ width: "300px", height: "auto" }} // Adjust width as needed
        />
      </Box>
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>

      {/* Error Message */}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>
    </Box>
  );
}

export default LoginPage;
