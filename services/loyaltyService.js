const Loyalty = require('../models/Loyalty');

const addPoints = async (userId, points) => {
    try {
        const loyaltyRecord = await Loyalty.findOne({ userId });
        if (loyaltyRecord) {
            loyaltyRecord.points += points;
            await loyaltyRecord.save();
        } else {
            await Loyalty.create({ userId, points });
        }
    } catch (error) {
        throw new Error('Error adding loyalty points: ' + error.message);
    }
};

const redeemPoints = async (userId, points) => {
    try {
        const loyaltyRecord = await Loyalty.findOne({ userId });
        if (loyaltyRecord && loyaltyRecord.points >= points) {
            loyaltyRecord.points -= points;
            await loyaltyRecord.save();
            return true;
        }
        return false;
    } catch (error) {
        throw new Error('Error redeeming loyalty points: ' + error.message);
    }
};

const getPoints = async (userId) => {
    try {
        const loyaltyRecord = await Loyalty.findOne({ userId });
        return loyaltyRecord ? loyaltyRecord.points : 0;
    } catch (error) {
        throw new Error('Error retrieving loyalty points: ' + error.message);
    }
};

module.exports = {
    addPoints,
    redeemPoints,
    getPoints,
};