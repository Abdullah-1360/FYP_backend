const Chat = require('../models/Chat');

// Create a community message
const createCommunityMessage = async ({ sender, message }) => {
    const newMessage = new Chat({
        chatType: 'community',
        senderId: sender,
        message,
        timestamp: new Date()
    });
    return await newMessage.save();
};

// Get all community messages
const getCommunityMessages = async () => {
    return await Chat.find({ chatType: 'community' }).populate('senderId', 'username');
};

// Create a doctor (private) message
const createDoctorMessage = async ({ sender, receiver, message }) => {
    const newMessage = new Chat({
        chatType: 'doctor',
        senderId: sender,
        receiverId: receiver,
        message,
        timestamp: new Date()
    });
    return await newMessage.save();
};

// Get all messages between a user and a doctor
const getDoctorMessages = async (userId, doctorId) => {
    return await Chat.find({
        chatType: 'doctor',
        $or: [
            { senderId: userId, receiverId: doctorId },
            { senderId: doctorId, receiverId: userId }
        ]
    }).populate('senderId', 'username').populate('receiverId', 'username');
};

// Get all chat history for a user
const getUserChatHistory = async (userId) => {
    return await Chat.find({
        $or: [{ senderId: userId }, { receiverId: userId }]
    }).populate('senderId', 'username').populate('receiverId', 'username');
};

// Mark a message as read by a user
const markMessageRead = async (messageId, userId) => {
    return await Chat.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: userId } },
        { new: true }
    );
};

module.exports = {
    createCommunityMessage,
    getCommunityMessages,
    createDoctorMessage,
    getDoctorMessages,
    getUserChatHistory,
    markMessageRead,
};