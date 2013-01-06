ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){
	EntityPlayer = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/player.png', 32, 46),
		size: {x:20, y:40},
		offset: {x:6, y:3},
		flip: false,

		//settings to draw in level editor
		_wmDrawBox: true,
		_wmDrawColor: 'rgba(255, 0, 0, 0.4)',

		maxVel: {x:80, y:140},
		friction: {x:100, y:0},
		accelGround: 400,
		accelAir: 200,
		jump: 400,

		init: function(x, y, settings){
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [1]);
			this.addAnim('run', 0.07, [0,1,2]);
		},

		update: function(){
			// move left or right
			var accel = this.standing ? this.accelGround : this.accelAir;
			if( ig.input.state('left') ) {
				this.accel.x = -accel;
				this.flip = true;
			}else if( ig.input.state('right') ) {
				this.accel.x = accel;
				this.flip = false;
			}else{
				this.accel.x = 0;
			}
			// jump
			if( this.standing && ig.input.pressed('jump') ) {
				this.vel.y = -this.jump;
				//this.jumpSFX.play();
			}

			this.parent();
		},

		draw: function(){
			this.parent();
		},

		setupAnimation: function(){
			//used for more complicated animation setting
		},
	});


});