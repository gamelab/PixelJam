var PixelJam = PixelJam || {};

PixelJam.Player = function(state, camera, player, bullet) {

	this.state = state;
	this.player = player;
	this.bulletManager = bullet;

	var x = 0;
	var y = 0;
	var camMod = 1;

	if(this.player == 1) {
		x = 510;
		y = 1538; //Move to top right
		camMod = -1;
	
	} else if(this.player == 2) {
		x = 1538;
		y = 510; //Move to bottom left
		camera.transform.rotation = Math.PI;

	}
	this.camera = new PixelJam.Camera(this.state.game, camera, camMod);


	this.fireCharacter = new PixelJam.Character(this.state, 'fire', x + 100, y + 100, this.bulletManager);
	this.waterCharacter = new PixelJam.Character(this.state, 'water', x - 100, y + 100, this.bulletManager);
	this.airCharacter = new PixelJam.Character(this.state, 'air', x + 100, y - 100, this.bulletManager);
	this.earthCharacter = new PixelJam.Character(this.state, 'earth', x - 100, y - 100, this.bulletManager);

	this.fireBase = new PixelJam.Base(this.state, this.fireCharacter);
	this.waterBase = new PixelJam.Base(this.state, this.waterCharacter);
	this.airBase = new PixelJam.Base(this.state, this.airCharacter);
	this.earthBase = new PixelJam.Base(this.state, this.earthCharacter);

	this.moveCamera( this.fireCharacter, true );

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

		//Spawn UI element!

	},

	released: function( pointer ) {

		//Does pointer
		if(this.fireCharacter.releasePoint( pointer.pointer.id )) {
			//Check for overlap of an enemy character
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
		this.camera.moveTo( character.currentPoint, snap );

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