const connectedUsers = {};


function registerUser(userId, socketId, genres, io) {
    if (connectedUsers[userId]) {
        console.log(`User ${userId} already connected, updating socket ID and genres.`);
    }

    // Register or update the user in the connectedUsers object
    connectedUsers[userId] = { socketId, genres };
    

    // Join rooms based on genre IDs to match the client file room format `genre_${id}`
    genres.forEach(genre => {
        const room = `genre_${genre.id}`; // Consistent room name format
        io.sockets.sockets.get(socketId).join(room); // Join the room using the socket ID
        console.log(`User ${userId} joined room ${room}`);
    });

    console.log(`User ${userId} registered with socket ID ${socketId} and subscribed genres: ${[...genres]}`);
}


function removeUser(socketId) {
    const userId = Object.keys(connectedUsers).find(id => connectedUsers[id].socketId === socketId);

    if (userId) {
        console.log(`User ${userId} with socket ID ${socketId} disconnected.`);
        delete connectedUsers[userId];
    } else {
        console.log(`Socket ID ${socketId} not found in connected users.`);
    }
}


function getUser(userId) {
    return connectedUsers[userId] || null;
}

function getUserSocketId(userId) {
    return connectedUsers[userId] ? connectedUsers[userId].socketId : null;
}

function getAllConnectedUsers() {
    return connectedUsers;
}

module.exports = {
    registerUser,
    removeUser,
    getUser,
    getAllConnectedUsers,
    getUserSocketId
};
