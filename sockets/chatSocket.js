const { verifyToken } = require('../middlewares/authMiddleware');
const chatService = require('../services/chatService');

const onlineUsers = new Map(); // userId -> socketId

function socketAuthMiddleware(socket, next) {
    const token = socket.handshake.auth?.token;
    const user = verifyToken(token);
    if (!user) {
        return next(new Error('Authentication error: Invalid or missing token'));
    }
    socket.user = user;
    next();
}

function setupChatSockets(io) {
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
                const saved = await chatService.createCommunityMessage({ sender: socket.user.id, message: data.message });
                // Emit to all other clients in the room
                socket.broadcast.to(data.room).emit('communityMessage', {
                    user: socket.user.username || socket.user.id,
                    message: data.message,
                    timestamp: saved.timestamp,
                    _id: saved._id
                });
                // Emit only to the sender
                socket.emit('communityMessage', {
                    user: socket.user.username || socket.user.id,
                    message: data.message,
                    timestamp: saved.timestamp,
                    _id: saved._id
                });
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
            callback(messages);
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
        onlineUsers.set(socket.user.id, socket.id);
        privateNamespace.emit('userOnline', { userId: socket.user.id });

        socket.on('joinPrivateRoom', (roomId) => {
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
            const saved = await chatService.createDoctorMessage({ sender: socket.user.id, receiver: data.receiverId, message: data.message });
            privateNamespace.to(data.roomId).emit('privateMessage', {
                user: socket.user.username || socket.user.id,
                message: data.message,
                timestamp: saved.timestamp,
                _id: saved._id
            });
            if (callback) callback({ delivered: true, messageId: saved._id });
        });

        // Read receipt
        socket.on('messageRead', async ({ messageId }) => {
            await chatService.markMessageRead(messageId, socket.user.id);
            privateNamespace.emit('messageRead', { messageId, userId: socket.user.id });
        });

        socket.on('disconnect', () => {
            onlineUsers.delete(socket.user.id);
            privateNamespace.emit('userOffline', { userId: socket.user.id });
        });
    });
}

module.exports = setupChatSockets; 