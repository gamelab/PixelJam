var PixelJam = PixelJam || {};

PixelJam.Play = new Kiwi.State('Play');

/**
* The PlayState in the core state that is used in the game. 
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
* 
*/

PixelJam.Play.init = function() {

	this.mapSize = {
		x: 2048,
		y: 2048
	}

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
	this.bulletManager = new PixelJam.BulletManager(this);

	this.player1 = new PixelJam.Player(this, this.player1Cam, 1, this.bulletManager);
	this.player2 = new PixelJam.Player(this, this.player2Cam, 2, this.bulletManager);

	this.hud = new PixelJam.HUD(this, this.hudCam, this.player1, this.player2);

	this.input = new PixelJam.Input.Main(this, this.hud, this.player1, this.player2);


	//Character group
	this.characterGroup = new Kiwi.Group(this, 'CharacterGroup');



 	this.add(); 
}

PixelJam.Play.pointerOverlapCharacter = function(player, pointer, character) {

	if(player == 1) {
		var pobj = this.player1;
		var pobj2 = this.player2;
	} else if(player == 2) {
		var pobj = this.player2;
		var pobj2 = this.player1;
	}

	var point = pobj.camera.camera.transformPoint( pointer.point ); //Move this to the pointer class. Have to do it too often
	point.y -= pobj.camera.camera.ry;
	point.x -= pobj.camera.camera.rx;

	if( pobj2.fireCharacter.box.worldHitbox.containsPoint( point ) ) {
		character.followCharacter( pobj2.fireCharacter );
	}

	if( pobj2.waterCharacter.box.worldHitbox.containsPoint( point ) ) {
		character.followCharacter( pobj2.waterCharacter );
	}

	if( pobj2.airCharacter.box.worldHitbox.containsPoint( point ) ) {
		character.followCharacter( pobj2.airCharacter );
	}

	if( pobj2.earthCharacter.box.worldHitbox.containsPoint( point ) ) {
		character.followCharacter( pobj2.earthCharacter );
	}

}


PixelJam.Play.add = function() {

	this.map.add(this);
	this.addChild(this.characterGroup);

	this.player1.add(this.characterGroup);
	this.player2.add(this.characterGroup);

	this.bulletManager.add(this);

	this.hud.add(this);

}

PixelJam.Play.update = function() {

	Kiwi.State.prototype.update.call(this);

	this.player1.update();
	this.player2.update();


	//Depth Sorting
	this.characterGroup.members = this.quicksortByDepth(this.characterGroup.members);
	
}

PixelJam.Play.lose = function(player) {
	this.hud.addCompleteScreens(player);
}


PixelJam.Play.quicksortByDepth = function(array) {
	if(array.length < 2) return( array );
	
	var low = [];
	var high = [];
	var iMid = Math.floor(array.length / 2)
	var mid = array[ iMid ];
	for(var i = 0;  i < array.length;  i++)
	{
		if(i != iMid)
		{
			if( array[i].y < mid.y )	low.push(array[i]);
			else	high.push(array[i]);
		}
	}
	// Recurse sort
	low = this.quicksortByDepth(low);
	high = this.quicksortByDepth(high);
	// Compile output
	low.push(mid);
	low = low.concat(high);
	return( low );
}

PixelJam.Play.shutDown = function() {

	this.player1.shutDown();
	this.player2.shutDown();
	this.map.shutDown();
	this.bulletManager.shutDown();
	this.input.shutDown();

	//Remove the new cameras from rendering
	this.game.cameras.remove(this.player1Cam);
	this.game.cameras.remove(this.player2Cam);

}



