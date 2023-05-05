/**
 * @author Oliver Meyer
 */
//var version='0.0.1';
//var is_playing = false;

function init()
{
	var GElems = new GraphicElements();
	
	var Sprt = new SpritePic("images/bg_sprite.png");	
	var bgRectSrc = new AARect(Point.ORIGIN, 800, 600);
	var bgRectDst = new AARect(Point.ORIGIN, 800, 600);
	var GBmp = new SpritePart(Sprt, bgRectSrc, bgRectDst);
	GElems.add(GBmp);

	var apnt1 = new Point(10, 15);
	var apnt2 = new Point(50, 45);
	alert(apnt1.distanceTo(apnt2));

	var cnt = new Point(150, 150);
	var Circl = new Circle(cnt, 50);
	var pc = new Point(160, 170);
	alert(Circl.isInside(pc));
	alert(Circl);
	
	var arect = new AARect(apnt1, 150, 100);
	var s = " is " + ((arect.isInside(apnt2))?" ":"not ") + "inside";
	alert(apnt2 + s + " of " + arect);
	
	var GRect = GElems.add(new GraphicAARect("red", "blue", arect));
	
	var GCrcl = GElems.add(new GraphicCircle("black", "green"), Circl);
	var GPnt = GElems.add(new GraphicPoint("black", "red", apnt2));
	
	background_canvas = document.getElementById('background_canvas');
	background_ctx = background_canvas.getContext('2d');
	main_canvas = document.getElementById('main_canvas');
	main_ctx = main_canvas.getContext('2d');
	GElems.draw(main_ctx);
	
}


function GraphicElement(penColor, fillColor)
{
	this.PenColor = penColor;
	this.FillColor = fillColor;
}
GraphicElement.prototype.draw = function(context)
{};
function GraphicElements()
{
	this.List = new Array();
}
GraphicElements.prototype.add = function(gElement)
{
	this.List[this.List.length] = gElement;
	return gElement;
};
GraphicElements.prototype.draw = function(context)
{
	for (i=0; i<this.List.length; i++)
	{
		this.List[i].draw(context);
	}
};
function GraphicPoint(penColor, fillColor, point)
{
	GraphicElement.call(this, penColor, fillColor);
	this.P = point;
}
GraphicPoint.prototype = new GraphicElement();
GraphicPoint.prototype.constructor = GraphicPoint();
GraphicPoint.prototype.draw = function(context)
{
	//eine kleinen Knödel malen
	var c = new Circle(this.P, 5);
	var node = new GraphicCircle(this.PenColor, this.FillColor, c);
	node.draw(context);
/*
	context.beginPath();
	if (this.FillColor != undefined) 
	{
		context.fillStyle = this.FillColor;
		context.arc(this.P.X, this.P.Y, 5, 0, 2 * Math.PI);
		context.fill();
	}
	context.beginPath();
	if (this.PenColor != undefined) 
	{
		context.strokeStyle = this.PenColor;
		context.arc(this.P.X, this.P.Y, 5, 0, 2 * Math.PI);
		context.stroke();
	}
	*/
};
function GraphicAARect(penColor, fillColor, aarect)
{
	GraphicElement.call(this, penColor, fillColor);
	this.Rect = aarect;
}
GraphicAARect.prototype = new GraphicElement();
GraphicAARect.prototype.constructor = GraphicAARect();
GraphicAARect.prototype.draw = function(context)
{
	if (this.FillColor != undefined)
	{
		context.fillStyle = this.FillColor;
		context.fillRect(this.Rect.P.X, this.Rect.P.Y, this.Rect.Width, this.Rect.Height);
	}
	if (this.PenColor != undefined)
	{
		context.strokeStyle = this.PenColor;
		context.strokeRect(this.Rect.P.X, this.Rect.P.Y, this.Rect.Width, this.Rect.Height);			
	}
};
function GraphicCircle(penColor, fillColor, circle)
{
	GraphicElement.call(this, penColor, fillColor);
	this.Circle = circle;
}
GraphicCircle.prototype = new GraphicElement();
GraphicCircle.prototype.constructor = GraphicCircle();
GraphicCircle.prototype.draw = function(context)
{
	context.beginPath();
	if (this.FillColor != undefined) 
	{
		context.fillStyle = this.FillColor;
		context.arc(this.Circle.MidPnt.X, this.Circle.MidPnt.Y, this.Circle.Radius, 0, 2 * Math.PI);
		context.fill();
	}
	context.beginPath();
	if (this.PenColor != undefined) 
	{
		context.strokeStyle = this.PenColor;
		context.arc(this.Circle.MidPnt.X, this.Circle.MidPnt.Y, this.Circle.Radius, 0, 2 * Math.PI);
		context.stroke();
	}	
};

function SpritePic(path)
{
	this.Image = new Image();
	this.Image.src = path;
}
//Sprite.prototype.constructor = Sprite();
function SpritePart(spritepic, aarectsrc, aarectdst)
{
	this.Sprite = spritepic;
	this.RectSrc = aarectsrc;
	this.RectDst = aarectdst;
}
SpritePart.prototype = new GraphicElement();
SpritePart.prototype.constructor = SpritePart();
SpritePart.prototype.draw = function(context)
{
	context.drawImage(this.Sprite.Image, 
		this.RectSrc.P.X, this.RectSrc.P.Y, this.RectSrc.Width, this.RectSrc.Height, 
		this.RectDst.P.X, this.RectDst.P.Y, this.RectDst.Width, this.RectDst.Height);
};

function MainContext_MouseMove(e)
{
	
}
function MainContext_MouseClick(e)
{
	
}

function mouse(type, e)
{
	var a = 1 + 1;
}

init();