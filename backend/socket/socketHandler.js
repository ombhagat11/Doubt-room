const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Room = require('../models/Room');

// Store active connections (in-memory, only for persistent server)
const activeUsers = new Map(); // socketId -> { userId, roomId, name, role }
const roomUsers = new Map();   // roomId -> Set of socketIds

module.exports = (io) => {
    // Socket.IO authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication required'));
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
            console.error('Socket auth error:', error.message);
            next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 User connected: ${socket.userName} (${socket.userId})`);

        // Join room
        socket.on('joinRoom', async ({ roomId }) => {
            try {
                if (!roomId) {
                    socket.emit('error', { message: 'Room ID is required' });
                    return;
                }

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

                // Update room active users count
                const activeCount = roomUsers.get(roomId).size;
                await Room.findByIdAndUpdate(roomId, {
                    activeCount,
                    $addToSet: { activeUsers: socket.userId }
                }).catch(err => console.error('Room update error:', err.message));

                // Get current active users info
                const usersInRoom = Array.from(roomUsers.get(roomId))
                    .map(socketId => activeUsers.get(socketId))
                    .filter(Boolean);

                // Broadcast to room
                io.to(roomId).emit('userJoined', {
                    userId: socket.userId,
                    name: socket.userName,
                    role: socket.userRole,
                    activeUsers: usersInRoom,
                    activeCount
                });

                console.log(`📍 ${socket.userName} joined room ${roomId} (${activeCount} users)`);
            } catch (error) {
                console.error('Join room error:', error.message);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        // Leave room
        socket.on('leaveRoom', async ({ roomId }) => {
            if (roomId) {
                await leaveRoomCleanup(roomId, socket.id);
                socket.leave(roomId);
                socket.currentRoom = null;
            }
        });

        // Real-time events - broadcast to room
        socket.on('askQuestion', (data) => {
            if (socket.currentRoom) {
                io.to(socket.currentRoom).emit('newQuestion', {
                    ...data,
                    userName: socket.userName,
                    userRole: socket.userRole
                });
            }
        });

        socket.on('answerQuestion', (data) => {
            if (socket.currentRoom) {
                io.to(socket.currentRoom).emit('newAnswer', {
                    ...data,
                    userName: socket.userName,
                    userRole: socket.userRole
                });
            }
        });

        socket.on('upvoteAnswer', (data) => {
            if (socket.currentRoom) {
                io.to(socket.currentRoom).emit('answerUpvoted', data);
            }
        });

        socket.on('markResolved', (data) => {
            if (socket.currentRoom) {
                io.to(socket.currentRoom).emit('questionResolved', {
                    ...data,
                    resolvedBy: socket.userName
                });
            }
        });

        socket.on('pinQuestion', (data) => {
            if (socket.currentRoom) {
                io.to(socket.currentRoom).emit('questionPinned', data);
            }
        });

        // Typing indicator
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
        socket.on('disconnect', async (reason) => {
            console.log(`🔌 User disconnected: ${socket.userName} (${reason})`);

            if (socket.currentRoom) {
                await leaveRoomCleanup(socket.currentRoom, socket.id);
            }

            activeUsers.delete(socket.id);
        });

        // Error handling
        socket.on('error', (error) => {
            console.error(`Socket error for ${socket.userName}:`, error.message);
        });
    });

    // Helper: clean up when a user leaves a room
    async function leaveRoomCleanup(roomId, socketId) {
        try {
            const userInfo = activeUsers.get(socketId);

            if (roomUsers.has(roomId)) {
                roomUsers.get(roomId).delete(socketId);

                const activeCount = roomUsers.get(roomId).size;

                // Update room in DB
                if (userInfo?.userId) {
                    await Room.findByIdAndUpdate(roomId, {
                        activeCount,
                        $pull: { activeUsers: userInfo.userId }
                    }).catch(err => console.error('Room cleanup error:', err.message));
                }

                // Get remaining users
                const usersInRoom = Array.from(roomUsers.get(roomId))
                    .map(sid => activeUsers.get(sid))
                    .filter(Boolean);

                // Notify room about departure
                io.to(roomId).emit('userLeft', {
                    userId: userInfo?.userId,
                    name: userInfo?.name,
                    activeUsers: usersInRoom,
                    activeCount
                });

                // Clean up empty room tracking
                if (activeCount === 0) {
                    roomUsers.delete(roomId);
                }
            }
        } catch (error) {
            console.error('Leave room cleanup error:', error.message);
        }
    }
};
