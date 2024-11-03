const {
  getTotalOut,
  getBestProducts,
  getAllTransactions,
  createTransaction,
  processTransactionItems,
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

exports.createTransaction = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { added_by, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Invalid items data");
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const transactionId = await createTransaction(client, added_by, totalAmount);
    await processTransactionItems(client, transactionId, items);

    await client.query("COMMIT");
    res.status(201).json({
      message: "Transaction created successfully",
      transaction_id: transactionId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating transaction:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};
