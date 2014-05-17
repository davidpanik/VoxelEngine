var Controls = function() {
	// Keyboard
	$("body").on("keydown", function(event) {		
		//console.log(event.which);
		
		if (Pause.active) return false;
		
		var move = {
			up: function() {
				if (Master.player.x > 0) {
					Master.player.move(-1, 0, 0);
					Master.camera.update();
				}
			},
			
			down: function() {
				if (Master.player.x < Master.grid.size -1) {
					Master.player.move( 1, 0, 0);
					Master.camera.update();
				}
			},
			
			left: function() {
				if (Master.player.y < Master.grid.size -1) {
					Master.player.move(0,  1, 0);
					Master.camera.update();
				}
			},
			
			right: function() {
				if (Master.player.y > 0) {
					Master.player.move(0, -1, 0);
					Master.camera.update();
				}
			}
		};
		
		var movements = [
			{
				"w": move.up,
				"s": move.down,
				"a": move.left,
				"d": move.right
			},
			{
				"w": move.left,
				"s": move.right,
				"a": move.down,
				"d": move.up
			},
			{
				"w": move.down,
				"s": move.up,
				"a": move.right,
				"d": move.left
			},
			{
				"w": move.right,
				"s": move.left,
				"a": move.up,
				"d": move.down
			}
		];
		
		/*
		if (event.which === 37) Master.camera.move( 1, -1, 0); // Left
		if (event.which === 39) Master.camera.move(-1,  1, 0); // Right
		
		if (event.which === 38) Master.camera.move( 1,  1, 0); // Up
		if (event.which === 40) Master.camera.move(-1, -1, 0); // Down
		*/
		
		if (event.which === 87) movements[Master.camera.rotation]["w"](); // move.up();    // W
		if (event.which === 83) movements[Master.camera.rotation]["s"](); // move.down();  // S
		if (event.which === 65) movements[Master.camera.rotation]["a"](); // move.left();  // A
		if (event.which === 68) movements[Master.camera.rotation]["d"](); // move.right(); // D
		
		if (event.which === 32) { // Space
			if (
				 (Master.player.z === 0 || Master.grid.find(Master.player.x, Master.player.y, Master.player.z - 1)) && 
				!Master.grid.find(Master.player.x, Master.player.y, Master.player.z + 1) && 
				!Master.grid.find(Master.player.x, Master.player.y, Master.player.z + 2) && 
				!Master.grid.find(Master.player.x, Master.player.y, Master.player.z + 3) 
			) {
				Master.player.move(0, 0, 3);
			}
		}
		
		if (event.which === 189 || event.which === 109) Master.camera.zoom(-1); // Minus
		if (event.which === 187 || event.which === 107) Master.camera.zoom( 1); // Plus
		
		if (event.which === 81) Master.camera.turn( 1); // Q
		if (event.which === 69) Master.camera.turn(-1); // E
	});
};