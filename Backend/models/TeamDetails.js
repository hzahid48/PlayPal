const mongoose = require("mongoose");

const TeamDetailSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
    },
    revenue: {
        type: Number,
        required: true,
    },
    expenses: {
        type: Number,
        required: true,
    },
    netProfit: {
        type: Number,
        required: true,
    },
});

const TeamDetails = mongoose.model("teamDetails", TeamDetailSchema);

module.exports = TeamDetails;
