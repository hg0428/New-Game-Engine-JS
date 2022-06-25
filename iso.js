//REQUIRES P5.js
let SPRITES = {
  "cube": "cube.png",
  "stairs": "stairs.png",
  "slab": "slab.png",
  "slab_right": "slab_right.png",
  "slab_left": "slab_left.png",
  "top_right_line": "top_right_line.png"
}
let cubes = []
let cirlceImg
let cubeSize = 33;
let cubeGap = -1;
let mapWidth = 10;
let mapHeight = 10;

for (let y = 0; y < mapWidth; y++) {
  for (let x = 0; x < mapHeight; x++) {
    cubes.push({
      x: x,
      z: y,
      y: 0,
      type: "cube"
    })
  }
}
for (let i = 4; i < mapWidth; i++) {
  cubes.push({
    x: 1,
    z: i,
    y: -cubeSize / 2,
    type: "stairs"
  })
}
for (let i = 4; i < mapWidth; i++) {
  cubes.push({
    x: 0,
    z: i,
    y: -cubeSize / 2,
    type: "cube"
  })
}
for (let i = 4; i < mapWidth; i++) {
  cubes.push({
    x: 0,
    z: i,
    y: -cubeSize,
    type: "slab"
  })
}
for (let i = 0; i < mapHeight; i++) {
  for (let j = 1; j < 12; j++) {
    cubes.push({
      x: i,
      z: 0,
      y: -cubeSize / 2 * j,
      type: "slab_right"
    })
  }
}
for (let y = 0; y < mapWidth; y++) {
  for (let x = 0; x < mapHeight; x++) {
    cubes.push({
      x: x,
      z: y,
      y: -cubeSize / 2 * 12,
      type: "slab"
    })
  }
}
for (let i = 0; i < mapHeight; i++) {
  for (let j = 0; j < 12; j++) {
    cubes.push({
      x: -1,
      z: i,
      y: -cubeSize / 2 * j,
      type: "slab_left"
    })
  }
}
for (let i = 0; i < mapWidth; i++) {
  cubes.push({
    x: -1,
    z: i,
    y: -cubeSize / 2 * 11.5,
    type: "top_right_line"
  })
}

let circles = [
  {
    x: 3,
    z: 3,
    y: cubeSize,
    dy: -4,
    ody: -4
  },
  {
    x: 5,
    z: 8,
    y: cubeSize,
    dy: -5,
    ody: -5
  }
]

const PLAYER = {
  x: 9,
  z: 2,
  y: 0,
  dy: 0,
  tag: "player",
  arrowdy: -0.6,
  arrowy: 0,
  arrowmax: 10,
  grounded: true
}

function setup() {
  createCanvas(400, 400);
  for (let key in SPRITES) {
    SPRITES[key] = loadImage(SPRITES[key])
  }
  cirlceImg = loadImage("redball.png")
  
  rectMode(CENTER)
  angleMode(DEGREES)
}

function getScreenCoords(cube) {
  return {
    x: cube.x * 1   / 2 * (cubeSize + cubeGap) + cube.z * -1  / 2 * (cubeSize + cubeGap),
    y: cube.x * 0.5 / 2 * (cubeSize + cubeGap) + cube.z * 0.5 / 2 * (cubeSize + cubeGap) + cube.y
  }
}

function screenToWorldCoords(screenX, screenY) {
  return {
    x: Math.floor(screenY / cubeSize + screenX / (cubeSize * 2)),
    y: Math.floor(screenY / cubeSize - screenX / (cubeSize * 2)) + 1
  }
}

function draw() {
  
  background(220);
  push();
  translate(-cubeSize + width / 2, height / 2)
  for (let cube of cubes.sort((a, b) => {
    const n1 = a.z + a.x;
    const n2 = b.z + b.x
    if      (n1 < n2) return -1
    else if (n2 > n1) return 1
    return 0
  })) {
    const coords = getScreenCoords(cube)
    image(SPRITES[cube.type], coords.x, coords.y)
  }
  
  for (let ball of circles.sort((a, b) => {
    const n1 = a.z + a.x;
    const n2 = b.z + b.x
    if      (n1 < n2) return -1
    else if (n2 > n1) return 1
    return 0
  })) {
    ball.y += ball.dy
    ball.dy += 0.15
    
    if (ball.y > 0) {
      ball.dy = ball.ody
      ball.y = 0
    }
    
    strokeWeight(2)
    stroke(color(50, 50, 50))
    fill(0)
    const coords = getScreenCoords(ball)
    ellipse(coords.x + cubeSize / 2, coords.y - ball.y + 9, cubeSize / 2, cubeSize / 4)
    image(cirlceImg, coords.x, coords.y - cubeSize / 2)
  }
}