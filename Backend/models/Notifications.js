const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
   name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

const Notifications = mongoose.model("notifications",NotificationSchema);

module.exports = Notifications;
