const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const pool = require("../db");

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: "Validation error", errors: errors.array() });
    }

    const { username, password } = req.body;

    // Debug log
    console.log("Login attempt:", { username });

    // Check user existence
    const userQuery = "SELECT * FROM users WHERE username = $1";
    const userResult = await pool.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      console.log("User not found:", username);
      return res.status(401).json({ msg: "Username tidak ditemukan" });
    }

    const user = userResult.rows[0];

    // Debug log
    console.log("User found:", {
      userId: user.id,
      hasPassword: !!user.password,
    });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password tidak cocok untuk user:", username);
      return res.status(401).json({ msg: "Password salah" });
    }

    // Get user roles
    const roleQuery = `
      SELECT r.name 
      FROM roles r
      INNER JOIN user_roles ur ON ur.role_id = r.id
      WHERE ur.user_id = $1
    `;
    const roleResult = await pool.query(roleQuery, [user.id]);

    if (roleResult.rows.length === 0) {
      console.log("No roles found for user:", username);
      return res.status(403).json({ msg: "User tidak memiliki role" });
    }

    const roles = roleResult.rows.map((row) => row.name);

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        roles: roles,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Kunci rahasia dari .env
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("JWT Error:", err);
          return res.status(500).json({ msg: "Error generating token" });
        }
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            roles: roles,
          },
        });
      }
    );
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// authController.js

// ... kode lainnya ...

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert user
      const userResult = await client.query(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
        [username, hashedPassword]
      );

      const userId = userResult.rows[0].id;

      // Assign default role (assuming role_id 2 is 'user')
      await client.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
        [userId, 2]
      );

      await client.query("COMMIT");

      res.json({ msg: "User registered successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
