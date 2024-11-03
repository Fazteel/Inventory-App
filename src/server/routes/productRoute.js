const express = require("express");
const router = express.Router();
const {
  getProductCount,
  getTotalProductIn,
  getTotalAssets,
  getHighValueProducts,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/products/count", getProductCount);
router.get("/products/total-in", getTotalProductIn);
router.get("/products/total-assets", getTotalAssets);
router.get("/products/high-values", getHighValueProducts);
router.get("/products", getAllProducts);
router.post("/products/add", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;