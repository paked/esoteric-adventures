var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    console.log("preloading...")
}

function create() {
    game.stage.backgroundColor = '#72C257';
}

function update() {
    game.backgroundColor = '#ff0000';
    console.log("updating...")
}
