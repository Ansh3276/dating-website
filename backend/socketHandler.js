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
    });
};

exports.getIo = () => io;

exports.emitToUser = (userId, event, data) => {
    const userSockets = userConnections.get(userId);
    if (userSockets && io) {
        // Emit to all active sockets for this user
        for (const socketId of userSockets) {
            io.to(socketId).emit(event, data);
        }
    }
};
