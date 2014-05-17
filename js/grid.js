var Grid = function(canvas, size) {
	time.start("grid.create");

	var grid = {
		size: size ? size : 10,
		center: Math.round(size / 2),
		canvas: canvas,
		objects: [],

		find: function(x, y, z) {
			time.start("grid.find");

			for (var counter = 0, length = this.objects.length; counter < length; counter++) {
				if (this.objects[counter].x === x && this.objects[counter].y === y && this.objects[counter].z === z) {
					time.stop("grid.find");
					return this.objects[counter];
				}
			}
			
			time.stop("grid.find");
			
			return false;
		},
		
		add: function(object) {
			time.start("grid.add");
			
			if (this.find(object.x, object.y, object.z))
				return false;
			
			this.objects.push(object);
			
			time.stop("grid.add");
			
			return this;
		},
		
		remove: function(object) {
			time.start("grid.remove");
			
			var index = this.objects.indexOf(object)
		
			if (index > -1) {
				this.objects.splice(index, 1);
			}

			time.stop("grid.remove");
			
			return this;
		},
		
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
		
		empty: function() {
			this.objects = [];
			
			return this;
		},
		
		render: function() {
			time.start("grid.render");
			
			this.canvas.clear();

			for (var counter = 0, length = this.objects.length; counter < length; counter++)
				this.objects[counter].render();
			
			time.stop("grid.render");
			
			return this;
		}
	};
	
	time.stop("grid.create");
	
	return grid;
};
