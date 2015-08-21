var windowWidth = window.innerWidth * window.devicePixelRatio;
var windowHeight = window.innerHeight * window.devicePixelRatio;
var scaleRatio = window.devicePixelRatio / 3;

if (windowWidth > 800 && windowHeight > 600) {
    windowWidth = 800;
    windowHeight = 400;
}

var game = new Phaser.Game(windowWidth, windowHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });

function preload() {
    console.log("preloading...")
}

function create() {
    game.stage.backgroundColor = '#72C257';

    // NOTE:
    // whenever you create a sprite or use some sort of asset
    // remember to call: `MYASSET.scale.setTo(scaleRatio, scaleRatio);`
    // This will scale it up to the correct resolution on mobile devices
}

function update() {
    game.backgroundColor = '#ff0000';
    console.log("updating...")
}
