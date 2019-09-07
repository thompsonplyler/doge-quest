import 'phaser'

class LoaderScene extends Phaser.Scene {
    constructor (){
        super("Loading Scene")
    }

    preload(){

    this.load.image('bone', '/assets/image/bone.png')
    this.load.image('mailman', '../assets/image/mailman.png')        
    
    this.load.spritesheet('shiba_down', 
    '../assets/sprite/shibaInu-0.png',
    { frameWidth: 32, frameHeight: 32 })
    
    this.load.spritesheet('shiba_up', 
    '../assets/sprite/shibaInu-2.png',
    { frameWidth: 32, frameHeight: 32 })
    
    this.load.spritesheet('shiba_left', 
    '../assets/sprite/shibaInu-3.png',
    { frameWidth: 32, frameHeight: 32 })
    
    this.load.spritesheet('shiba_right', 
    '../assets/sprite/shibaInu-1.png',
    { frameWidth: 32, frameHeight: 32 })
    
    this.load.spritesheet('shiba_turn', 
    '../assets/sprite/shibaInu-4.png',
    { frameWidth: 32, frameHeight: 32 })
    
    this.load.image("overworld", "/assets/tile/overworld.png")
    this.load.image("objects", "/assets/tile/objects.png")
    this.load.tilemapTiledJSON('map','/assets/tile/phaser-proj.json')

    this.load.audio('tomato', 'assets/audio/tomato.mp3')
    this.load.audio('outtahere', 'assets/audio/outtahere.mp3')
    }
    
    create(){

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

        this.scene.start("Game Scene", {level: 1, newGame: true})
    }
} 

export default LoaderScene