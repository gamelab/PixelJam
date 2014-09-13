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
	
	this.box.hitbox = new Kiwi.Geom.Rectangle(this.width * 0.25, this.height * 0.25, this.width * 0.5, this.height * 0.5);

}

Kiwi.extend( PixelJam.AutoBullet, Kiwi.GameObjects.Sprite );


//Update

PixelJam.AutoBullet.prototype.update = function() {

	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.hitbox = this.box.worldHitbox;

	//Is the character I am chasing still alive?!
	if(!this.target || !this.target.alive) {
		this.death();
		return;
	}

	this.tPoint = this.target.currentPoint.clone();
	this.tPoint.y += this.target.box.hitbox.height * 0.5;

	//Move
	this.x = this.point.x - this.tPoint.x;
	this.y = this.point.y - this.tPoint.y;
	
	if(this.x != 0 && this.y != 0) {

		this.hypo = Math.sqrt(this.x * this.x + this.y * this.y);

		//Shoot Him if in range!!!
		if(this.character && this.stats.autoRange > this.hypo ) {
			this.autoAttack();
			return;
		}

		this.angle = this.point.angleTo( this.tPoint );

		this.hypo = Math.min(this.hypo, this.stats.autoAttackSpeed);

		this.x = Math.cos(this.angle - Math.PI * 0.5) * this.hypo; 
		this.y = Math.sin(this.angle + Math.PI * 0.5) * this.hypo;

		this.point.x += this.x;
		this.point.y += this.y;
	}

	//Move
	this.transform.x = this.point.x;
	this.transform.y = this.point.y;

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
	this.active = false;
	this.bulletManager.removeBullet(this);
	this.stats = null;
	this.target = null;
	this.bulletManager = null;
}
