//==================   Button   ==================//
class Button
{
    /**
     * creates a graphical Button Object 
     * @param {HTMLElement} canvas Canvas
     * @param {GraphicText} gtext  GraphicText
     * @param {GraphicPicture} gpicnormal in state normal 
     * @param {GraphicPicture} gpichover  in state mouse over (hover)
     */
    constructor(canvas, gtext, gpicnormal, gpichover)
    {
        this.Canvas = canvas;
        this.GraphicText = gtext;
        this.PicNormal = gpicnormal;
        this.PicHover = gpichover;
        this.MouseOver = false;
        this.OffsetPt = new Point(canvas.offsetLeft, canvas.offsetTop);
        //addEventListener(eventType,  //z.B. click, touch, mouseover
        //                 handler,    //aufzurufende Funktion
        //                 useCapture) //Phase der Aktivierung ?->false 
        canvas.addEventListener("mousemove", function(e){this.onmousemove(e);}.bind(this), false);
        canvas.addEventListener("click",     function(e){this.onclick(e);    }.bind(this), false);
        this.click = undefined;
    }

    /**
     * returns a copy of this Point-object 
     */
    copy()
    {
        return new Button(this.Canvas, this.GraphicText.copy(), this.PicNormal.copy(), this.PicHover.copy());
    }

    /**
     * returns true if the mouse with coordinates x, y is over the button.
     * @param {Number} x
     * @param {Number} y
     */
    ismouseover(x, y)
    {
        var pic = (this.MouseOver)? this.PicHover: this.PicNormal;
        return pic.AARectDst.containsXY(x, y);
    }

    /**
     * only private; checks if mouse is over the button
     * @param {MouseEvent} e
     */
    onmousemove(e)
    {
        var x = e.pageX - this.OffsetPt.X;
        var y = e.pageY - this.OffsetPt.Y;
        this.MouseOver = this.ismouseover(x, y);
    }

    /**
     * set the function to call on click 
     * @param {Function} handler
     */
    setClickHandler(handler)
    { 
        this.click = handler; 
    }

    /**
     * only private; calls the handler function
     * @param {MouseEvent} e
     */
    onclick(e)
    {   
        this.onmousemove(e); 
        if (this.MouseOver) this.click(); 
    }

    /**
     * draws the button on the canvas
     * @param {HTMLElement} context
     */
    draw(context)
    {
        var gpic = (this.MouseOver)? this.PicHover: this.PicNormal;
        gpic.draw(context);
        this.GraphicText.draw(context);
    }

    /**
     * moves the button about dx and dy 
     * @param {Number} dx
     * @param {Number} dy
     */
    moveDxy(dx, dy)
    {
        this.GraphicText.Point.moveDxy(dx, dy);
        this.PicNormal.AARectDst.Point.moveDxy(dx, dy);
        this.PicHover.AARectDst.Point.moveDxy(dx, dy);
    }
}