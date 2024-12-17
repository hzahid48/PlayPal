import React from "react";
import { Container, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import "../styles/HomePage.css";

import Navbar from "./navbar";


const HomePage = () => {
  return (
    <div className="home-page">
      {/* Render Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <Container maxWidth="lg">
          <Typography variant="h2" className="hero-title">
            Welcome to PlayPal
          </Typography>
          <Typography variant="h6" className="hero-subtitle">
            Your ultimate sports management platform. Organize matches, manage teams, and explore
            the best sports merchandise all in one place.
          </Typography>
          <Button variant="contained" color="primary" size="large" className="hero-button">
            Get Started
          </Button>
        </Container>
      </div>

      {/* Features Section */}
      <Container maxWidth="lg" className="features-section">
        <Typography variant="h4" className="section-title">
          Features We Offer
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card className="feature-card">
              <CardContent>
                <SportsSoccerIcon fontSize="large" color="primary" />
                <Typography variant="h6" className="feature-title">
                  Team Management
                </Typography>
                <Typography className="feature-description">
                  Easily create and manage teams with detailed player profiles.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className="feature-card">
              <CardContent>
                <SportsSoccerIcon fontSize="large" color="primary" />
                <Typography variant="h6" className="feature-title">
                  Match Scheduling
                </Typography>
                <Typography className="feature-description">
                  Organize matches and track schedules seamlessly.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className="feature-card">
              <CardContent>
                <SportsSoccerIcon fontSize="large" color="primary" />
                <Typography variant="h6" className="feature-title">
                  Merchandise Store
                </Typography>
                <Typography className="feature-description">
                  Browse and purchase high-quality sports gear.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;

