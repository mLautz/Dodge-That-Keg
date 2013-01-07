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

		_wmDrawBox: true,
		_wmDrawColor: 'rgba(0,255,255,0.5)',

		maxVel: {x:160, y:200},
		friction: {x:10, y:0},
		accelGround: 300,
		accelAir: 300,
		speed: 80,

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
		},

		update: function(){
			if(this.vel.x > 0){
				this.flip = false;
				this.currentAnim = this.anims.rolling;
			}else if(this.vel.x < 0){
				this.flip = true;
				this.currentAnim = this.anims.rolling;
			}else if(this.vel.x == 0){
				this.currentAnim = this.anims.idle;
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
			if(other.vel.x > this.vel.x && this.vel.x >= 0){
				this.vel.x = other.vel.x;
				beingPushed = true;
				this.pushTimer.reset();
			}else if(other.vel.x < this.vel.x && this.vel.x <=0){
				this.vel.x = other.vel.x;
				beingPushed = true;
				this.pushTimer.reset();
			}else if(this.vel.x > 100 || this.vel.x < -100){
				if(this.pushTimer.delta() < 0.4){
					beingPushed = false;
				}else{
					other.receiveDamage(10, this);
				}
			}else{
				beingPushed = false;
				other.vel.x = this.vel.x;
				this.vel.x = this.vel.x * 0.9;
			}
		},
	});
});