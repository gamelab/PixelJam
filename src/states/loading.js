/**
* The Loading State is going to be used to load in all of the in-game assets that we need in game.
*
* Because in this blueprint there is only a single "hidden object" section we are going to load in all of 
* the asset's at this point.
*
* If you have multiple states however, I would recommend have loading the other graphics as they are required by their states, 
* Otherwise the loading times maybe a bit long and it is not the most optimal solution.
*
*/

/**
* Since we want to use the custom Kiwi.JS loader with the bobing kiwi/html5 logo and everything. We need to extend the KiwiLoadingScreen State.  
* The KiwiLoadingScreen State is an extentsion of a normal State but it has some custom code to handle the loading/bobbing/fading of all the items, so if you override a method (like the preload) for example just make sure you call the super method.
* 
* The parameters we are passing into this method are as ordered.
* 1 - name {String} Name of this state.
* 2 - stateToSwitch {String} Name of the state to switch to AFTER all the assets have loaded. Note: The state you want to switch to should already have been added to the game.
* 3 - dimensions {Object} A Object containing the width/height that the game is to be. For example {width: 1024, height: 768}
* 4 - subfolder {String} The folder that the loading graphics are located at. 
*/

var PixelJam = PixelJam || {};

PixelJam.Loading = new KiwiLoadingScreen('Loading', 'Intro', 'assets/img/loading/');

PixelJam.Loading.preload = function () {
    
    //Make sure to call the super at the top.
    //Otherwise the loading graphics will load last, and that defies the whole point in loading them. 
    KiwiLoadingScreen.prototype.preload.call(this);

    /**
    * Replace with your own in-assets to load.
    **/

    //Start Screen
    this.addImage('start', 'assets/img/menus/start.png');
    this.addImage('playButton', 'assets/img/menus/play-game.png');

    //Complete Screens
    this.addImage('youLose', 'assets/img/menus/you-lose.png');
    this.addImage('youWin', 'assets/img/menus/you-win.png');
    this.addImage('continue', 'assets/img/menus/continue.png');

    //Map
    this.addImage('map', 'assets/img/map.png');

    this.addSpriteSheet('bases', 'assets/img/bases.png', 900 / 6, 600 / 4);
    this.addSpriteSheet('resources', 'assets/img/resources.png', 900 / 6, 600 / 4);

    //HUD
    this.addSpriteSheet('fireAvatar', 'assets/img/hud/fire-hero-avatar.png', 74, 90);
    this.addSpriteSheet('earthAvatar', 'assets/img/hud/earth-hero-avatar.png', 74, 90);
    this.addSpriteSheet('airAvatar', 'assets/img/hud/wind-hero-avatar.png', 74, 90);
    this.addSpriteSheet('waterAvatar', 'assets/img/hud/water-hero-avatar.png', 74, 90);

    this.addImage('selected', 'assets/img/hud/selected-hero.png');
    this.addImage('middleUi', 'assets/img/hud/top-ui-bg.png');

    this.addImage('healthBar', 'assets/img/hud/health-bar.png');
    this.addImage('barsBackground', 'assets/img/hud/bars-background.png');

    this.addImage('earthEnergyBar', 'assets/img/hud/earth-energy-bar.png');
    this.addImage('airEnergyBar', 'assets/img/hud/wind-energy-bar.png');
    this.addImage('fireEnergyBar', 'assets/img/hud/fire-energy-bar.png');
    this.addImage('waterEnergyBar', 'assets/img/hud/water-energy-bar.png');


    //Characters In game
    this.addJSON('stats', 'assets/data/stats.json');

    this.addSpriteSheet('autoAttackSprite', 'assets/img/attacks/auto-attack-sprites.png', 420 / 6, 640 / 4);
    
    this.addSpriteSheet('fireCharacter', 'assets/img/fire-character-sprite.png', 1080 / 6, 720 / 4);
    this.addSpriteSheet('waterCharacter', 'assets/img/water-character-sprite.png', 1080 / 6, 720 / 4);
    this.addSpriteSheet('airCharacter', 'assets/img/wind-character-sprite.png', 1080 / 6, 720 / 4);
    this.addSpriteSheet('earthCharacter', 'assets/img/earth-character-sprite.png', 1080 / 6, 720 / 4);

};
