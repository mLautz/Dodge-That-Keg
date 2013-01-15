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
		spawnDelay: 0,
		xLaunch: 0,
		yLaunch: 0,
		spawnCount: 0,

		init: function(x, y, settings){
			this.parent(x, y, settings);
			this.spawnTimer.reset();
		},

		update: function(){
			if(this.spawnTimer.delta() > (this.spawnRate * this.spawnCount) + this.spawnDelay){
				//spawn new barrel
				var newBarrel = ig.game.spawnEntity(EntityBarrel, this.pos.x, this.pos.y, {});
				newBarrel.vel.y = this.yLaunch;
				newBarrel.vel.x = this.xLaunch;
				this.spawnCount++;
			}
		},
	});
});