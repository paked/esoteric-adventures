var windowWidth = window.innerWidth * window.devicePixelRatio;
var windowHeight = window.innerHeight * window.devicePixelRatio;
var scaleRatio = window.devicePixelRatio / 3;

if (windowWidth > 800 && windowHeight > 600) {
    windowWidth = 800;
    windowHeight = 400;
}

var game = new Phaser.Game(windowWidth, windowHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
var player;
var cursors;
var enemy;
var moveTime = 0;

function preload() {
    console.log("preloading...")
    game.load.image('player', 'player.png')
game.load.image('enemy','assets/enemy.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 500;


    player = game.add.sprite(0, 0, 'player');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.05;
    player.body.collideWorldBounds = true;
moveTime = game.time.now + 750;
enemies = this.add.physicsGroup();
enemies.create(200, 200,'enemy');
enemies.create(450,350,'enemy');
enemies.setAll('body.velocity.x', 100);
enemies.setAll('body.collideWorldBounds', true);

    cursors = game.input.keyboard.createCursorKeys()
    game.stage.backgroundColor = '#72C257';
    // NOTE:
    // whenever you create a sprite or use some sort of asset
    // remember to call: `MYASSET.scale.setTo(scaleRatio, scaleRatio);`
    // This will scale it up to the correct resolution on mobile devices
}

function update() {
    player.body.velocity.x = 0;

   if (cursors.left.isDown){
    player.body.velocity.x = -120;
   }
   if(cursors.right.isDown){
    player.body.velocity.x = 120;

   }
   if(cursors.up.isDown &&(player.body.touching.down || player.body.onFloor())){
        player.body.velocity.y = -350;
    }

 
    console.log("updating...")
if(game.time.now >= moveTime ){
enemies.multiplyAll('body.velocity.x',-1)

moveTime = game.time.now + 750;
}
}
