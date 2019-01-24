import {CST} from "CST";
import { startScene } from "./startScene";
export class loaderScene extends Phaser.Scene{
    constructor (){
        super({
            key: CST.SCENES.LOADER
        })
    }

    init(){

    }

    preload(){

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
    
    create(){
        this.scene.add(CST.SCENES.START, startScene, false)
    }
} 