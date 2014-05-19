// CREATES AND CONTROLS AN OBELISK CANVAS INSTANCE

// Create a new instance
var Canvas = function() {
	time.start("create.canvas");
	
	var canvas = {
		// Default values
		width:         800,
		height:        600,
		domId:         "canvas",
		
		domObj:        {},
		point:         {},
		pixelView:     {},
		
		init: function(domId) {
			if (domId) this.domId = domId;
			
			// Set the width and height of the canvas in the ODM
			$("#" + this.domId)
			.attr("width", this.width)
			.attr("height", this.height);
			
			// Initalise objects
			this.domObj    = document.getElementById(this.domId),
			this.point     = new obelisk.Point(this.width / 2, this.height / 2),
			this.pixelView = new obelisk.PixelView(this.domObj, this.point);

			// Ensure the canvas is empty
			this.clear();
			
			return this;
		},
		
		// Clear out the contents of the canvas
		clear: function() {
			time.start("canvas.clear");
			
			this.pixelView.clear();
			
			time.stop("canvas.clear");
			
			return this;
		},
		
		// Render an individual Obelisk object to the canvas
		render: function(object, point) {
			time.start("canvas.render");
			
			this.pixelView.renderObject(object, point);
			
			time.stop("canvas.render");
			
			return this;
		}
	};
	
	canvas.init();
	
	time.stop("create.canvas");
	
	return canvas;
};
