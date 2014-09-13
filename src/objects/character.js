var PixelJam = PixelJam || {};

PixelJam.Character = function(state, type, x, y, bulletManager) {

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

	this.bulletManager = bulletManager;

	var baseData = JSON.parse(this.state.data.stats.data);

	switch(type) {
		case 'fire':
			var texture = this.state.textures.fireCharacter;
			this.stats = baseData.fire;
			this.type = 'fire';
			break;
		case 'water':
			var texture = this.state.textures.waterCharacter;
			this.stats = baseData.water;
			this.type = 'water';
			break;
		case 'air':
			var texture = this.state.textures.airCharacter;
			this.stats = baseData.air;
			this.type = 'air';
			break;
		case 'earth':
			var texture = this.state.textures.earthCharacter;
			this.stats = baseData.earth;
			this.type = 'earth';
			break;
	}

	Kiwi.GameObjects.Sprite.call(this, state, texture, 0, 0);

	this.alive = true;

	this.currentPoint = new Kiwi.Geom.Point(x, y);

	this.bounds = null;

	this.destinationPoint = new Kiwi.Geom.Point(x, y);

	this.currentTarget = null;

	this.lastShot = this.game.time.now();

	this.camera = null;
	this.pointer = null;

	this.box.hitbox = new Kiwi.Geom.Rectangle(this.width * 0.25, this.height * 0.25, this.width * 0.5, this.height * 0.5);

	this.update();
}

Kiwi.extend(PixelJam.Character, Kiwi.GameObjects.Sprite);

PixelJam.Character.prototype.canIAuto = function() {

	return (this.game.time.now() >= this.lastShot + this.stats.autoCooldown);
}


PixelJam.Character.prototype.autoAttack = function() {
	if( this.canIAuto() && this.spendMana(this.stats.autoCost) ) {
		this.lastShot = this.game.time.now();
		this.bulletManager.spawnBullet( this, this.character );
	}
}

PixelJam.Character.prototype.spendMana = function(amount) {
	if(this.stats.mana - amount >= 0) {
		this.stats.mana -= amount;
		return true;
	}

	return false;
}

PixelJam.Character.prototype.increaseMana = function(amount) {
	this.stats.mana += amount;
	if(this.stats.mana > 100) {
		this.stats.mana = 100;
	}
}

PixelJam.Character.prototype.hurt = function(amount) {
	this.stats.health -= amount;
	if(this.stats.health <= 0) {
		//Other hiding things now
		this.visible = false;
		this.alive = false;
	}
}

PixelJam.Character.prototype.moveToPoint = function(camera, pointer) {
	this.camera = camera;
	this.pointer = pointer;
	this.character = null;
}

PixelJam.Character.prototype.releasePoint = function(id) {

	if(this.pointer !== null && this.pointer.pointer.id == id) {
		this.camera = null;
		this.pointer = null;
		return true;
	}

	return false;
}

PixelJam.Character.prototype.followCharacter = function(character) {
	this.character = character;
}


PixelJam.Character.prototype.update = function(x,y) {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	if(!this.alive) return;

	this.bounds = this.box.bounds;

	//Constantly move the character to the destinationPoint
	 if(this.character) {

	 	if(!this.character.alive) {
	 		this.character = null;
	 		this.destinationPoint = this.currentPoint.clone();
	 	} else {
			this.destinationPoint = this.character.currentPoint;
		}


	} else if(this.camera !== null && this.pointer !== null) {
		this.destinationPoint = this.camera.camera.transformPoint( this.pointer.pointer.point );
		this.destinationPoint.y -= this.camera.camera.ry + this.bounds.height * 0.5;
		this.destinationPoint.x -= this.camera.camera.rx;

	} 

	this.moveCharacter();



	//Check distance and stuff
	this.x = Kiwi.Utils.GameMath.clamp(this.currentPoint.x - this.bounds.width * 0.5, PixelJam.Play.mapSize.x - this.bounds.width, 0);
	this.y = Kiwi.Utils.GameMath.clamp(this.currentPoint.y, PixelJam.Play.mapSize.y - this.bounds.height, 0 );

}

PixelJam.Character.prototype.moveCharacter = function() {

	if( this.lastShot + this.stats.autoSpeedDelay <= this.game.time.now() ) {

		var x = this.currentPoint.x - this.destinationPoint.x;
		var y = this.currentPoint.y - this.destinationPoint.y;
		
		if(x != 0 && y != 0) {

			this.hypo = Math.sqrt(x * x + y * y);

			//Shoot Him if in range!!!
			if(this.character && this.stats.autoRange > this.hypo ) {
				this.autoAttack();
				return;
			}

			this.angle = this.currentPoint.angleTo( this.destinationPoint );

			this.hypo = Math.min(this.hypo, this.stats.walkSpeed);

			x = Math.cos(this.angle - Math.PI / 2) * this.hypo; 
			y = Math.sin(this.angle + Math.PI / 2) * this.hypo;

			this.currentPoint.x += x;
			this.currentPoint.y += y;
		}
	}

}
PixelJam.Character.prototype.shutDown = function() {

	this.exists = false;
	this.visible = false;
	this.alive = false;
	this.currentPoint = null;
	this.destinationPoint = null;
	this.camera = null;
	this.pointer = null;
	this.stats = null;
	this.bulletManager = null;

}