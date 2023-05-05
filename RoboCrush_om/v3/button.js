//==================   Button   ==================//
function Button(canvas, gtext, gpicnormal, gpichover)
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
Button.prototype.copy = function()
{
    return new Button(this.Canvas, this.GraphicText.copy(), this.PicNormal.copy(), this.PicHover.copy());
};
Button.prototype.ismouseover = function(x, y)
{
    var pic = (this.MouseOver)? this.PicHover: this.PicNormal;
    return pic.AARectDst.containsXY(x, y);
};
Button.prototype.onmousemove = function(e)
{
    var x = e.pageX - this.OffsetPt.X;
    var y = e.pageY - this.OffsetPt.Y;
    this.MouseOver = this.ismouseover(x, y);
};
Button.prototype.setClickHandler = function(handler)
{ 
    this.click = handler; 
};
Button.prototype.onclick = function(e)
{	
    this.onmousemove(e); 
    if (this.MouseOver) this.click(); 
};
Button.prototype.draw = function(context)
{
    var gpic = (this.MouseOver)? this.PicHover: this.PicNormal;
    gpic.draw(context);
    this.GraphicText.draw(context);
};
Button.prototype.moveDxy = function(dx, dy)
{
    this.GraphicText.Point.moveDxy(dx, dy);
	this.PicNormal.AARectDst.Point.moveDxy(dx, dy);
	this.PicHover.AARectDst.Point.moveDxy(dx, dy);
};
