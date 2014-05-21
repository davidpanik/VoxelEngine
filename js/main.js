// https://github.com/nosir/obelisk.js

// TODO Comment code (just main.js now)
// TODO Make blocks in front of player transparent
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
	.diamondSquare(Master.grid);
	//.addFloor(Master.grid)
	//.fromMap(Master.grid, map);
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
	
	diamondSquare: function(grid) {
		Pause.on();
		
		function Terrain() {
			this.size = grid.size;
			this.max = this.size - 1;
			this.map = new Float32Array(this.size * this.size);
		}
		
		Terrain.prototype.get = function(x, y) {
			if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
			return this.map[x + this.size * y];
		};

		Terrain.prototype.set = function(x, y, val) {
			this.map[x + this.size * y] = val;
		};

		Terrain.prototype.generate = function(roughness) {
			var self = this;

			this.set(0, 0, self.max);
			this.set(this.max, 0, self.max / 2);
			this.set(this.max, this.max, 0);
			this.set(0, this.max, self.max / 2);

			divide(this.max);

			function divide(size) {
				var x, y, half = size / 2;
				var scale = roughness * size;
				if (half < 1) return;

				for (y = half; y < self.max; y += size) {
					for (x = half; x < self.max; x += size) {
						square(x, y, half, Math.random() * scale * 2 - scale);
					}
				}
				for (y = 0; y <= self.max; y += half) {
					for (x = (y + half) % size; x <= self.max; x += size) {
						diamond(x, y, half, Math.random() * scale * 2 - scale);
					}
				}
				
				divide(size / 2);
			}

			function average(values) {
				var valid = values.filter(function(val) { return val !== -1; });
				var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
				return total / valid.length;
			}

			function square(x, y, size, offset) {
				var ave = average([
					self.get(x - size, y - size),   // upper left
					self.get(x + size, y - size),   // upper right
					self.get(x + size, y + size),   // lower right
					self.get(x - size, y + size)    // lower left
				]);
				self.set(x, y, ave + offset);
			}

			function diamond(x, y, size, offset) {
				var ave = average([
					self.get(x, y - size),      // top
					self.get(x + size, y),      // right
					self.get(x, y + size),      // bottom
					self.get(x - size, y)       // left
				]);
				self.set(x, y, ave + offset);
			}
		};		
		
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

		var terrain = new Terrain();
		terrain.generate(0.7);
		
		for (var counter1 = 0, length = grid.size; counter1 < length; counter1++) {
			for (var counter2 = 0, length = grid.size; counter2 < length; counter2++) {
				addColumn(counter1, counter2, terrain.get(counter1, counter2));
			}
		}
		
		console.log(terrain.map);
		
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