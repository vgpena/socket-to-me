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

app.get('/viewer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'viewer.html'));
});

app.use(express.static('public'));

// ============ socket.io server
const io = require('socket.io')(server);

// create a way to refer to specific namespaces
const viewer = io.of('viewer');
const controls = io.of('controls');

// ==== listen for specific events on a socket
function updateControlsCount() {
  controls.clients((err, clients) => {
    if (err) {
      throw new Error(err);
    }

    const controlsCount = clients.length;

    console.log(chalk.yellow.inverse(`${ controlsCount } control${ controlsCount !== 1 ? 's' : '' } connected`));
    viewer.emit('updateControlsCount', controlsCount);
  });
}

// ==== listen for client connections
io.on('connection', () => {
  console.log(chalk.cyan('client connected'));
});

// ==== listen for client connections in namespaces
viewer.on('connection', () => {
  console.log(chalk.magenta('viewer client connected'));
  updateControlsCount();
});

controls.on('connection', (socket) => {
  console.log(chalk.yellow('controls client connected'));
  updateControlsCount();
  socket.on('disconnect', () => {
    console.log(chalk.yellow.dim('controls client disconnected'));
    updateControlsCount();
  });
});
