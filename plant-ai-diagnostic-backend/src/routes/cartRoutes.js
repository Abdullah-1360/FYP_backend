const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Route to add an item to the cart
router.post('/add', cartController.addItemToCart);

// Route to remove an item from the cart
router.delete('/remove/:itemId', cartController.removeItemFromCart);

// Route to view all items in the cart
router.get('/', cartController.viewCart);

// Route to clear the cart
router.delete('/clear', cartController.clearCart);

module.exports = router;