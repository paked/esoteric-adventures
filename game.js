var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    console.log("preloading...")
}

function create() {
    console.log("creating...")
}

function update() {
    console.log("updating...")
}
