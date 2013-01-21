ig.module( 
    'plugins.map-size' 
)
.requires(
    'impact.map'
)
.defines(function(){

	ig.Map.inject({
	    init: function( tilesize, data ) {
	        this.parent( tilesize, data );
	        this.pxWidth = this.width * tilesize;
	        this.pxHeight = this.height * tilesize;
	    }
	});
});