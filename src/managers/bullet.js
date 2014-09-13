var PixelJam = PixelJam || {};

PixelJam.BulletManager = function(state) {
	
	this.state = state;

	this.bullets = [];

	this.bulletGroup = new Kiwi.Group(this.state, 'bulletGroup');

}

PixelJam.BulletManager.prototype = {

	add: function(parent) {
		parent.addChild(this.bulletGroup);
	},
	
	spawnBullet: function(characterFiring, characterTarget) {

		var bullet = new PixelJam.AutoBullet(this, characterFiring.type, characterFiring.stats, characterTarget, characterFiring.currentPoint.x, characterFiring.currentPoint.y);
		this.bulletGroup.addChild(bullet);
		this.bullets.push(bullet);
	},

	removeBullet: function(bullet) {

		var index = this.bullets.indexOf(bullet);

		if(index == -1) {

			this.bullets.splice(index);
			bullet.exists = false;

		}
	}

}