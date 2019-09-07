import 'phaser';

export default class Bones extends Phaser.Physics.Arcade.StaticGroup{
    constructor (world, scene, children, spriteArray){
        super(world,scene,children,spriteArray)
        this.scene = scene
        
        spriteArray.forEach(bone=>{
            bone.setOrigin(0);
            // bone.setScale(.2)
            this.add(bone)
            this.world.enableBody(bone,1);
            bone.body.setSize(bone.width*bone.scaleX,bone.height*bone.scaleY,true);
            this.add(bone);
        })
        // enable physics
        this.scene.physics.world.enable(this)

        // add the play to the scene. 
        
        this.refresh()
        
    }

    collectBone(player,bone){
        this.remove(bone);
        bone.destroy(); 
        this.scene.events.emit('boneCollected')

    }
    

}