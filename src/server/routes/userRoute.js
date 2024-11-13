const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
const checkPermissions = require("../middleware/checkPermissions");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  checkEmail,
  getUserRole
} = require('../controllers/userController');

// Protect routes with authentication
router.use(authMiddleware);

router.get('/me/role', checkPermissions('read:users'), getUserRole); 
// Routes
router.get('/', checkPermissions('read:users'), getUsers); 
router.post('/add', checkPermissions('create:users'), createUser);
router.get('/check-email', checkPermissions('create:users'), checkEmail);
router.put('/update/:id', checkPermissions('update:users'), updateUser);
router.delete('/:id', checkPermissions('delete:users'), deleteUser);

module.exports = router;