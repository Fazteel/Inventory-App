// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { query } = require("../db");

router.get("/users", async (req, res) => {
  try {
    const result = await query(`
      SELECT u.id, u.username, u.email, r.name AS role_name 
      FROM users u 
      LEFT JOIN user_roles ur ON u.id = ur.user_id 
      LEFT JOIN roles r ON ur.role_id = r.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.post("/users/add", async (req, res) => {
  const { username, email, role_id } = req.body; // Ambil data dari request body
  try {
    // Masukkan data pengguna ke dalam tabel users
    const result = await query(
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id",
      [username, email]
    );

    const userId = result.rows[0].id;

    // Masukkan data role ke dalam tabel user_roles
    await query(
      "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
      [userId, role_id]
    );

    res.status(201).json({ message: "User added successfully!" });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Error adding user" });
  }
});

module.exports = router;
