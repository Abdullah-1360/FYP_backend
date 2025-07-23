const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin login route
router.post('/login', authMiddleware.validateLogin, adminAuthController.adminLogin);

// Validate admin token
router.get('/validate-token', adminAuthController.validateAdminToken);

module.exports = router; 