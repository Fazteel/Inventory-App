// authMiddleware.js
const jwt = require("jsonwebtoken");
const { query } = require("../db");

const authMiddleware = async (req, res, next) => {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).json({ 
      msg: "Authorization token missing",
      needsRelogin: true 
    });
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      msg: "Invalid token format",
      needsRelogin: true 
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists in database
    const userQuery = "SELECT * FROM users WHERE id = $1";
    const userResult = await query(userQuery, [decoded.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        msg: "User no longer exists",
        needsRelogin: true 
      });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ 
      msg: "Invalid or expired token",
      needsRelogin: true 
    });
  }
};

module.exports = authMiddleware;