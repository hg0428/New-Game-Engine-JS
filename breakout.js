
const game = new Game({
  background: "black",
  width: 600,
  height: 400
});

const paddle = new game.Thing({
  width: 90,
  height: 10,
  y: game.height / 2 - 20,
  background: "gray"
});

const ball = new game.Thing({//10 happens to be the default radius.
  shape: SHAPES.circle,
  background: "white",
});

function getColorFromY(y) {
  return ["#521ea7", "#383cdb", "#3e9642", "#ddaf04", "#d16534"][y]
}

function reset() {
  ball.teleport(0, -20);
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
    walls = walls.filter(x => x != w);
    w.delete();
    if (axis === "y")
      b.vel.y = -b.vel.y
    else
      b.vel.x = -b.vel.x
  });
  ball.vel = {
    x: Random.choice([-2, -1, 1, 2]) * 100,
    y: 100,
  }
};
reset();
paddle.collided(ball, (axis, side) => {
  if (axis === "y")
    ball.vel.y = -ball.vel.y
  else
    ball.vel.x = -ball.vel.x
});

game.hook("gameloop", () => {
  if (KEYS.pressed.has("a") && paddle.left > -game.width/2) {
    paddle.vel.x = - 300;
  } if (KEYS.pressed.has("d") && paddle.right < game.width/2) {
    paddle.vel.x = 300;
  } else if (!KEYS.pressed.has("a") || paddle.left <= -game.width/2) {
    paddle.vel.x = 0;
  }
  if (ball.left <= -game.width / 2) {
    ball.vel.x = -ball.vel.x
  } else if (ball.right >= game.width / 2) {
    ball.vel.x = -ball.vel.x
  }
  if (ball.top <= -game.height / 2) {
    ball.vel.y = -ball.vel.y;
  }
  if (ball.y - ball.height > game.height / 2) {
    reset();
  }
})

document.onclick = () => game.start();