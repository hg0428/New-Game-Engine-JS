
const game = new Game({
  canvas: "#canvas",
  background: "black"
})

const paddle1 = new game.Thing({
  shape: SHAPES.rect,
  background: "white",
  width: 20,
  height: 90,
  x: -game.width / 2 + 30,
  y: 0
})

const paddle2 = new game.Thing({
  shape: SHAPES.rect,
  background: "white",
  width: 20,
  height: 90,
  x: game.width / 2 - 30,
  y: 0
})

const ball = new game.Thing({
  shape: SHAPES.circle,
  background: "white",
  width: 40,
  height: 40,
  x: 0,
  y: 0
})

const scoreLeft = new game.Text({
  text: "123",
  background: "white",
  x: game.width / 2,
  y: 60,
  size: 60,
  align: "right"
})
const scoreRight = new game.Text({
  text: "123",
  background: "white",
  x: game.width / 2 + 60,
  y: 60,
  size: 60,
  align: "left"
})

new game.Thing({
  y: -game.height / 2 + 60,
  height: 60,
  width:  20
})
//Changed from color to background, because color made it kinda confusing.
ball.vel = {
  x: Random.choice([Random.range(-1, -.8), Random.range(.8, 1)])*300,
  y: Random.choice([Random.range(-1, -.8), Random.range(.8, 1)])*300
}

ball.when("moved", () => {
  if (ball.top <= -game.height / 2) {
    ball.y = -game.height/2 + ball.height/2 + 1;
    ball.vel.y = -ball.vel.y
  }
  if (ball.bottom >= game.height / 2) {
    ball.y = game.height/2 - ball.height/2 - 1;
    ball.vel.y = -ball.vel.y
  }
  if (ball.right > game.width / 2 || ball.left < -game.width / 2) {
    ball.x = ball.y = 0;
    ball.vel = {
      x: Random.choice([Random.range(-1, -.8), Random.range(.8, 1)])*300,
      y: Random.choice([Random.range(-1, -.8), Random.range(.8, 1)])*300
    }
  }
})

paddle1.collided(ball, (axis, side) => {
  if (axis === "x")
    ball.vel.x = -ball.vel.x;
  else
    ball.vel.y = -ball.vel.y;

  ball.vel.x *= 1.05;
  ball.vel.y *= 1.05;
})

paddle2.collided([ball], (axis, side) => {
  if (axis === "x")
    ball.vel.x = -ball.vel.x
  else
    ball.vel.y = -ball.vel.y
  ball.vel.x *= 1.05;
  ball.vel.y *= 1.05;
})

KEYS.bindKeyHold("w", () => {
  paddle1.y -= canvas.height * game.deltaTime
  if (paddle1.y - paddle1.height / 2 < -game.height / 2) {
    paddle1.y = -game.height / 2 + paddle1.height / 2
  }
})
KEYS.bindKeyHold("s", () => {
  paddle1.y += canvas.height * game.deltaTime
  if (paddle1.y + paddle1.height / 2 > game.height / 2) {
    paddle1.y = game.height / 2 - paddle1.height  / 2
  }
})

KEYS.bindKeyHold("ArrowUp", () => {
  paddle2.y -= canvas.height * game.deltaTime
  if (paddle2.y - paddle2.height / 2 < -game.height / 2) {
    paddle2.y = -game.height / 2 + paddle2.height / 2
  }
})
KEYS.bindKeyHold("ArrowDown", () => {
  paddle2.y += canvas.height * game.deltaTime
  if (paddle2.y + paddle2.height / 2 > game.height / 2) {
    paddle2.y = game.height / 2 - paddle2.height  / 2
  }
})
// yea gonna work on that now
//BTW, KEYS is defined in #interface.js, when you implenent that. I would help, but I gtg.
game.start() // cya