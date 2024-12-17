import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, IconButton } from "@mui/material";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'; // PlayPal symbol
import axios from "axios"; // For making API calls
import "../styles/signin.css";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // To redirect users after login

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      const response = await axios.post("http://localhost:5000/api/signin", {
        email,
        password,
      });

    //   console.log(response.data);
    //   alert("Sign In successful!");
    //   navigate("/dashboard"); // Redirect to dashboard or another page
    // } catch (error) {
    //   console.error(error);
    //   setError(error.response?.data?.message || "Invalid credentials or server error");
    // }
        const { token, message } = response.data;

        // Save the token in localStorage
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("userName", response.data.user.name);  // Store the user's name
          console.log("Token: ", token);
          alert(message || "Sign In successful!");
          navigate("/homepage"); // Redirect to dashboard or another page
        } else {
          throw new Error("Authentication failed. No token received.");
        }
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || "Invalid credentials or server error");
      }
  };

  return (
    <Box className="signin-page-container">
      <Box className="signin-form-container">
        {/* PlayPal Logo and Symbol */}
        <div className="playpal-logo">
          <IconButton edge="start" color="inherit" aria-label="logo" className="playpal-logo-icon">
            <SportsSoccerIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" className="playpal-logo-text">
            PlayPal
          </Typography>
        </div>

        {/* Sign In Title */}
        <Typography variant="h4" className="signin-title" gutterBottom>
          Sign In
        </Typography>

        {/* Error Message */}
        {error && <Typography color="error">{error}</Typography>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Email Address"
            type="email"
            margin="normal"
            className="signin-input"
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            type="password"
            margin="normal"
            className="signin-input"
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            fullWidth
            variant="contained"
            className="signin-button"
            type="submit"
          >
            Sign In
          </Button>
        </form>

        {/* Footer Section */}
        <Typography className="signin-footer" mt={2}>
          Don't have an account?{" "}
          <Link to="/signup" className="signin-link">
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signin;
