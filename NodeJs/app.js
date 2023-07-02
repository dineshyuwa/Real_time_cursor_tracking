const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with the actual URL of your frontend app
        methods: ['GET', 'POST'] // Add the allowed HTTP methods
    }
});


const PORT = 5000;

let cursorPositions = {};

io.on('connection', (socket) => {

    socket.on('updateUsername', ({ username }) => {
        // Update the username for the corresponding socket
        cursorPositions[socket.id].username = username;

        // Broadcast the updated cursor positions to all connected clients
        io.emit('cursorPositions', cursorPositions);
    });

    socket.on('cursorPosition', (position) => {
        cursorPositions[position.username] = { x: position.x, y: position.y };
        io.emit('cursorPositions', cursorPositions);
    });

    socket.on('disconnect', () => {
        delete cursorPositions[socket.username];
        io.emit('cursorPositions', cursorPositions);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
