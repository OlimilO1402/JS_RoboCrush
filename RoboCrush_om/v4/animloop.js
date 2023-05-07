//==================   AnimationLoop   ==================//
class AnimationLoop
{
    /**
     * creates an AnimationLoop object
     * @param {Function}    loopfunction
     * @param {HTMLElement} context
     * @param {AARect}      recttoclear
     */
    constructor(loopfunction, context, recttoclear)
    {
        this.loop = loopfunction.bind(this);
        this.Context = context;
        this.RectToClear = recttoclear;
        this.isRunning  = false;
        newframe = (function()
        {
            return window.requestAnimationFrame       ||
                   window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame    ||
                   window.oRequestAnimationFrame      ||
                   window.msRequestAnimationFrame     ||
                   function(callback) 
                   {
                        window.setTimeout(callback, 1000 / 60);
                   };              
        })();    
    }

    /**
     * starts the animation-loop, pauses at second time 
     */
    start()
    {
        this.isRunning = !this.isRunning;
        if (this.isRunning) newframe(this.myloop.bind(this));
    }
    
    /**
     * only private; the loop 
     */
    myloop()
    {
        var r = this.RectToClear;
        this.Context.clearRect(r.Point.X, r.Point.Y, r.Width, r.Height);
        this.loop(); 
        if (this.isRunning) newframe(this.myloop.bind(this));
    }
    
    /**
     * pauses the animation loop 
     */
    stop()
    {
        this.isRunning = false;
    }
}
