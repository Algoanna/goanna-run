class Credits extends Phaser.State {

	create() {
		// Set the game background colour
		this.game.stage.backgroundColor = '#000000';
		this.scrollSpeed = 1;
		this.separatorHeight = 80;
		this.lineHeight = 25;
		this.titleTextSize = 28;
		this.nameTextSize = 35;
		this.textStackHeight = this.game.height;
		this.credits = [];

    	var restartText = this.game.add.text(this.game.width/2, 20,'ESC - Go to main menu');
	    restartText.anchor.set(0.5);
	    restartText.align = 'center';
	    restartText.font = 'arcade';
	    restartText.fontSize = 30;
	    restartText.fill = '#FED345';
	    restartText.stroke = '#403511';
    	restartText.strokeThickness = 2;


		const leave = function (label) {
			return function() {
				this.game.state.start(label);
			}
		}
		var buttonLeave = this.game.add.button(this.game.width/2-160,10, '', (leave('MainMenu').bind(this)), this, 2, 1, 0);
		buttonLeave.width = 300

		this.addTitle();
		this.addCredits();
   
		// Add Key handler
		this.registerKeyhandler();	
	}


	update() {
		// Animate credits
		_.each(this.credits,_.bind(function(text,index){
			text.y -= this.scrollSpeed;
			if (text.y<-100) {
				text.destroy();
			}
		},this));

		// If the last credit is off the screen go back to the main screen
		if(this.credits[this.credits.length-1].y < -50) {
			this.game.state.start("MainMenu");
		}
	}

	addTitle() {
		let text = this.game.add.text(this.game.width/2, this.textStackHeight,'Credits');
	    text.anchor.set(0.5);
	    text.align = 'center';
	    text.font = 'arcade';
	    text.fontSize = 60;
	    text.fill = '#FFFFFF';
	    text.stroke = '#403511';
   		text.strokeThickness = 6;

   		this.credits.push(text);

   		// Increase the initial position for the next credit 
   		this.textStackHeight += this.separatorHeight;
	};

	addCredits() {
		let credits = this.getCredits();
		_.each(credits,_.bind(function(credit){
			// First add the title
			let title = this.getStyledText(credit.title,'title');
	   		this.credits.push(title);

	   		// Increase the initial position for the next credit 
	   		this.textStackHeight += this.lineHeight;

			let name = this.getStyledText(credit.value,'name');
	   		this.credits.push(name);

	   		// Increase the initial position for the next credit 
	   		this.textStackHeight += this.separatorHeight;
		},this));
	}

	getStyledText(label,style){
		// First add the title
		let text = this.game.add.text(this.game.width/2, this.textStackHeight,label);
	    text.anchor.set(0.5);
	    text.align = 'center';
	    text.font = 'arcade';
	    text.fontSize = style=='title' ? this.titleTextSize : this.nameTextSize;
	    text.fill = style=='title' ? '#403511' : '#FFFFFF';
	    text.stroke = style=='title'? '#FFFFFF' : '#403511';
   		text.strokeThickness = style=='title'? 0 : 5;
   		return text;
	}
	
	registerKeyhandler() {
	    this.game.input.keyboard.onUpCallback = _.bind(function(e){
			if(e.keyCode == Phaser.Keyboard.ESC || e.keyCode == Phaser.Keyboard.ENTER) {
	  			this.game.state.start('MainMenu');
			}
		},this);		
	}

	getCredits() {

		return [
			{
				'title' : 'Blockchain Developer'
				,'value': 'DeadZen @Zenstyle'
			},
			{
				'title' : 'Graphics'
				,'value': '@LIXEL_PIZRD'
			},
			{
				'title' : 'Original Developer'
				,'value': 'Endre Andras'
			},
			{
				'title' : 'Special thanks to'
				,'value': ['Algorand',' Silvio Micali']
			}
		];		
	}

}

export default Credits;