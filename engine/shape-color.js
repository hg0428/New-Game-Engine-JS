const SHAPES = {
  rect: function(ctx, thing) {
    ctx.beginPath();
    ctx.rect(thing._real.left, thing._real.top, thing.width, thing.height);
    ctx.closePath();
  },
  circle: function(ctx, thing) {
    ctx.beginPath();
    ctx.arc(thing._real.x, thing._real.y, thing.radius, 2 * Math.PI, false);
    ctx.closePath();
  },
  Rect() {
    return (ctx, thing) => {
      ctx.beginPath();
      ctx.rect(thing._real.left, thing._real.top, thing.width, thing.height);
      ctx.closePath();
    }
  },
  Ellipse(startAngle = 0, endAngle = 2 * Math.PI) {
    return (ctx, thing) => {
      ctx.beginPath();
      ctx.ellipse(thing._real.x, thing._real.y, thing.width, thing.height, thing.rotation, startAngle, endAngle)
      ctx.closePath();
    }
  },
  Circle() {
    return (ctx, thing) => {
      ctx.beginPath();
      ctx.arc(thing._real.x, thing._real.y, thing.radius, 2 * Math.PI, false);
      ctx.closePath();
    }
  },
}
function Sprite(name) {
  let sprite = game._sprites[name];
  function draw(ctx, thing) {
    if (!sprite) sprite = game._sprites[name];
    //^^To give the image time to load.
    ctx.drawImage(sprite.img, thing._real.left, thing._real.top, thing.width, thing.height, sprite.source.x, sprite.source.y, sprite.source.width, sprite.source.height);
  }
  return draw;
}
class ColorScheme {
  constructor({
    background,
    border,
    fillRule,
    fill,
    ...opts
  } = {}) {
    /*
    background: color, image, etc, default: black
  border:
        width: in px, default: 0
        style: the border's color or image, default: black
        opacity: the border's opacity, default: 1
  backgroundOpacity: the background's opacity, default: 1
    */
    fill = fill || {};
    border = border || {};
    this.fill = {
      style: background || fill.style || 'black',
      rule: fillRule || fill.rule || 'nonzero',
      //opacity: Math.max(backgroundOpacity, 0) || Math.max(fill.opacity, 0) || 1,
    }//People will have to handle opacity themselves, its so hard to add.
    this.border = {
      width: Math.max(border.width, 0) || 0,
      style: border.style || 'black',
    };//People will have to handle opacity themselves, its so hard to add.
  }
  get background() {
    return this.fill.style;
  }
  set background(val) {
    this.fill.style = val;
  }
  draw(context) {
    context.strokeStyle = this.border.style;
    context.lineWidth = this.border.width;
    if (this.border.width > 0)
      context.stroke();

    context.fillStyle = this.fill.style;
    context.fill(this.fill.rule);
    //yes, the thing runs it on its.draw after it runs the shape. Shape makes the path, ColorScheme colors it in.
    //Its currently only a very basic implementation. but its all working, and you can use game.Pattern to get an image.
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // Will you make a game with the engine for kajam?
    //Yes.
    //And I may later on port the engine over to some other languages.
    //Why, I can just use Thing, like I have been doing since I made my very first video game engine last Kajam. without even referencing any other game engine.
    //And we have containers now tooo. I needed those in the first place for cars/vehicles, and make the wheels a thing and the car's body a thing.
    // Well if you are planning on using it for kajam we need to add sprites.
    //Images already work.
    //game.Pattern('img.png', {repeat: 'repeat-x', other settings...})
    //It was image, but then I wanted it to make patterns too... so, I renamed it
    //script.js
    // Where is game.Pattern defined?
  }
}