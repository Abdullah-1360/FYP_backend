const User = require('../models/User');
const Medicine = require('../models/Medicine');

// Function to block a user
exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, { isBlocked: true });
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error blocking user', error });
    }
};

// Function to view all users
exports.viewUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

// Function to track medicines
exports.trackMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving medicines', error });
    }
};
exports.unblockUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, { isBlocked: false });
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unblocking user', error });
    }
};