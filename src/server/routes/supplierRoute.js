const express = require("express");
const router = express.Router();
const { query } = require("../db");

// Get all suppliers
router.get("/suppliers", async (req, res) => {
  try {
    const result = await query("SELECT * FROM suppliers");
    res.json(result.rows); // Return list of suppliers
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ error: "Error fetching suppliers" });
  }
});

// Add a new supplier
router.post("/suppliers/add", async (req, res) => {
  const { name, contact_person, phone, email, address } = req.body; // Corrected to contact_person

  // Validate input
  if (!name || !contact_person || !phone || !email || !address) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const result = await query(
      "INSERT INTO suppliers (name, contact_person, phone, email, address, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *",
      [name, contact_person, phone, email, address]
    );

    res.status(201).json(result.rows[0]); // Return the newly added supplier
  } catch (err) {
    console.error("Error adding supplier:", err);
    res.status(500).json({ error: "Error adding supplier", details: err.message });
  }
});

module.exports = router;
