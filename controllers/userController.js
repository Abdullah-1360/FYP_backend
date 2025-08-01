const User = require('../models/User');
const Loyalty = require('../models/Loyalty');
const Cart = require('../models/Cart');
const Doctor = require('../models/Doctor');

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
        // Find all doctors that have appointments for this user
        const doctors = await Doctor.find({
            'appointments.userId': req.user.id
        }).populate('appointments.userId', 'name email phone');

        // Extract and format appointments
        const appointments = [];
        doctors.forEach(doctor => {
            doctor.appointments.forEach(appointment => {
                if (appointment.userId._id.toString() === req.user.id) {
                    appointments.push({
                        _id: appointment._id,
                        doctorId: doctor._id,
                        doctorName: doctor.name,
                        doctorSpecialty: doctor.specialty,
                        userId: appointment.userId,
                        appointmentDate: appointment.appointmentDate,
                        status: appointment.status,
                        notes: appointment.notes,
                        createdAt: appointment.createdAt
                    });
                }
            });
        });

        // Sort appointments by date
        appointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

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