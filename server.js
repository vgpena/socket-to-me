// ============ general setup
const path = require('path');

// for pretty console colors 🌈
const chalk = require('chalk');

// ============ express static server
const express = require('express');

const port = 8080;
const app = express();
const server = require('http').Server(app);

server.listen(port, () => {
  console.log(`server listening on port ${ port }`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static('public'));

// ============ socket.io server
const io = require('socket.io')(server);

// ==== listen for client connection
io.on('connection', (socket) => {
  socket.on('message', (text) => {
    console.log(chalk.cyan(`received message: "${ text }"`));
  });

  // once a socket has connected, listen for a specific incoming event from that socket
  socket.on('tap', () => {
    console.log(chalk.magenta('tap event received'));
    // emit event to all sockets
    io.emit('tapResponse');
    // emit event only to socket that sent original tap event
    socket.emit('myTap');
    // emit event only to sockets that did NOT send original tap event
    socket.broadcast.emit('notMyTap');
  });
});
