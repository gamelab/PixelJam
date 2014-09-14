var PixelJam = PixelJam || {};

PixelJam.Input = PixelJam.Input || {};

PixelJam.Input.Main = function(state, hud, playerOne, playerTwo) {

	this.state = state;
	this.game = this.state.game;

	this.hud = hud;
	this.playerOne = playerOne;
	this.playerTwo = playerTwo;

	this.activePointers = [];

	this.tPoint = null;
	this.currentPointer = null;

	this.game.input.onUp.add(this.release, this);
	this.game.input.onDown.add(this.pressed, this);

}

PixelJam.Input.Main.prototype = {

	release: function(x,y,td,tu,dur,pointer) {

		//Removes the pointer and calls its 'release' method
		this.removePointer( pointer );

	},

	pressed: function(x,y,td,tu,dur,pointer) {

		//Assign
		this.currentPointer = this.addPointer(pointer);

		//HUD then
		if( this.hudInput() ) return;

		//Check to see where it hit, which side of screen
		if( this.currentPointer.pointer.y > this.game.stage.height * 0.5) {
			//Player 1
			if(!this.playerInput( this.playerOne, this.hud.playerOneHud )) {
				//Then camera movement
				if(this.playerOne.camera.assignPointer(this.currentPointer)) 
				this.currentPointer.assignRelease( this.playerOne.camera.removePointer, this.playerOne.camera );
			}
		
		} else {
			//Player 2
			if(!this.playerInput( this.playerTwo, this.hud.playerTwoHud )) {
				//Then camera movement
				if(this.playerTwo.camera.assignPointer(this.currentPointer)) 
				this.currentPointer.assignRelease( this.playerTwo.camera.removePointer, this.playerTwo.camera );

			} 

		}


		//Assign callback for when up and track movement, e.t.c.

	},

	playerInput: function(player, hud) {
		//Player Input
		this.tPoint = player.camera.camera.transformPoint( this.currentPointer.pointer.point );
		this.tPoint.y -= player.camera.camera.ry;
		this.tPoint.x -= player.camera.camera.rx;

		//Check vs the various players
		if(player.fireCharacter.alive &&  player.fireCharacter.box.worldBounds.containsPoint(this.tPoint) ) {
			player.moveToPoint( player.fireCharacter, this.currentPointer );
			this.currentPointer.assignRelease( player.released, player );
			this.hud.selectPlayer( hud.fire, player.player, player.fireCharacter );

			return true;
		} 
		if(player.waterCharacter.alive &&  player.waterCharacter.box.worldBounds.containsPoint(this.tPoint) ) {
			player.moveToPoint( player.waterCharacter, this.currentPointer );
			this.currentPointer.assignRelease( player.released, player );
			this.hud.selectPlayer( hud.water, player.player, player.waterCharacter );

			return true;
		} 
		if(player.airCharacter.alive &&  player.airCharacter.box.worldBounds.containsPoint(this.tPoint) ) {
			player.moveToPoint( player.airCharacter, this.currentPointer );
			this.currentPointer.assignRelease( player.released, player );
			this.hud.selectPlayer( hud.air, player.player, player.airCharacter );

			return true;
		} 
		if(player.earthCharacter.alive &&  player.earthCharacter.box.worldBounds.containsPoint(this.tPoint) ) {
			player.moveToPoint( player.earthCharacter, this.currentPointer );
			this.currentPointer.assignRelease( player.released, player );
			this.hud.selectPlayer( hud.earth, player.player, player.earthCharacter );

			return true;
		} 



		return false;
	},

	hudInput: function() {
		
		this.tPoint = this.hud.hudCam.transformPoint( this.currentPointer.pointer.point );

		//
		if(this.hudPlayer(this.hud.playerOneHud, this.playerOne)) return true;
		if(this.hudPlayer(this.hud.playerTwoHud, this.playerTwo)) return true;

		return false;

	},

	hudPlayer: function(playerHud, player) {

		if( player.fireCharacter.alive && playerHud.fire.box.worldBounds.containsPoint(this.tPoint)) {
			this.hud.selectPlayer( playerHud.fire, player.player, player.fireCharacter );
			this.currentPointer.assignRelease( playerHud.fire.executeCallback, playerHud.fire); 
			return true;
		}
		if( player.waterCharacter.alive && playerHud.water.box.worldBounds.containsPoint(this.tPoint)) {
			this.hud.selectPlayer( playerHud.water, player.player, player.waterCharacter );
			this.currentPointer.assignRelease( playerHud.water.executeCallback, playerHud.water); 
			return true;
		}
		if( player.earthCharacter.alive && playerHud.earth.box.worldBounds.containsPoint(this.tPoint)) {
			this.hud.selectPlayer( playerHud.earth, player.player, player.earthCharacter );
			this.currentPointer.assignRelease( playerHud.earth.executeCallback, playerHud.earth); 
			return true;
		}
		if( player.airCharacter.alive && playerHud.air.box.worldBounds.containsPoint(this.tPoint)) {
			this.hud.selectPlayer( playerHud.air, player.player, player.airCharacter );
			this.currentPointer.assignRelease( playerHud.air.executeCallback, playerHud.air); 
			return true;
		}

		return false;
	},

	addPointer: function(pointer) {
		var np = new PixelJam.Input.Pointer( pointer );
		this.activePointers.push( np );
		return np;
	},

	removePointer: function(pointer) {

		var len = this.activePointers.length;
		while(len--) {
			if(pointer.id == this.activePointers[len].pointer.id) {
				this.activePointers[len].unassign();
				this.activePointers.splice( len, 1 );
				break;
			}
		}

	},


	shutDown: function() {
		this.game.input.onUp.remove(this.release, this);
		this.game.input.onDown.remove(this.pressed, this);

		this.state = null;
		this.game = null;

		this.hud = null;
		this.playerOne = null;
		this.playerTwo = null;


		var len = this.activePointers.length;
		while(len--) {
			this.activePointers[len].delete();	
		}

		this.activePointers = [];

		this.tPoint = null;
		this.currentPointer = null;

	}

}