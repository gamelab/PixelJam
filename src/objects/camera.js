var PixelJam = PixelJam || {};

PixelJam.Camera = function(game, camera, modifier) {

	this.game = game;
	this.camera = camera;
	this.modifier = modifier;
	this.transform = this.camera.transform;

	this.minCoords = new Kiwi.Geom.Point( -PixelJam.Play.mapSize.x , -PixelJam.Play.mapSize.y ); 
	this.maxCoords = new Kiwi.Geom.Point(0, 0);

	this.panLocation = new Kiwi.Geom.Point(0,0); //Final location
	this.camertween = this.game 

	this.workingX = 0;
	this.workingY = 0;

	this.finalPoint = null;

	this.tween = this.game.tweens.create(this.panLocation);
	this.tween.onUpdate( this.updateTween, this);
	this.tween.onComplete( this.assignPoint, this);

}

PixelJam.Camera.prototype = {

	update: function() {

		this.workingX = (this.panLocation.x - this.camera.width * 0.5) * this.modifier;
		this.workingY = (this.panLocation.y - this.camera.height * 0.5) * this.modifier;

		if(this.modifier == -1) {
			this.transform.x = Kiwi.Utils.GameMath.clamp(this.workingX, this.maxCoords.x, this.minCoords.x + this.camera.width);
			this.transform.y = Kiwi.Utils.GameMath.clamp(this.workingY, this.maxCoords.y, this.minCoords.y + this.camera.height);
		} else {
			this.transform.x = Kiwi.Utils.GameMath.clamp(this.workingX, Math.abs(this.minCoords.x) - this.camera.width, this.maxCoords.x);
			this.transform.y = Kiwi.Utils.GameMath.clamp(this.workingY, Math.abs(this.minCoords.y) - this.camera.height, this.maxCoords.y);
		}

	
	},

	moveTo: function(point) {

		//SNAP TO OPTION HERE!!!

		//Stop any current tween
		this.tween.stop();
		this.finalPoint = point;

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
		this.panLocation = this.finalPoint;
	}

}