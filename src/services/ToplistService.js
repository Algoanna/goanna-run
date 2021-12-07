import Settings from './../settings';

class ToplistService {

	saveScore(playerName,score, address, game) {
		// If the name of the player is empty, we do not save it to the toplist
		if (_.isEmpty(playerName)) {
			return;
		}

		console.log('saving your score', playerName, score, address, game)

			//algodClient.getAssetByID(assetId).do().then(console.log)

			$.post(Settings.urls.saveScore,{
				'name' : playerName
				,'address' : address
				,'score' : score
			}).done(function(data) {

				if (data.score != 'high') return

				(async () => {
					try {
						//const signedTxn = await connection.signTransaction(txn);
						//const note = new Uint8Array(Buffer.from('Hello World', 'utf8'));

						console.log('has opted in')
						$.post(Settings.urls.saveScore,{
							'name' : playerName
							,'address' : address
							,'txid' : 'n/a'
						}).done(function(data) {

							console.log('opted data', data)
						})

						var confirmText = game.add.text(game.width/2, 225,'You WON the NFT with that High Score!');
						confirmText.anchor.set(0.5);
						confirmText.align = 'center';
						confirmText.font = 'arcade';
						confirmText.fontSize = 30;
						confirmText.fill = '#FFFFFF';
						confirmText.stroke = '#403511';
						confirmText.strokeThickness = 2;

						//setTimeout(function () { confirmText.destroy() }, 4000);


					} catch(err) {
						console.error(err); 
					}
				})();

			});
		 
	}

	/**
	 * Call your webservice to get the top10 player
	 * Something like this: return $.get(Settings.urls.getTop10);
	 */
	getTop10() {

	    var body;
		$.get({url: Settings.urls.getTop10, async: false}).done(function(data) {

			body = data.slice(0, 10)
			console.log()
		})
		return body;
	}
}

export default new ToplistService();