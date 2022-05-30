
const game = new Game({
  canvas: "#canvas",
  background: "black",
  width: 600,
  height: 400
});

const paddle = new game.Thing({
  width: 90,
  height: 10,
  x: 0,
  y: game.height / 2 - 20,
  background: "gray"
});

const ball = new game.Thing({
  radius: 10,
  shape: SHAPES.circle,
  background: "white",
  y: -20
});

ball.vel = {
  x: Random.choice([-2, -1, 1, 2]) * 100,
  y: 100,
}

function getColorFromY(y) {
  return ["#521ea7", "#383cdb", "#3e9642", "#ddaf04", "#d16534"][y]
}

let walls = []
for (let y = 0; y < 5; y++) {
  for (let x = -7; x < 7; x++) {
    walls.push(new game.Thing({
      x: x * 34,
      y: y * 20 - game.height / 2 + 40,
      width: 28,
      height: 16,
      background: getColorFromY(y)
    }))
  }
}

ball.collided(walls, (axis, side, b, w) => {
  w.delete();
  if (axis === "y")
    b.vel.y = -b.vel.y
  else
    b.vel.x = -b.vel.x
});

paddle.collided(ball, (axis, side) => {
  if (axis === "y")
    ball.vel.y = -ball.vel.y
  else
    ball.vel.x = -ball.vel.x
})

game.hook("gameloop", () => {
  if (KEYS.pressed.has("a")) {
    paddle.x -= 300 * game.deltaTime;
    if (paddle.x - paddle.width / 2 < -game.width / 2) {
      paddle.x = -game.width / 2 + paddle.width / 2
    }
  }
  if (KEYS.pressed.has("d")) {
    paddle.x += 300 * game.deltaTime;
    if (paddle.x + paddle.width / 2 > game.width / 2) {
      paddle.x = game.width / 2 - paddle.width / 2
    }
  }

  if (ball.x - ball.width / 2 < -game.width / 2) {
    ball.vel.x = -ball.vel.x
  }
  else if (ball.x + ball.width / 2 > game.width / 2) {
    ball.vel.x = -ball.vel.x
  }

  if (ball.y - ball.height / 2 < -game.height / 2) {
    ball.vel.y = -ball.vel.y
  }

  if (ball.y - ball.height > game.height / 2) {
    ball.y = -20
    ball.x = 0
    ball.vel = {
      x: Random.range(-1, 1) * 200,
      y: 100,
    }
    walls = []
    for (let y = 0; y < 5; y++) {
      for (let x = -7; x < 7; x++) {
        walls.push(new game.Thing({
          x: x * 34,
          y: y * 20 - game.height / 2 + 40,
          width: 28,
          height: 16,
          background: getColorFromY(y)
        }));
      }
    }
    ball.collided(walls, (axis, side, b, w) => {
      w.delete();
      if (axis === "y")
        b.vel.y = -b.vel.y
      else
        b.vel.x = -b.vel.x
    });
  }
})

game.start();