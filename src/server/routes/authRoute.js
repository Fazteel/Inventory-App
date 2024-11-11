// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/login",
  [
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password is required").exists(),
  ],
  authController.login
);

// routes/authRoutes.js
router.post('/set-first-password', authController.setFirstTimePassword);
router.get("/verify", authMiddleware, authController.verifyToken);

module.exports = router;