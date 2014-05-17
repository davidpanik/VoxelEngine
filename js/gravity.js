var Gravity = function(grid, interval) {
	time.start("gravity.create");
	
	var gravity = {
		interval: interval ? interval : 200,
		timer: {},
		grid: grid,
		
		init: function(interval) {
			if (interval) this.interval = interval;

			var self = this;
			
			this.timer = setInterval(function() { self.tick() }, this.interval);
			
			return this;
		},
		
		tick: function() { // Time consuming function
			time.start("gravity.tick");
			
			if (!Pause.active) {
				var movementOccured = false;

				for (var counter = 0, length = this.grid.objects.length; counter < length; counter++) {
					if (this.grid.objects[counter].gravity())
						movementOccured = true;
				}
				
				if (movementOccured) Master.camera.update();
			}
			
			time.stop("gravity.tick");
		}
	};

	gravity.init();
	
	time.stop("gravity.create");
	
	return gravity;
};
