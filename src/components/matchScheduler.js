import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import "../styles/matchScheduler.css";
import { Typography, Button, TextField } from "@mui/material";
import axios from "axios";

const MatchScheduler = () => {
  const [team1, setTeam1] = useState(""); // Fixed team for the logged-in player
  const [team2, setTeam2] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [scheduledMatches, setScheduledMatches] = useState([]);
  const [notificationSent, setNotificationSent] = useState(false);

  const API_URL = "http://localhost:5000/api/matches"; // Replace with your backend URL
  const token = localStorage.getItem("token"); // Replace with your auth token retrieval method
  const name = localStorage.getItem("userName");

  // Fetch scheduled matches and player's team on component mount
  useEffect(() => {
    fetchScheduledMatches();
    fetchPlayerTeam();
  }, []);

  const fetchScheduledMatches = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScheduledMatches(response.data);
    } catch (error) {
      console.error("Error fetching scheduled matches:", error);
    }
  };

  const fetchPlayerTeam = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/teamMemberByName/${name}`);
      setTeam1(response.data.team); // Set the team name from the response
      console.log("TEAM 1: ", response.data.team );
    } catch (error) {
      console.error("Error fetching player's team:", error);
    }
  };

  const handleScheduleMatch = async (e) => {
    e.preventDefault();

    if (team1 === team2) {
      alert("Team 2 cannot be the same as Team 1.");
      return;
    }

    try {
      // Check if team2 exists in the database
      const response = await axios.get(`http://localhost:5000/api/matches/teamMembers/${team2}`);
      if (!response.data.exists) {
        alert("The selected Team 2 does not exist.");
        return;
      }

      if (team1 && team2 && venue && date && time) {
        const newMatch = { team1, team2, venue, date, time };

        // Create a new notification for the user/team
        const notification = {
          message: `You scheduled a match between ${team1} and ${team2} on ${date}`,
          name: name,
        };

        await axios.post(API_URL, newMatch, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await axios.post("http://localhost:5000/api/StoreNotification", notification);

        fetchScheduledMatches(); // Refresh match list
        setTeam2("");
        setVenue("");
        setDate("");
        setTime("");

        // Show an alert once the match is scheduled successfully
        alert(`Match between ${team1} and ${team2} scheduled successfully!`);
      } else {
        alert("Please fill in all fields to schedule the match.");
      }
    } catch (error) {
      console.error("Error scheduling match:", error);
    }
  };

  const handleTeam2Change = async (e) => {
    const value = e.target.value;
    setTeam2(value);

    // Optionally validate the team in real-time
    if (value === team1) {
      alert("Team 2 cannot be the same as Team 1.");
      setTeam2("");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/matches/teamMembers/${value}`);
      if (!response.data.exists) {
        alert("The selected Team 2 does not exist.");
      }
    } catch (error) {
      console.error("Error validating Team 2:", error);
    }
  };

  const handleSendNotification = async () => {
    try {
      await axios.post(
        `${API_URL}/send-notifications`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Reminder notifications sent successfully!");
      setNotificationSent(true);
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="match-scheduler">
        <div className="match-scheduler-container">
          {/* Page Header */}
          <Typography
            variant="h4"
            align="center"
            color="error"
            className="match-scheduler__header"
            gutterBottom
          >
            Match Scheduler
          </Typography>

          {/* Match Scheduling Form */}
          <form onSubmit={handleScheduleMatch} className="match-scheduler__form">
            <TextField
              variant="outlined"
              value={team1}
              placeholder={team1 || "Loading..."} 
              fullWidth
              margin="normal"
              className="text-field"
              InputProps={{
                readOnly: true, // Make the input field read-only
              }}
              required
            />

            <TextField
              label="Team 2 Name"
              variant="outlined"
              value={team2}
              onChange={handleTeam2Change}
              fullWidth
              margin="normal"
              className="text-field"
              required
            />
            <TextField
              label="Venue"
              variant="outlined"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              fullWidth
              margin="normal"
              className="text-field"
              required
            />
            <TextField
              label="Match Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              margin="normal"
              className="text-field"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <TextField
              label="Match Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              margin="normal"
              className="text-field"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              className="match-scheduler__submit-btn"
            >
              Schedule Match
            </Button>
          </form>
        </div>

        {/* Calendar View */}
        <div className="match-scheduler__calendar">
          <Typography variant="h6" className="match-scheduler__calendar-header">
            Upcoming Matches
          </Typography>
          {scheduledMatches.length > 0 ? (
            scheduledMatches.map((match, index) => (
              <div key={index} className="match-scheduler__match-entry">
                <Typography variant="body1">
                  {`${match.date} - ${match.team1} vs ${match.team2} at ${match.venue} - ${match.time}`}
                </Typography>
              </div>
            ))
          ) : (
            <Typography variant="body2" className="match-scheduler__no-matches">
              No matches scheduled yet.
            </Typography>
          )}
        </div>

        {/* Notification Button */}
        <Button
          onClick={handleSendNotification}
          variant="contained"
          className={`match-scheduler__notification-btn ${
            notificationSent ? "match-scheduler__notification-btn--success" : ""
          }`}
        >
          {notificationSent ? "Reminders Sent" : "Send Match Reminders"}
        </Button>
      </div>
    </div>
  );
};

export default MatchScheduler;
