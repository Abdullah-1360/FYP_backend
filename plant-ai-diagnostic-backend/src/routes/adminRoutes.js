const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to view all users
router.get('/users', authMiddleware.verifyAdmin, adminController.viewUsers);

// Route to block a user
router.post('/users/block/:id', authMiddleware.verifyAdmin, adminController.blockUser);

// Route to track medicines
router.get('/medicines', authMiddleware.verifyAdmin, adminController.trackMedicines);

module.exports = router;