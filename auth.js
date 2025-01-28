const jwt = require("jsonwebtoken");

// Middleware to verify the token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "secret_key"); // Replace "secret_key" with a secure key stored in environment variables
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Middleware to authorize admin access
const authorizeAdmin = (req, res, next) => {
  const { role } = req.user; // Assuming the token includes a 'role' field
  if (role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Admins only" });
  }
};

module.exports = {
  authenticateToken,
  authorizeAdmin,
};
