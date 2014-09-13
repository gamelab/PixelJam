var PixelJam = PixelJam || {};

PixelJam.HUD = function(state, hudCam, playerOne, playerTwo) {

	this.state = state;

	this.hudCam = hudCam;
	this.hudGroup = new Kiwi.Group(this.state, 'HudGroup');

	this.playerOne = playerOne;
	this.playerTwo = playerTwo;

	//Add the portrait
	var width = 74;
	var height = 90;
	var spacing = 10;
	var spacingY = 5;

	var callback = this.playerOne.moveCamera.bind(this.playerOne);
	this.playerOneHud = {};

	this.playerOneHud.earth = new PixelJam.Portrait(this.state, 'earth', spacing, -spacingY, this.playerOne.earthCharacter, callback );
	this.playerOneHud.fire = new PixelJam.Portrait(this.state, 'fire', this.playerOneHud.earth.x + width + spacing, -spacingY, this.playerOne.fireCharacter, callback );
	this.playerOneHud.air = new PixelJam.Portrait(this.state, 'air', this.playerOneHud.fire.x + width + spacing, -spacingY, this.playerOne.airCharacter, callback ); 
	this.playerOneHud.water = new PixelJam.Portrait(this.state, 'water', this.playerOneHud.air.x + spacing + width, -spacingY, this.playerOne.waterCharacter, callback );



	callback = this.playerTwo.moveCamera.bind(this.playerTwo);
	this.playerTwoHud = {};

	this.playerTwoHud.water = new PixelJam.Portrait(this.state, 'water', spacing, spacingY, this.playerTwo.waterCharacter, callback);
	this.playerTwoHud.air = new PixelJam.Portrait(this.state, 'air', this.playerTwoHud.water.x + spacing + width, spacingY, this.playerTwo.airCharacter, callback);
	this.playerTwoHud.fire = new PixelJam.Portrait(this.state, 'fire', this.playerTwoHud.air.x + spacing + width, spacingY, this.playerTwo.fireCharacter, callback);
	this.playerTwoHud.earth = new PixelJam.Portrait(this.state, 'earth', this.playerTwoHud.fire.x + spacing + width, spacingY, this.playerTwo.earthCharacter, callback);



	this.playerOneSelected = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures.selected, 0, -9);
	this.playerOneSelected.visible = false;	
	this.playerTwoSelected = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures.selected, 0, 0);
	this.playerTwoSelected.visible = false;	


	this.playerOneGroup = new Kiwi.Group(this.state);
	this.playerOneGroup.x = -this.hudCam.transform.x;
	this.playerOneGroup.y = -this.hudCam.transform.y + this.hudCam.height - height;


	this.playerTwoGroup = new Kiwi.Group(this.state);
	this.playerTwoGroup.x = -this.hudCam.transform.x + (this.hudCam.width - ( (width + spacing) * 4 + spacing));
	this.playerTwoGroup.y = -this.hudCam.transform.y;


	this.middle = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures.middleUi, -this.hudCam.transform.x, 0);
	this.middle.y = -this.hudCam.transform.y + this.hudCam.height * 0.5 - this.middle.height * 0.5;


	this.playerTwoHud.fire.transform.scale = -1;
	this.playerTwoHud.water.transform.scale = -1;
	this.playerTwoHud.earth.transform.scale = -1;
	this.playerTwoHud.air.transform.scale = -1;
	this.playerTwoSelected.transform.scale = -1;

	this.gameComplete = false;
}

PixelJam.HUD.prototype = {
	
	add: function(parent) {
		//Add here
		parent.addChild(this.hudGroup);
		this.hudGroup.addChild(this.playerOneGroup);
		this.hudGroup.addChild(this.playerTwoGroup);
		this.hudGroup.addChild(this.middle);

		this.playerOneGroup.addChild( this.playerOneSelected );
		this.playerTwoGroup.addChild( this.playerTwoSelected );

		this.playerOneGroup.addChild( this.playerOneHud.fire );
		this.playerOneGroup.addChild( this.playerOneHud.water );
		this.playerOneGroup.addChild( this.playerOneHud.earth );
		this.playerOneGroup.addChild( this.playerOneHud.air );

		this.playerTwoGroup.addChild( this.playerTwoHud.fire );
		this.playerTwoGroup.addChild( this.playerTwoHud.water );
		this.playerTwoGroup.addChild( this.playerTwoHud.earth );
		this.playerTwoGroup.addChild( this.playerTwoHud.air );


	}, 

	selectPlayer: function(portrait, player) {

		if(player == 1) {
			this.playerOneSelected.visible = true;
			this.playerOneSelected.x = portrait.x - 5;

		} else {
			this.playerTwoSelected.visible = true;
			this.playerTwoSelected.x = portrait.x - 5;

		}
	},

	addCompleteScreens: function(player) {

		if(this.gameComplete == false) {
			this.gameComplete = true;

			this.winScreen = new PixelJam.CompleteScreen(this.state, 'win', 0, 0);
			this.loseScreen = new PixelJam.CompleteScreen(this.state, 'lose', 0, 0);

			if(player == 1) {//P1 Lost
				this.winScreen.x = -this.hudCam.transform.x + (768 - this.winScreen.background.width) * 0.5;
				this.winScreen.y = -this.hudCam.transform.y + (512 - this.winScreen.background.height) * 0.5;
				this.winScreen.transform.scale = -1; 

				this.loseScreen.x = -this.hudCam.transform.x + (768 - this.loseScreen.background.width) * 0.5;
				this.loseScreen.y = -this.hudCam.transform.y + 512 + (512 - this.loseScreen.background.height) * 0.5;
			} else {
				this.winScreen.x = -this.hudCam.transform.x + (768 - this.winScreen.background.width) * 0.5;
				this.winScreen.y = -this.hudCam.transform.y + 512 + (512 - this.winScreen.background.height) * 0.5;

				this.loseScreen.x = -this.hudCam.transform.x + (768 - this.loseScreen.background.width) * 0.5;
				this.loseScreen.y = -this.hudCam.transform.y + (512 - this.loseScreen.background.height) * 0.5;
				this.loseScreen.transform.scale = -1; 
			}


			this.state.addChild(this.winScreen);
			this.state.addChild(this.loseScreen);
		}

	},

	shutDown: function() {
		this.playerOneHud.fire.shutDown();
		this.playerOneHud.water.shutDown();
		this.playerOneHud.earth.shutDown();
		this.playerOneHud.air.shutDown();

		this.playerTwoHud.fire.shutDown();
		this.playerTwoHud.water.shutDown();
		this.playerTwoHud.earth.shutDown();
		this.playerTwoHud.air.shutDown();

		this.hudGroup.exists = false;
		this.hudGroup = null;
		this.state = null;
		this.playerOne = null;
		this.playerTwoHud = null;

		this.playerOneGroup = null;
		this.playerTwoGroup = null;
	}

}