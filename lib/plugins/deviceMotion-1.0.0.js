Kiwi.Plugins.DeviceMotion = {

    name: 'DeviceMotion',
    version: '1.0.0'
    
};

Kiwi.PluginManager.register(Kiwi.Plugins.DeviceMotion);



Kiwi.Plugins.DeviceMotion.create = function(game) {
    
    var motionManager = new Kiwi.Plugins.DeviceMotion.MotionManager(game);
    game.motionManager = motionManager;

    //Tells the Plugin Manager to execute the boot method that is on the saveManager that was just created.
    return game.motionManager;	
}


Kiwi.Plugins.DeviceMotion.MotionManager = function(game) {

    this.game = game;

    //Rotation
    this.rawAlpha = null;
    this.rawBeta = null;
    this.rawGamma = null;

    //Acceleration
    this.rawAcceleration = {
        "x": null,
        "y": null,
        "z": null
    }

    //Acceleration Including Gravity
    this.rawAccelIncGravity = {
        "x": null,
        "y": null,
        "z": null
    }

    //Interval/Update Time
    this.lastUpdateTime = 0;
    this.updateInterval = 0; //Zero met

    this.motionDetected = false;

    //If Orientation is supported
    if(window.DeviceMotionEvent) {

        window.addEventListener('devicemotion', this.motionUpdate.bind(this), false);
        console.log('Motion Supported');
        this.motionSupported = true;

    } else {
        console.log('Motion not supported');
        this.motionSupported = false;

    }

}


Object.defineProperty(Kiwi.Plugins.DeviceMotion.MotionManager.prototype, "alpha", {
    get: function () {
        return (this.rawAlpha !== null) ? this.rawAlpha : 0 ;
    },
    enumerable: true,
    configurable: true
});


Object.defineProperty(Kiwi.Plugins.DeviceMotion.MotionManager.prototype, "beta", {
    get: function () {
        return (this.rawBeta !== null) ? this.rawBeta : 0 ;
    },
    enumerable: true,
    configurable: true
});


Object.defineProperty(Kiwi.Plugins.DeviceMotion.MotionManager.prototype, "gamma", {
    get: function () {
        return (this.rawGamma !== null) ? this.rawGamma : 0 ;
    },
    enumerable: true,
    configurable: true
});



Object.defineProperty(Kiwi.Plugins.DeviceMotion.MotionManager.prototype, "acceleration", {
    get: function () {
        var acc = {
            "x": this.rawAcceleration.x,
            "y": this.rawAcceleration.y,
            "z": this.rawAcceleration.z
        };

        if(acc.x == null) acc.x = 0;
        if(acc.y == null) acc.y = 0;
        if(acc.z == null) acc.z = 0;

        return acc;
    },
    enumerable: true,
    configurable: true
});



Object.defineProperty(Kiwi.Plugins.DeviceMotion.MotionManager.prototype, "accelIncGravity", {
    get: function () {
        var acc = {
            "x": this.rawAccelIncGravity.x,
            "y": this.rawAccelIncGravity.y,
            "z": this.rawAccelIncGravity.z
        };

        if(acc.x == null) acc.x = 0;
        if(acc.y == null) acc.y = 9.81;
        if(acc.z == null) acc.z = 0;

        return acc;
    },
    enumerable: true,
    configurable: true
});



Kiwi.Plugins.DeviceMotion.MotionManager.prototype.motionUpdate = function(event) {
    console.log('Motion Updated', event);


    //Update Acceleration
    var accel = event.acceleration; 
    this.rawAcceleration.x = accel.x;
    this.rawAcceleration.y = accel.y;
    this.rawAcceleration.z = accel.z;


    //Update Acceleration Due to Gravity
    var incGravity = event.accelerationIncludingGravity;
    this.rawAccelIncGravity.x = incGravity.x;
    this.rawAccelIncGravity.y = incGravity.y;
    this.rawAccelIncGravity.z = incGravity.z;


    //Update Rotation
    var rotationRate = event.rotationRate; 
    this.rawAlpha = rotationRate.alpha;
    this.rawBeta = rotationRate.beta;
    this.rawGamma = rotationRate.gamma;

    //Update Time
    this.lastUpdateTime = this.game.time.now();
    this.updateInterval = event.interval;
}