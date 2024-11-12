// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkPermissions = require("../middleware/checkPermissions");
const {
  getProductCount,
  getTotalProductIn,
  getTotalAssets,
  getHighValueProducts,
  getAllProducts,
  getProductsNotifications,
  addProduct,
  addStock,
  getProductStats,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Terapkan middleware auth untuk semua routes
router.use(authMiddleware);

// Notification
router.get("/notifications", checkPermissions('reports:products'), getProductsNotifications);

//Products Information
router.get("/count", checkPermissions('read:products'), getProductCount);
router.get("/total-in", checkPermissions('read:products'), getTotalProductIn);
router.get("/total-assets", checkPermissions('read:products'), getTotalAssets);
router.get("/high-values", checkPermissions('read:products'), getHighValueProducts);
router.get("/products-stats", checkPermissions('read:products'), getProductStats);

//Proses CRUD
router.get("/", checkPermissions('read:products'), getAllProducts);
router.post("/add", checkPermissions('create:products'), addProduct);
router.post("/add-stock", checkPermissions('create:products'), addStock);
router.put("/:id", checkPermissions('update:products'), updateProduct);
router.delete("/:id", checkPermissions('delete:products'), deleteProduct);

module.exports = router;