// routes/roleRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); 
const checkPermissions = require('../middleware/checkPermissions');
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');

const router = express.Router();

// Terapkan authMiddleware untuk semua rute
router.use(authMiddleware);

router.get('/roles', checkPermissions('read:roles'), getRoles);
router.post('/roles', checkPermissions('create:roles'), createRole);
router.put('/roles/:id', checkPermissions('update:roles'), updateRole);
router.delete('/roles/:id', checkPermissions('delete:roles'), deleteRole);

module.exports = router;