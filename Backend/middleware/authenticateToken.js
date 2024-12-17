const jwt = require("jsonwebtoken");

const JWT_SECRET = "playpal_!@#3XnDsd98as&2Efhfd78#strongSecretKey"; // Use environment variables in production

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;
