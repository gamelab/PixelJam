var PixelJam = PixelJam || {};

PixelJam.Player = function(state, camera, player) {

	this.state = state;
	this.player = player;

	var x = 0;
	var y = 0;
	var camMod = 1;

	if(this.player == 1) {
		x = 510;
		y = 1538; //Move to top right
		camMod = -1;
	
	} else if(this.player == 2) {
		x = 1538;
		y = 510; //Move to bottom left
		camera.transform.rotation = Math.PI;

	}
	this.camera = new PixelJam.Camera(camera, camMod);


	this.fireCharacter = new PixelJam.Character(this.state, 'fire', x + 100, y + 100);
	this.waterCharacter = new PixelJam.Character(this.state, 'water', x - 100, y + 100);
	this.airCharacter = new PixelJam.Character(this.state, 'air', x + 100, y - 100);
	this.earthCharacter = new PixelJam.Character(this.state, 'earth', x - 100, y - 100);


}

PixelJam.Player.prototype = {

	add: function(parent) {
		parent.addChild(this.fireCharacter);
		parent.addChild(this.waterCharacter);
		parent.addChild(this.airCharacter);
		parent.addChild(this.earthCharacter);
	},


	moveCamera: function(x, y) {


	},

	update: function() {
		this.camera.update();

	}

}