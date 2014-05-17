var Camera = function(grid) {
	time.start("create.camera");

	var camera = {
		x: Math.round(grid.size / 2),
		y: Math.round(grid.size / 2),
		z: 0,
		
		size: 0,
		cubeSize: 0,
		zoomLevel: 13,
		rotation: 0,
		
		focus: null,
		grid: grid,
		viewPort: null,
		
		addShadows: true,

		move: function(x, y, z) {
			time.start("camera.move");
		
			this.x += x;
			this.y += y;
			this.z += z;

			this.update();
			
			time.stop("camera.move");
			
			return this;
		},
		
		center: function(x, y, z) {
			time.start("camera.center");

			this.x = x;
			this.y = y;
			this.z = z;
			
			time.stop("camera.center");
			
			return this;
		},
		
		turn: function(direction) {
			time.start("camera.turn");
		
			direction = direction ? direction : 1;
			
			this.rotation += direction;
			
			if (this.rotation < 0) this.rotation = 3;
			if (this.rotation > 3) this.rotation = 0;
			
			this.update();
			
			time.stop("camera.turn");
			
			return this;
		},
		
		zoom: function(direction) {
			time.start("camera.zoom");
		
			Pause.on();

			this.zoomLevel += direction;
			
			if (this.zoomLevel < 2)  this.zoomLevel = 2;
			if (this.zoomLevel > 18) this.zoomLevel = 18;
			
			this.size = 30 - this.zoomLevel;
			this.cubeSize = (this.zoomLevel + 2) * 2;

			var self = this;

			setTimeout(function() {
				for (var counter = 0, length = self.grid.objects.length; counter < length; counter++) {
					var object = self.grid.objects[counter];
					
					object.setDimension(self.cubeSize).setPrimitive();
				}

				self.update();
				
				Pause.off();
				
				time.stop("camera.zoom");
			}, 0);

			return this;
		},
		
		setFocus: function(focus) {
			this.focus = focus;
			
			return this;
		},
		
		update: function() {
			time.start("camera.update");
			
			//if (!Pause.active) {
				if (this.focus !== null)
					this.center(this.focus.x, this.focus.y, this.focus.z);
				
				this.viewPort = Grid(this.grid.canvas, this.size);

				time.start("camera.update.findscope");
				
				for (var counter = 0, length = this.grid.objects.length; counter < length; counter++) {
					var object = this.grid.objects[counter];
					
					if (
						object.x >= this.x - this.size && object.x <= this.x + this.size &&
						object.y >= this.y - this.size && object.y <= this.y + this.size &&
						object.z >= this.z - this.size && object.z <= this.z + this.size
					) {
						var newObject = clone(object);
		
						newObject.x = newObject.x - this.x;
						newObject.y = newObject.y - this.y;
						newObject.z = newObject.z - this.z;
						
						newObject.rotate(this.rotation);
						
						this.viewPort.add(newObject);
					}
				}

				time.stop("camera.update.findscope");
				
				if (this.addShadows) {
					time.start("camera.update.addshadows");
					
					var shadows = [];
					
					for (var counter = 0, length = this.viewPort.objects.length; counter < length; counter++) {
						var object = this.viewPort.objects[counter];

						if (!this.viewPort.find(object.x, object.y, object.z - 1) && object.z > 0) {
							var
								depth = object.z - 1,
								distance = 1,
								opacity = 0;

							while (!this.viewPort.find(object.x, object.y, depth - 1) && depth > this.size * -1) {
								depth--;
								distance++;
							}
							
							if (distance < 10) {
								opacity = 1 - (distance / 10);

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

					for (var counter = 0, length = shadows.length; counter < length; counter++) {
						this.viewPort.add(shadows[counter]);
					}
					
					shadows = [];
					
					time.stop("camera.update.addshadows");
				}
			//}
		
			time.stop("camera.update");
			
			//this.render();
			
			//this.viewPort = [];
			
			return this;
		},
		
		render: function() { // Time consuming function
			time.start("camera.render");
			
			if (!Pause.active) {
				if (this.viewPort !== null)
					this.viewPort.order().render();
			}
			
			time.stop("camera.render");
			
			return this;
		}
	};

	camera.zoom(0);

	(function animloop(){
		requestAnimFrame(animloop);
		camera.render();
	})();
	
	time.stop("create.camera");
	
	return camera;
};
