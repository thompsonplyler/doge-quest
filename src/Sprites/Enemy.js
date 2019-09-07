import 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene,x,y, 'mailman')
        this.scene = scene
        // this.scene.add.image(500,300,'mailman')
        this.direction = 'up'

        // enable physics
        this.scene.physics.world.enable(this)

        // add the play to the scene. 
        this.scene.add.existing(this)
        this.enemySpeed = 10

        // this.setScale(4)

    


        // this.input.setDraggable(this.pet);

      
        // // follow the pointer and return the X,Y
        // this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
        //   // make sprite be located at pointer coordinates by dragging
        //   gameObject.x = dragX;
        //   gameObject.y = dragY;
      
        // })
        
    }
        // this creates a new update() method for the Player class
        update(player, speed, scene){
            let x = this.x;
            let y = this.y;
            let toX = player.x;
            let toY = player.y
            console.log('going from ('+x+','+y+') to ('+toX+','+toY+')');

            scene.finder.findPath(x,y,toX,toY,function(path){
                if (path === null){
                    console.warn("Path was not found.")
                }
                else {
                    console.log(path);

                }
            })
 

        }

}

// let x = Game.camera.scrollX + pointer.x;
// let y = Game.camera.scrollY + pointer.y;
// let toX = Math.floor(x/32);
// let toY = Math.floor(y/32);
// let fromX = Math.floor(Game.player.x/32);
// let fromY = Math.floor(Game.player.y/32);
// console.log('going from ('+fromX+','+fromY+') to ('+toX+','+toY+')');