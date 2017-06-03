/* global document, io, performance, window */

// global / environmental
const socket = io.connect('localhost:8080/viewer');

// for animations

const canvas = document.getElementById('viewer');
const ctx = canvas.getContext('2d');
let touches = [];
const maxR = 300;
const maxOpacity = 0.8;
const decay = 3;
const peakAge = 0.1;
let clients = 0;

function setCanvasDimensions() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function getBackgroundHue() {
  return (clients * 10) % 255;
}

function getBackgroundSaturation() {
  return 50 + touches.length;
}

setCanvasDimensions();

window.addEventListener('resize', () => {
  setCanvasDimensions();
});

class Touch {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.created = performance.now();
    this.age = 0;
  }

  updateAge() {
    this.age = Math.min((performance.now() - this.created) / (1000 * decay), 1);
  }

  shouldDisappear() {
    return this.age === 1;
  }

  getOpacity() {
    return (Math.max((1 - (Math.abs(peakAge - this.age) ** 2)), 0)) * maxOpacity;
  }

  getRadius() {
    return (Math.max((1 - (Math.abs(peakAge - this.age) ** 2)), 0)) * maxR;
  }

  getFeather() {
    return 0.5 + (0.5 * this.age);
  }

  redraw() {
    const radius = this.getRadius();
    const left = (window.innerWidth * (this.x / 100)) - (radius / 2);
    const top = (window.innerHeight * (this.y / 100)) - (radius / 2);
    const centerX = left + (radius / 2);
    const centerY = top + (radius / 2);
    const gradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, 0);
    gradient.addColorStop(this.getFeather(), 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = this.getOpacity();
    ctx.fillRect(left, top, radius, radius);
    ctx.globalAlpha = 1;
  }
}

// animation cycle
function redrawBackground() {
  ctx.fillStyle = `hsla(${ getBackgroundHue() }, ${ getBackgroundSaturation() }%, 80%, 1)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function redrawTouches() {
  touches = touches.filter((touch) => !touch.shouldDisappear());
  touches.forEach((touch) => {
    touch.updateAge();
    touch.redraw();
  });
}

function redrawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  redrawBackground();
  redrawTouches();
  window.requestAnimationFrame(redrawAll);
}

window.requestAnimationFrame(redrawAll);


// socket events
socket.on('click', (data = { x: Math.random() * 90, y: Math.random() * 90 }) => {
  touches.push(new Touch(data.x, data.y));
});

socket.on('updateClientCount', (clientsCount) => {
  clients = clientsCount;
});
