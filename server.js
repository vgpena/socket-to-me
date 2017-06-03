// ============ general setup
const path = require('path');

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

// ==== listen for specific events on a socket
let tapCount = 0;

function addSocketEvents(socket) {
  // this demos acknowledgement callbacks when the server receives an event over a socket
  socket.on('tap', (_, callback) => {
    tapCount += 1;
    console.log('received tap event');
    callback(`tap has been called ${ tapCount } time${ tapCount === 1 ? '' : 's' }`);
  });
}

// ==== listen for client connection
io.on('connection', (socket) => {
  addSocketEvents(socket);
});
