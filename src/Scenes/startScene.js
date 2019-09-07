import 'phaser';

let startScene = new Phaser.Scene("Start Scene")


startScene.init = function(){

}
    
startScene.create = function(){
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.playMusic()
      }

startScene.playMusic = function(){
    this.tomato = this.sound.add('tomato')
    this.tomato.play()
}

startScene.resize = function(gameSize, baseSize, displaySize, resolution) {
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

startScene.update = function() {

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)){
            this.scene.start("Game Scene", {level: 1, newGame: true})
        }


    
}


export default startScene
