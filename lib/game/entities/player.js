ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){
	EntityPlayer = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/game1/stickPlayer.png', 24, 43),
		size: {x:18, y:37},
		offset: {x:3, y:3},
		flip: false,
		startPosition: null,

		//settings to draw in level editor
		_wmDrawBox: true,
		_wmDrawColor: 'rgba(255, 0, 0, 0.4)',

		//physics config.
		maxVel: {x:350, y:250},
		friction: {x:200, y:0},
		accelGround: 800,
		accelAir: 600,
		gravityFactor: 3,

		//jump config/control variables
		jump: 300,
		jumpTimer: new ig.Timer(),
		jumping: false,

		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.PASSIVE,

		init: function(x, y, settings){
			this.parent(x, y, settings);
			this.startPosition = {x:x, y:y},
			this.addAnim('idle', 0.5, [0,1]);
			this.addAnim('run', 0.07, [2,3,4,5,6,7]);
			this.addAnim('jump', 1, [8]);
			this.addAnim('climb', 0.05, [9,10,11]);
		},

		update: function(){
			//kill player when fallen too far
			/*if(this.pos.y > ig.system.height){
				this.kill();
			}*/

			// move left or right
			var accel = this.standing ? this.accelGround : this.accelAir;
			if( ig.input.state('left')) {
				if(this.vel.x > 0){
					this.vel.x = 0.4 * this.vel.x;
				}
				this.accel.x = -accel;
				this.flip = true;
			}else if( ig.input.state('right')) {
				if(this.vel.x < 0){
					this.vel.x = 0.4 * this.vel.x;
				}
				this.accel.x = accel;
				this.flip = false;
			}else{
				this.accel.x = 0;
			}

			//end jump
			if(this.standing && this.jumping){
				this.jumping = false;	
			}

			// jump
			if( this.standing && ig.input.pressed('jump')) {
				this.initiateJump();
				//this.jumpSFX.play();
			}else if(ig.input.state('jump') && this.jumpTimer.delta() < 0.15){
				this.vel.y += -this.jump;
			}

			if(ig.input.released('jump')){
				jumping = false;
			}

			//set current animation
			if(!this.standing){
				this.currentAnim = this.anims.jump;
			}else if(this.vel.x !=0){
				this.currentAnim = this.anims.run;
			}else{
				this.currentAnim = this.anims.idle;
			}

			//set player facing direction
			this.currentAnim.flip.x = this.flip;	

			this.parent();
		},

		handleMovementTrace: function(res){
			//future double jump code here?

			this.parent(res);
		},

		draw: function(){
			this.parent();
		},

		setupAnimation: function(){
			//used for more complicated animation setting
		},

		kill: function(){
			this.parent();
			ig.game.respawnPosition = this.startPosition;
			this.onDeath();
		},

		onDeath: function(){
			ig.game.spawnEntity(EntityPlayer, ig.game.respawnPosition.x, ig.game.respawnPosition.y);
		},

		initiateJump: function(){
			this.jumpTimer.reset();
			this.jumping = true;
			this.vel.y = -this.jump;
		},
	});


});