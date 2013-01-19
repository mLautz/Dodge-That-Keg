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
		ladderCrossSpeed: 50,
		speed: 0,

		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.LITE,

		init: function(x, y, settings){
			this.parent(x, y, settings);
		},
	});
});