const game = new Game({
    canvas: '#canvas'
});
let player = new game.Thing({
    name:'player',
    width: 30,
    height: 30,
    shape: 'circle',
    colorScheme: new ColorScheme({
        background:'green'
    })
});
let enemy = new game.Template({
    name:'enemy',
    width: 35,
    height: 35,
    x: 50,
    y: 20,
    shape: 'rect',
    colorScheme: new ColorScheme({
        background:'red'
    })
});
let projectile = new game.Template({
// Templates are templates for things, they have a attribute, members, that keep track of all the things formed from this Template.
	width: 30,
	height: 5,
	shape: 'rect',
	background: 'red' //Works the same as a ColorScheme with background red.
//Add some way to auto delete it when it gets x pixels away from the viewport.
// i  think the user can handle deleting them, and i think i fixed friction by changing elapsed into seconds and not milliseconds
});//again, just an idea. Thats why its optional. For example, my brother made me make him
game.saveState(0);//Saves the state of all the Things as well as the game itself.
player.collided(enemy, (thing, event) => {
	//I added the thing argument just incase there are multiple possible things that could trigger it, or if the user doesn't have access to the thing.
	//event.axis
	//event.side
	//event.timestamp
	//Somehow put thing & player into event.
	//maybe ^ event.triggeredBy & event.triggeredFor? 
    alert('You died');
    game.restoreState(0);
});
enemy.collided(projectile, (thing, event) => {//A template as an argument means any member of that template
	delete thing;
	delete enemy; // dont think we can use delete here
  //enemy.delete() then? yea
  // Thing.delete() maybe?
});//I think we should change the  axis/side paramters to an event object. see mygame.js
        //it could also include stuff like a timestamp or something.
        //why not just pass ({side:side, axis:axis})? I think it looks better that way, but whatever you think is fine will work.
        //These are just problems I came across when making mygame.js
KEYS.bindKeyHold(['ArrowLeft',  'a'], elapsed => {player.x -= elapsed});
KEYS.bindKeyHold(['ArrowRight', 'd'], elapsed => {player.x += elapsed});
KEYS.bindKeyHold(['ArrowUp',    'w'], elapsed => {player.y -= elapsed});
KEYS.bindKeyHold(['ArrowDown',  's'], elapsed => {player.y += elapsed});
KEYS.bindKeyDown([' '], elapsed => {
	let p = new game.Thing({template:projectile});
	p.rotation = player.rotation;
	p.setSpeedByDirection(player.rotation, 3); //Makes p go a speed of 3 in the direction of player.rotation;
	
}); // looks like kaboom lol
//These are just ideas, not final, and the naming is definately not final.
//What was wrong with it?
//Hmmm....
//Do you like my template idea?
//Yea, that was my first idea, but then templates just made more sense because they were also a way to group things. Like in the enemy.collided above. Otherwise you would have to loop through every enemy or something. But these are just ideas, it doesn't matter whether or not we use them.
// enemy.clone()?
new game.Thing({template:enemy});
game.hook('gameloop', function() {
	for (let e of enemy.members) {
		enemy.to({
        destination:player,
        xSpeed: 5,
        ySpeed: 5,
    });
	}
});
setInterval(()=>{
	new game.Thing({template:enemy}); //make a new enemy.
}, 5000);
game.start();
