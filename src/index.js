import Preload from 'states/Preload';
import MainMenu from 'states/MainMenu';
import Credits from 'states/Credits';
import HighScores from 'states/HighScores';
import Main from 'states/Main';
import Settings from './settings';
var nj = require('numjs');
var math = require('mathjs');
const SHA256 = require("crypto-js/sha256");


//import MyAlgoWallet from '@randlabs/myalgo-connect';


window.reset = function () {
  localStorage.setItem("name", "")  
  localStorage.setItem("address", "")
  console.log('reset complete')
}


class Game extends Phaser.Game {

	constructor(config) {		
		// Width, height of the game, AUTO = Detect canvas or webGL
		super(config); 
		console.log(config, this)

		// Store game settings
		this.Settings = Settings;

		// Define game states
		this.state.add('Preload', Preload, false);
		this.state.add('MainMenu', MainMenu, false);
		this.state.add('Credits', Credits, false);
		this.state.add('HighScores', HighScores, false);
		this.state.add('Main', Main, false);

		// Start the preload state
		this.state.start('Preload');		

		//this.preload()

const P = 50111;

function randInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}


var enc = function(i) {
	var a = randInt(-P, P)
	var b = randInt(-P, P)
	var c = math.mod((i - a - b), P)  
	var r = nj.int32([a, b, c])
	return r
  }
  
  var dec = function(i) {
	  return math.mod(i.sum(), P)
  }
  
  var mult = function(i, j) {
  
	var u1 = math.mod((i.get(1)*j.get(1) + i.get(1)*j.get(2) + i.get(2)*j.get(1)), P)
	var u2 = math.mod((i.get(2)*j.get(2) + i.get(0)*j.get(2) + i.get(2)*j.get(0)), P)
	var u3 = math.mod((i.get(0)*j.get(0) + i.get(0)*j.get(1) + i.get(1)*j.get(0)), P)
	return dec(nj.int32([u1, u2, u3]))
  
  }

var x = enc(25)
var y = enc(5)

console.log(dec(x.add(y))) // 30
console.log(dec(x.subtract(y))) // 20
console.log(mult(x, y)) // 30

	
		
	}


}


var config = {
    type: Phaser.CANVAS,
    scale: {
		/*
        mode: Phaser.ScaleManager.NO_SCALE,
        parent: 'phased',
        autoCenter: Phaser.ScaleManager.CENTER_BOTH,
		width: Settings.canvasWidth, 
		height: Settings.canvasHeight
		*/
    }
    //physics: {
    //    default: 'arcade',
    //    arcade: {
    //        gravity: { y: 300 },
    //        debug: true
    //    }
    //}
    //scene: GameScene
};


config = {
	width: Settings.canvasWidth, 
	height: Settings.canvasHeight,
    renderer: Phaser.AUTO,
    parent: 'phaser',
    transparent: false,
    antialias: false,
    state: this,
    //scaleMode: Phaser.ScaleManager.USER_SCALE 
    scaleMode: Phaser.ScaleManager.EXACT_FIT
    //scaleMode: Phaser.ScaleManager.SHOW_ALL
};


new Game(config);
