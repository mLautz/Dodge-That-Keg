ig.module(
	'game.entities.levelBoundary'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityLevelBoundary = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 250, 0, 0.7)',
        _wmScalable: true,
        size: {x: 32, y: 32},
        checkAgainst: ig.Entity.TYPE.BOTH,
        update: function(){},

        check: function( other ) {
        	if(other instanceof EntityPlayer || other instanceof EntityBarrel){
        		other.receiveDamage(20);
        	}
        },
    });
});