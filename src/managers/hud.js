var PixelJam = PixelJam || {};

PixelJam.HUD = function(state, hudCam, playerOne, playerTwo) {

	this.state = state;

	this.hudCam = hudCam;
	this.hudGroup = new Kiwi.Group(this.state, 'HudGroup');

	this.playerOne = playerOne;
	this.playerTwo = playerTwo;

	//Add the portrait

	this.playerOneHud = {
		'fire': new PixelJam.Portrait(this.state, 'fire', 128, 0, this.playerOne.fireCharacter),
		'water': new PixelJam.Portrait(this.state, 'water', 384, 0, this.playerOne.waterCharacter),
		'earth': new PixelJam.Portrait(this.state, 'earth', 0, 0, this.playerOne.earthCharacter),
		'air': new PixelJam.Portrait(this.state, 'air', 256, 0, this.playerOne.airCharacter)
	};

	this.playerTwoHud = {
		'fire': new PixelJam.Portrait(this.state, 'fire', 256, 0, this.playerTwo.fireCharacter),
		'water': new PixelJam.Portrait(this.state, 'water', 0, 0, this.playerTwo.waterCharacter),
		'earth': new PixelJam.Portrait(this.state, 'earth', 384, 0, this.playerTwo.earthCharacter),
		'air': new PixelJam.Portrait(this.state, 'air', 128, 0, this.playerTwo.airCharacter)
	};



	this.playerOneGroup = new Kiwi.Group(this.state);
	this.playerOneGroup.x = -this.hudCam.transform.x;
	this.playerOneGroup.y = -this.hudCam.transform.y + this.hudCam.height - this.playerTwoHud.fire.box.bounds.width;


	this.playerTwoGroup = new Kiwi.Group(this.state);
	this.playerTwoGroup.x = -this.hudCam.transform.x + (this.hudCam.width - this.playerTwoHud.fire.box.bounds.width * 4);
	this.playerTwoGroup.y = -this.hudCam.transform.y;
	
	this.playerTwoHud.fire.transform.scale = -1;
	this.playerTwoHud.water.transform.scale = -1;
	this.playerTwoHud.earth.transform.scale = -1;
	this.playerTwoHud.air.transform.scale = -1;

}

PixelJam.HUD.prototype = {
	
	add: function(parent) {
		//Add here
		parent.addChild(this.hudGroup);
		this.hudGroup.addChild(this.playerOneGroup);
		this.hudGroup.addChild(this.playerTwoGroup);

		this.playerOneGroup.addChild( this.playerOneHud.fire );
		this.playerOneGroup.addChild( this.playerOneHud.water );
		this.playerOneGroup.addChild( this.playerOneHud.earth );
		this.playerOneGroup.addChild( this.playerOneHud.air );

		this.playerTwoGroup.addChild( this.playerTwoHud.fire );
		this.playerTwoGroup.addChild( this.playerTwoHud.water );
		this.playerTwoGroup.addChild( this.playerTwoHud.earth );
		this.playerTwoGroup.addChild( this.playerTwoHud.air );

	}

}