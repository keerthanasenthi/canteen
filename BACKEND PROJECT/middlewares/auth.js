const jwt = require("jsonwebtoken");

const SECRET_KEY = "secret_key"; // Use a more secure key in production

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer token
  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified; // Add the user data to the request object
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Token expires in 1 hour
};

module.exports = {
  authenticateToken,
  generateToken,
};
