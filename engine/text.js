this.Text = class {
    constructor(opts) {
        opts = opts || {};
        this.text = opts.text || 'Hello World';
        this.overhead = opts.overhead || false;
        this.color = opts.color || "black";
        this.background = opts.background || 'transparent';
        this.width = opts.width;
        this.x = x || 0;
        this.y = y || 0;
        this.size = opts.size || 16;
        this.font = opts.font || "Arial";
        this.align = opts.align || "left";
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
        if (this.background && this.background != 'transparent') {
            parent.context.fillStyle = this.background;
            parent.context.fillRect(this.x, this.y, parent.context.measureText(this.text), this.size);
        }
        parent.context.fillStyle = this.color;
        parent.context.fillText(this.text, this.x, this.y);
    }
};