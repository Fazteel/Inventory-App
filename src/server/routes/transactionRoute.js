const express = require("express");
const router = express.Router();
const { pool, query } = require("../db"); // Pastikan ini sesuai dengan setup database Anda

// Endpoint untuk menghitung Product Out
router.get("/transactions/total-out", async (req, res) => {
  try {
    const result = await query(
      "SELECT COALESCE(SUM(quantity), 0) AS total_out FROM transaction_items"
    );
    res.json({ total_out: parseInt(result.rows[0].total_out) || 0 });
  } catch (err) {
    console.error("Error fetching total product out:", err);
    res.status(500).json({
      error: "Error fetching total product in",
      message: err.message,
    });
  }
});

// Endpoint untuk menampilkan produk dengan penjualan tertinggi (price * quantity)
router.get("/transactions/best-products", async (req, res) => {
  try {
    const result = await query(`
      SELECT p.name AS product_name, SUM(ti.quantity) AS total_quantity
      FROM transaction_items ti
      JOIN products p ON ti.product_id = p.id
      GROUP BY p.name
      ORDER BY total_quantity DESC
      LIMIT 4
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching best-product transactions:", err);
    res.status(500).json({ error: "Error fetching best-product transactions" });
  }
});

// Get all transactions
router.get("/transactions", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.user_id,
        t.total_amount,
        t.transaction_date,
        json_agg(
          json_build_object(
            'product_id', ti.product_id,
            'quantity', ti.quantity,
            'price', ti.price
          )
        ) as items
      FROM 
        transactions t
      LEFT JOIN 
        transaction_items ti ON t.id = ti.transaction_id
      GROUP BY 
        t.id, t.user_id, t.total_amount, t.transaction_date
      ORDER BY 
        t.transaction_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// Create new transaction
router.post("/transactions", async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { added_by, items } = req.body; // Ambil added_by dari request body

    // Validasi request
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Invalid items data");
    }

    // Hitung total_amount
    const total_amount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Buat transaksi
    const transactionResult = await client.query(
      `
          INSERT INTO transactions (user_id, total_amount, transaction_date)
          VALUES ($1, $2, CURRENT_TIMESTAMP)
          RETURNING id
      `,
      [added_by, total_amount]
    ); // Simpan added_by sebagai user_id

    const transaction_id = transactionResult.rows[0].id;

    // Insert items dan update stock
    for (const item of items) {
      // Cek stok
      const stockResult = await client.query(
        "SELECT quantity FROM products WHERE id = $1 FOR UPDATE",
        [item.product_id]
      );

      if (
        !stockResult.rows[0] ||
        stockResult.rows[0].quantity < item.quantity
      ) {
        throw new Error(`Insufficient stock for product ${item.product_id}`);
      }

      // Tambahkan item transaksi
      await client.query(
        `
              INSERT INTO transaction_items (transaction_id, product_id, quantity, price)
              VALUES ($1, $2, $3, $4)
          `,
        [transaction_id, item.product_id, item.quantity, item.price]
      );

      // Update stok
      await client.query(
        `
              UPDATE products 
              SET quantity = quantity - $1
              WHERE id = $2
          `,
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({
      message: "Transaction created successfully",
      transaction_id,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating transaction:", err);
    res.status(500).json({
      error: err.message || "Error creating transaction",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  } finally {
    client.release();
  }
});

module.exports = router;
