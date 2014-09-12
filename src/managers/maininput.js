var PixelJam = PixelJam || {};

PixelJam.Input = PixelJam.Input || {};

PixelJam.Input.Main = function(state) {

	this.state = state;

	this.game = this.state.game;

	this.activePointers = [];

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
		var pointer = this.addPointer(pointer);

		//HUD then

		//Check to see where it hit, which side of screen

		//Player Side,

		//Assign callback for when up and track movement, e.t.c.

	},

	addPointer: function(pointer) {
		var np = new PixelJam.Input.Pointer(pointer);
		this.activePointers.push( pointer );
		return np;
	},

	removePointer: function(pointer) {

		var len = this.activePointers.length;
		while(len--) {
			if(pointer.id == this.activePointers[len].pointer.id) {
				this.activePointers[len].unassign();
				break;
			}
		}

	}

}