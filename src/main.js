function phaserGame(){


var image
var player
var cursors
var game = new Phaser.Game(config);
var scoreText
var score = 0
var bones
var enemyspeed = 10
var playerspeed = 160
var timedEvent 
var timer = 20
var map
var getTileID
var worldLayer

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

    
    player = this.physics.add.sprite(200,200, "shiba_turn")
    player.setCollideWorldBounds(true);


    
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

    timedEvent = this.time.delayedCall(20000, hitMailman, [player,mailman], this);
    scoreText = this.add.text(16, 4, `Your Score: ${score}`, {fontFamily: "disposableDigi", fontSize: '24px', fill: '#fff'  });    
    scoreText.setShadow(-2, 2, 'rgba(0,0,0,0.5)', 4);    
    timerText = this.add.text(16, 24, ``, {fontFamily: "disposableDigi", fontSize: '24px', fill: '#fff'  }); 
    timerText.setShadow(-2, 2, 'rgba(0,0,0,0.5)', 4);

}

function update ()
{

    timerText.setText('Time left: ' + (20-(Math.floor(timedEvent.getElapsedSeconds()))));
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
    
    
    player.setTint(0xff0000);
    player.anims.play('turn');
    let bigScore      
    this.physics.pause();
    gameOver = true;
    
    bigScore = this.add.text(220, 180, `GAME OVER\nFinal Score: ${score}`, {fontFamily: "disposableDigi", fontSize: '110px', fill: '#fff'  });
    bigScore.setShadow(-2, 2, 'rgba(0,0,0,0.5)', 4);
    scoreText.destroy()
    timerText.destroy()

    dogeGameText = this.add.text(55,450, 'For more shiba inu fun, click here!', {fontFamily: "disposableDigi", fontSize: '60px', fill: '#3399ff'  });
    dogeGameText.setInteractive(); 
    shadow = dogeGameText.setStroke('#FFF', 5);
    shadow.setShadow(-2, 2, '#rgba(0,0,0,0.5)', 5, true, false);
    
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

        var url = 'https://jonbiro.github.io/DogeQuest-1989/'
    
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