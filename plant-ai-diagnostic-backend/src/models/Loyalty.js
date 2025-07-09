const mongoose = require('mongoose');

const loyaltySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    rewards: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

loyaltySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Loyalty = mongoose.model('Loyalty', loyaltySchema);

module.exports = Loyalty;