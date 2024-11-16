const socketio = require('socket.io');
const { registerUser, removeUser, getAllConnectedUsers } = require('./utils/socketUtil');

let io;

function setupSocket(server) {
    io = socketio(server, {
        cors: { origin: '*' },
        // transports: ['websocket'],
    });

    io.on('connection', (socket) => {
        console.log(socket.handshake.query)
        console.log(`User connected with Socket ID: ${socket.id}`);

        // Listen for user registration with genres
        socket.on('registerUser', (userId, genres) => {
            registerUser(userId, socket.id, genres, io); // Pass io instance here
            console.log('All Connected Users:', getAllConnectedUsers());
        });

        socket.on('joinRoom', (room) => {
            socket.join(room)
            
        })

        // Handle disconnection
        socket.on('disconnect', () => {
            removeUser(socket.id);
            console.log('Updated Connected Users:', getAllConnectedUsers());
        });
    });
}

// Utility to get the initialized Socket.IO instance
function getSocketIO() {
    if (!io) throw new Error('Socket.io not initialized!');
    return io;
}

module.exports = { setupSocket, getSocketIO };
