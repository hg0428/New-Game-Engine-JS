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
        this.tasks = [];
        const parent = this;
        fill = fill || {};
        border = border || {};
        this.fill = {
            style: background || fill.style || 'black',
            rule: fillRule || fill.rule || 'nonzero',
            //opacity: Math.max(backgroundOpacity, 0) || Math.max(fill.opacity, 0) || 1,
        }//People will have to handle opacity themselves, its so hard to add.
        this.border = {
            width: Math.max(border.width, 1) || ,
            style: border.style || 'black',
        };//People will have to handle opacity themselves, its so hard to add.
    }
    get background() {
        return this.fill.style;
    }
    set background(val) {
        this.fill.style = val;
    }
    /*get backgroundOpacity() {
        return this.fill._opacity;
    }
    set backgroundOpacity(val) {
        this.fill.opacity = val;
    }*/
    draw(context) {
        context.strokeStyle = this.border.style;
        context.lineWidth = this.border.width;
        if (this.border.width > 0) 
            context.stroke();
        
        context.fillStyle = this.fill.style;
        context.fill(this.fill.rule);
    }
}