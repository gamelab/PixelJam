var PixelJam = PixelJam || {};

PixelJam.Resources = function(state, playerOne, playerTwo) {
	this.state = state;
	this.game = this.state.game;

	this.playerOne = playerOne;
	this.playerTwo = playerTwo;

	this.fireSpawnLocations = [
		{
			x: 993,
			y: 402
		},
		{
			x: 1148,
			y: 422
		},
		{
			x: 1430,
			y: 126
		},
		{
			x: 663,
			y: 63
		},
		{
			x: 1268,
			y: 75
		}
	];

	this.airSpawnLocations = [
		{
			x: 1445,
			y: 975
		},
		{
			x: 1937,
			y: 909
		},
		{
			x: 1871,
			y: 1184
		},
		{
			x: 1949,
			y: 1403
		},
		{
			x: 1907,
			y: 531
		}
	];

	this.earthSpawnLocations = [
		{
			x: 1110,
			y: 1886
		},
		{
			x: 1286,
			y: 1871
		},
		{
			x: 768,
			y: 1946
		},
		{
			x: 1589,
			y: 1961
		},
		{
			x: 1002,
			y: 1385
		}
	];

	this.waterSpawnLocations = [
		{
			x: 75,
			y: 813
		},
		{
			x: 198,
			y: 1148
		},
		{
			x: 87,
			y: 498
		},
		{
			x: 246,
			y: 873
		},
		{
			x: 678,
			y: 1002
		}
	];

	this.fires = [];
	this.airs = [];
	this.earth = [];
	this.water = [];

	this.lastFire = this.game.time.now() + 30000;
	this.lastWater = this.game.time.now() + 30000;
	this.lastAir = this.game.time.now() + 30000;
	this.lastEarth = this.game.time.now() + 30000;

	this.resourceGroup = new Kiwi.Group(this.state);

	this.maxAmount = 1;
	this.spawnDelay = 10000;
}

PixelJam.Resources.prototype = {

	add: function(parent) {
		parent.addChild( this.resourceGroup );
	},

	update: function() {

		//Need to spawn a new resource?!
		if( this.fires.length <= 0 && this.lastFire + this.spawnDelay < this.game.time.now() ) {
			this.spawnResource('fire');
		}

		if( this.airs.length <= 0 && this.lastWater + this.spawnDelay < this.game.time.now() ) {
			this.spawnResource('air');
		}

		if( this.earth.length <= 0 && this.lastAir + this.spawnDelay < this.game.time.now() ) {
			this.spawnResource('earth');
		}

		if( this.water.length <= 0 && this.lastEarth + this.spawnDelay < this.game.time.now() ) {
			this.spawnResource('water');
		}

	},

	removeResource: function(resource) {

		//In one of
		if( this.check(this.fires, resource) ) return;
		if( this.check(this.airs, resource) ) return;
		if( this.check(this.earth, resource) ) return;
		if( this.check(this.water, resource) ) return;

	},

	check: function( array, resource ) {

		var index = array.indexOf(resource);

		if(index !== -1) {
			array.splice(index, 1);
			return true;
		}

		return false;
	},

	spawnResource: function(type) {

		//
		var resource = new PixelJam.Resource(this.state, type);
		var point = {x:0,y:0};
		var charOne = null;
		var charTwo = null;

		switch(type) {
			case 'fire':
				point = this.game.rnd.pick( this.fireSpawnLocations );
				charOne = this.playerOne.fireCharacter;
				charTwo = this.playerTwo.fireCharacter;
				this.fires.push(resource);
				break;
			case 'air':
				point = this.game.rnd.pick( this.airSpawnLocations );
				charOne = this.playerOne.airCharacter;
				charTwo = this.playerTwo.airCharacter;
				this.airs.push(resource);
				break;
			case 'earth':
				point = this.game.rnd.pick( this.earthSpawnLocations );
				charOne = this.playerOne.earthCharacter;
				charTwo = this.playerTwo.earthCharacter;
				this.earth.push(resource);
				break;
			case 'water':
				point = this.game.rnd.pick( this.waterSpawnLocations );
				charOne = this.playerOne.waterCharacter;
				charTwo = this.playerTwo.waterCharacter;
				this.water.push(resource);
				break;
		}

		resource.x = point.x - resource.width * 0.5;
		resource.y = point.y - resource.height * 0.5;

		resource.assign( charOne, charTwo );
		this.resourceGroup.addChild(resource);

	}

}