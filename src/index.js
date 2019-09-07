import 'phaser';
import config from './config'

let game = new Phaser.Game(config)

// class Game extends Phaser.Game {
//   constructor(){
//     super(config);
//     this.scene.start("LoadingScene")
//   }
// }
// window.game = new Game();
// console.log(Phaser.Structs.(game))

window.addEventListener('resize', function (event){
  game.scale.resize(window.innerWidth, window.innerHeight)
  
}, false)

function hideForm() {
    document.getElementById('appendForm').style.display = "none"
  }

function writeList(scoreList){
    scoreList.innerHTML = ""
    fetch("https://salty-eyrie-53093.herokuapp.com/scores/")
    .then(res=>res.json()).then(scores=> scores.forEach(score=>renderList(score,scoreTable)))
}

function renderList(score,appendList){
    newRow = document.createElement("tr")
    nameTd = document.createElement("td")
    scoreTd = document.createElement("td")
    nameTd.innerText = score.username
    scoreTd.innerText = score.gamescore
    scoreTable.append(newRow)
    newRow.append(nameTd)
    newRow.append(scoreTd)
}

document.addEventListener("DOMContentLoaded", function(){
    // gameBox = document.getElementsByTagName("canvas")[0]
    // gameBox.setAttribute("id","game-box")
    // scoreBox = document.createElement("span")
    // scoreBox.style.visibility = "hidden"
    // scoreBox.setAttribute("id","score-box")
    // gameBox.append(scoreBox)

    // scoreList = document.getElementById("appendForm")
    // scoreTable = document.getElementById("scoreTable") 
    
    // writeList(scoreTable)

})