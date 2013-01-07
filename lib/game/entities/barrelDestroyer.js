ig.module(
	'game.entities.barrelDestroyer'
)
.requires(
	'impact.entity'
)
.defines(function(){

    EntityBarrelDestroyer = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
        size: {x: 32, y: 32},
        level: null,
        checkAgainst: ig.Entity.TYPE.B,
        update: function(){},

        check: function( other ) {
        	if(other instanceof EntityBarrel){
        		other.kill()
        	}
        },
    });
});