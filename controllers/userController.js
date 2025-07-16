const User = require('../models/User');
const Loyalty = require('../models/Loyalty');
const Appointment = require('../models/Appointment');
const Cart = require('../models/Cart');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, phone },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete user account
exports.deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user loyalty points
exports.getUserLoyaltyPoints = async (req, res) => {
    try {
        const loyalty = await Loyalty.findOne({ userId: req.user.id });
        res.status(200).json({ points: loyalty ? loyalty.points : 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user appointments
exports.getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id });
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user cart
exports.getUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.medicineId');
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};