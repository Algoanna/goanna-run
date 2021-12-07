import ToplistService from 'services/ToplistService';

class HighScores extends Phaser.State {

	create() {
		// Set the game background colour
		this.game.stage.backgroundColor = '#000000';

		this.createHeader();

		this.loadingText = this.game.add.text(this.game.width/2, 200,'loading...');
	    this.loadingText.anchor.set(0.5);
	    this.loadingText.font = 'arcade';
	    this.loadingText.fontSize = 40;
	    this.loadingText.fill = '#504c39';	   

		let results = ToplistService.getTop10();
		this.renderHighScores(results);
	}

	update() {
	    this.game.input.keyboard.onUpCallback = _.bind(function(e){
			if(e.keyCode == Phaser.Keyboard.ESC || e.keyCode == Phaser.Keyboard.ENTER) {
	  			this.game.state.start('MainMenu');
			}
		},this);
	}

	createHeader() {
		let headerOffset = 80;

		let text = this.game.add.text(this.game.width/2, headerOffset,'High Scores - Top 10');
	    text.anchor.set(0.5);
	    text.align = 'center';
	    text.font = 'arcade';
	    text.fontSize = 60;
	    text.fill = '#FFFFFF';
	    text.stroke = '#403511';
   		text.strokeThickness = 6;

    	var restartText = this.game.add.text(this.game.width/2, 20,'ESC - Go to main menu');
	    restartText.anchor.set(0.5);
	    restartText.align = 'center';
	    restartText.font = 'arcade';
	    restartText.fontSize = 30;
	    restartText.fill = '#FED345';
	    restartText.stroke = '#403511';
    	restartText.strokeThickness = 2;


		const leave = (label) => {
			return function() {
				this.game.state.start(label);
			}
		}
		var buttonLeave = this.game.add.button(this.game.width/2-160,10, '', (leave('MainMenu').bind(this)), this, 2, 1, 0);
		buttonLeave.width = 300
		//var buttonReplay = this.game.add.button(this.game.width/2-160, 170, '', (actionOnClick('replay').bind(this)), this, 2, 1, 0);
		//buttonReplay.width = 320


	}

	renderHighScores(toplist) {
		this.loadingText.destroy();
		
		let topListOffset = 120;
		let lineHeight = 35;

		_.each(toplist,_.bind(function(item,index){
			let value = (index+1)+'.  '+item.playerName + "\t\t" + item.score;
			let playerName = this.game.add.text(130, topListOffset + lineHeight*index,value);
		    playerName.align = 'left';
		    playerName.font = 'arcade';
		    playerName.fontSize = 40;
		    playerName.fill = '#FED345';
		    playerName.stroke = '#403511';
		    playerName.tabs = 400;
		},this));
	}
}

export default HighScores;