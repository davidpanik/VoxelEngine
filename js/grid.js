// A REPRESENTATION OF A GAME SPACE - A 3D AREA THAT CAN CONTAIN OBJECTS

var Grid = function(canvas, size) {
	time.start("grid.create");

	var grid = {
		size:    size ? size : 10,
		center:  Math.round(size / 2),
		canvas:  canvas,
		objects: [],

		// Find if an object exists at a set location
		find: function(x, y, z) {
			time.start("grid.find");

			// Loop through every object in the grid
			for (var counter = 0, length = this.objects.length; counter < length; counter++) {
				// Check if it matches the specified co-ordinates
				if (this.objects[counter].x === x && this.objects[counter].y === y && this.objects[counter].z === z) {
					time.stop("grid.find");
					return this.objects[counter];
				}
			}
			
			time.stop("grid.find");
			
			return false;
		},
		
		// Add a new object to the grid
		add: function(object) {
			time.start("grid.add");
			
			// Ensure objects aren't added to non-empty locations
			if (this.find(object.x, object.y, object.z))
				return false;
			
			this.objects.push(object); // Actually add the object
			
			time.stop("grid.add");
			
			return this;
		},
		
		// Remove an object from the grid
		remove: function(object) {
			time.start("grid.remove");
			
			var index = this.objects.indexOf(object); // Find it's location
		
			if (index > -1) {
				this.objects.splice(index, 1); // Get rid of it
			}

			time.stop("grid.remove");
			
			return this;
		},
		
		// Order the objects on the grid so that they appear in line of sight (furthest away first, nearest last)
		order: function() {
			time.start("grid.order");
			
			this.objects.sort(function(alpha, beta) {
				var
					xDiff = alpha.x - beta.x,
					yDiff = alpha.y - beta.y,
					zDiff = alpha.z - beta.z;
					
				if (xDiff !== 0) return xDiff;
				if (yDiff !== 0) return yDiff;
				if (zDiff !== 0) return zDiff;
			});
			
			time.stop("grid.order");
			
			return this;
		},
		
		// Wipe the grid
		empty: function() {
			this.objects = [];
			
			return this;
		},
		
		// Render the contents of the grid
		render: function() {
			time.start("grid.render");
			
			this.canvas.clear(); // Reset the canvas

			// Loop through each object in the grid
			for (var counter = 0, length = this.objects.length; counter < length; counter++) {
				this.objects[counter].render(); // Render that object
			}
			
			time.stop("grid.render");
			
			return this;
		}
	};
	
	time.stop("grid.create");
	
	return grid;
};
