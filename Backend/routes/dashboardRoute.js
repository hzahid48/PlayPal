// routes/members.js
const express = require('express');
const TeamMember = require('../models/TeamMember');
const Notification = require('../models/Notifications')
const TeamDetails = require('../models/TeamDetails')
const Match = require('../models/matchModel'); 
const router = express.Router();

// Route to get team member data based on name
router.get('/teamMemberByName/:name', async (req, res) => {
  try {
    // Find the team member by name
    const teamMember = await TeamMember.findOne({ name: req.params.name });

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Return the team and role of the team member
    res.json({
      team: teamMember.team,
      role: teamMember.role,
      matchesPlayed: teamMember.matchesPlayed,
    });
  } catch (err) {
    console.error("Error fetching team member:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get the top 3 most recent notifications for a user
router.get('/notifications/:name', async (req, res) => {
  try {
    // Find the top 3 most recent notifications for the user, only returning the message field
    const notifications = await Notification.find({ name: req.params.name })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
      .limit(3) // Limit the result to 3 notifications
      .select('message createdAt'); // Select the 'message' and 'createdAt' fields

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    // Return only the messages of the notifications
    res.json(notifications.map(notification => notification.message));
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to create a new notification
router.post('/storeNotification', async (req, res) => {
  try {
    const { message, name } = req.body;

    // Create a new notification
    const newNotification = new Notification({
      message,
      name,
      createdAt: new Date(),
    });

    // Save the notification to the database
    await newNotification.save();

    // Return success response
    res.status(201).json({ message: 'Notification created successfully' });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route to get financial data based on team name
router.get('/teamdetails/:team', async (req, res) => {
  try {
    // Find the financial data for the team
    const teamDetails = await TeamDetails.findOne({ teamName: req.params.team });

    if (!teamDetails) {
      return res.status(404).json({ message: 'Team financial data not found' });
    }

    // Return the financial data
    res.json({
      revenue: teamDetails.revenue,
      expenses: teamDetails.expenses,
      netProfit: teamDetails.netProfit,
    });
  } catch (err) {
    console.error("Error fetching team financial data:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/upcomingMatches/:teamName', async (req, res) => {
  try {
    const { teamName } = req.params;
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date as YYYY-MM-DD string

    // Fetch the upcoming matches for the team, sorted by date, limited to 3
    const upcomingMatches = await Match.find({
      team1: teamName,  // Filter by team1 or team2, depending on which team
      date: { $gte: currentDate }, // Matches from today onwards (as string)
    })
      .sort({ date: 1 }) // Sort by date in ascending order
      .limit(3); // Limit to 3 upcoming matches

    if (!upcomingMatches || upcomingMatches.length === 0) {
      return res.status(404).json({ message: 'No upcoming matches found for this team' });
    }

    res.json(upcomingMatches);
  } catch (err) {
    console.error("Error fetching upcoming matches:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
