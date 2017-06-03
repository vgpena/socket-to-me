const path = require('path');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const users = io.of('/controls');
const viewer = io.of('/viewer');

// ========================

server.listen(8080);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/controls', (req, res) => {
  res.sendFile(path.join(__dirname, 'controls.html'));
});

app.use(express.static('public'));

// ========================

function sendClientsCount() {
  users.clients((err, clients) => {
    if (err) {
      throw new Error(err);
    }
    users.emit('updateClientCount', clients.length);
    viewer.emit('updateClientCount', clients.length);
  });
}

function addSocketEvents(socket) {
  socket.on('click', (data) => {
    viewer.emit('click', data);
  });

  socket.on('disconnect', () => {
    sendClientsCount();
  });
}

// =========================

users.on('connection', (socket) => {
  addSocketEvents(socket);
  sendClientsCount();
});

viewer.on('connection', () => {
  sendClientsCount();
});
