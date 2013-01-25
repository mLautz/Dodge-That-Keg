ig.module(
	'game.entities.clickButton'
)
.requires(
	'impact.entity'
)
.defines(function(){

	EntityClickButton = ig.Entity.extend({
		size: {x: 64, y:64},

		init: function(x, y, settings){
			this.parent(x, y, settings);
		},

		update: function(){
		    if (ig.input.pressed('leftButton') && this.inFocus()) {
		        ig.log('clicked');
		    }
		    this.parent();
		},
		 
		inFocus: function() {
		    return (
		       (this.pos.x <= ig.input.mouse.x) &&
		       (ig.input.mouse.x <= this.pos.x + this.size.x) &&
		       (this.pos.y <= ig.input.mouse.y) &&
		       (ig.input.mouse.y <= this.pos.y + this.size.y)
		    );
		 },
	});
});