//==================   AnimationLoop   ==================//
/**
 * creates an AnimationLoop object
 * @param {Function} loopfunction
 * @param {HTMLElement} context
 * @param {AARect} recttoclear
 */
function AnimationLoop(loopfunction, context, recttoclear)
{
    this.loop = loopfunction.bind(this);
    this.Context = context;
    this.RectToClear = recttoclear;
    this.isRunning  = false;
    newframe = (function()
	{
		return window.requestAnimationFrame		  ||
			   window.webkitRequestAnimationFrame ||
			   window.mozRequestAnimationFrame	  ||
			   window.oRequestAnimationFrame	  ||
			   window.msRequestAnimationFrame	  ||
			   function(callback) 
			   {
					window.setTimeout(callback, 1000 / 60);
			   };			   
	})();    
}
/**
 * starts the animation-loop, pauses at second time 
 */
AnimationLoop.prototype.start = function()
{
    this.isRunning = !this.isRunning;
    if (this.isRunning) newframe(this.myloop.bind(this));
};
/**
 * only private; the loop 
 */
AnimationLoop.prototype.myloop = function()
{
    var r = this.RectToClear;
    this.Context.clearRect(r.Point.X, r.Point.Y, r.Width, r.Height);
    this.loop(); 
    if (this.isRunning) newframe(this.myloop.bind(this));
};
/**
 * pauses the animation loop 
 */
AnimationLoop.prototype.stop = function()
{
    this.isRunning = false;
};
