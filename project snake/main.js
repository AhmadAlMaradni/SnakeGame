
var COLS = 26
var ROWS = 26

var
EMPTY = 0
SNAKE = 1
FRUIT = 2
var
LEFT  = 0,
UP    = 1,
RIGHT = 2,
DOWN  = 3,
KEY_LEFT  = 37,
KEY_UP    = 38,
KEY_RIGHT = 39,
KEY_DOWN  = 40,

canvas,	  
ctx,	  
keystate, 
frames,   
score=0,	
hscore=0;

window.onload=function(){
	$(".pscore").text("score :"+score)
	$(".badge").text(hscore)
}
function callLoad(){
	$(".pscore").text("score :" +score)
	$(".badge").text(hscore)
}

// *******************************
  grid = {
	width: null,  
	height: null, 
	_grid: null, 

	init: function(d, c, r) {
		this.width = c;
		this.height = r;
		this._grid = [];
		for (var x=0; x < c; x++) {
			this._grid.push([]);
			for (var y=0; y < r; y++) {
				this._grid[x].push(d);
			}
		}
	},
	
	set: function(val, x, y) {
		this._grid[x][y] = val;
	},

	get: function(x, y) {
		return this._grid[x][y];
	}
}

  //The snake, works as a queue (FIFO, first in first out) of data    (object)
snake = {
	direction: null, 
	last: null,		 // Object,
	_queue: null,	 

	init: function(d, x, y) {
		this.direction = d;
		this._queue = [];
		this.insert(x, y);
	},
	
	insert: function(x, y) {
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
	},
	
	remove: function() {
		return this._queue.pop();
	}
};

function setFood() {
	var empty = [];
	
	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
			if (grid.get(x, y) === EMPTY) {
				empty.push({x:x, y:y});
			}
		}
	}
	var randpos = empty[Math.round(Math.random()*(empty.length - 1))];
	grid.set(FRUIT, randpos.x, randpos.y);
}

// ***********************************
function main() {
		frames = 0;
	canvas = document.createElement("canvas");
	canvas.width = COLS*20;
	canvas.height = ROWS*20;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	keystate = {};

	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});
	// intatiate game objects and starts the game loop
	init();
	loop();
}

function init() {
	score = 0;
	grid.init(EMPTY, COLS, ROWS);
	var startPoint = {x:Math.floor(COLS/2), y:ROWS-1};
	snake.init(UP, startPoint.x, startPoint.y);
	grid.set(SNAKE, startPoint.x, startPoint.y);
	setFood();
}

function loop() {
	update();
	draw();
	window.requestAnimationFrame(loop, canvas);
}

function update() {
	frames++;
	if (keystate[KEY_LEFT] && snake.direction !== RIGHT) {
		snake.direction = LEFT;
	}
	if (keystate[KEY_UP] && snake.direction !== DOWN) {
		snake.direction = UP;
	}
	if (keystate[KEY_RIGHT] && snake.direction !== LEFT) {
		snake.direction = RIGHT;
	}
	if (keystate[KEY_DOWN] && snake.direction !== UP) {
		snake.direction = DOWN;
	}

	if (frames%8 === 0) {
		var nx = snake.last.x;
		var ny = snake.last.y;

		switch (snake.direction) {
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case RIGHT:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
		}

		if (0 > nx || nx > grid.width-1  ||
			0 > ny || ny > grid.height-1 ||
			grid.get(nx, ny) === SNAKE
		) {
			alert("game over");
			$(".pscore").text("score:"+0)

		return main()	
		}

		if (grid.get(nx, ny) === FRUIT) {

			score++;
			 if(score>hscore){
				hscore=score;
			}
			callLoad();
			setFood();
		} else {
			var tail = snake.remove();
			grid.set(EMPTY, tail.x, tail.y);
		}

		grid.set(SNAKE, nx, ny);
		snake.insert(nx, ny);
	}
}

  //Render the grid to the canvas.
function draw() {

	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;

	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {

			switch (grid.get(x, y)) {
				case EMPTY:
					ctx.fillStyle = "#00174C";
					break;

				case SNAKE:
				    var my_gradient=ctx.createLinearGradient(0,0,200,1000);
					my_gradient.addColorStop(0.5,"#15FFCC");
					my_gradient.addColorStop(0.4,"#EDFF16");
					my_gradient.addColorStop(0.3,"#FF8FFF");
					my_gradient.addColorStop(0.2,"#96FF76");
					ctx.fillStyle=my_gradient;	
					break;

				case FRUIT:
					var my_frut=ctx.createLinearGradient(0,0,170,0);
					my_frut.addColorStop(0.1,"#FFFFFF");
					my_frut.addColorStop(0.5,"#FF0000");
					ctx.fillStyle=my_frut;
					break;
			}
			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}
}