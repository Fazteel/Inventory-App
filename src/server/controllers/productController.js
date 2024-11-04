const { query, connect } = require("../db");

exports.getProductCount = async (req, res) => {
  try {
    const result = await query(
      "SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL"
    );
    res.status(200).json({ count: parseInt(result.rows[0]?.count || 0) });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTotalProductIn = async (req, res) => {
  try {
    const result = await query(
      "SELECT COALESCE(SUM(quantity), 0) AS total_in FROM products WHERE deleted_at IS NULL"
    );
    res.json({ total_in: parseInt(result.rows[0]?.total_in || 0) });
  } catch (err) {
    console.error("Error fetching total product in:", err);
    res
      .status(500)
      .json({ error: "Error fetching total product in", message: err.message });
  }
};

exports.getTotalAssets = async (req, res) => {
  try {
    const result = await query(
      "SELECT COALESCE(SUM(price * quantity), 0) AS total_assets FROM products WHERE deleted_at IS NULL"
    );
    res.json({ total_assets: parseFloat(result.rows[0]?.total_assets || 0) });
  } catch (err) {
    console.error("Error fetching total assets:", err);
    res
      .status(500)
      .json({ error: "Error fetching total assets", message: err.message });
  }
};

exports.getHighValueProducts = async (req, res) => {
  try {
    const result = await query(`
      SELECT p.name AS product_name, SUM(ti.quantity * p.price) AS total_sales
      FROM transaction_items ti
      JOIN products p ON ti.product_id = p.id
      GROUP BY p.name
      ORDER BY total_sales DESC
      LIMIT 4
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching high-value products:", err);
    res.status(500).json({ error: "Error fetching high-value products" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const result = await query(`
      SELECT p.id, p.name, p.description, p.price, p.quantity, s.name AS supplier_name
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
};

exports.getProductStats = async (req, res) => {
  try {
    const result = await query('SELECT DATE(created_at) as date, COUNT(*) as total FROM products GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 7');
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getProductStats:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}

exports.addProduct = async (req, res) => {
  const { name, description, price, quantity, supplier_id, added_by } =
    req.body;

  try {
    const client = await connect();

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
    res
      .status(500)
      .json({ error: "Error adding product", message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, supplier_id, updated_by } =
    req.body;

  try {
    const client = await connect();

    try {
      await client.query("BEGIN");

      await client.query(
        "UPDATE products SET name = $1, description = $2, price = $3, quantity = $4, supplier_id = $5, updated_at = NOW() WHERE id = $6",
        [name, description, price, quantity, supplier_id, id]
      );

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
    res
      .status(500)
      .json({ error: "Error updating product", message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { deleted_by } = req.body;

  try {
    const client = await connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        "UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        [id]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Product not found or already deleted" });
      }

      await client.query(
        "UPDATE inventory_additions SET deleted_by = $1 WHERE product_id = $2",
        [deleted_by, id]
      );

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
};
