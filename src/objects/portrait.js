var PixelJam = PixelJam || {};

PixelJam.Portrait = function(state, type, x, y, character, callback) {

	var texture = null;
	var energyTexture = null;

	switch(type) {
		case 'fire':
			texture = state.textures.fireAvatar;
			energyTexture = state.textures.fireEnergyBar;
			break;
		case 'water':
			texture = state.textures.waterAvatar;
			energyTexture = state.textures.waterEnergyBar;
			break;
		case 'air':
			texture = state.textures.airAvatar;
			energyTexture = state.textures.airEnergyBar;
			break;
		case 'earth':
			texture = state.textures.earthAvatar;
			energyTexture = state.textures.earthEnergyBar;
			break;
	}

	Kiwi.Group.call(this, state);

	this.x = x;
	this.y = y;

	this.background = new Kiwi.GameObjects.StaticImage( this.state, this.state.textures.barsBackground, 5, 65);
	this.addChild(this.background);

	this.energyBackground = new Kiwi.GameObjects.StaticImage( this.state, energyTexture, 5, 65 + 13 );
	this.energyBackground.rotPointX = 0;
	this.addChild(this.energyBackground);

	this.healthBackground = new Kiwi.GameObjects.StaticImage( this.state, this.state.textures.healthBar, 5, 65 );
	this.healthBackground.rotPointX = 0;
	this.addChild(this.healthBackground);

	this.characterImage = new Kiwi.GameObjects.StaticImage( this.state, texture, 0, 0 );
	this.addChild(this.characterImage);

	this.rotPointX = this.characterImage.width * 0.5;
	this.rotPointY = this.characterImage.height * 0.5;

	//Health Bar

	this.box = this.characterImage.box;

	this.character = character;
	this.callback = callback;

	this.lastFrameHealth = this.character.stats.health;
	this.woundedFrameOff = 0;
	this.frameTime = 750;

}

Kiwi.extend( PixelJam.Portrait, Kiwi.Group);


PixelJam.Portrait.prototype.update = function() {
	
	Kiwi.Group.prototype.update.call(this);

	//Character Alive?!
	if(!this.character.alive) {
		this.characterImage.cellIndex = 2;
		this.energyBackground.scaleX = 0;
		return;
	}

	//Calculate Energy
	this.energyBackground.scaleX = Math.max( Math.min(this.character.stats.mana / 100, 1), 0);
	this.healthBackground.scaleX = Math.max( Math.min(this.character.stats.health / 100, 1), 0);

	if( this.woundedFrameOff > this.game.time.now() ) {
		this.characterImage.cellIndex = 1;
	} else {
		this.characterImage.cellIndex = 0;
	}

	if( this.character.stats.health !== this.lastFrameHealth) {
		this.characterImage.cellIndex = 1;
		this.woundedFrameOff = this.game.time.now() + this.frameTime;
	}

	this.lastFrameHealth = this.character.stats.health;

}

PixelJam.Portrait.prototype.executeCallback = function() {
	//Is the input with the bounds?
	this.callback( this.character );
}

PixelJam.Portrait.prototype.shutDown = function() {
	this.callback = null;
	this.character = null;
	this.characterImage.exists = false;
	this.characterImage = null;
	this.exists = false;
	this.active = false;
}