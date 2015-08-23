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
var style = {font: "65px Arial", fill: "#fff", align:"center"};
var timertext;
var timercount = 150;
var score = 0;
var spirittext;
var shards;
var space_key;
var map;
var pie;
function preload() {
    console.log("preloading...")
    game.load.image('player', 'assets/player.png')
    game.load.image('enemy','assets/enemy.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.image('spirit','assets/star.png');
    game.load.image('orb','assets/spirit.png');
    game.load.image('shard','assets/shard.png');
    game.load.image('tiles', 'assets/tileset.png');
    game.load.image('boss','assets/boss.png');
    game.load.tilemap('forest', 'assets/maps/forest.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('player_sheet', 'assets/player_sheet.png', 9, 13, 4)
}
function collectSpirits(player, spirit){
    score += 1;
    spirit.kill();
    spirittext.text = 'Spirits: ' + score;
    var s = shards.create(0,0,'shard');
    s.kill();
}
function gameOver(){
    var t = game.add.text(0,0, 'Game Over', style);
    anchor.set(0.5);
    t.x = game.width/2;
    t.y = game.height/2;
    player.kill();
    enemy.kill();
    game.time.events.add(Phaser.Timer.SECOND*1, gameReload, this);
}
function gameReload(){
    location.reload()
}
function Time(){
    timertext.text = 'Timer: ' + timercount;
    timercount -= 1;
    console.log('Hello')
        game.time.events.add(Phaser.Timer.SECOND, Time, this);

}
addShard = function(shard,enemy){
  enemy.kill();
        console.log("killing");
        var sp1 = spirit.create(enemy.body.x + 30, enemy.body.y - 30, 'spirit');
        sp1.body.velocity.y = -500;
        sp1.body.velocity.x = 70;
        sp1.body.drag.x = 100;
        sp1.body.bounce.y = 0.5;
        sp1.body.collideWorldBounds = true;
        var sp2 = spirit.create(enemy.body.x + 30, enemy.body.y -30,'spirit');
        sp2.body.velocity.y = -500;
        sp2.body.velocity.x = -70;
        sp2.body.drag.x = 100;
        sp2.body.bounce.y = 0.5;
        sp2.body.collideWorldBounds = true;
}

function killEnemy(shard, enemy){
    enemy.kill();
    shard.kill();
}
function killPlayer(player, enemy) {
    player.kill();
    var t = game.add.text(0,0, 'Game Over', style);
    t.anchor.set(0.5);
    t.x = game.width/2;
    t.y = game.height/2;
   game.time.events.add(Phaser.Timer.SECOND*2, gameReload, this);
   score = 0;
}
collideEnemy = function (player, enemy) {
    if (enemy.body.touching.up) {
        enemy.kill();
        console.log("killing");
        var sp1 = spirit.create(enemy.body.x + 30, enemy.body.y - 30, 'spirit');
        sp1.body.velocity.y = -500;
        sp1.body.velocity.x = 70;
        sp1.body.drag.x = 100;
        sp1.body.bounce.y = 0.5;
        sp1.body.collideWorldBounds = true;
        var sp2 = spirit.create(enemy.body.x + 30, enemy.body.y -30,'spirit');
        sp2.body.velocity.y = -500;
        sp2.body.velocity.x = -70;
        sp2.body.drag.x = 100;
        sp2.body.bounce.y = 0.5;
        sp2.body.collideWorldBounds = true;
    }
}
boss = function(){
       if(score == 6){
       console.log("boss initiated..");
       boss = game.add.sprite(0,player.y,'boss');
       game.physics.enable(boss, Phaser.Physics.ARCADE);
       boss.body.collideWorldBounds = true;
       boss.body.bounce.y = 0.1;
       boss.body.velocity.x = 100;
       console.log("test");


      
}
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 500;
    map = game.add.tilemap('forest');
    map.addTilesetImage('tileset', 'tiles');
    map.setCollisionBetween(1, 4);
    game.world.setBounds(0, 0, map.width * map.tileWidth, map.height * map.tileHeight);

    platforms = map.createLayer('Tile Layer 1');

    timertext = game.add.text(32,32, 'Timer: ' + timercount);
    timertext.fixedToCamera = true;
    spirittext = game.add.text(32, 62, 'Spirits: ' + score)
    spirittext.fixedToCamera = true;
    player = game.add.sprite(0, 0, 'player_sheet');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.05;
    player.body.collideWorldBounds = true;
    player.animations.add('walk');
    player.animations.play('walk', 1);



    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
    moveTime = game.time.now + 750;
    enemies = this.add.physicsGroup();
    enemies.create(200, 200,'enemy');
    enemies.create(450,350,'enemy');
    enemies.create(450,250, 'enemy');
    enemies.create(850,250, 'enemy')
    enemies.setAll('body.velocity.x', 100);
    enemies.setAll('body.collideWorldBounds', true);
    spirit = this.add.physicsGroup();
    spirit.setAll('body.collideWorldBounds',true);
    spirit.setAll('body.velocity.y',1000);
    cursors = game.input.keyboard.createCursorKeys()
    game.stage.backgroundColor = '#72C257';
    // NOTE:
    // whenever you create a sprite or use some sort of asset
    // remember to call: `MYASSET.scale.setTo(scaleRatio, scaleRatio);`
    // This will scale it up to the correct resolution on mobile devices
    game.time.events.add(Phaser.Timer.SECOND*150, gameOver, this);
    game.time.events.add(Phaser.Timer.SECOND, Time, this);
    shards = game.add.physicsGroup();
    shards.enableBody = true;
    shards.setAll('body.allowGravity',false);
    var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space_key.onDown.add(fireShard);

}
function fireShard() {
    var shard  = shards.getFirstExists(false);
    if(shard && score != 0) {
        shard.reset(player.x,player.y, + 8);
        shard.body.velocity.x = 300;
        shard.body.allowGravity = false;
        score -= 1
    spirittext.text = 'Spirits: ' + score;
   }
}


function update() {
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(enemies, platforms);
    game.physics.arcade.collide(spirit, platforms);
    game.physics.arcade.overlap(player, enemies, collideEnemy);
    game.physics.arcade.overlap(player, spirit, collectSpirits);
    game.physics.arcade.overlap(player, enemies, killPlayer);
    game.physics.arcade.collide(shards, enemies, killEnemy);
    game.physics.arcade.overlap(shards, enemies, addShard);
    if (cursors.left.isDown){
        player.body.velocity.x = -120;
    }
    if (cursors.right.isDown){
        player.body.velocity.x= 120;
    }
    if(cursors.up.isDown &&(player.body.touching.down || player.body.onFloor())){
        player.body.velocity.y = -350;
    }
    boss();
   
    console.log("updating...")
        if(game.time.now >= moveTime ){
            enemies.multiplyAll('body.velocity.x',-1)

                moveTime = game.time.now + 750;
        }
}
