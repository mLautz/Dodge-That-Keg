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
		gravity:300,

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
				this.screen.y = player.pos.y - ig.system.height/2;
				if((player.accel.x > 0 || player.accel.x < 0) && this.instructText){
					this.instructText = null;
				}
			}

			this.parent();
		},

		draw: function(){
			this.parent();
		},
	});

	SplashScreen = ig.Game.extend({
		background: new ig.Image('media/splash/background.png'),
		icon: new ig.Image('media/splash/1GAM-icon.png'),
		logo: new ig.Image('media/splash/1GAM-logo.png'),
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

	//load game w/ splash screen
	//ig.main('#canvas', SplashScreen, 60, 1080, 550, 1);

	ig.main('#canvas', MainGame, 60, 1080, 550, 1);
});