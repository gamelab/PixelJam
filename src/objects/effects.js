var PixelJam = PixelJam || {};

PixelJam.FX = function(state, character, player) {

	Kiwi.GameObjects.Sprite.call(this, state, state.textures.teamFX, player.x, player.y);

	this.player = player;
	this.character = character;

	if(this.player == 1) {
		this.animation.add('animate', [0,1,2,3,4,5], 0.1, true, true, false);
	} else if(this.player == 2) {
		this.animation.add('animate', [6,7,8,9,10,11], 0.1, true, true, false);
	}

	this.update();
}

//teamFX
Kiwi.extend(PixelJam.FX, Kiwi.GameObjects.Sprite);


PixelJam.FX.prototype.update = function() {

	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.visible = this.character.visible;
	this.exists = this.character.exists;
	this.alpha = this.character.alpha;

	if(this.character) {
		this.x = this.character.x + (this.character.width - this.width) * 0.5;
		this.y = this.character.y + this.character.height - this.height;
	} 

}