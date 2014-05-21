// CONTROLS CONTENT FOR ACTUAL RENDERING TO SCREEN

var Camera = function(grid) {
	time.start("create.camera");

	var camera = {
		// Default values
		x: Math.round(grid.size / 2),
		y: Math.round(grid.size / 2),
		z: 0,
		
		size:      0,
		cubeSize:  0,
		zoomLevel: 17,
		rotation:  0,
		
		focus:    null,
		grid:     grid,
		viewPort: null,
		
		addShadows: true, // Turn shadow addition on/off (affects performance)

		// Reposition the camera but a specified amount
		move: function(x, y, z) {
			time.start("camera.move");
		
			this.x += x;
			this.y += y;
			this.z += z;

			this.update();
			
			time.stop("camera.move");
			
			return this;
		},
		
		// Relocated the camera to a specified location
		center: function(x, y, z) {
			time.start("camera.center");

			this.x = x;
			this.y = y;
			this.z = z;
			
			time.stop("camera.center");
			
			return this;
		},
		
		// Rotate the perspective of the camera
		turn: function(direction) {
			time.start("camera.turn");
		
			direction = direction ? direction : 1;
			
			this.rotation += direction;
			
			// Rotate in a full circle
			if (this.rotation < 0) this.rotation = 3;
			if (this.rotation > 3) this.rotation = 0;
			
			this.update();
			
			time.stop("camera.turn");
			
			return this;
		},
		
		// Decrease/increase the camera's zoom level (amount of cubes shown and cube size)
		zoom: function(direction) {
			time.start("camera.zoom");
		
			Pause.on(); // Pause first because they can have a noticeable delay

			this.zoomLevel += direction; // Do the actual zoom change
			
			// Enforce max and min limits
			if (this.zoomLevel < 2)  this.zoomLevel = 2;
			if (this.zoomLevel > 18) this.zoomLevel = 18;
			
			// Update the size of the viewport and of the cubes shown
			this.size = 30 - this.zoomLevel;
			this.cubeSize = (this.zoomLevel + 2) * 2;

			var self = this;

			setTimeout(function() {
				// Loop through every object in the grid
				for (var counter = 0, length = self.grid.objects.length; counter < length; counter++) {
					var object = self.grid.objects[counter];
					
					object.setDimension(self.cubeSize).setPrimitive(); // Set it to use the new cube size
				}

				self.update();
				
				Pause.off();
				
				time.stop("camera.zoom");
			}, 0);

			return this;
		},
		
		// Set a focus object for the camera to track (e.g. the player)
		setFocus: function(focus) {
			this.focus = focus;
			
			return this;
		},
		
		// Recalculate contents and positions of the camera viewport
		update: function() {
			time.start("camera.update");
			
			//if (!Pause.active) {
				// If a focus point has been set, update to its current location
				if (this.focus !== null)
					this.center(this.focus.x, this.focus.y, this.focus.z);
				
				// Create a new smaller grid to represent the viewport
				this.viewPort = Grid(this.grid.canvas, this.size);

				time.start("camera.update.findscope");
				
				// Run through every object in the grid
				for (var counter = 0, length = this.grid.objects.length; counter < length; counter++) {
					var object = this.grid.objects[counter];
					
					// Find the ones which are in view
					if (
						object.x >= this.x - this.size && object.x <= this.x + this.size &&
						object.y >= this.y - this.size && object.y <= this.y + this.size &&
						object.z >= this.z - this.size && object.z <= this.z + this.size
					) {
						var newObject = clone(object); // Make a copy rather than modifying the original
		
						// Set the object's position relative to the camera
						newObject.x = newObject.x - this.x;
						newObject.y = newObject.y - this.y;
						newObject.z = newObject.z - this.z;

						newObject.rotate(this.rotation); // Update rotation to match the camera's perspective
						
						this.viewPort.add(newObject); // Finally add it to the viewport
					}
				}

				time.stop("camera.update.findscope");
				
				// If the shadows option has been activated
				if (this.addShadows) {
					time.start("camera.update.addShadows");
					
					var shadows = [];
					
					// Look through every object in the grid
					for (var counter = 0, length = this.viewPort.objects.length; counter < length; counter++) {
						var object = this.viewPort.objects[counter];

						// If this object is above the ground and has empty space below it
						if (!this.viewPort.find(object.x, object.y, object.z - 1) && object.z > 0) {
							var
								depth = object.z - 1,
								distance = 1,
								opacity = 0;

							// Work out far below this object it is until the next object (or the ground)
							while (!this.viewPort.find(object.x, object.y, depth - 1) && depth > this.size * -1) {
								depth--;
								distance++;
							}
							
							// Don't show shadows beyond a certain distance
							if (distance < 10) {
								opacity = 1 - (distance / 10); // Work out how dark the shadow should be

								// Create the shadow object and store
								shadows.push(
									Object({
										x: object.x,
										y: object.y,
										z: depth,
										type: "brick",
										color: "000000",
										opacity: opacity,
										cubeSize: this.cubeSize
									})
								);
							}
						}
					}

					// Now add all the created shadow objects to the viewport
					for (var counter = 0, length = shadows.length; counter < length; counter++) {
						this.viewPort.add(shadows[counter]);
					}
					
					shadows = [];
					
					time.stop("camera.update.addShadows");
				}
			//}
		
			time.stop("camera.update");
			
			return this;
		},
		
		// Render the contents of the camera's viewport to the screen
		render: function() {
			time.start("camera.render");
			
			// Only proceed if not paused
			if (!Pause.active) {
				if (this.viewPort !== null)
					this.viewPort.order().render(); // Render the viewport
			}
			
			time.stop("camera.render");
			
			return this;
		}
	};

	camera.zoom(0); // Initialise the zoom level of the camera

	// Set the camera to render on each screen refresh
	(function animloop(){
		requestAnimFrame(animloop);
		camera.render();
	})();
	
	time.stop("create.camera");
	
	return camera;
};
