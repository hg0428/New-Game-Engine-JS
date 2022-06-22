const SHAPES = {
    rect: function(ctx, x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
    },
    circle: function(ctx, x, y, w, h) {
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, (w + h) / 4, 2 * Math.PI, false);
        ctx.closePath();
    }
}
class ColorScheme {
    constructor({
        background,
        border,
        //backgroundOpacity,
        fillRule,
        fill,
        ...opts
    }) {
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