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
	this.type = type;

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

	// name  cells  speed  [loop=false]  [play=false]  [addToAtlas=true] )
	this.animation.add('down', [0,1,2,3,4,5], 0.1, true, true, false);
	this.animation.add('up', [6,7,8,9,10,11], 0.1, true, false, false);
	this.animation.add('left', [12,13,14,15,16,17], 0.1, true, false, false);
	this.animation.add('right', [18,19,20,21,22,23], 0.1, true, false, false);

	this.alive = true;

	this.currentPoint = new Kiwi.Geom.Point(x, y);

	this.bounds = null;

	this.destinationPoint = new Kiwi.Geom.Point(x, y);

	this.currentTarget = null;

	this.lastShot = this.game.time.now();

	this.camera = null;
	this.pointer = null;
	this.target  = null;

	this.box.hitbox = new Kiwi.Geom.Rectangle(this.width * 0.25, this.height * 0.25, this.width * 0.5, this.height * 0.5);

	this.update();
}

Kiwi.extend(PixelJam.Character, Kiwi.GameObjects.Sprite);

PixelJam.Character.prototype.canIAuto = function() {

	return (this.game.time.now() >= this.lastShot + this.stats.autoCooldown);
}


PixelJam.Character.prototype.autoAttack = function( target ) {
	if( this.canIAuto() && this.spendMana(this.stats.autoCost) ) {
		this.lastShot = this.game.time.now();
		this.bulletManager.spawnBullet( this, target );
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
	this.target = null;
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
	this.target = character;
}

PixelJam.Character.prototype.hurtBase = function(base) {
	this.target = base;
}


PixelJam.Character.prototype.update = function(x,y) {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	if(!this.alive) return;

	this.bounds = this.box.bounds;

	//Constantly move the character to the destinationPoint
	 if(this.target) {
	 	if(!this.target.alive) {
	 		this.target = null;
	 		this.destinationPoint = this.currentPoint.clone();
	 	} else {
			this.destinationPoint = this.target.currentPoint;
		}

	}  else if(this.camera !== null && this.pointer !== null) {
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
			if(this.target && this.stats.autoRange > this.hypo ) {
				this.autoAttack(this.target);
				return;
			}


			this.angle = this.currentPoint.angleTo( this.destinationPoint );

			//Angle Check
			if( this.angle < Kiwi.Utils.GameMath.PI_4  &&  this.angle > -Kiwi.Utils.GameMath.PI_4 ) {
				this.animation.play('down', false);

			} else if(this.angle < Kiwi.Utils.GameMath.PI_4 + Kiwi.Utils.GameMath.PI_2  &&  this.angle > Kiwi.Utils.GameMath.PI_4 ) {
				this.animation.play('right', false);

			} else if(this.angle > -(Kiwi.Utils.GameMath.PI_4 + Kiwi.Utils.GameMath.PI_2) && this.angle < -Kiwi.Utils.GameMath.PI_4 ) {
				this.animation.play('left', false);

			} else {
				this.animation.play('up', false);

			}

			//


			this.hypo = Math.min(this.hypo, this.stats.walkSpeed);

			x = Math.cos(this.angle - Kiwi.Utils.GameMath.PI_2 ) * this.hypo; 
			y = Math.sin(this.angle + Kiwi.Utils.GameMath.PI_2 ) * this.hypo;

			this.currentPoint.x += x;
			this.currentPoint.y += y;
		}
	}

}
PixelJam.Character.prototype.shutDown = function() {

	this.exists = false;
	this.visible = false;
	this.target  = null;
	this.alive = false;
	this.currentPoint = null;
	this.destinationPoint = null;
	this.camera = null;
	this.pointer = null;
	this.stats = null;
	this.bulletManager = null;

}