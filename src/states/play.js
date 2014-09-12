var PixelJam = PixelJam || {};

PixelJam.Play = new Kiwi.State('Play');

/**
* The PlayState in the core state that is used in the game. 
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
* 
*/

PixelJam.Play.init = function() {

	this.hudCam = this.game.cameras.defaultCamera;

	this.player1Cam = this.game.cameras.create('player1Cam', 0, 0, this.game.stage.width, this.game.stage.height * 0.5, false);
	this.player2Cam = this.game.cameras.create('player2Cam', 0, 0, this.game.stage.width, this.game.stage.height * 0.5, false);

	this.player1Cam.ry = this.game.stage.height * 0.5; //Move it have way down

}

/**
* This create method is executed when a Kiwi state has finished loading any resources that were required to load.
*/
PixelJam.Play.create = function () {

	//Add Custom Cameras
	this.game.cameras.add(this.player1Cam);
	this.game.cameras.add(this.player2Cam);

	//Move the HUD camera into its 'own' space
	this.hudCam.transform.x = this.game.stage.width;
	this.hudCam.transform.y = this.game.stage.height;

	this.map = new PixelJam.Map(this);

	this.player1 = new PixelJam.Player(this, this.player1Cam, 1);
	this.player2 = new PixelJam.Player(this, this.player2Cam, 2);

	//Depth Sorting
	//Character group
	this.characterGroup = new Kiwi.Group(this, 'CharacterGroup');




 	this.add(); 
}

PixelJam.Play.add = function() {

	this.map.add(this);
	this.player1.add(this.characterGroup);
	this.player2.add(this.characterGroup);

}

PixelJam.Play.shutDown = function() {

	//Remove the new cameras from rendering
	this.game.cameras.remove(this.player1Cam);
	this.game.cameras.remove(this.player2Cam);

}



