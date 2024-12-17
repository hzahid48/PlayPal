import {Button,Grid,Card,CardContent,Typography,Select,MenuItem,FormControl,InputLabel,Alert,} from "@mui/material";
import {BarChart,Bar,ResponsiveContainer,XAxis,YAxis,Tooltip,Legend,PieChart,Pie,Cell,} from "recharts";
import Navbar from "./navbar";
import "../styles/stat_reports.css";
import React, { useState, useEffect } from "react";
import axios from "axios"; // For making API requests

const Reports = () => {
  const [team, setTeam] = useState("");
  const [player, setPlayer] = useState("");
  const [match, setMatch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showGraphs, setShowGraphs] = useState({
    teamPerformance: false,
    playerPerformance: false,
  });

 
const [userData, setUserData] = useState({
    team: "",
    role: "",
    matchesPlayed: 0,
  });
 const [teamMembers, setTeamMembers] = useState([]);

  const userName = localStorage.getItem("userName");
  console.log("Username: ", userName); // Check if userName is retrieved correctly

  const [financialData, setFinancialData] = useState({
    revenue: 0,
    expenses: 0,
    netProfit: 0,
  });
  // Example data
  const performanceDataByTeam = [
    { name: "Match 1", runscored: 80 },
    { name: "Match 2", runscored: 60 },
    { name: "Match 3", runscored: 75 },
  ];
 

  const performanceDataByPlayer =
  player === "All"
    ? teamMembers.map((member) => ({
        name: member.name,
        performance: member.matchesPlayed,
      }))
    : player
    ? teamMembers
        .filter((member) => member.name === player)
        .map((member) => ({
          name: member.name,
          performance: member.matchesPlayed,
        }))
    : [
        {
          name: "Matches Played",
          performance: userData.matchesPlayed,
        },
      ];

 
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "team") setTeam(value);
    if (name === "player") setPlayer(value);
    
  };

 
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

  const token = localStorage.getItem("token"); // Replace with your auth token retrieval method
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/team', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Team Members Response:", response.data); // Log to confirm structure
        setTeamMembers(response.data); // Directly set the array to teamMembers
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };
  
    if (userData.role === "captain" && userData.team) {
      fetchTeamMembers();
    }
  }, [userData.role, userData.team]);
  console.log('team')
console.log(teamMembers);



  // Convert financialData to an array format suitable for the PieChart


console.log(financialData.netProfit)
const pieData = [
  { name: "Revenue", value: financialData.revenue },
  { name: "Expenses", value: financialData.expenses },
  { name: "Net Profit", value: financialData.netProfit },
];
const handleFilterSubmit = () => {
  if (!team && !player && !match) {
    setErrorMessage("Please select a filter!");
    return;
  }

  setErrorMessage("");
  setShowGraphs({
    teamPerformance: !!team,
    playerPerformance: !!player,
  });
};



  return (
    <div>
      <Navbar />
      <div className="statistics-container">
        <div className="statistics-container1">
          <Typography
            variant="h4"
            align="center"
            style={{ margin: "20px 0" }}
            className="stat-title"
          >
            Statistics and Report
          </Typography>

          {errorMessage && (
            <Alert severity="error" style={{ marginBottom: "20px" }}>
              {errorMessage}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Filters Section */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Filters</Typography>
                  <FormControl fullWidth style={{ marginBottom: "10px" }}>
                    <InputLabel>Team</InputLabel>
                    <Select
                      value={team}
                      name="team"
                      onChange={handleFilterChange}
                      label="Team"
                    >
                      <MenuItem value="Team A">{userData.team}</MenuItem>
              
                    </Select>
                  </FormControl>

                  <FormControl fullWidth style={{ marginBottom: "10px" }}>
  <InputLabel>Player</InputLabel>
  <Select
    value={player}
    name="player"
    onChange={handleFilterChange}
    label="Player"
  >
    {userData.role === "captain" ? (
      [
        <MenuItem key="All" value="All">All</MenuItem>,
        ...teamMembers.map((member) => (
          <MenuItem key={member._id} value={member.name}>
            {member.name}
          </MenuItem>
        ))
      ]
    ) : (
      <MenuItem value={userName}>{userName}</MenuItem>
    )}
  </Select>
</FormControl>

                  <FormControl fullWidth style={{ marginBottom: "20px" }}>
                    
                  </FormControl>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilterSubmit}
                    fullWidth
                  >
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Graphs Section */}
            <Grid item xs={12} md={8}>
              {/* Financial Chart (always displayed) */}
              <Card style={{ marginBottom: "20px" }}>
                <CardContent>
                  <Typography variant="h6">Financial Summary</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index % 2 === 0 ? "#82ca9d" : "#ffbb28"}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
 {/* Player Performance Graph */}
 {showGraphs.playerPerformance && (
                <Card>
                  <CardContent>
                    <Typography variant="h6">Player Performance</Typography>
                    <ResponsiveContainer width="40%" height={300}>
                      <BarChart data={performanceDataByPlayer}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="performance" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
              {/* Team Performance Graph */}
              {showGraphs.teamPerformance && (
                <Card style={{ marginBottom: "20px" }}>
                  <CardContent>
                    <Typography variant="h6">Team Performance</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceDataByTeam}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="runscored" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}             
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Reports;
