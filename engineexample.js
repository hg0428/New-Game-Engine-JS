const game = new Game({
  canvas: "#canvas" // The canvas's selector maybe?yes
})

const paddle1 = new game.Thing({
  name: "paddle1",
  x: 10,
  y: game.height / 2
})
//Yes, thats a great idea, makes it easier for the user...
//Should we provide the user with a game loop, or should they have to make it themselves
//If we don't provide them with a game loop, we can't auto-apply physics.
// Why can't we?
//How would we, will they have to callapplyPhysics on every frame?

game.usePhysics() // << calls applyPhysics every frame
game.start()
// lets make a new file for pongok
game.hook("gameloop", () => {
  // hooks into main loop
})
//The true means call the function every frame, otherwise it would be called on key down
// Key first
//ok
//Oh, also, Thing.stop(), sets all the velocities to 0. also from my old engine
// we could also have Thing.move(x, y)
//Yes, that was also in my old engine.
//But, a cool method I added to the implentation of Thing I used for my pong game is Thing.to(x, y, xSpeed, ySpeed).
//It makes the thing travel to (x, y) at xSpeed, ySpeed. If you set x or y to '*', it would only travel along the other axis.
//And once it reached (x, y), it would stop.
// so its like lerp?
// https://codepen.io/ma77os/pen/OJPVrP Its making me do a capatcha, but it won't load the puzzels, so I can't get on.
// this is a good example
// rip
KEYS.pressed //a set
KEYS.bindKeyUp(KEYS.combination(['Ctrl', 'K'], () => { }));//That ok?
KEYS.bindKeyDown(KEYS.combination(['Ctrl', 'K'], () => { }));
KEYS.bindKeyHeld(KEYS.combination(['Ctrl', 'K'], () => { }));

KEYS.bindKeyHeld(["S", "ArrowDown"], () => { })  // called each frame? yes
KEYS.bindKeyDown(["S", "ArrowDown"], () => { })  // called when its pressed down
KEYS.bindKeyUp(["S", "ArrowDown"], () => { })    // called when its released

Gamepads 
//List of all connected gamepads, sorted so that their position n the array is their gamepad.index
Gampad.bindButton()?
//idk
//something like that.

//What's the draw loop? The for of loop where we draw everything?
// when the stuff gets dra
//what else will hook be for? oh
//Our goals: Super, very easy to use, and Super, very customizable.
//Will there be two loops? Will the user have access to the loop?
