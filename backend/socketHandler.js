const { Server } = require('socket.io');

let io;
// userConnections maps userId -> Set of socketIds
const userConnections = new Map(); 
// socketToUser maps socketId -> userId for quick lookup on disconnect
const socketToUser = new Map(); 

exports.initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:5174'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Frontend fires this when a user logs in or mounts the app
        socket.on('register', (userId) => {
            if (!userId) return;
            
            socketToUser.set(socket.id, userId);
            
            if (!userConnections.has(userId)) {
                userConnections.set(userId, new Set());
            }
            userConnections.get(userId).add(socket.id);
            
            console.log(`User ${userId} registered to socket ${socket.id}`);
            
            // Broadcast to everyone that the active user list changed
            io.emit('onlineUsers', Array.from(userConnections.keys()));
        });

        socket.on('disconnect', () => {
            const userId = socketToUser.get(socket.id);
            if (userId) {
                const userSockets = userConnections.get(userId);
                if (userSockets) {
                    userSockets.delete(socket.id);
                    // If the user has no more active socket connections, they are truly offline
                    if (userSockets.size === 0) {
                        userConnections.delete(userId);
                        console.log(`User ${userId} fully disconnected (Offline).`);
                        io.emit('onlineUsers', Array.from(userConnections.keys()));
                    } else {
                        console.log(`User ${userId} disconnected a tab, but still has ${userSockets.size} active connections.`);
                    }
                }
                socketToUser.delete(socket.id);
            }
        });

        // --- Chat Features ---

        // Typing indicator
        socket.on('typing', ({ senderId, receiverId }) => {
            const receiverSockets = userConnections.get(receiverId);
            if (receiverSockets) {
                for (const socketId of receiverSockets) {
                    io.to(socketId).emit('typing', senderId);
                }
            }
        });

        // Stop typing indicator
        socket.on('stop_typing', ({ senderId, receiverId }) => {
            const receiverSockets = userConnections.get(receiverId);
            if (receiverSockets) {
                for (const socketId of receiverSockets) {
                    io.to(socketId).emit('stop_typing', senderId);
                }
            }
        });

        // Mark messages as seen
        socket.on('mark_seen', async ({ otherUserId, userId }) => {
            try {
                // If the user currently viewing (userId) opens chat with otherUserId,
                // all messages SENT BY otherUserId to userId should be marked 'seen'.
                const { Message } = require('./models');
                const { Op } = require('sequelize');
                
                await Message.update(
                    { status: 'seen' },
                    {
                        where: {
                            senderId: otherUserId,
                            receiverId: userId,
                            status: { [Op.ne]: 'seen' }
                        }
                    }
                );

                // Notify the sender (otherUserId) that their messages were seen
                const senderSockets = userConnections.get(otherUserId);
                if (senderSockets) {
                    for (const socketId of senderSockets) {
                        io.to(socketId).emit('messages_seen', userId);
                    }
                }
            } catch (err) {
                console.error('Error marking seen:', err);
            }
        });
    });
};

exports.getIo = () => io;

exports.isUserOnline = (userId) => {
    return userConnections.has(userId) && userConnections.get(userId).size > 0;
};

exports.emitToUser = (userId, event, data) => {
    const userSockets = userConnections.get(userId);
    if (userSockets && io) {
        // Emit to all active sockets for this user
        for (const socketId of userSockets) {
            io.to(socketId).emit(event, data);
        }
    }
};
