const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// User routes
router.get('/profile', authMiddleware.authenticateUser, userController.getUserProfile);
router.put('/profile', authMiddleware.authenticateUser, userController.updateUserProfile);
router.get('/loyalty', authMiddleware.authenticateUser, userController.getUserLoyaltyPoints);
router.get('/appointments', authMiddleware.authenticateUser, userController.getUserAppointments);
router.get('/cart', authMiddleware.authenticateUser, userController.getUserCart);

module.exports = router;