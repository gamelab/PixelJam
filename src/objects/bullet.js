var PixelJam = PixelJam || {};

PixelJam.AutoBullet = function(bulletManager, type, stats, target, x, y) {

	this.target = target;

	this.bulletManager = bulletManager;

	this.state = this.bulletManager.state;

	this.point = new Kiwi.Geom.Point(x, y);

	this.stats = stats;

	var texture = this.state.textures.autoAttackSprite;

	Kiwi.GameObjects.Sprite.call(this, this.state, texture, x, y);
	this.x -= this.box.bounds.width * 0.5;
	this.y -= 11 + 33 / 2;

	switch(type) {
		case 'fire':// name  cells  speed  [loop=false]  [play=false]  [addToAtlas=true] )
			this.animation.add('fire', [6,7,8,9,10,11], 0.05, true, true, false);
			break;
		case 'water':
			this.animation.add('water', [18,19,20,21,22,23], 0.05, true, true, false);
			break;
		case 'air':
			this.animation.add('air', [12,13,14,15,16,17], 0.05, true, true, false);
			break;
		case 'earth':
			this.animation.add('earth', [0,1,2,3,4,5], 0.05, true, true, false);
			break;
	}

	
	this.box.hitbox = new Kiwi.Geom.Rectangle(13, 11, 38, 33);
	this.rotPointX = 33;
	this.rotPointY = 26;
	this.transform.scaleY = -1;

	this.update();
}

Kiwi.extend( PixelJam.AutoBullet, Kiwi.GameObjects.Sprite );


//Update

PixelJam.AutoBullet.prototype.update = function() {

	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.hitbox = this.box.worldHitbox;
	this.targetHitbox = this.target.box.worldHitbox;
	this.tPoint = new Kiwi.Geom.Point( this.targetHitbox.x + this.targetHitbox.width * 0.5, this.targetHitbox.y + this.targetHitbox.height * 0.5 );


	//Is the character I am chasing still alive?!
	if(!this.target || !this.target.alive) {
		this.death();
		return;
	}
	
	//Move
	this.sx = this.point.x - this.tPoint.x;
	this.sy = this.point.y - this.tPoint.y;
	
	if(this.sx != 0 && this.sy != 0) {

		this.hypo = Math.sqrt(this.sx * this.sx + this.sy * this.sy);

		//Shoot Him if in range!!!
		if(this.character && this.stats.autoRange > this.hypo ) {
			this.autoAttack();
			return;
		}

		this.angle = this.point.angleTo( this.tPoint );

		this.rotation = -this.angle;

		this.hypo = Math.min(this.hypo, this.stats.autoAttackSpeed);

		this.sx = Math.cos(this.angle - Kiwi.Utils.GameMath.PI_2) * this.hypo; 
		this.sy = Math.sin(this.angle + Kiwi.Utils.GameMath.PI_2) * this.hypo;

		this.point.x += this.sx;
		this.point.y += this.sy;
	}

	//Move
	this.transform.x = this.point.x - this.box.bounds.width * 0.5;
	this.transform.y = this.point.y;

	//If i overlap the character I am targetting then owch for him
	if( Kiwi.Geom.Intersect.rectangleToRectangle( this.targetHitbox, this.hitbox).result == true ) {
		this.hurtEnemy();
	}

}


PixelJam.AutoBullet.prototype.hurtEnemy = function() {
	var strength = this.stats.autoAttackStrength * (1 - this.target.stats.defense / 100);

	//Positive modifier
	if(this.target.stats.type == this.stats.strength) {
		strength *= (this.stats.modifier / 100);
	}

	//Negative Mod
	if(this.target.stats.strength == this.stats.type) {
		strength *= (this.stats.negModifier / 100);
	}

	this.target.hurt(strength); //Add modifier
	this.death();
}

PixelJam.AutoBullet.prototype.death = function() {
	this.exists = false;
	this.active = false;
	if(this.bulletManager) this.bulletManager.removeBullet(this);
	this.stats = null;
	this.target = null;
	this.bulletManager = null;
}
