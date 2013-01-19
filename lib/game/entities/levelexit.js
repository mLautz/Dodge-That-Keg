ig.module(
	'game.entities.levelexit'
)
.requires(
	'impact.entity'
)
.defines(function(){

    EntityLevelexit = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
        size: {x: 32, y: 32},
        level: null,
        currentLevel: null,
        checkAgainst: ig.Entity.TYPE.A,
        update: function(){},

        check: function( other ) {
        	if(other instanceof EntityPlayer){
                ig.game.runTimer.pause();
                ig.game.gameTime += Math.round(ig.game.runTimer.delta());
                this.currentLevel = ig.game.currentLevel;
        		ig.game.toggleStats(this);
                ig.game.levelCompleteSound.play();
        	}
        },

        nextLevel: function(){
        	if( this.level ) {
        		var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
        		 return a.toUpperCase() + b;});
        		ig.game.loadLevelDeferred( ig.global['Level'+levelName] );
                //if you are debuggin here.... don't forget to add the level to main!
        	}
        },
    });
});