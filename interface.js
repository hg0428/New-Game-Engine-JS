let programStart = Date.now();
 
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||  window.msRequestAnimationFrame || function(funct) {
  if((Date.now()-programStart)-lastFrame >= 60 ) {
      lastFrame = Date.now()-programStart;
	    funct(lastFrame);
  } else {
      setTimeout(window.requestAnimationFrame, 59-((Date.now()-programStart)-lastFrame), funct); 
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
    }
}

const allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
var Random = {
    random: Math.random,
    range: (min, max) => (Math.random() * (max - min) + min),
    choice: (choices) => {
      if (choices instanceof Object) choices=Object.values(choices);
      return choices[Math.floor(Math.random() * choices.length)];
    }, 
    string: function(leng, chars) {
          leng = leng || 12;
          chars = chars || allChars;
          let string = '';
          for (let i = 0; i < leng; i++) {
            string += chars[Math.floor(Math.random() * (chars.length - 1))];
          }
          return string; // gotta go cya
        }
}
document.addEventListener('keydown', (e) => {
  KEYS.pressed.add(e.key);
  for (let ev of KEYS.events.pressed) {
    if (ev.key === e.key) {
      ev.callback()
    }
  }
});
document.addEventListener('keyup', (e) => {
  KEYS.pressed.delete(e.key);
  for (let ev of KEYS.events.released) {
    if (ev.key === e.key) {
      ev.callback()
    }
  }
});