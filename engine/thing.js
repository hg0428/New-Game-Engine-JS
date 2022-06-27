this.Thing = class {
  constructor({
    width,
    height,
    x,
    y,
    left,
    right,
    top,
    bottom,
    shape,
    colorScheme,
    colourScheme,
    radius,
    collisions,
    overhead,
    background,
    border,
    borderWidth,
    custom,
    ...opts
  } = {}, parent) {
    //add something to auto keep a Thing within the viewport
    this.parent = parent || game.viewport;
    this.custom = custom || {}; //for people to store custom values
    this._exists = true;
    this.image = opts.image;
    this.overhead = overhead || false;
    this.name = opts.name || 'unidentified';
    if (typeof shape == 'string')
      shape = SHAPES[shape];
    this.shape = shape || SHAPES.Rect();

    width = width || radius * 2 || null;
    if (!width && ((left && right) || (left && x) || (right && x))) {
      width = game.numberDistance(right, left) || game.numberDistance(x, left) * 2 || game.numberDistance(right, x) * 2;
    } else if (!width) width = 20;
    height = height || radius * 2 || null;
    if (!width && ((top && bottom) || (top && y) || (bottom && y))) {
      height = game.numberDistance(top, bottom) || game.numberDistance(y, top) * 2 || game.numberDistance(bottom, y) * 2;
    } else if (!height) height = 20;
    radius = radius || (width + height) / 4 || 10;
    x = x || (left + width / 2) || (right - width / 2) || 0;
    y = y || (top + height / 2) || (bottom - height / 2) || 0;
    top = y - height / 2;
    left = x - width / 2;
    bottom = y + height / 2;
    right = x + width / 2;
    this._data = {
      width: width,
      height: height,
      radius: radius,
      x: x,
      y: y,
      top: top,
      left: left,
      bottom: bottom,
      right: right,
    }
    this.calculatePositions();
    this.id = Random.string(12) + this.name;
    if (typeof background == 'function') {
      this.colorScheme = { draw: background };
    } else {
      this.colorScheme = colorScheme ?? colourScheme ?? new ColorScheme({
        background, border: {
          style: border,
          width: borderWidth
        }
      });
    }
    //add this.colourScheme alias.
    //this.visible = false;
    this.checkCollisions = collisions ?? true;
    this.collisions = {};
    this.events = {};
    this.prevX = 0;
    this.prevY = 0;
    this.vel = {
      x: 0,
      y: 0,
      //add rotational velocity? (my old engine had it.)
    }
    this._destination = null;
    game.all.all.push(this);
    game.all.things.push(this);
    this.parent.appendChild(this);
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
  get radius() {
    return this._data.radius;
  }
  set radius(val) {
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
    this.parent.removeChild(this)
    this.draw = () => null;
    delete this.x, this.y, this.width, this.height, this.radius, this.left, this.right, this.top, this.bottom, this._data, this.triggerEvent;
    for (let thing of game.all.things) {
      thing._removeCollisions(this.id);
    }
    this._exists = false;
    //delete this;
    //if (inst) delete inst;
  }

  getCollider() {
    /*let rectCollider = {
        left: this._data.left,
        top: this._data.top,
        right: this._data.right,
        bottom: this._data.bottom,
        width: this._data.width,
        height: this._data.height,
        x: this._data.x,
        y: this._data.y,
        prevX: this.prevX,
        prevY: this.prevY
    }

    if (this.shape === SHAPES.circle) {
        rectCollider.width -= 0;
        rectCollider.height -= 0;
    }

    return rectCollider;
    //Not needed rn, but we will need it later on. Commented out to save power.
    //Lets later implement something more advanced that can detect any shape, maybe SAT or something*/
    return this;
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
  _removeCollisions(otherid) {
    if (this.collisions[otherid]) {
      delete this.collisions[otherid];
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

  distanceTo(other) {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2)
  }
  touching(other) {
    let rectCollider = other.getCollider();
    let rectCollider2 = this.getCollider();

    // I only added the .getCollider() method because we can only check
    // collisions between rectangles for now, we can remove it once we 
    // can check other types or collisions too.

    //We use 1/2 width and height a lot, maybe we should just add that as an attribute.
    //That would save us from recalculating it every time.
    let t1HalfW = this._data.width / 2;
    let t1HalfH = this._data.height / 2;
    let t2HalfW = other._data.width / 2;
    let t2HalfH = other._data.height / 2;

    // Only check objects that are in range
    if (
      this.distanceTo(other) < rectCollider2._data.width +
      rectCollider._data.width +
      rectCollider2._data.height +
      rectCollider._data.height &&
      rectCollide(rectCollider, rectCollider2)
    ) { //Change ._data.etc to .etc when we change getCollider() again.

      // Calculate the distance between centers
      let diffX = this._data.x - other._data.x;
      let diffY = this._data.y - other._data.y;

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
        let event = {
          depthX,
          depthY,
          axis,
          side,
          self: this,
          other,
          timestamp: game.timestamp
        }
        return event;
      }
    }
    return false;
  }
  update() {

    this.prevX = this.x;
    this.prevY = this.y;
    this.move(this.vel.x * game.deltaTime, this.vel.y * game.deltaTime)
    /*
    Problems with our Collision Detection: 
        1. Its very expensive to check every object against every other object even if they are a thousand pixels away. 
        2. Fast objects are able to go through any other object without the collision being detected.

    Potential Solutions:
        1. A broad phase where we decide which ones to check by if their y positions overlap at all. Or some other type of broad phase.
        2. Draw a line between the current position and projected position and check if that line intersects with the object. Or some other solution
    */
    for (let other of game.all.things.filter(x => {
      // Check if the object is not itself
      return x.id !== this.id && x.checkCollisions && x._exists === true
    })) { //if this thing checks another thing, and the other thing checks against this thing, than isn't that re-calculating the same thing? Its a waste of time. So, maybe later we can come up with a better system.
      let event = this.touching(other);
      if (event && this.collisions[other.id])
        this.collisions[other.id].forEach(cb => cb(event));
    }
  }
  calculatePositions() {
    this._real = {
      x: this._data.x + game.width / 2 + this.parent.absolute.left,
      y: this._data.y + game.height / 2 + this.parent.absolute.top,
      left: this._data.left + game.width / 2 + this.parent.absolute.left,
      right: this._data.right + game.width / 2 + this.parent.absolute.left,
      top: this._data.top + game.height / 2 + this.parent.absolute.top,
      bottom: this._data.bottom + game.height / 2 + this.parent.absolute.top,
    }
  }
  draw() {
    this.update();
    this.calculatePositions();
    this.triggerEvent("draw");
    game.context.save();
    if (this.image) {
      game.context.drawImage(this.image, this._real.left, this._real.top, this.width, this.height);
    } else {
      this.shape(game.context, this);
      this.colorScheme.draw(game.context, this);
    }
    game.context.restore();
    this.triggerEvent("afterDraw");
    if (this._destination) {
      if ((this._destination[0] == '*' || this._destination[0] == this._data.x) && (this._destination[1] == '*' || this._destination[1] == this._data.y)) {
        this._destination = null;
        return;
      }
      let d = this._destination;
      if (d[0] != '*' && this._data.x + this.vel.x / 1000 >= d[0] && this.vel.x > 0) {
        this.vel.x = 0;
        this.x = d[0];
      } else if (d[0] != '*' && this._data.x + this.vel.x / 1000 <= d[0] && this.vel.x < 0) {
        this.vel.x = 0;
        this.x = d[0];
      }
      if (d[1] != '*' && this._data.y + this.vel.y / 1000 >= d[1] && this.vel.y > 0) {
        this.vel.y = 0;
        this.y = d[1];
      } else if (d[1] != '*' && this._data.y + this.vel.y / 1000 <= d[1] && this.vel.y < 0) {
        this.vel.y = 0;
        this.y = d[1];
      }
    }
  }
  teleport(x, y) {
    this._data.x = x;
    this._data.left = x - this._data.width / 2;
    this._data.right = x + this._data.width / 2;
    this._data.y = y;
    this._data.top = y - this._data.height / 2;
    this._data.bottom = y + this._data.height / 2;
  }
  moveX(amt) {
    this._data.x += amt;
    this._data.left += amt;
    this._data.right += amt;
  }
  moveY(amt) {
    this._data.y += amt;
    this._data.top += amt;
    this._data.bottom += amt;
  }
  move(x, y) {
    this._data.x += x;
    this._data.left += x;
    this._data.right += x;
    this._data.y += y;
    this._data.top += y;
    this._data.bottom += y;
  }
  to(x, y, speedX, speedY) {
    if (x == '*') speedX = 0;
    else if (speedX == 0) x = '*'
    if (y == '*') speedY = 0;
    else if (speedY == 0) y = '*'

    this._destination = [x, y];

    if (x > this._data.x) this.vel.x = speedX;
    else this.vel.x = -speedX;
    if (y > this._data.y) this.vel.y = speedY;
    else this.vel.y = -speedY;
  }
}