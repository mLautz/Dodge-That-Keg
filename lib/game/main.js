ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'game.levels.testLevel',
	'impact.font',
	'impact.debug.debug'
)
.defines(function(){
	MainGame = ig.Game.extend({
		instructText: new ig.Font( 'media/game1/04b03.font.png' ),
		statText: new ig.Font('media/game1/04b03.font.png'),
		showStats: false,
		statMatte: new ig.Image('media/game1/stat-matte.png'),
		gravity:300,
		respawnPosition: null,

		init: function(){
			//bind keys
			ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
			ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
			ig.input.bind(ig.KEY.X, 'jump');

			//load test level
			this.loadLevel(LevelTestLevel);
		},

		update: function(){
			//updating screen to follow player
			var player = this.getEntitiesByType(EntityPlayer)[0];
			if(player){
				this.screen.x = player.pos.x - ig.system.width/2;
				this.screen.y = player.pos.y - ig.system.height/2 - ig.system.height/4;
				if((player.accel.x > 0 || player.accel.x < 0) && this.instructText){
					this.instructText = null;
				}
			}

			this.parent();
		},

		draw: function(){
			this.parent();

			if(this.instructText){
				var x = ig.system.width/2;
				var y = ig.system.height - 20;
				this.instructText.draw('Left/Right for movement, X to jump and go up ladders.',
				 x, y, ig.Font.ALIGN.CENTER);
			}

			if(this.showStats){
				this.statMatte.draw(0,0);
				var x = ig.system.width/2;
				var y = ig. system.height/2;

				this.statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);
			}
		},

		toggleStats: function(endOfLevel){
			this.showStats = true;
		},
	});

	SplashScreen = ig.Game.extend({
		background: new ig.Image('media/game1/splash/background.png'),
		icon: new ig.Image('media/game1/splash/1GAM-icon.png'),
		logo: new ig.Image('media/game1/splash/1GAM-logo.png'),
		timer: new ig.Timer(),

		init: function(){
			this.timer.reset();
		},

		update: function(){
			if(Math.round(this.timer.delta()) > 3){
				ig.system.setGame(MainGame);
			}
		},

		draw: function(){
			this.background.draw(0,0);
			this.icon.draw(ig.system.width/2-32, ig.system.height/3);
			this.logo.draw(ig.system.width/2-384, ig.system.height/3 + 84);
		},
	});

	CompletionScreen = ig.Game.extend({

	});

	//load game w/ splash screen
	//ig.main('#canvas', SplashScreen, 60, 1080, 550, 1.5);

	//normal size
	ig.main('#canvas', MainGame, 60, 1080, 550, 1);

	//zoomed size
	//ig.main('#canvas', MainGame, 60, 810, 412, 1.5);
});