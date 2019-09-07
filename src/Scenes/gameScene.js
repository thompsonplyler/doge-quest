import 'phaser';
import 'easystarjs'
import Player from '../Sprites/Player'
import Enemy  from '../Sprites/Enemy'
import gameOverScene from '../Scenes/gameOverScene';
import EasyStar from 'easystarjs'
import Bones from '../Groups/Bones'
import { timingSafeEqual } from 'crypto';
// import Coins from '../Groups/Coins'
// import Enemies from '../Groups/Enemies'
// import Bullets from '../Groups/Bullets'

let gameScene = new Phaser.Scene("Game Scene")
// class GameScene extends Phaser.Scene {

//     constructor(){

//         // this is the name of the scene that will be called by other scenes
//         // equivalent to let loadingScene = new Phaser.Scene('Loading'); in other modules
//         super("Game Scene")
//     }

// the data argument here passes on the second argument from the 
// scene.start function that loaded this scene, which is 
// in bootScene.js ("Booting Scene") in this case.
// this data passes the level, whether or not it's a new game,
// as well as the total levels for the game. 

gameScene.init = function(data){
  this.score = 0 
  this.enemySpeed = 10
  this.playerSpeed = 160
  this.timer = 20
}


    
gameScene.create = function(){
        this.scale.on('resize',this.resize,this)
        this.createMap()
        this.createPlayer();
        this.cursors = this.input.keyboard.createCursorKeys()
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.addEnemy()
        
        this.addBones()
        this.addCollisions()

        // when the player moves, it emits an event
        // when that event happens, the enemy makes a calculation and attempts to move along those lines.

        
        
        
        
        
        
        
        // this.cameras.main.startFollow(this.player)
      }
      
gameScene.addBones = function(){
  this.bones = this.map.createFromObjects('objects', 1574, {key: 'bone'})
  this.bonesGroup = new Bones(this.physics.world, this, [], this.bones) 
}

gameScene.addEnemy = function(){
  this.enemy = new Enemy(this,500,300)
  
}

gameScene.createPlayer = function(){
  // this gets the "Player" layer from the Tiled map.
  // Tiled map is explained to Phaser in gameScene.createMap()
  // Player is placed on map through Player class in Player.js
  
      this.map.findObject('Player',(obj)=> {
      if (obj.type === 'startPosition'){    
        this.player = new Player(this,obj.x, obj.y)
      }
    })
}

gameScene.createMap = function(){
    this.map = this.make.tilemap({key:"map"});
    
    this.tileset = this.map.addTilesetImage("overworld", "overworld")
    this.groundLayer = this.map.createStaticLayer('ground', this.tileset)
    this.worldLayer = this.map.createStaticLayer('world',this.tileset);
    this.worldLayer.setCollisionByProperty({collides: true})
    // console.log(this.map.layers[1])

    
    this.finder = new EasyStar.js();
  

    this.map.layer = 0
    let grid = [];

    
    for(let y = 0; y < this.map.height; y++){
        let col = [];
        for(let x = 0; x < this.map.width; x++){
            // In each cell we store the ID of the tile, which corresponds
            // to its index in the tileset of the map ("ID" field in Tiled)
            col.push(this.getTileID(x,y));
        }
        grid.push(col);
    }
    console.log(grid)
    

    this.finder.setGrid(grid)
    
    // console.log(gameScene.getTileID(300,300))
    


    let tilesetProperties = this.tileset.tileProperties
    let acceptableTiles = [];
    let tileForGrid = this.map.tilesets[0]
    console.log(tileForGrid)


    for(var i = tileforGrid.firstgid-1; i < tileforGrid.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
      if(!tilesetProperties.hasOwnProperty(i)) {
          // If there is no property indicated at all, it means it's a walkable tile
          acceptableTiles.push(i+1);
          continue;
      }
      if(!tilesetProperties[i].collides) acceptableTiles.push(i+1)
      // if(properties[i].cost) Game.finder.setTileCost(i+1, properties[i].cost); // If there is a cost attached to the tile, let's register it
    }
    this.finder.setAcceptableTiles(acceptableTiles)


    //     this.add.tileSprite(0,0,8000,8000,'RPGpack_sheet',31)
    //             // this gets the thing we named "level1" with the tilemapTiledJSON method.
    //     // this was originally in this scene file, but I moved it to 
    //     // Loading.js

    //     this.map = this.make.tilemap({key: this._LEVELS[this._LEVEL]})

    //     // map.addTilesetImage creates a tilesetImage from the 
    //     // spresheet we imported during the preload, 
    //     this.tiles = this.map.addTilesetImage('RPGpack_sheet')

    //     this.backgroundLayer = this.map.createStaticLayer('Background', this.tiles,0,0)
        
    //     //looks for the "Blocked" layer on the JSON map.
    //     this.blockedLayer = this.map.createStaticLayer('Blocked', this.tiles,0,0)

    //     // pass an array of tile indices on the tilemap that you don't want collisions added for. 
    //     // passing an array of -1 adds collisions for everything in that "Blocked" layer or this.blockedLayer.
    //     this.blockedLayer.setCollisionByExclusion([-1]);


}

gameScene.getTileID = function(x,y){
  
  let tile = this.map.getTileAt(x, y);
  return tile.index
};

gameScene.resize = function(gameSize, baseSize, displaySize, resolution) {
        let width = gameSize.width;
        let height = gameSize.height;
        if (width === undefined) {
          width = this.sys.game.config.width;
        }
        if (height === undefined) {
          height = this.sys.game.config.height;
        }
        this.cameras.resize(width, height);
      }

gameScene.update = function() {
        this.player.update(this.cursors, this.playerSpeed);
        this.enemy.update(this.player,this.enemySpeed, this);

        // if (Phaser.Input.Keyboard.JustDown(this.spaceKey)){
        //   this.bullets.fireBullet(this.player.x, this.player.y, this.player.direction)
        // }


    
}

gameScene.loadNextLevel = function(endGame){
  if(!this.loadingLevel){
  this.cameras.main.fade(500,0,0,0);
  this.cameras.main.on('camerafadeoutcomplete', ()=>{
    if (endGame) {

      this.scene.start("Game Over Scene", {level: 1, newGame: true})
      this.scene.remove()
    //   this.scene.restart({level:1, levels: this._LEVELS, newGame: true})
    // }
    // else if (this._LEVEL === 1) {
    //   this.scene.restart({level: 2, levels: this._LEVELS, newGame: false})
    // }
    //   else {
    //     this.scene.restart({level: 1, levels: this._LEVELS, newGame: false})
    //   }

  }}

  )}
this.loadingLevel=true
    // calling restart when the portal is touched tells Phaser to
    // reload the scene, but with the changes designated 
    // by the contents of the object it takes as an argument.

  }


gameScene.addCollisions = function(){
  this.physics.add.collider([this.player, this.enemy],this.worldLayer)
  // this.physics.add.collider(this.enemiesGroup,this.blockedLayer)
  this.physics.add.overlap(this.player,this.enemy, this.player.enemyCollision.bind(this.player))
  this.physics.add.overlap(this.player,this.bonesGroup, this.bonesGroup.collectBone.bind(this.bonesGroup))
  
  // this.physics.add.overlap(this.player,this.portal, this.loadNextLevel.bind(this, false))
  
  // this.physics.add.overlap(this.player,this.coinsGroup, this.coinsGroup.collectCoin.bind(this.coinsGroup))
  // this.physics.add.overlap(this.bullets,this.enemiesGroup, this.bullets.enemyCollision)
  
}


export default gameScene

