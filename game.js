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
var forest;
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
var antiShards;
var bossSpawned = false;
var createboss;
var bossTimer = 0;

function preload() {
    console.log("preloading...")
    game.load.audio('Music', 'assets/eso.mp3')
    game.load.audio('Jump', 'assets/jump.mp3')
    game.load.audio('shoot', 'assets/shoot.mp3')
    game.load.image('enemy','assets/enemy.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.image('Background_Forest', 'assets/forest.png');
    game.load.image('spirit','assets/star.png');
    game.load.image('orb','assets/spirit.png');
    game.load.image('shard','assets/shard.png');
    game.load.image('tiles', 'assets/tileset.png');
    game.load.image('boss','assets/boss.png');
    game.load.image('antisharded','assets/antispirit.png')
    game.load.tilemap('forrest', 'assets/maps/forest.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('player_sheet', 'assets/player_sheet.png', 18, 26, 4)
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
    t.anchor.set(0.5);
    t.x = game.width/2;
    t.y = game.height/2;
    player.kill();
    game.time.events.add(Phaser.Timer.SECOND*1, gameReload, this);
}

function gameReload(){
    location.reload()
}

function Time(){
    timertext.text = 'Timer: ' + timercount;
    timercount -= 1;
    console.log('Hello');
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

function killPlayerB(antiShards,player){
    player.kill();
    antiShards.kill();
    gameOver();
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
function boss(){
   if(score == 8){
       bossSpawned = true;

       console.log("boss initiated..");
       createboss = game.add.sprite(player.x,0 - 50 ,'boss');
       game.physics.enable(createboss, Phaser.Physics.ARCADE);
       createboss.body.collideWorldBounds = true;
       createboss.body.bounce.y = 0.05;
       fireantiShard()

       bossTimer = game.time.now + 500;
    }
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 625;
    map = game.add.tilemap('forrest');
    map.addTilesetImage('tileset', 'tiles');
    map.setCollisionBetween(1, 4);
    game.world.setBounds(0, 0, map.width * map.tileWidth, map.height * map.tileHeight);
    forest = game.add.tileSprite(0, 0, map.width * map.tileWidth, map.height * map.tileHeight, 'Background_Forest');
    var music = game.add.audio('Music');
    music.loop = true;
    music.play();
    platforms = map.createLayer('Tile Layer 1');
    timertext = game.add.text(32,32, 'Timer: ' + timercount);
    timertext.fixedToCamera = true;
    spirittext = game.add.text(32, 62, 'Spirits: ' + score)
    spirittext.fixedToCamera = true;
    player = game.add.sprite(0, 0, 'player_sheet');
    var walk = player.animations.add('walk');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.05;
    player.body.collideWorldBounds = true;
    player.animations.add('walk', [1, 2, 3], 5, true);
    player.animations.play('walk');

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
    boss();
    // NOTE:
    // whenever you create a sprite or use some sort of asset
    // remember to call: `MYASSET.scale.setTo(scaleRatio, scaleRatio);`
    // This will scale it up to the correct resolution on mobile devices
    game.time.events.add(Phaser.Timer.SECOND*150, gameOver, this);
    game.time.events.loop(Phaser.Timer.SECOND, Time, this);
    game.time.events.add(Phaser.Timer.SECIND*2, fireantiShard, this);

    shards = game.add.physicsGroup();
    shards.enableBody = true;
    shards.setAll('body.allowGravity',false);
    var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space_key.onDown.add(fireShard);

    antiShards = game.add.physicsGroup();
    antiShards.createMultiple(50, 'antisharded');
}
function fireShard() {
    var shard  = shards.getFirstExists(false);
    if(shard && score != 0) {
        shard.reset(player.x,player.y, + 8);
        shard.body.velocity.x = 300;
        if (player.body.velocity.x < 0) {
            shard.body.velocity.x *= -1;
        }

        shard.body.allowGravity = false;
        score -= 1;
        spirittext.text = 'Spirits: ' + score;
        game.sound.play('shoot')
   }
}
function fireantiShard() {
    var antiShard = antiShards.getFirstExists(false);
    if(antiShard){
        antiShard.reset(createboss.x, createboss.y, +8)
        antiShard.body.allowGravity = false;

        // Bullets should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the bullet if
        // its x,y coordinates are outside of the world.
        antiShard.checkWorldBounds = true;
        antiShard.outOfBoundsKill = true;
        game.physics.arcade.accelerateToObject(antiShard, player)
        console.log('test');

    }
}



function update() {
    player.body.velocity.x = 0;
    forest.tilePosition.x =0.5;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(enemies, platforms);
    game.physics.arcade.collide(spirit, platforms);
    game.physics.arcade.overlap(player, enemies, collideEnemy);
    game.physics.arcade.overlap(player, spirit, collectSpirits);
    game.physics.arcade.overlap(player, enemies, killPlayer);
    game.physics.arcade.collide(shards, enemies, killEnemy);
    game.physics.arcade.overlap(shards, enemies, addShard);
    game.physics.arcade.overlap(antiShards,player,killPlayerB);

    if (createboss) {
        game.physics.arcade.overlap(player, createboss, gameOver);
        game.physics.arcade.collide(createboss, platforms);
    }

    if (game.time.now > bossTimer && createboss) {
        fireantiShard();
        bossTimer =  game.time.now + 500;
    }

    if (cursors.left.isDown){
        player.body.velocity.x = -120;
    }
    if (cursors.right.isDown){
        player.body.velocity.x= 120;
    }
    if(cursors.up.isDown &&(player.body.touching.down || player.body.onFloor())){
        player.body.velocity.y = -350;
        game.sound.play('Jump')
    }

    if (!bossSpawned) {
        boss();
    }
   
    console.log("updating...")
        if(game.time.now >= moveTime ){
            enemies.multiplyAll('body.velocity.x',-1)

                moveTime = game.time.now + 750;
        }
}
