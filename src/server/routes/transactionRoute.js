const express = require("express");
const router = express.Router();
const {
  totalOut,
  bestProducts,
  getTransactions,
  createTransaction,
} = require("../controllers/transactionController");

router.get("/transactions/total-out", totalOut);
router.get("/transactions/best-products", bestProducts);
router.get("/transactions", getTransactions);
router.post("/transactions", createTransaction);

module.exports = router;
