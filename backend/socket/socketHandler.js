const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Room = require('../models/Room');

// Store active connections
const activeUsers = new Map(); // socketId -> { userId, roomId, name, role }
const roomUsers = new Map(); // roomId -> Set of socketIds

module.exports = (io) => {
    // Socket.IO middleware for authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user || !user.isActive) {
                return next(new Error('User not found or inactive'));
            }

            socket.userId = user._id.toString();
            socket.userName = user.name;
            socket.userRole = user.role;

            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userName} (${socket.userId})`);

        // Join room
        socket.on('joinRoom', async ({ roomId }) => {
            try {
                const room = await Room.findById(roomId);

                if (!room || !room.isActive) {
                    socket.emit('error', { message: 'Room not found or inactive' });
                    return;
                }

                // Leave previous room if any
                if (socket.currentRoom) {
                    socket.leave(socket.currentRoom);
                    await leaveRoomCleanup(socket.currentRoom, socket.id);
                }

                // Join new room
                socket.join(roomId);
                socket.currentRoom = roomId;

                // Track user in room
                activeUsers.set(socket.id, {
                    userId: socket.userId,
                    roomId,
                    name: socket.userName,
                    role: socket.userRole
                });

                if (!roomUsers.has(roomId)) {
                    roomUsers.set(roomId, new Set());
                }
                roomUsers.get(roomId).add(socket.id);

                // Update room active users
                const activeCount = roomUsers.get(roomId).size;
                await Room.findByIdAndUpdate(roomId, {
                    activeCount,
                    $addToSet: { activeUsers: socket.userId }
                });

                // Get current active users in room
                const usersInRoom = Array.from(roomUsers.get(roomId))
                    .map(socketId => activeUsers.get(socketId))
                    .filter(Boolean);

                // Notify room
                io.to(roomId).emit('userJoined', {
                    userId: socket.userId,
                    name: socket.userName,
                    role: socket.userRole,
                    activeUsers: usersInRoom,
                    activeCount
                });

                console.log(`${socket.userName} joined room ${roomId}`);
            } catch (error) {
                console.error('Join room error:', error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        // Leave room
        socket.on('leaveRoom', async ({ roomId }) => {
            await leaveRoomCleanup(roomId, socket.id);
            socket.leave(roomId);
            socket.currentRoom = null;
        });

        // New question posted
        socket.on('askQuestion', (data) => {
            if (socket.currentRoom) {
                io.to(socket.currentRoom).emit('newQuestion', {
                    ...data,
                    userName: socket.userName,
                    userRole: socket.userRole
                });
            }
        });

        // New answer posted
        socket.on('answerQuestion', (data) => {
            if (socket.currentRoom) {
                io.to(socket.currentRoom).emit('newAnswer', {
                    ...data,
                    userName: socket.userName,
                    userRole: socket.userRole
                });
            }
        });

        // Answer upvoted
        socket.on('upvoteAnswer', (data) => {
            if (socket.currentRoom) {
                io.to(socket.currentRoom).emit('answerUpvoted', data);
            }
        });

        // Question resolved
        socket.on('markResolved', (data) => {
            if (socket.currentRoom) {
                io.to(socket.currentRoom).emit('questionResolved', {
                    ...data,
                    resolvedBy: socket.userName
                });
            }
        });

        // Question pinned
        socket.on('pinQuestion', (data) => {
            if (socket.currentRoom) {
                io.to(socket.currentRoom).emit('questionPinned', data);
            }
        });

        // User typing indicator
        socket.on('typing', ({ questionId, isTyping }) => {
            if (socket.currentRoom) {
                socket.to(socket.currentRoom).emit('userTyping', {
                    questionId,
                    userId: socket.userId,
                    userName: socket.userName,
                    isTyping
                });
            }
        });

        // Disconnect
        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${socket.userName}`);

            if (socket.currentRoom) {
                await leaveRoomCleanup(socket.currentRoom, socket.id);
            }

            activeUsers.delete(socket.id);
        });
    });

    // Helper function to clean up room on leave
    async function leaveRoomCleanup(roomId, socketId) {
        try {
            const userInfo = activeUsers.get(socketId);

            if (roomUsers.has(roomId)) {
                roomUsers.get(roomId).delete(socketId);

                const activeCount = roomUsers.get(roomId).size;

                // Update room
                await Room.findByIdAndUpdate(roomId, {
                    activeCount,
                    $pull: { activeUsers: userInfo?.userId }
                });

                // Get remaining users
                const usersInRoom = Array.from(roomUsers.get(roomId))
                    .map(sid => activeUsers.get(sid))
                    .filter(Boolean);

                // Notify room
                io.to(roomId).emit('userLeft', {
                    userId: userInfo?.userId,
                    name: userInfo?.name,
                    activeUsers: usersInRoom,
                    activeCount
                });

                // Clean up empty room
                if (activeCount === 0) {
                    roomUsers.delete(roomId);
                }
            }
        } catch (error) {
            console.error('Leave room cleanup error:', error);
        }
    }
};
