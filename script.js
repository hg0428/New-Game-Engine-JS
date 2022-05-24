let FPSel = document.getElementById('FPS');


const SHAPES = {
  rect: function(ctx, x, y, w, h) {
    ctx.fillRect(x, y, w, h);
  },
  circle: function(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, (w + h) / 4, 2 * Math.PI, false);
    ctx.fill();
  }
}

class Camera {
  constructor() {
    this.offsetX = 0;
    this.offsetY = 0;
    // We need to add camera rotation.
  }
}

//var camera = new Camera();
function rectCollide(t1, t2) {
  return t1.x2d + t1.width > t2.x2d && t1.x2d < t2.x2d + t2.width && t1.y2d + t1.height > t2.y2d && t1.y2d < t2.y2d + t2.height;
}
// I like that kaboom has scenes so maybe we can have them too?

//Yes, and a trackpad. They magneticly attach to my ipad
class Game {
  constructor(opts) {
    this.camera = new Camera();
    this.things = []
    this.background = opts.background || "white"
    this.canvas = document.querySelector(opts.canvas || "canvas")
    this.context = canvas.getContext("2d")
    canvas.width = opts.width || document.body.offsetWidth;
    canvas.height = opts.height || document.body.offsetHeight;
    this.friction = 1;
    this.hooks = {}
    const parent = this;
    this.Thing = class {
      constructor({ width, height, x, y, shape, color }) {
        this.shape = shape    || SHAPES.rect;
        this.x = x            || 30;
        this.y = y            || 30;
        this.width =  width   || 20;
        this.height = height  || 20;
        this.color =  color   || "green";
        this.visible = false;
        this.realX = 0;
        this.realY = 0;
        this.vel = {
          x: 0,
          y: 0,
        } // velocity in pixels/milisecond
        parent.things.push(this);
      }
      update() {
        // cant we  just draw from top-left since we are not doing 3d anymore
        // But, I think it simply makes sense that the orgin is in the center, plus, this converts it for us. realX and realY are the top-left ones.
        // And realX and realY also take the camera's offset into account
        this.realX = (this.x - this.width / 2) + canvas.width / 2 + parent.camera.offsetX;
        this.realY = (this.y - this.height / 2) + canvas.height / 2 + parent.camera.offsetY;
      }
      draw(elapsed) {
        //Should we have x-gravity and y-gravity?
        // try moving the controls are switched up i think FIXED.
        // rn we are moving in 1st person.
        // 1st person is weird in 2d.
        // controls good now

        this.vel.x *= (parent.friction || 1) * elapsed;
        this.vel.y *= (parent.friction || 1) * elapsed; // if its 1 it never stops
        //1 == no friction, 0 == no movement at all.
        //No, add that as a setting for game, like game.friction.
        //Default it to no friction.  still switched up i think
        //Too fast of movement...
        // to do 3rd person we just need a player to move. 
        this.x += this.vel.x * elapsed;
        this.y += this.vel.y * elapsed;
        this.update();
        ctx.fillStyle = this.color;
        this.shape(parent.context, this.realX, this.realY, this.width, this.height);
      }
    }
  }

  hook(for_, hook) {
    if (!this.hooks[for_]) this.hooks[for_] = []
    this.hooks[for_].push(hook)
  }

  triggerHook(for_) {
    if (this.hooks[for_])
      for (let i = 0; i < this.hooks[for_].length; i++)
          this.hooks[for_]()
  }

  start() {
    
  }
}


const game = new Game()
game.friction = 0.01;
const player = new game.Thing("player", 50, 50, 0, 0, SHAPES.circle, "green")

// I have an idea
// we could have a component sytem like
/*

mything.add(
    gravityComponent({
      gravity: 0.1
    }),
    physicsComponent(),
)
My old game engine had mass and auto calculated basic physics for everything.
Infinity means inmovable.
Does the gravity component give the Thing gravity, or does it apply gravity to the Thing??? I think its better if we take the more realistic approach of adding forces with different effects, like creating forces, like gravity, magent and stuff like that, and then choosing like how it slows down at a distance (I couldn't think of the words for it.)
I'm bad at explaining stuff
So we are going to use the component system?
I'm not sure. We should probably start making multiple drafts of how to use the engine in some other files.
*/

let lastFrame = 0;
let elapsed = 0;
function gameLoop(t) {
  elapsed = t - lastFrame;
  lastFrame = t;
  FPS = 1000 / elapsed;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
   for(let thing of game.things) {
    thing.draw(elapsed);
  }
  //I was looking at my other game engine, and we have a lot to do to get to where that one is.
  //It has camera zooming, camera rotation, thing rotation, thing scaling.
  //viewport skewing, all kinds of crazy stuff. And its camera system was way more advanced.
  //It used a this.canvas and this.ctx
  // the box is not drawing for me
  //me either, any errors in console?
  if (KEYS.pressed.has('ArrowRight') || KEYS.pressed.has('d')) {
    player.vel.x = 1 * elapsed;
  }
  if (KEYS.pressed.has('ArrowLeft') || KEYS.pressed.has('a')) {
    player.vel.x = -1 * elapsed;
  }
  if (KEYS.pressed.has('ArrowUp') || KEYS.pressed.has('w')) {
    player.vel.y = -1 * elapsed;
  }
  if (KEYS.pressed.has('ArrowDown') || KEYS.pressed.has('s')) {
    player.vel.y = 1 * elapsed;
  }
  window.requestAnimationFrame(gameLoop);
}
//Does it work?
setInterval(() => FPSel.innerText = `FPS: ${FPS.toFixed(1)}`, 500);