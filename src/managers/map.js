var PixelJam = PixelJam || {};

PixelJam.Map = function(state) {

	this.state = state;

	this.background = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures.map, 0, 0);

}

PixelJam.Map.prototype = {

	add: function(parent) {
		parent.addChild(this.background);
	},

	shutDown: function() {
		this.state = null;
		this.background.exists = false;
		this.background = null;
	}

}