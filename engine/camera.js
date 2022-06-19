class Camera {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 1;
        this.rotation = 0;
        this.centerOfRot = (0, 0);
        // We need to add camera rotation and zooming
        //add methods for world to screen and vice versa
    }
    rotateRad(rad) {
        this.rotation += rad;
    }
    rotateDeg(deg) {
        this.rotation += deg * Math.PI / 180;
    }
    setRotationCenter(x, y) {
        this.centerOfRot = (x, y);
    }
}