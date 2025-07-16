const { Router } = require('express');
const router = Router();
const { addItemToCart, removeItemFromCart, viewCart, clearCart } = require('../controllers/cartController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Route to add an item to the cart
router.post('/add', authenticateUser, addItemToCart);

// Route to remove an item from the cart
router.delete('/remove/:itemId', authenticateUser, removeItemFromCart);

// Route to view all items in the cart
router.get('/', authenticateUser, viewCart);

// Route to clear the cart
router.delete('/clear', authenticateUser, clearCart);

module.exports = router;