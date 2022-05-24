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
};
var Random = {
    random: Math.random,
    range: (min, max) => (Math.random() * (max - min) + min),
    choice: (choices) => {
      if (choices instanceof Object) choices=Object.values(choices);
      return choices[Math.floor(Math.random() * choices.length)];
    }
}
document.addEventListener('keydown', (e) => {
  KEYS.pressed.add(e.key);
});
document.addEventListener('keyup', (e) => {
  KEYS.pressed.delete(e.key);
});