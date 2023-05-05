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
AnimationLoop.prototype.start = function()
{
    this.isRunning = !this.isRunning
    if (this.isRunning) newframe(this.myloop.bind(this));
};
AnimationLoop.prototype.myloop = function()
{
    var r = this.RectToClear;
    this.Context.clearRect(r.Point.X, r.Point.Y, r.Width, r.Height);
    this.loop(); 
    if (this.isRunning) newframe(this.myloop.bind(this));
};
AnimationLoop.prototype.stop = function()
{
    this.isRunning = false;
};
