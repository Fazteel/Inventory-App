const { pool } = require("../db");

// Menghitung Total Product Out
async function getTotalOut() {
  const result = await pool.query(
    "SELECT COALESCE(SUM(quantity), 0) AS total_out FROM transaction_items"
  );
  return result.rows[0].total_out || 0;
}

// Mendapatkan produk dengan penjualan tertinggi
async function getBestProducts() {
  const result = await pool.query(`
    SELECT p.name AS product_name, SUM(ti.quantity) AS total_quantity
    FROM transaction_items ti
    JOIN products p ON ti.product_id = p.id
    GROUP BY p.name
    ORDER BY total_quantity DESC
    LIMIT 4
  `);
  return result.rows;
}

const getTransStats = async (startDate, endDate) => {
  const result = await pool.query(`
    SELECT 
      DATE(t.transaction_date) as date,
      SUM(t.total_amount) as total_sales
    FROM 
      transactions t
    WHERE t.transaction_date BETWEEN $1 AND $2
    GROUP BY 
      DATE(t.transaction_date)
    ORDER BY 
      date DESC
  `, [startDate, endDate]);

  return result.rows;  // Mengembalikan data hasil query
};

// Mendapatkan semua transaksi
async function getAllTransactions() {
  const result = await pool.query(`
    SELECT 
        t.user_id,
        t.id,
        t.total_amount,
        t.transaction_date,
        json_agg(
            json_build_object(
                'product_id', ti.product_id,
                'product_name', p.name,
                'quantity', ti.quantity,
                'price', ti.price
            )
        ) as items
    FROM 
        transactions t
    LEFT JOIN 
        transaction_items ti ON t.id = ti.transaction_id
    LEFT JOIN 
        products p ON ti.product_id = p.id
    GROUP BY 
        t.id, t.user_id, t.total_amount, t.transaction_date
    ORDER BY 
        t.transaction_date DESC;
  `);
  return result.rows;
}

// Membuat transaksi baru
async function createTransaction(client, userId, totalAmount) {
  const transactionResult = await client.query(
    `
    INSERT INTO transactions (user_id, total_amount, transaction_date)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    RETURNING id
  `,
    [userId, totalAmount]
  );
  return transactionResult.rows[0].id;
}

// Memproses item transaksi
async function processTransactionItems(client, transactionId, items) {
  for (const item of items) {
    console.log("Processing item:", item);

    // Cek stok
    const stockResult = await client.query(
      "SELECT id, quantity FROM products WHERE id = $1 FOR UPDATE",
      [item.product_id]
    );

    if (!stockResult.rows[0]) {
      throw new Error(`Product not found with ID: ${item.product_id}`);
    }

    const product = stockResult.rows[0];

    if (product.quantity < item.quantity) {
      throw new Error(`Insufficient stock for product ${item.product_name}`);
    }

    // Tambahkan item transaksi
    await client.query(
      `INSERT INTO transaction_items (transaction_id, product_id, quantity, price)
       VALUES ($1, $2, $3, $4)`,
      [transactionId, item.product_id, item.quantity, item.price]
    );

    // Update stok produk
    await client.query(
      `UPDATE products SET quantity = quantity - $1 WHERE id = $2`,
      [item.quantity, item.product_id]
    );
  }
}

async function getTransactionNotifications() {
  const result = await pool.query(`
    SELECT 
      transactions.id AS transaction_id,
      users.username AS created_by,
      transactions.transaction_date AS created_at,
      transactions.total_amount,
      products.name AS product_name,
      transaction_items.quantity AS quantity_sold,
      transaction_items.price AS product_price,
      (transaction_items.quantity * transaction_items.price) AS total_per_product
    FROM 
      transactions
    JOIN 
      users ON transactions.user_id = users.id
    JOIN 
      transaction_items ON transactions.id = transaction_items.transaction_id
    JOIN 
      products ON transaction_items.product_id = products.id
    ORDER BY transactions.transaction_date DESC
  `);

  // Group items by transaction_id
  const notifications = {};
  result.rows.forEach((row) => {
    if (!notifications[row.transaction_id]) {
      notifications[row.transaction_id] = {
        transactionId: row.transaction_id,
        createdBy: row.created_by,
        createdAt: row.created_at,
        totalAmount: row.total_amount,
        items: [],
      };
    }
    notifications[row.transaction_id].items.push({
      product_name: row.product_name,
      quantity: row.quantity_sold,
      price: row.product_price,
      total_per_product: row.total_per_product,
    });
  });

  return Object.values(notifications);
}

module.exports = {
  getTotalOut,
  getBestProducts,
  getAllTransactions,
  createTransaction,
  processTransactionItems,
  getTransStats,
  getTransactionNotifications,
};
