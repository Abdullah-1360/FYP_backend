const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
    medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantityAvailable: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

marketplaceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Marketplace = mongoose.model('Marketplace', marketplaceSchema);

module.exports = Marketplace;