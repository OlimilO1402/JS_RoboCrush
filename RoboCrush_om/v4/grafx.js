/**
 * @author Oliver Meyer
 */
 
//==================   GraphicElement   ==================//
//ich glaub hier müssen wir nochmal umdenken
//idee:
//wir brauchen eine Zeichenklasse die nur fürs Zeichnen von Canvas-2d-Context zuständig ist.
//Der übergibt man die id für das Canvas-Element und sie holt sich den zugehörigen 2d-context 
//diese Klasse bringt für alle Primitiven eine bestimmte Zeichenfunktion mit.
//jede Primitive erhält ein Graphic-Element-Objekt das Stroke- und Fill-Objekte hält,
//und die zur Primitive passende Zeichenfunktion bekommt.


function GraphicElement(funcDraw, graphicObject, fillstyle, strokestyle)
{
	this.FuncDraw = funcDraw;
	this.GrObject = graphicObject;
	this.FillStyle = fillstyle;
	if (strokestyle === undefined && fillstyle === undefined) strokestyle = new Color(0,0,0); 
	this.StrokeStyle = strokestyle;
}
GraphicElement.prototype.copy = function()
{
    //return new GraphicElement(this.FillColor, this.PenColor);
};
GraphicElement.prototype.draw = function(context)
{
	
};
GraphicElement.prototype.moveDxy = function(dx, dy)
{
};
//==================   GraphicGroup   ==================//
function GraphicGroup()
{
	GraphicElement.call(this, undefined, undefined);
	this.List = new Array();
}
GraphicGroup.prototype = new GraphicElement();
GraphicGroup.prototype.constructor = GraphicGroup;
GraphicGroup.prototype.add = function(elem)
{
	this.List[this.List.length] = elem;
	return elem;
};
GraphicGroup.prototype.copy = function()
{
    var ret = new GraphicGroup();
    for (var ii = 0; ii < this.List.length; ii++)
    {
        ret.add(this.List[ii].copy());
    }
    return ret;
};
GraphicGroup.prototype.draw = function(context)
{
	for (ii = 0; ii < this.List.length; ii++)
	{
		this.List[ii].draw(context);
	}
};
GraphicGroup.prototype.moveDxy = function(dx, dy)
{
	for (ii = 0; ii < this.List.length; ii++)
	{
		this.List[ii].moveDxy(dx, dy);
	}
};

//==================   GraphicCircle   ==================//
function GraphicCircle(fillColor, penColor, circle)
{
	GraphicElement.call(this, fillColor, penColor);
	this.Circle = circle;
}
GraphicCircle.prototype = new GraphicElement();
GraphicCircle.prototype.constructor = GraphicCircle;
GraphicCircle.prototype.copy = function()
{
    return new GraphicCircle(this.FillColor, this.PenColor, this.Circle.copy());
};
GraphicCircle.prototype.draw = function(context)
{
	context.beginPath();
	if (this.FillColor != undefined) 
	{
		context.fillStyle = this.FillColor;
		context.arc(this.Circle.Center.X, this.Circle.Center.Y, this.Circle.Radius, 0, 2 * Math.PI);
		context.fill();
	}
	context.beginPath();
	if (this.PenColor != undefined) 
	{
		context.strokeStyle = this.PenColor;
		context.arc(this.Circle.Center.X, this.Circle.Center.Y, this.Circle.Radius, 0, 2 * Math.PI);
		context.stroke();
	}
};
GraphicCircle.prototype.moveDxy = function(dx, dy)
{
	this.Circle.Center.moveDxy(dx, dy);
};

//==================   GraphicPoint   ==================//
function GraphicPoint(fillColor, penColor, point)
{
	GraphicElement.call(this, fillColor, penColor);
	this.Point = point;
}
GraphicPoint.prototype = new GraphicElement();
GraphicPoint.prototype.constructor = GraphicPoint;
GraphicPoint.prototype.copy = function()
{
    return new GraphicPoint(this.FillColor, this.PenColor, this.Point.copy());
};
GraphicPoint.prototype.draw = function(context)
{
	var ccl = new Circle(this.Point, 2);
	var GCl = new GraphicCircle(this.FillColor, this.PenColor, ccl);
	GCl.draw(context);
};
GraphicPoint.prototype.moveDxy = function(dx, dy)
{
	this.Point.moveDxy(dx, dy);
};

//==================   GraphicAARect   ==================//
function GraphicAARect(fillColor, penColor, aarect)
{
	GraphicElement.call(this, fillColor, penColor);
	this.AARect = aarect;
}
GraphicAARect.prototype = new GraphicElement();
GraphicAARect.prototype.constructor = GraphicAARect;
GraphicAARect.prototype.copy = function()
{
    return new GraphicAARect(this.FillColor, this.PenColor, this.AARect.copy());
};
GraphicAARect.prototype.draw = function(context)
{
	if (this.FillColor != undefined) 
	{
		context.fillStyle = this.FillColor;
		context.fillRect(this.AARect.Point.X, this.AARect.Point.Y, this.AARect.Width, this.AARect.Height);
	}
	if (this.PenColor != undefined) 
	{
		context.strokeStyle = this.PenColor;
		context.strokeRect(this.AARect.Point.X, this.AARect.Point.Y, this.AARect.Width, this.AARect.Height);
	}
};
GraphicAARect.prototype.moveDxy = function(dx, dy)
{
	this.AARect.Point.moveDxy(dx, dy);
};
//==================   GraphicImage   ==================//
function GraphicImage(path)
{
	this.Image = new Image();
	this.Image.src = path;
}
//==================   GraphicPicture   ==================//
function GraphicPicture(graphicimage, aarectSrc, aarectDst)
{
	GraphicElement.call(this, undefined, undefined);
	this.GraphicImage = graphicimage;
	this.AARectSrc = aarectSrc;
	this.AARectDst = aarectDst;
	this.tmpctx = undefined;
}
GraphicPicture.prototype = new GraphicElement();
GraphicPicture.prototype.constructor = GraphicPicture;
GraphicPicture.prototype.copy = function()
{
    return new GraphicPicture(this.GraphicImage, this.AARectSrc.copy(), this.AARectDst.copy());
};
GraphicPicture.prototype.draw = function(context)
{
	this.tmpctx = context; //for getpixel
	context.drawImage(this.GraphicImage.Image, 
	this.AARectSrc.Point.X, this.AARectSrc.Point.Y, this.AARectSrc.Width, this.AARectSrc.Height,
	this.AARectDst.Point.X, this.AARectDst.Point.Y, this.AARectDst.Width, this.AARectDst.Height);	
};
GraphicPicture.prototype.moveDxy = function(dx, dy)
{
	this.AARectDst.Point.moveDxy(dx, dy);
};
GraphicPicture.prototype.getPixel = function(x, y)
{
	if (this.tmpctx == undefined) return null;
	return Color.fromPixel(this.tmpctx, x, y);
	//this.AARectDst.Point.moveDxy(dx, dy);
	//return Color.fromInt(this.GraphicImage.Image.)
	//context.getImageData(x, y, 1, 1)).data
	//data[0] = r
	//data[1] = g
	//data[2] = b
	//data[3] = a
	
};

//==================   GraphicText   ==================//
function GraphicFont(fontname, sizept, horalign, vertalign)
{
	this.FontName = fontname;
	this.SizePt = sizept;
	this.HorAlign = horalign;   //"left", "center", "right"
	this.VertAlign = vertalign; //"top", "middle", "bottom"
}
GraphicFont.prototype.copy = function()
{
    return new GraphicFont(this.FontName, this.SizePt, this.HorAlign, this.VertAlign);
};
GraphicFont.prototype.draw = function(context)
{
	context.font = this.SizePt + "px " + this.FontName;
	context.textAlign = this.HorAlign;
	context.textBaseline = this.VertAlign;
};
//==================   GraphicText   ==================//
function GraphicText(fillColor, penColor, text, gfont, point)
{
	GraphicElement.call(this, fillColor, penColor);
	this.Text = text;
	this.Font = gfont;
	this.Point = point;
}
GraphicText.prototype = new GraphicElement();
GraphicText.prototype.constructor = GraphicText;
GraphicText.prototype.copy = function()
{
    return new GraphicText(this.FillColor, this.PenColor, this.Text, this.Font.copy(), this.Point.copy());
};
GraphicText.prototype.draw = function(context)
{
	this.Font.draw(context);
	context.fillStyle = this.FillColor;
	context.strokeStyle = this.PenColor;
	context.fillText(this.Text, this.Point.X, this.Point.Y);
};
GraphicText.prototype.moveDxy = function(dx, dy)
{
	this.Point.moveDxy(dx, dy);
};






function Graphics2d(canvasID)
{
	var cnv = document.getElementById(canvasID);
	this.Ctx = cnv.getContext("2d");
}
Graphics2d.prototype.DrawElement = function(graphicelement)
{
	return ;
};
Graphics2d.prototype.drawCircleFill = function(circle)
{
//	if (this.FillColor != undefined) 
//	{
	this.Ctx.beginPath();
	//context.fillStyle = this.FillColor;
	this.Ctx.arc(circle.Center.X, circle.Center.Y, circle.Radius, 0, 2 * Math.PI);
	this.Ctx.fill();
//	}
//	if (this.PenColor != undefined) 
//	{
		context.strokeStyle = this.PenColor;
//	}

};
Graphics2d.prototype.drawCircleStroke = function(circle)
{
	this.Ctx.beginPath();
	this.Ctx.arc(circle.Center.X, circle.Center.Y, circle.Radius, 0, 2 * Math.PI);
	this.Ctx.stroke();
};
Graphics2d.prototype.drawPoint = function(point)
{
	this.Ctx.arc();
};

