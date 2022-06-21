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
        //Later on, make the entire game a container, and allow nested containers. 
        //.draw on a container will draw everything it contains.
        //Make the x, y and everything relative to its container.
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
        //Draw the containers children
        //Allow nested containers and use relative positioning
        //Add a attribute for the absolute position of everything Thing snd Container.
        //Maybe have a position option to choose relative or absolute.
    }
}