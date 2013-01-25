ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
	'impact.sound',

	'game.levels.testLevel',
	'game.levels.testLevel2',
	'game.levels.testLevel3',
	'game.levels.testLevel4',
	'game.levels.level5',
	'game.levels.andyLevel',
	'game.levels.normanLevel',
	'game.levels.level6',
	'game.levels.warpZone',

	'game.entities.clickButton',
	
	'plugins.touch-button',
	'plugins.map-size'
)
.defines(function(){
	MainGame = ig.Game.extend({
		statText: new ig.Font('media/game1/04b03.font.png'),
		showStats: false,
		statMatte: new ig.Image('media/game1/stat-matte.png'),
		gravity: 300,
		respawnPosition: null,
		levelExit: null,
		currentLevel: 'TestLevel',
		score: 1337007331,
		runTimer: null,
		gameTime: null,

		//mobile buttons
		buttonImage: new ig.Image('media/game1/arrows.png'),
		discoImage: new ig.Image('media/game1/discoButton.png'),
		discoMode: false,
		discoX: 10,
		discoY: 10,
		bouncyImage: new ig.Image('media/game1/bouncyButton.png'),
		bouncyMode: false,
		bouncyX: 74,
		bouncyY: 10,

		//disco config
		discoTimeImage: new ig.Image('media/game1/discoTime.png'),
		discoCounter: 0,
		discoFrames: 6,
		discoTimer: null,

		//sounds
		levelEnterSound: new ig.Sound('media/game1/Sounds/LevelStart.*'),
		levelCompleteSound: new ig.Sound('media/game1/Sounds/LevelComplete.*'),

		//camera dead zone config
		deadZoneX: 0,
		screenWidth: 0,

		init: function(){
			this.setControls();
			this.createFunctions();
			this.runTimer = new ig.Timer();
			this.gameTime = new ig.Timer();
			this.discoTimer = new ig.Timer();

			//set sound levels
			this.levelEnterSound.volume = 0.5;
			this.levelCompleteSound.volume = 0.5;

			//grab game window dimensions and set buffer sizes
			this.deadZoneX = ig.system.width/2 - ig.system.width/15;
			this.screenWidth = ig.system.width;
			this.deadZoneY = ig.system.height/2 - ig.system.width/20;
			this.screenHeight = ig.system.height;

			//load test level
			this.loadLevel(LevelTestLevel);
		},

		update: function(){
			//updating screen to follow player
			var player = this.getEntitiesByType(EntityPlayer)[0];
			if(player){
				//Horizontal Dead Zone
				var camX = this.screen.x;
				if((player.pos.x - camX) > (this.screenWidth - this.deadZoneX)){ this.screen.x = camX + (player.pos.x - camX) - (this.screenWidth - this.deadZoneX);}
				else if((player.pos.x - camX) < this.deadZoneX){ this.screen.x = camX + (player.pos.x - camX) - this.deadZoneX;}

				//Vertical Dead Zone
				var camY = this.screen.y;
				if((player.pos.y - camY) > (this.screenHeight - this.deadZoneY)){ this.screen.y = camY + (player.pos.y - camY) - (this.screenHeight - this.deadZoneY);}
				else if((player.pos.y - camY) < this.deadZoneY){ this.screen.y = camY + (player.pos.y - camY) - this.deadZoneY;}

				//Stop camera at left/right level bounds
				if(this.screen.x <= 0){ this.screen.x = 0;}
				else if(this.screen.x >= ig.game.backgroundMaps[0].pxWidth - this.screenWidth){ this.screen.x = ig.game.backgroundMaps[0].pxWidth - this.screenWidth;}

				//Stop camera at top/bottom level bounds
				if(this.screen.y <= 0){ this.screen.y = 0;}
				else if(this.screen.y >= ig.game.backgroundMaps[0].pxHeight - this.screenHeight){ this.screen.y = ig.game.backgroundMaps[0].pxHeight - this.screenHeight;}
			}

			if(ig.ua.mobile){
				if (ig.input.pressed('disco')) {
			        ig.game.discoMode = !ig.game.discoMode;
			        if(ig.game.discoMode){
			        	ig.game.discoTimer.reset();
			        }else{
			        	ig.game.discoTimer.pause();
			        }
			    }

				if (ig.input.pressed('bouncy')) {
				    ig.game.bouncyMode = !ig.game.bouncyMode;
				    ig.game.loadLevel(ig.game.currentLevel);
				}
			}

			if(!this.showStats){
				this.parent();
			}else{
				if(ig.input.pressed('jump') && this.levelExit.level){
					this.showStats = false;
					this.levelExit.nextLevel();
					this.parent();
				}
			}
		},

		draw: function(){
			this.parent();

			if(this.discoMode){
				//enter disco image drawing
				if(this.discoTimer.delta() > 0.6){ 
					this.discoCounter++;
					this.discoTimer.reset();
				}
				this.discoTimeImage.draw(ig.system.width/2 - 540, 0, 0, this.discoCounter%this.discoFrames * 600, 1080, 600);
			}

			if(this.showStats){
				this.drawStats();
				for(var i in this.menuButtons){
					this.menuButtons[i].draw();
				}
			}else{
				if(ig.ua.mobile){
					for(var i in this.controlButtons){
						this.controlButtons[i].draw();
					}
				}else{
					if(!this.discoMode){
						this.discoImage.draw(10, 10, 0, 0, 64, 64);
					}else{
						this.discoImage.draw(10, 10, 64, 0, 64, 64);
					}

					if(!this.bouncyMode){
						this.bouncyImage.draw(74, 10, 0, 0, 64, 64);
					}else{
						this.bouncyImage.draw(74, 10, 64, 0, 64, 64);
					}
				}
				this.statText.draw('Level Time: ' + Math.round(this.runTimer.delta()), ig.system.width-30, ig.system.height-30, ig.Font.ALIGN.RIGHT);
			}
		},

		toggleStats: function(endOfLevel){
			this.currentLevel = endOfLevel.level;
			this.levelExit = endOfLevel;
			this.showStats = true;
		},

		loadLevel: function(level){
			this.parent(level);
			this.currentLevel = level;

			//pre-rendered backgrounds for mobile devices
			if(ig.ua.mobile){
				for(var i in this.backgroundMaps){
					this.backgroundMaps[i].preRender = true;
				}
			}

			this.runTimer.reset();
			this.gameTime.unpause();
			this.levelEnterSound.play();

			//spawn disco mode and bouncy mode button entities
			var discoButton = ig.game.spawnEntity(EntityClickButton, this.discoX, this.discoY);
			discoButton.update = function(){
				if (ig.input.pressed('leftButton') && this.inFocus()) {
			        ig.game.discoMode = !ig.game.discoMode;
			        if(ig.game.discoMode){
			        	ig.game.discoTimer.reset();
			        }else{
			        	ig.game.discoTimer.pause();
			        }
			    }
			};
			var bouncyButton = ig.game.spawnEntity(EntityClickButton, this.bouncyX, this.bouncyY);
			bouncyButton.update = function(){
				if (ig.input.pressed('leftButton') && this.inFocus()) {
				    ig.game.bouncyMode = !ig.game.bouncyMode;
				    ig.game.loadLevel(ig.game.currentLevel);
				}
			};
		},

		setControls: function(){
			//bind keys
			if(!ig.ua.mobile){
				ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
				ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
				ig.input.bind(ig.KEY.SPACE, 'jump');
				ig.input.bind(ig.KEY.MOUSE1, 'leftButton');
			}else{
				var ypos = 6 * ig.system.height/8;
				this.controlButtons = [
					new ig.TouchButton('left', 40, ypos, 100, 78, this.buttonImage, 0),
					new ig.TouchButton('right', 80 + (ig.system.width/8), ypos, 100, 78, this.buttonImage, 1),
					new ig.TouchButton('jump', ig.system.width/2, 0, ig.system.width/2, ig.system.height),
					new ig.TouchButton('disco', 10, 10, 64, 64, this.discoImage),
					new ig.TouchButton('bouncy', 84, 10, 64, 64, this.bouncyImage)
				];
				this.menuButtons = [
					new ig.TouchButton('jump', ig.system.width/2 - 150, ig.system.height/3 + 130, 300, 40),
					new ig.TouchButton('restart', ig.system.width/2 - 150, ig.system.height/3 + 190, 300, 40),
				];
			}
		},

		createFunctions: function(){
			//set stats screen function to regular or mobile version
			if(ig.ua.mobile){
				this.drawStats = function(){
					if(this.levelExit.level){
						this.statMatte.draw(0,0);
						var x = ig.system.width/2;
						var y = ig.system.height/3;

						this.statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);

						var levelTime = '';
						if(this.runTimer.delta()/60 >= 1){
							levelTime += Math.round(this.runTimer.delta()/60) + ' minutes & ';
						}
						levelTime += Math.round(this.runTimer.delta()%60) + ' seconds.';

						this.statText.draw('Level Time: ' + levelTime, x, y + 50, ig.Font.ALIGN.CENTER);
						this.statText.draw('Touch here to continue', x, y + 150, ig.Font.ALIGN.CENTER);
					} else {
						this.statMatte.draw(0,0);
						var x = ig.system.width/2;
						var y = ig.system.height/2;

						var finalTime = '';
						if(this.runTimer.delta()/60 >= 1){
							finalTime += Math.round(this.gameTime.delta()/60) + ' minutes ';
						}
						finalTime += Math.round(this.gameTime.delta()%60) + ' seconds.';

						this.statText.draw('Game Complete!', x, y, ig.Font.ALIGN.CENTER);
						this.statText.draw('Completion time: ' + finalTime, x, y + 50, ig.Font.ALIGN.CENTER);
					}
				};
			} else {
				this.drawStats = function(){
					if(this.levelExit.level){
						this.statMatte.draw(0,0);
						var x = ig.system.width/2;
						var y = ig.system.height/3;

						this.statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);

						var levelTime = '';
						if(this.runTimer.delta()/60 >= 1){
							levelTime += Math.round(this.runTimer.delta()/60) + ' minutes ';
						}
						levelTime += Math.round(this.runTimer.delta()%60) + ' seconds.';

						this.statText.draw('Level Time: ' + levelTime, x, y + 50, ig.Font.ALIGN.CENTER);
						this.statText.draw('Press space to continue.', x, y + 150, ig.Font.ALIGN.CENTER);
					} else {
						this.statMatte.draw(0,0);
						var x = ig.system.width/2;
						var y = ig.system.height/2;

						var finalTime = '';
						if(this.runTimer.delta()/60 >= 1){
							finalTime += Math.round(this.gameTime.delta()/60) + ' minutes ';
						}
						finalTime += Math.round(this.gameTime.delta()%60) + ' seconds.';

						this.statText.draw('Game Complete!', x, y, ig.Font.ALIGN.CENTER);
						this.statText.draw('Completion time: ' + finalTime, x, y + 50, ig.Font.ALIGN.CENTER);
						this.statText.draw('Created by: @mLautz (mattlautz.us)', ig.system.width, ig.system.height - 100, ig.Font.ALIGN.RIGHT);
						this.statText.draw('Sound contributed by: @Beardsounds (beardsounds.com)', ig.system.width, ig.system.height - 50, ig.Font.ALIGN.RIGHT);
					}
				};
			}
		},
	});

	SplashScreen = ig.Game.extend({
		background: new ig.Image('media/game1/splash/background.png'),
		instructText: new ig.Font( 'media/game1/04b03.font.png' ),
		icon: new ig.Image('media/game1/splash/1GAM-icon.png'),
		logo: new ig.Image('media/game1/splash/1GAM-logo.png'),
		timer: new ig.Timer(),

		init: function(){
			this.timer.reset();
		},

		update: function(){
			if(Math.round(this.timer.delta()) > 2){
				ig.system.setGame(InstructionScreen);
			}
		},

		draw: function(){
			this.background.draw(0,0);
			this.icon.draw(ig.system.width/2-32, ig.system.height/3);
			this.logo.draw(ig.system.width/2-384, ig.system.height/3 + 84);
			this.instructText.draw('Game #1 - Jan. 2013', ig.system.width - 20, ig.system.height - 40, ig.Font.ALIGN.RIGHT);
		},
	});

	InstructionScreen = ig.Game.extend({
		background: new ig.Image('media/game1/splash/background.png'),
		gameSplash: new ig.Image('media/game1/splash/DTKsplash.png'),
		instructText: new ig.Font( 'media/game1/04b03.font.png' ),

		init: function(){
			if(!ig.ua.mobile){
				ig.input.bind(ig.KEY.SPACE, 'continue');
			} else {
				new ig.TouchButton('continue', 0, 0, ig.system.width, ig.system.height);
			}
		},

		update: function(){
			if(ig.input.pressed('continue')){
				ig.system.setGame(MainGame);
			}
		},

		draw: function(){
			this.background.draw(0,0);
			this.gameSplash.draw(ig.system.width/2 - 400, ig.system.height/3 - 175);
			if(!ig.ua.mobile){
				var x = ig.system.width/2;
				var y = ig.system.height - 160;
				this.instructText.draw('Left/Right arrows for movement, Spacebar to jump and go up ladders.', x, y, ig.Font.ALIGN.CENTER);
				this.instructText.draw('Have patience and jump carefully. Press space to begin!', x, y+ 50, ig.Font.ALIGN.CENTER);
			} else {
				var x = ig.system.width/2;
				var y = ig.system.height - 160;
				this.instructText.draw('Left/Right arrows for movement.', x, y, ig.Font.ALIGN.CENTER);
				this.instructText.draw('Touch the right side of the screen to jump and go up ladders.', x, y + 40, ig.Font.ALIGN.CENTER);
				this.instructText.draw('Have patience and jump carefully. Tap to begin!', x, y + 100, ig.Font.ALIGN.CENTER);
			}
		},
	});

	if(ig.ua.mobile){
		ig.Sound.enabled = false; //disable mobile device sound
	}

	//load game w/ splash screen
	if(!ig.ua.mobile){
		ig.main('#canvas', SplashScreen, 60, 1080, 600, 1);
		//ig.main('#canvas', SplashScreen, 60, 720, 400, 1.5);
	}else{
		ig.main('#canvas', SplashScreen, 60, ig.ua.viewport.width, ig.ua.viewport.height, 1);
	}

	//normal size
	//ig.main('#canvas', MainGame, 60, 1080, 600, 1);
});