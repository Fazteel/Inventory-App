const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkPermissions = require("../middleware/checkPermissions");
const {
  totalOut,
  bestProducts,
  getTransactions,
  createTransaction,
  getTransactionsStats
} = require("../controllers/transactionController");

router.use(authMiddleware);

//Transaction Information
router.get("/total-out", checkPermissions('read:transactions'), totalOut);
router.get("/best-products", checkPermissions('read:transactions'), bestProducts);
router.get("/transactions-stats", checkPermissions('read:transactions'), getTransactionsStats);

//Proses CRUD
router.get("/", checkPermissions('read:transactions'), getTransactions);
router.post("/", checkPermissions('create:transactions'), createTransaction);

module.exports = router;