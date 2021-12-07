class Score {

	constructor(game){
		this.game = game;
		this.digitNumber = 7;		
		this.topOffset = 20;
		this.rightOffset = 20;
		this.leftOffset = 20;
		this.characterWidth = 13;

		var account = this.game.Settings.playerWallet
		var acctlen = this.game.Settings.playerWallet.length
		account = account.substring(0, 4) + '...' + account.substring(acctlen-4, acctlen);
	    this.nameW = this.game.add.text(this.leftOffset, this.topOffset-15,'Wallet');
	    this.nameW.font = 'arcade';
	    this.nameW.fontSize = 24;
	    this.nameW.fill = '#777d90';

	    this.value = this.game.add.text(this.leftOffset+90, this.topOffset-15,account);
	    this.value.font = 'arcade';
	    this.value.fontSize = 24;
	    this.value.fill = '#343537';


	    this.nameN = this.game.add.text(this.game.width-(this.characterWidth*this.digitNumber)-this.rightOffset-90, this.topOffset-15,'Name');
	    this.nameN.font = 'arcade';
	    this.nameN.fontSize = 24;
	    this.nameN.fill = '#777d90';

	    this.value = this.game.add.text(this.game.width-(this.characterWidth*this.digitNumber)-this.rightOffset, this.topOffset-15,this.game.Settings.playerName);
	    this.value.font = 'arcade';
	    this.value.fontSize = 24;
	    this.value.fill = '#343537';

		
	    this.nameS = this.game.add.text(this.game.width-(this.characterWidth*this.digitNumber)-this.rightOffset-90, this.topOffset+5,'Score');
	    this.nameS.font = 'arcade';
	    this.nameS.fontSize = 24;
	    this.nameS.fill = '#777d90';

	    this.score = this.game.add.text(this.game.width-(this.characterWidth*this.digitNumber)-this.rightOffset, this.topOffset+5,'0');
	    this.score.font = 'arcade';
	    this.score.fontSize = 24;
	    this.score.fill = '#343537';

	    this.nameL = this.game.add.text(this.game.width-(this.characterWidth*this.digitNumber)-this.rightOffset-90, this.topOffset+25,'Lives');
	    this.nameL.font = 'arcade';
	    this.nameL.fontSize = 24;
	    this.nameL.fill = '#777d90';

	    this.lives = this.game.add.text(this.game.width-(this.characterWidth*this.digitNumber)-this.rightOffset, this.topOffset+25,'0');
	    this.lives.font = 'arcade';
	    this.lives.fontSize = 24;
	    this.lives.fill = '#343537';
	    this.setScore(5);

		var lives = localStorage.getItem("lives")

		if (lives == undefined || parseInt(lives) < 1) {
	    	this.setLives(3);
			localStorage.setItem("lives", 3)
		} else
			this.setLives(lives);

	    return this;
	}

	setLives(lives) {
		this.lives.setText(lives);
		localStorage.setItem("lives", lives)
	}


	setScore(score) {
		let zeros = '' + Math.pow(10,this.digitNumber);
		let paddedScore = (zeros + score).substr(-this.digitNumber);
		this.score.setText(paddedScore);
	}

	update(value, amount=0) {

		if (value == undefined)  {
		     this.setLives(parseInt(this.lives._text)+amount);
		}
		else this.setScore(value);
	}



}

export default Score;