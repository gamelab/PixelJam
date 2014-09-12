var PixelJam = PixelJam || {};

PixelJam.Camera = function(camera, modifier) {

	this.camera = camera;
	this.modifier = modifier;
	this.transform = this.camera.transform;

	this.minCoords = new Kiwi.Geom.Point( -PixelJam.Play.mapSize.x , -PixelJam.Play.mapSize.y ); 
	this.maxCoords = new Kiwi.Geom.Point(0, 0);

	this.panLocation = new Kiwi.Geom.Point(0,0);

	this.workingX = 0;
	this.workingY = 0;
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



}