import PoppingHeartAnimation from 'animations/PoppingHeart';
import Menu from 'objects/Menu';
import SoundControl from 'objects/SoundControl';
import MyAlgoWallet from '@randlabs/myalgo-connect';

const token = { 'X-API-Key': 'WLUxNDi8N27STHWA3AhuD7FHGPE12nstCBjt5zWj' }

//const baseServer = 'https://mainnet-algorand.api.purestake.io/ps2' // testnet
//const assetId = 390879489;
const baseServer = 'https://testnet-algorand.api.purestake.io/ps2' // testnet
const assetId = 40711649;

const port = ''

const connection = new MyAlgoWallet();
const algodClient = new algosdk.Algodv2(token, baseServer, port);

							// Function Borrowed from Algorand Inc.
const waitForConfirmation = async function (algodClient, txId, cb) {
	let lastround = (await algodClient.status().do())['last-round'];
	 while (true) {
		const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
		if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
		  //Got the completed Transaction
		  console.log('Transaction confirmed in round ' + pendingInfo['confirmed-round']);
		  cb();
		  break;
		}
		lastround++;
		await algodClient.statusAfterBlock(lastround).do();
	 }
 };

class MainMenu extends Phaser.State {

	create() {		
		// Set the game background colour
		//this.game.stage.backgroundColor = '#8e8869';
		this.game.stage.backgroundColor = '#000000';
		this.game.renderer.renderSession.roundPixels = true;

		this.createHeader();
		this.createFooter();
		this.createMenu();


    	this.playerMenu = null;
		this.hasOpted = false;

    	// Sound related stuff
    	this.soundControl = new SoundControl(this.game);
    	this.music = this.game.add.audio('menu',this.game.Settings.musicVolume,true);
    	this.music.play();
    }

    checkOptin(address) {

			return algodClient.accountInformation(address).do().then(function (data) {

				var assets = [];

				if (typeof(data.assets) != 'undefined') {
					assets = data.assets.filter(asset => asset['asset-id'] == assetId);
					this.hasOpted = assets.length > 0
				}

				if (this.hasOpted) return true;

				algodClient.getTransactionParams().do().then(function (params) {

					console.log('params', params)

					const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
						suggestedParams: {
							...params,
							fee: 1000,
							flatFee: true,
						},
						from: address,
						to: address,
						assetIndex: assetId,
						amount: 0 
						//note: note,
					});
					

					var game = this.game;
					var playerMenu = this.playerMenu;
					var mainMenu = this.mainMenu;
					var state = this.state;
					connection.signTransaction(txn.toByte()).then(function (signedTxn) {

						console.log(signedTxn.blob)

						algodClient.sendRawTransaction(signedTxn.blob).do().then(function (response) {


							waitForConfirmation(algodClient, response.txId, function () {
									console.log('confirmed')
				                    this.hasOpted = true;
									localStorage.setItem("address", address)

							}.bind(this));  


						}.bind(this)).catch(function (err) {

							if (playerMenu)
								playerMenu.destroy();

							if (mainMenu)
								mainMenu.destroy();

							var confirmText = game.add.text(game.width/2, 225,'Sorry, you need some Algorand to play');
							confirmText.anchor.set(0.5);
							confirmText.align = 'center';
							confirmText.font = 'arcade';
							confirmText.fontSize = 30;
							confirmText.fill = '#FFFFFF';
							confirmText.stroke = '#403511';
							confirmText.strokeThickness = 2;

							setTimeout(function () { 

    						   state.start('HighScores');

							}, 3000)
						})

					}.bind(this)) 



				}.bind(this));



			}.bind(this))

    }

	connectWallet() {

		if (! this.game.Settings.playerWallet)	{

			connection.connect()
						.then(function(accounts) {
							this.game.Settings.playerWallet = accounts[0].address
							this.mainMenu.destroy();
							this.createMenu();
						}.bind(this))
						.catch(function (err) {
							console.log('error', err);
							//this.state.start('Main');
							// Error
						}.bind(this)); 


		} 

	}

    choosePlayer() {

		var play = function (address) {
			// Accounts is an array that has all public addresses shared by the user
			//alert(accounts[0].address)

			this.checkOptin(address).then(function (ok) {
				console.log('checked optin', this.hasOpted)

				this.mainMenu.destroy();
				let playerMenuOptions = {
					'title' : '- choose player -'
					,'items': [
						{
							'label'    : 'Algoanna'
							,'callback': _.bind(function(){
								this.game.Settings.characterType = 'bride';
								if (this.hasOpted)
									this.chooseName();
								else 
									this.checkOptin(address);
							},this)
						}
						,{
							'label'    : 'Flamingoanna'
							,'callback': _.bind(function(){
								this.game.Settings.characterType = 'groom';
								if (this.hasOpted)
									this.chooseName();
								else 
									this.checkOptin(address);
							},this)
						}
					]
				};    	
				this.playerMenu = new Menu(playerMenuOptions,this.game);

			}.bind(this))

		}.bind(this)

		var playerName = localStorage.getItem("name");
		if (playerName)
			this.game.Settings.playerName = playerName;
		var playerAddress = localStorage.getItem("address");
		if (playerAddress)
			this.game.Settings.playerWallet = playerAddress;

		if (! this.game.Settings.playerWallet)	{

			connection.connect()
						.then(function(accounts) { play(accounts[0].address) })
						.catch(function (err) {
							console.log('error', err);
							//this.state.start('Main');
							// Error
						}.bind(this)); 


		} else play(this.game.Settings.playerWallet);


    }
    chooseName() {
		const actionOnClick = function (label) {
			return function() {

				if (input.value) {
					console.log('name chosen', input.value)
					this.game.Settings.playerName = input.value;
					localStorage.setItem("name", input.value)
					this.startGame();
				}
			}
		}
    	// Destroy prevoius menu
    	this.playerMenu.destroy();


		var playerName = localStorage.getItem("name")
		if (playerName)
			this.game.Settings.playerName = playerName

    	let inputWidth = 200;
    	var input = this.game.add.inputField(this.game.width/2-inputWidth/2, 250,{
		    font: '30px arcade',
		    fill: '#212121',
		    width: inputWidth,
		    padding: 10,
		    borderWidth: 3,
		    borderColor: '#0b77a5',
		    borderRadius: 4,
		    placeHolder: 'Type your name',
		});
		input.setText(this.game.Settings.playerName);
		input.startFocus();

		var inputLabel = this.game.add.text(this.game.width/2, 230,'- Enter your name and hit ENTER -');
	    inputLabel.anchor.set(0.5);
	    inputLabel.align = 'center';
	    inputLabel.font = 'arcade';
	    inputLabel.fontSize = 25;
	    inputLabel.fill = '#FFFFFF';

	    /*var nameDescription = this.game.add.text(this.game.width/2, 340,'this is required');
	    nameDescription.anchor.set(0.5);
	    nameDescription.align = 'center';
	    nameDescription.font = 'arcade';
	    nameDescription.fontSize = 25;
	    nameDescription.fill = '#504c39'; */

		var button = this.game.add.button(this.game.width/2-80, 320, '', (actionOnClick().bind(this)), this, 2, 1, 0);
		button.width = 160
		let text = this.game.add.text(this.game.width/2, 330,'Enter Game');
		text.anchor.set(0.5);
		text.align = 'center';
		text.font = 'arcade';
		text.fontSize = 25;
		text.fill = '#FFFFFF';
		text.strokeThickness = 0;


	    // Register 
	    this.game.input.keyboard.onUpCallback = _.bind(function(e){
			if(e.keyCode == Phaser.Keyboard.ENTER && input.value) {
	    		this.game.Settings.playerName = input.value;
				this.startGame();
			}
		},this);


    }

    showCredits() {
    	this.state.start('Credits');
    }

    showHighScores() {
    	this.state.start('HighScores');
    }

    startGame() {
    	this.state.start('Main');
    }

	shutdown() {
		this.mainMenu.destroy();
		this.music.destroy();
	}

	createMenu() {

		var label = 'Connect Wallet';
		var label_cb = this.connectWallet;

		if (this.game.Settings.playerWallet)	{
			label = 'Start Game';
			label_cb = this.choosePlayer;
		}


	   	let mainMenuOptions = {
	   		'title' : '- use arrow keys to move -\n (please disable popup blockers)\n'
	   		,'items' : [
	    		{
					'label'    : label
					,'callback': _.bind(label_cb,this)
	    		} /*
	    		,{
					'label'    : 'Start Game'
					,'enabled': false
					,'callback': _.bind(function () { this.choosePlayer() },this)
	    		} */
	    		,{
					'label'    : 'High Scores'
					,'callback': _.bind(this.showHighScores,this)
	    		}
	    		,{
					'label'    : 'Credits'
					,'callback': _.bind(this.showCredits,this)
	    		}
	    	]	   	    	
	   	}
    	this.mainMenu = new Menu(mainMenuOptions,this.game);

	}

	createHeader() {
		var headerOffset = 80;

		// Create left hearth and animate it
		let leftHeart = this.game.add.sprite(this.game.width/2-150, headerOffset+5, 'heart');
		let leftHeartAnimation = new PoppingHeartAnimation(leftHeart,this.game).animate();

		// Create right hearth and animate it
		let rightHeart = this.game.add.sprite(this.game.width/2+110, headerOffset+5, 'heart');
		let rightHearthAnimation = new PoppingHeartAnimation(rightHeart,this.game).animate();

		// Add bride and groom images to the logo
		//var bride = this.game.add.image(this.game.width/2-170, headerOffset-5, 'brideLarge');
		//var groom = this.game.add.image(this.game.width/2+100, headerOffset-5, 'groomLarge');

		/*
		// Add ALGOANNA text
		var algoannaText = this.game.add.text(this.game.width/2+ 10, headerOffset,'     GOANNA');
	    algoannaText.anchor.set(0.5);
	    algoannaText.align = 'center';
	    algoannaText.font = 'arcade';
	    algoannaText.fontSize = 50;
	    algoannaText.fill = '#FED345';

		// Add RUN text
	    var algoannaText = this.game.add.text(this.game.width/2 + 10, headerOffset + 35,'  RUN');
	    algoannaText.anchor.set(0.5);
	    algoannaText.align = 'center';
	    algoannaText.font = 'arcade';
	    algoannaText.fontSize = 120;
	    algoannaText.fill = '#403511';
		*/
		var goannaRun = this.game.add.sprite(this.game.width/2-195, headerOffset-30, 'goannaRun')
	}

	createFooter() {
		return;

		var firstLine = "Copyright © 2021 - Algorand.AI";
		var secondLine = "Made for Algoanna.com by (DeadZen/@zenstyle) with love";
	    var footerHeight = 100;
		
	    var graphics = this.game.add.graphics(0, 0);
	    graphics.beginFill(0xF99601);    
	    graphics.lineStyle(2, 0xF99601, 1);
	    graphics.drawRect(0, this.game.world.height-footerHeight, this.game.width, footerHeight);
	    graphics.endFill();


		var firstLineText = this.game.add.text(this.game.width/2+15, this.game.world.height-footerHeight+30,firstLine);
	    firstLineText.anchor.set(0.5);
	    firstLineText.align = 'center';
	    firstLineText.font = 'arcade';
	    firstLineText.fontSize = 20;
	    firstLineText.fill = '#FFFFFF';
	    firstLineText.strokeThickness = 0;

	    var secondLineText = this.game.add.text(this.game.width/2+15, this.game.world.height-footerHeight+50,secondLine);
	    secondLineText.anchor.set(0.5);
	    secondLineText.align = 'center';
	    secondLineText.font = 'arcade';
	    secondLineText.fontSize = 20;
	    secondLineText.fill = '#FFFFFF';
	    secondLineText.strokeThickness = 0;
	}
}

export default MainMenu;
