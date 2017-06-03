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

  socket.on('tap', (data, callback) => {
    // shorten values to whole numbers
    const cleanX = data.x.toFixed(0);
    const cleanY = data.y.toFixed(0);

    console.log(chalk.yellow(`tap at ${ chalk.inverse(cleanX, '%') }, ${ chalk.inverse(cleanY, '%') }`));

    // this callback is an "acknowledgement". More info @ https://socket.io/docs/server-api/#socket-emit-eventname-args-ack
    callback({ cleanX, cleanY });
  });
});
