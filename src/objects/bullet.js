var PixelJam = PixelJam || {};

PixelJam.AutoBullet = function(bulletManager, type, stats, target, x, y) {

	this.target = target;

	this.bulletManager = bulletManager;

	this.state = this.bulletManager.state;

	this.point = new Kiwi.Geom.Point(x, y);

	this.stats = stats;

	switch(type) {
		case 'fire':
			var texture = this.state.textures.fireBullet;
			break;
		case 'water':
			var texture = this.state.textures.waterBullet;
			break;
		case 'air':
			var texture = this.state.textures.airBullet;
			break;
		case 'earth':
			var texture = this.state.textures.earthBullet;
			break;
	}

	Kiwi.GameObjects.Sprite.call(this, this.state, texture, 0, 0);

}

Kiwi.extend( PixelJam.AutoBullet, Kiwi.GameObjects.Sprite );


//Update

PixelJam.AutoBullet.prototype.update = function() {

	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.hitbox = this.box.worldHitbox;

	//Is the character I am chasing still alive?!
	if(!this.target.alive) this.death();

	//Move
	var x = this.point.x - this.target.currentPoint.x;
	var y = this.point.y - this.target.currentPoint.y;
	
	if(x != 0 && y != 0) {

		var hypo = Math.sqrt(x * x + y * y);

		//Shoot Him if in range!!!
		if(this.character && this.stats.autoRange > hypo ) {
			this.autoAttack();
			return;
		}

		var angle = this.point.angleTo( this.target.currentPoint );

		hypo = Math.min(hypo, this.stats.autoAttackSpeed);

		x = Math.cos(angle - Math.PI / 2) * hypo; 
		y = Math.sin(angle + Math.PI / 2) * hypo;

		this.point.x += x;
		this.point.y += y;
	}

	//Move
	this.transform.x = this.point.x - this.hitbox.width * 0.5;
	this.transform.y = this.point.y - this.hitbox.height * 0.5;

	//If i overlap the character I am targetting then owch for him
	if( Kiwi.Geom.Intersect.rectangleToRectangle( this.target.box.worldHitbox, this.hitbox).result == true ) {
		this.hurtEnemy();
	}

}

PixelJam.AutoBullet.prototype.hurtEnemy = function() {
	var strength = this.stats.autoAttackStrength * (1 - this.target.stats.defense / 100);

	if(this.target.stats.type == this.stats.strength) {
		strength *= (this.stats.modifier / 100);
	}

	this.target.hurt(strength); //Add modifier
	this.death();
}

PixelJam.AutoBullet.prototype.death = function() {
	this.exists = false;
}