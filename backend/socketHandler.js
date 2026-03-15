const { Server } = require('socket.io');

let io;
const onlineUsers = new Map(); // Maps userId -> socket.id

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
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} registered to socket ${socket.id}`);
            
            // Broadcast to everyone that the active user list changed
            io.emit('onlineUsers', Array.from(onlineUsers.keys()));
        });

        socket.on('disconnect', () => {
            let disconnectedUserId = null;
            // Find the user associated with this socket
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    onlineUsers.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                console.log(`User ${disconnectedUserId} disconnected.`);
                io.emit('onlineUsers', Array.from(onlineUsers.keys()));
            }
        });
    });
};

exports.getIo = () => io;

exports.emitToUser = (userId, event, data) => {
    const socketId = onlineUsers.get(userId);
    if (socketId && io) {
        io.to(socketId).emit(event, data);
    }
};
