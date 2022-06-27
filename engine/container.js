//MAYBE Containers were a bad idea.
this.Container = class {
    constructor(parent, {
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
          shape,
          border,
          borderWidth,
          colorScheme,
          colourScheme,
          custom,
          ...opts
        } = {}) {
        if (!parent) {
            throw new Error("Parent not supplied");
        }
        this.parent = parent;
        //Later on, make the entire game a container, and allow nested containers. 
        //.draw on a container will draw everything it contains.
        //Make the x, y and everything relative to its container.
        //Make a screen coords to game coords function and vice versa, and make sure to calculate all the container's position and the relative pos.
        this.custom = custom || {}; //for people to store custom values
        this.background = background;
        this.overhead = overhead;
        if (typeof shape == 'string')
            shape = SHAPES[shape];
        this.shape = shape || SHAPES.rect;
        width = width || null;
        if (!width && ((left && right) || (left && x) || (right && x))) {
            width = game.numberDistance(right, left) || game.numberDistance(x, left) * 2 || game.numberDistance(right, x) * 2;
        } else if (!width) width = 20;
        height = height || null;
        if (!width && ((top && bottom) || (top && y) || (bottom && y))) {
            height = game.numberDistance(top, bottom) || game.numberDistance(y, top) * 2 || game.numberDistance(bottom, y) * 2;
        } else if (!height) height = 20;
        x = x || (left + width / 2) || (right - width / 2) || 0;
        y = y || (top + height / 2) || (bottom - height / 2) || 0;
        top = y - height / 2;
        left = x - width / 2;
        bottom = y + height / 2;
        right = x + width / 2;
        this._data = {
            width,
            height,
            x,
            y,
            top,
            left,
            bottom,
            right,
        }
        let leftAbs = parent.absolute ? parent.absolute.left : game.camera.offsetX;
        let topAbs = parent.absolute ? parent.absolute.top : game.camera.offsetY;
        this.absolute = {
            left: left + leftAbs,
            top: top + topAbs,
            right: right + leftAbs,
            bottom: bottom + topAbs,
            x: x + leftAbs,
            y: y + topAbs,
        }
        //When drawing, make sure to take the parent's posisition into account.
        this.children = [];
        this.events = [];
        this.colorScheme = colorScheme ?? colourScheme ?? new ColorScheme({background, border: {
            style:border,
            width:borderWidth
        }});
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
    newThing(opts) {
        this.appendChild(new game.Thing(opts));
    }
    newText(opts) {
        this.appendChild(new game.Text(opts));
    }
    newContainer(opts) {
        this.appendChild(new game.Container(this, opts));
    }
    appendChild(child) {
        this.children.push(child);
        child.parent = this;
    }
    appendChildren(...children) {
        for (let child of children) {
            if (Array.isArray(child)) 
                appendChildren(...child);
            else 
                this.children.push(child)
                child.parent = this;
        }
    }
    when(evt, cb) {
        if (!this.events[evt]) this.events[evt] = []
        this.events[evt].push(cb)
    }

    triggerEvent(name) {
        if (this.events[name])
            for (let cb of this.events[name]) cb();
    }
    draw(elapsed) {
        triggerEvent('draw');
        if (this.background != 'transparent') {
            game.context.fillStyle = this.background;
            SHAPES.rect(game.context, this._data.left, this._data.top, this._data.width, this._data.height)
            this.colorScheme.draw();
        }
        for (let thing of this.children) {
            thing.draw(elapsed);
        }
        triggerEvent('afterDraw');
        //Draw the container's children
        //Allow nested containers and use relative positioning
        //Add a attribute for the absolute position of everything Thing and Container.
        //Maybe have a position option to choose relative or absolute.
    }
}