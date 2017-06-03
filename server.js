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
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static('public'));

// ============ socket.io server
const io = require('socket.io')(server);

// ==== listen for client connection
io.on('connection', (socket) => {
  socket.on('message', (text) => {
    console.log(chalk.cyan(`received message: "${ text }"`));
  });
});
