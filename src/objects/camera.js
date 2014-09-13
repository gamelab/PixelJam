var PixelJam = PixelJam || {};

PixelJam.Camera = function(game, camera, modifier) {

	this.game = game;
	this.camera = camera;
	this.modifier = modifier;
	this.transform = this.camera.transform;

	this.minCoords = new Kiwi.Geom.Point( -PixelJam.Play.mapSize.x , -PixelJam.Play.mapSize.y ); 
	this.maxCoords = new Kiwi.Geom.Point( 0, 0 );

	this.panLocation = new Kiwi.Geom.Point( 0, 0 ); //Final location
	this.camertween = this.game 

	this.workingX = 0;
	this.workingY = 0;

	this.finalPoint = null;

	this.movingPointer = null;

	this.tween = this.game.tweens.create(this.panLocation);
	this.tween.onUpdate( this.updateTween, this);
	this.tween.onComplete( this.assignPoint, this);

}

PixelJam.Camera.prototype = {

	assignPointer: function(pointer) {
		if(!this.movingPointer) {
			this.tween.stop();
			this.following = false;
			this.panLocation = this.panLocation.clone();

			this.movingPointer = pointer;
			this.initOffset = {
				x: this.panLocation.x,
				y: this.panLocation.y
			}
			return true;
		}

		return false;
	},

	removePointer:function(pointer) {
		this.movingPointer = null;	
		this.initOffset = null;
	},

	update: function() {

		//Pointer release

		if(this.movingPointer) {

			if(this.movingPointer.pointer.isUp) {
				this.removePointer();
				return;
			}


			//Transform to the camera
			var diffX = this.movingPointer.pointer.point.x - this.movingPointer.pointer.startPoint.x;
			var diffY = this.movingPointer.pointer.point.y - this.movingPointer.pointer.startPoint.y;

			this.panLocation.x = this.initOffset.x + diffX * this.modifier;
			this.panLocation.y = this.initOffset.y + diffY * this.modifier;
		}


		this.workingX = (this.panLocation.x - this.camera.width * 0.5) * this.modifier;
		this.workingY = (this.panLocation.y - this.camera.height * 0.5) * this.modifier;

		if(this.modifier == -1) {
			var diffX = Kiwi.Utils.GameMath.clamp(this.workingX, this.maxCoords.x, this.minCoords.x + this.camera.width);
			var diffY = Kiwi.Utils.GameMath.clamp(this.workingY, this.maxCoords.y, this.minCoords.y + this.camera.height);

			this.transform.x = diffX;
			this.transform.y = diffY;

			//Implement fix for boundary movements. Constrain panlocation to edges

		
		} else {

			var diffX = Kiwi.Utils.GameMath.clamp(this.workingX, Math.abs(this.minCoords.x) - this.camera.width, this.maxCoords.x);
			var diffY = Kiwi.Utils.GameMath.clamp(this.workingY, Math.abs(this.minCoords.y) - this.camera.height, this.maxCoords.y);

			this.transform.x = diffX;
			this.transform.y = diffY;

		}

		//Not following camera

	},

	moveTo: function(point, snap) {

		//SNAP TO OPTION HERE!!!
		if(this.movingPointer) return;

		//Stop any current tween
		this.tween.stop();
		this.finalPoint = point;
		this.following = false;
		
		if(snap) {
			this.assignPoint();
		}

		//Make a new location
		this.panLocation = this.panLocation.clone();

		//Reassign the tween object reference
		this.tween._object = this.panLocation;

		this.tween.to({x: this.finalPoint.x, y: this.finalPoint.y}, 750, Kiwi.Animations.Tweens.Easing.Sinusoidal.Out, true);

	},

	updateTween: function() {
		this.tween._valuesEnd = {x: this.finalPoint.x, y: this.finalPoint.y };
	},

	assignPoint: function() {
		this.following = true;
		this.panLocation = this.finalPoint;
	}

}