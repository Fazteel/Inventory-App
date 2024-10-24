const express = require("express");
const router = express.Router();
const { query } = require("../db");

// Get all suppliers (excluding soft-deleted ones)
router.get("/suppliers", async (req, res) => {
  try {
    const result = await query("SELECT * FROM suppliers WHERE deleted_at IS NULL");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ error: "Error fetching suppliers" });
  }
});

// Add a new supplier
router.post("/suppliers/add", async (req, res) => {
  const { name, contact_person, phone, email, address } = req.body;

  if (!name || !contact_person || !phone || !email || !address) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const result = await query(
      "INSERT INTO suppliers (name, contact_person, phone, email, address, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *",
      [name, contact_person, phone, email, address]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding supplier:", err);
    res.status(500).json({ error: "Error adding supplier", details: err.message });
  }
});

// Update supplier
router.put("/suppliers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, contact_person, phone, email, address } = req.body;

  try {
    const result = await query(
      "UPDATE suppliers SET name = $1, contact_person = $2, phone = $3, email = $4, address = $5, updated_at = NOW() WHERE id = $6 AND deleted_at IS NULL RETURNING *",
      [name, contact_person, phone, email, address, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Supplier not found or already deleted" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating supplier:", err);
    res.status(500).json({ error: "Error updating supplier", details: err.message });
  }
});

// Soft delete supplier
router.delete("/suppliers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      "UPDATE suppliers SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Supplier not found or already deleted" });
    }

    res.json({ message: "Supplier soft deleted successfully" });
  } catch (err) {
    console.error("Error deleting supplier:", err);
    res.status(500).json({ error: "Error deleting supplier", details: err.message });
  }
});

module.exports = router;
