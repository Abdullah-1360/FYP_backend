const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to view all users
router.get('/users', authMiddleware.authorizeAdmin, adminController.viewUsers);

// Route to block a user
router.post('/users/block/:id', authMiddleware.authorizeAdmin, adminController.blockUser);

// Route to track medicines
router.get('/medicines', authMiddleware.authorizeAdmin, adminController.trackMedicines);
router.post('/users/unblock/:id', authMiddleware.authorizeAdmin, adminController.unblockUser);
module.exports = router;