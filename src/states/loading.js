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
    this.addImage('map', 'assets/img/map.png');

    //HUD
    this.addSpriteSheet('portraits', 'assets/img/portraits.png', 128, 128);


    //Characters In game
    this.addJSON('stats', 'assets/data/stats.json');
    
    this.addImage('fireBullet', 'assets/img/fireBullet.png');
    this.addImage('airBullet', 'assets/img/airBullet.png');
    this.addImage('waterBullet', 'assets/img/waterBullet.png');
    this.addImage('earthBullet', 'assets/img/earthBullet.png');
    
    this.addImage('fireCharacter', 'assets/img/fireCharacter.png');
    this.addImage('waterCharacter', 'assets/img/waterCharacter.png');
    this.addImage('airCharacter', 'assets/img/airCharacter.png');
    this.addImage('earthCharacter', 'assets/img/earthCharacter.png');

};
