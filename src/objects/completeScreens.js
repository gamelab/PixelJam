var PixelJam = PixelJam || {};

PixelJam.CompleteScreen = function(state, type, x, y) {

	Kiwi.Group.call(this, state);
	this.x = x;
	this.y = y;

	if(type == "win") {
		var texture = this.state.textures.youWin;
	} else {
		var texture = this.state.textures.youLose;
	}

	this.background = new Kiwi.GameObjects.StaticImage(this.state, texture, 0, 0);
	this.rotPointX = this.background.width * 0.5;
	this.rotPointY = this.background.height * 0.5;

	
	this.completeButton = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.continue, 0, 0);
	this.completeButton.x = (this.background.width - this.completeButton.width) * 0.5;
	this.completeButton.y = this.background.height - this.completeButton.height * 2;

	this.addChild(this.background);
	this.addChild(this.completeButton);

	this.completeButton.input.onUp.add(this.continue, this);

}

Kiwi.extend(PixelJam.CompleteScreen, Kiwi.Group);

PixelJam.CompleteScreen.prototype.continue = function() {
	this.game.states.switchState('Intro');
}

PixelJam.CompleteScreen.prototype.shutDown = function() {
	this.background.exists = false;
	this.background = null;
	this.completeButton.exists = false;
	this.completeButton = null;	
}