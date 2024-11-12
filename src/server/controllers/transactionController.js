const {
  getTotalOut,
  getBestProducts,
  getAllTransactions,
  createTransaction,
  processTransactionItems,
  getTransStats,
  getTransactionNotifications
} = require("../models/transactionModel");
const { pool } = require("../db");

exports.totalOut = async (req, res) => {
  try {
    const totalOut = await getTotalOut();
    res.json({ total_out: parseInt(totalOut) });
  } catch (err) {
    console.error("Error fetching total product out:", err);
    res.status(500).json({ error: "Error fetching total product out" });
  }
};

exports.bestProducts = async (req, res) => {
  try {
    const bestProducts = await getBestProducts();
    res.json(bestProducts);
  } catch (err) {
    console.error("Error fetching best-product transactions:", err);
    res.status(500).json({ error: "Error fetching best-product transactions" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

exports.getTransactionsStats = async (req, res) => {
  try {
    const result = await getTransStats()
    if (result.rows && result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.json([]); 
    }
  } catch (error) {
    console.error('Error in getTransactionsStats:', error);
    res.status(500).json({ error: error.message });
  }
}

exports.createTransaction = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { added_by, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Invalid items data");
    }

    // Validasi data items
    items.forEach((item) => {
      if (!item.product_id || !item.quantity || !item.price) {
        throw new Error("Invalid item data: missing required fields");
      }
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const transactionId = await createTransaction(
      client,
      added_by,
      totalAmount
    );
    await processTransactionItems(client, transactionId, items);

    await client.query("COMMIT");
    res.status(201).json({
      message: "Transaction created successfully",
      transaction_id: transactionId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating transaction:", err);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};

exports.transactionNotifications = async (req, res) => {
  try {
    const notifications = await getTransactionNotifications();
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching transaction notifications:", error);
    res.status(500).json({ error: "Error fetching transaction notifications" });
  }
};