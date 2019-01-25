// TO-DO: 
// 1.) Mailman Sprite Animation
// 2.) Music
// 3.) Sound Effects on Game Over
// 4.) Pathfinding AI



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
}


function phaserGame(){
var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    parent: "game",
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

    scoreText = this.add.text(16, 16, `Your Score: ${score}`, {fontFamily: "disposableDigi", fontSize: '30px', fill: '#fff'  });    scoreText.setShadow(-2, 2, 'rgba(0,0,0,0.5)', 4);
    
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

    mailman.setVelocityX(enemyspeed)
    mailman.setVelocityY(enemyspeed);

    this.physics.moveToObject(mailman,player,enemyspeed)

}

function collectBone(player, bones){
    bones.destroy()
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
    
    bigScore = this.add.text(220, 180, `GAME OVER\nFinal Score: ${score}`, {fontFamily: "disposableDigi", fontSize: '110px', fill: '#fff'  });
    bigScore.setShadow(-2, 2, 'rgba(0,0,0,0.5)', 4);
    scoreText.destroy()

    dogeGameText = this.add.text(55,450, 'For more shiba inu fun, click here!', {fontFamily: "disposableDigi", fontSize: '60px', fill: '#3399ff'  });
    dogeGameText.setInteractive(); 
    shadow = dogeGameText.setStroke('#FFF', 5);
    shadow.setShadow(-2, 2, '#rgba(0,0,0,0.5)', 5, true, false);

    // dogeGameText.setShadow(-2, 2, 'rgba(0,0,0,0.5)', 4);
    
    dogeGameText.on('pointerup', openExternalLink, this);

    reloadText = this.add.text(130,600, 'Reload the page to play again!', {fontFamily: "disposableDigi", fontSize: '60px', fill: '#fff'  }); 
    reloadText.setShadow(-2, 2, 'rgba(0,0,0,0.5)', 4);



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