const express = require("express");
const router = express.Router();
const { query } = require("../db");

router.get("/transactions", async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        ti.transaction_id,
        ti.product_id,
        ti.quantity,
        ti.price,
        t.total_amount,
        t.transaction_date
      FROM 
        transaction_items ti
      JOIN 
        transactions t ON ti.transaction_id = t.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

module.exports = router;
