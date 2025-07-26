const { verifyUserToken } = require('../middlewares/authMiddleware');
const chatService = require('../services/chatService');
const { getFullUrl } = require('../utils/helpers');

const onlineUsers = new Map(); // userId -> socketId

function socketAuthMiddleware(socket, next) {
    const token = socket.handshake.auth?.token;
    console.log('Socket auth attempt - token:', token ? 'present' : 'missing');
    const user = verifyUserToken(token);
    console.log('Socket auth result - user:', user ? user.id : 'null');
    if (!user) {
        console.log('Socket auth failed - rejecting connection');
        return next(new Error('Authentication error: Invalid or missing token'));
    }
    socket.user = user;
    next();
}

function setupChatSockets(io) {
    // General connection handler for debugging
    io.on('connection', (socket) => {
        console.log('General socket connection established:', socket.id);
        socket.on('disconnect', () => {
            console.log('General socket disconnected:', socket.id);
        });
    });
    
    // Community chat namespace
    const communityNamespace = io.of('/community');
    communityNamespace.use(socketAuthMiddleware);
    communityNamespace.on('connection', (socket) => {
        onlineUsers.set(socket.user.id, socket.id);
        communityNamespace.emit('userOnline', { userId: socket.user.id });

        socket.on('joinRoom', (room) => {
            socket.join(room);
            // Emit current room user count
            const count = communityNamespace.adapter.rooms.get(room)?.size || 0;
            communityNamespace.to(room).emit('roomUsers', { room, count });
        });

        // Typing indicators
        socket.on('typing', (room) => {
            socket.to(room).emit('typing', { userId: socket.user.id });
        });
        socket.on('stopTyping', (room) => {
            socket.to(room).emit('stopTyping', { userId: socket.user.id });
        });

        // Community message
        socket.on('communityMessage', async (data, callback) => {
            try {
                const saved = await chatService.createCommunityMessage({
                    sender: socket.user.id,
                    message: data.message,
                    fileUrl: data.fileUrl,
                    fileType: data.fileType
                });
                // Construct full URL for file if it exists using the helper function
                const fullFileUrl = getFullUrl(data.fileUrl);
                
                // Create standardized message object
                const messageObject = {
                    // Include both formats for compatibility
                    user: socket.user.username || socket.user.id,
                    senderId: {
                        _id: socket.user.id,
                        username: socket.user.username
                    },
                    message: data.message,
                    fileUrl: fullFileUrl,
                    fileType: data.fileType,
                    timestamp: saved.timestamp,
                    _id: saved._id
                };
                
                // Emit to all other clients in the room
                socket.broadcast.to(data.room).emit('communityMessage', messageObject);
                // Emit only to the sender
                socket.emit('communityMessage', messageObject);
                if (callback) callback({ delivered: true, messageId: saved._id });
            } catch (err) {
                console.error('Error saving community message:', err);
                if (callback) callback({ delivered: false, error: err.message });
            }
        });

        // Read receipt
        socket.on('messageRead', async ({ messageId }) => {
            await chatService.markMessageRead(messageId, socket.user.id);
            communityNamespace.emit('messageRead', { messageId, userId: socket.user.id });
        });

        // Fetch community chat history
        socket.on('getCommunityHistory', async (room, callback) => {
            const messages = await chatService.getCommunityMessages(); // Optionally filter by room
            
            // Transform messages to ensure consistent format with frontend expectations
            const formattedMessages = messages.map(msg => {
                // Construct full URL for file if it exists using the helper function
                const fullFileUrl = getFullUrl(msg.fileUrl);
                
                return {
                    // Include both formats for compatibility
                    user: msg.senderId?.username || (typeof msg.senderId === 'string' ? msg.senderId : msg.senderId?._id || 'unknown'),
                    senderId: msg.senderId, // Keep original format for backward compatibility
                    message: msg.message || '',
                    fileUrl: fullFileUrl,
                    fileType: msg.fileType,
                    timestamp: msg.timestamp,
                    _id: msg._id
                };
            });
            
            callback(formattedMessages);
        });

        socket.on('disconnect', () => {
            onlineUsers.delete(socket.user.id);
            communityNamespace.emit('userOffline', { userId: socket.user.id });
        });
    });

    // Private (one-to-one) chat namespace
    const privateNamespace = io.of('/private');
    privateNamespace.use(socketAuthMiddleware);
    privateNamespace.on('connection', (socket) => {
        console.log('Client connected to /private namespace:', socket.user.id);
        onlineUsers.set(socket.user.id, socket.id);
        privateNamespace.emit('userOnline', { userId: socket.user.id });

        socket.on('joinPrivateRoom', (roomId) => {
            console.log('Client joining private room:', roomId, 'User:', socket.user.id);
            socket.join(roomId);
            // Emit current room user count
            const count = privateNamespace.adapter.rooms.get(roomId)?.size || 0;
            privateNamespace.to(roomId).emit('roomUsers', { room: roomId, count });
        });

        // Typing indicators
        socket.on('typing', (roomId) => {
            socket.to(roomId).emit('typing', { userId: socket.user.id });
        });
        socket.on('stopTyping', (roomId) => {
            socket.to(roomId).emit('stopTyping', { userId: socket.user.id });
        });

        // Private message
        socket.on('privateMessage', async (data, callback) => {
            try {
                console.log('Saving private message:', {
                    sender: socket.user.id,
                    receiver: data.receiverId,
                    message: data.message,
                    roomId: data.roomId
                });
                
                const saved = await chatService.createDoctorMessage({ 
                    sender: socket.user.id, 
                    receiver: data.receiverId, 
                    message: data.message 
                });
                
                console.log('Private message saved successfully:', saved._id);
                
                // Emit to all clients in the room (including sender)
                privateNamespace.in(data.roomId).emit('privateMessage', {
                    user: socket.user.username || socket.user.id,
                    message: data.message,
                    timestamp: saved.timestamp,
                    _id: saved._id
                });
                
                if (callback) callback({ delivered: true, messageId: saved._id });
            } catch (err) {
                console.error('Error saving private message:', err);
                if (callback) callback({ delivered: false, error: err.message });
            }
        });

        // Read receipt
        socket.on('messageRead', async ({ messageId }) => {
            await chatService.markMessageRead(messageId, socket.user.id);
            privateNamespace.emit('messageRead', { messageId, userId: socket.user.id });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from /private namespace:', socket.user.id);
            onlineUsers.delete(socket.user.id);
            privateNamespace.emit('userOffline', { userId: socket.user.id });
        });
    });
}

module.exports = setupChatSockets;