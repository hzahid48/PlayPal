import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, IconButton, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import axios from "axios";
import "../styles/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "player",
  });
  const [role, setRole] = useState("player"); // Default role: Player
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);  // Update role state
    setFormData({
      ...formData,
      role: newRole,  // Update role in formData as well
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, role } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Submitting signup with role:", role);
    
    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        name,
        email,
        password,
        confirmPassword,
        role,
      });

      const { token} = response.data;
      if (token) {
        localStorage.setItem("token", token);
      }

      // alert(response.data.message);

      if (role === "captain") {
        navigate("/captainForm", { state: { name } }); // Redirect to the caption form page
      } else {
        alert("User registered successfully!");
        navigate("/signin"); // Redirect to the signin page
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Server error");
    }
  };

  return (
    <Box className="signup-page-container">
      <Box className="signup-form-container">
        <div className="playpal-logo">
          <IconButton edge="start" color="inherit" aria-label="logo" className="playpal-logo-icon">
            <Link to="/dashboard">
              <SportsSoccerIcon fontSize="large" />
            </Link>
          </IconButton>
          <Typography variant="h6" className="playpal-logo-text">
            PlayPal
          </Typography>
        </div>

        <Typography variant="h4" className="signup-title" gutterBottom>
          Create an Account
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Full Name"
            margin="normal"
            className="signup-input"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Email Address"
            type="email"
            margin="normal"
            className="signup-input"
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
            className="signup-input"
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Confirm Password"
            type="password"
            margin="normal"
            className="signup-input"
            required
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {/* Radio Buttons for Role Selection */}
          <Typography variant="body1" className="role-selection-title" gutterBottom>
            Select Role
          </Typography>
          <RadioGroup row value={role} onChange={handleRoleChange} className="role-selection-group">
            <FormControlLabel value="captain" control={<Radio />} label="Captain" />
            <FormControlLabel value="player" control={<Radio />} label="Player" />
          </RadioGroup>

          <Button fullWidth variant="contained" className="signup-button" type="submit">
            {role === "captain" ? "Next" : "Sign Up"}
          </Button>
        </form>

        <Typography className="signup-footer" mt={2}>
          Already have an account?{" "}
          <a href="/signin" className="signup-link">
            Sign In
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
