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
var platforms;
var moveTime = 0;

function preload() {
    console.log("preloading...")
    game.load.image('player', 'assets/player.png')
    game.load.image('enemy','assets/enemy.png');
    game.load.image('platform', 'assets/platform.png');
game.load.image('spirit','assets/star.png');
}
collideEnemy = function (player, enemy) {
if (enemy.body.touching.up) {
enemy.kill();
console.log("killing");
var sp1 = spirit.create(enemy.body.x, enemy.body.y, 'spirit');
sp1.body.velocity.y = -500;
sp1.body.velocity.x = 70;
sp1.body.drag.x = 100;
sp1.body.bounce.y = 0.5;
sp1.body.collideWorldBounds = true;
var sp2 = spirit.create(enemy.body.x, enemy.body.y,'spirit');
sp2.body.velocity.y = -500;
sp2.body.velocity.x = -70;
sp2.body.drag.x = 100
sp2.body.bounce.y = 0.5;
sp2.body.collideWorldBounds = true;
}
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
spirit = this.add.physicsGroup();
spirit.setAll('body.collideWorldBounds',true);
spirit.setAll('body.velocity.y',1000);
platforms = this.add.physicsGroup();
platforms.create(100, 300, 'platform')
platforms.create(150, 300, 'platform')
platforms.create(200, 200, 'platform')
platforms.create(250, 200, 'platform')
platforms.setAll('body.allowGravity', false)
platforms.setAll('body.immovable', true);



    cursors = game.input.keyboard.createCursorKeys()
    game.stage.backgroundColor = '#72C257';
    // NOTE:
    // whenever you create a sprite or use some sort of asset
    // remember to call: `MYASSET.scale.setTo(scaleRatio, scaleRatio);`
    // This will scale it up to the correct resolution on mobile devices
}

function update() {
    game.physics.arcade.collide(player, platforms);
game.physics.arcade.overlap(player, enemies, collideEnemy);
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
