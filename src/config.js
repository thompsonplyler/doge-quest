import 'phaser'
import GameScene from './Scenes/gameScene'
import LoaderScene from './Scenes/loaderScene'
import StartScene from './Scenes/startScene'
import GameOverScene from './Scenes/gameOverScene'
import UIScene from './Scenes/UI'

export default {
    type: Phaser.AUTO,
    title: "Doge Quest 1989",
    width: 1200,
    height: 700,
    // parent: "game",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0 
            },
            debug: true
        }
    },
    scene: 
        [LoaderScene,GameScene,UIScene,GameOverScene]
    ,//StartScene
    pixelArt: true,
    roundPixels: true
};