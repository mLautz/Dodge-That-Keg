ig.module(
	'game.entities.barrelSpawner'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityBarrelSpawner = ig.Entity.extend({
		size: {x:32, y:32},
		_wmDrawBox: true,
		_wmDrawColor: 'rgba(150, 150, 150,0.5)',
		spawnRate: 4,
		spawnTimer: new ig.Timer(),

		init: function(x, y, settings){
			this.parent(x, y, settings);
			this.spawnTimer.reset();
		},

		update: function(){
			if(this.spawnTimer.delta() > this.spawnRate){
				//spawn new barrel
				ig.game.spawnEntity(EntityBarrel, this.pos.x, this.pos.y, {});
				this.spawnTimer.reset();
			}
		},
	});
});