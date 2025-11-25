const Payment = require('../models/Payment');
const User = require('../models/User');

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('userId', 'username email name')
            .populate('items.medicineId', 'name')
            .sort({ createdAt: -1 });
        
        const formattedPayments = payments.map(payment => ({
            id: payment._id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            paymentIntentId: payment.paymentIntentId,
            userUsername: payment.userId?.username,
            userEmail: payment.userId?.email,
            userName: payment.userId?.name,
            address: payment.address,
            fullAddress: payment.fullAddress,
            items: payment.items,
            createdAt: payment.createdAt
        }));
        
        res.status(200).json(formattedPayments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payments', error: error.message });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('userId', 'username email name')
            .populate('items.medicineId', 'name');
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payment', error: error.message });
    }
};

// Create payment
exports.createPayment = async (req, res) => {
    try {
        const { userId, amount, currency, paymentIntentId, items, address, fullAddress } = req.body;
        
        const payment = new Payment({
            userId,
            amount,
            currency: currency || 'usd',
            paymentIntentId,
            items,
            address,
            fullAddress,
            status: 'pending'
        });
        
        await payment.save();
        res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment', error: error.message });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'succeeded', 'failed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        res.status(200).json({ message: 'Payment status updated', payment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
};

// Delete payment
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error: error.message });
    }
};
