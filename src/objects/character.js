var PixelJam = PixelJam || {};

PixelJam.Character = function(state, type, x, y) {

	//Stats, set for each character in the 'stats' json file.
	this.stats = {
	 	health: 0,
		mana: 0,
		defense: 0,
		type: 0,
		autoAttackStrength: 0,
		autoAttackSpeed: 0,
		walkSpeed: 0 
	};

	this.state = state;

	var baseData = JSON.parse(this.state.data.stats.data);

	switch(type) {
		case 'fire':
			var texture = this.state.textures.fireCharacter;
			this.stats = baseData.fire;
			break;
		case 'water':
			var texture = this.state.textures.waterCharacter;
			this.stats = baseData.water;
			break;
		case 'air':
			var texture = this.state.textures.airCharacter;
			this.stats = baseData.air;
			break;
		case 'earth':
			var texture = this.state.textures.earthCharacter;
			this.stats = baseData.earth;
			break;
	}

	Kiwi.GameObjects.Sprite.call(this, state, texture, 0, 0);

	this.alive = true;

	this.currentPoint = new Kiwi.Geom.Point(x, y);

	this.bounds = null;

	this.destinationPoint = new Kiwi.Geom.Point(x, y);

	this.camera = null;
	this.pointer = null;

	this.update();
}

Kiwi.extend(PixelJam.Character, Kiwi.GameObjects.Sprite);


PixelJam.Character.prototype.moveToPoint = function(camera, pointer) {
	this.camera = camera;
	this.pointer = pointer;
	this.character = null;
}

PixelJam.Character.prototype.releasePoint = function(id) {

	if(this.pointer !== null && this.pointer.pointer.id == id) {
		this.camera = null;
		this.pointer = null;
		return true;
	}

	return false;
}

PixelJam.Character.prototype.followCharacter = function(character) {
	this.character = character;
}


PixelJam.Character.prototype.update = function(x,y) {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.bounds = this.box.bounds;

	//Constantly move the character to the destinationPoint
	 if(this.character) {
		this.destinationPoint = this.character.currentPoint;

	} else if(this.camera !== null && this.pointer !== null) {
		this.destinationPoint = this.camera.camera.transformPoint( this.pointer.pointer.point );
		this.destinationPoint.y -= this.camera.camera.ry + this.bounds.height * 0.5;
		this.destinationPoint.x -= this.camera.camera.rx;

	} 

	this.moveCharacter();



	//Check distance and stuff
	this.x = Kiwi.Utils.GameMath.clamp(this.currentPoint.x - this.bounds.width * 0.5, PixelJam.Play.mapSize.x - this.bounds.width, 0);
	this.y = Kiwi.Utils.GameMath.clamp(this.currentPoint.y, PixelJam.Play.mapSize.y - this.bounds.height, 0 );

}

PixelJam.Character.prototype.moveCharacter = function() {
	
	var x = this.currentPoint.x - this.destinationPoint.x;
	var y = this.currentPoint.y - this.destinationPoint.y;
	
	if(x != 0 && y != 0) {

		var hypo = Math.sqrt(x * x + y * y);

		if(this.character && this.stats.chaseDistance > hypo ) return;

		var angle = this.currentPoint.angleTo( this.destinationPoint );

		hypo = Math.min(hypo, this.stats.walkSpeed);

		x = Math.cos(angle - Math.PI / 2) * hypo; 
		y = Math.sin(angle + Math.PI / 2) * hypo;

		this.currentPoint.x += x;
		this.currentPoint.y += y;
	}

}
