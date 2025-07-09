const Chat = require('../models/Chat');

const createChat = async (chatData) => {
    const chat = new Chat(chatData);
    return await chat.save();
};

const getChats = async (userId) => {
    return await Chat.find({ participants: userId }).populate('participants');
};

const sendMessage = async (chatId, messageData) => {
    const chat = await Chat.findById(chatId);
    if (chat) {
        chat.messages.push(messageData);
        return await chat.save();
    }
    throw new Error('Chat not found');
};

const getMessages = async (chatId) => {
    const chat = await Chat.findById(chatId).populate('messages.sender');
    if (chat) {
        return chat.messages;
    }
    throw new Error('Chat not found');
};

module.exports = {
    createChat,
    getChats,
    sendMessage,
    getMessages,
};