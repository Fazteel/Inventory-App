// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const checkPermissions = require('../middleware/checkPermissions');
const {
  getRoles,
  createRole,
  updateRole,
  softDeleteRole,
  getRolePermissions
} = require('../controllers/roleController');

// Terapkan middleware auth untuk semua routes
router.use(authMiddleware);

// routes/roleRoutes.js
router.get('/:id/permissions', checkPermissions('read:roles'), getRolePermissions);

// Role routes
router.get('/', checkPermissions('read:roles'), getRoles);
router.post('/', checkPermissions('create:roles'), createRole);  
router.put('/:id', checkPermissions('update:roles'), updateRole);
router.delete('/:id', checkPermissions('delete:roles'), softDeleteRole); 

module.exports = router;
