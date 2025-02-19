class Menu {

	constructor(options, game){
		this.game = game;
		this.options = options;
		this.drawnTexts = [];
		this.drawnButtons = [];

		// Create an isActive property on each element
		this.options.items.forEach(function(navItem,index){
			navItem.isActive = false;
		});
		// Set the first menu as active
		this.options.items[0].isActive = true;

		this.registerKeyhandler();

		this.drawMenu();
		return this;
	}

	drawMenu() {
		var navigationOffset = 250;

		this.drawnTexts.forEach(function(navItem,index){
			navItem.destroy();
		},this);

		if (this.options.title) {
			let topOffset = navigationOffset - 40;
			let text = this.game.add.text(this.game.width/2, topOffset,this.options.title);
		    text.anchor.set(0.5);
		    text.align = 'center';
		    text.font = 'arcade';
		    text.fontSize = 25;
		    text.fill = '#FFFFFF';
    		text.strokeThickness = 0;

    		this.drawnTexts.push(text);
		}

		const actionOnClick = function (label) {
			return function() {
				switch (label) 
				{ 
					case 'Start Game':
						this.moveCursor(0);
						break;
					case 'High Scores':
						this.moveCursor(1);
						break;
					case 'Credits':
						this.moveCursor(2);
						break;
					case 'Algoanna':
						this.moveCursor(0);
						break;
					case 'Flamingoanna':
						this.moveCursor(1);
						break;

				}
		let activeIndex = this.getActiveIndex();
				//console.log(label, activeIndex)
				this.drawMenu();
	    		let activeMenu = this.getActiveMenu();
	    		if (activeMenu) {
					setTimeout(activeMenu.callback, 250);
	    		}
			}
		}


		this.options.items.forEach(function(navItem,index){
			//console.log(navItem.label)
			let topOffset = navigationOffset + index*40;
			let text = this.game.add.text(this.game.width/2, topOffset,navItem.label);
			var button = this.game.add.button(this.game.width/2-150, topOffset-9, '', (actionOnClick(navItem.label).bind(this)), this, 0, 0, 0);
			//button.visible = false;
			button.width = 300;
		    text.anchor.set(0.5);
		    text.align = 'center';
		    text.font = 'arcade';
		    text.fontSize = 50;
		    text.fill = '#FFFFFF';
		    text.stroke = '#504c39';
    		text.strokeThickness = navItem.isActive ? 6 : 0;

    		this.drawnTexts.push(text);
    		this.drawnButtons.push(button);
		},this);
	}

	getNextIndex() {
		let activeIndex = this.getActiveIndex();
		return (activeIndex == this.options.items.length-1) ? 0 : activeIndex+1;
	}

	getPrevIndex() {
		let activeIndex = this.getActiveIndex();
		return activeIndex == 0 ? this.options.items.length-1 : activeIndex-1;
	}

	getActiveIndex() {
		return _.findIndex(this.options.items,{'isActive':true});
	}

	getActiveMenu() {
		let activeIndex = this.getActiveIndex();
		return _.isUndefined(this.options.items[activeIndex]) ? undefined : this.options.items[activeIndex];
	}

	moveCursor(newIndex) {
		let activeIndex = this.getActiveIndex();
		if (_.isUndefined(this.options.items[activeIndex]) || _.isUndefined(this.options.items[newIndex])) {
			return;
		}

		this.options.items[activeIndex].isActive = false;
		this.options.items[newIndex].isActive = true;
	}

	registerKeyhandler() {
		this.game.input.keyboard.onUpCallback = _.bind(function(e){
			if(e.keyCode == Phaser.Keyboard.UP) {
	  			this.moveCursor(this.getPrevIndex());
	    		this.drawMenu();
			}
			if(e.keyCode == Phaser.Keyboard.DOWN) {
	  			this.moveCursor(this.getNextIndex());
	    		this.drawMenu();
			}
			if(e.keyCode == Phaser.Keyboard.ENTER) {
	    		let activeMenu = this.getActiveMenu();
	    		if (activeMenu) {
	    			activeMenu.callback();
	    		}
			}
		},this);
	}

	destroy() {
		this.game.input.keyboard.reset();
		this.drawnTexts.forEach(function(navItem,index){
			navItem.destroy();

		});
		this.drawnButtons.forEach(function(butItem,index){
			butItem.destroy();

		});
	}

}

export default Menu;