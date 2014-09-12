var PixelJam = PixelJam || {};

PixelJam.Player = function(state, camera, player) {

	this.state = state;
	this.player = player;
	this.camera = camera;

	var x = 0;
	var y = 0;

	if(this.player == 1) {
		x = 600;
		y = 100; //Move to bottom left
	
	} else if(this.player == 2) {
		x = 100;
		y = 600; //Move to top right

		this.camera.transform.scaleX = -1;
		this.camera.transform.scaleY = -1;
	}

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


	}

}