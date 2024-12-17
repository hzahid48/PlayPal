// models/matchModel.js
const mongoose = require("mongoose");

// Define the match schema
const matchSchema = new mongoose.Schema(
  {
    team1: {
      type: String,
      required: true,
    },
    team2: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
  }
);

// Create a Match model
const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
