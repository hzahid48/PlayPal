// routes/matchRoutes.js
const express = require("express");
const router = express.Router();
const Match = require("../models/matchModel");
const User = require("../models/User");
const TeamMember = require("../models/TeamMember");
const TeamDetails = require("../models/TeamDetails");

// Middleware for authentication (you can expand it as needed)
const authenticate = require("../middleware/authenticateToken");

// Route to get scheduled matches for the logged-in player's team
router.get("/", authenticate, async (req, res) => {
  try {
    // Fetch the user's details from the User model using the user's ID (from token)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's corresponding team using the name in the TeamMember model
    const player = await TeamMember.findOne({ name: user.name });


    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const teamName = player.team;

    // Fetch the scheduled matches where the logged-in player's team is either team1 or team2
    const matches = await Match.find({
      $or: [{ team1: teamName }, { team2: teamName }],
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST to schedule a new match
router.post("/", authenticate, async (req, res) => {
  const { team1, team2, venue, date, time } = req.body;

  if (!team1 || !team2 || !venue || !date || !time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newMatch = new Match({ team1, team2, venue, date, time });
    await newMatch.save();
    res.status(201).json(newMatch);
  } catch (error) {
    console.error("Error scheduling match:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST to send notifications (simplified for demo purposes)
router.post("/send-notifications", authenticate, async (req, res) => {
  try {
    // For the sake of this example, we'll just send a success message.
    // In a real-world application, you would use an email or messaging service.
    console.log("Sending notifications...");
    res.status(200).json({ message: "Notifications sent successfully!" });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to check if a team exists
router.get("/teamMembers/:teamName", async (req, res) => {
  try {
    const teamName = req.params.teamName;

    // Check if the team exists in the database
    const teamExists = await TeamDetails.exists({ teamName: teamName });

    if (teamExists) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking team existence:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
