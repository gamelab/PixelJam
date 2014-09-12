var PixelJam = PixelJam || {};

PixelJam.Character = function(state, type, x, y) {

	//Stats, set for each character in the 'stats' json file.
	this.stats = {
	 	health: 0,
		mana: 0,
		defense: 0,
		type: 0,
		autoAttackStrength: 0,
		autoAttackSpeed: 0,
		walkSpeed: 0 
	};

	this.state = state;

	var baseData = JSON.parse(this.state.data.stats.data);

	switch(type) {
		case 'fire':
			var texture = this.state.textures.fireCharacter;
			this.stats = baseData.fire;
			break;
		case 'water':
			var texture = this.state.textures.waterCharacter;
			this.stats = baseData.water;
			break;
		case 'air':
			var texture = this.state.textures.airCharacter;
			this.stats = baseData.air;
			break;
		case 'earth':
			var texture = this.state.textures.earthCharacter;
			this.stats = baseData.earth;
			break;
	}

	Kiwi.GameObjects.Sprite.call(this, state, texture, 0, 0);

	this.alive = true;

	this.movementPoint = new Kiwi.Geom.Point(x, y);

	this.bounds = null;

	this.update();
}

Kiwi.extend(PixelJam.Character, Kiwi.GameObjects.Sprite);


PixelJam.Character.prototype.moveTo = function(x,y) {
	this.movementPoint.setTo(x, y);
}


PixelJam.Character.prototype.update = function(x,y) {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.bounds = this.box.bounds;

	//Check distance and stuff
	this.x = Kiwi.Utils.GameMath.clamp(this.movementPoint.x - this.bounds.width * 0.5, PixelJam.Play.mapSize.x - this.bounds.width, 0);
	this.y = Kiwi.Utils.GameMath.clamp(this.movementPoint.y, PixelJam.Play.mapSize.y - this.bounds.height, 0 );


}
