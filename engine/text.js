this.Text = class {
    constructor({
        text,
        x,
        y,
        left,
        top,
        right,
        bottom,
        custom,
        ...opts
        } = {}) {
        this.custom = custom || {}; //for people to store custom values
        this.size = opts.size || 16;
        this.text = text || 'Hello World';
        this.overhead = opts.overhead || false;
        this.color = opts.color || "black";
        this.background = opts.background || 'transparent';
        x = x || (left + this.width / 2) || (right - this.width / 2) || 0;
        y = y || (top + this.height / 2) || (bottom - this.height / 2) || 0;
        top = y - this.height / 2;
        left = x - this.width / 2;
        bottom = y + this.height / 2;
        right = x + this.width / 2;
        this._data = {
            x: x,
            y: y,
            top: top,
            left: left,
            bottom: bottom,
            right: right,
        }
        this.font = opts.font || "Arial";
        this.align = opts.align || "left";
        parent.texts.push(this);
    }
    get text() {
        return this._text;
    }
    set text(text) {
        this._text = text;
        parent.context.font = `${this.size}px ${this.font}`;
        this.measure = parent.context.measureText(this.text);
        this.width = this.measure.width;
    }
    get size() {
        return this._size;
    }
    set size(val) {
        this._size = val;
        this.height = val;
    }
    get x() {
        return this._data.x;
    } set x(val) {
        this._data.x = val;
        this._data.left = val - this.width / 2;
        this._data.right = val + this.width / 2;
    }
    get y() {
        return this._data.y;
    } set y(val) {
        this._data.y = val;
        this._data.top = val - this.height / 2;
        this._data.bottom = val + this.height / 2;
    }
    get left() {
        return this._data.left;
    } set left(val) {
        this._data.left = val;
        this._data.x = val + this.width / 2;
        this._data.right = val + this.width;
    }
    get right() {
        return this._data.right;
    } set right(val) {
        this._data.right = val;
        this._data.x = val - this.width / 2;
        this._data.left = val - this.width;
    }
    get top() {
        return this._data.top;
    } set top(val) {
        this._data.top = val;
        this._data.y = val + this.height / 2;
        this._data.bottom = val + this.height;
    }
    get bottom() {
        return this._data.bottom;
    } set bottom(val) {
        this._data.bottom = val;
        this._data.y = val - this.height / 2;
        this._data.top = val - this.height;
    }
    draw(elapsed) {
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
            parent.context.fillRect(parent.width/2+this.left, parent.height/2+this.top, this.width, this.height);
        }
        parent.context.fillStyle = this.color;
        parent.context.fillText(this.text, parent.width/2+this.left, parent.height/2+this.top+this.size);
    }
};