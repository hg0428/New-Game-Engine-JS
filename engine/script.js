let FPSel = document.getElementById('FPS');
/*
Sources for Ideas:
https://stackoverflow.com/questions/26661909/setting-a-correct-angular-velocity-to-a-canvas-object
https://stackoverflow.com/questions/1616448/broad-phase-collision-detection-methods
*/
//TODO: ORGANIZE THE CODE BETTER.
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
// import {{camera.js}}
//COMPILE.PY turns the above into the conents of that file.
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
        return {
            collision: true,
            x: intersectionX,
            y: intersectionY
        };
    }
    return {
        collision: false
    };
}

function rectLineCollide(rect, line) {
    const left = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x, rect.y + rect.height)
    if (left.collision)
        return {
            collision: true,
            x: left.x,
            y: left.y
        }

    const right = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height)
    if (right.collision)
        return {
            collision: true,
            x: right.x,
            y: right.y
        }

    const top = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x + rect.width, rect.y)
    if (top.collision)
        return {
            collision: true,
            x: top.x,
            y: top.y
        }

    const bottom = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y + rect.height, rect.x + rect.width, rect.y + rect.height)
    if (bottom.collision)
        return {
            collision: true,
            x: bottom.x,
            y: bottom.y
        }

    return {
        collision: false
    };
}
class Game {
    constructor(opts) {
        opts = opts || {};

        this.camera = new Camera();
        this.things = [];
        this.texts = [];
        this.FPS = 0;
        this.deltaTime = 0;
        this.timestamp = 0;
        this.viewmode = opts.viewmode || '2d'; //1d, 2d, isometric, 3d
        this.rendering = opts.rendering || '2d'; //if we add webgl support
        this.background = opts.background || "white";
        this.canvas = document.querySelector(opts.canvas || "canvas");
        this.context = this.canvas.getContext(this.rendering);
        this.canvas.width = opts.width || this.canvas.style.width || document.body.offsetWidth;
        this.canvas.height = opts.height || this.canvas.style.height ||document.body.offsetHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.left = -this.width / 2;
        this.right = this.width / 2;
        this.top = -this.height / 2;
        this.bottom = this.height / 2;
        this.friction = opts.friction || 1;
        this.hooks = [];
        this.running = false;
        const parent = this;
        this.Container = class {
            constructor({
                x,
                y,
                width,
                height,
                overhead,
                left,
                right,
                top,
                bottom,
                background,
                ...opts
            }) {
                width = width || radius * 2 || null;
                if (!width && ((left && right) || (left && x) || (right && x))) {
                    width = parent.numberDistance(right, left) || parent.numberDistance(x, left) * 2 || parent.numberDistance(right, x) * 2;
                } else if (!width) width = 20;
                height = height || radius * 2 || null;
                if (!width && ((top && bottom) || (top && y) || (bottom && y))) {
                    height = parent.numberDistance(top, bottom) || parent.numberDistance(y, top) * 2 || parent.numberDistance(bottom, y) * 2;
                } else if (!height) height = 20;
                x = x || (left + width / 2) || (right - width / 2) || 0;
                y = y || (top + height / 2) || (bottom - height / 2) || 0;
                top = y - height / 2;
                left = x - width / 2;
                bottom = y + height / 2;
                right = x + width / 2;
                this._data = {
                    width: width,
                    height: height,
                    x: x,
                    y: y,
                    top: top,
                    left: left,
                    bottom: bottom,
                    right: right,
                }
            }
            get x() {
                return this._data.x;
            }
            set x(val) {
                this._data.x = val;
                this._data.left = val - this._data.width / 2;
                this._data.right = val + this._data.width / 2;
            }
            get y() {
                return this._data.y;
            }
            set y(val) {
                this._data.y = val;
                this._data.top = val - this._data.height / 2;
                this._data.bottom = val + this._data.height / 2;
            }
            get left() {
                return this._data.left;
            }
            set left(val) {
                this._data.left = val;
                this._data.x = val + this._data.width / 2;
                this._data.right = val + this._data.width;
            }
            get top() {
                return this._data.top;
            }
            set top(val) {
                this._data.top = val;
                this._data.y = val + this._data.height / 2;
                this._data.bottom = val + this._data.height;
            }
            get right() {
                return this._data.right;
            }
            set right(val) {
                this._data.right = val;
                this._data.x = val - this._data.width / 2;
                this._data.left = val - this._data.width;
            }
            get bottom() {
                return this._data.bottom;
            }
            set bottom(val) {
                this._data.bottom = val;
                this._data.y = val - this._data.height / 2;
                this._data.top = val - this._data.height;
            }
            get width() {
                return this._data.width;
            }
            set width(val) {
                this._data.width = val;
                this._data.left = this._data.x - val / 2;
                this._data.right = this._data.x + val / 2;
            }
            get height() {
                return this._data.height;
            }
            set height(val) {
                this._data.height = val;
                this._data.top = this._data.y - val / 2;
                this._data.bottom = this._data.y + val / 2;
            }
            draw() {

            }
        }
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
                ...opts
            }) {
                this.text = text;
                this.overhead = overhead || false;
                this.color = color || "black";
                this.background = background;
                this.width = width;
                this.x = x || 0;
                this.y = y || 0;
                this.size = size || 16;
                this.font = font || "Arial";
                this.align = align || "left";
                parent.texts.push(this);
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
                parent.context.textAlign = this.align;
                parent.context.font = `${this.size}px ${this.font}`;
                if (this.background) {
                    parent.context.fillStyle = this.background;
                    parent.context.fillRect(this.x, this.y, parent.context.measureText(this.text), this.size);
                }
                parent.context.fillStyle = this.color;
                parent.context.fillText(this.text, this.x, this.y);
            }
        };
        //import {{thing.js}}
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
    pointDistance(x1, x2, y1, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }
    numberDistance(a, b) {
        return a > b ? a - b : b - a
    };
    start() {
        if (this.running) return;
        this.running = true;
        let elapsed = 0;
        let lastFrame = 0;

        const self = this;

        function gameLoop(t) {
            self.timestamp = t;
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
            //Implement camera rotation (text+thing), remember camera can not affect it if overhead is set to true.
            //ctx.translate(camera.cen)
            //ctx.rotate(45 * Math.PI / 180);
            for (let thing of self.things)
                thing.draw(elapsed);
            for (let text of self.texts)
                text.draw();
            if (self.running) window.requestAnimationFrame(gameLoop);
        }

        window.requestAnimationFrame(gameLoop);
    }
    stop() {
        if (this.running) this.running = false;
    }
}

// setInterval(() => FPSel.innerText = `FPS: ${game.FPS.toFixed(1)}`, 500);