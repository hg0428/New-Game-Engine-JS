const game = new Game({
  background: "black",
  width: 600,
  height: 400
});
//The border is only on the paddle, but for some reason it shows up on everything.
const paddle = new game.Thing({
  width: 90,
  height: 10,
  y: game.bottom - 20,
  background: 'grey'
});

const ball = new game.Thing({
  shape: SHAPES.circle,
  background: "white",
});

function getColorFromY(y) {
  return ["#521ea7", "#383cdb", "#3e9642", "#ddaf04", "#d16534"][y]
}

let walls = [];
function reset() {
  ball.teleport(0, -20);
	
	for (let wall of walls)
		wall.delete();
	
  walls = [];
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
  };
};
reset();

paddle.collided(ball, (axis, side) => {
  if (axis === "y") 
    ball.vel.y = -ball.vel.y
  else
    ball.vel.x = -ball.vel.x
  switch (side) {
    case 'left':
      ball.left = paddle.right;
	    ball.vel.x = Math.abs(ball.vel.x)
    case 'right': 
      ball.right = paddle.left; // when the ball hits the side of paddle it teleports up not for me
	    ball.vel.x = ball.vel.x > 0 ? -ball.vel.x : ball.vel.x;// not for me  hm ok
    case 'top'://screentime up, bye.
      ball.top = paddle.bottom; // cya
      ball.vel.y = Math.abs(ball.vel.y)
    case 'bottom': // It cant really hit the bottom of the paddle
      ball.bottom = paddle.top;
      ball.vel.y = ball.vel.y > 0 ? -ball.vel.y : ball.vel.y; 
  }
});

KEYS.bindKeyHold('a', e => { if (paddle.left > game.left) paddle.moveX(-0.3 * e) });
KEYS.bindKeyHold('d', e => { if (paddle.right < game.right) paddle.moveX(0.3 * e) });

game.hook("gameloop", () => {
  if (ball.left <= game.left) {
    ball.vel.x = -ball.vel.x;
    ball.left = game.left;
  } else if (ball.right >= game.right) {
    ball.vel.x = -ball.vel.x;
    ball.right = game.right;
  }
  if (ball.top <= game.top) 
    ball.vel.y = -ball.vel.y;
  if (ball.top > game.bottom) 
    reset();
});

document.onclick = () => game.start();