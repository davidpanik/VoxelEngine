// CREATE AN INDIVIDUAL OBJECT THAT CAN EXIST WITHIN THE WORLD (E.G. A CUBE)

var Object = function(preferences) {
	time.start("object.create");
	
	var object = {
		// Default values
		type:      "cube",
		x:         0,
		y:         0,
		z:         0,
		colour:    "CCCCCC",
		opacity:   1,
		size:      1,
		cubeSize:  34,
		breakable: false,
		floating:  false,
		
		// Attributes used by Obelisk for rendering
		obelisk: {
			colour:     {},
			dimension:  {},
			primitive:  {},
			p3d:        {}
		},
		
		// Set the colour of this object
		setColour: function() {
			// Rather than specifying colours of edges and individual surfaces, we just set one base colour and then work out the rest based on the primitive type
			switch (this.type) {
				case "cube":
					this.obelisk.colour = new obelisk.CubeColor().getByHorizontalColor(combineColourOpacity(this.colour, this.opacity));

					break;
				
				case "pyramid":
					this.obelisk.colour = new obelisk.PyramidColor().getByRightColor(combineColourOpacity(this.colour, this.opacity));
				
					break;
					
				case "brick":
					this.obelisk.colour = new obelisk.SideColor().getByInnerColor(combineColourOpacity(this.colour, this.opacity));
					
					break;
					
				case "sideX":
					this.obelisk.colour = new obelisk.SideColor().getByInnerColor(combineColourOpacity(this.colour, this.opacity));
				
					break;
					
				case "sideY":
					this.obelisk.colour = new obelisk.SideColor().getByInnerColor(combineColourOpacity(this.colour, this.opacity));

					break;
			};
			
			return this;
		},
		
		// Set the dimensions of this object (default is 1x1x1)
		setDimension: function(cubeSize) {
			if (cubeSize) this.cubeSize = cubeSize;
			
			// Again, slightly different function required for different primitive types
			switch (this.type) {
				case "cube":
					this.obelisk.dimension = new obelisk.CubeDimension(this.cubeSize * this.size, this.cubeSize * this.size, this.cubeSize * this.size);
			
					break;
				
				case "pyramid":
					this.obelisk.dimension = new obelisk.PyramidDimension(this.cubeSize * this.size);
				
					break;
					
				case "brick":
					this.obelisk.dimension = new obelisk.BrickDimension(this.cubeSize * this.size, this.cubeSize * this.size);
				
					break;
					
				case "sideX":
					this.obelisk.dimension = new obelisk.SideXDimension(this.cubeSize * this.size, this.cubeSize * this.size);
					
					break;
					
				case "sideY":
					this.obelisk.dimension = new obelisk.SideYDimension(this.cubeSize * this.size, this.cubeSize * this.size);
					
					break;
			};
			
			return this;
		},
		
		// Create the Obelisk primite object (this is actual thing that will be drawn to screen)
		setPrimitive: function() {
			switch (this.type) {
				case "cube":
					this.obelisk.primitive = new obelisk.Cube(this.obelisk.dimension, this.obelisk.colour);
					break;
				
				case "pyramid":
					this.obelisk.primitive = new obelisk.Pyramid(this.obelisk.dimension, this.obelisk.colour);
					
					break;
					
				case "brick":
					this.obelisk.primitive = new obelisk.Brick(this.obelisk.dimension, this.obelisk.colour);
					
					break;
					
				case "sideX":
					this.obelisk.primitive = new obelisk.SideX(this.obelisk.dimension, this.obelisk.colour);
					
					break;
					
				case "sideY":
					this.obelisk.primitive = new obelisk.SideY(this.obelisk.dimension, this.obelisk.colour);

					break;
			};
		
			return this;
		},
		
		// The 3D point (location) of the object (x, y, z)
		setP3d: function() {
			this.obelisk.p3d = new obelisk.Point3D(this.x * this.cubeSize, this.y * this.cubeSize, this.z * this.cubeSize);
		
			return this;
		},

		// Draw this object to the canvas
		render: function() {
			time.start("object.render");

			this.setP3d();
			
			Master.canvas.render(this.obelisk.primitive, this.obelisk.p3d);

			time.stop("object.render");
			
			return this;
		},
		
		// Work if this object can/should fall downwads
		gravity: function() {
			time.start("object.gravity");
			
			// Object can fall (!floating) and has room below to fall)
			if (this.z > 0 && !this.floating) {
				this.move(0, 0, -1); // Move downwards by one
				time.stop("object.gravity");
				return true;
			}
			
			time.stop("object.gravity");
			
			return false;
		},
		
		// Relocate an object by a set amount
		move: function(xDir, yDir, zDir) {
			time.start("object.move");
			
			// Ensure the new location is empty
			if (!Master.grid.find(this.x + xDir, this.y + yDir, this.z + zDir)) {
				// Set the new co-ordinates
				this.x += xDir;
				this.y += yDir;
				this.z += zDir;
				
				time.stop("object.move");
				
				return true;
			} else
				return false;
			
			time.stop("object.move");
		
			return this;
		},
		
		// Reposition this object based on the direction it is being viewed from
		rotate: function(rotation) {
			time.start("object.rotate");
			
			var 
				rotatedX = this.x,
				rotatedY = this.y;

			// Do some simple co-ordinate switching, rather than a matrix transform
			if (rotation === 0) {
				rotatedX = this.x;
				rotatedY = this.y;
			} else if (rotation === 1) {
				rotatedX = this.y * -1;
				rotatedY = this.x;
			} else if (rotation === 2) {
				rotatedX = this.x * -1;
				rotatedY = this.y * -1;
			} else if (rotation === 3) {
				rotatedX = this.y;
				rotatedY = this.x * -1;
			}
			
			// Set the new co-ordinates
			this.x = rotatedX;
			this.y = rotatedY;						

			time.stop("object.rotate");

			return this;
		}
	};
	
	// Override the object's defaults with any prefrences passed in
	for (var x in preferences) {
		object[x] = preferences[x];
	}
	
	// Set the basic elements of the object
	object
	.setColour()
	.setDimension()
	.setPrimitive();
	
	time.stop("object.create");
	
	return object;
}
