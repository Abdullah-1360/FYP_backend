const Loyalty = require('../models/Loyalty');
// Function to get loyalty rewards
exports.getLoyaltyRewards = async (req, res) => {
    try {
        // Replace this with your actual rewards logic or DB query
        const rewards = [
            { id: 1, name: "Free Consultation", pointsRequired: 100 },
            { id: 2, name: "Discount on Medicine", pointsRequired: 200 }
        ];
        res.status(200).json(rewards);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Function to get loyalty points for a user
exports.getLoyaltyPoints = async (req, res) => {
    try {
        const userId = req.user.id;
        const loyaltyData = await Loyalty.findOne({ userId });

        if (!loyaltyData) {
            return res.status(404).json({ message: 'Loyalty data not found' });
        }

        res.status(200).json({ points: loyaltyData.points });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Function to redeem loyalty points
exports.redeemLoyaltyPoints = async (req, res) => {
    try {
        const userId = req.user.id;
        const { pointsToRedeem } = req.body;

        const loyaltyData = await Loyalty.findOne({ userId });

        if (!loyaltyData || loyaltyData.points < pointsToRedeem) {
            return res.status(400).json({ message: 'Insufficient loyalty points' });
        }

        loyaltyData.points -= pointsToRedeem;
        await loyaltyData.save();

        res.status(200).json({ message: 'Points redeemed successfully', remainingPoints: loyaltyData.points });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Function to add loyalty points for a user
exports.addLoyaltyPoints = async (req, res) => {
    try {
        const userId = req.user.id;
        const { pointsToAdd } = req.body;

        let loyaltyData = await Loyalty.findOne({ userId });

        if (!loyaltyData) {
            loyaltyData = new Loyalty({ userId, points: 0 });
        }

        loyaltyData.points += pointsToAdd;
        await loyaltyData.save();

        res.status(200).json({ message: 'Points added successfully', totalPoints: loyaltyData.points });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};