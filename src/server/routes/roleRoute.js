// routes.js
const express = require('express');
const {
    getRoles,
    createRole,
    updateRole
} = require('../controllers/roleController');
const router = express.Router();

router.get('/roles', getRoles);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);

module.exports = router;