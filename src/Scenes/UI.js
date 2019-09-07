import 'phaser';
import config from '../config'


class UIScene extends Phaser.Scene {
    constructor(){
        super({key: 'UI', active: true})
    }


    init(){
        this.bonesCollected = 0;
    }

    create(){
        this.scoreText = this.add.text(12,12,`Score: ${this.bonesCollected}`, {fontFamily: "disposableDigi", fontSize: '24px', fill: '#fff'  })
        

        this.gameScene = this.scene.get('Game Scene')

        this.gameScene.events.on('enemyHit', () => {
        })

        this.gameScene.events.on('boneCollected', ()=>{
            this.bonesCollected += 100
            this.gameScene.enemySpeed += 15
            this.gameScene.playerSpeed += 7
            this.scoreText.setText(`Score: ${this.bonesCollected}`)

        })

        this.gameScene.events.on('newGame', ()=>{
            this.bonesCollected = 0
            this.scoreText.setText(`Score: ${this.bonesCollected}`)
        })
       
    }

}

export default UIScene
