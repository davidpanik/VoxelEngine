var Canvas = function() {
	time.start("create.canvas");
	
	var canvas = {
		width:         800,
		height:        600,
		domId:         "canvas",
		domObj:        {},
		point:         {},
		pixelView:     {},
		
		init: function(domId) {
			if (domId) this.domId = domId;
			
			$("#" + this.domId)
			.attr("width", this.width)
			.attr("height", this.height);
			
			this.domObj    = document.getElementById(this.domId),
			this.point     = new obelisk.Point(this.width / 2, this.height / 2),
			this.pixelView = new obelisk.PixelView(this.domObj, this.point);

			this.clear();
			
			return this;
		},
		
		clear: function() {
			time.start("canvas.clear");
			
			this.pixelView.clear();
			
			time.stop("canvas.clear");
			
			return this;
		},
		
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
