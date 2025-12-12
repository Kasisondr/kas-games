// Install dependencies: npm install express socket.io node-fetch
const express = require('express');
const fetch = require('node-fetch');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public')); // serve your frontend HTML

const webhookURL = "YOUR_DISCORD_WEBHOOK_URL";

let onlinePlayers = new Set();

// When a player connects via WebSocket
io.on('connection', (socket) => {
    let playerName = socket.handshake.query.name;

    if(playerName && !onlinePlayers.has(playerName)) {
        onlinePlayers.add(playerName);

        // Notify Discord webhook
        fetch(webhookURL, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ content: `${playerName} is online — Online Players: ${onlinePlayers.size}` })
        }).catch(console.error);

        // Notify all clients
        io.emit('playerUpdate', { name: playerName, joined: true, count: onlinePlayers.size });
    }

    socket.on('disconnect', () => {
        if(playerName && onlinePlayers.has(playerName)) {
            onlinePlayers.delete(playerName);

            // Discord webhook
            fetch(webhookURL, {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ content: `${playerName} has left — Online Players: ${onlinePlayers.size}` })
            }).catch(console.error);

            // Notify all clients
            io.emit('playerUpdate', { name: playerName, joined: false, count: onlinePlayers.size });
        }
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));
