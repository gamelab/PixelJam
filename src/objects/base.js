var PixelJam = PixelJam || {};

PixelJam.Base = function(state, character) {

	var texture = state.textures.bases;

	Kiwi.GameObjects.Sprite.call(this, state, texture);

	this.stats = JSON.parse(this.state.data.stats.data).base;

	this.health = this.stats.health;
	this.radius = this.stats.radius;
	this.manaRate = this.stats.manaRate; //Per frame
	this.character = character;
	this.alive = true;

	this.x = this.character.x + (this.character.width - this.width) * 0.5;
	this.y = this.character.y + this.character.height - this.height + 30;

	this.currentPoint = new Kiwi.Geom.Point(this.x + this.width * 0.5, this.y - this.height * 0.5);


	switch(this.character.type) {
		case 'fire':
			this.animation.add('fire', [6,7,8,9,10,11], 0.1, true, true, false);
			break;
		case 'water':
			this.animation.add('water', [18,19,20,21,22,23], 0.1, true, true, false);
			break;
		case 'air':
			this.animation.add('air', [12,13,14,15,16,17], 0.1, true, true, false);
			break;
		case 'earth':
			this.animation.add('earth', [0,1,2,3,4,5], 0.1, true, true, false);
			break;
	}

	this.box.hitbox = new Kiwi.Geom.Rectangle(26, 31, 95, 80);


}

Kiwi.extend( PixelJam.Base, Kiwi.GameObjects.Sprite );

PixelJam.Base.prototype.hurt = function(amount) {
	this.health -= amount;
	if(this.health <= 0) {
		this.alive = false;
	} 
}

PixelJam.Base.prototype.update = function() {
	
	Kiwi.GameObjects.Sprite.prototype.update.call(this);


	if(this.character.health <= 0) {
		this.base.visible = false; //If the character is dead then hide
		return;
	}

	if(!this.alive) {
		this.visible = false; //Hide Base
		this.character.hurt(1);
	}

	if( !this.currentPoint.distanceCompare( this.character.currentPoint, this.radius ) ) {
		this.character.increaseMana( this.manaRate );
	} 

}

PixelJam.Base.prototype.shutDown = function() {
	this.character = null;
	this.centerPoint = null;
}