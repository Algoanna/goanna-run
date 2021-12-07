class Player {

	constructor(game){
		this.game = game;
		this.swipeLeft = false;
		this.swipeRight = false;
		this.swipeUp = false;
		this.swipeDown = false;
		this.hitPlatform = false;

		this.game.input.onUp.add(this.mouseUp, this);
		this.game.input.onDown.add(this.mouseDown, this);

	
		// The default character is the groom
		let characterSprite = 'groomSprite';

		if (this.isWoman()) {
			characterSprite = 'brideSprite';
		}

		// The player and its settings
	    this.character = this.game.add.sprite(this.game.width/2, this.game.height/3, characterSprite);

	    //  We need to enable physics on the player
	    this.game.physics.arcade.enable(this.character);

	    //  Player physics properties. Give the little guy a slight bounce.
	    this.character.body.bounce.y = this.game.Settings.physics.playerBounce;
	    this.character.body.gravity.y = this.game.Settings.physics.playerGravity;
	    this.character.body.collideWorldBounds = true;

	    // Set a narrower bounding box for the character than the image itself
		let characterImage = this.game.cache.getImage(characterSprite);
	    this.character.body.setSize(70, characterImage.height-10, 4, 5);

	    //  Our two animations, walking left and right.
	    this.character.animations.add('left', [0, 1, 2, 3, 4], 10, true);
	    this.character.animations.add('right', [5, 6, 7, 8, 5], 10, true);

	    this.sounds = {
	    	'jump' : this.game.add.audio('jump',this.game.Settings.effectVolume)
	    	,'damage' : this.game.add.audio(this.isWoman() ? 'damage-woman' : 'damage-man',this.game.Settings.effectVolume)
	    	,'coin' : this.game.add.audio('coin',this.game.Settings.effectVolume)
	    };

	    return this;
	}

	mouseDown() {
        this.mouseIsDown = true;
		this.startTime = new Date().getTime();
		this.startX = this.game.input.activePointer.clientX;
		this.startY = this.game.input.activePointer.clientY;
    }

    mouseUp() {
        this.mouseIsDown = false;
    }

	swiper(left, right, down, up) {
		this.swipeLeft = false;
		this.swipeRight = false;
		this.swipeDown = false;
		this.swipeUp = false;

		if (left) this.swipeLeft = true;
		if (right) this.swipeRight = true;
		if (down) this.swipeDown = true;
		if (up) this.swipeUp = true;

		setTimeout(function () { 
			this.swipeLeft = false;
			this.swipeRight = false;
			this.swipeDown = false;
			this.swipeUp = false;
		}.bind(this), 700)

	}

	getObject() {
 		return this.character;
	}

	isMale() {
		return this.game.Settings.characterType=='bride' ? false : true;
	}

	isWoman() {
		return !this.isMale();
	}

	collectBounty(x,y,velocity) {
		this.sounds.coin.play();
		let score = velocity * this.game.Settings.score.enemy;
		this.scorePoints(x,y,score);
	}

	collectCoin(x,y) {
		this.sounds.coin.play();
		this.scorePoints(x,y,this.game.Settings.score.coin);
	}

	scorePoints(x,y,points) {
		let text = this.game.add.text(x, y,'+'+points);
		text.anchor.set(0.5);
		text.align = 'center';
		text.font = 'arcade';
		text.fontSize = 25;
		text.fill = '#FFFFFF';
		text.stroke = '#504c39';
		text.strokeThickness =  2;

		let tween = this.game.add.tween(text);
		tween.to( { y: y-60 }, 500, "Linear", true);
		tween.onComplete.add(function(){
			text.destroy();
		}, this);
	}

	die() {
		// Play sound
		this.sounds.damage.play();
		 //  Stand still
        this.character.animations.stop();
        this.character.frame = 7;
		
	}

	update(hitPlatform) {
 		var cursors = this.game.input.keyboard.createCursorKeys();


		var distance = Phaser.Point.distance(this.game.input.activePointer.position, this.game.input.activePointer.positionDown);
		var duration = this.game.input.activePointer.duration;

		let xDiff = this.startX - this.game.input.activePointer.clientX;
		let yDiff = this.startY - this.game.input.activePointer.clientY;

		if (duration < 150 && (yDiff > 1)) {
			this.swiper(false, false, false, true)
		
		} else
		if (duration > 150) { // && duration < 250) {
			//var positionDown = this.game.input.activePointer.positionDown;
			//this.onSwipe.dispatch(this, positionDown);


			if ( Math.abs(xDiff) > Math.abs(yDiff) ) {

				if ( xDiff > 0 ) this.swiper(true)
				else 			 this.swiper(false, true)
			} else
			{
				if ( yDiff < 0 ) this.swiper(false, false, true)
				//else 			 this.swiper(false, false, false, true)

			} 

		//console.log(xDiff, yDiff, Math.abs(xDiff) > Math.abs(yDiff) , this.swipeDown, this.swipeUp)
		console.log(xDiff, yDiff, this.swipeDown, this.swipeUp, this.swipeLeft, this.swipeRight)

		}



 		 //  Reset the players velocity (movement)
	    this.character.body.velocity.x = this.game.Settings.physics.playerStandingSpeed;
	    this.character.body.gravity.y = this.game.Settings.physics.playerGravity;

        //  Move to the left	
	    if (cursors.left.isDown || this.swipeLeft) {
	        this.character.body.velocity.x = -this.game.Settings.physics.playerRunningBackwardSpeed;
	        this.character.animations.play('left');
	    }
        //  Move to the right
	    else if (cursors.right.isDown || this.swipeRight) {
	        this.character.body.velocity.x = this.game.Settings.physics.playerRunningForwardSpeed + this.game.Settings.physics.platformSpeed;
	        this.character.animations.play('right');
	    }
        //  Stand still
	    else {
	        this.character.animations.stop();
	        this.character.frame = 7;
	    }

	    // Add more gravity if the down button is pressed
	    if (cursors.down.isDown || this.swipeDown) {
	        //  Move to the right
	    	this.character.body.gravity.y = this.game.Settings.physics.playerGravity + this.game.Settings.physics.extraGravity;
	    }

	    //  Allow the player to jump if they are touching the ground.
	    if ((cursors.up.isDown || (this.swipeUp && this.mouseIsDown)) && this.character.body.touching.down && hitPlatform) {
	        this.sounds.jump.play();
	        this.character.body.velocity.y = -this.game.Settings.physics.playerJumpVelocity;
	    }

		this.hitPlatform = hitPlatform

	}

}

export default Player;