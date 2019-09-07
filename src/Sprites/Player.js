import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene,x,y,'shiba_turn')
        this.scene = scene
        
        this.direction = 'up'

        // enable physics
        this.scene.physics.world.enable(this)

        // add the play to the scene. 
        this.scene.add.existing(this)

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
        update(cursors, speed){
            this.setVelocity(0)

            if (cursors.up.isDown){
                this.setVelocityY(-speed)
                this.direction = 'up'
                this.scene.events.emit('moved')
            } else if (cursors.down.isDown) {
                this.setVelocityY(speed)
                this.direction = 'down'
                this.scene.events.emit('moved')
            }
      
            if (cursors.left.isDown){
                this.setVelocityX(-speed)
                this.direction = 'left'
                this.scene.events.emit('moved')
            } else if (cursors.right.isDown) {
                this.setVelocityX(speed)
                this.direction = 'right'
                this.scene.events.emit('moved')
            }

 

        }

        enemyCollision(player,enemy){
            console.log("overlap detected")
            this.scene.events.emit('enemyHit')
            // if (!this.hitDelay){
            //     this.loseHealth()
            //     this.hitDelay = true;
            this.tint = 0xff0000;
            this.scene.time.addEvent({
                    delay: 1200,
                    callback: ()=>{
                        this.tint = 0xffffff;
                        this.scene.loadNextLevel(true)
                    }
                })
        }

        loseHealth(){
            this.health--
            if (this.health <= 0){
                this.health === 0 
                this.scene.loadNextLevel(true)
            }
        }
    


}