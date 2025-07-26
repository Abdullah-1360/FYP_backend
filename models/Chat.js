const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'receiverModel',
        required: false // Not required for community messages
    },
    receiverModel: {
        type: String,
        required: false,
        enum: ['User', 'Doctor']
    },
    message: {
        type: String,
        required: false // Allow media-only messages
    },
    fileUrl: {
        type: String,
        required: false
    },
    fileType: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    chatType: {
        type: String,
        enum: ['community', 'doctor'],
        required: true
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;