var PixelJam = PixelJam || {};

PixelJam.Portrait = function(state, type, x, y, character, callback) {

	Kiwi.GameObjects.Sprite.call(this, state, state.textures.portraits, x, y);

	switch(type) {
		case 'fire':
			this.cellIndex = 0;
			break;
		case 'water':
			this.cellIndex = 1;
			break;
		case 'air':
			this.cellIndex = 2;
			break;
		case 'earth':
			this.cellIndex = 3;
			break;
	}

	this.character = character;
	this.callback = callback;

}

Kiwi.extend( PixelJam.Portrait, Kiwi.GameObjects.Sprite);

PixelJam.Portrait.prototype.executeCallback = function() {
	this.callback( this.character );
}