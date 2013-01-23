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
			console.log("init'd");
			this.parent(x, y, settings);
		},

		update: function(){
		    if (ig.input.pressed('leftButton') && this.inFocus()) {
		        ig.log('clicked');
		    }
		    this.parent();
		},
		 
		inFocus: function() {
			console.log('Mouse: '+ig.input.mouse.x+','+ig.input.mouse.y);
			console.log('This: '+this.pos.x+','+this.pos.y);
			console.log('test' + 3<4);
			console.log('Checking inFocus: #1:'+this.pos.x <= ig.input.mouse.x);
			console.log('Checking inFocus: #2:'+(ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x);
			console.log('Checking inFocus: #3:'+this.pos.y <= (ig.input.mouse.y + ig.game.screen.y));
			console.log('Checking inFocus: #4:'+(ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y);
		    return (
		       (this.pos.x <= ig.input.mouse.x) &&
		       (ig.input.mouse.x <= this.pos.x + this.size.x) &&
		       (this.pos.y <= ig.input.mouse.y) &&
		       (ig.input.mouse.y <= this.pos.y + this.size.y)
		    );
		 },
	});
});