ig.module(
	'game.entities.barrel'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityBarrel = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/game1/barrel.png', 32, 32),
		size: {x:22, y:22},
		offset: {x:5, y:5},
		flip:false,

		//bounciness: 1,//this adds fun!

		_wmDrawBox: true,
		_wmBoxColor: 'rgba(0,255,255,0.5)',

		maxVel: {x:450, y:600},
		friction: {x:0, y:0},
		accelGround: 600,
		accelAir: 600,
		speed: 120,

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,
		beingPushed: false,
		pushTimer: new ig.Timer(),

		init: function(x, y, settings){
			this.parent(x, y, settings);
			//add animation loading
			this.addAnim('rolling', 0.15, [0,1,2,3]);
			this.addAnim('idle', 1, [0]);
			this.addAnim('rollingDisco', 0.15, [4,5,6,7]);
			this.addAnim('idleDisco', 1, [4]);

			if(ig.game.bouncyMode){
				this.bounciness = 1;
			}
		},

		update: function(){
			if(this.vel.x > 0){
				this.flip = false;
				if(!ig.game.discoMode){
					this.currentAnim = this.anims.rolling;
				}else{
					this.currentAnim = this.anims.rollingDisco;
				}
			}else if(this.vel.x < 0){
				this.flip = true;
				if(!ig.game.discoMode){
					this.currentAnim = this.anims.rolling;
				}else{
					this.currentAnim = this.anims.rollingDisco;
				}
			}else if(this.vel.x == 0){
				if(!ig.game.discoMode){
					this.currentAnim = this.anims.idle;
				}else{
					this.currentAnim = this.anims.idleDisco;
				}
			}

			//set barrel facing direction
			this.currentAnim.flip.x = this.flip;

			this.parent();
		},

		handleMovementTrace: function(res){
			this.parent(res);
			//turn back when colliding with a wall
			if(res.collision.x){
				this.flip = !this.flip;
			}
		},

		check: function(other){
			if(other instanceof EntityPlayer){
				other.receiveDamage(10);
			}
		},
	});
});