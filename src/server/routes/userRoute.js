// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.getUsers);
router.post("/users/add", userController.createUser);
router.post("/roles/add", userController.addRole);

module.exports = router;
