let FPSel = document.getElementById('FPS');
/*
Sources for Ideas:
https://stackoverflow.com/questions/26661909/setting-a-correct-angular-velocity-to-a-canvas-object
https://stackoverflow.com/questions/1616448/broad-phase-collision-detection-methods
*/
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
        this.zoom = 1;
        this.rotation = 0;
        // We need to add camera rotation. and zooming
        //add methods for world to screen and vice versa
    } 
    rotateRad(rad) {
      this.rotation += rad
    }
    rotateDeg(deg) {
      this.rotation += deg * Math.PI / 180;
    }
}


function rectCollide(t1, t2) {
    return (t1.left < t2.right &&
        t1.right > t2.left &&
        t1.top < t2.bottom &&
        t1.bottom > t2.top);
};
//hmmm, did you test them?ok
// these functions work because I copied them lmao
// come to the update  thing  yes
function lineLineCollide(x1, y1, x2, y2, x3, y3, x4, y4) {
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    const intersectionX = x1 + (uA * (x2 - x1));
    const intersectionY = y1 + (uA * (y2 - y1));
    return { collision: true, x: intersectionX, y: intersectionY };
  }
  return { collision: false };
}

function rectLineCollide(rect, line) {
    const left   = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x, rect.y + rect.height)
    if (left.collision)
        return { collision: true, x: left.x, y: left.y }

    const right  = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height)
    if (right.collision)
        return { collision: true, x: right.x, y: right.y }
    
    const top    = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x + rect.width, rect.y)
    if (top.collision)
        return { collision: true, x: top.x, y: top.y }
    
    const bottom = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y + rect.height, rect.x + rect.width, rect.y + rect.height)
    if (bottom.collision)
        return { collision: true, x: bottom.x, y: bottom.y }
    
    return { collision: false };
}

class Game {
    constructor(opts) {
        opts = opts || {};

        this.camera = new Camera();
        this.things = [];
        this.usedIDs = [];
        this.FPS = 0;
        this.deltaTime = 0;
        this.background = opts.background || "white";
        this.canvas = document.querySelector(opts.canvas || "canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = opts.width || document.body.offsetWidth;
        this.canvas.height = opts.height || document.body.offsetHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.friction = opts.friction || 1;
        this.hooks = [];
        this.texts = [];
        this.running = false;
        const parent = this;
        this.Text = class {
            constructor({
                text,
                color,
                background,
                width,
                x,
                y,
                size,
                font,
                align,
                overhead,
            }) {
                this.text = text
                this.overhead = overhead || false;
                this.color = color || "black"
                this.background = background
                this.width = width
                this.x = x || 0
                this.y = y || 0
                this.size = size || 20
                this.font = font || "Arial"
                this.align = align || "left"
                parent.texts.push(this)
            }

            draw() {
              //I have a really great idea, but it will require some work.
              //It will make things harder internally, but make it so so much easier for the user.
              //We move all attributes to a .data object or something like that, and then have a setter and getter for all of them, that way the user can do:
              //thing.x = 9908, and it will auto calculate all the new values for everything.
              //They could set thing.left, thing.right, etc and it would calculate everything else.
                // well it would speed the engine up ig
              //I was thinking it would make it slightly slower?
              //WHich is faster? a setter function and a getter function or  this.x=8 and recalculate it every time. true. Wanna add it?  
              //Yes, but think about how much easier it would be if the user could simply set any value on the Thing, and everything would automatically adjust.
              //No, if I do ball.left = 60, it will just break the program, because if in our update loop we updated that, it would loop and not work.
              //But, if it could be modifyied, that would make it so much easier instead of ball.x = ball.x - this.left.
              //I feel like this way would be easier for the user....
              //btw, I originally set coords to center because it made it easier to draw circles.
              //And it would make it a lot more efficient than adding functions everywhere.
              // ima  finish fonts
              //ok, fine.ok
                parent.context.textAlign = this.align
                parent.context.font = `${this.size}px ${this.font}`
                if (this.background) {
                  parent.context.fillStyle = this.background
                  parent.context.fillRect(this.x, this.y, parent.context.measureText(this.text), this.size)
                }
                parent.context.fillStyle = this.color
                parent.context.fillText(this.text, this.x, this.y)
            }
        }
        this.Thing = class {
            constructor({
                width,
                height,
                x,
                y,
                shape,
                background,
                radius,
                collisions,
                overhead,
                ...opts
            }) {
                //Did I do the typeof right? yes
                this.overhead = overhead || false;
                this.name = opts.name || 'unidentified';
                if (typeof shape == 'string')
                    shape = SHAPES[shape];
                this.shape = shape || SHAPES.rect
                this._data = {
                  width: width || radius * 2 || 20,
                  height: height || radius * 2 || 20,
                  radius: radius || (width + height) / 2,
                  x: x || 0,
                  y: y || 0,
                  top: (y || 0) - 0.5 * (height || radius * 2 || 20),
                  left: (x || 0) - 0.5 * (width || radius * 2 || 20),
                  bottom: (y || 0) + 0.5 * (height || radius * 2 || 20),
                  right: (x || 0) + 0.5 * (width || radius * 2 || 20),
                }
				        this.id = Random.string(12) + this.name;
                this.background = background || "green";
                this.visible = false;
                this.realX = 0;
                this.realY = 0;
                this.checkCollisions = collisions || true;
                this.collisions = {};
                this.events = {};
                this.prevX = 0;
                this.prevY = 0;
                this.vel = {
                    x: 0,
                    y: 0,
                }
                this.destination = null;
                parent.things.push(this);
            }
            get x() {
              return this._data.x;
            } set x(val) {
              this._data.x = val;
              this._data.left = val - this.width/2;
              this._data.right = val + this.width/2;
            }
            get y() {
              return this._data.y;
            } set y(val) {
              this._data.y = val;
              this._data.top = val - this.height/2;
              this._data.bottom = val + this.height/2;
            }
            get left() {
              return this._data.left;
            } set left(val) {
              this._data.left = val;
              this._data.x = val + this.width/2;
              this._data.right = val + this.width;
            }
            get top() {
              return this._data.top;
            } set top(val) {
              this._data.top = val;
              this._data.y = val + this.height/2;
              this._data.bottom = val + this.height;
            }
            get right() {
              return this._data.right;
            } set right(val) {
              this._data.right = val;
              this._data.x = val - this.width/2;
              this._data.left = val - this.width;
            }
            get bottom() {
              return this._data.bottom;
            } set bottom(val) {
              this._data.bottom = val;
              this._data.y = val - this.height/2;
              this._data.top = val - this.height;
            }
            get width() {
              return this._data.width;
            } set width(val) {
              this._data.width = val;
              this._data.left = this._data.x - val/2;
              this._data.right = this._data.x + val/2;
            }
            get height() {
              return this._data.height;
            } set height(val) {
              this._data.height = val;
              this._data.top = this._data.y - val/2;
              this._data.bottom = this._data.y + val/2;
            }
            get radius() {
              return this._data.radius;
            } set radius(val) {
              this._data.radius = val;
              this._data.width = val * 2;
              this._data.height = val * 2;
              this._data.left = this._data.x - val;
              this._data.right = this._data.x + val;
              this._data.top = this._data.y - val;
              this._data.bottom = this._data.y + val;
            }
          
            
            /*get id() {
              delete this.id;
              return 
            }*/
            delete() {
              parent.things = parent.things.filter(x => x !== this);
              //delete this;
              //if (inst) delete inst;
            }

            getCollider() {
                let rectCollider = {
                    left: this.left,
                    top: this.top,
                    right: this.right,
                    bottom: this.bottom,
                    width: this.width,
                    height: this.height,
                    x: this.x,
                    y: this.y,
                    prevX: this.prevX,
                    prevY: this.prevY
                }

                if (this.shape === SHAPES.circle) {
                    rectCollider.width -= 0;
                    rectCollider.height -= 0;
                }

                return rectCollider;
            }

            collided(other, cb) {
                if (!Array.isArray(other)) {
                    if (!this.collisions[other.id]) this.collisions[other.id] = []
                    this.collisions[other.id].push(cb)
                } else {
                    for (let oth of other) {
                        if (!this.collisions[oth.id]) this.collisions[oth.id] = []
                        this.collisions[oth.id].push(cb)
                    }
                }
            }

            when(evt, cb) {
                if (!this.events[evt]) this.events[evt] = []
                this.events[evt].push(cb)
            }

            triggerEvent(name) {
                if (this.events[name])
                    for (let cb of this.events[name]) cb()
            }

            posUpdate() {
                this.top = this.y - this.height / 2;
                this.left = this.x - this.width / 2;
                this.bottom = this.y + this.height / 2;
                this.right = this.x + this.width / 2;
                this.realX = this.left + (parent.width / 2);
                this.realY = this.top + (parent.height / 2);
                if (!this.overhead) {
                  this.realX += parent.camera.offsetX;
                  this.realY += parent.camera.offsetY;
                }
            }

            distanceTo(other) {
              return Math.sqrt( (this.x - other.x) ** 2 + (this.y - other.y) ** 2 )
            }

            update() {
                /*
                this.vel.x *= (parent.friction || 1);
                this.vel.y *= (parent.friction || 1);

                parent.context.lineWidth = 3
                parent.context.strokeStyle = "green"
                parent.context.strokeRect(rectCollider.x, rectCollider.y, rectCollider.width, rectCollider.height)
                */

                this.prevX = this.x;
                this.prevY = this.y;
                if (this.vel.y!=0) this.y += this.vel.y * parent.deltaTime;
                if (this.vel.x!=0) this.x += this.vel.x * parent.deltaTime;
                /*
                Problems with our Collision Detection: 
                  1. Its very expensive to check every object against every other object even if they are a thousand pixels away. 
                  2. Fast objects are able to go through any other object without the collision being detected.

                Potential Solutions:
                  1. A broad phase where we decide which ones to check by if their y positions overlap at all. Or some other type of broad phase.
                  2. Draw a line between the current position and projected position and check if that line intersects with the object. Or some other solution
                */
                for (let other of parent.things.filter(x => {
                  // Check if the object is not itself
                  return x.id !== this.id && x.checkCollisions
                })) { // more down
                    let rectCollider = other.getCollider(); // I feel like we don't need this.
                    let rectCollider2 = this.getCollider(); // I feel like we don't need this.
    
                    // I only added the .getCollider() method because we can only check
                    // collisions between rectangles for now, we can remove it once we 
                    // can check other types or collisions too.

                    //We use 1/2 width and height a lot, maybe we should just add that as an attribute.
                    //That would save us from recalculating it every time.
                    let t1HalfW = this.width / 2;
                    let t1HalfH = this.height / 2;
                    let t2HalfW = other.width / 2;
                    let t2HalfH = other.height / 2;

                    // Only check objects that are in range
                    if (
                        this.distanceTo(other) <  rectCollider2.width  +
                                                  rectCollider.width   +
                                                  rectCollider2.height +
                                                  rectCollider.height  &&
                        rectCollide(rectCollider, rectCollider2)
                    ) {
                        
                        // Calculate the distance between centers
                        let diffX = this.x - other.x;
                        let diffY = this.y - other.y;
    
                        // Calculate the minimum distance to separate along X and Y
                        let minXDist = t1HalfW + t2HalfW;
                        let minYDist = t1HalfH + t2HalfH;
    
                        // Calculate the depth of collision for both the X and Y axis
                        let depthX = diffX > 0 ? minXDist - diffX : -minXDist - diffX;
                        let depthY = diffY > 0 ? minYDist - diffY : -minYDist - diffY;
    
                        // Now that you have the depth, you can pick the smaller depth and move along that axis.
                        let axis, side;
                        if (depthX != 0 && depthY != 0) {
                            if (Math.abs(depthX) < Math.abs(depthY)) {
                                axis = 'x';
                                // Collision along the X axis.
                                if (depthX > 0) {
                                    side = 'left';
                                    // Left side collision
                                } else {
                                    side = 'right';
                                    // Right side collision
                                }
                            } else {
                                axis = 'y';
                                // Collision along the Y axis.
                                if (depthY > 0) {
                                    side = 'top';
                                    // Top side collision
                                } else {
                                    side = 'bottom';
                                    // Bottom side collision
                                }
                            }
                        }
                        if (this.collisions[other.id])
                            this.collisions[other.id].forEach(cb => cb(axis, side, this, other));
                    }
                }
            }

            draw() {
                this.update();

                this.triggerEvent("moved");
                this.posUpdate();

                parent.context.fillStyle = this.background;

                this.shape(parent.context, this.realX, this.realY, this.width, this.height);
                if (this.destination) {
                  if ((this.destination[0] == '*' || this.destination[0] == this.x) && (this.destination[1] == '*' || this.destination[1] == this.y)) {
                      this.destination = null;
                      return;
                  }
                  let d = this.destination;
                  if (d[0] != '*' && this.x + this.vel.x/1000 >= d[0] && this.vel.x > 0) {
                      this.vel.x = 0;
                      this.x = d[0];
                  } else if (d[0] != '*' && this.x + this.vel.x/1000 <= d[0] && this.vel.x < 0) {
                      this.vel.x = 0;
                      this.x = d[0];
                  }
                  if (d[1] != '*' && this.y + this.vel.y/1000 >= d[1] && this.vel.y > 0) {
                      this.vel.y = 0;
                      this.y = d[1];
                  } else if (d[1] != '*' && this.y + this.vel.y/1000 <= d[1] && this.vel.y < 0) {
                      this.vel.y = 0;
                      this.y = d[1];
                  }
                }
            } 
            to(x, y, speedX, speedY) {
                if (x == '*') speedX = 0;
                else if (speedX == 0) x = '*'
                if (y == '*') speedY = 0;
                else if (speedY == 0) y = '*'
                this.destination = [x, y];
                if (x > this.x) this.vel.x = speedX;
                else this.vel.x = -speedX;
                if (y > this.y) this.vel.y = speedY;
                else this.vel.y = -speedY;
            } 
        }
    }

    hook(for_, hook) {
        if (!this.hooks[for_]) this.hooks[for_] = [];
        this.hooks[for_].push(hook);
    }

    triggerHook(for_, ...params) {
        if (this.hooks[for_])
            for (let i = 0; i < this.hooks[for_].length; i++)
                this.hooks[for_][i](...params);
    }
    getCurrentState() {
      //finish later
    }
    saveState(id) {
      //Save the current state of the game and everything in it to restore later.
      //game.saveState(0)
      //game.restoreState(0)
      //finish later
      this._states[id] = this.getCurrentState();
    }
    restoreState(id) {
      //finish later
    }
    start() {
        this.running = true;
        let elapsed = 0;
        let lastFrame = 0;

        const self = this;

        function gameLoop(t) {
            self.triggerHook("gameloop");
            elapsed = t - lastFrame;
            lastFrame = t;

            // NOTE: CHANGED ELAPSED TO BE SECONDS (deltaTime, draw method)
            self.deltaTime = elapsed / 1000;
            self.FPS = 1000 / elapsed;
            self.context.fillStyle = self.background;
            self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);

            for (let ev of KEYS.events.held) {
                if (KEYS.pressed.has(ev.key)) ev.callback()
            }

            for (let thing of self.things)
                thing.draw(elapsed);
            for (let text of self.texts)
                text.draw();
            window.requestAnimationFrame(gameLoop);
        }

        window.requestAnimationFrame(gameLoop);
    }
}
/*THIS COMMIT WAS BY hg0428, just from a different device. Incudes: 
Very important bug fixes
.to() copied from my pong game.*/
setInterval(() => FPSel.innerText = `FPS: ${game.FPS.toFixed(1)}`, 500);