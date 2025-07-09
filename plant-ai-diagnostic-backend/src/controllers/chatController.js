const Chat = require('../models/Chat');
const User = require('../models/User');

// Retrieve all community chat messages
exports.getCommunityChat = async (req, res) => {
    try {
        const messages = await Chat.find({ type: 'community' }).populate('sender', 'username');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving community chat messages', error: error.message });
    }
};

// Send a message in the community chat
exports.sendCommunityMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const sender = req.user.id;
        const newMessage = new Chat({
            type: 'community',
            sender,
            message,
            createdAt: new Date()
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error sending community message', error: error.message });
    }
};

// Retrieve chat messages with a specific doctor
exports.getDoctorChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const doctorId = req.params.doctorId;
        const messages = await Chat.find({
            type: 'doctor',
            $or: [
                { sender: userId, receiver: doctorId },
                { sender: doctorId, receiver: userId }
            ]
        }).populate('sender', 'username').populate('receiver', 'username');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving doctor chat messages', error: error.message });
    }
};

// Send a message to a doctor
exports.sendDoctorMessage = async (req, res) => {
    try {
        const sender = req.user.id;
        const receiver = req.params.doctorId;
        const { message } = req.body;
        const newMessage = new Chat({
            type: 'doctor',
            sender,
            receiver,
            message,
            createdAt: new Date()
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message to doctor', error: error.message });
    }
};

// Retrieve chat history for a user (all chats)
exports.getChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Chat.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).populate('sender', 'username').populate('receiver', 'username');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving chat history', error: error.message });
    }
};