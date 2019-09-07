import 'phaser';

let gameOverScene = new Phaser.Scene("Game Over Scene") 
    
gameOverScene.create = function(){
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.playMusic()
  
};

gameOverScene.playMusic = function(){
    this.outtahere = this.sound.add('outtahere')
    this.outtahere.play()
}
        

gameOverScene.update = function() {

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)){
            console.log(this.scene)
            this.scene.start("Game Scene", {level: 1, newGame: true})
        }
} 

export default gameOverScene