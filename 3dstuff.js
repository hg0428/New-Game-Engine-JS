let FPSel = document.getElementById('FPS');
let canvas = document.getElementById('canvas');
canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetHeightl
let ctx = canvas.getContext('2d');
let FOV = 100;
//GO back to 2d mode?????
// ??
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

const SHAPES = {
  rect: function(x, y, w, h) {
    ctx.fillRect(x, y, w, h);
  },
  circle: function(x, y, w, h) {
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, (w + h) / 4, 2 * Math.PI, false);
    ctx.fill();
  }
}// Like the stuff I added?
//Copied from pong game...
// Should I copy the 3d stuff from my 3d engine?
// yes
// brb
// yes
class Camera {
  constructor() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.offsetZ = 0;
    // We need to add camera rotation, and where stuff disapears after we pass it.
  }
  // I made all the current 3d stuff by making up random algorithms, so idk how.
  // hm in the draw method we could just check if the drawn thing is off the screen
  // and we dont have to worry about 3d stuff????
}//Ok, can you add that, I am going to finsih the game look.
var camera = new Camera();
function rectCollide(t1, t2) {
  return t1.x2d + t1.width > t2.x2d && t1.x2d < t2.x2d + t2.width && t1.y2d + t1.height > t2.y2d && t1.y2d < t2.y2d + t2.height;
}
let Things = []; //A list of all things
//Define a class called Thing that we will use for things.
class Thing {
  constructor(name, width, height, x, y, z, shape, color = 'green') {
    this.name = name;
    this.shape = shape;
    this.scale = 1;
    this.size = 1;
    this.x = x;
    this.y = y;
    this.z = z;
    this.realX = 0;
    this.realY = 0;
    this.width = width;
    this.height = height;
    this.color = color;
    this.visible = false;
    this.offsetX = this.offsetY = this.offsetZ = 0;
    this.vel = {
      x:0,
      y:0,
      z:0,
    } // velocity in pixels/milisecond
    Things.push(this);
  }

  update() {
    this.offsetX = camera.offsetX;
    this.offsetY = camera.offsetY;
    this.offsetZ = camera.offsetZ;
    this.size = FOV / (FOV - this.z - this.offsetZ)
    this.realX = (this.x * this.size + this.offsetX) * this.size + canvas.width / 2;
    this.realY = (this.y * this.size + this.offsetY) * this.size + canvas.height / 2;
  }
  draw(elapsed) {
    this.x += this.vel.x * elapsed;
    this.y += this.vel.y * elapsed;
    this.z += this.vel.z * elapsed;
    ctx.fillStyle = this.color;
    this.update();
    this.x2d = (this.realX - (this.width * this.size) / 2);
    this.y2d = (this.realY - (this.height * this.size) / 2);
    ctx.fillText(this.y2d + this.height * this.size > canvas.height, 10, 20)
    if (this.y2d + this.height * this.size > canvas.height) {
      //I think this is proof I'm bad at programming....
      return; // it shouldve not drawn but it still does bruh
      // Yea, thats why I gave up on the old version.
    } 
    
    this.shape(this.x2d, this.y2d, this.width * this.size, this.height * this.size);
  }
}


new Thing("thingy", 50, 50, 20, 20, -20, SHAPES.rect, "red")
//it auto pushes to Things

let lastFrame = 0;
let elapsed = 0;
function gameLoop(t) {
  elapsed = t - lastFrame;
  lastFrame = t;
  FPS = 1000 / elapsed;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height); 
  for (let thing of Things) {
    thing.draw(elapsed);
  }
 if (KEYS.pressed.has('ArrowRight') || KEYS.pressed.has('d')) {
    camera.offsetX -= 1.5 * elapsed;
  }
  if (KEYS.pressed.has('ArrowLeft') || KEYS.pressed.has('a')) {
    camera.offsetX += 1.5 * elapsed;
  }
  if (KEYS.pressed.has('ArrowUp') || KEYS.pressed.has('w')) {
    camera.offsetZ += 0.3 * elapsed;
  }
  if (KEYS.pressed.has('ArrowDown') || KEYS.pressed.has('s')) {
    camera.offsetZ -= 0.5 * elapsed;
  }
  if (KEYS.pressed.has('Shift')) {
    camera.offsetY -= 1.5 * elapsed;
  }
  if (KEYS.pressed.has(' ')) {
    camera.offsetY += 1.5 * elapsed;
  }
  window.requestAnimationFrame(gameLoop);
}

setInterval(() => FPSel.innerText = `FPS: ${FPS.toFixed(1)}`, 500);