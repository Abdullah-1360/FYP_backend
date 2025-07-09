const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// User routes
router.get('/profile', authMiddleware.verifyToken, userController.getUserProfile);
router.put('/profile', authMiddleware.verifyToken, userController.updateUserProfile);
router.get('/loyalty', authMiddleware.verifyToken, userController.getUserLoyaltyPoints);
router.get('/appointments', authMiddleware.verifyToken, userController.getUserAppointments);
router.get('/cart', authMiddleware.verifyToken, userController.getUserCart);

module.exports = router;