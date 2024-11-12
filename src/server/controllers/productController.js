const { query, connect } = require("../db");

exports.getProductCount = async (req, res) => {
  try {
    const result = await query(
      "SELECT COUNT(name) as count FROM products WHERE deleted_at IS NULL"
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

exports.getProductsNotifications = async (req, res) => {
  try {
    // Ambil notifikasi untuk produk baru
    const newProducts = await query(`
      SELECT 
        id, 
        name AS product_name, 
        quantity, 
        created_at 
      FROM products 
      WHERE created_at IS NOT NULL 
      AND deleted_at IS NULL 
      ORDER BY created_at DESC
    `);

    // Ambil notifikasi untuk produk yang diupdate
    const updatedProducts = await query(`
      SELECT 
        id, 
        name AS product_name, 
        quantity, 
        updated_at 
      FROM products 
      WHERE updated_at IS NOT NULL 
      AND deleted_at IS NULL 
      ORDER BY updated_at DESC
    `);

    // Ambil notifikasi untuk produk yang dihapus
    const deletedProducts = await query(`
      SELECT 
        id, 
        name AS product_name, 
        deleted_at 
      FROM products 
      WHERE deleted_at IS NOT NULL 
      ORDER BY deleted_at DESC
    `);

    // Ambil notifikasi untuk penambahan stok
    const stockAdditions = await query(`
      SELECT 
        ia.product_id, 
        p.name AS product_name, 
        ia.quantity, 
        ia.date_added 
      FROM inventory_additions ia
      JOIN products p ON ia.product_id = p.id
      WHERE ia.deleted_by IS NULL 
      ORDER BY ia.date_added DESC
    `);

    const notifications = [
      ...newProducts.rows.map((product) => ({
        id: product.id,
        type: "new_product",
        message: `Produk baru ditambahkan: ${product.product_name}`,
        details: {
          productId: product.id,
          productName: product.product_name,
          createdAt: new Date(product.created_at).toLocaleString(),
        },
      })),
      ...updatedProducts.rows.map((product) => ({
        id: product.id,
        type: "product_updated",
        message: `Produk diperbarui: ${product.product_name}`,
        details: {
          productId: product.id,
          productName: product.product_name,
          updatedAt: new Date(product.updated_at).toLocaleString(),
        },
      })),
      ...deletedProducts.rows.map((product) => ({
        id: product.id,
        type: "product_deleted",
        message: `Produk dihapus: ${product.product_name}`,
        details: {
          productId: product.id,
          productName: product.product_name,
          deletedAt: new Date(product.deleted_at).toLocaleString(),
        },
      })),
      ...stockAdditions.rows.map((addition) => ({
        id: addition.product_id,
        type: "stock_added",
        message: `Stok produk ${addition.product_name} bertambah sebanyak ${addition.quantity}`,
        details: {
          productId: addition.product_id,
          productName: addition.product_name,
          dateAdded: new Date(addition.date_added).toLocaleString(),
        },
      })),
    ];

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching product notifications:", err);
    res.status(500).json({
      error: "Error fetching product notifications",
      message: err.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.quantity, 
        s.name AS supplier_name,
        CASE 
          WHEN p.quantity < 10 THEN true 
          ELSE false 
        END AS is_low_stock
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
    const result = await query(`
      WITH daily_stats AS (
          SELECT 
              DATE(created_at) as date,
              COUNT(*) as total_products, 
              SUM(quantity) as total_quantity_in
          FROM products 
          WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
          GROUP BY DATE(created_at)
      ),
      daily_transactions AS (
          SELECT 
              DATE(tr.transaction_date) as date,
              SUM(ti.quantity) as total_quantity_out
          FROM transactions tr
          JOIN transaction_items ti ON tr.id = ti.transaction_id
          WHERE tr.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
          GROUP BY DATE(tr.transaction_date)
      )
      SELECT 
          ds.date,
          ds.total_products,
          ds.total_quantity_in,
          COALESCE(dt.total_quantity_out, 0) as total_quantity_out
      FROM daily_stats ds
      LEFT JOIN daily_transactions dt ON ds.date = dt.date
      ORDER BY ds.date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error in getProductStats:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

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

// Add Stock Controller
exports.addStock = async (req, res) => {
  const { product_id, quantity, supplier_id, added_by } = req.body;

  try {
    const client = await connect();

    try {
      await client.query("BEGIN");

      // Get current quantity
      const currentProduct = await client.query(
        "SELECT quantity FROM products WHERE id = $1",
        [product_id]
      );

      if (!currentProduct.rows[0]) {
        throw new Error("Product not found");
      }

      const newQuantity =
        parseInt(currentProduct.rows[0].quantity) + parseInt(quantity);

      // Update product quantity
      await client.query(
        "UPDATE products SET quantity = $1, updated_at = NOW() WHERE id = $2",
        [newQuantity, product_id]
      );

      // Record in inventory_additions
      await client.query(
        `INSERT INTO inventory_additions 
         (product_id, supplier_id, quantity, date_added, added_by) 
         VALUES ($1, $2, $3, NOW(), $4)`,
        [product_id, supplier_id, quantity, added_by]
      );

      await client.query("COMMIT");
      res.status(200).json({
        message: "Stock added successfully",
        new_quantity: newQuantity,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error adding stock:", err);
    res.status(500).json({
      error: "Error adding stock",
      message: err.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, supplier_id, updated_by } = req.body;

  try {
    const client = await connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `UPDATE products 
         SET name = $1, description = $2, price = $3, supplier_id = $4, 
         updated_at = NOW() 
         WHERE id = $5`,
        [name, description, price, supplier_id, id]
      );

      await client.query(
        `UPDATE inventory_additions 
         SET supplier_id = $1, updated_by = $2 
         WHERE product_id = $3`,
        [supplier_id, updated_by, id]
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
