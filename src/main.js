document.addEventListener("DOMContentLoaded", function(){
    
    phaserGame()
    gameBox = document.getElementsByTagName("canvas")[0]
    gameBox.setAttribute("id","game-box")
    scoreBox = document.createElement("span")
    scoreBox.style.visibility = "hidden"
    scoreBox.setAttribute("id","score-box")
    gameBox.append(scoreBox)


    
})

function phaserGame(){
var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    parent: "game",
    // backgroundColor: '#0072bc',
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image
var player
var cursors
var game = new Phaser.Game(config);
var scoreText
var score = 0
var bones


// console.log(scoreList)
function preload ()
{


    this.load.image('bone', 'dist/assets/image/bone.png')
    this.load.image('mailman', 'dist/assets/image/mailman.png')        
    
    this.load.spritesheet('shiba_down', 
    'dist/assets/sprite/shibaInu-0.png',
    { frameWidth: 32, frameHeight: 32 })
    
    this.load.spritesheet('shiba_up', 
    'dist/assets/sprite/shibaInu-2.png',
    { frameWidth: 32, frameHeight: 32 })
    
    this.load.spritesheet('shiba_left', 
    'dist/assets/sprite/shibaInu-3.png',
    { frameWidth: 32, frameHeight: 32 })
    
    this.load.spritesheet('shiba_right', 
    'dist/assets/sprite/shibaInu-1.png',
    { frameWidth: 32, frameHeight: 32 })
    
    this.load.spritesheet('shiba_turn', 
    'dist/assets/sprite/shibaInu-4.png',
    { frameWidth: 32, frameHeight: 32 })
    
    this.load.image("overworld", "dist/assets/tile/overworld.png")
    this.load.image("objects", "dist/assets/tile/objects.png")
    this.load.tilemapTiledJSON('map','dist/assets/tile/phaser-proj.json')
    
}



function create ()
{
    const map = this.make.tilemap({key: "map"});
    
    const tileset = map.addTilesetImage("overworld", "overworld");
    
    const groundLayer = map.createStaticLayer("ground", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("world", tileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });
    player = this.physics.add.sprite(200,200, "shiba_turn")
    player.setCollideWorldBounds(true);

    scoreText = this.add.text(16, 16, `Score: ${score}`, { fontSize: '32px', fill: '#000' });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'shiba_turn', frame: 0 } ],
        frameRate: 1,
        repeat: 1
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('shiba_right', { start: 1, end: 3 }),
        frameRate: 8,
        repeat: -1
    });
    
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('shiba_left', { start: 1, end: 2 }),
        frameRate: 8,
        repeat: -1
    });
    
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('shiba_up', { start: 1, end: 2 }),
        frameRate: 8,
        repeat: -1
    });
    
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('shiba_down', { start: 1, end: 2 }),
        frameRate: 8,
        repeat: -1
    });
    
    cursors = this.input.keyboard.createCursorKeys()

    // this.bones = this.game.add.physicsGroup()

    // bones = map.createFromObjects('objects', 1574, { key: 'bone' }, this.bones);
    // this.bones = this.game.add.physicsGroup(); // step 1
    // this.map.createFromObjects('objects', 'bone', 'objects', 1574, true, false, this.bones); // step 2
    
    // step 3
    // this.bones.forEach(function(bone){
    //     bone.body.immovable = true;
    // });    


   
    // this.physics.add.overlap(player, bones, collectBone, null, this);
   
    mailman = this.physics.add.image(300,300,'mailman')
    this.physics.add.collider(player, mailman, hitMailman, null, this)
   
    this.physics.add.collider(player,worldLayer)
    
}

function update ()
{
    player.setVelocity(0);
    
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(500);
        player.anims.play('right', true);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-160);
        player.anims.play('up', true);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(160);
        player.anims.play('down', true);
    }
}



// function collectBone(player, bone){
//     bone.disableBody(true, true);
//     score += 10;
//     scoreText.setText(`Score: ${score}`)
// }

function hitMailman(player, mailman){
    
    scoreBox = Phaser.DOM.AddToDOM(document.getElementById("score-box"))
    scoreBox.innerText = score 

    fetch("http://localhost:3000", { 
    method: "post",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"score":score})})    
    // can = Phaser.DOM.AddToDOM(document.getElementsByTagName("canvas"))
    // console.log(can)
    
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;

}
}