const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, required: true },
  matchesPlayed: { type: Number, required: true },
  team: { type: String, required: true }, // New column for team
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("TeamMember", TeamMemberSchema);
