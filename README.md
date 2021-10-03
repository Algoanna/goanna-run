<img src="/static/assets/images/screenshot.png" height="512"/>

# About goanna-run
- This platform game was originally made for a wedding website, and we've forked it and integrated Algorand with it, while keeping it opensource. 
- It's a really addictive game, that we've made even cooler by auctioning NFT's through player performance. If a player scores in the top 3, they can sign a TX in myalgo wallet. Then they receive the NFT. :) 
- This NFT will have a clawback address. If another player takes their position on the leaderboard the NFT is transferred to their wallet! 
- This project can serve as an example project for other Algorand games. You can study and observe how typical game and blockchain building blocks are implemented.
- The code is structured in a self explanatory way, it is well commented; check out the repository and try to discover what's in there. 
- It's amazing what you can achieve with a small footprint of code with **Phaser** and **Algorand**!

## Game features
- Arcade physics, collision detection
- Use of sprites, tiles, advanced animation, text effects
- Collect coins, kill enemies
- Endless gameplay (platforms, coins and enemies are generated on the fly)
- Main menu, credits, "game over" and high score screens
- User input through text boxes 
- Music and game sounds (ability to mute all sounds)
- Web service calls (get the list of TOP 10 player, save score)
- Achievements (e.g. "You have traveled 10.000 pixels")
- Multiple characters (groom, bride)
- Parallax background

## Technology stack
- npm, gulp
- ES6, babelify, browserify
- Phaser, jquery, lodash 

# How to build and run the game

1. Navigate to the root folder 
2. Type in the command line `npm install`
3. Then `npm start`
