const express = require("express");
const router = express.Router();
const { query, connect } = require("../db");

// Endpoint untuk menghitung produk
router.get("/products/count", async (req, res) => {
  try {
    const result = await query(
      "SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL"
    );
    if (!result.rows[0]) {
      return res.status(200).json({ count: 0 });
    }
    res.status(200).json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Endpoint untuk menghitung Product In
router.get("/products/total-in", async (req, res) => {
  try {
    const result = await query(
      "SELECT COALESCE(SUM(quantity), 0) AS total_in FROM products WHERE deleted_at IS NULL"
    );
    res.json({ total_in: parseInt(result.rows[0].total_in) || 0 });
  } catch (err) {
    console.error("Error fetching total product in:", err);
    res.status(500).json({
      error: "Error fetching total product in",
      message: err.message,
    });
  }
});

// Endpoint untuk menghitung Total Assets
router.get("/products/total-assets", async (req, res) => {
  try {
    const result = await query(
      "SELECT COALESCE(SUM(price * quantity), 0) AS total_assets FROM products WHERE deleted_at IS NULL"
    );
    res.json({ total_assets: parseFloat(result.rows[0].total_assets) || 0 });
  } catch (err) {
    console.error("Error fetching total assets:", err);
    res.status(500).json({
      error: "Error fetching total assets",
      message: err.message,
    });
  }
});

// Endpoint untuk menampilkan data Product
router.get("/products", async (req, res) => {
  try {
    const result = await query(`
      SELECT p.id, p.name, p.price, p.quantity, s.name AS supplier_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.deleted_at IS NULL
      ORDER BY p.updated_at DESC, p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Endpoint untuk menambahkan Products
router.post("/products/add", async (req, res) => {
  const { name, description, price, quantity, supplier_id, added_by } =
    req.body;

  try {
    const client = await connect(); // Dapatkan client

    try {
      await client.query("BEGIN");

      const productResult = await client.query(
        "INSERT INTO products (name, description, price, quantity, supplier_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *",
        [name, description, price, quantity, supplier_id]
      );

      await client.query(
        "INSERT INTO inventory_additions (product_id, supplier_id, quantity, date_added, added_by) VALUES ($1, $2, $3, NOW(), $4)",
        [productResult.rows[0].id, supplier_id, quantity, added_by]
      );

      await client.query("COMMIT");
      res.status(201).json(productResult.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({
      error: "Error adding product",
      message: err.message,
    });
  }
});

// Endpoint untuk memperbarui Products
router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, supplier_id, updated_by } =
    req.body;

  try {
    const client = await connect(); // Dapatkan client

    try {
      await client.query("BEGIN");

      // Update the product in the products table
      await client.query(
        "UPDATE products SET name = $1, description = $2, price = $3, quantity = $4, supplier_id = $5, updated_at = NOW() WHERE id = $6",
        [name, description, price, quantity, supplier_id, id]
      );

      // Update the existing record in inventory_additions
      await client.query(
        "UPDATE inventory_additions SET supplier_id = $1, quantity = $2, date_added = NOW(), added_by = $3, updated_by = $4 WHERE product_id = $5",
        [supplier_id, quantity, updated_by, updated_by, id]
      );

      await client.query("COMMIT");
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({
      error: "Error updating product",
      message: err.message,
    });
  }
});

// Endpoint untuk menghapus data Products
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { deleted_by } = req.body; // Mengambil deleted_by dari request body

  try {
    const client = await connect(); // Dapatkan client

    try {
      await client.query("BEGIN");

      // Update the products table to set deleted_at
      const result = await client.query(
        "UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        [id]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Product not found or already deleted" });
      }

      // Update inventory_additions to set deleted_by for this product
      const updateResult = await client.query(
        "UPDATE inventory_additions SET deleted_by = $1 WHERE product_id = $2",
        [deleted_by, id]
      );

      // Optional: Check if the update was successful
      if (updateResult.rowCount === 0) {
        console.warn("No matching inventory_additions found for product_id:", id);
      }

      await client.query("COMMIT");
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Error deleting product" });
  }
});

// Pastikan kamu meng-export router dengan benar
module.exports = router;
