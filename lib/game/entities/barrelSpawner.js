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
		_wmBoxColor: 'rgba(150, 150, 150,0.5)',
		spawnRate: 4,
		spawnTimer: new ig.Timer(),
		spawnDelay: 0,
		xLaunch: 0,
		yLaunch: 0,
		spawnedBounciness: 0,
		limitedVelocity: null,

		randFactor: 0,
		lastSpawn: 0,
		currDelay: 0,

		init: function(x, y, settings){
			this.parent(x, y, settings);
			if(this.randFactor > 10){
				this.randFactor = 10;
			}
			if(this.randFactor < 0){
				this.randFactor = 0;
			}
			this.spawnTimer.reset();
			this.lastSpawn = this.spawnDelay;
		},

		update: function(){
			if(this.spawnTimer.delta() > this.lastSpawn + this.spawnRate + this.currDelay){
				//spawn new barrel
				var newBarrel = ig.game.spawnEntity(EntityBarrel, this.pos.x, this.pos.y, {});
				newBarrel.vel.y = this.yLaunch;
				newBarrel.vel.x = this.xLaunch;
				if(this.spawnedBounciness > 0){ newBarrel.bounciness = this.spawnedBounciness;}
				if(this.limitedVelocity!=null){ newBarrel.maxVel = this.limitedVelocity;}
				this.lastSpawn = this.spawnTimer.delta();

				if(this.randFactor > 0){
					this.currDelay = this.spawnRate * (Math.random() * this.randFactor * 0.05);
					if(Math.random()<0.5){
						this.currDelay *= -1;
					}
				}
			}
		},
	});
});