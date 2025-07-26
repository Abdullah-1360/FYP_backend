const Chat = require('../models/Chat');

// Create a community message
const createCommunityMessage = async ({ sender, message, fileUrl, fileType }) => {
    const newMessage = new Chat({
        chatType: 'community',
        senderId: sender,
        message,
        fileUrl,
        fileType,
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
    console.log('Creating doctor message:', { sender, receiver, message });
    
    const newMessage = new Chat({
        chatType: 'doctor',
        senderId: sender,
        receiverId: receiver,
        receiverModel: 'Doctor',
        message,
        timestamp: new Date()
    });
    
    try {
        const saved = await newMessage.save();
        console.log('Doctor message saved successfully:', saved._id);
        return saved;
    } catch (error) {
        console.error('Error saving doctor message:', error);
        throw error;
    }
};

// Get all messages between a user and a doctor
const getDoctorMessages = async (userId, doctorId) => {
    console.log('Fetching doctor messages:', { userId, doctorId });
    
    try {
        const messages = await Chat.find({
            chatType: 'doctor',
            $or: [
                { senderId: userId, receiverId: doctorId },
                { senderId: doctorId, receiverId: userId }
            ]
        }).populate('senderId', 'username').populate({
            path: 'receiverId',
            select: 'username name',
            refPath: 'receiverModel'
        });
        
        console.log(`Found ${messages.length} doctor messages`);
        return messages;
    } catch (error) {
        console.error('Error fetching doctor messages:', error);
        throw error;
    }
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