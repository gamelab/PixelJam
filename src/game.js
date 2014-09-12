
/**
* The core PixelJam game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 

var gameOptions = {
	renderer: Kiwi.RENDERER_CANVAS, 
	width: 768,
	height: 1024
}

var game = new Kiwi.Game('content', 'PixelJam', null, gameOptions);

//Add all the States we are going to use.
game.states.addState(PixelJam.Loading);
game.states.addState(PixelJam.Intro);
game.states.addState(PixelJam.Play);

game.states.switchState("Loading");