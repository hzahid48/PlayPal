const express = require("express");
const router = express.Router();
const TeamMember = require("../models/TeamMember"); // Import the TeamMember model
const User = require("../models/User"); // Import the User model to check if the name exists
const authenticateToken = require("../middleware/authenticateToken"); // Import auth middleware


router.get("/", authenticateToken, async (req, res) => {
  try {
    // Fetch the user's details from the User model using the user's ID (from token)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's corresponding team using the name in the TeamMember model
    const userTeamMember = await TeamMember.findOne({ name: user.name });

    if (!userTeamMember) {
      return res.status(404).json({ message: "User not found in the team members table" });
    }

    // Get all team members who belong to the same team as the authenticated user
    const teamMembers = await TeamMember.find({ team: userTeamMember.team });

    if (!teamMembers || teamMembers.length === 0) {
      return res.status(404).json({ message: "No team members found in your team" });
    }

    // Return the list of team members
    res.json(teamMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Add a new team member
router.post("/", authenticateToken, async (req, res) => {
  const { name, age, role, matchesPlayed, team } = req.body;

  if (!name || !age || !role || matchesPlayed == null || !team) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the name exists in the users table
    const userExists = await User.findOne({ name });
    if (!userExists) {
      return res.status(400).json({ message: "User with this name does not exist" });
    }

    // Check if the user's role is "captain"
    if (userExists.role === "captain") {
      return res.status(400).json({ message: "User with role 'captain' cannot be added as a team member" });
    }

    // Check if a team member with the same name already exists for the user
    const existingMember = await TeamMember.findOne({ name, createdBy: req.user.id });
    if (existingMember) {
      return res.status(400).json({ message: "A member with this name already exists in your team" });
    }

    const newMember = new TeamMember({
      name,
      age,
      role,
      matchesPlayed,
      team,
      createdBy: req.user.id,
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an existing team member
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, age, role, matchesPlayed, team } = req.body;

  try {
    // Update the team member with the provided data
    const updatedMember = await TeamMember.findByIdAndUpdate(
      id,
      { name, age, role, matchesPlayed, team },
      { new: true, runValidators: true } // Return the updated document and validate the input
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Failed to update team member" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("Error updating team member:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Delete a team member
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the team member without checking the creator
    const deletedMember = await TeamMember.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Add captain to the teammembers 
router.post("/captain", authenticateToken, async (req, res) => {
  const { name, age, role, matchesPlayed, team } = req.body;

  if (!name || !age || !role || matchesPlayed == null || !team) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if a team member with the same name already exists for the user
    const existingMember = await TeamMember.findOne({ name, createdBy: req.user.id });
    if (existingMember) {
      return res.status(400).json({ message: "A member with this name already exists" });
    }

    const newMember = new TeamMember({
      name,
      age,
      role,
      matchesPlayed,
      team,
      createdBy: req.user.id,
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
