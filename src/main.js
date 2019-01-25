
function hideForm() {
    document.getElementById('appendForm').style.display = "none"
  }

document.addEventListener("DOMContentLoaded", function(){
    
    phaserGame()
    gameBox = document.getElementsByTagName("canvas")[0]
    gameBox.setAttribute("id","game-box")
    scoreBox = document.createElement("span")
    scoreBox.style.visibility = "hidden"
    scoreBox.setAttribute("id","score-box")
    gameBox.append(scoreBox)

    scoreList = document.getElementById("appendForm")
    scoreTable = document.getElementById("scoreTable") 
    
    writeList(scoreTable)

})

function writeList(scoreList){
    scoreList.innerHTML = ""
    fetch("https://salty-eyrie-53093.herokuapp.com/scores/")
    .then(res=>res.json()).then(scores=> scores.forEach(score=>renderList(score,scoreTable)))
}

//render gamescore and username
function renderList(score,appendList){
    newRow = document.createElement("tr")
    nameTd = document.createElement("td")
    scoreTd = document.createElement("td")
    nameTd.innerText = score.username
    scoreTd.innerText = score.gamescore
    scoreTable.append(newRow)
    newRow.append(nameTd)
    newRow.append(scoreTd)

    
    // scoreList
    // scoreList
    // scoreLi.innerText = `Name: ${score.username}, Score: ${score.gamescore}`
    // appendList.append(scoreLi)   
}


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
var enemyspeed = 10
var playerspeed = 160


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

    scoreText = this.add.text(16, 16, `Score: ${score}`, {fontFamily: "disposableDigi", fontSize: '30px', fill: '#fff'  });    scoreText.setShadow(-2, 2, 'rgba(0,0,0,0.5)', 4);
    
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
   
    mailman = this.physics.add.image(500,300,'mailman')

    this.physics.add.collider(player, mailman, hitMailman, null, this)
    
    this.physics.add.collider(player,worldLayer)
    this.physics.add.collider(mailman,worldLayer)

 
}

function update ()
{
    player.setVelocity(0);
    
    if (cursors.left.isDown)
    {
        player.setVelocityX(-playerspeed);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(playerspeed);
        player.anims.play('right', true);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-playerspeed);
        player.anims.play('up', true);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(playerspeed);
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
    bones.destroy()
    // console.log(event.target)
    // bones.active = false
    // bones.forEach(bone=> bone.disableBody(true, true));
    score += 100;
    enemyspeed += 15;
    playerspeed += 7;
    scoreText.setText(`Score: ${score}`)
}

function hitMailman(player, mailman){
    let bigScore      

    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    
    bigScore = this.add.text(180, 180, `GAME OVER\nFinal Score: ${score}`, {fontFamily: "disposableDigi", fontSize: '110px', fill: '#fff'  });
    bigScore.setShadow(-2, 2, 'rgba(0,0,0,0.5)', 4);
    scoreText.destroy()

    reloadText = this.add.text(180,600, 'Reload the page to play again!', {fontFamily: "disposableDigi", fontSize: '60px', fill: '#fff'  }); 
    reloadText.setShadow(-2, 2, 'rgba(0,0,0,0.5)', 4);

    dogeGameText = this.add.text(80,450, 'For more shiba inu fun, click here!', {fontFamily: "disposableDigi", fontSize: '60px', fill: '#3399ff'  }); 
    dogeGameText.setShadow(-2, 2, 'rgba(0,0,0,0.5)', 4);
    dogeGameText.on('pointerup', openExternalLink, this);

    jonFunc(score)
}

function jonFunc(score) {
    let appendFormDiv = document.getElementById('appendForm')
    
    
    appendFormDiv.innerHTML =
    `<form class="ui form" id="formId">Your Name: <input type="text" placeholder="What's your name?" name="formName"><button type="submit" onclick="hideForm()">Save</button></form>`
    
    let form = document.getElementById("formId");
    
    
    form.addEventListener("submit", event => {
      console.log("Saving name:", event.target.elements.formName.value);
      event.preventDefault();
    
      fetch("https://salty-eyrie-53093.herokuapp.com/users", {
        method: "POST",
        headers: {
          'Accept': "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "name": `${event.target.elements.formName.value}` })
      })
      .then(res => res.json())
      .then(res => postScore(res.id))
    });
    
    function postScore(id) {
      fetch("https://salty-eyrie-53093.herokuapp.com/scores",{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "gamescore": `${score}`, "user_id": `${id}`})
      })
    }
    

    }

    function openExternalLink () {
        console.log("poop")
        var url = 'https://jonathanbiro.com/DogeGame/'
    
        var s = window.open(url, '_blank');
    
        if (s && s.focus)
        {
            s.focus();
        }
        else if (!s)
        {
            window.location.href = url;
        }
    }

}