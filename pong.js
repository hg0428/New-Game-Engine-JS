
const game = new Game({
  canvas: "#canvas",
  background: "black"
})
//add game.canvas and game.context later
// ok
//How should we implement collision detection?

const paddle1 = new game.Thing({
  shape: Shapes.rect,
  color: "white",
  width: 20,
  height: 50
})

const paddle2 = new game.Thing({
  shape: Shapes.rect,
  color: "white",
  width: 20,
  height: 50
})

const ball = new game.Thing({
  shape: Shapes.circle, //we should also support it as a string, ie 'circle'
  color: "green",
  width: 10,
  height: 10,
})
// yea then if its a string we can just do Shapes[shape]
//yes, thats what my old engine did.
//My old engine had something else that you NEED to know about.
//It had custom shapes, and a class called ColorScheme (alias ColourScheme)
//It allowed ou to give images for the background and also set the border color and border width, etc. And since it was a class you could do:
mycolor = new ColorScheme({
  borderWidth: 5,
  borderColor: 'yellow',
  background: image('/myimage.png'),
})
//Thats what my old engine had.
// Lets get the basics working first
//Ooh, also, my old engine had some advanced camera stuff, like camera rotating and stuff like that, and a function to convert work coords to screen coords (for like overlays and stuff) and vide versa (for like getting mouse coords to world coords)
//I think the user wont have to manage it, but will have acces to it via the hooks, like my old one.

// ok i will start adding that
// so will the user have to manage the main loop or not? so like hooking?
//thing.colorScheme = mycolor
// I think we can start working on the engine

//I have no idea what that is, oh. I was thinking we would just use the given shape.
ball.vel = {
  x: Random.choice([Random.range(-1, -.8), Random.range(.8, 1)])*30,
  y: Random.choice([Random.range(-1, -.8), Random.range(.8, 1)])*30
}

paddle1.when("collided", ball, (axis, side) => {//if the other happens to be an array, apply it to all of them.
  //side == left || top || right || bottom
  // ok
  if (axis === "x")
    ball.vel.x = -ball.vel.x
  else
    ball.vel.y = -ball.vel.y
})
//You know I made a Random object
paddle2.when("collided", [ball], (axis, side) => {
  //side == left || top || right || bottom
  // ok
  if (axis === "x")
    ball.vel.x = -ball.vel.x
  else
    ball.vel.y = -ball.vel.y
})