const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');

// Helper to recalculate totalAmount
const calculateTotal = async (items) => {
    if (!items || items.length === 0) return 0;

    // Fetch prices for all distinct medicineIds in parallel
    const ids = items.map((i) => i.medicineId);
    const medicines = await Medicine.find({ _id: { $in: ids } }).select('price');
    const priceMap = medicines.reduce((acc, m) => {
        acc[m._id] = m.price;
        return acc;
    }, {});

    return items.reduce((sum, item) => {
        const price = priceMap[item.medicineId] || 0;
        return sum + price * item.quantity;
    }, 0);
};

// POST /api/cart/add
exports.addItemToCart = async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { itemId, quantity = 1 } = req.body;

    if (!itemId) {
        return res.status(400).json({ message: 'itemId is required' });
    }
    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    try {
        // Validate medicine exists
        const medicine = await Medicine.findById(itemId);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        // Find existing cart or create new
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if item already in cart
        const existingItem = cart.items.find((i) => i.medicineId.toString() === itemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ medicineId: itemId, quantity });
        }

        // Recalculate totalAmount
        cart.totalAmount = await calculateTotal(cart.items);

        await cart.save();

        res.status(201).json({ message: 'Item added to cart successfully.', cart });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Error adding item to cart.', error: error.message });
    }
};

// DELETE /api/cart/remove/:itemId
exports.removeItemFromCart = async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { itemId } = req.params;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter((i) => i.medicineId.toString() !== itemId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.totalAmount = await calculateTotal(cart.items);
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart successfully.', cart });
    } catch (error) {
        console.error('Remove item error:', error);
        res.status(500).json({ message: 'Error removing item from cart.', error: error.message });
    }
};

// GET /api/cart
exports.viewCart = async (req, res) => {
    const userId = req.user.id || req.user._id;
    try {
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.medicineId',
            model: 'Medicine',
        });

        if (!cart) {
            return res.status(200).json({ message: 'Cart retrieved successfully.', cartItems: [], totalAmount: 0 });
        }

        // Map items to include medicine details
        const cartItems = cart.items.map((item) => ({
            _id: item._id,
            item: item.medicineId,
            quantity: item.quantity,
        }));

        res.status(200).json({ message: 'Cart retrieved successfully.', cartItems, totalAmount: cart.totalAmount });
    } catch (error) {
        console.error('View cart error:', error);
        res.status(500).json({ message: 'Error retrieving cart.', error: error.message });
    }
};

// DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
    const userId = req.user.id || req.user._id;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(200).json({ message: 'Cart cleared successfully.' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: 'Error clearing cart.', error: error.message });
    }
};

// PATCH /api/cart/decrement/:itemId
exports.decrementItemQuantity = async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { itemId } = req.params;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find((i) => i.medicineId.toString() === itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // Remove item if quantity would go below 1
            cart.items = cart.items.filter((i) => i.medicineId.toString() !== itemId);
        }

        cart.totalAmount = await calculateTotal(cart.items);
        await cart.save();

        res.status(200).json({ message: 'Item quantity decremented successfully.', cart });
    } catch (error) {
        console.error('Decrement item quantity error:', error);
        res.status(500).json({ message: 'Error decrementing item quantity.', error: error.message });
    }
};