// CONTROLS GRAVITY - IE PULLS APPROPRIATE OBJECTS DOWNWARDS WITHIN THE GRID

// Create a new gravity instance
var Gravity = function(grid, interval) {
	time.start("gravity.create");
	
	var gravity = {
		interval: interval ? interval : 200, // Interval in milliseconds between carrying out gravity checks
		timer: {},
		grid: grid,
		
		init: function(interval) {
			if (interval) this.interval = interval;

			var self = this;
			
			this.timer = setInterval(function() { self.tick() }, this.interval); // Start gravity checker ticking
			
			return this;
		},
		
		// Check for things to apply gravity to
		tick: function() {
			time.start("gravity.tick");
			
			// Only proceed if the game isn't paused
			if (!Pause.active) {
				var movementOccured = false;

				// Run through every object in the master grid
				for (var counter = 0, length = this.grid.objects.length; counter < length; counter++) {
					if (this.grid.objects[counter].gravity()) // Apply gravity check/action to that individual object
						movementOccured = true;
				}
				
				if (movementOccured) Master.camera.update(); // Only bother updating the camera if anything actually moved
			}
			
			time.stop("gravity.tick");
		}
	};

	gravity.init();
	
	time.stop("gravity.create");
	
	return gravity;
};
