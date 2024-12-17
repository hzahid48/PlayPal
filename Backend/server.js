const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/User");
const userRoutes = require("./routes/usersRoutes");
const productRoutes = require("./routes/ProductRoutes");
const cartRoutes = require("./routes/CartRoutes");
const teamMemberRoutes = require("./routes/members"); // Import team routes
const matchRoutes = require("./routes/matchRoutes");
const TeamDetailsRoute = require("./routes/TeamDetails");
const dashboardRoute = require("./routes/dashboardRoute");
const authenticateToken = require("./middleware/authenticateToken"); // Middleware


const app = express();
app.use(express.json());
app.use(cors());

// MongoDB URI
const MONGO_URI = "mongodb+srv://i221270:22i1270@webcluster.yt0z7.mongodb.net/playpal?retryWrites=true&w=majority&appName=WebCluster";

// JWT Secret (use environment variable in production)
const JWT_SECRET = "playpal_!@#3XnDsd98as&2Efhfd78#strongSecretKey";

// Connect to MongoDB
mongoose.connect(MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  serverSelectionTimeoutMS: 30000 
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Mongoose connection debugging
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Use the routes for signup and signin
app.use("/api", userRoutes); // This will handle both /api/signup and /api/signin

// Use Dashboard route 
app.use("/api", dashboardRoute); 

// Use TeamDetails route
app.use("/api/TeamDetails", TeamDetailsRoute);

// Team Management Routes
app.use("/api/team", teamMemberRoutes); // Use team routes

app.use("/api/matches", matchRoutes);

// Use Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Protected Route Example
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "Access granted to protected route", user: req.user });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
