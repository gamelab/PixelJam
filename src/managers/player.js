var PixelJam = PixelJam || {};

PixelJam.Player = function(state, camera, player, bullet) {

	this.state = state;
	this.player = player;
	this.bulletManager = bullet;


	var camMod = 1;

	if(this.player == 1) {

		var x1 = 320 - 100;
		var y1 = 1630 - 100;

		var x2 = 320 - 35;
		var y2 = 1630 - 35;

		var x3 = 320 + 35;
		var y3 = 1630 + 35;

		var x4 = 320 + 100;
		var y4 = 1630 + 100;

		camMod = -1;
	
	} else if(this.player == 2) {

		var x = 1640;
		var y = 250; //Move to bottom left

		var x1 = 1640 - 100;
		var y1 = 250 - 100;

		var x2 = 1640 - 35;
		var y2 = 250 - 35;

		var x3 = 1640 + 35;
		var y3 = 250 + 35;

		var x4 = 1640 + 100;
		var y4 = 250 + 100;

		camera.transform.rotation = Math.PI;

	}
	this.camera = new PixelJam.Camera(this.state.game, camera, camMod);


	this.fireCharacter = new PixelJam.Character(this.state, 'fire', x1, y1, this.bulletManager, this.player);
	this.waterCharacter = new PixelJam.Character(this.state, 'water', x2, y2, this.bulletManager, this.player);
	this.airCharacter = new PixelJam.Character(this.state, 'air', x3, y3, this.bulletManager, this.player);
	this.earthCharacter = new PixelJam.Character(this.state, 'earth', x4, y4, this.bulletManager, this.player);

	this.fireBase = new PixelJam.Base(this.state, this.fireCharacter);
	this.waterBase = new PixelJam.Base(this.state, this.waterCharacter);
	this.airBase = new PixelJam.Base(this.state, this.airCharacter);
	this.earthBase = new PixelJam.Base(this.state, this.earthCharacter);

	this.moveCamera( this.earthCharacter, true );

}

PixelJam.Player.prototype = {

	add: function(parent) {
		parent.addChild(this.fireCharacter);
		parent.addChild(this.waterCharacter);
		parent.addChild(this.airCharacter);
		parent.addChild(this.earthCharacter);
	},

	addBases: function(parent) {
		parent.addChild(this.fireBase);
		parent.addChild(this.waterBase);
		parent.addChild(this.airBase);
		parent.addChild(this.earthBase);
	},

	moveToPoint: function( character, pointer ) {

		character.moveToPoint( this.camera, pointer );

	},

	released: function( pointer ) {

		//Does pointer
		if(this.fireCharacter.releasePoint( pointer.pointer.id )) {
			this.state.pointerOverlapCharacter( this.player, pointer.pointer, this.fireCharacter );
		}

		if(this.waterCharacter.releasePoint( pointer.pointer.id )) {
			this.state.pointerOverlapCharacter( this.player, pointer.pointer, this.waterCharacter );
		}

		if(this.airCharacter.releasePoint( pointer.pointer.id )) {
			this.state.pointerOverlapCharacter( this.player, pointer.pointer, this.airCharacter );
		}

		if(this.earthCharacter.releasePoint( pointer.pointer.id )) {
			this.state.pointerOverlapCharacter( this.player, pointer.pointer, this.earthCharacter );
		}

	},

	moveCamera: function( character, snap ) {
		//
		this.camera.moveTo( character.cameraPanLocation, snap );

	},

	update: function() {
		this.camera.update();

		if(!this.fireCharacter.alive && !this.waterCharacter.alive && !this.airCharacter.alive &&!this.earthCharacter.alive) {
			this.state.lose(this.player);
		}
	},

	shutDown: function() {
		this.fireCharacter.shutDown();
		this.airCharacter.shutDown();
		this.waterCharacter.shutDown();
		this.earthCharacter.shutDown();
		this.camera.shutDown();

		this.fireBase.shutDown();
		this.waterBase.shutDown();
		this.airBase.shutDown();
		this.earthBase.shutDown();

		this.fireCharacter = null;
		this.airCharacter = null;
		this.waterCharacter = null;
		this.earthCharacter = null;

		this.fireBase = null;
		this.waterBase = null;
		this.airBase = null;
		this.earthBase = null;

		this.bulletManager = null;
		this.camera = null
	}

}