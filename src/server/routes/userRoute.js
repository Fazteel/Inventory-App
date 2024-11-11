const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  checkEmail,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware untuk autentikasi

// Protect routes with authentication
router.use(authMiddleware);

// Routes
router.get('/', getUsers);  // Ubah dari /users menjadi /
router.post('/add', createUser);
router.get('/check-email', checkEmail);

module.exports = router;