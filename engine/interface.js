let programStart = Date.now();
let time = 0;
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(funct) {
  if ((Date.now() - programStart) - time >= 60) {
    time = Date.now() - programStart;
    funct(time);
  } else {
    setTimeout(window.requestAnimationFrame, 59 - ((Date.now() - programStart) - lastFrame), funct);
  }
};
var KEYS = {
  pressed: new Set(),
  events: {
    held: [],
    pressed: [],
    released: []
  },
  bindKeyHold: (keys, cb) => {
    if (Array.isArray(keys))
      for (let key of keys)
        KEYS.events.held.push({
          key: key,
          callback: cb
        })
    else
      KEYS.events.held.push({
        key: keys,
        callback: cb
      })
  },
  bindKeyPressed: (keys, cb) => {
    if (Array.isArray(keys))
      for (let key of keys)
        KEYS.events.pressed.push({
          key: key,
          callback: cb
        })
    else
      KEYS.events.pressed.push({
        key: keys,
        callback: cb
      })
  },
  bindKeyReleased: (keys, cb) => {
    if (Array.isArray(keys))
      for (let key of keys)
        KEYS.events.released.push({
          key: key,
          callback: cb
        })
    else
      KEYS.events.released.push({
        key: keys,
        callback: cb
      })
  },
  combination: (args) => {return { type: "combination", keys: args }}

}

const allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
var Random = {
  random: Math.random,
  range: (min, max) => (Math.random() * (max - min) + min),
  choice: (choices) => {
    if (choices instanceof Object) choices = Object.values(choices);
    return choices[Math.floor(Math.random() * choices.length)];
  },
  choices: (choices, k) => {
    let ret = [];
    while (ret.length <= k) {
      ret.push(this.choice(choices));
    }
    return ret;
  },
  string: function(leng, chars) {
    leng = leng || 12;
    chars = chars || allChars;
    let string = '';
    for (let i = 0; i < leng; i++) {
      string += chars[Math.floor(Math.random() * (chars.length - 1))];
    }
    return string;
  },
  permutation: function(leng, amt, start = 1) {
    let rets = [];
    for (let i = 0; i < amt; i++) {
      rets.push(this.choice(Math.range(start, leng)));
    }
    return rets;
  },
  bits: function(k) {
    let bits = '';
    while (bits.length <= k) {
      bits += this.choice(['0', '1'])
    }
    return bits;
  }
}
Math.range = (start, end) =>{
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

document.addEventListener('keydown', (e) => {
  if (e.repeat) { return }
  KEYS.pressed.add(e.key);
  for (let ev of KEYS.events.pressed) {
    if (ev.key === e.key) {
      ev.callback()
    }
    //add combination support
  }
});
document.addEventListener('keyup', (e) => {
  if (e.repeat) { return }
  KEYS.pressed.delete(e.key);
  for (let ev of KEYS.events.released) {
    if (ev.key === e.key) {
      ev.callback()
    }
    //add combination support
  }
});