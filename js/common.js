function random(r1, r2, r3) {
	var min      = 0;
	var max      = 0;		
	var interval = 1;
	
	if (typeof(r1) != "undefined") {
		min = 0;
		max = r1;
	}
	
	if (typeof(r2) != "undefined") {
		min = r1;
		max = r2;			
	}
	
	if (typeof(r3) != "undefined") {
		interval = r3;
	}
	
	var result = Math.floor(Math.random() * (max - min)) + min;
	
	if (interval > 1) {
		result = Math.round(result / interval) * interval;
	}

	return result;
};

function clone(obj) {
	time.start("clone");
	
	if (null == obj || "object" != typeof obj) return obj;
	
	var copy = obj.constructor();
	
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	
	time.stop("clone");
	
	return copy;
}

function combineColourOpacity(colour, opacity) {
	time.start("combineColourOpacity");
	
	function componentToHex(c) {
		var hex = c.toString(16).toUpperCase();
		return hex.length == 1 ? "0" + hex : hex;
	}			
	
	var result = "0x" + (componentToHex(Math.round(opacity * 255))) + colour;
	
	time.stop("combineColourOpacity");
	
	return result;
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();