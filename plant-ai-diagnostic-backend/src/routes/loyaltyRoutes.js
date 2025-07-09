const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');

// Route to get loyalty points for a user
router.get('/:userId/points', loyaltyController.getLoyaltyPoints);

// Route to redeem loyalty points
router.post('/:userId/redeem', loyaltyController.redeemLoyaltyPoints);

// Route to get loyalty rewards
router.get('/rewards', loyaltyController.getLoyaltyRewards);

// Route to add loyalty points for a user
router.post('/:userId/add', loyaltyController.addLoyaltyPoints);

module.exports = router;