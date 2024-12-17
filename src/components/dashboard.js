import React, { useState, useEffect } from "react";
import Navbar from "./navbar"; // Import Navbar to integrate with Dashboard
import axios from "axios"; // For making API requests
import "../styles/dashboard.css"; // Centralized CSS for Dashboard styling

const Dashboard = () => {
  const [userData, setUserData] = useState({
    team: "",
    role: "",
    matchesPlayed: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  const userName = localStorage.getItem("userName");
  console.log("Username: ", userName); // Check if userName is retrieved correctly

  const [financialData, setFinancialData] = useState({
    revenue: 0,
    expenses: 0,
    netProfit: 0,
  });

  useEffect(() => {
    // Fetch user data from the backend API by name
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/teamMemberByName/${userName}`);
        setUserData(response.data); // Store team, role, and matchesPlayed
      } catch (error) {
        console.error("Error fetching team member data:", error);
      }
    };

    fetchUserData();
  }, [userName]);

  useEffect(() => {
    // Fetch notifications for the user when the component mounts
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notifications/${userName}`);
        setNotifications(response.data); // Assuming response data is an array of notification messages
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [userName]);

  useEffect(() => {
    // Fetch financial data from the teamdetails table
    const fetchFinancialData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/teamdetails/${userData.team}`); // Fetch data for the team
        setFinancialData(response.data); // Assuming response data contains revenue, expenses, and netProfit
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    if (userData.team) {
      fetchFinancialData();
    }
  }, [userData.team]); // Fetch financial data whenever the team is updated

  useEffect(() => {
    // Fetch the closest upcoming 3 matches for the user's team
    const fetchUpcomingMatches = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/upcomingMatches/${userData.team}`);
        setUpcomingMatches(response.data); // Store upcoming matches in state
      } catch (error) {
        console.error('Error fetching upcoming matches:', error);
      }
    };
  
    if (userData.team) {
      fetchUpcomingMatches();
    }
  }, [userData.team]); // Fetch whenever the team data is updated


  return (
    <div className="navbar">
      <Navbar />
      <div className="dashboard-container">
        {/* Dashboard Main Content */}
        <div className="dashboard-content">
          {/* Profile Section */}
          <div className="dashboard-section profile">
            <h2>My Profile</h2>
            <p>Team: {userData.team}</p>
            <p>Role: {userData.role}</p>
            <p>Matches Played: {userData.matchesPlayed}</p>
          </div>

          {/* Notifications Panel */}
          <div className="dashboard-section notifications">
            <h2>Notifications</h2>
            <ul>
              {/* Render notifications dynamically */}
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li key={index}>{notification}</li>
                ))
              ) : (
                <li>No new notifications</li>
              )}
            </ul>
          </div>

          {/* Upcoming Matches Section */}
          <div className="dashboard-section upcoming-matches">
            <h2>Upcoming Matches</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                </tr>
              </thead>
              <tbody>
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((match, index) => (
                    <tr key={index}>
                      <td>{new Date(match.date).toLocaleDateString()}</td>
                      <td>{new Date(`${match.date}T${match.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                      <td>{match.venue}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No upcoming matches</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Overview Section */}
          <div className="dashboard-section financial-overview">
            <h2>Financial Overview</h2>
            <p>Revenue: ${financialData.revenue}</p>
            <p>Expenses: ${financialData.expenses}</p>
            <p>Net Profit: ${financialData.netProfit}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
