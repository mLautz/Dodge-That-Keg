ig.module(
	'game.entities.ladder'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityLadder = ig.Entity.extend({
		size: {x:28, y:32},
		offset: {x:2, y:0},
		_wmDrawBox: true,
		_wmBoxColor: 'rgba(150, 150, 150, 0.6)',
		_wmScalable: true,
		ladderSpeed: 130,
		ladderCrossSpeed: 65,
		speed: 0,

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.LITE,

		init: function(x, y, settings){
			this.parent(x, y, settings);
		},

		update: function(){
			var player = ig.game.getEntitiesByType(EntityPlayer)[0];
			if(player){
				player.canClimb = false; //reset every frame
			}
		},

		check: function(other){ //needs some kind of climbing animation
			if(other instanceof EntityPlayer){
				if(!other.standing){
					if(ig.input.state('left')){
						other.vel.x = -this.ladderCrossSpeed;
					}else if(ig.input.state('right')){
						other.vel.x = this.ladderCrossSpeed;
					}
				}
				if(ig.input.state('jump')){
					other.vel.y = -this.ladderSpeed;
				}
			}
		},
	});
});