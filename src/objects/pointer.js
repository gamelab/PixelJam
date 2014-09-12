var PixelJam = PixelJam || {};

PixelJam.Input = PixelJam.Input || {};

PixelJam.Input.Pointer = function(pointer) {
	this.pointer = pointer;

}

PixelJam.Input.Pointer.prototype = {

	assignRelease: function(callback, context) {

		this.callback = callback;

		this.context = context;

	},

	unassign: function() {
		
		this.pointer = null;
		
		if(this.callback) this.callback.call(this.context);

		this.callback = null;
		
		this.context = null;

	}

}