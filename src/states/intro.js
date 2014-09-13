var PixelJam = PixelJam || {};

PixelJam.Intro = new Kiwi.State('Intro');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/


PixelJam.Intro.create = function () {

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.start, 0, 0);
	this.addChild(this.background);

	this.playButton = new Kiwi.GameObjects.Sprite(this,this.textures.playButton, 0, 0);
	this.addChild(this.playButton);

	this.playButton.x = (this.game.stage.width - this.playButton.width) * 0.5;
	this.playButton.y = this.game.stage.height * 0.5;

	this.playButton.input.onUp.add(this.start, this);

}

PixelJam.Intro.start = function() {
    this.game.states.switchState("Play");
}

PixelJam.Intro.shutDown = function() {
	this.playButton.exists = false;
	this.background.exists = false;
	this.playButton = null;
	this.background = null;
	this.exists = false;
}