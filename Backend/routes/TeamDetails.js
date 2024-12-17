const express = require("express");
const router = express.Router();
const TeamDetails = require("../models/TeamDetails");

// Handle POST request to submit team information
router.post("/", async (req, res) => {
  const { teamName, revenue, expenses, netProfit } = req.body;

  try {
    // Create a new team entry
    const newTeam = new TeamDetails({
      teamName,
      revenue,
      expenses,
      netProfit,
    });

    // Save the new team to the database
    await newTeam.save();

    res.status(200).json({
      message: "Captain information submitted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

module.exports = router;
