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
        game.viewport.appendChild(this);
    }
    get text() {
        return this._text;
    }
    set text(text) {
        this._text = text;
        game.context.font = `${this.size}px ${this.font}`;
        this.measure = game.context.measureText(this.text);
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
        game.context.textAlign = this.align;
        game.context.font = `${this.size}px ${this.font}`;
        if (this.background && this.background != 'transparent') {
            game.context.fillStyle = this.background;
            game.context.fillRect(game.width/2+this.left, game.height/2+this.top, this.width, this.height);
        }
        game.context.fillStyle = this.color;
        game.context.fillText(this.text, game.width/2+this.left, game.height/2+this.top+this.size);
    }
};