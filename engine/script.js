/* import {{interface.js}} */
let FPSel = document.getElementById('FPS');
/*
Sources for Ideas:
https://stackoverflow.com/questions/26661909/setting-a-correct-angular-velocity-to-a-canvas-object
https://stackoverflow.com/questions/1616448/broad-phase-collision-detection-methods
*/

/* import {{shape-color.js}} */
/* import {{camera.js}} */
//COMPILE.PY turns the above into the contents of that file.
function rectCollide(t1, t2) {
    return (t1.left < t2.right &&
        t1.right > t2.left &&
        t1.top < t2.bottom &&
        t1.bottom > t2.top);
};

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
        if (!canvas) {
            this.canvas = document.createElement('canvas');
            document.body.appendChild(this.canvas);
        }
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
        /* import {{container.js}} */
        /* import {{text.js}} */
        /* import {{thing.js}} */
    }
    Pattern(image, opts) {
        if (typeof image == 'string') {
            ({width, height} = opts);
            img = new Image(width, height);
            img.src = image;
            image = img;
        } // Oh i didnt know context.createPattern was a thing
        //
        return this.context.createPattern(image, opts.repeat || 'no-repeat');
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
		//I didn't know how to implement this without using up a ton of memory trying to save the entire game. Well, hmmm, but how can we save it, just save the position of everything and container and everything including text and the camera?
      //I was planning to save making this until much later on.
      //btw, when can we add it  your UI engine?
      //ok I still need to finish containers.
      //So, with containers, how should we implement that?
      //What if a thing is outside its container? Will it not be drawn?
      //if nothing, then 
      //When things are drawn, their coords should be relative to the center of their container, right?
      //Centered is easier. ok, so we still have a lot to implement there.
      //plus there is still .left, .top
      //The containers, and makeing the game be a big container. BTW, I also implemented automatic width/height/other attribute calcualtion. It takes the other values sucha as x, and y, top, and left, and trys to get enough info to calculate everything else. I thought that was cool.
      //Also, whats with Text? What will we do with that?
      //Can text be put into containers?
      //But, text works weird. It works differently than everything else, but thats mostly because you can't make text work like everything else. 
      //no, i mean the center coords with top left, etc.
      //even containers have top left, and the game, so its just weird that text doesn't.
      //I think we also need to alow people to link their custom collision detection functions
	  //text doesnt really need .left, .top etc because its text
      //true... but it would be nice to have.
      //btw, do you like I condensed breakout.js?
	  
	}
    saveState(id) {//for saving the games state to restore it later.
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
                if (KEYS.pressed.has(ev.key)) ev.callback(elapsed)
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
