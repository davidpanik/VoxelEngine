// https://github.com/nosir/obelisk.js

// TODO Comment code
// TODO Make blocks in front of player opaque
// TODO Get rid of Master.* 
// TODO No player shadow?

var Master = {};

function init() {
	Pause.on();

	Master.canvas  = Canvas();
	Master.grid    = Grid(Master.canvas, 60);
	Master.gravity = Gravity(Master.grid);
	Master.camera  = Camera(Master.grid);
	
	Master.player = 
		Object({
			x: Math.round(Master.grid.center / 2),
			y: Math.round(Master.grid.center / 2),
			z: 10,
			type: "pyramid",
			colour: "FFFF00",
			cubeSize: Master.camera.cubeSize,
		});
	
	Master.grid
	.add(Master.player);			

	Master.camera.setFocus(Master.player);
	
	Controls();
	
	PopulateGrid
	.addFloor(Master.grid)
	.fromMap(Master.grid, map);
	//PopulateGrid.random(Master.grid);
	//PopulateGrid.landscape(Master.grid);
	
	/*
	setInterval(function() {
		Master.grid.add(
			Object({
				x: random(Master.grid.size),
				y: random(Master.grid.size),
				z: random(10, Master.grid.size),
				cubeSize: Master.camera.cubeSize
			})
		);
	}, 200);
	*/

}

$(document).ready(init);

var Colours = {
	reds:   ["C90000", "C90000", "EC1F00", "9E0000"],
	greens: ["007F0E", "007F46", "00C113", "009E44"],
	greys:  ["808080", "808080", "404040", "A0A0A0"],
	blues:  ["0094FF", "001BB7", "00137F", "54AFFF"],
	
	random: function(colour) {
		var array = this[colour];
		
		return array[random(array.length)];
	}
};

var PopulateGrid = {
	random: function(grid) {
		Pause.on();
		
		for (var x = 0; x < 1600; x++) {
			grid.add(
				Object({
					x: random(grid.size),
					y: random(grid.size),
					z: random(1, grid.center),
					type: "cube",
					cubeSize: Master.camera.cubeSize,
					colour: Colours.random("blues")
				})
			);
		}
		
		Pause.off();
		
		return this;
	},
	
	landscape: function(grid) {
		Pause.on();
		
		function addBlock(x, y, z) {
			grid.add(
				Object({
					x: x,
					y: y,
					z: z,
					type: "cube",
					cubeSize: Master.camera.cubeSize,
					colour: Colours.random("greens")
				})
			);
		}
		
		function addColumn(x, y, height) {
			for (var counter = 0; counter < height; counter++) {
				addBlock(x, y, counter);
			}
		}

		for (var counter1 = 0; counter1 < grid.size; counter1++) {
			for (var counter2 = 0; counter2 < grid.size; counter2++) {
				addColumn(counter1, counter2, random(1, 4));
			}
		}
		
		//for (var counter = 0; counter < 600; counter++) {
			//addColumn(random(grid.size), random(grid.size), random(1, 4));
		//}
		
		Pause.off();
		
		return this;
	},
	
	fromMap: function(grid, map) {
		Pause.on();
		
		function addBlock(x, y, z, colour) {
			grid.add(
				Object({
					x: x,
					y: y,
					z: z,
					type: "cube",
					cubeSize: Master.camera.cubeSize,
					colour: colour,
					floating: true
				})
			);
		}

		for (var counter = 0, length = map.data.length; counter < length; counter++) {
			var object = map.data[counter];

			addBlock(
				object.x,
				object.y,
				object.z,
				map.colors[object.c]
			);
		}
		
		Pause.off();
		
		return this;
	},
	
	addFloor: function(grid) {
		Pause.on();
		
		function addBlock(x, y, z, colour) {
			grid.add(
				Object({
					x: x,
					y: y,
					z: z,
					type: "cube",
					cubeSize: Master.camera.cubeSize,
					colour: colour,
					floating: true
				})
			);
		}
		
		for (var counter1 = 0; counter1 < grid.size; counter1++) {
			for (var counter2 = 0; counter2 < grid.size; counter2++) {
				addBlock(
					counter1,
					counter2,
					0,
					"CCCCCC"
				);
			}
		}
		
		Pause.off();
		
		return this;
	}
};

var Pause = {
	active: true,
	
	on: function() {
		this.active = true;
		$("body").addClass("paused");
	},
	
	off: function() {
		var self = this;

		setTimeout(function() {
			self.active = false;
			$("body").removeClass("paused");
		}, 0);				
	}
};

function random(r1, r2, r3) {
	var min      = 0;
	var max      = 0;		
	var interval = 1;
	
	if (typeof(r1) != "undefined") {
		min = 0;
		max = r1;
	}
	
	if (typeof(r2) != "undefined") {
		min = r1;
		max = r2;			
	}
	
	if (typeof(r3) != "undefined") {
		interval = r3;
	}
	
	var result = Math.floor(Math.random() * (max - min)) + min;
	
	if (interval > 1) {
		result = Math.round(result / interval) * interval;
	}

	return result;
};

function clone(obj) {
	time.start("clone");
	
	if (null == obj || "object" != typeof obj) return obj;
	
	var copy = obj.constructor();
	
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	
	time.stop("clone");
	
	return copy;
}

function combineColourOpacity(colour, opacity) {
	time.start("combineColourOpacity");
	
	function componentToHex(c) {
		var hex = c.toString(16).toUpperCase();
		return hex.length == 1 ? "0" + hex : hex;
	}			
	
	var result = "0x" + (componentToHex(Math.round(opacity * 255))) + colour;
	
	time.stop("combineColourOpacity");
	
	return result;
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();