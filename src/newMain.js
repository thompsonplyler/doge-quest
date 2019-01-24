import { loaderScene} from "./loaderScene";
import { startScene} from "./startScene";
import { gameScene} from "./gameScene";
import { gameOverScene} from "./gameOverScene";

let game = new Phaser.Game({
    type:   Phaser.AUTO,
    width:  1200,
    height: 700,
    parent: "game",
    // backgroundColor: '#0072bc',
    physics: {
            default: 'arcade'
    },
    scene: 
        [loaderScene, startScene, gameScene, gameOverScene]
    
})

var image
var player
var cursors
var game = new Phaser.Game(config);
var scoreText
var score = 0
var bones
var enemyspeed = 10


// console.log(scoreList)
function preload ()
{
    
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

    bones = map.createFromObjects('objects', 1574, { key: 'bone' }, this.bones);
    this.physics.world.enable(bones);
    this.physics.add.overlap(player, bones, collectBone, null, this);
   
    mailman = this.physics.add.image(300,300,'mailman')

    this.physics.add.collider(player, mailman, hitMailman, null, this)
    
    this.physics.add.collider(player,worldLayer)
    this.physics.add.collider(mailman,worldLayer)
    
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
        player.setVelocityX(160);
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

    // console.log(player.x)
    mailman.setVelocityX(enemyspeed)
    mailman.setVelocityY(enemyspeed);

    this.physics.moveToObject(mailman,player,enemyspeed)
    // enemy follow velocity

    // enemies.forEach(move);

    //     if (d.isDown){
    //         //player.body.velocity.x+=2;            //with physics
    //         player.x+=4;                        //without physics

    //     }
    //     if (a.isDown){
    //         //player.body.velocity.x-=2;            //with physics      
    //         player.x-=4;                        //without physics
    //     } 
    //     if (s.isDown){
    //         //player.body.velocity.y+=2;            //with physics      
    //         player.y+=4;                        //without physics
    //     }
    //     if (w.isDown){
    //         //player.body.velocity.y-=2;            //with physics      
    //         player.y-=4;                        //without physics
    //     } 

    // }
    // else
    // {
    //     enemies.setAll('body.velocity.x',0);
    //     enemies.setAll('body.velocity.y',0);
    // }
//}




}

// move toward the player
// function move(enemy){
//     game.physics.arcade.moveToObject(enemy,player,60,enemyspeed*1000);
// }

function collectBone(player, bones){
    console.log(bones)
    bones.destroy()
    // console.log(event.target)
    // bones.active = false
    // bones.forEach(bone=> bone.disableBody(true, true));
    score += 10;
    enemyspeed += 20;
    scoreText.setText(`Score: ${score}`)
    console.log(bones.length)
}

function hitMailman(player, mailman){
    
    scoreBox = Phaser.DOM.AddToDOM(document.getElementById("score-box"))
    scoreBox.innerText = score 

    fetch("http://localhost:3000", { 
    method: "post",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"score":score})})    
    // can = Phaser.DOM.AddToDOM(document.getElementsByTagName("canvas"))
    // console.log(can)
    jonFunc(score)
    
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;

}