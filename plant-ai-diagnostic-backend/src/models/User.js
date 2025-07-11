const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'doctor', 'admin'],
        default: 'user'
    },
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    isBlocked: { 
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
        
    },
    updatedAt: {
        type: Date,
        default:()=> Date.now()
    }
});

userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;