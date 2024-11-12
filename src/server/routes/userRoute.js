const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  checkEmail,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware untuk autentikasi

// Protect routes with authentication
router.use(authMiddleware);

// Routes
router.get('/', getUsers); 
router.post('/add', createUser);
router.get('/check-email', checkEmail);
router.put('/update/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;