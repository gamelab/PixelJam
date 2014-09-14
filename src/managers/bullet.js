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

		var hb = characterFiring.box.worldHitbox;

		var x = hb.x + hb.width * 0.5;
		var y = hb.y + hb.height * 0.5;

		var bullet = new PixelJam.AutoBullet(this, characterFiring.type, characterFiring.stats, characterTarget, x, y);
		this.bulletGroup.addChild(bullet);
		this.bullets.push(bullet);
	},

	removeBullet: function(bullet) {

		var index = this.bullets.indexOf(bullet);

		if(index == -1) {
			this.bullets.splice(index);
			bullet.exists = false;
		}
	},

	shutDown: function() {

		this.state = null;

		for(var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].death();
		}

		this.bullets = [];

		this.bulletGroup.exists = false;
		this.bulletGroup = null;
	}

}