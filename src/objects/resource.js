var PixelJam = PixelJam || {};

PixelJam.Resource = function(state, type) {
	
	this.state = state;
	this.type = type;
	this.mana = 20;

	var texture = this.state.textures.resources;

	Kiwi.GameObjects.Sprite.call(this, this.state, texture);

	switch(type) {
		case 'fire':
			this.animation.add('fire', [6,7,8,9,10,11], 0.15, true, true , false);
			break;
		case 'water':
			this.animation.add('water', [18,19,20,21,22,23], 0.15, true, true, false);
			break;
		case 'air':
			this.animation.add('air', [12,13,14,15,16,17], 0.15, true, true, false);
			break;
		case 'earth':
			this.animation.add('earth', [0,1,2,3,4,5], 0.15, true, true, false);
			break;
	}

	this.x -= this.width * 0.5;
	this.y -= this.height * 0.5;
	this.used = false;

	this.box.hitbox = new Kiwi.Geom.Rectangle(56, 72, 36, 31);

}

Kiwi.extend( PixelJam.Resource, Kiwi.GameObjects.Sprite );

PixelJam.Resource.prototype.assign = function(characterOne, characterTwo) {

	this.characterOne = characterOne;
	this.characterTwo = characterTwo;

}

PixelJam.Resource.prototype.update = function() {

	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	if(this.used && this.alpha <= 0) {
		this.active = false;
		this.exists = false;
		this.visible = false;
		this.characterTwo = null;
		this.characterOne = null;
		return;
	} else if(this.used) {
		this.alpha -= 0.05;
		return;
	}

	this.targetHitbox = this.box.worldHitbox;

	//Check to see if characterOne or characterTwo 
	if( this.characterOne.alive && Kiwi.Geom.Intersect.rectangleToRectangle(this.targetHitbox, this.characterOne.box.worldHitbox).result ) {
		//
		this.characterOne.increaseMana(this.mana);
		this.characterTwo = null;
		this.characterOne = null;
		this.used = true;
		return;
	}
	
	if( this.characterTwo.alive && Kiwi.Geom.Intersect.rectangleToRectangle(this.targetHitbox, this.characterTwo.box.worldHitbox).result ) {
		this.characterTwo.increaseMana(this.mana);
		this.used = true;
		return;
	}


}