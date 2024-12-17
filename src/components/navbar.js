import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/signin");
    alert("You have successfully logged out!");
  };

  const toggleDrawer = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  const menuItems = [
    { text: "Home", path: "/homepage" },
    { text: "Dashboard", path: "/dashboard" },
    { text: "Team Management", path: "/teamManagement" },
    { text: "Match Scheduler", path: "/matchScheduler" },
    { text: "Store", path: "/store" },
    { text: "Stats & Reports", path: "/reports" },
    { text: "Logout", action: handleLogout },
  ];

  return (
    <>
      <AppBar position="static" className="navbar">
      <Toolbar sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: { xs: '0 8px', sm: '0 16px' }, // Add padding for smaller screens
    width: '100%',
  }}>
          {/* Logo and Title */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton edge="start" color="inherit" aria-label="logo">
              <SportsSoccerIcon fontSize="large" />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ marginLeft: "10px" }}>
              PlayPal
            </Typography>
          </div>

          {/* Hamburger Menu for Small Screens */}
          <IconButton
    edge="end" // Align to the right within the flex container
    color="inherit"
    sx={{
      display: { xs: 'block', sm: 'none' },
      marginRight: '8px', // Prevent it from touching the edge
    }}
    onClick={() => toggleDrawer(true)}
  >
          <MenuIcon />
          </IconButton>
          

          {/* Navigation Links for Larger Screens */}
          <div className="nav-links" style={{ display: { xs: "none", md: "block" } }}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                color="inherit"
                component={item.path ? NavLink : "button"}
                to={item.path || undefined}
                onClick={item.action || undefined}
              >
                {item.text}
              </Button>
            ))}
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer for Small Screens */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              component={item.path ? NavLink : "div"}
              to={item.path || undefined}
              onClick={() => {
                if (item.action) item.action();
                toggleDrawer(false);
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;

  

  

