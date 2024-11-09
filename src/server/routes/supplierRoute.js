// routes/supplierRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkPermissions = require("../middleware/checkPermissions");
const {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

router.use(authMiddleware);

router.get("/", checkPermissions('read:suppliers'), getSuppliers);
router.post("/add", checkPermissions('create:suppliers'), createSupplier);
router.put("/:id", checkPermissions('update:suppliers'), updateSupplier);
router.delete("/:id", checkPermissions('delete:suppliers'), deleteSupplier);

module.exports = router;