/* globals document, io, performance, window */

const socket = io.connect('localhost:8080/controls');

const countElt = document.getElementById('count');
const nounElt = document.getElementById('noun');

socket.on('updateClientCount', (clientsCount) => {
  countElt.innerHTML = clientsCount;
  nounElt.innerHTML = clientsCount === 1 ? 'user' : 'users';
});

const canvas = document.getElementById('feedback');
const ctx = canvas.getContext('2d');
let touches = [];
const maxR = 100;
const maxOpacity = 0.8;
const decay = 3;
const peakAge = 0.1;

function setCanvasDimensions() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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
    return (Math.max((1 - (Math.pow(peakAge - this.age, 2))), 0)) * maxOpacity;
  }

  getRadius() {
    return (Math.max((1 - (Math.pow(peakAge - this.age, 2))), 0)) * maxR;
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
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = this.getOpacity();
    ctx.fillRect(left, top, radius, radius);
    ctx.globalAlpha = 1;
  }
}

// animation cycle
function redrawTouches() {
  touches = touches.filter((touch) => !touch.shouldDisappear());
  touches.forEach((touch) => {
    touch.updateAge();
    touch.redraw();
  });
}

function redrawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  redrawTouches();
  window.requestAnimationFrame(redrawAll);
}

window.requestAnimationFrame(redrawAll);

const touchDevice = 'ontouchend' in window;

document.addEventListener(touchDevice ? 'touchend' : 'click', (e) => {
  const event = touchDevice ? e.changedTouches[0] : e;
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;
  socket.emit('click', { x, y });

  touches.push(new Touch(x, y));
});
